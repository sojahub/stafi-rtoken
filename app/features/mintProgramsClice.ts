import { rSymbol } from '@keyring/defaults';
import { web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import { createSlice } from '@reduxjs/toolkit';
import StafiServer from '@servers/stafi';
import { message } from 'antd';
import { AppThunk } from '../store';
import { setLoading } from './globalClice';

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

export const { setTotalLiquidity, setApyAvg, setRDOTActs, setRMATICActs } = rPoolClice.actions;

export const getMintPrograms = (): AppThunk => async (dispatch: any, getState: any) => {
  dispatch(getRSymbolMintInfo(rSymbol.Dot));
  dispatch(getRSymbolMintInfo(rSymbol.Matic));
};

const getREthMintInfo =
  (symbol: rSymbol): AppThunk =>
  async (dispatch: any, getState: any) => {
    const stafiApi = await stafiServer.createStafiApi();
    const rethActLatestCycle = await stafiApi.query.rClaim.rethActLatestCycle();
    console.log('rethActLatestCycle', rethActLatestCycle);
  };

const getRSymbolMintInfo =
  (symbol: rSymbol): AppThunk =>
  async (dispatch: any, getState: any) => {
    const stafiApi = await stafiServer.createStafiApi();
    const actLatestCycle = await stafiApi.query.rClaim.actLatestCycle(symbol);
    if (actLatestCycle == 0) {
      console.log('empty mint info');
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
      if (symbol === rSymbol.Matic) {
        dispatch(setRMATICActs(acts));
      }
    }
  };

export const claimFisReward =
  (claimIndexs: any, symbol: any, cycle: any, cb: Function): AppThunk =>
  async (dispatch: any, getState: any) => {
    dispatch(setLoading(true));
    const stafiApi = await stafiServer.createStafiApi();
    let txs: Array<any> = [];
    claimIndexs.forEach((index: any) => {
      txs.push(stafiApi.tx.rClaim.claimRtokenReward(Number(symbol), Number(cycle), index));
    });

    if (txs.length > 0) {
      try {
        const tx = await stafiApi.tx.utility.batch(txs);

        if (tx) {
          let currentAccount = getState().FISModule.fisAccount.address;
          web3Enable(stafiServer.getWeb3EnalbeName());
          const injector = await web3FromSource(stafiServer.getPolkadotJsSource());

          tx.signAndSend(currentAccount, { signer: injector.signer }, (result: any) => {
            if (result.status.isInBlock) {
              result.events
                .filter((result2: any) => () => {
                  const section = result2.event.section;
                  return section === 'system';
                })
                .forEach((result3: any) => {
                  const data = result3.event.data;
                  const method = result3.event.method;
                  if (method === 'ExtrinsicFailed') {
                    const [dispatchError] = data;
                    if (dispatchError.isModule) {
                      try {
                        const mod = dispatchError.asModule;
                        const error = data.registry.findMetaError(
                          new Uint8Array([mod.index.toNumber(), mod.error.toNumber()]),
                        );

                        let messageStr = 'Something is wrong, please try again later!';
                        if (error.name == 'NominateSwitchClosed') {
                          messageStr = 'Unable to stake, system is waiting for matching validators';
                        } else if (error.name == 'LiquidityBondZero') {
                          messageStr = 'The amount should be larger than 0';
                        } else if (error.name == 'PoolLimitReached') {
                          messageStr = 'The cumulative FIS amount exceeds the pool limit, please try again later!';
                        } else if (error.name == 'InsufficientFis') {
                          messageStr = 'Insufficient balance of the pool, please try again later!';
                        }
                        message.error(message);
                      } catch (error) {
                        message.error(error.message);
                      }
                      dispatch(setLoading(false));
                    }
                  } else if (method === 'ExtrinsicSuccess') {
                    dispatch(setLoading(false));
                    message.success('Claim successfully');
                    cb();
                  }
                });
            } else if (result.isError) {
              dispatch(setLoading(false));
              message.error(result.toHuman());
            }
          }).catch((error: any) => {
            dispatch(setLoading(false));
            message.error(error.message);
            if (error.message == 'Error: Cancelled') {
              message.error('Cancelled');
            } else {
              console.error(error.message);
            }
          });
        } else {
          dispatch(setLoading(false));
          message.error('Error: please try again');
        }
      } catch (error: any) {
        message.error(error.message);
        dispatch(setLoading(false));
      }
    } else {
      dispatch(setLoading(false));
      message.error('No txs found');
    }
  };

export default rPoolClice.reducer;
