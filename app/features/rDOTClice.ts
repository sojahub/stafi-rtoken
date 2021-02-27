import { createSlice } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../store'; 
import PolkadotServer from '@servers/polkadot/index';
import Stafi from '@servers/stafi/index';
import {message as M} from 'antd';   
import {setLocalStorageItem,getLocalStorageItem,Keys} from '@util/common'
 

import { processStatus, setProcessSlider, setProcessSending,setProcessStaking,setProcessMinting,gSetTimeOut,gClearTimeOut } from './globalClice';
import {
  web3Enable,
  web3FromSource,
} from '@polkadot/extension-dapp';

import {stringToHex,u8aToHex} from '@polkadot/util'
import NumberUtil from '@util/numberUtil'; 
import keyring from '@servers/index';
import {Symbol} from '@keyring/defaults';
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
    transferrableAmountShow:0,
    ratio:0
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
    }
  },
});
const polkadotServer=new PolkadotServer();
const stafiServer=new Stafi();
export const { setDotAccounts,setDotAccount,setTransferrableAmountShow,setRatio } = rDOTClice.actions;
 
 

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

export const  transfer=(amount:string):AppThunk=>async (dispatch, getState)=>{ 
  dispatch(setProcessSlider(true));
  const validPools=getState().rDOTModule.validPools;
  const address=getState().rDOTModule.dotAccount.address; 
  web3Enable(stafiServer.getWeb3EnalbeName());
  const injector =await web3FromSource(stafiServer.getPolkadotJsSource()) 

  const dotApi=await polkadotServer.createPolkadotApi();
  console.log(address,"Accountaddress")
  console.log(injector,"injector")
  console.log(stafiServer.getWeb3EnalbeName(),"stafiServer.getWeb3EnalbeName()")
  console.log(validPools[0].address,"==========validPools[0].address");
  console.log(NumberUtil.fisAmountToChain(amount).toString(),"=======NumberUtil.fisAmountToChain(amount)")
  const ex = dotApi.tx.balances.transfer(validPools[0].address,NumberUtil.fisAmountToChain(amount).toString());
  const tx=ex.hash.toHex().toString();
  console.log(tx,"=========tx")
  dispatch(setProcessSending({
    brocasting: processStatus.loading,
    packing: processStatus.default,
    finalizing: processStatus.default,
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
      console.log(asInBlock,"++++++++asInBlock")
        if (result.status.isInBlock) {
          dispatch(setProcessSending({
            brocasting: processStatus.success,
            packing: processStatus.loading,
            finalizing: processStatus.default,
            checkTx: tx
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
                  dispatch(setProcessSending({
                    brocasting: processStatus.success,
                    packing: processStatus.failure,
                    finalizing: processStatus.default,
                    checkTx: tx
                  }));
                }else if (data.event.method === 'ExtrinsicSuccess') {
                  M.success('Successfully');
                  dispatch(setProcessSending({
                    brocasting: processStatus.success,
                    packing: processStatus.success,
                    finalizing: processStatus.loading,
                    checkTx: tx
                  }));
                  //十分钟后   finalizing失败处理 
                  dispatch(gSetTimeOut(()=>{
                    console.log("asdfasdf")
                    dispatch(setProcessSending({
                      brocasting: processStatus.success,
                      packing: processStatus.success,
                      finalizing: processStatus.failure,
                      checkTx: tx 
                    }));
                  }, 10*60*1000));
                  asInBlock && dispatch(bound(address,tx,asInBlock,amount,validPools[0].address))
                 
                } 
            })

            console.log(result.status.isFinalized)
             if (result.status.isFinalized) {  
                  dispatch(setProcessSending({
                    brocasting: processStatus.success,
                    packing: processStatus.success,
                    finalizing: processStatus.success,
                    checkTx: tx
                  })); 
                  dispatch(setProcessStaking({
                    brocasting: processStatus.loading,
                    packing: processStatus.default,
                    finalizing: processStatus.default,
                    checkTx: tx
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
  console.log(result,"======balancesAllbalancesAll")
  if (result) {  
   const transferrableAmount = NumberUtil.fisAmountToHuman(result.availableBalance); 
   const transferrableAmountShow = NumberUtil.handleFisAmountToFixed(transferrableAmount);
   dispatch(setTransferrableAmountShow(transferrableAmountShow));
  }
}

 
 


export default rDOTClice.reducer;