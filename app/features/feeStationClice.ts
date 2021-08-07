import { createSlice } from '@reduxjs/toolkit';
import FeeStationServer from '@servers/feeStation';
import StafiServer from '@servers/stafi';
import { AppThunk } from '../store';
import { add_Notice, noticesubType, noticeType } from './noticeClice';

const stafiServer = new StafiServer();
const feeStationServer = new FeeStationServer();

const feeStationClice = createSlice({
  name: 'feeStationModule',
  initialState: {
    // 0-invisible, 1-start transferring, 2-start minting
    swapLoadingStatus: 0,
    swapWaitingTime: 150,
  },
  reducers: {
    setSwapLoadingStatus(state, { payload }) {
      state.swapLoadingStatus = payload;
    },
    setSwapWaitingTime(state, { payload }) {
      state.swapWaitingTime = payload;
    },
  },
});

export const { setSwapLoadingStatus, setSwapWaitingTime } = feeStationClice.actions;

export const reloadData = (): AppThunk => async (dispatch: any, getState: any) => {
  const res = await feeStationServer.getPoolInfo();
};

const add_Swap_Notice =
  (uuid: string, token: string, amount: string, status: string, subData: any): AppThunk =>
  async (dispatch, getState) => {
    dispatch(add_Notice(uuid, token, noticeType.Staker, noticesubType.DexSwap, amount, status, subData));
  };

export default feeStationClice.reducer;
