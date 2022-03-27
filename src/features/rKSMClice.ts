// @ts-nocheck

import { web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import { u8aToHex } from '@polkadot/util';
import { createSlice } from '@reduxjs/toolkit';
import { message as M, message } from 'antd';
import moment from 'moment';
import PubSub from 'pubsub-js';
import config from 'src/config/index';
import { rSymbol, Symbol } from 'src/keyring/defaults';
import FeeStationServer from 'src/servers/feeStation';
import keyring from 'src/servers/index';
import PolkadotServer from 'src/servers/ksm/index';
import RpcServer, { pageCount } from 'src/servers/rpc/index';
import Stafi from 'src/servers/stafi/index';
import { getLocalStorageItem, Keys, removeLocalStorageItem, setLocalStorageItem, stafi_uuid } from 'src/util/common';
import localStorageUtil from 'src/util/localStorage';
import numberUtil from 'src/util/numberUtil';
import NumberUtil from 'src/util/numberUtil';
import { AppThunk } from '../store';
import { ETH_CHAIN_ID, STAFI_CHAIN_ID, updateSwapParamsOfBep, updateSwapParamsOfErc } from './bridgeClice';
import CommonClice from './commonClice';
import { setSwapLoadingStatus, uploadSwapInfo } from './feeStationClice';
import { bondStates, bound, feeStationSignature, fisUnbond, rTokenSeries_bondStates } from './FISClice';
import {
  initProcess,
  processStatus,
  setLoading,
  setProcessDestChainId,
  setProcessSending,
  setProcessSlider,
  setProcessType,
  setStakeSwapLoadingStatus,
  trackEvent,
} from './globalClice';
import { add_Notice, findUuid, noticeStatus, noticesubType, noticeType } from './noticeClice';

const commonClice = new CommonClice();
const feeStationServer = new FeeStationServer();
const polkadotServer = new PolkadotServer();
const stafiServer = new Stafi();
const rpcServer = new RpcServer();

const rKSMClice = createSlice({
  name: 'rKSMModule',
  initialState: {
    ksmAccounts: [],
    ksmAccount: getLocalStorageItem(Keys.KsmAccountKey) && {
      ...getLocalStorageItem(Keys.KsmAccountKey),
      balance: '--',
    },
    validPools: [],
    poolLimit: 0,
    transferrableAmountShow: '--',
    ratio: '--',
    ratioShow: '--',
    tokenAmount: '--',
    processParameter: null,
    stakeHash: getLocalStorageItem(Keys.KsmStakeHash),
    unbondCommission: '--',
    bondFees: '--',
    unBondFees: '--',
    totalIssuance: '--',
    stakerApr: '--',
    ercBalance: '--',
    totalUnbonding: null,
    rewardList: [],
    rewardList_lastdata: null,
    lastEraRate: '--',
  },
  reducers: {
    setKsmAccounts(state, { payload }) {
      const accounts = state.ksmAccounts;
      const account = accounts.find((item: any) => {
        return item.address == payload.address;
      });
      if (account) {
        account.balance = payload.balance;
        account.name = payload.name;
      } else {
        state.ksmAccounts.push(payload);
      }
    },
    setKsmAccount(state, { payload }) {
      if (payload) {
        setLocalStorageItem(Keys.KsmAccountKey, { address: payload.address });
      }
      state.ksmAccount = payload;
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
    setProcessParameter(state, { payload }) {
      if (payload == null) {
        // removeLocalStorageItem(Keys.KsmProcessParameter)
        state.processParameter = payload;
      } else {
        let param = { ...state.processParameter, ...payload };
        // setLocalStorageItem(Keys.KsmProcessParameter,param),
        state.processParameter = param;
      }
    },
    setStakeHash(state, { payload }) {
      if (payload == null) {
        removeLocalStorageItem(Keys.KsmStakeHash);
        state.stakeHash = payload;
      } else {
        setLocalStorageItem(Keys.KsmStakeHash, payload);
        state.stakeHash = payload;
      }
    },
    setValidPools(state, { payload }) {
      if (payload == null) {
        state.validPools = [];
      } else {
        state.validPools.push(payload);
      }
    },
    setPoolLimit(state, { payload }) {
      state.poolLimit = payload;
    },
    setUnbondCommission(state, { payload }) {
      state.unbondCommission = payload;
    },
    setBondFees(state, { payload }) {
      state.bondFees = payload;
    },

    setTotalIssuance(state, { payload }) {
      state.totalIssuance = payload;
    },
    setStakerApr(state, { payload }) {
      state.stakerApr = payload;
    },
    setTotalUnbonding(state, { payload }) {
      state.totalUnbonding = payload;
    },
    setUnBondFees(state, { payload }) {
      state.unBondFees = payload;
    },
    setRewardList(state, { payload }) {
      state.rewardList = payload;
    },
    setRewardList_lastdata(state, { payload }) {
      state.rewardList_lastdata = payload;
    },
    setLastEraRate(state, { payload }) {
      state.lastEraRate = payload;
    },
  },
});

export const {
  setKsmAccounts,
  setKsmAccount,
  setTransferrableAmountShow,
  setRatio,
  setTokenAmount,
  setProcessParameter,
  setStakeHash,
  setValidPools,
  setPoolLimit,
  setUnbondCommission,
  setBondFees,
  setTotalIssuance,
  setStakerApr,
  setTotalUnbonding,
  setUnBondFees,
  setRatioShow,
  setRewardList,
  setRewardList_lastdata,
  setLastEraRate,
} = rKSMClice.actions;

export const reloadData = (): AppThunk => async (dispatch, getState) => {
  const account = getState().rKSMModule.ksmAccount;
  if (account) {
    dispatch(createSubstrate(account));
  }
  dispatch(balancesAll());
  dispatch(query_rBalances_account());
  dispatch(getTotalIssuance());
  dispatch(getPools());
};
export const createSubstrate =
  (account: any): AppThunk =>
  async (dispatch, getState) => {
    queryBalance(account, dispatch, getState);
  };

const queryBalance = async (account: any, dispatch: any, getState: any) => {
  dispatch(setKsmAccounts(account));
  let account2: any = { ...account };

  const api = await polkadotServer.createPolkadotApi();
  const result = await api.query.system.account(account2.address);
  if (result) {
    let fisFreeBalance = NumberUtil.fisAmountToHuman(result.data.free);
    account2.balance = NumberUtil.handleEthAmountRound(fisFreeBalance);
  }
  const ksmAccount = getState().rKSMModule.ksmAccount;
  if (ksmAccount && ksmAccount.address == account2.address) {
    dispatch(setKsmAccount(account2));
  }
  dispatch(setKsmAccounts(account2));
};

export const transfer =
  (amountparam: string, destChainId: number, targetAddress: string, cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    const processParameter = getState().rKSMModule.processParameter;
    const notice_uuid = (processParameter && processParameter.uuid) || stafi_uuid();

    dispatch(initProcess(null));
    const amount = NumberUtil.fisAmountToChain(amountparam);
    const validPools = getState().rKSMModule.validPools;
    const poolLimit = getState().rKSMModule.poolLimit;
    const address = getState().rKSMModule.ksmAccount.address;
    web3Enable(stafiServer.getWeb3EnalbeName());
    const injector = await web3FromSource(stafiServer.getPolkadotJsSource());

    const dotApi = await polkadotServer.createPolkadotApi();

    const selectedPool = commonClice.getPool(amount, validPools, poolLimit);
    if (selectedPool == null) {
      return;
    }

    const ex = await dotApi.tx.balances.transferKeepAlive(selectedPool.address, amount.toString());
    let index = 0;
    ex.signAndSend(address, { signer: injector.signer }, (result: any) => {
      if (index == 0) {
        dispatch(
          setProcessSending({
            brocasting: processStatus.loading,
            packing: processStatus.default,
            finalizing: processStatus.default,
          }),
        );
        dispatch(setProcessType(rSymbol.Ksm));
        dispatch(setProcessDestChainId(destChainId));
        dispatch(setProcessSlider(true));
        index = index + 1;
      }
      const tx = ex.hash.toHex();
      try {
        let asInBlock = '';
        try {
          asInBlock = '' + result.status.asInBlock;
        } catch (e) {
          // do nothing
        }
        if (asInBlock) {
          dispatch(
            setProcessParameter({
              sending: {
                amount: amountparam,
                txHash: tx,
                blockHash: asInBlock,
                address,
                uuid: notice_uuid,
              },
              href: cb ? '/rKSM/staker/info' : null,
              destChainId,
              targetAddress,
            }),
          );
          dispatch(
            setStakeHash({
              txHash: tx,
              blockHash: asInBlock,
              notice_uuid: notice_uuid,
              destChainId,
              targetAddress,
            }),
          );
        }

        if (result.status.isInBlock) {
          dispatch(
            setProcessSending({
              brocasting: processStatus.success,
              packing: processStatus.loading,
              checkTx: tx,
            }),
          );
          dispatch(add_KSM_stake_Notice(notice_uuid, amountparam, noticeStatus.Pending));

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

                    let message: string = 'Something is wrong, please try again later';
                    if (error.name == '') {
                      message = '';
                    }
                    message && M.info(message);
                  } catch (error) {
                    M.error(error.message);
                  }
                }
                dispatch(reloadData());
                dispatch(
                  setProcessSending({
                    packing: processStatus.failure,
                    checkTx: tx,
                  }),
                );
                dispatch(setStakeHash(null));
                dispatch(add_KSM_stake_Notice(notice_uuid, amountparam, noticeStatus.Error));
              } else if (data.event.method === 'ExtrinsicSuccess') {
                dispatch(
                  setProcessSending({
                    packing: processStatus.success,
                    finalizing: processStatus.loading,
                  }),
                );
                // dispatch(gSetTimeOut(() => {
                //   dispatch(setProcessSending({
                //     finalizing: processStatus.failure,
                //   }));
                // }, 10 * 60 * 1000));
                dispatch(reloadData());
                dispatch(
                  setProcessParameter({
                    staking: {
                      amount: amountparam,
                      txHash: tx,
                      blockHash: asInBlock,
                      address,
                      type: rSymbol.Ksm,
                      poolAddress: selectedPool.poolPubkey,
                    },
                  }),
                );

                dispatch(
                  add_KSM_stake_Notice(notice_uuid, amountparam, noticeStatus.Pending, {
                    process: {
                      ...getState().globalModule.process,
                      rSymbol: rSymbol.Ksm,
                      destChainId: destChainId,
                      sending: {
                        brocasting: processStatus.success,
                        packing: processStatus.success,
                        finalizing: processStatus.loading,
                        checkTx: tx,
                      },
                    },
                    processParameter: getState().rKSMModule.processParameter,
                  }),
                );

                message.info('Sending succeeded, proceeding signature');

                asInBlock &&
                  dispatch(
                    bound(
                      address,
                      tx,
                      asInBlock,
                      amount.toString(),
                      selectedPool.poolPubkey,
                      rSymbol.Ksm,
                      destChainId,
                      targetAddress,
                      (r: string) => {
                        if (r == 'loading') {
                          dispatch(add_KSM_stake_Notice(notice_uuid, amountparam, noticeStatus.Pending));
                        } else {
                          dispatch(setStakeHash(null));
                        }

                        if (r == 'failure') {
                          dispatch(add_KSM_stake_Notice(notice_uuid, amountparam, noticeStatus.Error));
                        }

                        if (r == 'successful') {
                          dispatch(
                            add_KSM_stake_Notice(
                              notice_uuid,
                              amountparam,
                              destChainId === STAFI_CHAIN_ID ? noticeStatus.Confirmed : noticeStatus.Swapping,
                            ),
                          );
                          // Set swap loading params for loading modal.
                          if (destChainId === ETH_CHAIN_ID) {
                            updateSwapParamsOfErc(dispatch, notice_uuid, 'rksm', 0, targetAddress, true);
                          } else {
                            updateSwapParamsOfBep(dispatch, notice_uuid, 'rksm', 0, targetAddress, true);
                          }
                          dispatch(setStakeSwapLoadingStatus(destChainId === STAFI_CHAIN_ID ? 0 : 2));
                          cb && cb();
                          dispatch(reloadData());
                        }
                      },
                    ),
                  );
              }
            });
        } else if (result.status.isFinalized) {
          dispatch(
            setProcessSending({
              finalizing: processStatus.success,
            }),
          );
        } else if (result.isError) {
          M.error(result.toHuman());
        }
      } catch (e) {
        M.error(e.message);
      }
    }).catch((e: any) => {
      dispatch(setLoading(false));
      if (e == 'Error: Cancelled') {
        message.error('Cancelled');
      } else {
        console.error(e);
      }
    });
  };

export const swapKsmForFis =
  (
    poolAddress: string,
    amountparam: string,
    receiveFisAmountParam: any,
    minOutFisAmountParam: any,
    cb?: Function,
  ): AppThunk =>
  async (dispatch, getState) => {
    dispatch(setLoading(true));
    dispatch(setSwapLoadingStatus(1));
    const notice_uuid = stafi_uuid();
    const amount = NumberUtil.tokenAmountToChain(amountparam, rSymbol.Ksm);
    const minOutFisAmount = NumberUtil.tokenAmountToChain(minOutFisAmountParam, rSymbol.Fis);
    const address = getState().rKSMModule.ksmAccount.address;
    web3Enable(stafiServer.getWeb3EnalbeName());
    const injector = await web3FromSource(stafiServer.getPolkadotJsSource());

    const dotApi = await polkadotServer.createPolkadotApi();

    if (!poolAddress) {
      dispatch(setLoading(false));
      dispatch(setSwapLoadingStatus(0));
      return;
    }

    dispatch(setSwapLoadingStatus(3));
    const ksmKeyringInstance = keyring.init(Symbol.Ksm);
    const fiskeyringInstance = keyring.init(Symbol.Fis);
    const pubKey = u8aToHex(ksmKeyringInstance.decodeAddress(address));
    const stafiAddress = u8aToHex(fiskeyringInstance.decodeAddress(getState().FISModule.fisAccount.address));

    const signature = await feeStationSignature(address, stafiAddress).catch((err) => {
      message.error(err.message);
    });
    if (!signature) {
      dispatch(setLoading(false));
      dispatch(setSwapLoadingStatus(0));
      return;
    }

    dispatch(setSwapLoadingStatus(1));
    message.info('Signature completed, proceeding to transfer');
    dispatch(
      trackEvent('fee_station_signature_success', {
        tokenType: 'ksm',
      }),
    );

    let bundleAddressId: string;
    try {
      const res = await feeStationServer.postBundleAddress({
        stafiAddress,
        symbol: 'KSM',
        poolAddress,
        signature,
        pubKey,
      });
      if (res.status === '80000' && res.data) {
        bundleAddressId = res.data.bundleAddressId;
      }
    } catch (err: any) {}

    if (!bundleAddressId) {
      dispatch(setLoading(false));
      dispatch(setSwapLoadingStatus(0));
      message.error('The service is temporarily unavailable, please try again later');
      return;
    } else {
      dispatch(
        trackEvent('fee_station_get_bundleAddressId_success', {
          tokenType: 'ksm',
        }),
      );
    }

    const ex = await dotApi.tx.balances.transferKeepAlive(poolAddress, amount.toString());
    let index = 0;
    ex.signAndSend(address, { signer: injector.signer }, (result: any) => {
      if (index == 0) {
        index = index + 1;
      }
      const tx = ex.hash.toHex();
      try {
        let asInBlock = '';
        try {
          asInBlock = '' + result.status.asInBlock;
        } catch (e) {
          // do nothing
        }
        // if (asInBlock) {
        //   dispatch(
        //     setStakeHash({
        //       txHash: tx,
        //       blockHash: asInBlock,
        //       notice_uuid: notice_uuid,
        //     }),
        //   );
        // }

        if (result.status.isInBlock) {
          const noticeSubData = {
            receiveFisAmount: receiveFisAmountParam,
            fisAddress: getState().FISModule.fisAccount && getState().FISModule.fisAccount.address,
            symbol: 'KSM',
            txHash: tx,
            blockHash: asInBlock,
            stafiAddress,
            poolAddress,
            signature,
            pubKey,
            inAmount: amount.toString(),
            minOutAmount: minOutFisAmount.toString(),
            bundleAddressId,
          };
          dispatch(add_KSM_feeStation_Notice(notice_uuid, amountparam, noticeStatus.Pending, noticeSubData));

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

                    let message: string = 'Something is wrong, please try again later!';
                    if (error.name == '') {
                      message = '';
                    }
                    message && M.info(message);
                  } catch (error) {
                    M.error(error.message);
                  }
                }
                dispatch(setLoading(false));
                dispatch(setSwapLoadingStatus(0));
                dispatch(reloadData());
                dispatch(setStakeHash(null));
                dispatch(add_KSM_stake_Notice(notice_uuid, amountparam, noticeStatus.Error, noticeSubData));
              } else if (data.event.method === 'ExtrinsicSuccess') {
                dispatch(
                  trackEvent('fee_station_transfer_success', {
                    tokenType: 'ksm',
                  }),
                );
                dispatch(reloadData());
                dispatch(setLoading(false));
                dispatch(setSwapLoadingStatus(2));

                const params = {
                  stafiAddress,
                  symbol: 'KSM',
                  blockHash: asInBlock,
                  txHash: tx,
                  poolAddress,
                  signature,
                  pubKey,
                  inAmount: amount.toString(),
                  minOutAmount: minOutFisAmount.toString(),
                  bundleAddressId,
                };
                dispatch(uploadSwapInfo(params));
                asInBlock && cb && cb({ ...params, noticeUuid: notice_uuid });
              }
            });
        } else if (result.status.isFinalized) {
          dispatch(setLoading(false));
        } else if (result.isError) {
          dispatch(setLoading(false));
          dispatch(setSwapLoadingStatus(0));
          M.error(result.toHuman());
        }
      } catch (e) {
        dispatch(setLoading(false));
        dispatch(setSwapLoadingStatus(0));
        M.error(e.message);
      }
    }).catch((e: any) => {
      dispatch(setLoading(false));
      dispatch(setSwapLoadingStatus(0));
      if (e == 'Error: Cancelled') {
        message.error('Cancelled');
      } else {
        console.error(e);
      }
    });
  };

export const balancesAll = (): AppThunk => async (dispatch, getState) => {
  const api = await polkadotServer.createPolkadotApi();
  const address = getState().rKSMModule.ksmAccount.address;
  const result = await api.derive.balances.all(address);
  if (result) {
    const transferrableAmount = NumberUtil.fisAmountToHuman(result.availableBalance);
    const transferrableAmountShow = NumberUtil.handleFisAmountToFixed(transferrableAmount);
    dispatch(setTransferrableAmountShow(transferrableAmountShow));
  }
};

export const query_rBalances_account = (): AppThunk => async (dispatch, getState) => {
  commonClice.query_rBalances_account(getState().FISModule.fisAccount, rSymbol.Ksm, (data: any) => {
    if (data == null) {
      dispatch(setTokenAmount(NumberUtil.handleFisAmountToFixed(0)));
    } else {
      dispatch(setTokenAmount(NumberUtil.fisAmountToHuman(data.free)));
    }
  });
};

export const reSending =
  (cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    const processParameter = getState().rKSMModule.processParameter;
    if (processParameter) {
      const { href, destChainId, targetAddress } = processParameter;
      dispatch(
        transfer(processParameter.sending.amount, destChainId, targetAddress, () => {
          cb && href && cb(href);
        }),
      );
    }
  };

export const reStaking =
  (cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    const processParameter = getState().rKSMModule.processParameter;
    if (processParameter) {
      const { staking, href, destChainId, targetAddress } = processParameter;
      processParameter &&
        dispatch(
          bound(
            staking.address,
            staking.txHash,
            staking.blockHash,
            NumberUtil.fisAmountToChain(staking.amount).toString(),
            staking.poolAddress,
            staking.type,
            destChainId,
            targetAddress,
            (r: string) => {
              // if (r != "failure") {
              //   (href && cb) && cb(href);
              // }

              if (r == 'loading') {
                dispatch(add_KSM_stake_Notice(processParameter.sending.uuid, staking.amount, noticeStatus.Pending));
              } else {
                dispatch(setStakeHash(null));
              }

              if (r == 'failure') {
                dispatch(add_KSM_stake_Notice(processParameter.sending.uuid, staking.amount, noticeStatus.Error));
              }

              if (r == 'successful') {
                dispatch(
                  add_KSM_stake_Notice(
                    processParameter.sending.uuid,
                    staking.amount,
                    destChainId === STAFI_CHAIN_ID ? noticeStatus.Confirmed : noticeStatus.Swapping,
                  ),
                );
                // Set swap loading params for loading modal.
                if (destChainId === ETH_CHAIN_ID) {
                  updateSwapParamsOfErc(dispatch, processParameter.sending.uuid, 'rksm', 0, targetAddress, true);
                } else {
                  updateSwapParamsOfBep(dispatch, processParameter.sending.uuid, 'rksm', 0, targetAddress, true);
                }
                dispatch(setStakeSwapLoadingStatus(destChainId === STAFI_CHAIN_ID ? 0 : 2));

                if (destChainId === STAFI_CHAIN_ID) {
                  href && cb && cb(href);
                } else {
                  PubSub.publish('stakeSuccess');
                }
                dispatch(reloadData());
              }
            },
          ),
        );
    }
  };

export const unbond =
  (amount: string, recipient: string, willAmount: any, cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    try {
      const validPools = getState().rKSMModule.validPools;
      let selectedPool = commonClice.getPoolForUnbond(amount, validPools, rSymbol.Ksm);
      if (selectedPool == null) {
        cb && cb();
        return;
      }
      const keyringInstance = keyring.init(Symbol.Ksm);

      dispatch(
        fisUnbond(
          amount,
          rSymbol.Ksm,
          u8aToHex(keyringInstance.decodeAddress(recipient)),
          selectedPool.poolPubkey,
          'Unbond succeeded, unbonding period is around ' + config.unboundAroundDays(Symbol.Ksm) + ' days',
          (r?: string, txHash?: string) => {
            dispatch(reloadData());
            const uuid = stafi_uuid();
            if (r === 'Success') {
              dispatch(add_KSM_unbond_Notice(uuid, willAmount, noticeStatus.Confirmed, { txHash }));
              localStorageUtil.addRTokenUnbondRecords('rKSM', stafiServer, {
                id: uuid,
                txHash,
                estimateSuccessTime: moment().add(config.unboundAroundDays(Symbol.Ksm), 'day').valueOf(),
                amount: willAmount,
                recipient,
              });
            }
            if (r === 'Failed') {
              dispatch(add_KSM_unbond_Notice(uuid, willAmount, noticeStatus.Error));
            }
            cb && cb();
          },
        ),
      );
    } catch (e) {
      cb && cb();
    }
  };

export const continueProcess = (): AppThunk => async (dispatch, getState) => {
  const stakeHash = getState().rKSMModule.stakeHash;
  if (stakeHash && stakeHash.blockHash && stakeHash.txHash && stakeHash.destChainId) {
    dispatch(
      bondStates(rSymbol.Atom, stakeHash.txHash, stakeHash.blockHash, (e: string) => {
        if (e == 'successful') {
          message.success('Minting succeeded', 3, () => {
            dispatch(setStakeHash(null));
          });
        } else {
          dispatch(
            getBlock(
              stakeHash.blockHash,
              stakeHash.txHash,
              stakeHash.notice_uuid,
              stakeHash.destChainId,
              stakeHash.targetAddress,
            ),
          );
        }
      }),
    );
  }
};

export const onProceed =
  (blockHash: string, txHash: string, cb?: Function): AppThunk =>
  async (dispatch, getstate) => {
    const noticeData = findUuid(getstate().noticeModule.noticeData, txHash, blockHash, dispatch);

    let bondSuccessParamArr: any[] = [];
    bondSuccessParamArr.push(blockHash);
    bondSuccessParamArr.push(txHash);
    let statusObj = {
      num: 0,
    };
    dispatch(
      rTokenSeries_bondStates(rSymbol.Ksm, bondSuccessParamArr, statusObj, (e: string) => {
        if (e == 'successful') {
          dispatch(setStakeHash(null));
          message.success('Transaction has been proceeded', 3, () => {
            cb && cb('successful');
          });
          noticeData && dispatch(add_KSM_stake_Notice(noticeData.uuid, noticeData.amount, noticeStatus.Confirmed));
        } else if (e == 'failure' || e == 'stakingFailure') {
          dispatch(
            getBlock(blockHash, txHash, noticeData ? noticeData.uuid : null, STAFI_CHAIN_ID, '', () => {
              cb && cb('successful');
            }),
          );
        } else {
          if (getstate().globalModule.processSlider == false) {
            dispatch(
              initProcess({
                sending: {
                  packing: processStatus.success,
                  brocasting: processStatus.success,
                  finalizing: processStatus.success,
                  checkTx: txHash,
                },
                staking: {
                  packing: processStatus.success,
                  brocasting: processStatus.success,
                  finalizing: processStatus.success,
                },
                minting: {
                  minting: processStatus.loading,
                },
                swapping: {
                  brocasting: processStatus.default,
                },
              }),
            );
            dispatch(setProcessSlider(true));
          }
        }
      }),
    );
  };

export const getBlock =
  (
    blockHash: string,
    txHash: string,
    uuid: string,
    destChainId: number,
    targetAddress: string,
    cb?: Function,
  ): AppThunk =>
  async (dispatch, getState) => {
    try {
      const api = await polkadotServer.createPolkadotApi();
      const address = getState().rKSMModule.ksmAccount.address;
      const validPools = getState().rKSMModule.validPools;
      const result = await api.rpc.chain.getBlock(blockHash);
      let u = false;

      result.block.extrinsics.forEach((ex: any) => {
        if (ex.hash.toHex() == txHash) {
          const {
            method: { args, method, section },
          } = ex;
          if (section == 'balances' && (method == 'transfer' || method == 'transferKeepAlive')) {
            u = true;

            const keyringInstance = keyring.init(Symbol.Ksm);
            if (
              u8aToHex(keyringInstance.decodeAddress(ex.signer.toString())) !=
              u8aToHex(keyringInstance.decodeAddress(address))
            ) {
              message.error('Please select your KSM account that sent the transaction');
              return;
            }

            let amount = args[1].toJSON();
            const poolAddress = args[0].toJSON().id;
            let poolPubkey = u8aToHex(keyringInstance.decodeAddress(poolAddress));

            const poolData = validPools.find((item: any) => {
              if (item.poolPubkey == poolPubkey) {
                return true;
              }
            });

            if (!poolData) {
              // message.error('The destination address in the transaction does not match the pool address');
              return;
            }

            dispatch(
              initProcess({
                sending: {
                  packing: processStatus.success,
                  brocasting: processStatus.success,
                  finalizing: processStatus.success,
                  checkTx: txHash,
                },
                staking: {
                  packing: processStatus.default,
                  brocasting: processStatus.default,
                  finalizing: processStatus.default,
                },
                minting: {
                  minting: processStatus.default,
                },
                swapping: {
                  brocasting: processStatus.default,
                },
              }),
            );
            dispatch(setProcessSlider(true));
            dispatch(
              setProcessParameter({
                staking: {
                  amount: NumberUtil.fisAmountToHuman(amount),
                  txHash,
                  blockHash,
                  address,
                  type: rSymbol.Ksm,
                  poolAddress: poolPubkey,
                },
              }),
            );
            dispatch(
              bound(
                address,
                txHash,
                blockHash,
                amount,
                poolPubkey,
                rSymbol.Ksm,
                destChainId,
                targetAddress,
                (r: string) => {
                  // dispatch(setStakeHash(null));

                  if (r == 'loading') {
                    uuid &&
                      dispatch(
                        add_KSM_stake_Notice(
                          uuid,
                          NumberUtil.fisAmountToHuman(amount).toString(),
                          noticeStatus.Pending,
                        ),
                      );
                  } else {
                    dispatch(setStakeHash(null));
                  }

                  if (r == 'failure') {
                    uuid &&
                      dispatch(
                        add_KSM_stake_Notice(uuid, NumberUtil.fisAmountToHuman(amount).toString(), noticeStatus.Error),
                      );
                  }
                  if (r == 'successful') {
                    uuid &&
                      dispatch(
                        add_KSM_stake_Notice(
                          uuid,
                          NumberUtil.fisAmountToHuman(amount).toString(),
                          noticeStatus.Confirmed,
                        ),
                      );
                    cb && cb();
                  }
                },
              ),
            );
          }
        }
      });

      if (!u) {
        message.error('No results were found');
      }
    } catch (e) {
      message.error(e.message);
    }
  };

export const getPools =
  (cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    dispatch(setValidPools(null));
    commonClice.getPools(rSymbol.Ksm, Symbol.Ksm, (data: any) => {
      dispatch(setValidPools(data));
      cb && cb();
    });
    const data = await commonClice.poolBalanceLimit(rSymbol.Ksm);
    dispatch(setPoolLimit(data));
  };

export const getUnbondCommission = (): AppThunk => async (dispatch, getState) => {
  const unbondCommission = await commonClice.getUnbondCommission();
  dispatch(setUnbondCommission(unbondCommission));
};

export const bondFees = (): AppThunk => async (dispatch, getState) => {
  const result = await commonClice.bondFees(rSymbol.Ksm);
  dispatch(setBondFees(result));
};

export const unbondFees = (): AppThunk => async (dispatch, getState) => {
  const result = await commonClice.unbondFees(rSymbol.Ksm);
  dispatch(setUnBondFees(result));
};
export const getTotalIssuance = (): AppThunk => async (dispatch, getState) => {
  const result = await commonClice.getTotalIssuance(rSymbol.Ksm);
  dispatch(setTotalIssuance(result));
};

export const rTokenLedger = (): AppThunk => async (dispatch, getState) => {
  const stafiApi = await stafiServer.createStafiApi();
  const eraResult = await stafiApi.query.rTokenLedger.chainEras(rSymbol.Ksm);
  let currentEra = eraResult.toJSON();
  if (currentEra) {
    let rateResult = await stafiApi.query.rTokenRate.eraRate(rSymbol.Ksm, currentEra - 1);
    const currentRate = rateResult.toJSON();
    const rateResult2 = await stafiApi.query.rTokenRate.eraRate(rSymbol.Ksm, currentEra - 29);
    let lastRate = rateResult2.toJSON();
    dispatch(handleStakerApr(currentRate, lastRate));
  } else {
    dispatch(handleStakerApr());
  }
};

export const getLastEraRate = (): AppThunk => async (dispatch, getState) => {
  try {
    const fisSource = getState().FISModule.fisAccount && getState().FISModule.fisAccount.address;
    const ethAddress = getState().globalModule.metaMaskAddress;
    const solAddress = getState().rSOLModule.solAddress;
    const bscAddress = getState().globalModule.metaMaskAddress;
    const result = await rpcServer.getReward(fisSource, ethAddress, rSymbol.Ksm, 0, bscAddress, solAddress);
    if (result.status === 80000) {
      if (result.data.rewardList.length > 1) {
        const list = result.data.rewardList.map((item: any) => {
          const rate = NumberUtil.rTokenRateToHuman(item.rate);
          const rbalance = NumberUtil.tokenAmountToHuman(item.rbalance, rSymbol.Ksm);
          return {
            ...item,
            rbalance: rbalance,
            rate: rate,
          };
        });
        dispatch(setLastEraRate((list[0].rate - list[1].rate) * list[1].rbalance));
      } else {
        dispatch(setLastEraRate(0));
      }
    } else if (result.status === 301) {
      dispatch(setLastEraRate(0));
    } else {
      dispatch(setLastEraRate('--'));
    }
  } catch (err: any) {}
};

const handleStakerApr =
  (currentRate?: any, lastRate?: any): AppThunk =>
  async (dispatch, getState) => {
    if (currentRate && lastRate) {
      const apr = NumberUtil.amount_format(((currentRate - lastRate) / 1000000000000 / 7) * 365.25 * 100, 1) + '%';
      dispatch(setStakerApr(apr));
    } else {
      dispatch(setStakerApr('16.0%'));
    }
  };
export const checkAddress = (address: string) => {
  const keyringInstance = keyring.init(Symbol.Ksm);
  return keyringInstance.checkAddress(address);
};
export const accountUnbonds = (): AppThunk => async (dispatch, getState) => {
  // dispatch(getTotalUnbonding(rSymbol.Ksm,(total:any)=>{
  //   dispatch(setTotalUnbonding(total));
  // }))

  let fisAddress = getState().FISModule.fisAccount && getState().FISModule.fisAccount.address;
  commonClice.getTotalUnbonding(fisAddress, rSymbol.Ksm, (total: any) => {
    dispatch(setTotalUnbonding(total));
  });
};

const add_KSM_stake_Notice =
  (uuid: string, amount: string, status: string, subData?: any): AppThunk =>
  async (dispatch, getState) => {
    setTimeout(() => {
      dispatch(
        add_KSM_Notice(uuid, noticeType.Staker, noticesubType.Stake, amount, status, {
          process: getState().globalModule.process,
          processParameter: getState().rKSMModule.processParameter,
        }),
      );
    }, 20);
  };

const add_KSM_feeStation_Notice =
  (uuid: string, amount: string, status: string, subData?: any): AppThunk =>
  async (dispatch, getState) => {
    setTimeout(() => {
      dispatch(add_KSM_Notice(uuid, noticeType.Staker, noticesubType.FeeStation, amount, status, subData));
    }, 20);
  };

export const rTokenRate = (): AppThunk => async (dispatch, getState) => {
  const ratio = await commonClice.rTokenRate(rSymbol.Ksm);
  dispatch(setRatio(ratio));
};

export const getReward =
  (pageIndex: Number, cb: Function): AppThunk =>
  async (dispatch, getState) => {
    const fisSource = getState().FISModule.fisAccount.address;
    const ethAddress = getState().globalModule.metaMaskAddress;
    dispatch(setLoading(true));
    try {
      if (pageIndex == 0) {
        dispatch(setRewardList([]));
        dispatch(setRewardList_lastdata(null));
      }
      const result = await rpcServer.getReward(fisSource, ethAddress, rSymbol.Ksm, pageIndex);
      if (result.status == 80000) {
        const rewardList = getState().rKSMModule.rewardList;
        if (result.data.rewardList.length > 0) {
          const list = result.data.rewardList.map((item: any) => {
            const rate = NumberUtil.rTokenRateToHuman(item.rate);
            const rbalance = NumberUtil.tokenAmountToHuman(item.rbalance, rSymbol.Ksm);
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
const add_KSM_unbond_Notice =
  (uuid: string, amount: string, status: string, subData?: any): AppThunk =>
  async (dispatch, getState) => {
    dispatch(add_KSM_Notice(uuid, noticeType.Staker, noticesubType.Unbond, amount, status, subData));
  };
const add_DOT_Withdraw_Notice =
  (uuid: string, amount: string, status: string, subData?: any): AppThunk =>
  async (dispatch, getState) => {
    dispatch(add_KSM_Notice(uuid, noticeType.Staker, noticesubType.Withdraw, amount, status, subData));
  };
const add_DOT_Swap_Notice =
  (uuid: string, amount: string, status: string, subData?: any): AppThunk =>
  async (dispatch, getState) => {
    dispatch(add_KSM_Notice(uuid, noticeType.Staker, noticesubType.Swap, amount, status, subData));
  };
const add_KSM_Notice =
  (uuid: string, type: string, subType: string, content: string, status: string, subData?: any): AppThunk =>
  async (dispatch, getState) => {
    dispatch(add_Notice(uuid, Symbol.Ksm, type, subType, content, status, subData));
  };
export default rKSMClice.reducer;
