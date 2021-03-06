import { createSlice } from '@reduxjs/toolkit';
import { Button, message as M, message } from 'antd';
import {Route} from 'react-router-dom'
import { AppThunk, RootState } from '../store';
import stafi from '@util/SubstrateApi';
import { processStatus, setProcessSlider, setProcessSending,setProcessStaking,
  setProcessMinting,gSetTimeOut,gClearTimeOut,
initProcess,process } from './globalClice';
import {
  web3Enable,
  web3FromSource,
} from '@polkadot/extension-dapp'; 

import {stringToHex,u8aToHex} from '@polkadot/util'
import NumberUtil from '@util/numberUtil'; 
import keyring from '@servers/index';
import {Symbol} from '@keyring/defaults'; 

import { setLocalStorageItem, getLocalStorageItem, Keys } from '@util/common'



const FISClice = createSlice({
  name: 'FISModule',
  initialState: {
    fisAccounts: [],
    fisAccount: getLocalStorageItem(Keys.FisAccountKey),     //选中的fis账号,
    validPools: [{
      address: "35YDFz3yasaShG3Jb6jVk6FgMqCrPVWk2iF3cHLFTzLPgDgF"

    }, {
      address: "32FDY8ksrm1ihB7NWJ5U5dojPiwoXJtLpajytb6GvkGKURXd"
    }],
    transferrableAmountShow: "--",
    ratio: "--",   //汇率
    ratioShow: "--",
    tokenAmount:"--"
  },
  reducers: {
    setFisAccounts(state, { payload }) {
      const accounts = state.fisAccounts;
      const account = accounts.find((item: any) => {
        return item.address == payload.address;
      })
      if (account) {
        account.balance = payload.balance;
      } else {
        state.fisAccounts.push(payload)
      }
    },
    setFisAccount(state, { payload }) {
      setLocalStorageItem(Keys.FisAccountKey, payload)
      state.fisAccount = payload;
    },
    setTransferrableAmountShow(state, { payload }) {
      state.transferrableAmountShow = payload;
    },
    setRatio(state, { payload }) {
      state.ratio = payload;
    },
    setRatioShow(state,{payload}){
      state.ratioShow = payload;
    },
    setTokenAmount(state,{payload}){
      state.tokenAmount=payload
    }
  },
});

export const { setTokenAmount,
  setFisAccounts, 
  setFisAccount, 
  setTransferrableAmountShow, 
  setRatio,
  setRatioShow } = FISClice.actions;


export const reloadData=():AppThunk=>async (dispatch, getState)=>{
    const account=getState().FISModule.fisAccount;
    dispatch(createSubstrate(account));   //更新账户数据
    dispatch(balancesAll())    //更新Transferable DOT/FIS
  }
export const createSubstrate = (account: any): AppThunk => async (dispatch, getState) => {
  queryBalance(account, dispatch, getState)
}

const queryBalance = async (account: any, dispatch: any, getState: any) => {
  dispatch(setFisAccounts(account));
  let account2: any = { ...account }
  const api = await stafi.createStafiApi();
  const result = await api.query.system.account(account2.address);
  if (result) {
    let fisFreeBalance = NumberUtil.fisAmountToHuman(result.data.free);
    account2.balance = NumberUtil.handleEthAmountRound(fisFreeBalance);
  }
  const fisAccount = getState().FISModule.fisAccount;
  if (fisAccount && fisAccount.address == account2.address) {
    dispatch(setFisAccount(account2));
  }
  dispatch(setFisAccounts(account2));
}

export const transfer = (amountparam: string,cb?:Function): AppThunk => async (dispatch, getState) => {
 
  dispatch(setProcessSending({
    brocasting: processStatus.loading,
    packing:processStatus.default,
    finalizing:processStatus.default
  }));
  dispatch(setProcessSlider(true));
  const validPools = getState().FISModule.validPools;
  const address = getState().FISModule.fisAccount.address;
  const amount=NumberUtil.fisAmountToChain(amountparam)
  web3Enable(stafi.getWeb3EnalbeName());
  const injector = await web3FromSource(stafi.getPolkadotJsSource())
  const stafiApi = await stafi.createStafiApi(); 
  const ex = stafiApi.tx.balances.transferKeepAlive(validPools[0].address,amount);
  const tx=ex.hash.toHex().toString();
  dispatch(setProcessSending({ 
    checkTx: tx
  }));
  ex.signAndSend(address, { signer: injector.signer }, (result: any) => {
    try { 
      let asInBlock=""
      try{
        asInBlock = ""+result.status.asInBlock;
      }catch(e){
        //忽略异常
      }
      if (result.status.isInBlock) { 
        dispatch(setProcessSending({
          brocasting: processStatus.success,
          packing: processStatus.loading
        }));
        
        result.events
          .filter((e: any) => {
            return e.event.section == "system"
          }).forEach((data: any) => {
            if (data.event.method === 'ExtrinsicFailed') {
              const [dispatchError] = data.event.data;
              if (dispatchError.isModule) {
                try {
                  const mod = dispatchError.asModule;
                  const error = data.registry.findMetaError(new Uint8Array([mod.index.toNumber(), mod.error.toNumber()]));

                  let message: string = 'Something is wrong, please try again later!';
                  if (error.name == '') {
                    message = '';
                  }
                  message && M.info(message);
                } catch (error) {
                  M.error(error.message);
                }
              } 
              dispatch(setProcessSending({ 
                packing: processStatus.failure, 
              }));
              dispatch(reloadData());
            } else if (data.event.method === 'ExtrinsicSuccess') { 
              M.success('Successfully');
              dispatch(setProcessSending({ 
                packing: processStatus.success,
                finalizing: processStatus.loading, 
              }));
              dispatch(reloadData());
              asInBlock && dispatch(bound(address,tx,asInBlock,amount,validPools[0].address,1,cb))
              //十分钟后   finalizing失败处理 
              dispatch(gSetTimeOut(()=>{ 
                dispatch(setProcessSending({ 
                  finalizing: processStatus.failure, 
                }));
              }, 10*60*1000));
            }
          })
      } else if (result.isError) {
        M.error(result.toHuman());
      } 
      if (result.status.isFinalized) {  
        dispatch(setProcessSending({ 
          finalizing: processStatus.success
        }));   
        //finalizing 成功清除定时器
        gClearTimeOut(); 
      
      }

      
    } catch (e: any) {
      M.error(e.message)
    }
  }); 
}


export const stakingSignature=async (address:any,txHash:string)=>{ 
  const injector = await web3FromSource(stafi.getPolkadotJsSource());
  const signRaw = injector?.signer?.signRaw;
  const { signature } = await signRaw({
      address:address,
      data: txHash,
      type: 'bytes'
  }); 
  return signature
}

export const bound=(address:string,txhash:string,blockhash: string,amount: number,pooladdress:string,type:number,cb?:Function):AppThunk=>async (dispatch, getState)=>{
  //进入 staking 签名  
  dispatch(setProcessStaking({
    brocasting: processStatus.loading, 
    packing:processStatus.default,
    finalizing:processStatus.default
  }));
  const signature =await stakingSignature(address,txhash);
  const stafiApi = await stafi.createStafiApi();  
  const keyringInstance = keyring.init(Symbol.Fis); 
  let pubkey = u8aToHex(keyringInstance.decodeAddress(address));
  let poolPubkey = u8aToHex(keyringInstance.decodeAddress(pooladdress));
  const injector = await web3FromSource(stafi.getPolkadotJsSource())
   
  let fisAddress=getState().FISModule.fisAccount.address
  const bondResult=await stafiApi.tx.rTokenSeries.liquidityBond(pubkey, 
    signature,  
    poolPubkey,
    blockhash, 
    txhash, 
    amount.toString(), 
    type);
  const tx=bondResult.hash.toHex().toString(); 
  dispatch(setProcessStaking({
    checkTx: tx
  }));
  bondResult.signAndSend(fisAddress, { signer: injector.signer },(result:any)=>{
    try {  
      if (result.status.isInBlock) { 
        dispatch(setProcessStaking({
          brocasting: processStatus.success,
          packing: processStatus.loading, 
        }));
        
        result.events
          .filter((e: any) => {
            return e.event.section == "system"
          }).forEach((data: any) => { 
            if (data.event.method === 'ExtrinsicFailed') {
              const [dispatchError] = data.event.data;
              if (dispatchError.isModule) {
                try {
                  const mod = dispatchError.asModule;
                  const error = data.registry.findMetaError(new Uint8Array([mod.index.toNumber(), mod.error.toNumber()]));

                  let message: string = 'Something is wrong, please try again later!';
                  if (error.name == '') {
                    message = '';
                  }
                  message && M.info(message);
                } catch (error) {
                  M.error(error.message);
                }
              } 
              dispatch(setProcessStaking({ 
                packing: processStatus.failure, 
              }));
              cb && cb("failure");
              dispatch(reloadData());
            } else if (data.event.method === 'ExtrinsicSuccess') { 
              M.success('Successfully');
              dispatch(setProcessStaking({ 
                packing: processStatus.success,
                finalizing: processStatus.loading, 
              }));
              dispatch(getMinting(type,txhash,blockhash,cb));
              //十分钟后   finalizing失败处理 
              dispatch(gSetTimeOut(()=>{ 
                dispatch(setProcessStaking({ 
                  finalizing: processStatus.failure, 
                }));
              }, 10*60*1000));
              dispatch(reloadData());
            }
          })
      } else if (result.isError) {
        M.error(result.toHuman());
      } 
      if (result.status.isFinalized) {  
        dispatch(setProcessStaking({ 
          finalizing: processStatus.success
        }));   
        //finalizing 成功清除定时器
        gClearTimeOut(); 
      
      } 
    } catch (e: any) {
      M.error(e.message)
    }
  }) 
}

export const balancesAll = (): AppThunk => async (dispatch, getState) => {
  const api = await stafi.createStafiApi();
  const address = getState().FISModule.fisAccount.address;
  const result = await api.derive.balances.all(address);
  if (result) {
    const transferrableAmount = NumberUtil.fisAmountToHuman(result.availableBalance);
    const transferrableAmountShow = NumberUtil.handleFisAmountToFixed(transferrableAmount);
    dispatch(setTransferrableAmountShow(transferrableAmountShow));
  }
}


export const rTokenRate = (type:number): AppThunk => async (dispatch, getState) => {
  const api = await stafi.createStafiApi();
  const result = await api.query.rTokenRate.rate(type);   //1代表DOT    0代表FIS
  let ratio = NumberUtil.fisAmountToHuman(result.toJSON());
  if(!ratio){
    ratio=1;
  } 
  dispatch(setRatio(ratio))
  let count = 0;
  let totalCount = 10;
  let ratioAmount = 0;
  let piece = ratio / totalCount;
  
  let interval = setInterval(() => {
    count++; 
    ratioAmount += piece;
    if (count == totalCount) {
      ratioAmount = ratio;
      window.clearInterval(interval);
    } 
    dispatch(setRatioShow(NumberUtil.handleFisAmountRateToFixed(ratioAmount)))
  }, 100); 
}

export const getBlock=(blockHash:string,txHash:string,type:number,cb?:Function):AppThunk=>async (dispatch,getState)=>{
  
  try{ 
  const api = await stafi.createStafiApi();
  const address = getState().FISModule.fisAccount.address;
  const validPools = getState().FISModule.validPools;
  const result = await api.rpc.chain.getBlock(blockHash);
  let u=false;
  result.block.extrinsics.forEach((ex:any) => {
    if (ex.hash.toHex() == txHash) {
     
      const { method: { args, method, section } } = ex; 
      if (section == 'balances' && (method == 'transfer' || method == 'transferKeepAlive')) {
        u=true;
        let amount = args[1].toJSON();
        dispatch(setProcessSlider(true));
        dispatch(initProcess({...process,sending:{
          packing:processStatus.success,
          brocasting:processStatus.success,
          finalizing:processStatus.success,
        }}))  
        bound(address,txHash,blockHash,amount,validPools[0].address,type);
      }
    }
  });

  if(!u){
    message.error("No results were found");
  }
}catch(e:any){
  message.error(e.message)
}
}


export const getMinting=(type:number,txHash:string,blockHash:string,cb?:Function):AppThunk=>async (dispatch, getState)=>{
  dispatch(setProcessMinting({ 
    brocasting: processStatus.loading
  }));  
  let bondSuccessParamArr = [];
  bondSuccessParamArr.push(type);
  bondSuccessParamArr.push(blockHash);
  bondSuccessParamArr.push(txHash);
  const stafiApi = await stafi.createStafiApi(); 
  stafiApi.query.rTokenSeries.bondSuccess(bondSuccessParamArr).then((result:any) => { 
    let isSuccess = result.toJSON();  
    if(isSuccess){
      dispatch(setProcessMinting({ 
        brocasting: processStatus.success
      }));  
      cb && cb();
    }else if(isSuccess===false){
      dispatch(setProcessMinting({ 
        brocasting: processStatus.failure
      })); 
    }
    // isSuccess为null，代表结果还未知；isSuccess为false代表失败；isSuccess为true则代表minting成功
  });
}

export const query_rBalances_account=():AppThunk=>async (dispatch,getState)=>{
  const address = getState().FISModule.fisAccount.address; // 当前用户的FIS账号
  const stafiApi = await stafi.createStafiApi();
  const accountData = await  stafiApi.query.rBalances.account(0, address);
  let data = accountData.toJSON(); 
  if (data == null) {
    dispatch(setTokenAmount(NumberUtil.handleFisAmountToFixed(0))) 
  } else { 
    dispatch(setTokenAmount(NumberUtil.fisAmountToHuman(data.free))) 
  } 
} 

 
 
export const fisUnbond=(amount:string,rSymbol:number,recipient:string,selectedPool:string,cb?:Function):AppThunk=>async (dispatch,getState)=>{
  try{
    // let rSymbol = 1;
    // const recipient=getState().rDOTModule.dotAccount.address;
    const address=getState().FISModule.fisAccount.address; 
    // let selectedPool =getState().rDOTModule.validPools[0].address;
 
    const stafiApi = await stafi.createStafiApi();
    web3Enable(stafi.getWeb3EnalbeName());
    const injector =await web3FromSource(stafi.getPolkadotJsSource()) 

    const api=stafiApi.tx.rTokenSeries.liquidityUnbond(rSymbol, selectedPool, NumberUtil.fisAmountToChain(amount).toString(), recipient);

    api.signAndSend(address, { signer: injector.signer }, (result:any) => {
 
      if (result.status.isInBlock){
        result.events
        .filter((e:any) => {
          return e.event.section=="system"
        }).forEach((data:any) => {  
          if (data.event.method === 'ExtrinsicSuccess') { 
            // dispatch(reloadData());
            cb && cb("Success");
            message.success("Unbond successfully, you can withdraw your unbonded DOT 29 days later.")
          }else if(data.event.method === 'ExtrinsicFailed'){
            // dispatch(reloadData());
            cb && cb("Failed");
            message.error("Unbond failure")
          }
        }) 
      }
    });
  }catch(e:any){
    message.error("Unbond failure")
  }
}
  
export default FISClice.reducer;