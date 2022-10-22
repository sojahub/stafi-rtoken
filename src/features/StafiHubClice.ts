// @ts-nocheck

import { createSlice } from '@reduxjs/toolkit';
import { rSymbol } from 'src/keyring/defaults';
import StafihubServer from 'src/servers/stafihub';
import numberUtil from 'src/util/numberUtil';
import { AppThunk } from '../store';

const stafihubServer = new StafihubServer();

const StafiHubClice = createSlice({
  name: 'StafiHubModule',
  initialState: {
    stafiHubAddress: '',
    fisBalance: '--',
    rAtomBalance: '--',
  },
  reducers: {
    setStafiHubAddress(state, { payload }) {
      state.stafiHubAddress = payload;
    },
    setFisBalance(state, { payload }) {
      state.fisBalance = payload;
    },
    setRAtomBalance(state, { payload }) {
      state.rAtomBalance = payload;
    },
  },
});

export const { setFisBalance, setRAtomBalance, setStafiHubAddress } = StafiHubClice.actions;

export const getStafiHubBalanceAll = (): AppThunk => (dispatch, getState) => {
  dispatch(getStafiHubFisAssetBalance());
  dispatch(getStafiHubRAtomAssetBalance());
};

export const getStafiHubFisAssetBalance = (): AppThunk => (dispatch, getState) => {
  const address = getState().StafiHubModule.stafiHubAddress;
  getAssetBalance(address, 'ufis', (v: any) => {
    if (isNaN(Number(v))) {
      return;
    }
    dispatch(setFisBalance(v));
  });
};

export const getStafiHubRAtomAssetBalance = (): AppThunk => (dispatch, getState) => {
  const address = getState().StafiHubModule.stafiHubAddress;
  getAssetBalance(address, 'uratom', (v: any) => {
    if (isNaN(Number(v))) {
      return;
    }
    dispatch(setRAtomBalance(v));
  });
};

export const getAssetBalance = async (address: string, tokenDenom: string, cb?: Function) => {
  if (!address) {
    cb('--');
    return;
  }

  try {
    const client = await stafihubServer.createApi();
    let balances = await client.getAllBalances(address);

    const coin = balances.find((item) => item.denom === tokenDenom);

    if (coin) {
      const format = numberUtil.tokenAmountToHuman(coin.amount, rSymbol.StafiHub);
      cb && cb(format.toFixed(6));
    } else {
      cb && cb('0');
    }
  } catch {
    cb('--');
  }
};

export default StafiHubClice.reducer;
