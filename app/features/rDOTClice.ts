import { createSlice } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../store'; 
import PolkadotServer from '@servers/polkadot/index';
import Stafi from '@servers/stafi/index';
import {message as M, message} from 'antd';    
 
import {setLocalStorageItem,getLocalStorageItem,removeLocalStorageItem,Keys} from '@util/common'
 

import { processStatus, setProcessSlider, setProcessSending,setProcessStaking,setProcessMinting,gSetTimeOut,gClearTimeOut,initProcess } from './globalClice';
import {
  web3Enable,
  web3FromSource,
} from '@polkadot/extension-dapp'; 
import NumberUtil from '@util/numberUtil';  
import {bound} from './FISClice' 



const rDOTClice = createSlice({
  name: 'rDOTModule',
  initialState: {  
    dotAccounts:[], 
    dotAccount:getLocalStorageItem(Keys.DotAccountKey),    //选中的账号 
    validPools:[{
      address: "15T6mxJVnJTUoSQZdCXNeKCNTLDMg2jXQ5rSjcEbQ37c5xhg" 
    }, {
      address: "15o269Duu45ua5x2UT92C4wBS8LyHpvLFuARJcUECtSe3m95"
    }],
    transferrableAmountShow:"--",
    ratio:"--",
    tokenAmount:"--",
    processParameter:getLocalStorageItem(Keys.DotProcessParameter),      //process参数
  },
  reducers: {  
    setDotAccounts(state,{payload}){
      const accounts=state.dotAccounts;
      const account=accounts.find((item:any)=>{
        return item.address==payload.address;
      })
      if(account){
        account.balance=payload.balance;
      }else{
        state.dotAccounts.push(payload)
      } 
    },  
    setDotAccount(state,{payload}){
      setLocalStorageItem(Keys.DotAccountKey,payload)
      state.dotAccount=payload;
    }, 
    setTransferrableAmountShow(state,{payload}){ 
      state.transferrableAmountShow=payload;
    }, 
    setRatio(state,{payload}){
      state.ratio=payload;
    },
    setTokenAmount(state,{payload}){
      state.tokenAmount=payload
    },
    setProcessParameter(state,{payload}){
      if(payload==null){
        removeLocalStorageItem(Keys.DotProcessParameter)
        state.processParameter=payload 
      }else{
        let param = {...state.processParameter,...payload}
        setLocalStorageItem(Keys.DotProcessParameter,param),
        state.processParameter=param;
      } 
    }
  },
});
const polkadotServer=new PolkadotServer();
const stafiServer=new Stafi();
export const { setDotAccounts,
  setDotAccount,
  setTransferrableAmountShow,
  setRatio,
  setTokenAmount,
  setProcessParameter } = rDOTClice.actions;
  



export const reloadData=():AppThunk=>async (dispatch, getState)=>{
  const account=getState().rDOTModule.dotAccount;
  dispatch(createSubstrate(account));   //更新账户数据
  dispatch(balancesAll())    //更新Transferable DOT/FIS
   
}
export const createSubstrate = (account:any): AppThunk=>async (dispatch, getState)=>{ 
      queryBalance(account,dispatch,getState)
}

const queryBalance=async (account:any,dispatch:any,getState:any)=>{
  dispatch(setDotAccounts(account));
  let account2:any= {...account}
  
  const api= await polkadotServer.createPolkadotApi();
  const result = await  api.query.system.account(account2.address); 
  if (result) {
    let fisFreeBalance = NumberUtil.fisAmountToHuman(result.data.free); 
    account2.balance = NumberUtil.handleEthAmountRound(fisFreeBalance);
  } 
  const dotAccount=getState().rDOTModule.dotAccount;
  if(dotAccount && dotAccount.address==account2.address){ 
    dispatch(setDotAccount(account2));
  }
  dispatch(setDotAccounts(account2));
}

export const  transfer=(amount:string,cb?:Function):AppThunk=>async (dispatch, getState)=>{ 
  dispatch(setProcessSlider(true));
  dispatch(setProcessSending({
    brocasting: processStatus.loading, 
    packing:processStatus.default,
    finalizing:processStatus.default 
  }));
  const validPools=getState().rDOTModule.validPools;
  const address=getState().rDOTModule.dotAccount.address; 
  web3Enable(stafiServer.getWeb3EnalbeName());
  const injector =await web3FromSource(stafiServer.getPolkadotJsSource()) 

  const dotApi=await polkadotServer.createPolkadotApi();
  
  const ex = dotApi.tx.balances.transfer(validPools[0].address,NumberUtil.fisAmountToChain(amount).toString());
  const tx=ex.hash.toHex().toString(); 

  
  dispatch(setProcessSending({ 
    checkTx: tx
  }));

  ex.signAndSend(address, { signer: injector.signer }, (result:any)=>{ 
    try{  
      let asInBlock=""
      try{
        asInBlock = ""+result.status.asInBlock;
      }catch(e){
        //忽略异常
      } 
      if(asInBlock){
        dispatch(setProcessParameter({sending:{
          amount:amount,
          txHash:tx,
          blockHash:asInBlock,
          address
        },
        href:cb?"/rDOT/wallet":null}))
      }
      
        if (result.status.isInBlock) {
          dispatch(setProcessSending({
            brocasting: processStatus.success,
            packing: processStatus.loading,  
          }));
          result.events
            .filter((e:any) => {
              return e.event.section=="system"
            }).forEach((data:any) => { 
                if (data.event.method === 'ExtrinsicFailed') {
                  const [dispatchError] = data.event.data;
                  if (dispatchError.isModule) {
                    try {
                      const mod = dispatchError.asModule;
                      const error = data.registry.findMetaError(new Uint8Array([mod.index.toNumber(), mod.error.toNumber()]));

                      let message:string = 'Something is wrong, please try again later!';
                      if (error.name == '') {
                        message = '';
                      } 
                      message && M.info(message);
                    } catch (error) {
                      M.error(error.message);
                    }
                  }
                  dispatch(reloadData());
                  dispatch(setProcessSending({ 
                    packing: processStatus.failure, 
                    checkTx: tx
                  }));
                }else if (data.event.method === 'ExtrinsicSuccess') {
                  M.success('Successfully');
                  dispatch(setProcessSending({  
                    packing:processStatus.success,
                    finalizing: processStatus.loading, 
                  }));
                  //十分钟后   finalizing失败处理 
                  dispatch(gSetTimeOut(()=>{ 
                    dispatch(setProcessSending({ 
                      finalizing: processStatus.failure, 
                    }));
                  }, 10*60*1000));
                  dispatch(reloadData());
                  dispatch(setProcessParameter({staking:{
                    amount:amount,
                    txHash:tx,
                    blockHash:asInBlock,
                    address,
                    type:1,
                    poolAddress:validPools[0].address
                  }}))
                  asInBlock && dispatch(bound(address,tx,asInBlock,amount,validPools[0].address,1,(r:string)=>{
                    dispatch(setProcessParameter(null));
                    if(r!="failure"){
                      cb && cb();
                    }
                  }))
                 
                } 
            })
 
             if (result.status.isFinalized) {  
                  dispatch(setProcessSending({ 
                    finalizing: processStatus.success, 
                  }));   
                  gClearTimeOut();   
                }
          }else if (result.isError) {
            M.error(result.toHuman());
          } 
        }catch(e:any){
            M.error(e.message)
        }
  });  

}
export const balancesAll=():AppThunk=>async (dispatch, getState)=>{
  const api=await polkadotServer.createPolkadotApi();
  const address=getState().rDOTModule.dotAccount.address; 
  const result =await api.derive.balances.all(address); 
  if (result) {  
   const transferrableAmount = NumberUtil.fisAmountToHuman(result.availableBalance); 
   const transferrableAmountShow = NumberUtil.handleFisAmountToFixed(transferrableAmount);
   dispatch(setTransferrableAmountShow(transferrableAmountShow));
  }
} 

 
export const query_rBalances_account=():AppThunk=>async (dispatch,getState)=>{
  const address = getState().FISModule.fisAccount.address; // 当前用户的FIS账号
  const stafiApi = await stafiServer.createStafiApi();
  const accountData = await  stafiApi.query.rBalances.account(1, address);
  let data = accountData.toJSON(); 
  if (data == null) {
    dispatch(setTokenAmount(NumberUtil.handleFisAmountToFixed(0))) 
  } else { 
    dispatch(setTokenAmount(NumberUtil.fisAmountToHuman(data.free))) 
  } 
} 

export const reSending=(cb?:Function):AppThunk=>async (dispatch,getState)=>{ 
  const processParameter=getState().rDOTModule.processParameter
  if(processParameter){ 
    const  href= processParameter.href
    dispatch(transfer(processParameter.sending.amount,()=>{
      cb && cb(href)
    }));
  }
}

export const reStaking=(cb?:Function):AppThunk=>async (dispatch,getState)=>{ 
  const processParameter=getState().rDOTModule.processParameter
  if(processParameter){
  const  staking= processParameter.staking
  const  href= processParameter.href 
  processParameter && dispatch(bound(staking.address,
    staking.txHash,
    staking.blockHash,
    staking.amount,
    staking.poolAddress,
    staking.type,
    ()=>{
      cb && cb(href)
    }
    ));
  }
 
}


export const unbond=(amount:string,cb?:Function):AppThunk=>async (dispatch,getState)=>{
  try{
    let rSymbol = 1;
    const recipient=getState().rDOTModule.dotAccount.address;
    const address=getState().FISModule.fisAccount.address; 
    let selectedPool =getState().rDOTModule.validPools[0].address;
 
    const stafiApi = await stafiServer.createStafiApi();
    web3Enable(stafiServer.getWeb3EnalbeName());
    const injector =await web3FromSource(stafiServer.getPolkadotJsSource()) 

    const api=stafiApi.tx.rTokenSeries.liquidityUnbond(rSymbol, selectedPool, NumberUtil.fisAmountToChain(amount).toString(), recipient);

    api.signAndSend(address, { signer: injector.signer }, (result:any) => {
 
      if (result.status.isInBlock){
        result.events
        .filter((e:any) => {
          return e.event.section=="system"
        }).forEach((data:any) => {  
          if (data.event.method === 'ExtrinsicSuccess') { 
            dispatch(reloadData());
            message.success("Unbond successfully, you can withdraw your unbonded DOT 29 days later.")
          }else if(data.event.method === 'ExtrinsicFailed'){
            dispatch(reloadData());
            message.error("Unbond failure")
          }
        }) 
      }
    });
  }catch(e:any){
    message.error("Unbond failure")
  }
}

export const continueProcess=():AppThunk=>async (dispatch,getState)=>{ 
  const processParameter=getState().rDOTModule.processParameter;
  if(processParameter){
    dispatch(getBlock(processParameter.sending.blockHash,processParameter.sending.txHash))
  }
}



export const getBlock=(blockHash:string,txHash:string,cb?:Function):AppThunk=>async (dispatch,getState)=>{
  
  try{ 
  const api = await polkadotServer.createPolkadotApi();
  const address=getState().rDOTModule.dotAccount.address; 
  const validPools = getState().rDOTModule.validPools;
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
        bound(address,txHash,blockHash,amount,validPools[0].address,1,()=>{
          dispatch(setProcessParameter(null));
        });
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
export default rDOTClice.reducer;