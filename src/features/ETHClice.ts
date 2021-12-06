import { createSlice } from '@reduxjs/toolkit';
import config from 'src/config/index';
import AtomServer from 'src/servers/atom';
import BridgeServer from 'src/servers/bridge';
import EthServer from 'src/servers/eth/index';
import KsmServer from 'src/servers/ksm';
import MaticServer from 'src/servers/matic';
import DotServer from 'src/servers/polkadot';
import SolServer from 'src/servers/sol';
import FisServer from 'src/servers/stafi';
import { requestMetamaskAccount } from 'src/util/metaMaskUtil';
import { AppThunk } from '../store';

declare const ethereum: any;

const ethServer = new EthServer();
const fisServer = new FisServer();
const ksmServer = new KsmServer();
const bridgeServer = new BridgeServer();
const dotServer = new DotServer();
const atomServer = new AtomServer();
const solServer = new SolServer();
const maticServer = new MaticServer();

const ETHClice = createSlice({
  name: 'ETHModule',
  initialState: {
    ercETHBalance: '--',
    ercFISBalance: '--',
    ercRFISBalance: '--',
    ercRKSMBalance: '--',
    ercRDOTBalance: '--',
    ercRATOMBalance: '--',
    ercRSOLBalance: '--',
    ercRMaticBalance: '--',
    FISErc20Allowance: '--',
    RFISErc20Allowance: '--',
    RKSMErc20Allowance: '--',
    RDOTErc20Allowance: '--',
    RATOMErc20Allowance: '--',
    RSOLErc20Allowance: '--',
    RMaticErc20Allowance: '--',
    RETHErc20Allowance: '--',
    gasPrice: '--',
  },
  reducers: {
    setErcETHBalance(state, { payload }) {
      state.ercETHBalance = payload;
    },
    setErcFISBalance(state, { payload }) {
      state.ercFISBalance = payload;
    },
    setErcRFISBalance(state, { payload }) {
      state.ercRFISBalance = payload;
    },
    setErcRKSMBalance(state, { payload }) {
      state.ercRKSMBalance = payload;
    },
    setErcRDOTBalance(state, { payload }) {
      state.ercRDOTBalance = payload;
    },
    setErcRATOMBalance(state, { payload }) {
      state.ercRATOMBalance = payload;
    },
    setErcRSOLBalance(state, { payload }) {
      state.ercRSOLBalance = payload;
    },
    setErcRMaticBalance(state, { payload }) {
      state.ercRMaticBalance = payload;
    },
    setFISErc20Allowance(state, { payload }) {
      state.FISErc20Allowance = payload;
    },
    setRFISErc20Allowance(state, { payload }) {
      state.RFISErc20Allowance = payload;
    },
    setRKSMErc20Allowance(state, { payload }) {
      state.RKSMErc20Allowance = payload;
    },
    setRDOTErc20Allowance(state, { payload }) {
      state.RDOTErc20Allowance = payload;
    },
    setRATOMErc20Allowance(state, { payload }) {
      state.RATOMErc20Allowance = payload;
    },
    setRSOLErc20Allowance(state, { payload }) {
      state.RSOLErc20Allowance = payload;
    },
    setRMaticErc20Allowance(state, { payload }) {
      state.RMaticErc20Allowance = payload;
    },
    setRETHErc20Allowance(state, { payload }) {
      state.RETHErc20Allowance = payload;
    },
    setGasPrice(state, { payload }) {
      state.gasPrice = payload;
    },
  },
});

export const {
  setErcETHBalance,
  setErcFISBalance,
  setErcRFISBalance,
  setErcRKSMBalance,
  setErcRDOTBalance,
  setErcRATOMBalance,
  setErcRSOLBalance,
  setErcRMaticBalance,
  setFISErc20Allowance,
  setRFISErc20Allowance,
  setRKSMErc20Allowance,
  setRDOTErc20Allowance,
  setRATOMErc20Allowance,
  setRSOLErc20Allowance,
  setRMaticErc20Allowance,
  setRETHErc20Allowance,
  setGasPrice,
} = ETHClice.actions;

export const getGasPrice = (): AppThunk => async (dispatch, getState) => {
  try {
    let web3 = ethServer.getWeb3();
    if (!web3 || !web3.eth) {
      return;
    }
    var gasPrice = await web3.eth.getGasPrice();
    dispatch(setGasPrice(gasPrice));
  } catch (err: any) {
    console.error('getGasPrice Error:', err.message);
  }
};

export const getAssetBalanceAll = (): AppThunk => (dispatch, getState) => {
  dispatch(getETHAssetBalance());
  dispatch(getFISAssetBalance());
  dispatch(getRFISAssetBalance());
  dispatch(getRKSMAssetBalance());
  dispatch(getRDOTAssetBalance());
  dispatch(getRATOMAssetBalance());
  // dispatch(getRSOLAssetBalance());
  dispatch(getRMaticAssetBalance());
};
export const getErc20Allowances = (): AppThunk => (dispatch, getState) => {
  dispatch(getFISErc20Allowance());
  dispatch(getRFISErc20Allowance());
  dispatch(getRKSMErc20Allowance());
  dispatch(getRDOTErc20Allowance());
  dispatch(getRATOMErc20Allowance());
  // dispatch(getRSOLErc20Allowance());
  dispatch(getRMaticErc20Allowance());
  dispatch(getRETHErc20Allowance());
};
export const getETHAssetBalance = (): AppThunk => (dispatch, getState) => {
  const address = getState().globalModule.metaMaskAddress;
  getAssetBalance(address, ethServer.getRETHTokenAbi(), ethServer.getRETHTokenAddress(), (v: any) => {
    dispatch(setErcETHBalance(v));
  });
};

export const getFISAssetBalance = (): AppThunk => (dispatch, getState) => {
  const address = getState().globalModule.metaMaskAddress;
  getAssetBalance(address, fisServer.getFISTokenAbi(), fisServer.getFISTokenAddress(), (v: any) => {
    dispatch(setErcFISBalance(v));
  });
};
export const getRFISAssetBalance = (): AppThunk => (dispatch, getState) => {
  const address = getState().globalModule.metaMaskAddress;
  getAssetBalance(address, fisServer.getRFISTokenAbi(), fisServer.getRFISTokenAddress(), (v: any) => {
    dispatch(setErcRFISBalance(v));
  });
};
export const getRKSMAssetBalance = (): AppThunk => (dispatch, getState) => {
  const address = getState().globalModule.metaMaskAddress;
  getAssetBalance(address, ksmServer.getRKSMTokenAbi(), ksmServer.getRKSMTokenAddress(), (v: any) => {
    dispatch(setErcRKSMBalance(v));
  });
};
export const getRDOTAssetBalance = (): AppThunk => (dispatch, getState) => {
  const address = getState().globalModule.metaMaskAddress;
  getAssetBalance(address, dotServer.getRDOTTokenAbi(), dotServer.getRDOTTokenAddress(), (v: any) => {
    dispatch(setErcRDOTBalance(v));
  });
};

export const getRATOMAssetBalance = (): AppThunk => (dispatch, getState) => {
  const address = getState().globalModule.metaMaskAddress;
  getAssetBalance(address, atomServer.getTokenAbi(), atomServer.getRATOMTokenAddress(), (v: any) => {
    dispatch(setErcRATOMBalance(v));
  });
};
export const getRSOLAssetBalance = (): AppThunk => (dispatch, getState) => {
  const address = getState().globalModule.metaMaskAddress;
  getAssetBalance(address, solServer.getTokenAbi(), solServer.getRSOLTokenAddress(), (v: any) => {
    dispatch(setErcRSOLBalance(v));
  });
};

export const getRMaticAssetBalance = (): AppThunk => (dispatch, getState) => {
  const address = getState().globalModule.metaMaskAddress;
  getAssetBalance(address, maticServer.getTokenAbi(), maticServer.getTokenAddress(), (v: any) => {
    dispatch(setErcRMaticBalance(v));
  });
};

export const getAssetBalance = (
  ethAddress: string,
  getTokenAbi: string,
  getTokenAddress: string,
  cb?: Function,
  userCustomProvider?: boolean,
) => {
  if (!ethAddress) {
    return;
  }

  let web3 = userCustomProvider ? ethServer.getETHWeb3() : ethServer.getWeb3();
  let contract = new web3.eth.Contract(getTokenAbi, getTokenAddress, {
    from: ethAddress,
  });
  try {
    contract.methods
      .balanceOf(ethAddress)
      .call()
      .then((balance: any) => {
        let rbalance = web3.utils.fromWei(balance, 'ether');
        cb && cb(rbalance);
      })
      .catch((e: any) => {
        console.error(e);
        cb && cb('--');
      });
  } catch (e: any) {
    console.error(e);
  }
};

export const getFISErc20Allowance = (): AppThunk => (dispatch, getState) => {
  if (getState().globalModule.metaMaskAddress) {
    const address = getState().globalModule.metaMaskAddress;
    getErc20Allowance(address, fisServer.getFISTokenAbi(), fisServer.getFISTokenAddress(), (v: any) => {
      dispatch(setFISErc20Allowance(v));
    });
  }
};

export const getRFISErc20Allowance = (): AppThunk => (dispatch, getState) => {
  if (getState().globalModule.metaMaskAddress) {
    const address = getState().globalModule.metaMaskAddress;
    getErc20Allowance(address, fisServer.getRFISTokenAbi(), fisServer.getRFISTokenAddress(), (v: any) => {
      dispatch(setRFISErc20Allowance(v));
    });
  }
};

export const getRKSMErc20Allowance = (): AppThunk => (dispatch, getState) => {
  if (getState().globalModule.metaMaskAddress) {
    const address = getState().globalModule.metaMaskAddress;
    getErc20Allowance(address, ksmServer.getRKSMTokenAbi(), ksmServer.getRKSMTokenAddress(), (v: any) => {
      dispatch(setRKSMErc20Allowance(v));
    });
  }
};
export const getRDOTErc20Allowance = (): AppThunk => (dispatch, getState) => {
  if (getState().globalModule.metaMaskAddress) {
    const address = getState().globalModule.metaMaskAddress;
    getErc20Allowance(address, dotServer.getRDOTTokenAbi(), dotServer.getRDOTTokenAddress(), (v: any) => {
      dispatch(setRDOTErc20Allowance(v));
    });
  }
};

export const getRATOMErc20Allowance = (): AppThunk => (dispatch, getState) => {
  if (getState().globalModule.metaMaskAddress) {
    const address = getState().globalModule.metaMaskAddress;
    getErc20Allowance(address, atomServer.getTokenAbi(), atomServer.getRATOMTokenAddress(), (v: any) => {
      dispatch(setRATOMErc20Allowance(v));
    });
  }
};

export const getRSOLErc20Allowance = (): AppThunk => (dispatch, getState) => {
  if (getState().globalModule.metaMaskAddress) {
    const address = getState().globalModule.metaMaskAddress;
    getErc20Allowance(address, solServer.getTokenAbi(), solServer.getRSOLTokenAddress(), (v: any) => {
      dispatch(setRSOLErc20Allowance(v));
    });
  }
};

export const getRMaticErc20Allowance = (): AppThunk => (dispatch, getState) => {
  if (getState().globalModule.metaMaskAddress) {
    const address = getState().globalModule.metaMaskAddress;
    getErc20Allowance(address, maticServer.getTokenAbi(), maticServer.getTokenAddress(), (v: any) => {
      dispatch(setRMaticErc20Allowance(v));
    });
  }
};

export const getRETHErc20Allowance = (): AppThunk => (dispatch, getState) => {
  if (getState().globalModule.metaMaskAddress) {
    const address = getState().globalModule.metaMaskAddress;
    getErc20Allowance(address, ethServer.getRETHTokenAbi(), ethServer.getRETHTokenAddress(), (v: any) => {
      dispatch(setRETHErc20Allowance(v));
    });
  }
};

const getErc20Allowance = async (ethAddress: string, getTokenAbi: string, getTokenAddress: string, cb?: Function) => {
  let web3 = ethServer.getWeb3();
  let contract = new web3.eth.Contract(getTokenAbi, getTokenAddress, {
    from: ethAddress,
  });
  try {
    const allowance = await contract.methods.allowance(ethAddress, bridgeServer.getBridgeErc20HandlerAddress()).call();
    cb && cb(allowance);
  } catch (e: any) {
    console.error(e);
    cb && cb('--');
  }
};

export const clickSwapToErc20Link = (selectedToken: string, ethAddress: string) => {
  let tokenAddress = '';
  if (selectedToken == 'FIS') {
    tokenAddress = fisServer.getFISTokenAddress();
  } else if (selectedToken == 'rFIS') {
    tokenAddress = fisServer.getRFISTokenAddress();
  } else if (selectedToken == 'rKSM') {
    tokenAddress = ksmServer.getRKSMTokenAddress();
  } else if (selectedToken == 'rDOT') {
    tokenAddress = dotServer.getRDOTTokenAddress();
  } else if (selectedToken == 'rATOM') {
    tokenAddress = atomServer.getRATOMTokenAddress();
  }
  return config.etherScanTokenUrl(tokenAddress, ethAddress);
};
export const clickSwapToNativeLink = (stafiAddress: string) => {
  return 'https://stafi.subscan.io/account/' + stafiAddress;
};
export default ETHClice.reducer;
