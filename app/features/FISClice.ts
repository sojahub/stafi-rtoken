import { createSlice } from '@reduxjs/toolkit';
import { Button, message as M, message } from 'antd';
import { AppThunk, RootState } from '../store';
import Stafi from '@servers/stafi/index';
import {timeout} from '@util/common';
import {
  processStatus, setProcessSlider, setProcessSending, setProcessStaking,
  setProcessMinting, gSetTimeOut, gClearTimeOut,
  initProcess, process,setLoading,setProcessType
} from './globalClice';
import {
  web3Enable,
  web3FromSource,
} from '@polkadot/extension-dapp';

import { stringToHex, u8aToHex } from '@polkadot/util'
import NumberUtil from '@util/numberUtil';
import keyring from '@servers/index';
import { Symbol,rSymbol } from '@keyring/defaults';
import CommonClice from './commonClice'

import { setLocalStorageItem, getLocalStorageItem, Keys, removeLocalStorageItem } from '@util/common'



const FISClice = createSlice({
  name: 'FISModule',
  initialState: {
    fisAccounts: [],
    fisAccount: getLocalStorageItem(Keys.FisAccountKey)&&{...getLocalStorageItem(Keys.FisAccountKey),balance:"--"},
    validPools: [],
    poolLimit: 0,
    transferrableAmountShow: "--",
    processParameter: null,
    stakeHash: getLocalStorageItem(Keys.FisStakeHash),
    ratio: "--",
    ratioShow: "--",
    tokenAmount: "--",
    estimateBondTxFees: 10000000000,
    estimateUnBondTxFees: 10000000000,
    bondSwitch: true,
    unbondCommission:"--", 
    totalIssuance:"--",
  },
  reducers: {
    setFisAccounts(state, { payload }) {
      const accounts = state.fisAccounts;
      const account = accounts.find((item: any) => {
        return item.address == payload.address;
      })
      if (account) {
        account.balance = payload.balance;
        account.name = payload.name;
      } else {
        state.fisAccounts.push(payload)
      }
    },
    setFisAccount(state, { payload }) { 
      if(payload){
        setLocalStorageItem(Keys.FisAccountKey, { address: payload.address})
      }
      state.fisAccount = payload;
    },
    setTransferrableAmountShow(state, { payload }) {
      state.transferrableAmountShow = payload;
    },
    setRatio(state, { payload }) {
      state.ratio = payload;
    },
    setRatioShow(state, { payload }) {
      state.ratioShow = payload;
    },
    setTokenAmount(state, { payload }) {
      state.tokenAmount = payload
    },
    setPoolLimit(state, { payload }) {
      state.poolLimit = payload;
    },
    setValidPools(state, { payload }) {
      if (payload == null) {
        state.validPools = []
      } else {
        state.validPools.push(payload)
      }
    },
    setStakeHash(state, { payload }) {
      if (payload == null) {
        removeLocalStorageItem(Keys.FisStakeHash)
        state.stakeHash = payload
      } else {
        let param = { ...state.processParameter, ...payload }
        setLocalStorageItem(Keys.FisStakeHash, param),
          state.stakeHash = payload;
      }
    },
    setProcessParameter(state, { payload }) {
      if (payload == null) {
        // removeLocalStorageItem(Keys.DotProcessParameter)
        state.processParameter = payload
      } else {
        let param = { ...state.processParameter, ...payload }
        // setLocalStorageItem(Keys.DotProcessParameter,param),
        state.processParameter = param;
      }
    },
    setBondSwitch(state,{payload}){
      state.bondSwitch=payload
    },
    setUnbondCommission(state,{payload}){
      state.unbondCommission=payload;
    },
     
    setTotalIssuance(state,{payload}){
      state.totalIssuance=payload;
    }
  },
});

const stafiServer = new Stafi();
const commonClice=new CommonClice();
export const { setTokenAmount,
  setFisAccounts,
  setFisAccount,
  setTransferrableAmountShow,
  setRatio,
  setRatioShow,
  setValidPools,
  setPoolLimit,
  setProcessParameter,
  setStakeHash,
  setBondSwitch,
  setUnbondCommission, 
  setTotalIssuance } = FISClice.actions;


export const reloadData = (): AppThunk => async (dispatch, getState) => {
  const account = getState().FISModule.fisAccount;
  if(account){
    dispatch(createSubstrate(account));
  }
  // Update Transferable DOT/FIS
  dispatch(query_rBalances_account());
  dispatch(balancesAll());
  dispatch(getTotalIssuance());
}
export const createSubstrate = (account: any): AppThunk => async (dispatch, getState) => { 
  queryBalance(account, dispatch, getState)
}

const queryBalance = async (account: any, dispatch: any, getState: any) => {
  dispatch(setFisAccounts(account));
  let account2: any = { ...account }
  const api = await stafiServer.createStafiApi();
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

export const transfer = (amountparam: string, cb?: Function): AppThunk => async (dispatch, getState) => {

  dispatch(setProcessSending({
    brocasting: processStatus.loading,
    packing: processStatus.default,
    finalizing: processStatus.default
  }));
  dispatch(setProcessSlider(true));
  const validPools = getState().FISModule.validPools;
  const poolLimit = getState().FISModule.poolLimit;
  const address = getState().FISModule.fisAccount.address;
  const amount = NumberUtil.fisAmountToChain(amountparam);
  web3Enable(stafiServer.getWeb3EnalbeName());
  const injector = await web3FromSource(stafiServer.getPolkadotJsSource())
  
  
  const stafiApi = await stafiServer.createStafiApi();

  const selectedPool =commonClice.getPool(amountparam, validPools, poolLimit);
  if (selectedPool == null) { 
    return;
  }
  const ex = stafiApi.tx.balances.transferKeepAlive(selectedPool, amount);



  ex.signAndSend(address, { signer: injector.signer }, (result: any) => {
    const tx = ex.hash.toHex()
    try {
      let asInBlock = ""
      try {
        asInBlock = "" + result.status.asInBlock;
      } catch (e) {
        // do nothing
      }
      if (asInBlock) {
        dispatch(setProcessParameter({
          sending: {
            amount: amount,
            txHash: tx,
            blockHash: asInBlock,
            address
          },
          href: cb ? "/rDOT/staker/info" : null
        }))
        dispatch(setStakeHash({
          txHash: tx,
          blockHash: asInBlock,
        }))
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
              dispatch(setProcessSending({
                packing: processStatus.success,
                finalizing: processStatus.loading,
              }));
              dispatch(reloadData());
              dispatch(setProcessParameter({
                staking: {
                  amount: amount,
                  txHash: tx,
                  blockHash: asInBlock,
                  address,
                  type: rSymbol.Fis,
                  poolAddress: selectedPool
                }
              }))
              asInBlock && dispatch(bound(address, tx, asInBlock, amount, selectedPool, rSymbol.Fis, (r: any) => {
                dispatch(setStakeHash(null));
                if (r != "failure") {
                  cb && cb();
                }
              }))
              // Wait ten minutes 
              dispatch(gSetTimeOut(() => {
                dispatch(setProcessSending({
                  finalizing: processStatus.failure,
                }));
              }, 10 * 60 * 1000));
            }
          })
      } else if (result.isError) {
        M.error(result.toHuman());
      }
      if (result.status.isFinalized) {
        dispatch(setProcessSending({
          finalizing: processStatus.success
        }));
        // clear
        gClearTimeOut();

      }


    } catch (e: any) {
      M.error(e.message)
    }
  }) 
}


export const stakingSignature = async (address: any, txHash: string) => {
  message.info("Sending succeeded, proceeding signature.");
  await timeout(5000);
  web3Enable(stafiServer.getWeb3EnalbeName());
  const injector = await web3FromSource(stafiServer.getPolkadotJsSource());
  const signRaw = injector?.signer?.signRaw;
  const { signature } = await signRaw({
    address: address,
    data: txHash,
    type: 'bytes'
  });
  return signature
}

export const bound = (address: string, txhash: string, blockhash: string, amount: number, pooladdress: string, type: number, cb?: Function): AppThunk => async (dispatch, getState) => {
  try{
   

    let fisAddress = getState().FISModule.fisAccount.address;
    const keyringInstance = keyring.init(Symbol.Fis);
    const signature = await stakingSignature(address, u8aToHex(keyringInstance.decodeAddress(fisAddress)));
    const stafiApi = await stafiServer.createStafiApi();
    let pubkey = u8aToHex(keyringInstance.decodeAddress(address));
    let poolPubkey = u8aToHex(keyringInstance.decodeAddress(pooladdress));
      
    
    web3Enable(stafiServer.getWeb3EnalbeName());

    message.info("Signature succeeded, proceeding staking.");
    await timeout(5000);
    const injector = await web3FromSource(stafiServer.getPolkadotJsSource());
    const bondResult = await stafiApi.tx.rTokenSeries.liquidityBond(pubkey,
      signature,
      poolPubkey,
      blockhash,
      txhash,
      amount.toString(),
      type); 
   
    try{ 
      let index=0;
      bondResult.signAndSend(fisAddress, { signer: injector.signer }, (result: any) => {
        if(index==0){
          dispatch(setProcessStaking({
            brocasting: processStatus.loading,
            packing: processStatus.default,
            finalizing: processStatus.default
          }));
          dispatch(setProcessType(type));
          index=index+1;
        }
        const tx = bondResult.hash.toHex()
        try {
          if (result.status.isInBlock) {
            dispatch(setProcessStaking({
              brocasting: processStatus.success,
              packing: processStatus.loading,
              checkTx: tx
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
                  dispatch(setProcessStaking({
                    packing: processStatus.success,
                    finalizing: processStatus.loading,
                  })); 
                  // cb && cb("loading");
                  dispatch(getMinting(type, txhash, blockhash, cb));
                  // dispatch(gSetTimeOut(() => {
                  //   dispatch(setProcessStaking({
                  //     finalizing: processStatus.failure,
                  //   }));
                  // }, 10 * 60 * 1000));
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
            // cb && cb("loading");
            // gClearTimeOut();

          }
        } catch (e: any) {
          M.error(e.message)
        }
      }).catch ((e:any)=>{ 
        dispatch(setLoading(false));
        if(e=="Error: Cancelled"){
          message.error("Cancelled");
          dispatch(setProcessStaking({
            brocasting: processStatus.failure
          }));
          cb && cb("failure");
        }else{
          console.error(e)
        } 
      })
      
    }catch(e){
      console.error("signAndSend error:",e)
    }
  }catch(e){ 
    dispatch(setLoading(false));
    if(e=="Error: Cancelled"){
      message.error("Cancelled");
      dispatch(setProcessStaking({
        brocasting: processStatus.failure
      }));
      cb && cb("failure");
    }else{
      console.error(e)
    } 
  }
}

export const balancesAll = (): AppThunk => async (dispatch, getState) => {
  const api = await stafiServer.createStafiApi();
  const address = getState().FISModule.fisAccount.address;
  const result = await api.derive.balances.all(address);
  if (result) {
    const transferrableAmount = NumberUtil.fisAmountToHuman(result.availableBalance);
    const transferrableAmountShow = NumberUtil.handleFisAmountToFixed(transferrableAmount);
    dispatch(setTransferrableAmountShow(transferrableAmountShow));
  }
}


export const rTokenRate = (): AppThunk => async (dispatch, getState) => {
  const api = await stafiServer.createStafiApi();
  const result = await api.query.rTokenRate.rate(rSymbol.Fis);
  let ratio = NumberUtil.fisAmountToHuman(result.toJSON());
  if (!ratio) {
    ratio = 1;
  }
  dispatch(setRatio(ratio)) 
}
export const continueProcess=():AppThunk=>async (dispatch,getState)=>{ 
  const stakeHash=getState().FISModule.stakeHash;
  if(stakeHash && stakeHash.blockHash && stakeHash.txHash){
    dispatch(getBlock(stakeHash.blockHash,stakeHash.txHash))
  }
}
export const getBlock = (blockHash: string, txHash: string, cb?: Function): AppThunk => async (dispatch, getState) => {
  try {
    const api = await stafiServer.createStafiApi();
    const address = getState().FISModule.fisAccount.address;
    const validPools = getState().FISModule.validPools;
    const poolLimit = getState().FISModule.poolLimit;
    const result = await api.rpc.chain.getBlock(blockHash); 
    let u = false;
    result.block.extrinsics.forEach((ex: any) => {
      if (ex.hash.toHex() == txHash) {

        const { method: { args, method, section } } = ex;
        if (section == 'balances' && (method == 'transfer' || method == 'transferKeepAlive')) {
          u = true;
          let amount = args[1].toJSON();
          let selectedPool =commonClice.getPool(amount, validPools, poolLimit);
          if (selectedPool==null){
            return;
          }
          dispatch(initProcess({
            sending: {
              packing: processStatus.success,
              brocasting: processStatus.success,
              finalizing: processStatus.success,
            }
          }))
          dispatch(setProcessSlider(true));
          dispatch(setProcessParameter({
            staking: {
              amount: amount,
              txHash,
              blockHash,
              address,
              type: rSymbol.Fis,
              poolAddress: selectedPool
            }
          })) 
          bound(address, txHash, blockHash, amount, selectedPool, 0);
        }
      }
    });

    if (!u) {
      message.error("No results were found");
    }
  } catch (e: any) {
    message.error(e.message)
  }
}


export const getMinting = (type: number, txHash: string, blockHash: string, cb?: Function): AppThunk => async (dispatch, getState) => {

  dispatch(setProcessMinting({
    brocasting: processStatus.loading
  }));
  let bondSuccessParamArr:any[] = [];
  bondSuccessParamArr.push(blockHash);
  bondSuccessParamArr.push(txHash);
  let statusObj={
    num:0
  }
  dispatch(rTokenSeries_bondStates(type, bondSuccessParamArr,statusObj,(e:any)=>{
    if(e=="successful"){
      message.success("minting succeeded",3,()=>{ 
        cb && cb(e);
      }); 
    }else{
      cb && cb(e);
    }
  }));
} 

export const rTokenSeries_bondStates=(type: number, bondSuccessParamArr:any,statusObj:any,cb?:Function): AppThunk => async (dispatch, getState)=>{
  statusObj.num=statusObj.num+1; 
  const stafiApi = await stafiServer.createStafiApi();
  const result= await stafiApi.query.rTokenSeries.bondStates(type, bondSuccessParamArr) 
  let bondState = result.toJSON();    
  if (bondState=="Success") {
    dispatch(setProcessMinting({
      brocasting: processStatus.success
    }));
    
    cb && cb("successful");
  } else if (bondState == "Fail") { 
    dispatch(setProcessMinting({
      brocasting: processStatus.failure
    }));
    cb && cb("failure");
  } else if(bondState == null){
    cb && cb('stakingFailure');
  }else if(statusObj.num<=40){  
    cb && cb("padding");
    setTimeout(()=>{ 
      dispatch(rTokenSeries_bondStates(type, bondSuccessParamArr,statusObj,cb))
    }, 15000); 
  }else{
    dispatch(setProcessMinting({
      brocasting: processStatus.failure
    }));
    cb && cb("failure");
  } 
}

 
export const query_rBalances_account = (): AppThunk => async (dispatch, getState) => {
  commonClice.query_rBalances_account(getState().FISModule.fisAccount,rSymbol.Fis,(data:any)=>{
    if (data == null) {
      dispatch(setTokenAmount(NumberUtil.handleFisAmountToFixed(0)))
    } else {
      dispatch(setTokenAmount(NumberUtil.fisAmountToHuman(data.free)))
    }
  })
}

export const unbond=(amount:string,cb?:Function):AppThunk=>async (dispatch,getState)=>{
  const recipient=getState().FISModule.fisAccount.address;
  const validPools=getState().FISModule.validPools;
  const poolLimit = getState().FISModule.poolLimit;
  let selectedPool =commonClice.getPoolForUnbond(amount,validPools,rSymbol.Fis);
  if (selectedPool == null) { 
    cb && cb();
    return;
  } 
  fisUnbond(amount,rSymbol.Fis,recipient,selectedPool,"Unbond successfully, you can withdraw your unbonded FIS 29 days later.",()=>{
    dispatch(reloadData());
  }) 
}

export const fisUnbond = (amount: string, rSymbol: number, recipient: string, selectedPool: string,topstr:string, cb?: Function): AppThunk => async (dispatch, getState) => {
  
  try { 
    const address = getState().FISModule.fisAccount.address; 
    const stafiApi = await stafiServer.createStafiApi();
    web3Enable(stafiServer.getWeb3EnalbeName());
    
    const injector = await web3FromSource(stafiServer.getPolkadotJsSource())
  
  
    const api =await stafiApi.tx.rTokenSeries.liquidityUnbond(rSymbol, selectedPool, NumberUtil.fisAmountToChain(amount).toString(), recipient);

      api.signAndSend(address, { signer: injector.signer }, (result: any) => {
        try{ 
          if (result.status.isInBlock) {
            result.events
              .filter((e: any) => {
                return e.event.section == "system"
              }).forEach((data: any) => {
                if (data.event.method === 'ExtrinsicSuccess') {
                  dispatch(reloadData());
                  cb && cb("Success");
                  message.success(topstr)
                } else if (data.event.method === 'ExtrinsicFailed') {
                  dispatch(reloadData());
                  cb && cb("Failed");
                  message.error("Unbond failure")
                }
              })
          }
        }catch(e){ 
          cb && cb("Failed");
        }
      }).catch ((e:any)=>{ 
        dispatch(setLoading(false));
        if(e=="Error: Cancelled"){
          message.error("Cancelled"); 
          cb && cb("Failed");
        }else{
          console.error(e);
        }
      })
  
  } catch (e: any) {
    message.error("Unbond failure"); 
    cb && cb("Failed");
  }
}





export const bondSwitch=():AppThunk=>async (dispatch, getState)=>{
  const stafiApi = await stafiServer.createStafiApi();
  const result=await stafiApi.query.rTokenSeries.bondSwitch(); 
  dispatch(setBondSwitch(result.toJSON()))
}
export const getUnbondCommission=():AppThunk=>async (dispatch, getState)=>{
  const stafiApi = await stafiServer.createStafiApi();
  const result=await stafiApi.query.rTokenSeries.unbondCommission();
  const unbondCommission = NumberUtil.fisFeeToHuman(result.toJSON());
 
  dispatch(setUnbondCommission(unbondCommission));
  //const unbondCommissionShow = NumberUtil.fisFeeToFixed(this.unbondCommission) + '%';
}

 
export default FISClice.reducer;



 



 
 
export const getTotalIssuance=():AppThunk=>async (dispatch, getState)=>{
  const result=await commonClice.getTotalIssuance(rSymbol.Fis);
  dispatch(setTotalIssuance(result))
}
export const checkAddress=(stafiAddress:string)=>{
  const keyringInstance = keyring.init('fis');
  return keyringInstance.checkAddress(stafiAddress);
}

