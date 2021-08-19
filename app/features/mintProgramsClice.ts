import { rSymbol } from '@keyring/defaults';
import { createSlice } from '@reduxjs/toolkit';
import StafiServer from '@servers/stafi';
import { AppThunk } from '../store';

const stafiServer = new StafiServer();

const rPoolClice = createSlice({
  name: 'mintProgramsModule',
  initialState: {
    rETHMintInfo: [],
    rDOTActs: [],
    rMATICActs: [],
    totalLiquidity: '--',
    apyAvg: '--',
  },
  reducers: {
    setTotalLiquidity(state, { payload }) {
      state.totalLiquidity = payload;
    },
    setApyAvg(state, { payload }) {
      state.apyAvg = payload;
    },
    setRDOTActs(state, { payload }) {
      state.rDOTActs = payload;
    },
    setRMATICActs(state, { payload }) {
      state.rMATICActs = payload;
    },
  },
});

export const { setTotalLiquidity, setApyAvg, setRDOTActs } = rPoolClice.actions;

export const getMintPrograms = (): AppThunk => async (dispatch, getState) => {
  dispatch(getRSymbolMintInfo(rSymbol.Dot));
  dispatch(getRSymbolMintInfo(rSymbol.Matic));
};

const getREthMintInfo =
  (symbol: rSymbol): AppThunk =>
  async (dispatch, getState) => {
    const stafiApi = await stafiServer.createStafiApi();
    const rethActLatestCycle = await stafiApi.query.rClaim.rethActLatestCycle();
    console.log('rethActLatestCycle', rethActLatestCycle);
  };

const getRSymbolMintInfo =
  (symbol: rSymbol): AppThunk =>
  async (dispatch, getState) => {
    const stafiApi = await stafiServer.createStafiApi();
    const actLatestCycle = await stafiApi.query.rClaim.actLatestCycle(symbol);
    if (actLatestCycle == 0) {
      console.log('empty mint info');
      dispatch(setRDOTActs([{ apy: 100 }]));
    } else {
      const acts = [];
      for (let i = 1; i <= actLatestCycle; i++) {
        let arr = [];
        arr.push(symbol);
        arr.push(i);
        const act = await stafiApi.query.rClaim.acts(arr);
        if (act.toJSON()) {
          acts.push(act.toJSON());
          // console.log('act', act.toJSON());
        }
      }
      if (symbol === rSymbol.Dot) {
        dispatch(setRDOTActs(acts));
      }
    }
  };

export default rPoolClice.reducer;
