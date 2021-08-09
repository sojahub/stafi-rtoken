import { createSlice } from '@reduxjs/toolkit';
import FeeStationServer from '@servers/feeStation';
import PolkadotServer from '@servers/polkadot/index';
import StafiServer from '@servers/stafi';
import numberUtil from '@util/numberUtil';
import { AppThunk } from '../store';
import { add_Notice, noticesubType, noticeType } from './noticeClice';

const stafiServer = new StafiServer();
const feeStationServer = new FeeStationServer();
const polkadotServer = new PolkadotServer();

const feeStationClice = createSlice({
  name: 'feeStationModule',
  initialState: {
    swapLimit: '--',
    // Example -> "symbol": "ATOM", "poolAddress": "cosmos19zfpgad0sup6d65hcs9aug7jzq3fe2d89tqvmr", "swapRate": "7590000"
    poolInfoList: [],
    // 0-invisible, 1-start transferring, 2-start minting
    swapLoadingStatus: 0,
    swapWaitingTime: 30,
  },
  reducers: {
    setSwapLimit(state, { payload }) {
      state.swapLimit = payload;
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

export const { setPoolInfoList, setSwapLimit, setSwapLoadingStatus, setSwapWaitingTime } = feeStationClice.actions;

export const reloadData = (): AppThunk => async (dispatch: any, getState: any) => {
  const res = await feeStationServer.getPoolInfo();
  if (res.status === '80000' && res.data) {
    if (!isNaN(res.data.swapLimit)) {
      dispatch(setSwapLimit(numberUtil.fisAmountToHuman(res.data.swapLimit)));
    }
    dispatch(setPoolInfoList(res.data.poolInfoList));
  }
};

export const uploadSwapInfo =
  (params: any): AppThunk =>
  async (dispatch: any, getState: any) => {
    console.log('uploadSwapInfo params:', params);
    const res = await feeStationServer.postSwapInfo(params);
  };

const add_Swap_Notice =
  (uuid: string, token: string, amount: string, status: string, subData: any): AppThunk =>
  async (dispatch, getState) => {
    dispatch(add_Notice(uuid, token, noticeType.Staker, noticesubType.DexSwap, amount, status, subData));
  };

export default feeStationClice.reducer;
