// @ts-nocheck

import { web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import { stringToHex, u8aToHex } from '@polkadot/util';
import { SubmittableResult } from '@polkadot/api';
import { createSlice } from '@reduxjs/toolkit';
import { PublicKey } from '@solana/web3.js';
import { message } from 'antd';
import moment from 'moment';
import config, { getSymbolRTitle } from 'src/config/index';
import { query_rBalances_account as fis_query_rBalances_account } from 'src/features/FISClice';
import { query_rBalances_account as atom_query_rBalances_account } from 'src/features/rATOMClice';
import { query_rBalances_account as bnb_query_rBalances_account } from 'src/features/rBNBClice';
import { query_rBalances_account as dot_query_rBalances_account } from 'src/features/rDOTClice';
import { query_rBalances_account as ksm_query_rBalances_account } from 'src/features/rKSMClice';
import { query_rBalances_account as matic_query_rBalances_account } from 'src/features/rMATICClice';
import { query_rBalances_account as sol_query_rBalances_account } from 'src/features/rSOLClice';
import { rSymbol, Symbol } from 'src/keyring/defaults';
import { default as keyring, default as keyringInstance } from 'src/servers/index';
import RpcServer, { pageCount } from 'src/servers/rpc/index';
import SolServer from 'src/servers/sol/index';
import Stafi from 'src/servers/stafi/index';
import {
  getLocalStorageItem,
  Keys,
  removeLocalStorageItem,
  setLocalStorageItem,
  stafi_uuid,
  timeout,
} from 'src/util/common';
import localStorageUtil from 'src/util/localStorage';
import numberUtil from 'src/util/numberUtil';
import NumberUtil from 'src/util/numberUtil';
import StringUtil from 'src/util/stringUtil';
import { AppThunk } from '../store';
import {
  ETH_CHAIN_ID,
  SOL_CHAIN_ID,
  STAFI_CHAIN_ID,
  updateSwapParamsOfBep,
  updateSwapParamsOfErc,
} from './bridgeClice';
import CommonClice from './commonClice';
import {
  initProcess,
  processStatus,
  setLoading,
  setProcessMinting,
  setProcessSlider,
  setProcessStaking,
  setProcessSwapping,
  setProcessType,
  setStakeSwapLoadingStatus,
} from './globalClice';
import { add_Notice, noticeStatus, noticesubType, noticeType } from './noticeClice';

declare const ethereum: any;

const solServer = new SolServer();

const FISClice = createSlice({
  name: 'FISModule',
  initialState: {
    fisAccounts: [],
    fisAccount: getLocalStorageItem(Keys.FisAccountKey) && {
      ...getLocalStorageItem(Keys.FisAccountKey),
      balance: '--',
    },
    validPools: [],
    poolLimit: 0,
    transferrableAmountShow: '--',
    processParameter: null,
    stakeHash: getLocalStorageItem(Keys.FisStakeHash),
    ratio: '--',
    ratioShow: '--',
    tokenAmount: '--',
    estimateBondTxFees: 10000000000,
    estimateUnBondTxFees: 10000000000,
    bondSwitch: true,
    unbondCommission: '--',
    totalIssuance: '--',

    stakerApr: '--',
    bondFees: '--',
    totalUnbonding: '--',
    unBondFees: '--',
    withdrawToken: '--',
    unbondingToken: '--',
    leftDays: '--',
    unbondings: [],

    unbondWarn: false,
    currentLedgerData: '',

    nominateStatus: 0,
    lastReward: '--',
    currentCommission: '--',
    exposure: null,
    validatorAddressItems: [],
    showValidatorStatus: false,

    rewardList: [],
    rewardList_lastdata: null,

    rTokenStatDetail: null,
    lastEraRate: '--',
  },
  reducers: {
    setFisAccounts(state, { payload }) {
      const accounts = state.fisAccounts;
      const account = accounts.find((item: any) => {
        return item.address == payload.address;
      });
      if (account) {
        account.balance = payload.balance;
        account.name = payload.name;
      } else {
        state.fisAccounts.push(payload);
      }
    },
    setFisAccount(state, { payload }) {
      if (payload) {
        setLocalStorageItem(Keys.FisAccountKey, { address: payload.address });
      }
      state.fisAccount = payload;
    },
    setTransferrableAmountShow(state, { payload }) {
      state.transferrableAmountShow = payload;
    },
    setRatio(state, { payload }) {
      state.ratio = payload;
    },
    setRatioShow(state, { payload }) {
      state.ratioShow = payload;
    },
    setTokenAmount(state, { payload }) {
      state.tokenAmount = payload;
    },
    setPoolLimit(state, { payload }) {
      state.poolLimit = payload;
    },
    setValidPools(state, { payload }) {
      if (payload == null) {
        state.validPools = [];
      } else {
        state.validPools.push(payload);
      }
    },
    setStakeHash(state, { payload }) {
      if (payload == null) {
        removeLocalStorageItem(Keys.FisStakeHash);
        state.stakeHash = payload;
      } else {
        let param = { ...state.processParameter, ...payload };
        setLocalStorageItem(Keys.FisStakeHash, param)((state.stakeHash = payload));
      }
    },
    setProcessParameter(state, { payload }) {
      if (payload == null) {
        state.processParameter = payload;
      } else {
        let param = { ...state.processParameter, ...payload };
        state.processParameter = param;
      }
    },
    setBondSwitch(state, { payload }) {
      state.bondSwitch = payload;
    },
    setUnbondCommission(state, { payload }) {
      state.unbondCommission = payload;
    },

    setTotalIssuance(state, { payload }) {
      state.totalIssuance = payload;
    },

    setStakerApr(state, { payload }) {
      state.stakerApr = payload;
    },
    setBondFees(state, { payload }) {
      state.bondFees = payload;
    },
    setTotalUnbonding(state, { payload }) {
      state.bondFees = payload;
    },
    setUnBondFees(state, { payload }) {
      state.unBondFees = payload;
    },
    setWithdrawToken(state, { payload }) {
      state.withdrawToken = payload;
    },
    setUnbondingToken(state, { payload }) {
      state.unbondingToken = payload;
    },
    setLeftDays(state, { payload }) {
      state.leftDays = payload;
    },
    setUnbondings(state, { payload }) {
      state.unbondings = payload;
    },
    setUnbondWarn(state, { payload }) {
      state.unbondWarn = payload;
    },
    setCurrentLedgerData(state, { payload }) {
      state.currentLedgerData = payload;
    },

    setNominateStatus(state, { payload }) {
      state.nominateStatus = payload;
    },

    setLastReward(state, { payload }) {
      state.lastReward = payload;
    },
    setCurrentCommission(state, { payload }) {
      state.currentCommission = payload;
    },
    setExposure(state, { payload }) {
      state.exposure = payload;
    },
    setValidatorAddressItems(state, { payload }) {
      state.validatorAddressItems = payload;
    },
    setShowValidatorStatus(state, { payload }) {
      state.showValidatorStatus = payload;
    },

    setRewardList(state, { payload }) {
      state.rewardList = payload;
    },

    setRewardList_lastdata(state, { payload }) {
      state.rewardList_lastdata = payload;
    },
    setRTokenStatDetail(state, { payload }) {
      state.rTokenStatDetail = payload;
    },
    setLastEraRate(state, { payload }) {
      state.lastEraRate = payload;
    },
  },
});

const stafiServer = new Stafi();

const rpcServer = new RpcServer();
const commonClice = new CommonClice();
export const {
  setTokenAmount,
  setFisAccounts,
  setFisAccount,
  setTransferrableAmountShow,
  setRatio,
  setRatioShow,
  setValidPools,
  setPoolLimit,
  setProcessParameter,
  setStakeHash,
  setBondSwitch,
  setUnbondCommission,
  setTotalIssuance,
  setStakerApr,
  setBondFees,
  setTotalUnbonding,
  setUnBondFees,
  setWithdrawToken,
  setUnbondingToken,
  setLeftDays,
  setUnbondings,
  setUnbondWarn,
  setCurrentLedgerData,

  setNominateStatus,
  setLastReward,
  setCurrentCommission,
  setExposure,
  setValidatorAddressItems,
  setShowValidatorStatus,

  setRewardList,
  setRewardList_lastdata,
  setRTokenStatDetail,
  setLastEraRate,
} = FISClice.actions;

export const reloadData = (): AppThunk => async (dispatch, getState) => {
  const account = getState().FISModule.fisAccount;
  if (account) {
    dispatch(createSubstrate(account));
  }
  dispatch(query_rBalances_account());
  dispatch(balancesAll());
  dispatch(getTotalIssuance());
  dispatch(initValidatorStatus());
  dispatch(RefreshUnbonding());
  dispatch(getPools());
};
export const createSubstrate =
  (account: any): AppThunk =>
  async (dispatch, getState) => {
    dispatch(queryBalance(account));
  };

export const queryBalance =
  (account: any): AppThunk =>
  async (dispatch, getState) => {
    if (!account) {
      return;
    }
    dispatch(setFisAccounts(account));
    let account2: any = { ...account };
    const api = await stafiServer.createStafiApi();
    const result = await api.query.system.account(account2.address);
    if (result) {
      let fisFreeBalance = NumberUtil.fisAmountToHuman(result.data.free);
      account2.balance = NumberUtil.handleEthAmountRound(fisFreeBalance);
    }
    const fisAccount = getState().FISModule.fisAccount;
    if (fisAccount && fisAccount.address == account2.address) {
      dispatch(setFisAccount(account2));
    }
    dispatch(setFisAccounts(account2));
  };

export const queryTokenBalances = (): AppThunk => async (dispatch, getState) => {
  const account = getState().FISModule.fisAccount;
  if (account) {
    dispatch(createSubstrate(account));
  }
  dispatch(fis_query_rBalances_account());
  dispatch(ksm_query_rBalances_account());
  dispatch(dot_query_rBalances_account());
  dispatch(atom_query_rBalances_account());
  dispatch(sol_query_rBalances_account());
  dispatch(matic_query_rBalances_account());
  dispatch(bnb_query_rBalances_account());
};

export const transfer =
  (amountparam: number, destChainId: number, targetAddress: string, cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    const notice_uuid = stafi_uuid();
    const amount = NumberUtil.fisAmountToChain(amountparam);
    const poolLimit = getState().FISModule.poolLimit;
    const validPools = getState().FISModule.validPools;
    const selectedPool = commonClice.getFisPool(
      amount,
      validPools,
      poolLimit,
      'The cumulative FIS amount exceeds the pool limit, please try again later',
    );
    if (selectedPool == null) {
      return;
    }

    try {
      dispatch(
        setProcessParameter({
          destChainId,
          targetAddress,
        }),
      );
      dispatch(setLoading(true));
      web3Enable(stafiServer.getWeb3EnalbeName());
      const injector = await web3FromSource(stafiServer.getPolkadotJsSource());
      const stafiApi = await stafiServer.createStafiApi();
      let currentAccount = getState().FISModule.fisAccount.address;

      let bondResult;
      if (destChainId === STAFI_CHAIN_ID) {
        bondResult = stafiApi.tx.rFis.liquidityBond(selectedPool.address, amount.toString());
      } else {
        bondResult = stafiApi.tx.rFis.liquidityBondAndSwap(
          selectedPool.address,
          amount.toString(),
          targetAddress,
          destChainId,
        );
      }

      bondResult
        .signAndSend(currentAccount, { signer: injector.signer }, (result: any) => {
          if (result.status.isInBlock) {
            dispatch(setLoading(false));
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

                      let messageStr = 'Something is wrong, please try again later';
                      if (error.name == 'NominateSwitchClosed') {
                        messageStr = 'Unable to stake, system is waiting for matching validators';
                      } else if (error.name == 'LiquidityBondZero') {
                        messageStr = 'The amount should be larger than 0';
                      } else if (error.name == 'PoolLimitReached') {
                        messageStr = 'The cumulative FIS amount exceeds the pool limit, please try again later';
                      }
                      message.error(message);
                    } catch (error) {
                      message.error(error.message);
                    }
                  }
                } else if (method === 'ExtrinsicSuccess') {
                  message.success('Stake successfully');
                  dispatch(reloadData());
                  dispatch(
                    add_FIS_stake_Notice(
                      notice_uuid,
                      amountparam.toString(),
                      destChainId === STAFI_CHAIN_ID ? noticeStatus.Confirmed : noticeStatus.Swapping,
                      {
                        process: getState().globalModule.process,
                        processParameter: getState().FISModule.processParameter,
                      },
                    ),
                  );
                  // Set swap loading params for loading modal.
                  if (destChainId === ETH_CHAIN_ID) {
                    updateSwapParamsOfErc(dispatch, notice_uuid, 'rfis', 0, targetAddress, true);
                  } else {
                    updateSwapParamsOfBep(dispatch, notice_uuid, 'rfis', 0, targetAddress, true);
                  }
                  dispatch(setStakeSwapLoadingStatus(destChainId === STAFI_CHAIN_ID ? 0 : 2));
                  cb && cb();
                }
              });
          } else if (result.isError) {
            dispatch(setLoading(false));
            message.error(result.toHuman());
          }
        })
        .catch((error: any) => {
          dispatch(setLoading(false));
          message.error(error.message);
          if (error.message == 'Error: Cancelled') {
            message.error('Cancelled');
          } else {
            console.error(error.message);
          }
        });
    } catch (e: any) {}
  };

export const stakingSignature = async (address: any, data: any) => {
  await timeout(5000);
  web3Enable(stafiServer.getWeb3EnalbeName());
  const injector = await web3FromSource(stafiServer.getPolkadotJsSource());
  const signRaw = injector?.signer?.signRaw;
  const { signature } = await signRaw({
    address: address,
    data: data,
    type: 'bytes',
  });
  return signature;
};

export const feeStationSignature = async (address: any, data: any) => {
  web3Enable(stafiServer.getWeb3EnalbeName());
  const injector = await web3FromSource(stafiServer.getPolkadotJsSource());
  const signRaw = injector?.signer?.signRaw;
  const { signature } = await signRaw({
    address: address,
    data: data,
    type: 'bytes',
  });
  return signature;
};

export const solSignature = async (address: any, fisAddress: string) => {
  await timeout(1000);

  const fisKeyring = keyringInstance.init(Symbol.Fis);
  const solana = solServer.getProvider();
  if (!solana) {
    return null;
  }

  let pubkey = u8aToHex(fisKeyring.decodeAddress(fisAddress), -1, false);
  let { signature } = await solana.signMessage(new TextEncoder().encode(pubkey), 'utf8');

  if (!signature) {
    return null;
  }
  return u8aToHex(signature);
};

export const bound =
  (
    address: string,
    txhash: any,
    blockhash: any,
    amount: string,
    pooladdress: string,
    type: rSymbol,
    destChainId: number,
    targetAddress: string, // used in swap to erc20, bep20, spl
    cb?: Function,
  ): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(
        setProcessStaking({
          brocasting: processStatus.loading,
          packing: processStatus.default,
          finalizing: processStatus.default,
        }),
      );
      let fisAddress = getState().FISModule.fisAccount && getState().FISModule.fisAccount.address;
      const keyringInstance = keyring.init(Symbol.Fis);
      let signature = '';
      const stafiApi = await stafiServer.createStafiApi();
      let pubkey = '';
      let poolPubkey = pooladdress;
      if (type == rSymbol.Atom) {
        signature = config.rAtomAignature;
        pubkey = getState().rATOMModule.atomAccount.pubkey;
        txhash = '0x' + txhash;
        blockhash = '0x' + blockhash;

        message.info('Sending succeeded, proceeding staking');
      } else if (type == rSymbol.Matic) {
        await timeout(3000);
        const ethAddress = getState().rMATICModule.maticAccount.address;
        const fisPubkey = u8aToHex(keyringInstance.decodeAddress(fisAddress), -1, false);
        const msg = stringToHex(fisPubkey);
        pubkey = address;
        signature = await ethereum
          .request({
            method: 'personal_sign',
            params: [ethAddress, msg],
          })
          .catch((err: any) => {
            dispatch(
              setProcessStaking({
                brocasting: processStatus.failure,
              }),
            );
            message.error(err.message);
            throw err;
          });
        message.info('Signature succeeded, proceeding staking');
      } else if (type === rSymbol.Bnb) {
        await timeout(3000);
        const ethAddress = getState().rETHModule.ethAccount.address;
        const fisPubkey = u8aToHex(keyringInstance.decodeAddress(fisAddress), -1, false);
        const msg = stringToHex(fisPubkey);
        pubkey = address;
        signature = await ethereum
          .request({
            method: 'personal_sign',
            params: [ethAddress, msg],
          })
          .catch((err: any) => {
            dispatch(
              setProcessStaking({
                brocasting: processStatus.failure,
              }),
            );
            message.error(err.message);
            throw err;
          });
        message.info('Signature succeeded, proceeding staking');
      } else if (type == rSymbol.Sol) {
        try {
          signature = await solSignature(address, fisAddress);
          pubkey = u8aToHex(new PublicKey(getState().rSOLModule.solAccount.address).toBytes());
          message.info('Signature succeeded, proceeding staking');
        } catch (err) {
          dispatch(
            setProcessStaking({
              brocasting: processStatus.failure,
            }),
          );
          message.error(err.message);
          throw err;
        }
      } else {
        signature = await stakingSignature(address, u8aToHex(keyringInstance.decodeAddress(fisAddress)));
        pubkey = u8aToHex(keyringInstance.decodeAddress(address));

        message.info('Signature succeeded, proceeding staking');
      }

      await timeout(5000);

      web3Enable(stafiServer.getWeb3EnalbeName());
      const injector = await web3FromSource(stafiServer.getPolkadotJsSource());

      let bondResult: any;
      if (destChainId === STAFI_CHAIN_ID) {
        bondResult = await stafiApi.tx.rTokenSeries.liquidityBond(
          pubkey,
          signature,
          poolPubkey,
          blockhash,
          txhash,
          amount.toString(),
          type,
        );
      } else {
        let swapAddress;
        if (destChainId === SOL_CHAIN_ID) {
          const tokenAccount = await solServer.getTokenAccountPubkey(
            targetAddress,
            getSymbolRTitle(type).toLowerCase(),
          );
          console.log('spl token account', tokenAccount.toString());
          swapAddress = u8aToHex(tokenAccount.toBytes());
        } else {
          swapAddress = targetAddress;
        }
        bondResult = await stafiApi.tx.rTokenSeries.liquidityBondAndSwap(
          pubkey,
          signature,
          poolPubkey,
          blockhash,
          txhash,
          amount.toString(),
          type,
          swapAddress,
          destChainId,
        );
      }

      try {
        let index = 0;
        bondResult
          .signAndSend(fisAddress, { signer: injector.signer }, (result: any) => {
            if (index == 0) {
              dispatch(
                setProcessStaking({
                  brocasting: processStatus.loading,
                  packing: processStatus.default,
                  finalizing: processStatus.default,
                }),
              );
              dispatch(setProcessType(type));
              index = index + 1;
            }
            const tx = bondResult.hash.toHex();
            try {
              if (result.status.isInBlock) {
                dispatch(
                  setProcessStaking({
                    brocasting: processStatus.success,
                    packing: processStatus.loading,
                    checkTx: tx,
                  }),
                );

                result.events
                  .filter((e: any) => {
                    return e.event.section == 'system';
                  })
                  .forEach((data: any) => {
                    if (data.event.method === 'ExtrinsicFailed') {
                      const [dispatchError] = data.event.data;
                      if (dispatchError.isModule) {
                        try {
                          const mod = dispatchError.asModule;
                          const error = data.registry.findMetaError(
                            new Uint8Array([mod.index.toNumber(), mod.error.toNumber()]),
                          );

                          let messageStr: string = 'Something is wrong, please try again later';
                          if (error.name == '') {
                            messageStr = '';
                          }
                          messageStr && message.info(messageStr);
                        } catch (error) {
                          message.error(error.message);
                        }
                      }
                      dispatch(
                        setProcessStaking({
                          packing: processStatus.failure,
                        }),
                      );
                      cb && cb('failure');
                      dispatch(reloadData());
                    } else if (data.event.method === 'ExtrinsicSuccess') {
                      dispatch(
                        setProcessStaking({
                          packing: processStatus.success,
                          finalizing: processStatus.loading,
                        }),
                      );
                      cb && cb('loading');
                      dispatch(getMinting(type, txhash, blockhash, cb));
                      // dispatch(gSetTimeOut(() => {
                      //   dispatch(setProcessStaking({
                      //     finalizing: processStatus.failure,
                      //   }));
                      // }, 10 * 60 * 1000));
                      dispatch(reloadData());
                    }
                  });
              } else if (result.isError) {
                message.error(result.toHuman());
              }
              if (result.status.isFinalized) {
                dispatch(
                  setProcessStaking({
                    finalizing: processStatus.success,
                  }),
                );
                // cb && cb("loading");
                // gClearTimeOut();
              }
            } catch (e: any) {
              message.error(e.message);
            }
          })
          .catch((e: any) => {
            dispatch(setLoading(false));
            if (e == 'Error: Cancelled') {
              message.error('Cancelled');
              dispatch(
                setProcessStaking({
                  brocasting: processStatus.failure,
                }),
              );
              cb && cb('failure');
            } else {
              console.error(e);
            }
          });
      } catch (e) {
        console.error('signAndSend error:', e);
      }
    } catch (e) {
      dispatch(setLoading(false));
      if (e == 'Error: Cancelled' || e == 'Error: Transaction cancelled' || e == 'Error: Wallet disconnected') {
        message.error('Cancelled');
        dispatch(
          setProcessStaking({
            brocasting: processStatus.failure,
          }),
        );
        cb && cb('failure');
      } else {
        console.error(e);
        cb && cb('failure');
      }
    }
  };

export const balancesAll = (): AppThunk => async (dispatch, getState) => {
  if (!getState().FISModule.fisAccount) {
    return;
  }
  const api = await stafiServer.createStafiApi();
  const address = getState().FISModule.fisAccount.address;
  const result = await api.derive.balances.all(address);
  if (result) {
    const transferrableAmount = NumberUtil.tokenAmountToHuman(result.availableBalance, rSymbol.Fis);
    dispatch(setTransferrableAmountShow(NumberUtil.handleFisAmountToFixed(transferrableAmount)));
  }
};

export const rTokenRate = (): AppThunk => async (dispatch, getState) => {
  const ratio = await commonClice.rTokenRate(rSymbol.Fis);
  dispatch(setRatio(ratio));
};

export const fetchRTokenStatDetail =
  (cycle: number): AppThunk =>
  async (dispatch, getState) => {
    const data = await commonClice.rTokenStatDetail('Rfis', cycle);
    dispatch(setRTokenStatDetail(data));
  };

export const rTokenLedger = (): AppThunk => async (dispatch, getState) => {
  const stafiApi = await stafiServer.createStafiApi();
  const eraResult = await stafiApi.query.staking.activeEra();
  let currentEra = eraResult.toJSON().index;
  if (currentEra) {
    let rateResult = await stafiApi.query.rTokenRate.eraRate(rSymbol.Fis, currentEra - 1);
    const currentRate = rateResult.toJSON();
    const rateResult2 = await stafiApi.query.rTokenRate.eraRate(rSymbol.Fis, currentEra - 29);
    let lastRate = rateResult2.toJSON();
    dispatch(handleStakerApr(currentRate, lastRate));
  } else {
    dispatch(handleStakerApr());
  }
};

export const getLastEraRate = (): AppThunk => async (dispatch, getState) => {
  try {
    const stafiApi = await stafiServer.createStafiApi();
    const eraResult = await stafiApi.query.staking.activeEra();
    let currentEra = eraResult.toJSON().index;
    if (currentEra) {
      let rateResult = await stafiApi.query.rTokenRate.eraRate(rSymbol.Fis, currentEra - 1);
      const currentRate = rateResult.toJSON();
      const rateResult2 = await stafiApi.query.rTokenRate.eraRate(rSymbol.Fis, currentEra - 2);
      let lastRate = rateResult2.toJSON();
      console.log('rFIS getLastEraRate', lastRate, currentRate);
      if (Number(currentRate) <= Number(lastRate)) {
        dispatch(setLastEraRate(0));
      } else {
        dispatch(setLastEraRate(numberUtil.rTokenRateToHuman(Number(currentRate) - Number(lastRate))));
      }
    } else {
      console.log('rFIS getLastEraRate currentEra:', currentEra);
    }
  } catch (err: any) {
    console.log('err', err);
  }
};

const handleStakerApr =
  (currentRate?: any, lastRate?: any): AppThunk =>
  async (dispatch, getState) => {
    if (currentRate && lastRate) {
      const apr = NumberUtil.handleEthRoundToFixed(((currentRate - lastRate) / 1000000000000 / 7) * 365.25 * 100) + '%';
      dispatch(setStakerApr(apr));
    } else {
      dispatch(setStakerApr('16.0%'));
    }
  };

export const continueProcess = (): AppThunk => async (dispatch, getState) => {
  const stakeHash = getState().FISModule.stakeHash;
  if (stakeHash && stakeHash.blockHash && stakeHash.txHash) {
    dispatch(getBlock(stakeHash.blockHash, stakeHash.txHash));
  }
};

export const getBlock =
  (blockHash: string, txHash: string, cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    try {
      const api = await stafiServer.createStafiApi();
      const address = getState().FISModule.fisAccount && getState().FISModule.fisAccount.address;
      const validPools = getState().FISModule.validPools;
      const poolLimit = getState().FISModule.poolLimit;
      const result = await api.rpc.chain.getBlock(blockHash);
      let u = false;

      const processParameter = getState().FISModule.processParameter;
      const { destChainId, targetAddress } = processParameter;

      result.block.extrinsics.forEach((ex: any) => {
        if (ex.hash.toHex() == txHash) {
          const {
            method: { args, method, section },
          } = ex;
          if (section == 'balances' && (method == 'transfer' || method == 'transferKeepAlive')) {
            u = true;
            let amount = args[1].toJSON();
            let selectedPool = commonClice.getPool(amount, validPools, poolLimit);
            if (selectedPool == null) {
              return;
            }
            dispatch(
              initProcess({
                sending: {
                  packing: processStatus.success,
                  brocasting: processStatus.success,
                  finalizing: processStatus.success,
                },
              }),
            );
            dispatch(setProcessSlider(true));
            dispatch(
              setProcessParameter({
                staking: {
                  amount: amount,
                  txHash,
                  blockHash,
                  address,
                  type: rSymbol.Fis,
                  poolAddress: selectedPool.poolPubkey,
                },
              }),
            );
            bound(address, txHash, blockHash, amount, selectedPool.poolPubkey, rSymbol.Fis, destChainId, targetAddress);
          }
        }
      });

      if (!u) {
        message.error('No results were found');
      }
    } catch (e: any) {
      message.error(e.message);
    }
  };

export const getMinting =
  (type: number, txHash: string, blockHash: string, cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    dispatch(
      setProcessMinting({
        brocasting: processStatus.loading,
      }),
    );
    let bondSuccessParamArr: any[] = [];
    bondSuccessParamArr.push(blockHash);
    bondSuccessParamArr.push(txHash);
    let statusObj = {
      num: 0,
    };
    dispatch(
      rTokenSeries_bondStates(type, bondSuccessParamArr, statusObj, (e: any) => {
        if (e == 'successful') {
          dispatch(
            setProcessSwapping({
              brocasting: processStatus.loading,
            }),
          );
          message.success('Minting succeeded', 3, () => {
            cb && cb(e);
          });
        } else {
          cb && cb(e);
        }
      }),
    );
  };
export const bondStates =
  (type: number, txHash: any, blockHash: any, cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    const stafiApi = await stafiServer.createStafiApi();
    let bondSuccessParamArr: any[] = [];
    bondSuccessParamArr.push(blockHash);
    bondSuccessParamArr.push(txHash);
    const result = await stafiApi.query.rTokenSeries.bondStates(type, bondSuccessParamArr);
    let bondState = result.toJSON();
    if (bondState == 'Success') {
      cb && cb('successful');
    } else if (bondState == 'Fail') {
      cb && cb('failure');
    } else if (bondState == null) {
      cb && cb('stakingFailure');
    } else {
      cb && cb('pending');
    }
  };
export const rTokenSeries_bondStates =
  (type: number, bondSuccessParamArr: any, statusObj: any, cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    statusObj.num = statusObj.num + 1;
    const stafiApi = await stafiServer.createStafiApi();
    const result = await stafiApi.query.rTokenSeries.bondStates(type, bondSuccessParamArr);

    let bondState = result.toJSON();
    if (bondState == 'Success') {
      dispatch(
        setProcessMinting({
          brocasting: processStatus.success,
        }),
      );
      cb && cb('successful');
    } else if (bondState == 'Fail') {
      dispatch(
        setProcessMinting({
          brocasting: processStatus.failure,
        }),
      );
      cb && cb('failure');
    } else if (bondState == null) {
      cb && cb('stakingFailure');
    } else if (statusObj.num <= 40) {
      cb && cb('pending');
      setTimeout(() => {
        dispatch(rTokenSeries_bondStates(type, bondSuccessParamArr, statusObj, cb));
      }, 15000);
    } else {
      dispatch(
        setProcessMinting({
          brocasting: processStatus.failure,
        }),
      );
      cb && cb('failure');
    }
  };

export const query_rBalances_account = (): AppThunk => async (dispatch, getState) => {
  commonClice.query_rBalances_account(getState().FISModule.fisAccount, rSymbol.Fis, (data: any) => {
    if (data == null) {
      dispatch(setTokenAmount(NumberUtil.handleFisAmountToFixed(0)));
    } else {
      dispatch(setTokenAmount(NumberUtil.fisAmountToHuman(data.free)));
    }
  });
};

export const unbond =
  (amount: string, willAmount: any, cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setLoading(true));
      const validPools = getState().FISModule.validPools;
      let selectedPool = commonClice.getPoolForUnbond(
        amount,
        validPools,
        rSymbol.Fis,
        "'No pool available, please try again later",
      );
      if (selectedPool == null) {
        dispatch(setLoading(false));
        return;
      }
      let address = getState().FISModule.fisAccount && getState().FISModule.fisAccount.address;

      const stafiApi = await stafiServer.createStafiApi();

      web3Enable(stafiServer.getWeb3EnalbeName());
      const injector = await web3FromSource(stafiServer.getPolkadotJsSource());

      const api = await stafiApi.tx.rFis.liquidityUnbond(
        selectedPool.address,
        NumberUtil.tokenAmountToChain(amount, rSymbol.Fis).toString(),
      );

      api
        .signAndSend(address, { signer: injector.signer }, (result: SubmittableResult) => {
          if (result.status.isInBlock) {
            dispatch(setLoading(false));
            const uuid = stafi_uuid();
            result.events
              .filter(({ event: { section } }) => {
                return section === 'system';
              })
              .forEach(({ event: { data, section, method } }) => {
                if (method === 'ExtrinsicFailed') {
                  const [dispatchError] = data;
                  if (dispatchError.isModule) {
                    try {
                      const mod = dispatchError.asModule;
                      const error = data.registry.findMetaError(
                        new Uint8Array([mod.index.toNumber(), mod.error.toNumber()]),
                      );

                      let messageStr = 'Something is wrong, please try again later';
                      if (error.name === 'LiquidityUnbondZero') {
                        messageStr = 'The input amount should be larger than 0';
                      } else if (error.name === 'InsufficientBalance') {
                        messageStr = 'Insufficient balance';
                      }
                      message.error(messageStr);
                    } catch (error) {
                      message.error(error.message);
                    }
                    dispatch(add_FIS_unbond_Notice(uuid, willAmount, noticeStatus.Error));
                  }
                } else if (method === 'ExtrinsicSuccess') {
                  dispatch(reloadData());
                  message.success(
                    `Unbond successfully, you can withdraw your unbonded FIS ${config.unboundAroundDays(
                      Symbol.Fis,
                    )} days later`,
                  );
                  dispatch(add_FIS_unbond_Notice(uuid, willAmount, noticeStatus.Confirmed));
                  localStorageUtil.addRTokenUnbondRecords('rFIS', stafiServer, {
                    id: uuid,
                    estimateSuccessTime: moment().add(config.unboundAroundDays(Symbol.Fis), 'day').valueOf(),
                    amount: willAmount,
                    recipient: address,
                  });
                  cb && cb();
                }
              });
          } else if (result.isError) {
            dispatch(setLoading(false));
            message.error(result.toHuman());
          }
        })
        .catch((e: any) => {
          dispatch(setLoading(false));
          if (e == 'Error: Cancelled') {
            message.error('Cancelled');
            cb && cb();
          } else {
            console.error(e);
          }
        });
    } catch (e) {
      dispatch(setLoading(false));
    }
  };

export const fisUnbond =
  (amount: string, rSymbol: number, recipient: string, selectedPool: string, topstr: string, cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    try {
      const address = getState().FISModule.fisAccount && getState().FISModule.fisAccount.address;
      const stafiApi = await stafiServer.createStafiApi();
      web3Enable(stafiServer.getWeb3EnalbeName());

      const injector = await web3FromSource(stafiServer.getPolkadotJsSource());

      const api = await stafiApi.tx.rTokenSeries.liquidityUnbond(
        rSymbol,
        selectedPool,
        NumberUtil.tokenAmountToChain(amount, rSymbol).toString(),
        recipient,
      );

      api
        .signAndSend(address, { signer: injector.signer }, (result: any) => {
          try {
            if (result.status.isInBlock) {
              result.events
                .filter((e: any) => {
                  return e.event.section == 'system';
                })
                .forEach((data: any) => {
                  if (data.event.method === 'ExtrinsicSuccess') {
                    const txHash = api.hash.toHex();
                    dispatch(reloadData());
                    cb && cb('Success', txHash);
                    message.success(topstr);
                  } else if (data.event.method === 'ExtrinsicFailed') {
                    dispatch(reloadData());
                    cb && cb('Failed');
                    message.error('Unbond failure');
                  }
                });
            }
          } catch (e) {
            cb && cb('Failed');
          }
        })
        .catch((e: any) => {
          dispatch(setLoading(false));
          if (e == 'Error: Cancelled') {
            message.error('Cancelled');
            cb && cb('Cancel');
          } else {
            console.error(e);
          }
        });
    } catch (e: any) {
      message.error('Unbond failure');
      cb && cb('Failed');
    }
  };

export const bondSwitch = (): AppThunk => async (dispatch, getState) => {
  const stafiApi = await stafiServer.createStafiApi();
  const result = await stafiApi.query.rTokenSeries.bondSwitch();
  dispatch(setBondSwitch(result.toJSON()));
};

export const fis_bondSwitch = (): AppThunk => async (dispatch, getState) => {
  const stafiApi = await stafiServer.createStafiApi();
  const result = await stafiApi.query.rFis.nominateSwitch();
  dispatch(setBondSwitch(result.toJSON()));
};

export const getUnbondCommission = (): AppThunk => async (dispatch, getState) => {
  const stafiApi = await stafiServer.createStafiApi();
  const result = await stafiApi.query.rFis.unbondCommission();
  const unbondCommission = NumberUtil.fisFeeToHuman(result.toJSON());

  dispatch(setUnbondCommission(unbondCommission));
  //const unbondCommissionShow = NumberUtil.fisFeeToFixed(this.unbondCommission) + '%';
};

export default FISClice.reducer;

export const getTotalIssuance = (): AppThunk => async (dispatch, getState) => {
  const result = await commonClice.getTotalIssuance(rSymbol.Fis);
  dispatch(setTotalIssuance(result));
};
export const checkAddress = (stafiAddress: string) => {
  const keyringInstance = keyring.init('fis');
  return keyringInstance.checkAddress(stafiAddress);
};

export const bondFees = (): AppThunk => async (dispatch, getState) => {
  const result = await commonClice.bondFees(rSymbol.Fis);
  dispatch(setBondFees(result));
};

// export const accountUnbonds = (): AppThunk => async (dispatch, getState) => {
//   let fisAddress = getState().FISModule.fisAccount.address;

//   dispatch(getTotalUnbonding(fisAddress))
// }

// const getTotalUnbonding = (fisAddress: string): AppThunk => async (dispatch, getState) => {
//   // let fisAddress = getState().FISModule.fisAccount.address;
//   try {
//     const stafiApi = await stafiServer.createStafiApi();
//     const poolsData = await stafiApi.query.rFis.pools();
//     let pools = poolsData.toJSON();
//     const eraResult = await stafiApi.query.staking.currentEra();
//     let currentEra = eraResult.toJSON();
//     if (pools && pools.length > 0) {
//       let unbondingToken = 0;

//       pools.forEach(async (pool: any) => {
//         const unbondingData = await stafiApi.query.rFis.unbonding(fisAddress, pool.address);
//         let unbondings = unbondingData.toJSON();
//         if (unbondings && unbondings.length > 0) {
//           unbondings.forEach((unbonding: any) => {
//             if (currentEra < unbonding.era) {
//               unbondingToken += Number(unbonding.value);
//             }
//           });
//         }
//         dispatch(setTotalUnbonding(unbondingToken));

//       })
//     }
//   } catch (error) {

//   }
// }

export const unbondFees = (): AppThunk => async (dispatch, getState) => {
  const result = await commonClice.unbondFees(rSymbol.Fis);
  dispatch(setUnBondFees(result));
};

export const getPools =
  (cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    const data = await commonClice.fis_poolBalanceLimit();
    dispatch(setPoolLimit(data));

    commonClice.getFisPools((poolData: any) => {
      dispatch(setValidPools(poolData));
      cb && cb();
    });
  };

export const RefreshUnbonding = (): AppThunk => async (dispatch, getState) => {
  let currentAccount = getState().FISModule.fisAccount && getState().FISModule.fisAccount.address;
  const api = await stafiServer.createStafiApi();
  const eraResult = await api.query.staking.currentEra();
  let validPools: any[] = [];
  dispatch(setUnbondWarn(false));
  let currentEra = eraResult.toJSON();

  const poolsData = await api.query.rFis.pools();
  let pools = poolsData.toJSON();
  if (pools && pools.length > 0) {
    let unbondingToken = 0;
    let withdrawToken = 0;
    let eras: any[] = [];
    let unbondings_g: any[] = [];
    pools.forEach((pool: any) => {
      api.query.rFis.unbonding(currentAccount, pool).then((unbondingData: any) => {
        let unbondings = unbondingData.toJSON();
        if (unbondings && unbondings.length > 0) {
          unbondings_g.push({
            pool: pool,
            unlocks: unbondings,
          });
          dispatch(setUnbondings(unbondings_g));
          unbondings.forEach((unbonding: any) => {
            if (currentEra >= unbonding.era) {
              withdrawToken += Number(unbonding.value);
            } else {
              unbondingToken += Number(unbonding.value);
              eras.push(unbonding.era);
            }
          });
        }

        if (eras.length > 0) {
          let minEra = Math.min.apply(null, eras);
          const leftDays = ((minEra - currentEra) * 6) / 24;
          dispatch(setLeftDays(leftDays));
        } else {
          dispatch(setLeftDays('--'));
        }
        dispatch(setWithdrawToken(NumberUtil.handleFisAmountToFixed(NumberUtil.fisAmountToHuman(withdrawToken))));
        // this.withdrawToken = NumberUtil.handleFisAmountToFixed(NumberUtil.fisAmountToHuman(withdrawToken));
        dispatch(setUnbondingToken(NumberUtil.handleFisAmountToFixed(NumberUtil.fisAmountToHuman(unbondingToken))));
      });

      let count = 0;
      api.query.staking
        .ledger(pool)
        .then((ledgerData: any) => {
          count++;
          let ledger = ledgerData.toJSON();
          if (ledger && ledger.active > 0) {
            validPools.push({
              address: pool,
              active: ledger.active,
            });
          }
          if (count >= pools.length) {
            if (validPools.length <= 0) {
              dispatch(setUnbondWarn(true));
            }
          }
        })
        .catch((error: any) => {});
    });
  }
  // }).catch((error) => {});
};

export const withdraw =
  (cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
      const unbondings = getState().FISModule.unbondings;
      const withdrawToken = getState().FISModule.withdrawToken;
      web3Enable(stafiServer.getWeb3EnalbeName());
      const injector = await web3FromSource(stafiServer.getPolkadotJsSource());

      const api = await stafiServer.createStafiApi();

      const eraResult = await api.query.staking.currentEra();
      let currentEra = eraResult.toJSON();

      let currentAccount = getState().FISModule.fisAccount && getState().FISModule.fisAccount.address;

      let txs: any[] = [];

      unbondings.forEach((unbondingData) => {
        unbondingData.unlocks.some((unlock: any) => {
          if (currentEra >= unlock.era) {
            txs.push(api.tx.rFis.liquidityWithdrawUnbond(unbondingData.pool));
            return true;
          }
        });
      });

      if (txs.length <= 0) {
        dispatch(setLoading(false));
        message.error('Nothing to withdraw, please try again later!');
        return;
      }

      api.tx.utility
        .batch(txs)
        .signAndSend(currentAccount, { signer: injector.signer }, (result: any) => {
          if (result.status.isInBlock) {
            dispatch(setLoading(false));

            result.events
              .filter((data: any) => {
                const section = data.event.section;
                return section === 'system';
              })
              .forEach((item: any) => {
                const { data, method } = item.event;
                if (method === 'ExtrinsicFailed') {
                  const [dispatchError] = data;
                  if (dispatchError.isModule) {
                    try {
                      const mod = dispatchError.asModule;
                      const error = data.registry.findMetaError(
                        new Uint8Array([mod.index.toNumber(), mod.error.toNumber()]),
                      );

                      let messageStr = 'Something is wrong, please try again later!';
                      message.error(messageStr);
                    } catch (error) {
                      message.error(error.message);
                    }
                  }
                } else if (method === 'ExtrinsicSuccess') {
                  dispatch(reloadData());
                  cb && cb();
                  message.success('Withdraw successfully');
                  dispatch(add_FIS_Withdraw_Notice(stafi_uuid(), withdrawToken, noticeStatus.Confirmed));
                }
              });
          } else if (result.isError) {
            dispatch(setLoading(false));
            message.error(result.toHuman());
          }
        })
        .catch((error: any) => {
          dispatch(setLoading(false));
          message.error(error.message);
        });
    } catch (error) {
      dispatch(setLoading(false));
      message.error(error.message);
    }
  };

export const getCurrentLedgerData = (): AppThunk => async (dispatch, getState) => {
  if (!getState().FISModule.fisAccount) {
    return;
  }
  let currentAccount = getState().FISModule.fisAccount.address;
  const api = await stafiServer.createStafiApi();
  const ledgerData = await api.query.staking.ledger(currentAccount);
  let ledger = ledgerData.toJSON();
  dispatch(setCurrentLedgerData(ledger));
};

export const handleOnboard =
  (cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    dispatch(setLoading(true));

    web3Enable(stafiServer.getWeb3EnalbeName());
    const injector = await web3FromSource(stafiServer.getPolkadotJsSource());
    try {
      const api = await stafiServer.createStafiApi();
      let currentAccount = getState().FISModule.fisAccount && getState().FISModule.fisAccount.address;

      api.tx.rFis
        .onboard()
        .signAndSend(currentAccount, { signer: injector.signer }, (result: any) => {
          if (result.status.isInBlock) {
            dispatch(setLoading(false));
            result.events
              .filter((data: any) => {
                const section = data.event.section;
                return section === 'system';
              })
              .forEach((item: any) => {
                const { data, method } = item.event;
                if (method === 'ExtrinsicFailed') {
                  const [dispatchError] = data;
                  if (dispatchError.isModule) {
                    try {
                      const mod = dispatchError.asModule;
                      const error = data.registry.findMetaError(
                        new Uint8Array([mod.index.toNumber(), mod.error.toNumber()]),
                      );
                      if (error.name == 'AlreadyOnboard') {
                        message.info('You are already onboard');
                        cb && cb();
                      } else {
                        let messageStr = 'Something is wrong, please try again!';
                        if (error.name == 'NotController') {
                          messageStr = 'Please use your controller account';
                        } else if (error.name == 'NoSessionKey') {
                          messageStr = 'Please register your session key first';
                        } else if (error.name == 'ValidatorLimitReached') {
                          messageStr = 'The maximum number of onboarded validators has been reached';
                        }
                        message.error('You are already onboard');
                      }
                    } catch (error) {
                      message.error(error.message);
                    }
                  }
                } else if (method === 'ExtrinsicSuccess') {
                  dispatch(reloadData());
                  cb && cb();
                  message.success('Onboard successfully');
                }
              })
              .catch((e: any) => {
                dispatch(setLoading(false));
                if (e == 'Error: Cancelled') {
                  message.error('Cancelled');
                  cb && cb('Cancel');
                } else {
                  console.error(e);
                }
              });
          } else if (result.isError) {
            dispatch(setLoading(false));
            message.error(result.toHuman());
          }
        })
        .catch((error: any) => {
          dispatch(setLoading(false));
          message.error(error.message);
        });
    } catch (error) {
      dispatch(setLoading(false));
      message.error(error.message);
    }
  };

export const initValidatorStatus = (): AppThunk => async (dispatch, getState) => {
  const currentAddress = getState().FISModule.fisAccount && getState().FISModule.fisAccount.address;
  dispatch(setNominateStatus(0));
  const api = await stafiServer.createStafiApi();
  const eraData = await api.query.staking.currentEra();
  let era = eraData.toJSON();

  const ledgerData = await api.query.staking.ledger(currentAddress);
  let ledger = ledgerData.toJSON();
  if (ledger) {
    const validatorsData = await api.query.session.validators();
    let validators = validatorsData.toJSON();
    if (validators && validators.length > 0 && validators.indexOf(ledger.stash) != -1) {
      dispatch(setNominateStatus(1));
    }

    const result = await stafiServer.fetchStafiValidatorApr({
      validatorAddress: ledger.stash,
    });
    if (result.status == '80000') {
      if (result.data) {
        let reward = '0';
        if (result.data.rewards) {
          reward = result.data.rewards;
        }
        dispatch(setLastReward(NumberUtil.handleFisAmountToFixed(reward)));
      }
    }

    const exposureData = await api.query.staking.erasStakersClipped(era, ledger.stash);
    let exposure = exposureData.toJSON();
    if (exposure) {
      dispatch(setExposure(exposure));
      // this.totalStakedETHShow = NumberUtil.handleFisAmountToFixed(NumberUtil.fisAmountToHuman(exposure.total));
      // this.selfDepositedShow = NumberUtil.handleFisAmountToFixed(NumberUtil.fisAmountToHuman(exposure.own));
      let exposureOthers = exposure.others;
      let addressItems: any[] = [];
      if (exposureOthers.length > 0) {
        const poolsData = await api.query.rFis.pools();
        let pools = poolsData.toJSON();
        if (pools && pools.length > 0) {
          pools.forEach((pool: any) => {
            exposureOthers.some((other: any) => {
              if (other.who == pool) {
                addressItems.push({
                  address: pool,
                  shortAddress: StringUtil.replacePkh(pool, 4, 44),
                  era: era,
                  amount: NumberUtil.handleFisAmountToFixed(NumberUtil.fisAmountToHuman(other.value)),
                });
                return true;
              }
            });
          });
          dispatch(setValidatorAddressItems(addressItems));
        }
      }
    }

    try {
      const validatorData = await api.query.staking.validators(ledger.stash);
      let validatorPrefs = validatorData.toJSON();
      if (validatorPrefs) {
        let feeToHuman = NumberUtil.fisFeeToHuman(validatorPrefs.commission);
        dispatch(setCurrentCommission(NumberUtil.fisFeeToFixed(feeToHuman) + '%'));
      }
    } catch (error: any) {
      console.error(error.message);
    }
  }
};

export const handleOffboard =
  (cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    dispatch(setLoading(true));
    web3Enable(stafiServer.getWeb3EnalbeName());
    const injector = await web3FromSource(stafiServer.getPolkadotJsSource());
    const api = await stafiServer.createStafiApi();

    let currentAccount = getState().FISModule.fisAccount.address;

    api.tx.rFis
      .offboard()
      .signAndSend(currentAccount, { signer: injector.signer }, (result: any) => {
        if (result.status.isInBlock) {
          dispatch(setLoading(false));

          result.events
            .filter((data: any) => {
              const section = data.event.section;
              return section === 'system';
            })
            .forEach((item: any) => {
              const { data, method } = item.event;
              if (method === 'ExtrinsicFailed') {
                const [dispatchError] = data;
                if (dispatchError.isModule) {
                  try {
                    const mod = dispatchError.asModule;
                    const error = data.registry.findMetaError(
                      new Uint8Array([mod.index.toNumber(), mod.error.toNumber()]),
                    );

                    let messageStr = 'Something is wrong, please try again!';
                    if (error.name == 'NotController') {
                      messageStr = 'Please use your controller account';
                    }
                    message.error(messageStr);
                  } catch (error) {
                    message.error(error.message);
                  }
                }
              } else if (method === 'ExtrinsicSuccess') {
                cb && cb();
                dispatch(reloadData());
                message.success('Offboard successfully');
              }
            })
            .catch((e: any) => {
              dispatch(setLoading(false));
              if (e == 'Error: Cancelled') {
                message.error('Cancelled');
                cb && cb('Cancel');
              } else {
                console.error(e);
              }
            });
        } else if (result.isError) {
          dispatch(setLoading(false));
          message.error(result.toHuman());
        }
      })
      .catch((error: any) => {
        dispatch(setLoading(false));
        message.error(error.message);
      });
  };

export const onboardValidators =
  (cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    try {
      const api = await stafiServer.createStafiApi();
      const currentAddress = getState().FISModule.fisAccount.address;
      const result = await api.query.rFis.onboardValidators();
      let validators = result.toJSON();
      if (validators && validators.length > 0) {
        const ledgerData = await api.query.staking.ledger(currentAddress);
        let ledger = ledgerData.toJSON();
        if (ledger) {
          if (validators.indexOf(ledger.stash) != -1) {
            dispatch(setShowValidatorStatus(true));
            cb && cb();
          }
        }
      }
    } catch (error) {}
  };

const add_FIS_stake_Notice =
  (uuid: string, amount: string, status: string, subData?: any): AppThunk =>
  async (dispatch, getState) => {
    dispatch(add_FIS_Notice(uuid, noticeType.Staker, noticesubType.Stake, amount, status, subData));
  };
const add_FIS_unbond_Notice =
  (uuid: string, amount: string, status: string, subData?: any): AppThunk =>
  async (dispatch, getState) => {
    dispatch(add_FIS_Notice(uuid, noticeType.Staker, noticesubType.Unbond, amount, status, subData));
  };
const add_FIS_Withdraw_Notice =
  (uuid: string, amount: string, status: string, subData?: any): AppThunk =>
  async (dispatch, getState) => {
    dispatch(add_FIS_Notice(uuid, noticeType.Staker, noticesubType.Withdraw, amount, status, subData));
  };
const add_FIS_Swap_Notice =
  (uuid: string, amount: string, status: string, subData?: any): AppThunk =>
  async (dispatch, getState) => {
    dispatch(add_FIS_Notice(uuid, noticeType.Staker, noticesubType.Swap, amount, status, subData));
  };
const add_FIS_Notice =
  (uuid: string, type: string, subType: string, content: string, status: string, subData?: any): AppThunk =>
  async (dispatch, getState) => {
    dispatch(add_Notice(uuid, Symbol.Fis, type, subType, content, status, subData));
  };

export const getReward =
  (pageIndex: Number, cb: Function): AppThunk =>
  async (dispatch, getState) => {
    const stafiSource = getState().FISModule.fisAccount && getState().FISModule.fisAccount.address;
    const ethSource = getState().rETHModule.ethAccount;
    dispatch(setLoading(true));
    try {
      if (pageIndex == 0) {
        dispatch(setRewardList([]));
        dispatch(setRewardList_lastdata(null));
      }
      const result = await rpcServer.getReward(stafiSource, ethSource ? ethSource.address : '', rSymbol.Fis, pageIndex);
      if (result.status == 80000) {
        const rewardList = getState().FISModule.rewardList;
        if (result.data.rewardList.length > 0) {
          const list = result.data.rewardList.map((item: any) => {
            const rate = NumberUtil.rTokenRateToHuman(item.rate);
            const rbalance = NumberUtil.tokenAmountToHuman(item.rbalance, rSymbol.Fis);
            return {
              ...item,
              rbalance: rbalance,
              rate: rate,
            };
          });
          if (result.data.rewardList.length <= pageCount) {
            dispatch(setRewardList_lastdata(null));
          } else {
            dispatch(setRewardList_lastdata(list[list.length - 1]));
            list.pop();
          }
          dispatch(setRewardList([...rewardList, ...list]));
          dispatch(setLoading(false));
          if (result.data.rewardList.length <= pageCount) {
            cb && cb(false);
          } else {
            cb && cb(true);
          }
        } else {
          dispatch(setLoading(false));
          cb && cb(false);
        }
      } else {
        dispatch(setLoading(false));
      }
    } catch (error) {
      dispatch(setLoading(false));
    }
  };
