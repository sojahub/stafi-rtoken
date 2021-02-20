import { createSlice } from '@reduxjs/toolkit'; 
import { AppThunk, RootState } from '../store'; 
import PolkadotServer from '@servers/polkadot/index';
import {message} from 'antd';   
import keyring from '@servers/index';
import {Symbol} from '@keyring/defaults'; 
import { createSubstrate as dotCreateSubstrate } from './rDOTClice';
import { createSubstrate as fisCreateSubstrate } from './FISClice'


const polkadotServer=new PolkadotServer();
const globalClice = createSlice({
  name: 'globalModule',
  initialState: {
    provinces: [],
    processSlider:false,
    accounts:[]
  },
  reducers: { 
    setProcessSlider(state,{payload}){
      state.processSlider=payload
    },
    setAccounts(state,{payload}){
      state.accounts=payload;
    }
  },
});
export const { setAccounts,setProcessSlider } = globalClice.actions;
 
export const connectPolkadotjs = (type:Symbol,cb?:Function): AppThunk=>async (dispatch, getState)=>{ 
  const accounts:any =await polkadotServer.connectPolkadotjs()  
  if(accounts==false ||  accounts && accounts.length==0){
     message.error("请安装波卡扩展");
     return;
  }else{
   dispatch(setAccounts(accounts)); 
   const dotKeyringInstance=keyring.init(type);
   const accountsList=accounts.map((element:any)=>{ 
     const address= dotKeyringInstance.encodeAddress(dotKeyringInstance.decodeAddress(element.address));
     return {  
       name: element.meta.name,
       address: address,
       balance: '--'
     }
   })   
  //  dispatch(createSubstrate(dotAccounts,setDotAccounts));
  //  dispatch(createSubstrate(fisAccounts,setFisAccounts))
  console.log(accountsList,"========aaccountsList")
  accountsList.forEach((account:any) => {   
    dispatch(clice(type).createSubstrate(account));
  });
  cb && cb();
 }
}

const clice=(symbol: string)=>{ 
    switch (symbol) {
      case Symbol.Xtz: 
      case Symbol.Fis:
        return {
          createSubstrate:fisCreateSubstrate
        };
      case Symbol.Ksm: 
      case Symbol.Dot:
        return {
          createSubstrate:dotCreateSubstrate
        };
      case Symbol.Atom: 
      case Symbol.Kava: 
      case Symbol.One: 
      default: 
        return {
          createSubstrate:fisCreateSubstrate
        };
    } 
  
}

export default globalClice.reducer;