import config from '@config/index';
import { createSlice } from '@reduxjs/toolkit';
import SolServer from '@servers/sol';
import { Connection, PublicKey } from '@solana/web3.js';
import { AppThunk } from '../store';

const splToken = require('@solana/spl-token');
const solServer = new SolServer();

const ETHClice = createSlice({
  name: 'SOLModule',
  initialState: {
    fisBalance: '--',
    fisAllowance: '--',
    rSOLBalance: '--',
    rSOLAllowance: '--',
  },
  reducers: {
    setFisBalance(state, { payload }) {
      state.fisBalance = payload;
    },
    setFisAllowance(state, { payload }) {
      state.fisAllowance = payload;
    },
    setRSOLBalance(state, { payload }) {
      state.rSOLBalance = payload;
    },
    setRSOLAllowance(state, { payload }) {
      state.rSOLAllowance = payload;
    },
  },
});

export const { setFisBalance, setFisAllowance, setRSOLBalance, setRSOLAllowance } = ETHClice.actions;

export const getSlp20AssetBalanceAll = (): AppThunk => (dispatch, getState) => {
  dispatch(getFisAssetBalance());
  dispatch(getRSOLAssetBalance());
};

export const getSlp20Allowances = (): AppThunk => (dispatch, getState) => {
  dispatch(getFisAllowance());
  dispatch(getRSOLAllowance());
};

export const getFisAssetBalance = (): AppThunk => (dispatch, getState) => {
  const address = getState().rSOLModule.solAccount && getState().rSOLModule.solAccount.address;
  getAssetBalance(address, 'fis', (v: any) => {
    dispatch(setFisBalance(v));
  });
};

export const getRSOLAssetBalance = (): AppThunk => (dispatch, getState) => {
  const address = getState().rSOLModule.solAccount && getState().rSOLModule.solAccount.address;
  getAssetBalance(address, 'rsol', (v: any) => {
    dispatch(setRSOLBalance(v));
  });
};

export const getAssetBalance = async (address: string, tokenType: string, cb?: Function) => {
  if (!address) {
    return;
  }

  let slpTokenMintAddress;
  if (tokenType === 'fis') {
    slpTokenMintAddress = config.slpFisTokenAddress();
  } else if (tokenType === 'rsol') {
    slpTokenMintAddress = config.slpRSolTokenAddress();
  }

  const result = await PublicKey.findProgramAddress(
    [
      new PublicKey(address).toBuffer(),
      splToken.TOKEN_PROGRAM_ID.toBuffer(),
      new PublicKey(slpTokenMintAddress).toBuffer(),
    ],
    new PublicKey(config.slpAssociatedTokenAccountProgramId()),
  );

  if (result && result.length > 0) {
    try {
      const connection = new Connection(config.solRpcApi(), {
        wsEndpoint: config.solRpcWs(),
        commitment: 'singleGossip',
      });
      const tokenAccountBalance = await connection.getTokenAccountBalance(result[0]);
      // console.log('slp20 asset detail: ', tokenAccountBalance.value);
      if (tokenAccountBalance && tokenAccountBalance.value) {
        cb && cb(tokenAccountBalance.value.uiAmount);
      }
    } catch (err) {}
  }
};

export const getFisAllowance = (): AppThunk => (dispatch, getState) => {
  if (getState().rETHModule.ethAccount) {
    const address = getState().rETHModule.ethAccount.address;
    getTokenAllowance(address);
  }
};

export const getRSOLAllowance = (): AppThunk => (dispatch, getState) => {
  if (getState().rETHModule.ethAccount) {
    const address = getState().rETHModule.ethAccount.address;
    getTokenAllowance(address);
  }
};

const getTokenAllowance = async (solWalletAddress: string, cb?: Function) => {};

export const clickSwapToNativeLink = (stafiAddress: string) => {
  return 'https://stafi.subscan.io/account/' + stafiAddress;
};

export default ETHClice.reducer;
