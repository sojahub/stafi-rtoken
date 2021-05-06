import { createSlice } from '@reduxjs/toolkit'; 
import { AppThunk, RootState } from '../store'; 
import PolkadotServer from '@servers/polkadot/index';
import AtomServer from '@servers/atom/index'
import {message} from 'antd';   
import keyring from '@servers/index';
import {rSymbol, Symbol} from '@keyring/defaults';
import { u8aToHex } from '@polkadot/util'; 
import { createSubstrate as dotCreateSubstrate,reloadData as dotReloadData } from './rDOTClice';
import { createSubstrate as fisCreateSubstrate,reloadData as fisReloadData } from './FISClice';
import { createSubstrate as ksmCreateSubstrate,reloadData as ksmReloadData } from './rKSMClice';
import { createSubstrate as atomCreateSubstrate,reloadData as atomReloadData } from './rATOMClice';
import Rpc from '@util/rpc';

export enum processStatus {
  default=0,
  success = 1,
  failure = 2,
  loading=3
}
//0|1|2|4  
const polkadotServer=new PolkadotServer();

const atomServer=new AtomServer();
export const process={ 
  rSymbol:"",   
  sending:{
    brocasting:processStatus.default,     // 0|1|2|3
    packing:processStatus.default,        // 0|1|2|3
    finalizing:processStatus.default,     // 0|1|2|3
    checkTx: ""        // 
  },
  staking:{
    brocasting:processStatus.default,     // 0|1|2|3
    packing:processStatus.default,        // 0|1|2|3
    finalizing:processStatus.default,      // 0|1|2|3
    checkTx: ""        // 
  },
  minting:{
    minting:processStatus.default,     // 0|1|2|3
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
    setProcessType(state,{payload}){
      state.process.rSymbol=payload;
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
  setProcessType,
  setTimeOutFunc,
  initProcess,
  setLoading
 } = globalClice.actions;
 
export const connectPolkadotjs = (type:Symbol,cb?:Function): AppThunk=>async (dispatch, getState)=>{ 
  const accounts:any =await polkadotServer.connectPolkadotjs()   
  if(accounts){
  //  dispatch(setAccounts(accounts)); 
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
export const keplr_keystorechange=(cb?:Function):AppThunk=>async (dispatch, getState)=>{ 
  window.addEventListener("keplr_keystorechange", () => {
    dispatch(connectAtomjs());
  })
}

export const connectAtomjs=(cb?:Function):AppThunk=>async (dispatch, getState)=>{ 
  const a= await atomServer.connectAtomjs();
  console.log(a,"===a")
  const accounts=await atomServer.getAccounts();  
  console.log(accounts,"=======accounts") 
  const account= {  
    name: accounts.name,
    address: accounts.bech32Address,
    pubkey:u8aToHex(accounts.pubKey),
    balance: '--'
  }   
  dispatch(clice(Symbol.Atom).createSubstrate(account)); 
  cb && cb();
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
        return {
          createSubstrate:atomCreateSubstrate,
          reloadData:atomReloadData
        };
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
export const connectPolkadot_atom=(cb?:Function):AppThunk=>async (dispatch, getState)=>{
  // await dispatch(connectAtomjs());
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