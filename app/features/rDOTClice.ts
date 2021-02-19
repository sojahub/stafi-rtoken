import { createSlice } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../store'; 
import PolkadotServer from '@servers/polkadot/index';
import {message} from 'antd';
import NumberUtil from '@util/numberUtil';   
const rDOTClice = createSlice({
  name: 'rDOTModule',
  initialState: { 
    accounts:[],

  },
  reducers: {  
    setAccounts(state,{payload}){
      const accounts=state.accounts;
      const account=accounts.find((item:any)=>{
        return item.address==payload.address;
      })
      if(account){
        account.balance=payload.balance;
      }else{
        state.accounts.push(payload)
      } 
    }
  },
});
const polkadotServer=new PolkadotServer();
export const { setAccounts } = rDOTClice.actions;
 
export const connectPolkadotjs = (cb?:Function): AppThunk=>async (dispatch, getState)=>{ 
   const accounts:any =await polkadotServer.connectPolkadotjs();  
   if(accounts==false ||  accounts && accounts.length==0){
      message.error("请安装波卡扩展");
      return;
   }else{
    const newAccounts=accounts.map((element:any)=>{
      return {  
        name: element.meta.name,
        address: element.address,
        balance: '--'
      }
    })  
    dispatch(createSubstrate(newAccounts))
    cb && cb();
  }
}

export const createSubstrate = (accountList:any[],cb?:Function): AppThunk=>async (dispatch, getState)=>{
      accountList.forEach((account:any,index) => {  
        dispatch(setAccounts(account));
        queryBalance(account,dispatch)
      });
}

const queryBalance=async (account:any,dispatch:any, getState?:any)=>{
  let account2:any= {...account}
  const api= await polkadotServer.createSubstrateApi();
  const result = await  api.query.system.account(account2.address); 
  if (result) {
    let fisFreeBalance = NumberUtil.fisAmountToHuman(result.data.free);
    account2.balance = NumberUtil.handleFisAmountToFixed(fisFreeBalance);
  } 
  dispatch(setAccounts(account2));
}
export default rDOTClice.reducer;