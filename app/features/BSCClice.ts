import config, { isdev } from '@config/index';
import { createSlice } from '@reduxjs/toolkit';
import BridgeServer from '@servers/bridge';
import BscServer from '@servers/bsc/index';
import { getLocalStorageItem, Keys, removeLocalStorageItem, setLocalStorageItem } from '@util/common';
import numberUtil from '@util/numberUtil';
import { message } from 'antd';
import Web3Utils from 'web3-utils';
import { AppThunk } from '../store';

const bscServer = new BscServer();
const bridegServer = new BridgeServer();

const BSCClice = createSlice({
  name: 'BSCModule',
  initialState: {
    bscAccount: getLocalStorageItem(Keys.BscAccountKey),
    bscBNBBalance: '--',
    bepFISBalance: '--',
    bepRFISBalance: '--',
    bepRKSMBalance: '--',
    bepRDOTBalance: '--',
    bepRATOMBalance: '--',
    bepRSOLBalance: '--',
    bepRMATICBalance: '--',
    bepRETHBalance: '--',
    FISBep20Allowance: '--',
    RFISBep20Allowance: '--',
    RKSMBep20Allowance: '--',
    RDOTBep20Allowance: '--',
    RATOMBep20Allowance: '--',
    RSOLBep20Allowance: '--',
    RMATICBep20Allowance: '--',
    RETHBep20Allowance: '--',
    isload_monitoring: false,
  },
  reducers: {
    setBscAccount(state, { payload }) {
      if (payload == null) {
        state.bscAccount = payload;
        removeLocalStorageItem(Keys.BscAccountKey);
      } else {
        if (state.bscAccount && state.bscAccount.address == payload.address) {
          state.bscAccount = { ...state.bscAccount, ...payload };
          setLocalStorageItem(Keys.BscAccountKey, { address: payload.address });
        } else {
          state.bscAccount = payload;
          setLocalStorageItem(Keys.BscAccountKey, { address: payload.address });
        }
      }
    },
    setBscBNBBalance(state, { payload }) {
      state.bscBNBBalance = payload;
    },
    setBepFISBalance(state, { payload }) {
      state.bepFISBalance = payload;
    },
    setBepRFISBalance(state, { payload }) {
      state.bepRFISBalance = payload;
    },
    setBepRKSMBalance(state, { payload }) {
      state.bepRKSMBalance = payload;
    },
    setBepRDOTBalance(state, { payload }) {
      state.bepRDOTBalance = payload;
    },
    setBepRATOMBalance(state, { payload }) {
      state.bepRATOMBalance = payload;
    },
    setBepRSOLBalance(state, { payload }) {
      state.bepRSOLBalance = payload;
    },
    setBepRMATICBalance(state, { payload }) {
      state.bepRMATICBalance = payload;
    },
    setBepRETHBalance(state, { payload }) {
      state.bepRETHBalance = payload;
    },
    setFISBep20Allowance(state, { payload }) {
      state.FISBep20Allowance = payload;
    },
    setRFISBep20Allowance(state, { payload }) {
      state.RFISBep20Allowance = payload;
    },
    setRKSMBep20Allowance(state, { payload }) {
      state.RKSMBep20Allowance = payload;
    },
    setRDOTBep20Allowance(state, { payload }) {
      state.RDOTBep20Allowance = payload;
    },
    setRATOMBep20Allowance(state, { payload }) {
      state.RATOMBep20Allowance = payload;
    },
    setRSOLBep20Allowance(state, { payload }) {
      state.RSOLBep20Allowance = payload;
    },
    setRMATICBep20Allowance(state, { payload }) {
      state.RMATICBep20Allowance = payload;
    },
    setRETHBep20Allowance(state, { payload }) {
      state.RETHBep20Allowance = payload;
    },
    setIsloadMonitoring(state, { payload }) {
      state.isload_monitoring = payload;
    },
  },
});

export const {
  setBscAccount,
  setBscBNBBalance,
  setBepFISBalance,
  setBepRFISBalance,
  setBepRKSMBalance,
  setBepRDOTBalance,
  setBepRATOMBalance,
  setBepRSOLBalance,
  setBepRMATICBalance,
  setBepRETHBalance,
  setFISBep20Allowance,
  setRFISBep20Allowance,
  setRKSMBep20Allowance,
  setRDOTBep20Allowance,
  setRATOMBep20Allowance,
  setRSOLBep20Allowance,
  setRMATICBep20Allowance,
  setRETHBep20Allowance,
  setIsloadMonitoring,
} = BSCClice.actions;

declare const window: any;
declare const ethereum: any;

export const connectMetamask =
  (chainId: string): AppThunk =>
  async (dispatch, getState) => {
    if (typeof window.ethereum !== 'undefined' && ethereum.isMetaMask) {
      ethereum.autoRefreshOnNetworkChange = false;

      ethereum.request({ method: 'eth_chainId' }).then((chainId: any) => {
        if (isdev()) {
          if (ethereum.chainId != '0x61') {
            message.warning('Please connect to Binance Test Network!');
            return;
          }
        } else if (ethereum.chainId != '0x38') {
          message.warning('Please connect to Binance Main Network!');
          return;
        }

        ethereum
          .request({ method: 'eth_requestAccounts' })
          .then((accounts: any) => {
            console.log('accounts: ', JSON.stringify(accounts));
            dispatch(handleBscAccount(accounts[0]));
          })
          .catch((error: any) => {
            dispatch(setBscAccount(null));
            if (error.code === 4001) {
              message.error('Please connect to MetaMask.');
            } else {
              message.error('error.message');
            }
          });
      });
    } else {
      message.warning('Please install MetaMask!');
    }
  };

export const monitoring_Method = (): AppThunk => (dispatch, getState) => {
  const isload_monitoring = getState().BSCModule.isload_monitoring;

  if (isload_monitoring) {
    return;
  }
  if (typeof window.ethereum !== 'undefined' && ethereum.isMetaMask) {
    dispatch(setIsloadMonitoring(true));
    ethereum.autoRefreshOnNetworkChange = false;
    ethereum.on('accountsChanged', (accounts: any) => {
      if (accounts.length > 0) {
        dispatch(handleBscAccount(accounts[0]));

        setTimeout(() => {
          dispatch(getAssetBalanceAll());
          dispatch(getBep20Allowances());
          // dispatch(reloadData());
        }, 20);
      } else {
        dispatch(handleBscAccount(null));
      }
    });

    ethereum.on('chainChanged', (chainId: any) => {
      if (isdev()) {
        if (ethereum.chainId != config.bscChainId() && location.pathname.includes('/rAsset/bep')) {
          message.warning('Please connect to Binance Smart Chain!');
          dispatch(setBscAccount(null));
        }
        if (
          ethereum.chainId != config.bscChainId() &&
          (location.pathname.includes('/swap/bep20') || location.pathname.includes('/swap/native/bep20'))
        ) {
          message.warning('Please connect to Binance Smart Chain!');
          // dispatch(setBscAccount(null));
        }
      } else if (ethereum.chainId != config.bscChainId()) {
        // message.warning("Please connect to Binance Smart Chain!");
        dispatch(setBscAccount(null));
      }
    });
  }
};

export const handleBscAccount =
  (address: string): AppThunk =>
  (dispatch, getState) => {
    // dispatch(setBscAccount({ address: address, balance: "--" }));
    ethereum
      .request({ method: 'eth_getBalance', params: [address, 'latest'] })
      .then((result: any) => {
        const balance = numberUtil.handleEthAmountToFixed(Web3Utils.fromWei(result, 'ether'));
        // console.log("bnb balance: ", balance);
        dispatch(setBscAccount({ address: address, balance: balance }));
      })
      .catch((error: any) => {
        dispatch(setBscAccount({ address: address, balance: '--' }));
        message.error(error.message);
      });
  };

export const getAssetBalanceAll = (): AppThunk => (dispatch, getState) => {
  dispatch(getFISAssetBalance());
  dispatch(getRFISAssetBalance());
  dispatch(getRKSMAssetBalance());
  dispatch(getRDOTAssetBalance());
  dispatch(getRATOMAssetBalance());
  dispatch(getRSOLAssetBalance());
  dispatch(getRMATICAssetBalance());
  dispatch(getRETHAssetBalance());
};
export const getBep20Allowances = (): AppThunk => (dispatch, getState) => {
  dispatch(getFISBep20Allowance());
  dispatch(getRFISBep20Allowance());
  dispatch(getRKSMBep20Allowance());
  dispatch(getRDOTBep20Allowance());
  dispatch(getRATOMBep20Allowance());
  dispatch(getRSOLBep20Allowance());
  dispatch(getRMATICBep20Allowance());
  dispatch(getRETHBep20Allowance());
};

export const getFISAssetBalance = (): AppThunk => (dispatch, getState) => {
  if (getState().BSCModule.bscAccount) {
    const address = getState().BSCModule.bscAccount.address;
    getAssetBalance(address, bscServer.getFISTokenAbi(), bscServer.getFISTokenAddress(), (v: any) => {
      dispatch(setBepFISBalance(v));
    });
  }
};
export const getRFISAssetBalance = (): AppThunk => (dispatch, getState) => {
  if (getState().BSCModule.bscAccount) {
    const address = getState().BSCModule.bscAccount.address;
    getAssetBalance(address, bscServer.getRFISTokenAbi(), bscServer.getRFISTokenAddress(), (v: any) => {
      dispatch(setBepRFISBalance(v));
    });
  }
};
export const getRKSMAssetBalance = (): AppThunk => (dispatch, getState) => {
  if (getState().BSCModule.bscAccount) {
    const address = getState().BSCModule.bscAccount.address;
    getAssetBalance(address, bscServer.getRKSMTokenAbi(), bscServer.getRKSMTokenAddress(), (v: any) => {
      dispatch(setBepRKSMBalance(v));
    });
  }
};
export const getRDOTAssetBalance = (): AppThunk => (dispatch, getState) => {
  if (getState().BSCModule.bscAccount) {
    const address = getState().BSCModule.bscAccount.address;
    getAssetBalance(address, bscServer.getRDOTTokenAbi(), bscServer.getRDOTTokenAddress(), (v: any) => {
      dispatch(setBepRDOTBalance(v));
    });
  }
};

export const getRATOMAssetBalance = (): AppThunk => (dispatch, getState) => {
  if (getState().BSCModule.bscAccount) {
    const address = getState().BSCModule.bscAccount.address;
    getAssetBalance(address, bscServer.getRATOMTokenAbi(), bscServer.getRATOMTokenAddress(), (v: any) => {
      dispatch(setBepRATOMBalance(v));
    });
  }
};

export const getRSOLAssetBalance = (): AppThunk => (dispatch, getState) => {
  if (getState().BSCModule.bscAccount) {
    const address = getState().BSCModule.bscAccount.address;
    getAssetBalance(address, bscServer.getRSOLTokenAbi(), bscServer.getRSOLTokenAddress(), (v: any) => {
      dispatch(setBepRSOLBalance(v));
    });
  }
};

export const getRMATICAssetBalance = (): AppThunk => (dispatch, getState) => {
  if (getState().BSCModule.bscAccount) {
    const address = getState().BSCModule.bscAccount.address;
    getAssetBalance(address, bscServer.getRMATICTokenAbi(), bscServer.getRMATICTokenAddress(), (v: any) => {
      dispatch(setBepRMATICBalance(v));
    });
  }
};

export const getRETHAssetBalance = (): AppThunk => (dispatch, getState) => {
  if (getState().BSCModule.bscAccount) {
    const address = getState().BSCModule.bscAccount.address;
    getAssetBalance(address, bscServer.getRETHTokenAbi(), bscServer.getRETHTokenAddress(), (v: any) => {
      dispatch(setBepRETHBalance(v));
    });
  }
};

export const getAssetBalance = (ethAddress: string, getTokenAbi: string, getTokenAddress: string, cb?: Function) => {
  let web3 = bscServer.getWeb3();
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

export const getFISBep20Allowance = (): AppThunk => (dispatch, getState) => {
  if (getState().BSCModule.bscAccount) {
    const address = getState().BSCModule.bscAccount.address;
    getBep20Allowance(address, bscServer.getFISTokenAbi(), bscServer.getFISTokenAddress(), (v: any) => {
      dispatch(setFISBep20Allowance(v));
    });
  }
};
export const getRFISBep20Allowance = (): AppThunk => (dispatch, getState) => {
  if (getState().BSCModule.bscAccount) {
    const address = getState().BSCModule.bscAccount.address;
    getBep20Allowance(address, bscServer.getRFISTokenAbi(), bscServer.getRFISTokenAddress(), (v: any) => {
      dispatch(setRFISBep20Allowance(v));
    });
  }
};

export const getRKSMBep20Allowance = (): AppThunk => (dispatch, getState) => {
  if (getState().BSCModule.bscAccount) {
    const address = getState().BSCModule.bscAccount.address;
    getBep20Allowance(address, bscServer.getRKSMTokenAbi(), bscServer.getRKSMTokenAddress(), (v: any) => {
      dispatch(setRKSMBep20Allowance(v));
    });
  }
};
export const getRDOTBep20Allowance = (): AppThunk => (dispatch, getState) => {
  if (getState().BSCModule.bscAccount) {
    const address = getState().BSCModule.bscAccount.address;
    getBep20Allowance(address, bscServer.getRDOTTokenAbi(), bscServer.getRDOTTokenAddress(), (v: any) => {
      dispatch(setRDOTBep20Allowance(v));
    });
  }
};
export const getRATOMBep20Allowance = (): AppThunk => (dispatch, getState) => {
  if (getState().BSCModule.bscAccount) {
    const address = getState().BSCModule.bscAccount.address;
    getBep20Allowance(address, bscServer.getRATOMTokenAbi(), bscServer.getRATOMTokenAddress(), (v: any) => {
      dispatch(setRATOMBep20Allowance(v));
    });
  }
};
export const getRSOLBep20Allowance = (): AppThunk => (dispatch, getState) => {
  if (getState().BSCModule.bscAccount) {
    const address = getState().BSCModule.bscAccount.address;
    getBep20Allowance(address, bscServer.getRATOMTokenAbi(), bscServer.getRATOMTokenAddress(), (v: any) => {
      dispatch(setRSOLBep20Allowance(v));
    });
  }
};

export const getRMATICBep20Allowance = (): AppThunk => (dispatch, getState) => {
  if (getState().BSCModule.bscAccount) {
    const address = getState().BSCModule.bscAccount.address;
    getBep20Allowance(address, bscServer.getRMATICTokenAbi(), bscServer.getRMATICTokenAddress(), (v: any) => {
      dispatch(setRMATICBep20Allowance(v));
    });
  }
};

export const getRETHBep20Allowance = (): AppThunk => (dispatch, getState) => {
  if (getState().BSCModule.bscAccount) {
    const address = getState().BSCModule.bscAccount.address;
    getBep20Allowance(address, bscServer.getRETHTokenAbi(), bscServer.getRETHTokenAddress(), (v: any) => {
      dispatch(setRETHBep20Allowance(v));
    });
  }
};

const getBep20Allowance = async (address: string, getTokenAbi: string, getTokenAddress: string, cb?: Function) => {
  let web3 = bscServer.getWeb3();
  let contract = new web3.eth.Contract(getTokenAbi, getTokenAddress, {
    from: address,
  });
  try {
    const allowance = await contract.methods.allowance(address, bridegServer.getBridgeBep20HandlerAddress()).call();
    cb && cb(allowance);
  } catch (e: any) {
    console.error(e);
    cb && cb('--');
  }
};

export const clickSwapToBep20Link = (selectedToken: string, bscAddress: string) => {
  let tokenAddress = '';
  if (selectedToken == 'FIS') {
    tokenAddress = bscServer.getFISTokenAddress();
  } else if (selectedToken == 'rFIS') {
    tokenAddress = bscServer.getRFISTokenAddress();
  } else if (selectedToken == 'rKSM') {
    tokenAddress = bscServer.getRKSMTokenAddress();
  } else if (selectedToken == 'rDOT') {
    tokenAddress = bscServer.getRDOTTokenAddress();
  } else if (selectedToken == 'rATOM') {
    tokenAddress = bscServer.getRATOMTokenAddress();
  }
  return config.bscScanTokenUrl(tokenAddress, bscAddress);
};
export default BSCClice.reducer;
