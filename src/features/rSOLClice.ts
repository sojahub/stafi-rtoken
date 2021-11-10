// @ts-nocheck

import { web3Enable } from '@polkadot/extension-dapp';
import { u8aToHex } from '@polkadot/util';
import { createSlice } from '@reduxjs/toolkit';
import * as solanaWeb3 from '@solana/web3.js';
import { message } from 'antd';
import base58 from 'bs58';
import moment from 'moment';
import PubSub from 'pubsub-js';
import config from 'src/config/index';
import { rSymbol, Symbol } from 'src/keyring/defaults';
import keyring from 'src/servers/index';
import RpcServer, { pageCount } from 'src/servers/rpc/index';
import { default as SolServer } from 'src/servers/sol/index';
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
import NumberUtil from 'src/util/numberUtil';
import { AppThunk } from '../store';
import {
  BSC_CHAIN_ID,
  ETH_CHAIN_ID,
  SOL_CHAIN_ID,
  STAFI_CHAIN_ID,
  updateSwapParamsOfBep,
  updateSwapParamsOfErc,
  updateSwapParamsOfSlp,
} from './bridgeClice';
import CommonClice from './commonClice';
import { bondStates, bound, fisUnbond, rTokenSeries_bondStates } from './FISClice';
import {
  connectSoljs,
  initProcess,
  processStatus,
  setLoading,
  setProcessDestChainId,
  setProcessSending,
  setProcessSlider,
  setProcessType,
  setStakeSwapLoadingStatus,
} from './globalClice';
import { add_Notice, findUuidWithoutBlockhash, noticeStatus, noticesubType, noticeType } from './noticeClice';

const commonClice = new CommonClice();
const stafiServer = new Stafi();
const solServer = new SolServer();
const rpcServer = new RpcServer();

const rSOLClice = createSlice({
  name: 'rSOLModule',
  initialState: {
    solAccounts: [],
    solAccount: getLocalStorageItem(Keys.SolAccountKey) && {
      ...getLocalStorageItem(Keys.SolAccountKey),
      balance: '--',
    },
    validPools: [],
    poolLimit: 0,
    transferrableAmountShow: '--',
    ratio: '--',
    ratioShow: '--',
    tokenAmount: '--',
    processParameter: null,
    stakeHash: getLocalStorageItem(Keys.SolStakeHash),
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
    setSolAccounts(state, { payload }) {
      const accounts = state.solAccounts;
      const account = accounts.find((item: any) => {
        return item.address == payload.address;
      });
      if (account) {
        account.balance = payload.balance;
        account.name = payload.name;
      } else {
        state.solAccounts.push(payload);
      }
    },
    setSolAccount(state, { payload }) {
      if (payload) {
        setLocalStorageItem(Keys.SolAccountKey, { address: payload.address });
      }
      state.solAccount = payload;
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
        // removeLocalStorageItem(Keys.SolProcessParameter)
        state.processParameter = payload;
      } else {
        let param = { ...state.processParameter, ...payload };
        // setLocalStorageItem(Keys.SolProcessParameter,param),
        state.processParameter = param;
      }
    },
    setStakeHash(state, { payload }) {
      if (payload == null) {
        removeLocalStorageItem(Keys.SolStakeHash);
        state.stakeHash = payload;
      } else {
        setLocalStorageItem(Keys.SolStakeHash, payload)((state.stakeHash = payload));
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
  setSolAccounts,
  setSolAccount,
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
} = rSOLClice.actions;

export const reloadData = (): AppThunk => async (dispatch, getState) => {
  const account = getState().rSOLModule.solAccount;
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
  dispatch(setSolAccounts(account));
  let account2: any = { ...account };

  const connection = new solanaWeb3.Connection(config.solRpcApi(), {
    wsEndpoint: config.solRpcWs(),
    commitment: 'singleGossip',
  });
  const balance = await connection.getBalance(new solanaWeb3.PublicKey(account2.address));
  let solBalance = NumberUtil.tokenAmountToHuman(balance, rSymbol.Sol);
  account2.balance = solBalance ? NumberUtil.handleEthAmountRound(solBalance) : 0;

  dispatch(setTransferrableAmountShow(account2.balance));
  dispatch(setSolAccount(account2));
  dispatch(setSolAccounts(account2));
};

export const transfer =
  (amountparam: string, destChainId: number, targetAddress: string, cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    const solana = solServer.getProvider();
    if (!solana) {
      message.info('Please connect your Phantom wallet');
      return;
    }
    await solana.disconnect();
    await timeout(500);
    if (solana && !solana.isConnected) {
      solServer.connectSolJs();
      await timeout(500);
      if (!solana.isConnected) {
        message.info('Please connect Phantom extension first');
        return;
      }
    }

    const localSolAddress = getState().rSOLModule.solAccount && getState().rSOLModule.solAccount.address;
    const solAddress = solana.publicKey.toString();
    console.log('solana account:', solana.publicKey.toString());
    if (localSolAddress !== solAddress) {
      dispatch(connectSoljs());
    }

    const processParameter = getState().rSOLModule.processParameter;
    const notice_uuid = (processParameter && processParameter.uuid) || stafi_uuid();

    dispatch(initProcess(null));

    const amount = NumberUtil.tokenAmountToChain(amountparam, rSymbol.Sol);

    const validPools = getState().rSOLModule.validPools;
    const poolLimit = getState().rSOLModule.poolLimit;
    web3Enable(stafiServer.getWeb3EnalbeName());

    const selectedPool = commonClice.getPool(amount, validPools, poolLimit);
    if (selectedPool == null) {
      return;
    }

    dispatch(
      setProcessSending({
        brocasting: processStatus.loading,
        packing: processStatus.default,
        finalizing: processStatus.default,
      }),
    );
    dispatch(setProcessType(rSymbol.Sol));
    dispatch(setProcessDestChainId(destChainId));
    dispatch(setProcessSlider(true));

    try {
      // await timeout(3000);
      // message.info('Please approve transaction in sollet wallet.', 5);

      let result: any;
      result = await solServer.sendTransaction(Number(amount), selectedPool.address).catch((error) => {
        dispatch(setProcessSlider(false));
        throw error;
      });

      if (result && result.blockHash && result.txHash) {
        const hexBlockHash = u8aToHex(base58.decode(result.blockHash));
        const hexTxHash = u8aToHex(base58.decode(result.txHash));

        dispatch(
          setProcessSending({
            brocasting: processStatus.success,
            packing: processStatus.success,
            finalizing: processStatus.success,
            checkTx: result.txHash,
          }),
        );

        dispatch(reloadData());

        dispatch(
          setProcessParameter({
            sending: {
              amount: amountparam,
              txHash: hexTxHash,
              blockHash: hexBlockHash,
              address: solAddress,
              uuid: notice_uuid,
            },
            staking: {
              amount: amountparam,
              txHash: hexTxHash,
              blockHash: hexBlockHash,
              address: solAddress,
              type: rSymbol.Sol,
              poolAddress: selectedPool.poolPubkey,
            },
            href: cb ? '/rSOL/staker/info' : null,
            destChainId,
            targetAddress,
          }),
        );

        dispatch(
          add_SOL_stake_Notice(notice_uuid, amountparam, noticeStatus.Pending, {
            process: {
              ...getState().globalModule.process,
              rSymbol: rSymbol.Sol,
              destChainId: destChainId,
              sending: {
                brocasting: processStatus.success,
                packing: processStatus.success,
                finalizing: processStatus.success,
                checkTx: result.txHash,
              },
            },
            processParameter: getState().rSOLModule.processParameter,
          }),
        );

        message.info('Sending succeeded, proceeding signature');

        dispatch(
          bound(
            solAddress,
            hexTxHash,
            hexBlockHash,
            amount,
            selectedPool.poolPubkey,
            rSymbol.Sol,
            destChainId,
            targetAddress,
            (r: string) => {
              if (r == 'loading') {
                dispatch(add_SOL_stake_Notice(notice_uuid, amountparam, noticeStatus.Pending));
              } else {
                dispatch(setStakeHash(null));
              }

              if (r == 'failure') {
                dispatch(add_SOL_stake_Notice(notice_uuid, amountparam, noticeStatus.Error));
              }

              if (r == 'successful') {
                dispatch(
                  add_SOL_stake_Notice(
                    notice_uuid,
                    amountparam,
                    destChainId === STAFI_CHAIN_ID ? noticeStatus.Confirmed : noticeStatus.Swapping,
                  ),
                );
                // Set swap loading params for loading modal.
                if (destChainId === ETH_CHAIN_ID) {
                  updateSwapParamsOfErc(dispatch, notice_uuid, 'rsol', 0, targetAddress, true);
                } else if (destChainId === BSC_CHAIN_ID) {
                  updateSwapParamsOfBep(dispatch, notice_uuid, 'rsol', 0, targetAddress, true);
                } else if (destChainId === SOL_CHAIN_ID) {
                  updateSwapParamsOfSlp(dispatch, notice_uuid, 'rsol', 0, targetAddress, true);
                }
                dispatch(setStakeSwapLoadingStatus(destChainId === STAFI_CHAIN_ID ? 0 : 2));
                cb && cb();
                dispatch(reloadData());
                dispatch(setProcessSlider(false));
              }
            },
          ),
        );
      } else {
        dispatch(setProcessSlider(false));
        dispatch(reloadData());
      }
    } catch (error) {
      if (error.message === 'Error: Transaction cancelled' || error.message === 'Signature request denied') {
        message.error('cancelled');
        dispatch(setProcessSlider(false));
        dispatch(reloadData());
      } else {
        message.error(error.message);
      }
    }
  };

export const balancesAll = (): AppThunk => async (dispatch, getState) => {
  // const api = await polkadotServer.createPolkadotApi();
  // const address = getState().rSOLModule.solAccount.address;
  // const result = await api.derive.balances.all(address);
  // if (result) {
  //   const transferrableAmount = NumberUtil.fisAmountToHuman(result.availableBalance);
  //   const transferrableAmountShow = NumberUtil.handleFisAmountToFixed(transferrableAmount);
  //   dispatch(setTransferrableAmountShow(transferrableAmountShow));
  // }
};

export const query_rBalances_account = (): AppThunk => async (dispatch, getState) => {
  commonClice.query_rBalances_account(getState().FISModule.fisAccount, rSymbol.Sol, (data: any) => {
    if (data == null) {
      dispatch(setTokenAmount(NumberUtil.handleFisAmountToFixed(0)));
    } else {
      dispatch(setTokenAmount(NumberUtil.tokenAmountToHuman(data.free, rSymbol.Sol)));
    }
  });
};

export const reSending =
  (cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    const processParameter = getState().rSOLModule.processParameter;
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
    const processParameter = getState().rSOLModule.processParameter;

    if (processParameter) {
      const { href, staking, destChainId, targetAddress } = processParameter;
      processParameter &&
        dispatch(
          bound(
            staking.address,
            staking.txHash,
            staking.blockHash,
            NumberUtil.solAmountToChain(staking.amount).toString(),
            staking.poolAddress,
            staking.type,
            destChainId,
            targetAddress,
            (r: string) => {
              // if (r != "failure") {
              //   (href && cb) && cb(href);
              // }

              if (r == 'loading') {
                dispatch(add_SOL_stake_Notice(processParameter.sending.uuid, staking.amount, noticeStatus.Pending));
              } else {
                dispatch(setStakeHash(null));
              }

              if (r == 'failure') {
                dispatch(add_SOL_stake_Notice(processParameter.sending.uuid, staking.amount, noticeStatus.Error));
              }

              if (r == 'successful') {
                dispatch(
                  add_SOL_stake_Notice(
                    processParameter.sending.uuid,
                    staking.amount,
                    destChainId === STAFI_CHAIN_ID ? noticeStatus.Confirmed : noticeStatus.Swapping,
                  ),
                );
                // Set swap loading params for loading modal.
                if (destChainId === ETH_CHAIN_ID) {
                  updateSwapParamsOfErc(dispatch, processParameter.sending.uuid, 'rsol', 0, targetAddress, true);
                } else if (destChainId === BSC_CHAIN_ID) {
                  updateSwapParamsOfBep(dispatch, processParameter.sending.uuid, 'rsol', 0, targetAddress, true);
                } else if (destChainId === SOL_CHAIN_ID) {
                  updateSwapParamsOfSlp(dispatch, processParameter.sending.uuid, 'rsol', 0, targetAddress, true);
                }
                dispatch(setStakeSwapLoadingStatus(destChainId === STAFI_CHAIN_ID ? 0 : 2));

                if (destChainId === STAFI_CHAIN_ID) {
                  href && cb && cb(href);
                } else {
                  PubSub.publish('stakeSuccess');
                }
                dispatch(reloadData());
                dispatch(setProcessSlider(false));
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
      const validPools = getState().rSOLModule.validPools;
      let selectedPool = commonClice.getPoolForUnbond(amount, validPools, rSymbol.Sol);
      if (selectedPool == null) {
        cb && cb();
        return;
      }

      dispatch(
        fisUnbond(
          amount,
          rSymbol.Sol,
          u8aToHex(new solanaWeb3.PublicKey(recipient).toBytes()),
          selectedPool.poolPubkey,
          'Unbond succeeded, unbonding period is around ' + config.unboundAroundDays(Symbol.Sol) + ' days',
          (r?: string, txHash?: string) => {
            dispatch(reloadData());
            const uuid = stafi_uuid();
            if (r === 'Success') {
              dispatch(add_SOL_unbond_Notice(uuid, willAmount, noticeStatus.Confirmed, { txHash }));
              localStorageUtil.addRTokenUnbondRecords('rSOL', stafiServer, {
                id: uuid,
                estimateSuccessTime: moment().add(config.unboundAroundDays(Symbol.Sol), 'day').valueOf(),
                amount: willAmount,
                recipient,
              });
            }
            if (r === 'Failed') {
              dispatch(add_SOL_unbond_Notice(uuid, willAmount, noticeStatus.Error));
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
  const stakeHash = getState().rSOLModule.stakeHash;
  if (stakeHash && stakeHash.blockHash && stakeHash.txHash) {
    dispatch(
      bondStates(rSymbol.Sol, stakeHash.txHash, stakeHash.blockHash, (e: string) => {
        if (e == 'successful') {
          message.success('Minting succeeded', 3, () => {
            dispatch(setStakeHash(null));
          });
        } else {
          dispatch(getBlock(stakeHash.txHash, stakeHash.notice_uuid));
        }
      }),
    );
  }
};

export const onProceed =
  (txHash: string, cb?: Function): AppThunk =>
  async (dispatch, getstate) => {
    const noticeData = findUuidWithoutBlockhash(getstate().noticeModule.noticeData, txHash);

    let blockhash: any;
    try {
      const result = await solServer.getTransactionDetail(getstate().rSOLModule.solAccount.address, txHash);
      if (result) {
        blockhash = result.blockhash;
      }
    } catch (error) {
      message.error('Transaction record not found!');
      return;
    }

    dispatch(_onProceedInternal(noticeData, blockhash, txHash, cb));
  };

const _onProceedInternal =
  (noticeData: any, blockhash: any, txHash: string, cb?: Function): AppThunk =>
  async (dispatch, getstate) => {
    let bondSuccessParamArr: any[] = [];
    bondSuccessParamArr.push(u8aToHex(base58.decode(blockhash)));
    bondSuccessParamArr.push(u8aToHex(base58.decode(txHash)));
    let statusObj = {
      num: 0,
    };
    dispatch(
      rTokenSeries_bondStates(rSymbol.Sol, bondSuccessParamArr, statusObj, (e: string) => {
        if (e == 'successful') {
          dispatch(setStakeHash(null));
          message.success('Transaction has been proceeded', 3, () => {
            cb && cb('successful');
          });
          noticeData && dispatch(add_SOL_stake_Notice(noticeData.uuid, noticeData.amount, noticeStatus.Confirmed));
        } else if (e == 'failure' || e == 'stakingFailure') {
          const solana = solServer.getProvider();
          if (!solana.isConnected) {
            solana.connect().then((res: any) => {
              if (res) {
                dispatch(
                  getBlock(txHash, noticeData ? noticeData.uuid : null, () => {
                    cb && cb('successful');
                  }),
                );
              }
            });
          } else {
            dispatch(
              getBlock(txHash, noticeData ? noticeData.uuid : null, () => {
                cb && cb('successful');
              }),
            );
          }
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
  (txHash: string, uuid?: string, cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    try {
      const address = getState().rSOLModule.solAccount.address;
      const validPools = getState().rSOLModule.validPools;
      const processParameter = getState().rSOLModule.processParameter;
      const { destChainId, targetAddress } = processParameter;

      const solServer = new SolServer();
      const { amount, poolAddress, blockhash } = await solServer.getTransactionDetail(
        getState().rSOLModule.solAccount.address,
        txHash,
      );

      if (!amount || !poolAddress || !blockhash) {
        message.error('Transaction record not found');
        return;
      }

      const poolData = validPools.find((item: any) => {
        if (keyring.init(Symbol.Sol).encodeAddress(item.poolPubkey) == poolAddress) {
          return true;
        }
      });

      if (!poolData) {
        // message.error('The destination address in the transaction does not match the pool address');
        return;
      }

      const hexBlockHash = u8aToHex(base58.decode(blockhash));
      const hexTxHash = u8aToHex(base58.decode(txHash));

      dispatch(
        initProcess({
          sending: {
            packing: processStatus.success,
            brocasting: processStatus.success,
            finalizing: processStatus.success,
            checkTx: hexTxHash,
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
            amount: NumberUtil.solAmountToHuman(amount),
            hexTxHash,
            hexBlockHash,
            address,
            type: rSymbol.Sol,
            poolAddress: poolData.poolPubkey,
          },
        }),
      );
      dispatch(
        bound(
          address,
          hexTxHash,
          hexBlockHash,
          amount,
          poolData.poolPubkey,
          rSymbol.Sol,
          destChainId,
          targetAddress,
          (r: string) => {
            if (r == 'loading') {
              uuid &&
                dispatch(
                  add_SOL_stake_Notice(uuid, NumberUtil.solAmountToHuman(amount).toString(), noticeStatus.Pending),
                );
            } else {
              dispatch(setStakeHash(null));
            }

            if (r == 'failure') {
              uuid &&
                dispatch(
                  add_SOL_stake_Notice(uuid, NumberUtil.solAmountToHuman(amount).toString(), noticeStatus.Error),
                );
            }
            if (r == 'successful') {
              uuid &&
                dispatch(
                  add_SOL_stake_Notice(uuid, NumberUtil.solAmountToHuman(amount).toString(), noticeStatus.Confirmed),
                );
              cb && cb();
              dispatch(setProcessSlider(false));
            }
          },
        ),
      );
    } catch (e) {
      message.error(e.message);
    }
  };

export const getPools =
  (cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    commonClice.getPools(rSymbol.Sol, Symbol.Sol, (data: any) => {
      dispatch(setValidPools(data));
      cb && cb();
    });
    const data = await commonClice.poolBalanceLimit(rSymbol.Sol);
    dispatch(setPoolLimit(data));
  };

export const getReward =
  (pageIndex: Number, cb: Function): AppThunk =>
  async (dispatch, getState) => {
    const fisSource = getState().FISModule.fisAccount.address;
    const ethAccount = getState().rETHModule.ethAccount;
    const bscAccount = getState().BSCModule.bscAccount;
    const solAccount = getState().rSOLModule.solAccount;
    dispatch(setLoading(true));
    try {
      if (pageIndex == 0) {
        dispatch(setRewardList([]));
        dispatch(setRewardList_lastdata(null));
      }
      const result = await rpcServer.getReward(
        fisSource,
        ethAccount ? ethAccount.address : '',
        rSymbol.Sol,
        pageIndex,
        bscAccount && bscAccount.address,
        solAccount && solAccount.address,
      );
      if (result.status == 80000) {
        const rewardList = getState().rSOLModule.rewardList;
        if (result.data.rewardList.length > 0) {
          const list = result.data.rewardList.map((item: any) => {
            const rate = NumberUtil.rTokenRateToHuman(item.rate);
            const rbalance = NumberUtil.tokenAmountToHuman(item.rbalance, rSymbol.Sol);
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

export const getUnbondCommission = (): AppThunk => async (dispatch, getState) => {
  const unbondCommission = await commonClice.getUnbondCommission();
  dispatch(setUnbondCommission(unbondCommission));
};

export const bondFees = (): AppThunk => async (dispatch, getState) => {
  const result = await commonClice.bondFees(rSymbol.Sol);
  dispatch(setBondFees(result));
};

export const unbondFees = (): AppThunk => async (dispatch, getState) => {
  const result = await commonClice.unbondFees(rSymbol.Sol);
  dispatch(setUnBondFees(result));
};
export const getTotalIssuance = (): AppThunk => async (dispatch, getState) => {
  const result = await commonClice.getTotalIssuance(rSymbol.Sol);
  dispatch(setTotalIssuance(result));
};

export const rTokenLedger = (): AppThunk => async (dispatch, getState) => {
  const stafiApi = await stafiServer.createStafiApi();
  const eraResult = await stafiApi.query.rTokenLedger.chainEras(rSymbol.Sol);
  let currentEra = eraResult.toJSON();
  if (currentEra) {
    let rateResult = await stafiApi.query.rTokenRate.eraRate(rSymbol.Sol, currentEra - 1);
    const currentRate = rateResult.toJSON();
    const rateResult2 = await stafiApi.query.rTokenRate.eraRate(rSymbol.Sol, currentEra - 2);
    let lastRate = rateResult2.toJSON();
    dispatch(handleStakerApr(currentRate, lastRate));
  } else {
    dispatch(handleStakerApr());
  }
};

export const getLastEraRate = (): AppThunk => async (dispatch, getState) => {
  try {
    const stafiApi = await stafiServer.createStafiApi();
    const eraResult = await stafiApi.query.rTokenLedger.chainEras(rSymbol.Sol);
    let currentEra = eraResult.toJSON();
    if (currentEra) {
      let rateResult = await stafiApi.query.rTokenRate.eraRate(rSymbol.Sol, currentEra - 1);
      const currentRate = rateResult.toJSON();
      const rateResult2 = await stafiApi.query.rTokenRate.eraRate(rSymbol.Sol, currentEra - 2);
      let lastRate = rateResult2.toJSON();
      console.log('rSOL getLastEraRate', lastRate, currentRate);
      if (Number(currentRate) <= Number(lastRate)) {
        dispatch(setLastEraRate(0));
      } else {
        dispatch(setLastEraRate(NumberUtil.rTokenRateToHuman(Number(currentRate) - Number(lastRate))));
      }
    }
  } catch (err: any) {}
};

const handleStakerApr =
  (currentRate?: any, lastRate?: any): AppThunk =>
  async (dispatch, getState) => {
    dispatch(setStakerApr('7.2%'));
    //  if (currentRate && lastRate) {
    //     const apr = NumberUtil.handleEthRoundToFixed((currentRate - lastRate)/lastRate * 4 * 365.25 * 100) + '%';
    //     dispatch(setStakerApr(apr));
    //   } else {
    //     dispatch(setStakerApr('7.2%'));
    //   }
  };
export const checkAddress = (address: string) => {
  const keyringInstance = keyring.init(Symbol.Sol);
  return keyringInstance.checkAddress(address);
};
export const accountUnbonds = (): AppThunk => async (dispatch, getState) => {
  // dispatch(getTotalUnbonding(rSymbol.Sol,(total:any)=>{
  //   dispatch(setTotalUnbonding(total));
  // }))

  let fisAddress = getState().FISModule.fisAccount.address;
  commonClice.getTotalUnbonding(fisAddress, rSymbol.Sol, (total: any) => {
    dispatch(setTotalUnbonding(total));
  });
};
const add_SOL_stake_Notice =
  (uuid: string, amount: string, status: string, subData?: any): AppThunk =>
  async (dispatch, getState) => {
    setTimeout(() => {
      dispatch(
        add_SOL_Notice(uuid, noticeType.Staker, noticesubType.Stake, amount, status, {
          process: getState().globalModule.process,
          processParameter: getState().rSOLModule.processParameter,
        }),
      );
    }, 20);
  };

export const rTokenRate = (): AppThunk => async (dispatch, getState) => {
  const ratio = await commonClice.rTokenRate(rSymbol.Sol);
  dispatch(setRatio(ratio));
};
const add_SOL_unbond_Notice =
  (uuid: string, amount: string, status: string, subData?: any): AppThunk =>
  async (dispatch, getState) => {
    dispatch(add_SOL_Notice(uuid, noticeType.Staker, noticesubType.Unbond, amount, status, subData));
  };
const add_DOT_Withdraw_Notice =
  (uuid: string, amount: string, status: string, subData?: any): AppThunk =>
  async (dispatch, getState) => {
    dispatch(add_SOL_Notice(uuid, noticeType.Staker, noticesubType.Withdraw, amount, status, subData));
  };
const add_DOT_Swap_Notice =
  (uuid: string, amount: string, status: string, subData?: any): AppThunk =>
  async (dispatch, getState) => {
    dispatch(add_SOL_Notice(uuid, noticeType.Staker, noticesubType.Swap, amount, status, subData));
  };
const add_SOL_Notice =
  (uuid: string, type: string, subType: string, content: string, status: string, subData?: any): AppThunk =>
  async (dispatch, getState) => {
    dispatch(add_Notice(uuid, Symbol.Sol, type, subType, content, status, subData));
  };
export default rSOLClice.reducer;
