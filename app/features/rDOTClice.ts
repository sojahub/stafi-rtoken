import { createSlice } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../store'; 
import PolkadotServer from '@servers/polkadot/index';
import Stafi from '@servers/stafi/index';
import {message as M} from 'antd';
import NumberUtil from '@util/numberUtil';   
import {setLocalStorageItem,getLocalStorageItem,Keys} from '@util/common'
import {
  web3Enable,
  web3FromSource,
} from '@polkadot/extension-dapp';

const rDOTClice = createSlice({
  name: 'rDOTModule',
  initialState: {  
    dotAccounts:[], 
    dotAccount:getLocalStorageItem(Keys.DotAccountKey),    //选中的账号 
    validPools:[],
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
  
  const api= await polkadotServer.createSubstrateApi();
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
  const validPools=getState().rDOTModule.validPools;
  const address=getState().rDOTModule.dotAccount.address; 
  web3Enable(stafiServer.getWeb3EnalbeName());
  const injector =await web3FromSource(stafiServer.getPolkadotJsSource()) 


  const stafiApi=await polkadotServer.createSubstrateApi();
  stafiApi.tx.balances.transfer(validPools[0].address, amount.toString()).signAndSend(address, { signer: injector.signer }, (result:any)=>{
    try{ 
        if (result.status.isInBlock) {

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
                }else if (data.event.method === 'ExtrinsicSuccess') {
                  M.success('Successfully');
                }

            })
          }else if (result.isError) {
            M.error(result.toHuman());
          } 
        }catch(e:any){
            M.error(e.message)
        }
  });  

}
export const balancesAll=():AppThunk=>async (dispatch, getState)=>{
  const api=await polkadotServer.createSubstrateApi();
  const address=getState().rDOTModule.dotAccount.address; 
  const result =await api.derive.balances.all(address);
  if (result) {  
   const transferrableAmount = NumberUtil.fisAmountToHuman(result.availableBalance); 
   const transferrableAmountShow = NumberUtil.handleFisAmountToFixed(transferrableAmount);
   dispatch(setTransferrableAmountShow(transferrableAmountShow));
  }
}

export const rTokenRate=():AppThunk=>async (dispatch,getState)=>{
  const api=await polkadotServer.createSubstrateApi();
  const result = await api.query.rTokenRate.rate(1);   //1代表DOT    0代表FIS
  const ratio = NumberUtil.fisAmountToHuman(result.toJSON());
  dispatch(setRatio(ratio)) 
}

 

export default rDOTClice.reducer;