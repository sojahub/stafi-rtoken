// @ts-nocheck

import { u8aToHex } from '@polkadot/util';
import { createSlice } from '@reduxjs/toolkit';
import mixpanel from 'mixpanel-browser';
import { Symbol } from 'src/keyring/defaults';
import AtomServer from 'src/servers/atom/index';
import keyring from 'src/servers/index';
import PolkadotServer from 'src/servers/polkadot/index';
import SolServer from 'src/servers/sol/index';
import { AppThunk } from '../store';
import { createSubstrate as fisCreateSubstrate, reloadData as fisReloadData } from './FISClice';
import { createSubstrate as atomCreateSubstrate, reloadData as atomReloadData } from './rATOMClice';
import { reloadData as bnbReloadData } from './rBNBClice';
import { createSubstrate as dotCreateSubstrate, reloadData as dotReloadData } from './rDOTClice';
import { createSubstrate as ksmCreateSubstrate, reloadData as ksmReloadData } from './rKSMClice';
import { reloadData as maticReloadData } from './rMATICClice';
import { createSubstrate as solCreateSubstrate, reloadData as solReloadData, setSolAccount } from './rSOLClice';

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
  destChainId: 1,
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
  swapping: {
    swapping: processStatus.default, // 0|1|2|3
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
    metaMaskNetworkId: null,
    metaMaskAccount: null,
    isload_monitoring: false,

    // 0-invisible, 1-start transferring, 2-start minting
    stakeSwapLoadingStatus: 0,
    stakeSwapLoadingParams: {
      destChainId: 0,
      tokenType: '',
      amount: '',
      oldBalance: '',
      transferDetail: '',
      viewTxUrl: '',
    },
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
    setProcessDestChainId(state, { payload }) {
      state.process.destChainId = payload;
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
    setProcessSwapping(state, { payload }) {
      state.process.swapping = { ...state.process.swapping, ...payload };
    },
    setTimeOutFunc(state, { payload }) {
      state.timeOutFunc = payload;
    },
    setLoading(state, { payload }) {
      state.loading = payload;
    },
    setMetaMaskNetworkId(state, { payload }) {
      state.metaMaskNetworkId = payload;
    },
    setMetaMaskAccount(state, { payload }) {
      state.metaMaskAccount = payload;
    },
    setIsloadMonitoring(state, { payload }) {
      state.isload_monitoring = payload;
    },
    setStakeSwapLoadingStatus(state, { payload }) {
      state.stakeSwapLoadingStatus = payload;
    },
    setStakeSwapLoadingParams(state, { payload }) {
      state.stakeSwapLoadingParams = { ...state.stakeSwapLoadingParams, ...payload };
    },
  },
});

export const {
  setAccounts,
  setProcessSlider,
  setStafiStakerApr,
  setProcessSending,
  setProcessStaking,
  setProcessMinting,
  setProcessSwapping,
  setProcessType,
  setProcessDestChainId,
  setTimeOutFunc,
  initProcess,
  setMetaMaskNetworkId,
  setMetaMaskAccount,
  setLoading,
  setIsloadMonitoring,
  setStakeSwapLoadingStatus,
  setStakeSwapLoadingParams,
} = globalClice.actions;

declare const window: any;
declare const ethereum: any;

export const connectPolkadotjs =
  (type: Symbol, cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    const accounts: any = await polkadotServer.connectPolkadotjs();
    if (accounts) {
      //  dispatch(setAccounts(accounts));
      const dotKeyringInstance = keyring.init(type);
      const accountsList = accounts.map((element: any) => {
        const address = dotKeyringInstance.encodeAddress(dotKeyringInstance.decodeAddress(element.address));
        return {
          name: element.meta.name,
          address: address,
          balance: '--',
        };
      });
      accountsList.forEach((account: any) => {
        dispatch(clice(type).createSubstrate(account));
      });
      cb && cb();
    }
  };

export const checkMetaMaskNetworkId = (): AppThunk => (dispatch, getState) => {
  // console.log('checkMetaMaskNetworkId');
  if (typeof window.ethereum !== 'undefined' && ethereum.isMetaMask) {
    ethereum.request({ method: 'eth_chainId' }).then((chainId: any) => {
      dispatch(setMetaMaskNetworkId(chainId));
    });
  } else {
    dispatch(setMetaMaskNetworkId(null));
  }
};

export const monitorMetaMaskChainChange = (): AppThunk => (dispatch, getState) => {
  const isload_monitoring = getState().globalModule.isload_monitoring;
  if (isload_monitoring) {
    return;
  }
  if (typeof window.ethereum !== 'undefined' && ethereum.isMetaMask) {
    dispatch(setIsloadMonitoring(true));
    ethereum.autoRefreshOnNetworkChange = false;

    ethereum.on('chainChanged', (chainId: any) => {
      dispatch(setMetaMaskNetworkId(chainId));
    });
  }
};

export const initMetaMaskAccount = (): AppThunk => (dispatch, getState) => {
  if (window.ethereum && typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
    window.ethereum
      .request({ method: 'eth_requestAccounts' })
      .then((accounts: any) => {
        if (accounts && accounts.length > 0) {
          dispatch(setMetaMaskAccount(accounts[0]));
        }
      })
      .catch((error: any) => {});

    window.ethereum.on('accountsChanged', (accounts: any) => {
      if (accounts.length > 0) {
        dispatch(setMetaMaskAccount(accounts[0]));
      }
    });
  }
};

export const keplr_keystorechange =
  (cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    window.addEventListener('keplr_keystorechange', () => {
      dispatch(connectAtomjs());
    });
  };

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
      // message.error('Please create an account');
    }
  };
export const connectSoljs =
  (cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    try {
      solServer.connectSolJs((account: any) => {
        dispatch(setSolAccount(account));
        dispatch(clice(Symbol.Sol).createSubstrate(account));
      });
    } catch (e) {
      // message.error('Please create an account');
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
        reloadData: maticReloadData,
      };
    case Symbol.Bnb:
      return {
        reloadData: bnbReloadData,
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

export const trackEvent =
  (eventName: string, params?: {}): AppThunk =>
  (dispatch, getState) => {
    mixpanel.track(eventName, {
      stafi_address: getState().FISModule.fisAccount ? getState().FISModule.fisAccount.address : 'unknown',
      extra: params,
    });
  };

export default globalClice.reducer;