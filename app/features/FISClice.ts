import { createSlice } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../store'; 
import PolkadotServer from '@servers/polkadot/index'; 
import NumberUtil from '@util/numberUtil';   
import {setLocalStorageItem,getLocalStorageItem,Keys} from '@util/common'

const FISClice = createSlice({
  name: 'FISModule',
  initialState: {   
    fisAccounts:[], 
    fisAccount:getLocalStorageItem(Keys.FisAccountKey),     //选中的fis账号,
    validPools:[{
      address:"35YDFz3yasaShG3Jb6jVk6FgMqCrPVWk2iF3cHLFTzLPgDgF"
      
    },{
      address:"32FDY8ksrm1ihB7NWJ5U5dojPiwoXJtLpajytb6GvkGKURXd"
    }]
  },
  reducers: {   
    setFisAccounts(state,{payload}){
      const accounts=state.fisAccounts;
      const account=accounts.find((item:any)=>{
        return item.address==payload.address;
      })
      if(account){
        account.balance=payload.balance;
      }else{
        state.fisAccounts.push(payload)
      } 
    },  
    setFisAccount(state,{payload}){
      setLocalStorageItem(Keys.FisAccountKey,payload)
      state.fisAccount=payload;
    },
  },
});
const polkadotServer=new PolkadotServer();
export const { setFisAccounts,setFisAccount } = FISClice.actions; 

export const createSubstrate = (account:any): AppThunk=>async (dispatch, getState)=>{ 
      queryBalance(account,dispatch)
}

const queryBalance=async (account:any,dispatch:any)=>{
  let account2:any= {...account}
  const api= await polkadotServer.createSubstrateApi();
  const result = await  api.query.system.account(account2.address); 
  if (result) {
    let fisFreeBalance = NumberUtil.fisAmountToHuman(result.data.free);
    account2.balance = NumberUtil.handleEthAmountRound(fisFreeBalance);
  } 
  dispatch(setFisAccounts(account2));
}

export default FISClice.reducer;