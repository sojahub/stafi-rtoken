import { createSlice } from '@reduxjs/toolkit'; 
import { AppThunk, RootState } from '../store'; 
import PolkadotServer from '@servers/polkadot/index';
import {message} from 'antd';   
import keyring from '@servers/index';
import {Symbol} from '@keyring/defaults'; 
import { createSubstrate as dotCreateSubstrate,reloadData as dotReloadData } from './rDOTClice';
import { createSubstrate as fisCreateSubstrate,reloadData as fisReloadData } from './FISClice';
import { createSubstrate as ksmCreateSubstrate,reloadData as ksmReloadData } from './rKSMClice';
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
    minting:processStatus.default,     // 0|1|2   0无状态  1成功    3失败 
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

    loading:false,
  },
  reducers: {  
    setProcessSlider(state,{payload}){
      // if(payload==false && state.timeOutFunc){
      //   clearTimeout(state.timeOutFunc);
      // }
      if(state.processSlider!=payload){
        state.processSlider=payload
      }
    },
    setAccounts(state,{payload}){
      state.accounts=payload;
    },
    setStafiStakerApr(state,{payload}){
      state.stafiStakerApr=payload;
    },
    initProcess(state,{payload}){
      if(payload){
        state.process={...process,...payload}; 
      }else{ 
        state.process=process;
      }
    },
    setProcessSending(state,{payload}){ 
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
    },
    setLoading(state,{payload}){
      state.loading=payload;
    }
  },
});
export const {
  setAccounts,setProcessSlider,setStafiStakerApr,
  setProcessSending,
  setProcessStaking,
  setProcessMinting,
  setTimeOutFunc,
  initProcess,
  setLoading
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
export const reloadData = (type:Symbol,cb?:Function): AppThunk=>async (dispatch, getState)=>{ 
  dispatch(clice(type).reloadData()); 
  cb && cb(); 
}
const clice=(symbol: string)=>{ 
    switch (symbol) {
      case Symbol.Xtz: 
      case Symbol.Fis:
        return {
          createSubstrate:fisCreateSubstrate,
          reloadData:fisReloadData
        };
      case Symbol.Ksm: 
        return {
          createSubstrate:ksmCreateSubstrate,
          reloadData:ksmReloadData
        };
      
      case Symbol.Dot:
        return {
          createSubstrate:dotCreateSubstrate,
          reloadData:dotReloadData
        };
      case Symbol.Atom: 
      case Symbol.Kava: 
      case Symbol.One: 
      default: 
        return {
          createSubstrate:fisCreateSubstrate,
          reloadData:fisReloadData
        };
    } 
  
}

export const fetchStafiStakerApr=(cb?:Function):AppThunk=>async (dispatch, getState)=>{
  const result= await Rpc.fetchStafiStakerApr({});
  if (result.status == '80000') {
    if (result.data && result.data.apr) {
      const apr = result.data.apr + '%';
      dispatch(setStafiStakerApr(apr))
      cb && cb();
    }
  } 
}

export const connectPolkadot=(cb?:Function):AppThunk=>async (dispatch, getState)=>{
  await dispatch(connectPolkadotjs(Symbol.Dot));
  await dispatch(connectPolkadotjs(Symbol.Fis));
  cb && cb()
}
export const connectPolkadot_ksm=(cb?:Function):AppThunk=>async (dispatch, getState)=>{
  await dispatch(connectPolkadotjs(Symbol.Ksm));
  await dispatch(connectPolkadotjs(Symbol.Fis));
  cb && cb()
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