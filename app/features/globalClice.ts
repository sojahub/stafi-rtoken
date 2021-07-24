import { Symbol } from '@keyring/defaults';
import { u8aToHex } from '@polkadot/util';
import { createSlice } from '@reduxjs/toolkit';
import AtomServer from '@servers/atom/index';
import keyring from '@servers/index';
import PolkadotServer from '@servers/polkadot/index';
import SolServer from '@servers/sol/index';
import Rpc from '@util/rpc';
import { message } from 'antd';
import { AppThunk } from '../store';
import { createSubstrate as fisCreateSubstrate, reloadData as fisReloadData } from './FISClice';
import { createSubstrate as atomCreateSubstrate, reloadData as atomReloadData } from './rATOMClice';
import { createSubstrate as dotCreateSubstrate, reloadData as dotReloadData } from './rDOTClice';
import { createSubstrate as ksmCreateSubstrate, reloadData as ksmReloadData } from './rKSMClice';
import { reloadData as maticReloadData } from './rMATICClice';
import { createSubstrate as solCreateSubstrate, reloadData as solReloadData } from './rSOLClice';
export enum processStatus {
  default = 0,
  success = 1,
  failure = 2,
  loading = 3,
}
//0|1|2|4
const polkadotServer = new PolkadotServer();

const atomServer = new AtomServer();
const solServer = new SolServer();
export const process = {
  rSymbol: '',
  sending: {
    brocasting: processStatus.default, // 0|1|2|3
    packing: processStatus.default, // 0|1|2|3
    finalizing: processStatus.default, // 0|1|2|3
    checkTx: '', //
  },
  staking: {
    brocasting: processStatus.default, // 0|1|2|3
    packing: processStatus.default, // 0|1|2|3
    finalizing: processStatus.default, // 0|1|2|3
    checkTx: '', //
  },
  minting: {
    minting: processStatus.default, // 0|1|2|3
    checkTx: '', //
  },
};
const globalClice = createSlice({
  name: 'globalModule',
  initialState: {
    provinces: [],
    processSlider: false,
    accounts: [],
    stafiStakerApr: '--',
    process: process,
    timeOutFunc: null,

    loading: false,
    metaMaskNetworkId:null,
    isload_monitoring:false,
  },
  reducers: {
    setProcessSlider(state, { payload }) {
      // if(payload==false && state.timeOutFunc){
      //   clearTimeout(state.timeOutFunc);
      // }
      if (state.processSlider != payload) {
        state.processSlider = payload;
      }
    },
    setAccounts(state, { payload }) {
      state.accounts = payload;
    },
    setStafiStakerApr(state, { payload }) {
      state.stafiStakerApr = payload;
    },
    initProcess(state, { payload }) {
      if (payload) {
        state.process = { ...process, ...payload };
      } else {
        state.process = process;
      }
    },
    setProcessType(state, { payload }) {
      state.process.rSymbol = payload;
    },
    setProcessSending(state, { payload }) {
      state.process.sending = { ...state.process.sending, ...payload };
    },
    setProcessStaking(state, { payload }) {
      state.process.staking = { ...state.process.staking, ...payload };
    },
    setProcessMinting(state, { payload }) {
      state.process.minting = { ...state.process.minting, ...payload };
    },
    setTimeOutFunc(state, { payload }) {
      state.timeOutFunc = payload;
    },
    setLoading(state, { payload }) {
      state.loading = payload;
    },
    setMetaMaskNetworkId(state,{payload}){
      state.metaMaskNetworkId=payload;
    },
    setIsloadMonitoring(state,{payload}){
      state.isload_monitoring=payload;
    }
  },
});
export const {
  setAccounts,
  setProcessSlider,
  setStafiStakerApr,
  setProcessSending,
  setProcessStaking,
  setProcessMinting,
  setProcessType,
  setTimeOutFunc,
  initProcess,
  setMetaMaskNetworkId,
  setLoading,
  setIsloadMonitoring
 } = globalClice.actions;

declare const window: any;
declare const ethereum: any;

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

export const checkMetaMaskNetworkId = (): AppThunk => (dispatch, getState) => {
  if (typeof window.ethereum !== "undefined" && ethereum.isMetaMask) {
    ethereum.request({ method: 'eth_chainId' }).then((chainId:any) => { 
      dispatch(setMetaMaskNetworkId(chainId));
    })
  }
  dispatch(setMetaMaskNetworkId(null));
 };

 export const monitorMetaMaskChainChange=():AppThunk=>(dispatch,getState)=> { 
  const isload_monitoring =getState().globalModule.isload_monitoring;
  if(isload_monitoring){
    return;
  } 
  if (typeof window.ethereum !== 'undefined' && ethereum.isMetaMask) {
    dispatch(setIsloadMonitoring(true));
    ethereum.autoRefreshOnNetworkChange = false; 

    ethereum.on('chainChanged', (chainId:any) => {
      dispatch(setMetaMaskNetworkId(chainId));
    }); 
  }
}

export const keplr_keystorechange=(cb?:Function):AppThunk=>async (dispatch, getState)=>{ 
  window.addEventListener("keplr_keystorechange", () => {
    dispatch(connectAtomjs());
  })
}

export const connectAtomjs =
  (cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    try {
      await atomServer.connectAtomjs();
      const accounts = await atomServer.getAccounts();
      const account = {
        name: accounts.name,
        address: accounts.bech32Address,
        pubkey: u8aToHex(accounts.pubKey),
        balance: '--',
      };
      dispatch(clice(Symbol.Atom).createSubstrate(account));
      cb && cb();
    } catch (e) {
      message.error('Please create an account');
    }
  };
export const connectSoljs =
  (cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    try {
      solServer.connectSolJs();
    } catch (e) {
      message.error('Please create an account');
    }
  };
export const reloadData =
  (type: Symbol, cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    dispatch(clice(type).reloadData());
    cb && cb();
  };
export const clice = (symbol: string) => {
  switch (symbol) {
    case Symbol.Xtz:
    case Symbol.Fis:
      return {
        createSubstrate: fisCreateSubstrate,
        reloadData: fisReloadData,
      };
    case Symbol.Ksm:
      return {
        createSubstrate: ksmCreateSubstrate,
        reloadData: ksmReloadData,
      };
    case Symbol.Sol:
      return {
        createSubstrate: solCreateSubstrate,
        reloadData: solReloadData,
      };
    case Symbol.Dot:
      return {
        createSubstrate: dotCreateSubstrate,
        reloadData: dotReloadData,
      };
    case Symbol.Atom:
      return {
        createSubstrate: atomCreateSubstrate,
        reloadData: atomReloadData,
      };
    case Symbol.Matic: 
      return { 
        reloadData:maticReloadData
      };
    case Symbol.Kava:
    case Symbol.One:
    default:
      return {
        createSubstrate: fisCreateSubstrate,
        reloadData: fisReloadData,
      };
  }
};

export const fetchStafiStakerApr =
  (cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    const result = await Rpc.fetchStafiStakerApr({});
    if (result.status == '80000') {
      if (result.data && result.data.apr) {
        const apr = result.data.apr + '%';
        dispatch(setStafiStakerApr(apr));
        cb && cb();
      }
    }
  };

 
export const connectPolkadot =
  (cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    await dispatch(connectPolkadotjs(Symbol.Dot));
    await dispatch(connectPolkadotjs(Symbol.Fis));
    cb && cb();
  };
export const connectPolkadot_ksm =
  (cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    await dispatch(connectPolkadotjs(Symbol.Ksm));
    await dispatch(connectPolkadotjs(Symbol.Fis));
    cb && cb();
  };
export const connectPolkadot_fis =
  (cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    // await dispatch(connectAtomjs());
    await dispatch(connectPolkadotjs(Symbol.Fis));
    cb && cb();
  };
export const connectPolkadot_sol =
  (cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    // await dispatch(connectPolkadotjs(Symbol.Sol));
    await dispatch(connectPolkadotjs(Symbol.Fis));
    cb && cb();
  };
export const gSetTimeOut =
  (cb: Function, time: number): AppThunk =>
  (dispatch, getState) => {
    const timeoutFunc = setTimeout(cb, time);
    dispatch(setTimeOutFunc(timeoutFunc));
  };
export const gClearTimeOut = (): AppThunk => (dispatch, getState) => {
  const time = getState().globalModule.timeOutFunc;
  if (time) { 
    clearTimeout(time);
  }
};

export default globalClice.reducer;
