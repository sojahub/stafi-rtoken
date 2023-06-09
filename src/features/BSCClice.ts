import { createSlice } from '@reduxjs/toolkit';
import config from 'src/config/index';
import BridgeServer from 'src/servers/bridge';
import BscServer from 'src/servers/bsc/index';
import EthServer from 'src/servers/eth/index';
import { AppThunk } from '../store';

const bscServer = new BscServer();
const ethServer = new EthServer();
const bridegServer = new BridgeServer();

const BSCClice = createSlice({
  name: 'BSCModule',
  initialState: {
    bscBNBBalance: '--',
    bepFISBalance: '--',
    bepRFISBalance: '--',
    bepRKSMBalance: '--',
    bepRDOTBalance: '--',
    bepRATOMBalance: '--',
    bepRSOLBalance: '--',
    bepRMATICBalance: '--',
    bepRETHBalance: '--',
    bepRBNBBalance: '--',
    FISBep20Allowance: '--',
    RFISBep20Allowance: '--',
    RKSMBep20Allowance: '--',
    RDOTBep20Allowance: '--',
    RATOMBep20Allowance: '--',
    RSOLBep20Allowance: '--',
    RMATICBep20Allowance: '--',
    RETHBep20Allowance: '--',
    RBNBBep20Allowance: '--',
  },
  reducers: {
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
    setBepRBNBBalance(state, { payload }) {
      state.bepRBNBBalance = payload;
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
    setRBNBBep20Allowance(state, { payload }) {
      state.RBNBBep20Allowance = payload;
    },
  },
});

export const {
  setBscBNBBalance,
  setBepFISBalance,
  setBepRFISBalance,
  setBepRKSMBalance,
  setBepRDOTBalance,
  setBepRATOMBalance,
  setBepRSOLBalance,
  setBepRMATICBalance,
  setBepRETHBalance,
  setBepRBNBBalance,
  setFISBep20Allowance,
  setRFISBep20Allowance,
  setRKSMBep20Allowance,
  setRDOTBep20Allowance,
  setRATOMBep20Allowance,
  setRSOLBep20Allowance,
  setRMATICBep20Allowance,
  setRETHBep20Allowance,
  setRBNBBep20Allowance,
} = BSCClice.actions;

export const getAssetBalanceAll = (): AppThunk => (dispatch, getState) => {
  // dispatch(getFISAssetBalance());
  dispatch(getRFISAssetBalance());
  dispatch(getRKSMAssetBalance());
  dispatch(getRDOTAssetBalance());
  dispatch(getRATOMAssetBalance());
  // dispatch(getRSOLAssetBalance());
  dispatch(getRMATICAssetBalance());
  dispatch(getRETHAssetBalance());
  dispatch(getRBNBAssetBalance());
};
export const getBep20Allowances = (): AppThunk => (dispatch, getState) => {
  // dispatch(getFISBep20Allowance());
  dispatch(getRFISBep20Allowance());
  dispatch(getRKSMBep20Allowance());
  dispatch(getRDOTBep20Allowance());
  dispatch(getRATOMBep20Allowance());
  // dispatch(getRSOLBep20Allowance());
  dispatch(getRMATICBep20Allowance());
  dispatch(getRETHBep20Allowance());
  dispatch(getRBNBBep20Allowance());
};

export const getFISAssetBalance = (): AppThunk => (dispatch, getState) => {
  getAssetBalance(
    getState().globalModule.metaMaskAddress,
    bscServer.getRFISTokenAbi(),
    bscServer.getRFISTokenAddress(),
    (v: any) => {
      dispatch(setBepRFISBalance(v));
    },
  );
};
export const getRFISAssetBalance = (): AppThunk => (dispatch, getState) => {
  getAssetBalance(
    getState().globalModule.metaMaskAddress,
    bscServer.getRFISTokenAbi(),
    bscServer.getRFISTokenAddress(),
    (v: any) => {
      dispatch(setBepRFISBalance(v));
    },
  );
};
export const getRKSMAssetBalance = (): AppThunk => (dispatch, getState) => {
  getAssetBalance(
    getState().globalModule.metaMaskAddress,
    bscServer.getRKSMTokenAbi(),
    bscServer.getRKSMTokenAddress(),
    (v: any) => {
      dispatch(setBepRKSMBalance(v));
    },
  );
};
export const getRDOTAssetBalance = (): AppThunk => (dispatch, getState) => {
  getAssetBalance(
    getState().globalModule.metaMaskAddress,
    bscServer.getRDOTTokenAbi(),
    bscServer.getRDOTTokenAddress(),
    (v: any) => {
      dispatch(setBepRDOTBalance(v));
    },
  );
};

export const getRATOMAssetBalance = (): AppThunk => (dispatch, getState) => {
  getAssetBalance(
    getState().globalModule.metaMaskAddress,
    bscServer.getRATOMTokenAbi(),
    bscServer.getRATOMTokenAddress(),
    (v: any) => {
      dispatch(setBepRATOMBalance(v));
    },
  );
};

export const getRSOLAssetBalance = (): AppThunk => (dispatch, getState) => {
  getAssetBalance(
    getState().globalModule.metaMaskAddress,
    bscServer.getRSOLTokenAbi(),
    bscServer.getRSOLTokenAddress(),
    (v: any) => {
      dispatch(setBepRSOLBalance(v));
    },
  );
};

export const getRMATICAssetBalance = (): AppThunk => (dispatch, getState) => {
  getAssetBalance(
    getState().globalModule.metaMaskAddress,
    bscServer.getRMATICTokenAbi(),
    bscServer.getRMATICTokenAddress(),
    (v: any) => {
      dispatch(setBepRMATICBalance(v));
    },
  );
};

export const getRETHAssetBalance = (): AppThunk => (dispatch, getState) => {
  getAssetBalance(
    getState().globalModule.metaMaskAddress,
    bscServer.getRETHTokenAbi(),
    bscServer.getRETHTokenAddress(),
    (v: any) => {
      dispatch(setBepRETHBalance(v));
    },
  );
};

export const getRBNBAssetBalance = (): AppThunk => (dispatch, getState) => {
  getAssetBalance(
    getState().globalModule.metaMaskAddress,
    bscServer.getRTokenAbi(),
    bscServer.getRBNBTokenAddress(),
    (v: any) => {
      dispatch(setBepRBNBBalance(v));
    },
  );
};

export const getAssetBalance = (
  ethAddress: string,
  getTokenAbi: string,
  getTokenAddress: string,
  cb?: Function,
  useCustomProvider?: boolean,
) => {
  if (!ethAddress) {
    return;
  }

  let web3 = useCustomProvider ? ethServer.getBSCWeb3() : ethServer.getWeb3();
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
  getBep20Allowance(
    getState().globalModule.metaMaskAddress,
    bscServer.getFISTokenAbi(),
    bscServer.getFISTokenAddress(),
    (v: any) => {
      dispatch(setFISBep20Allowance(v));
    },
  );
};
export const getRFISBep20Allowance = (): AppThunk => (dispatch, getState) => {
  getBep20Allowance(
    getState().globalModule.metaMaskAddress,
    bscServer.getRFISTokenAbi(),
    bscServer.getRFISTokenAddress(),
    (v: any) => {
      dispatch(setRFISBep20Allowance(v));
    },
  );
};

export const getRKSMBep20Allowance = (): AppThunk => (dispatch, getState) => {
  getBep20Allowance(
    getState().globalModule.metaMaskAddress,
    bscServer.getRKSMTokenAbi(),
    bscServer.getRKSMTokenAddress(),
    (v: any) => {
      dispatch(setRKSMBep20Allowance(v));
    },
  );
};
export const getRDOTBep20Allowance = (): AppThunk => (dispatch, getState) => {
  getBep20Allowance(
    getState().globalModule.metaMaskAddress,
    bscServer.getRDOTTokenAbi(),
    bscServer.getRDOTTokenAddress(),
    (v: any) => {
      dispatch(setRDOTBep20Allowance(v));
    },
  );
};
export const getRATOMBep20Allowance = (): AppThunk => (dispatch, getState) => {
  getBep20Allowance(
    getState().globalModule.metaMaskAddress,
    bscServer.getRATOMTokenAbi(),
    bscServer.getRATOMTokenAddress(),
    (v: any) => {
      dispatch(setRATOMBep20Allowance(v));
    },
  );
};
export const getRSOLBep20Allowance = (): AppThunk => (dispatch, getState) => {
  getBep20Allowance(
    getState().globalModule.metaMaskAddress,
    bscServer.getRSOLTokenAbi(),
    bscServer.getRSOLTokenAddress(),
    (v: any) => {
      dispatch(setRSOLBep20Allowance(v));
    },
  );
};

export const getRMATICBep20Allowance = (): AppThunk => (dispatch, getState) => {
  getBep20Allowance(
    getState().globalModule.metaMaskAddress,
    bscServer.getRMATICTokenAbi(),
    bscServer.getRMATICTokenAddress(),
    (v: any) => {
      dispatch(setRMATICBep20Allowance(v));
    },
  );
};

export const getRETHBep20Allowance = (): AppThunk => (dispatch, getState) => {
  getBep20Allowance(
    getState().globalModule.metaMaskAddress,
    bscServer.getRETHTokenAbi(),
    bscServer.getRETHTokenAddress(),
    (v: any) => {
      dispatch(setRETHBep20Allowance(v));
    },
  );
};

export const getRBNBBep20Allowance = (): AppThunk => (dispatch, getState) => {
  getBep20Allowance(
    getState().globalModule.metaMaskAddress,
    bscServer.getRTokenAbi(),
    bscServer.getRBNBTokenAddress(),
    (v: any) => {
      dispatch(setRBNBBep20Allowance(v));
    },
  );
};

const getBep20Allowance = async (address: string, getTokenAbi: string, getTokenAddress: string, cb?: Function) => {
  if (!address) {
    return;
  }

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
