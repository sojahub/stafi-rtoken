// @ts-nocheck

import { web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import { stringToHex, u8aToHex } from '@polkadot/util';
import { createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';
import { delay } from 'lodash';
import { rSymbol } from 'src/keyring/defaults';
import keyring from 'src/servers/index';
import RPoolServer from 'src/servers/rpool';
import StafiServer from 'src/servers/stafi';
import { stafi_uuid } from 'src/util/common';
import { AppThunk } from '../store';
import { setLoading } from './globalClice';
import { add_Notice, noticeStatus, noticesubType, noticeType } from './noticeClice';

const stafiServer = new StafiServer();
const rPoolServer = new RPoolServer();

const rPoolClice = createSlice({
  name: 'mintProgramsModule',
  initialState: {
    loadingList: false,
    rETHActs: [],
    rDOTActs: [],
    rMATICActs: [],
    rFISActs: [],
    rKSMActs: [],
    rATOMActs: [],
    rBNBActs: [],
    rSOLActs: [],
    loadComplete: false,
    totalLiquidity: '--',
    apyAvg: '--',
  },
  reducers: {
    setLoadingList(state, { payload }) {
      state.loadingList = payload;
    },
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
    setRFISActs(state, { payload }) {
      state.rFISActs = payload;
    },
    setRETHActs(state, { payload }) {
      state.rETHActs = payload;
    },
    setRKSMActs(state, { payload }) {
      state.rKSMActs = payload;
    },
    setRATOMActs(state, { payload }) {
      state.rATOMActs = payload;
    },
    setRBNBActs(state, { payload }) {
      state.rBNBActs = payload;
    },
    setRSOLActs(state, { payload }) {
      state.rSOLActs = payload;
    },
    setLoadComplete(state, { payload }) {
      state.loadComplete = payload;
    },
  },
});

export const {
  setLoadingList,
  setTotalLiquidity,
  setApyAvg,
  setRDOTActs,
  setRMATICActs,
  setRFISActs,
  setRETHActs,
  setRKSMActs,
  setRATOMActs,
  setRBNBActs,
  setRSOLActs,
  setLoadComplete,
} = rPoolClice.actions;

export const getMintPrograms =
  (showLoading?: boolean): AppThunk =>
  async (dispatch: any, getState: any) => {
    if (showLoading) {
      dispatch(setLoadingList(true));
    }

    Promise.all([
      dispatch(getREthMintInfo()),
      dispatch(getRSymbolMintInfo(rSymbol.Matic)),
      dispatch(getRSymbolMintInfo(rSymbol.Dot)),
      dispatch(getRSymbolMintInfo(rSymbol.Fis)),
      dispatch(getRSymbolMintInfo(rSymbol.Atom)),
      dispatch(getRSymbolMintInfo(rSymbol.Ksm)),
      dispatch(getRSymbolMintInfo(rSymbol.Bnb)),
      dispatch(getRSymbolMintInfo(rSymbol.Sol)),
    ])
      .then((values) => {
        delay(() => {
          dispatch(setLoadComplete(true));
        }, 300);
        dispatch(setLoadingList(false));
      })
      .catch((err) => {
        delay(() => {
          dispatch(setLoadComplete(true));
        }, 300);
        dispatch(setLoadingList(false));
      });
  };

const getREthMintInfo = (): AppThunk => async (dispatch: any, getState: any) => {
  const acts = await rPoolServer.getEthMintRewardActs();
  dispatch(setRETHActs(acts));
};

const getRSymbolMintInfo =
  (symbol: rSymbol): AppThunk =>
  async (dispatch: any, getState: any) => {
    const acts = await rPoolServer.getRTokenMintRewardActs(symbol);
    if (symbol === rSymbol.Dot) {
      dispatch(setRDOTActs(acts));
    }
    if (symbol === rSymbol.Matic) {
      dispatch(setRMATICActs(acts));
    }
    if (symbol === rSymbol.Fis) {
      dispatch(setRFISActs(acts));
    }
    if (symbol === rSymbol.Ksm) {
      dispatch(setRKSMActs(acts));
    }
    if (symbol === rSymbol.Atom) {
      dispatch(setRATOMActs(acts));
    }
    if (symbol === rSymbol.Bnb) {
      dispatch(setRBNBActs(acts));
    }
    if (symbol === rSymbol.Sol) {
      dispatch(setRSOLActs(acts));
    }
  };

export const claimFisReward =
  (fisAmount: any, claimIndexs: any, symbol: any, cycle: any, cb: Function): AppThunk =>
  async (dispatch: any, getState: any) => {
    dispatch(setLoading(true));
    const notice_uuid = stafi_uuid();
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
                    const txHash = tx.hash.toHex();
                    dispatch(setLoading(false));
                    dispatch(add_claim_Notice(notice_uuid, fisAmount, noticeStatus.Confirmed, { txHash: txHash }));
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

declare const ethereum: any;

export const claimREthFisReward =
  (fisAmount: any, claimIndexs: any, cycle: any, cb: Function): AppThunk =>
  async (dispatch: any, getState: any) => {
    dispatch(setLoading(true));
    const notice_uuid = stafi_uuid();
    const fisAddress = getState().FISModule.fisAccount.address;
    const ethAddress = getState().globalModule.metaMaskAddress;

    const keyringInstance = keyring.init('fis');
    const fisPubkey = u8aToHex(keyringInstance.decodeAddress(fisAddress), -1, false);
    const msg = stringToHex(fisPubkey);
    const signature = await ethereum
      .request({
        method: 'personal_sign',
        params: [ethAddress, msg],
      })
      .catch((err: any) => {
        message.error(err.message);
      });

    if (!signature) {
      dispatch(setLoading(false));
      return;
    }

    const stafiApi = await stafiServer.createStafiApi();
    let txs: Array<any> = [];
    claimIndexs.forEach((index: any) => {
      txs.push(stafiApi.tx.rClaim.claimRethReward(ethAddress, signature, Number(cycle), index));
    });

    if (txs.length > 0) {
      try {
        const tx = await stafiApi.tx.utility.batch(txs);

        if (tx) {
          web3Enable(stafiServer.getWeb3EnalbeName());
          const injector = await web3FromSource(stafiServer.getPolkadotJsSource());

          tx.signAndSend(fisAddress, { signer: injector.signer }, (result: any) => {
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
                    dispatch(add_claim_Notice(notice_uuid, fisAmount, noticeStatus.Confirmed, {}));
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

const add_claim_Notice =
  (uuid: string, amount: string, status: string, subData?: any): AppThunk =>
  async (dispatch, getState) => {
    dispatch(add_Notice(uuid, 'FIS', noticeType.Staker, noticesubType.Claim, amount, status, subData));
  };

export default rPoolClice.reducer;
