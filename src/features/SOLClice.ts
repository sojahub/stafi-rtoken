// @ts-nocheck

import { createSlice } from '@reduxjs/toolkit';
import { Connection } from '@solana/web3.js';
import config from 'src/config/index';
import SolServer from 'src/servers/sol';
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
  const address = getState().rSOLModule.solAddress;
  getAssetBalance(address, 'fis', (v: any) => {
    dispatch(setFisBalance(v));
  });
};

export const getRSOLAssetBalance = (): AppThunk => (dispatch, getState) => {
  const address = getState().rSOLModule.solAddress;
  getAssetBalance(address, 'rsol', (v: any) => {
    dispatch(setRSOLBalance(v));
  });
};

export const getAssetBalance = async (address: string, tokenType: string, cb?: Function) => {
  if (!address) {
    cb('--');
    return;
  }

  const tokenAccountPubkey = await solServer.getTokenAccountPubkey(address, tokenType);
  if (tokenAccountPubkey) {
    const connection = new Connection(config.solRpcApi(), {
      wsEndpoint: config.solRpcWs(),
      commitment: 'singleGossip',
    });
    const tokenAccountBalance = await connection.getTokenAccountBalance(tokenAccountPubkey);
    if (tokenAccountBalance && tokenAccountBalance.value) {
      cb && cb(tokenAccountBalance.value.uiAmount);
    }
  } else {
    cb && cb('--');
  }
};

export const getFisAllowance = (): AppThunk => (dispatch, getState) => {
  if (getState().globalModule.metaMaskAddress) {
    getTokenAllowance(getState().globalModule.metaMaskAddress);
  }
};

export const getRSOLAllowance = (): AppThunk => (dispatch, getState) => {
  if (getState().globalModule.metaMaskAddress) {
    getTokenAllowance(getState().globalModule.metaMaskAddress);
  }
};

const getTokenAllowance = async (solWalletAddress: string, cb?: Function) => {};

export const clickSwapToNativeLink = (stafiAddress: string) => {
  return 'https://stafi.subscan.io/account/' + stafiAddress;
};

export default ETHClice.reducer;
