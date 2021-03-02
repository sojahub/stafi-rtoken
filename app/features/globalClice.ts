import { createSlice } from '@reduxjs/toolkit'; 
import { AppThunk, RootState } from '../store'; 
import PolkadotServer from '@servers/polkadot/index';
import {message} from 'antd';   
import keyring from '@servers/index';
import {Symbol} from '@keyring/defaults'; 
import { createSubstrate as dotCreateSubstrate } from './rDOTClice';
import { createSubstrate as fisCreateSubstrate } from './FISClice';
import Rpc from '@util/rpc';

export enum processStatus {
  default=0,
  success = 1,
  failure = 2,
  loading=3
}
//0|1|2|4   0无状态  1成功    3失败 4加载
const polkadotServer=new PolkadotServer();
export const process={ 
  sending:{
    brocasting:processStatus.default,     // 0|1|2   0无状态  1成功    3失败
    packing:processStatus.default,        // 0|1|2   0无状态  1成功    3失败
    finalizing:processStatus.default,     // 0|1|2   0无状态  1成功    3失败
    checkTx: ""        // 
  },
  staking:{
    brocasting:processStatus.default,     // 0|1|2   0无状态  1成功    3失败
    packing:processStatus.default,        // 0|1|2   0无状态  1成功    3失败
    finalizing:processStatus.default,      // 0|1|2   0无状态  1成功    3失败
    checkTx: ""        // 
  },
  minting:{
    brocasting:processStatus.default,     // 0|1|2   0无状态  1成功    3失败
    packing:processStatus.default,        // 0|1|2   0无状态  1成功    3失败
    finalizing:processStatus.default,      // 0|1|2   0无状态  1成功    3失败
    checkTx: ""        // 
  }
}
const globalClice = createSlice({
  name: 'globalModule',
  initialState: {
    provinces: [],
    processSlider:false,
    accounts:[],
    stafiStakerApr:'',
    process:process,  
    timeOutFunc:null,
  },
  reducers: {  
    setProcessSlider(state,{payload}){
      if(payload==false && state.timeOutFunc){
        clearTimeout(state.timeOutFunc);
      }
      state.processSlider=payload
    },
    setAccounts(state,{payload}){
      state.accounts=payload;
    },
    setStafiStakerApr(state,{payload}){
      state.stafiStakerApr=payload;
    },
    initProcess(state,{payload}){
      state.process=payload;
    },
    setProcessSending(state,{payload}){
      console.log(payload)
      state.process.sending={...state.process.sending,...payload} 
    },
    setProcessStaking(state,{payload}){
      state.process.staking={...state.process.staking,...payload}
    },
    setProcessMinting(state,{payload}){
      state.process.minting={...state.process.minting,...payload}
    }, 
    setTimeOutFunc(state,{payload}){
      state.timeOutFunc=payload;
    }
  },
});
export const {
  setAccounts,setProcessSlider,setStafiStakerApr,
  setProcessSending,
  setProcessStaking,
  setProcessMinting,
  setTimeOutFunc,
  initProcess
 } = globalClice.actions;
 
export const connectPolkadotjs = (type:Symbol,cb?:Function): AppThunk=>async (dispatch, getState)=>{ 
  const accounts:any =await polkadotServer.connectPolkadotjs()  
  if(accounts){
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

export const fetchStafiStakerApr=():AppThunk=>async (dispatch, getState)=>{
  Rpc.fetchStafiStakerApr({}).then(result => {
    if (result.status == '80000') {
      if (result.data && result.data.apr) {
        const apr = result.data.apr + '%';
        dispatch(setStafiStakerApr(apr))
      }
    } 
  });
}


export const gSetTimeOut=(cb:Function,time:number):AppThunk=>(dispatch,getState)=>{
  const timeoutFunc=setTimeout(cb,time);
  dispatch(setTimeOutFunc(timeoutFunc)); 
}
export const gClearTimeOut=():AppThunk=>(dispatch,getState)=>{
  const time=getState().globalModule.timeOutFunc;
  if(time){
    clearTimeout(time);
  }
}

export default globalClice.reducer;