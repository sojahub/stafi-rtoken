import { createSlice } from '@reduxjs/toolkit';
import FeeStationServer from '@servers/feeStation';
import PolkadotServer from '@servers/polkadot/index';
import StafiServer from '@servers/stafi';
import numberUtil from '@util/numberUtil';
import { message } from 'antd';
import { AppThunk } from '../store';
import { add_Notice, noticesubType, noticeType } from './noticeClice';

const stafiServer = new StafiServer();
const feeStationServer = new FeeStationServer();
const polkadotServer = new PolkadotServer();

const feeStationClice = createSlice({
  name: 'feeStationModule',
  initialState: {
    swapMaxLimit: '--',
    swapMinLimit: '--',
    // Example -> "symbol": "ATOM", "poolAddress": "cosmos19zfpgad0sup6d65hcs9aug7jzq3fe2d89tqvmr", "swapRate": "7590000"
    poolInfoList: [],
    // 0-invisible, 1-start transferring, 2-start minting, 3-pause
    swapLoadingStatus: 0,
    swapWaitingTime: 150,
  },
  reducers: {
    setSwapMaxLimit(state, { payload }) {
      state.swapMaxLimit = payload;
    },
    setSwapMinLimit(state, { payload }) {
      state.swapMinLimit = payload;
    },
    setPoolInfoList(state, { payload }) {
      state.poolInfoList = payload;
    },
    setSwapLoadingStatus(state, { payload }) {
      state.swapLoadingStatus = payload;
    },
    setSwapWaitingTime(state, { payload }) {
      state.swapWaitingTime = payload;
    },
  },
});

export const { setPoolInfoList, setSwapMaxLimit, setSwapMinLimit, setSwapLoadingStatus, setSwapWaitingTime } =
  feeStationClice.actions;

export const reloadData = (): AppThunk => async (dispatch: any, getState: any) => {
  const res = await feeStationServer.getPoolInfo();
  if (res.status === '80000' && res.data) {
    dispatch(setSwapMaxLimit(numberUtil.fisAmountToHuman(res.data.swapMaxLimit)));
    dispatch(setSwapMinLimit(numberUtil.fisAmountToHuman(res.data.swapMinLimit)));
    dispatch(setPoolInfoList(res.data.poolInfoList));
  }
};

export const uploadSwapInfo =
  (params: any): AppThunk =>
  async (dispatch: any, getState: any) => {
    // console.log('uploadSwapInfo params:', params);
    const res = await feeStationServer.postSwapInfo(params);
    if (res.status === '80014') {
      dispatch(setSwapLoadingStatus(0));
      message.error('Error: Slippage exceeded');
    } else if (res.status === '80006') {
      dispatch(setSwapLoadingStatus(0));
      message.error('Failed to verify signature.');
    } else if (res.status !== '80000') {
      dispatch(setSwapLoadingStatus(0));
      message.error('Something is wrong, please try again later.');
    }
  };

const add_Swap_Notice =
  (uuid: string, token: string, amount: string, status: string, subData: any): AppThunk =>
  async (dispatch, getState) => {
    dispatch(add_Notice(uuid, token, noticeType.Staker, noticesubType.DexSwap, amount, status, subData));
  };

export default feeStationClice.reducer;
