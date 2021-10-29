import config from '@config/index';
import { rSymbol, Symbol } from '@keyring/defaults';
import { u8aToHex } from '@polkadot/util';
import { createSlice } from '@reduxjs/toolkit';
import EthServer from '@servers/eth/index';
import keyring from '@servers/index';
import RpcServer, { pageCount } from '@servers/rpc/index';
import Stafi from '@servers/stafi/index';
import { getLocalStorageItem, Keys, removeLocalStorageItem, setLocalStorageItem, stafi_uuid } from '@util/common';
import { default as numberUtil, default as NumberUtil } from '@util/numberUtil';
import { message } from 'antd';
import _m0 from 'protobufjs/minimal';
import PubSub from 'pubsub-js';
import { AppThunk } from '../store';
import { ETH_CHAIN_ID, STAFI_CHAIN_ID, updateSwapParamsOfBep, updateSwapParamsOfErc } from './bridgeClice';
import CommonClice from './commonClice';
import { bondStates, bound, fisUnbond, rTokenSeries_bondStates } from './FISClice';
import {
  initProcess,
  processStatus,
  setLoading,
  setProcessDestChainId,
  setProcessSending,
  setProcessSlider,
  setProcessType,
  setStakeSwapLoadingStatus
} from './globalClice';
import { add_Notice, findUuid, noticeStatus, noticesubType, noticeType } from './noticeClice';
import { connectMetamask, get_eth_getBalance } from './rETHClice';

const commonClice = new CommonClice();

const rBNBClice = createSlice({
  name: 'rBNBModule',
  initialState: {
    validPools: [],
    poolLimit: 0,
    transferrableAmountShow: '--',
    ratio: '--',
    liquidityRate: '--',
    swapFee: '--',
    ratioShow: '--',
    tokenAmount: '--',
    processParameter: null,
    stakeHash: getLocalStorageItem(Keys.MaticStakeHash),
    unbondCommission: '--',
    bondFees: '--',
    unBondFees: '--',
    totalIssuance: '--',
    stakerApr: '--',

    ercBalance: '--',
    totalUnbonding: null,
    rewardList: [],
    rewardList_lastdata: null,
  },
  reducers: {
    setTransferrableAmountShow(state, { payload }) {
      state.transferrableAmountShow = payload;
    },
    setRatio(state, { payload }) {
      state.ratio = payload;
    },
    setLiquidityRate(state, { payload }) {
      state.liquidityRate = payload;
    },
    setSwapFee(state, { payload }) {
      state.swapFee = payload;
    },
    setRatioShow(state, { payload }) {
      state.ratioShow = payload;
    },
    setTokenAmount(state, { payload }) {
      state.tokenAmount = payload;
    },
    setProcessParameter(state, { payload }) {
      if (payload == null) {
        state.processParameter = payload;
      } else {
        let param = { ...state.processParameter, ...payload };
        state.processParameter = param;
      }
    },
    setStakeHash(state, { payload }) {
      if (payload == null) {
        removeLocalStorageItem(Keys.MaticStakeHash);
        state.stakeHash = payload;
      } else {
        setLocalStorageItem(Keys.MaticStakeHash, payload), (state.stakeHash = payload);
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
  },
});

const stafiServer = new Stafi();
const rpcServer = new RpcServer();
const ethServer = new EthServer();

export const {
  setTransferrableAmountShow,
  setRatio,
  setLiquidityRate,
  setSwapFee,
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
} = rBNBClice.actions;

export const reloadData = (): AppThunk => async (dispatch, getState) => {
  dispatch(query_rBalances_account());
  dispatch(getTotalIssuance());
  dispatch(rTokenRate());
  dispatch(accountUnbonds());
  dispatch(getPools());
};

declare const ethereum: any;

export const transfer =
  (amountparam: string, destChainId: number, targetAddress: string, cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    const isUnlocked = await ethereum._metamask.isUnlocked();
    if (!isUnlocked) {
      dispatch(connectMetamask(config.bscChainId()));
      return;
    }

    const processParameter = getState().rBNBModule.processParameter;
    const notice_uuid = (processParameter && processParameter.uuid) || stafi_uuid();

    dispatch(initProcess(null));

    const address = getState().rETHModule.ethAccount && getState().rETHModule.ethAccount.address;
    const validPools = getState().rBNBModule.validPools;
    const poolLimit = getState().rBNBModule.poolLimit;

    let web3 = ethServer.getWeb3();
    const amount = web3.utils.toWei(amountparam.toString(), 'ether');
    const amountInBnb = numberUtil.tokenAmountToChain(amountparam, rSymbol.Bnb);
    const selectedPool = commonClice.getPool(amount, validPools, poolLimit);
    if (!selectedPool || !address) {
      return;
    }

    try {
      dispatch(
        setProcessSending({
          brocasting: processStatus.loading,
          packing: processStatus.default,
        }),
      );
      dispatch(setProcessType(rSymbol.Bnb));
      dispatch(setProcessDestChainId(destChainId));
      dispatch(setProcessSlider(true));

      const amountHex = web3.utils.toHex(amount);
      const transactionParameters = {
        value: amountHex,
        gas: '0x54647',
        to: selectedPool.address,
        from: address,
        chainId: config.ethChainId(),
      };
      const txHash = await ethereum
        .request({
          method: 'eth_sendTransaction',
          params: [transactionParameters],
        })
        .catch((err: any) => {
          throw err;
        });

      if (!txHash) {
        throw new Error('tx error');
      }

      let txDetail;
      while (true) {
        await sleep(1000);
        txDetail = await ethereum
          .request({
            method: 'eth_getTransactionByHash',
            params: [txHash],
          })
          .catch((err: any) => {
            message.error(err.message);
          });

        if (!txDetail || txDetail.blockHash) {
          break;
        }
      }

      const blockHash = txDetail && txDetail.blockHash;
      if (!blockHash) {
        message.error('Error! Please try again');
        throw new Error('tx error');
      }

      dispatch(get_eth_getBalance());

      const processSendingParams = {
        brocasting: processStatus.success,
        packing: processStatus.success,
        checkTx: txHash,
      };
      dispatch(setProcessSending(processSendingParams));

      dispatch(reloadData());

      dispatch(
        setProcessParameter({
          sending: {
            amount: amountparam,
            txHash: txHash,
            blockHash: blockHash,
            address,
            uuid: notice_uuid,
          },
          staking: {
            amount: amountparam,
            txHash: txHash,
            blockHash: blockHash,
            address,
            type: rSymbol.Bnb,
            poolAddress: selectedPool.poolPubkey,
          },
          href: cb ? '/rBNB/staker/info' : null,
          destChainId,
          targetAddress,
        }),
      );
      dispatch(
        add_Matic_stake_Notice(notice_uuid, amountparam, noticeStatus.Pending, {
          process: {
            ...getState().globalModule.process,
            rSymbol: rSymbol.Bnb,
            destChainId: destChainId,
            sending: processSendingParams,
          },
          processParameter: getState().rBNBModule.processParameter,
        }),
      );

      message.info('Sending succeeded, proceeding signature');

      blockHash &&
        dispatch(
          bound(
            address,
            txHash,
            blockHash,
            amountInBnb,
            selectedPool.poolPubkey,
            rSymbol.Bnb,
            destChainId,
            targetAddress,
            (r: string) => {
              if (r == 'loading') {
                dispatch(add_Matic_stake_Notice(notice_uuid, amountparam, noticeStatus.Pending));
              } else {
                dispatch(setStakeHash(null));
              }

              if (r == 'failure') {
                dispatch(add_Matic_stake_Notice(notice_uuid, amountparam, noticeStatus.Error));
              }

              if (r == 'successful') {
                dispatch(
                  add_Matic_stake_Notice(
                    notice_uuid,
                    amountparam,
                    destChainId === STAFI_CHAIN_ID ? noticeStatus.Confirmed : noticeStatus.Swapping,
                  ),
                );
                // Set swap loading params for loading modal.
                if (destChainId === ETH_CHAIN_ID) {
                  updateSwapParamsOfErc(dispatch, notice_uuid, 'rbnb', 0, targetAddress, true);
                } else {
                  updateSwapParamsOfBep(dispatch, notice_uuid, 'rbnb', 0, targetAddress, true);
                }
                dispatch(setStakeSwapLoadingStatus(destChainId === STAFI_CHAIN_ID ? 0 : 2));
                cb && cb();
                dispatch(reloadData());
              }
            },
          ),
        );
    } catch (error) {
      if (error.message === 'MetaMask Tx Signature: User denied transaction signature.' || error.code === 4001) {
        message.error('Error: cancelled');
        dispatch(setProcessSlider(false));
      } else if (error.message === 'tx error') {
        dispatch(
          setProcessSending({
            brocasting: processStatus.success,
            packing: processStatus.failure,
          }),
        );
        dispatch(
          setProcessParameter({
            sending: {
              amount: amountparam,
              address,
              uuid: notice_uuid,
            },
            href: cb ? '/rBNB/staker/info' : null,
          }),
        );
        dispatch(reloadData());
        dispatch(
          add_Matic_stake_Notice(notice_uuid, amountparam, noticeStatus.Error, {
            process: getState().globalModule.process,
            processParameter: getState().rBNBModule.processParameter,
          }),
        );
      } else {
        dispatch(
          setProcessParameter({
            sending: {
              amount: amountparam,
              address,
              uuid: notice_uuid,
            },
            href: cb ? '/rBNB/staker/info' : null,
            destChainId,
            targetAddress,
          }),
        );
        dispatch(
          setProcessSending({
            brocasting: processStatus.failure,
            packing: processStatus.default,
          }),
        );
      }
    }
  };

function sleep(ms: any) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const query_rBalances_account = (): AppThunk => async (dispatch, getState) => {
  commonClice.query_rBalances_account(getState().FISModule.fisAccount, rSymbol.Bnb, (data: any) => {
    if (data == null) {
      dispatch(setTokenAmount(NumberUtil.handleFisAmountToFixed(0)));
    } else {
      dispatch(setTokenAmount(NumberUtil.tokenAmountToHuman(data.free, rSymbol.Bnb)));
    }
  });
};

export const reSending =
  (cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    const processParameter = getState().rBNBModule.processParameter;
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
    const processParameter = getState().rBNBModule.processParameter;
    if (processParameter) {
      const { staking, href, destChainId, targetAddress } = processParameter;
      processParameter &&
        dispatch(
          bound(
            staking.address,
            staking.txHash,
            staking.blockHash,
            NumberUtil.tokenAmountToChain(staking.amount, rSymbol.Bnb),
            staking.poolAddress,
            staking.type,
            destChainId,
            targetAddress,
            (r: string) => {
              // if (r != "failure") {
              //   (href && cb) && cb(href);
              // }

              if (r == 'loading') {
                dispatch(add_Matic_stake_Notice(processParameter.sending.uuid, staking.amount, noticeStatus.Pending));
              } else {
                dispatch(setStakeHash(null));
              }

              if (r == 'failure') {
                dispatch(add_Matic_stake_Notice(processParameter.sending.uuid, staking.amount, noticeStatus.Error));
              }

              if (r == 'successful') {
                dispatch(
                  add_Matic_stake_Notice(
                    processParameter.sending.uuid,
                    staking.amount,
                    destChainId === STAFI_CHAIN_ID ? noticeStatus.Confirmed : noticeStatus.Swapping,
                  ),
                );
                // Set swap loading params for loading modal.
                if (destChainId === ETH_CHAIN_ID) {
                  updateSwapParamsOfErc(dispatch, processParameter.sending.uuid, 'rbnb', 0, targetAddress, true);
                } else {
                  updateSwapParamsOfBep(dispatch, processParameter.sending.uuid, 'rbnb', 0, targetAddress, true);
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
      const validPools = getState().rBNBModule.validPools;
      let selectedPool = commonClice.getPoolForUnbond(amount, validPools, rSymbol.Bnb);
      if (selectedPool == null) {
        cb && cb();
        return;
      }
      const keyringInstance = keyring.init(Symbol.Bnb);

      dispatch(
        fisUnbond(
          amount,
          rSymbol.Bnb,
          u8aToHex(keyringInstance.decodeAddress(recipient)),
          selectedPool.poolPubkey,
          'Unbond succeeded, unbonding period is around ' + config.unboundAroundDays(Symbol.Bnb) + ' days',
          (r?: string, txHash?: string) => {
            dispatch(reloadData());
            if (r == 'Success') {
              dispatch(add_Matic_unbond_Notice(stafi_uuid(), willAmount, noticeStatus.Confirmed, { txHash: txHash }));
            }
            if (r == 'Failed') {
              dispatch(add_Matic_unbond_Notice(stafi_uuid(), willAmount, noticeStatus.Error));
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
  const stakeHash = getState().rBNBModule.stakeHash;
  if (stakeHash && stakeHash.blockHash && stakeHash.txHash) {
    dispatch(
      bondStates(rSymbol.Bnb, stakeHash.txHash, stakeHash.blockHash, (e: string) => {
        if (e == 'successful') {
          message.success('Minting succeeded', 3, () => {
            dispatch(setStakeHash(null));
          });
        } else {
          dispatch(getBlock(stakeHash.blockHash, stakeHash.txHash, stakeHash.notice_uuid));
        }
      }),
    );
  }
};

export const onProceed =
  (txHash: string, cb?: Function): AppThunk =>
  async (dispatch, getstate) => {
    const result = await ethereum.request({
      method: 'eth_getTransactionByHash',
      params: [txHash],
    });

    if (result) {
      const address = getstate().rETHModule.ethAccount && getstate().rETHModule.ethAccount.address;
      if (address.toLowerCase() != result.from.toLowerCase()) {
        message.error('Please select your Bnb account that sent the transaction');
        return;
      }
      const blockHash = result.blockHash;
      const noticeData = findUuid(getstate().noticeModule.noticeData, txHash, blockHash, dispatch);

      let bondSuccessParamArr: any[] = [];
      bondSuccessParamArr.push(blockHash);
      bondSuccessParamArr.push(txHash);
      let statusObj = {
        num: 0,
      };
      dispatch(
        rTokenSeries_bondStates(rSymbol.Bnb, bondSuccessParamArr, statusObj, (e: string) => {
          if (e == 'successful') {
            dispatch(setStakeHash(null));
            message.success('Transaction has been proceeded', 3, () => {
              cb && cb('successful');
            });
            noticeData && dispatch(add_Matic_stake_Notice(noticeData.uuid, noticeData.amount, noticeStatus.Confirmed));
          } else if (e == 'failure' || e == 'stakingFailure') {
            dispatch(
              getBlock(blockHash, txHash, noticeData ? noticeData.uuid : null, () => {
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
    } else {
      message.error('No results were found');
    }
  };

export const getBlock =
  (blockHash: string, txHash: string, uuid?: string, cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    try {
      const web3 = ethServer.getWeb3();
      const address = getState().rETHModule.ethAccount && getState().rETHModule.ethAccount.address;
      const validPools = getState().rBNBModule.validPools;

      const processParameter = getState().rBNBModule.processParameter;
      const { destChainId, targetAddress } = processParameter;

      const result = await ethereum.request({
        method: 'eth_getTransactionByHash',
        params: [txHash],
      });
      if (address.toLowerCase() != result.from.toLowerCase()) {
        message.error('Please select your Bnb account that sent the transaction');
        return;
      }

      let amount: any = 0;
      // if (!poolData) {
      //   // message.error("The destination address in the transaction does not match the pool address");
      //   return;
      // }

      const transferAmount = web3.utils.fromWei(result.value.toString(10), 'ether');
      amount = numberUtil.tokenAmountToChain(transferAmount, rSymbol.Bnb);
      // console.log('sfsdfsdf', transferAmount);
      // console.log('sfsdfsdf', amount);
      if (Number(amount) <= 0) {
        message.error('Wrong amount. Please Check your TxHash');
        return;
      }

      let poolPubkey = result.to;

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
            amount: NumberUtil.tokenAmountToHuman(amount, rSymbol.Bnb),
            txHash,
            blockHash,
            address,
            type: rSymbol.Bnb,
            poolAddress: poolPubkey,
          },
        }),
      );
      console.log('recovery amount', amount.toString());
      dispatch(
        bound(
          address,
          txHash,
          blockHash,
          amount.toString(),
          poolPubkey,
          rSymbol.Bnb,
          destChainId,
          targetAddress,
          (r: string) => {
            // dispatch(setStakeHash(null));

            if (r == 'loading') {
              uuid &&
                dispatch(
                  add_Matic_stake_Notice(
                    uuid,
                    NumberUtil.tokenAmountToHuman(amount, rSymbol.Bnb).toString(),
                    noticeStatus.Pending,
                  ),
                );
            } else {
              dispatch(setStakeHash(null));
            }

            if (r == 'failure') {
              uuid &&
                dispatch(
                  add_Matic_stake_Notice(
                    uuid,
                    NumberUtil.tokenAmountToHuman(amount, rSymbol.Bnb).toString(),
                    noticeStatus.Error,
                  ),
                );
            }
            if (r == 'successful') {
              uuid &&
                dispatch(
                  add_Matic_stake_Notice(
                    uuid,
                    NumberUtil.tokenAmountToHuman(amount, rSymbol.Bnb).toString(),
                    noticeStatus.Confirmed,
                  ),
                );
              cb && cb();
            }
          },
        ),
      );
    } catch (e) {
      message.error(e.message);
    }
  };

export interface MsgSend {
  fromAddress: string;
  toAddress: string;
  amount: Coin[];
}

export interface Coin {
  denom: string;
  amount: string;
}

const baseMsgSend: object = { fromAddress: '', toAddress: '' };

export const decodeMessageValue = (input: _m0.Reader | Uint8Array, length?: number): MsgSend => {
  const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
  let end = length === undefined ? reader.len : reader.pos + length;
  const message = { ...baseMsgSend } as MsgSend;
  message.amount = [];
  while (reader.pos < end) {
    const tag = reader.uint32();
    switch (tag >>> 3) {
      case 1:
        message.fromAddress = reader.string();
        break;
      case 2:
        message.toAddress = reader.string();
        break;
      case 3:
        message.amount.push(decodeCoin(reader, reader.uint32()));
        break;
      default:
        reader.skipType(tag & 7);
        break;
    }
  }
  return message;
};

const baseCoin: object = { denom: '', amount: '' };

export const decodeCoin = (input: _m0.Reader | Uint8Array, length?: number): Coin => {
  const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
  let end = length === undefined ? reader.len : reader.pos + length;
  const message = { ...baseCoin } as Coin;
  while (reader.pos < end) {
    const tag = reader.uint32();
    switch (tag >>> 3) {
      case 1:
        message.denom = reader.string();
        break;
      case 2:
        message.amount = reader.string();
        break;
      default:
        reader.skipType(tag & 7);
        break;
    }
  }
  return message;
};

export const getPools =
  (cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    commonClice.getPools(rSymbol.Bnb, Symbol.Bnb, (data: any) => {
      dispatch(setValidPools(data));
      cb && cb();
    });
    const data = await commonClice.poolBalanceLimit(rSymbol.Bnb);
    dispatch(setPoolLimit(data));
  };

export const getUnbondCommission = (): AppThunk => async (dispatch, getState) => {
  const unbondCommission = await commonClice.getUnbondCommission();
  dispatch(setUnbondCommission(unbondCommission));
};

export const bondFees = (): AppThunk => async (dispatch, getState) => {
  const result = await commonClice.bondFees(rSymbol.Bnb);
  dispatch(setBondFees(result));
};

export const unbondFees = (): AppThunk => async (dispatch, getState) => {
  const result = await commonClice.unbondFees(rSymbol.Bnb);
  dispatch(setUnBondFees(result));
};
export const getTotalIssuance = (): AppThunk => async (dispatch, getState) => {
  const result = await commonClice.getTotalIssuance(rSymbol.Bnb);
  dispatch(setTotalIssuance(result));
};

export const rTokenLedger = (): AppThunk => async (dispatch, getState) => {
  const stafiApi = await stafiServer.createStafiApi();
  const eraResult = await stafiApi.query.rTokenLedger.chainEras(rSymbol.Bnb);
  let currentEra = eraResult.toJSON();
  if (currentEra) {
    let rateResult = await stafiApi.query.rTokenRate.eraRate(rSymbol.Bnb, currentEra - 1);
    const currentRate = rateResult.toJSON();
    const rateResult2 = await stafiApi.query.rTokenRate.eraRate(rSymbol.Bnb, currentEra - 8);
    let lastRate = rateResult2.toJSON();
    dispatch(handleStakerApr(currentRate, lastRate));
  } else {
    dispatch(handleStakerApr());
  }
};
const handleStakerApr =
  (currentRate?: any, lastRate?: any): AppThunk =>
  async (dispatch, getState) => {
    // dispatch(setStakerApr('9.7%'));
    if (currentRate && lastRate) {
      const apr = NumberUtil.handleEthRoundToFixed(((currentRate - lastRate) / 1000000000000 / 7) * 365.25 * 100) + '%';
      dispatch(setStakerApr(apr));
    } else {
      dispatch(setStakerApr('9.7%'));
    }
  };

export const checkAddress = (address: string) => {
  const keyringInstance = keyring.init(Symbol.Bnb);
  return keyringInstance.checkAddress(address);
};

export const accountUnbonds = (): AppThunk => async (dispatch, getState) => {
  // dispatch(getTotalUnbonding(rSymbol.Matic,(total:any)=>{
  //   dispatch(setTotalUnbonding(total));
  // }))
  let fisAddress = getState().FISModule.fisAccount.address;
  commonClice.getTotalUnbonding(fisAddress, rSymbol.Bnb, (total: any) => {
    dispatch(setTotalUnbonding(total));
  });
};
const add_Matic_stake_Notice =
  (uuid: string, amount: string, status: string, subData?: any): AppThunk =>
  async (dispatch, getState) => {
    setTimeout(() => {
      dispatch(
        add_Matic_Notice(uuid, noticeType.Staker, noticesubType.Stake, amount, status, {
          process: getState().globalModule.process,
          processParameter: getState().rBNBModule.processParameter,
        }),
      );
    }, 20);
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
        rSymbol.Bnb,
        pageIndex,
        bscAccount && bscAccount.address,
        solAccount && solAccount.address,
      );
      if (result.status == 80000) {
        const rewardList = getState().rBNBModule.rewardList;
        if (result.data.rewardList.length > 0) {
          const list = result.data.rewardList.map((item: any) => {
            const rate = NumberUtil.rTokenRateToHuman(item.rate);
            const rbalance = NumberUtil.tokenAmountToHuman(item.rbalance, rSymbol.Bnb);
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

export const rTokenRate = (): AppThunk => async (dispatch, getState) => {
  const ratio = await commonClice.rTokenRate(rSymbol.Bnb);
  dispatch(setRatio(ratio));
};

export const rLiquidityRate = (): AppThunk => async (dispatch, getState) => {
  const rate = await commonClice.rLiquidityRate(rSymbol.Bnb);
  dispatch(setLiquidityRate(rate));
};

export const rSwapFee = (): AppThunk => async (dispatch, getState) => {
  const fee = await commonClice.rSwapFee(rSymbol.Bnb);
  dispatch(setSwapFee(fee));
};

const add_Matic_unbond_Notice =
  (uuid: string, amount: string, status: string, subData?: any): AppThunk =>
  async (dispatch, getState) => {
    dispatch(add_Matic_Notice(uuid, noticeType.Staker, noticesubType.Unbond, amount, status, subData));
  };

const add_Matic_Notice =
  (uuid: string, type: string, subType: string, content: string, status: string, subData?: any): AppThunk =>
  async (dispatch, getState) => {
    dispatch(add_Notice(uuid, Symbol.Bnb, type, subType, content, status, subData));
  };

export default rBNBClice.reducer;
