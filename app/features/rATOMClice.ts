import config from '@config/index';
import { decodeTxRaw } from '@cosmjs/proto-signing';
import { coins } from '@cosmjs/stargate';
import { rSymbol, Symbol } from '@keyring/defaults';
import { u8aToHex } from '@polkadot/util';
import { createSlice } from '@reduxjs/toolkit';
import AtomServer from '@servers/atom/index';
import keyring from '@servers/index';
import RpcServer, { pageCount } from '@servers/rpc/index';
import Stafi from '@servers/stafi/index';
import { getLocalStorageItem, Keys, removeLocalStorageItem, setLocalStorageItem, stafi_uuid } from '@util/common';
import NumberUtil from '@util/numberUtil';
import { message } from 'antd';
import _m0 from 'protobufjs/minimal';
import { AppThunk } from '../store';
import CommonClice from './commonClice';
import { setSwapLoadingStatus } from './feeStationClice';
import { bondStates, bound, fisUnbond, rTokenSeries_bondStates } from './FISClice';
import {
  initProcess,
  processStatus,
  setLoading,
  setProcessSending,
  setProcessSlider,
  setProcessType
} from './globalClice';
import { add_Notice, findUuid, noticeStatus, noticesubType, noticeType } from './noticeClice';

const commonClice = new CommonClice();

const rATOMClice = createSlice({
  name: 'rATOMModule',
  initialState: {
    atomAccounts: [],
    atomAccount: getLocalStorageItem(Keys.AtomAccountKey) && {
      ...getLocalStorageItem(Keys.AtomAccountKey),
      balance: '--',
    },
    validPools: [],
    poolLimit: 0,
    transferrableAmountShow: '--',
    ratio: '--',
    liquidityRate: '--',
    swapFee: '--',
    ratioShow: '--',
    tokenAmount: '--',
    processParameter: null,
    stakeHash: getLocalStorageItem(Keys.AtomStakeHash),
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
    setAtomAccounts(state, { payload }) {
      const accounts = state.atomAccounts;
      const account = accounts.find((item: any) => {
        return item.address == payload.address;
      });
      if (account) {
        account.balance = payload.balance;
        account.name = payload.name;
      } else {
        state.atomAccounts.push(payload);
      }
    },
    setAtomAccount(state, { payload }) {
      if (payload) {
        setLocalStorageItem(Keys.AtomAccountKey, { address: payload.address, pubkey: payload.pubkey });
      }
      state.atomAccount = payload;
    },
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
        removeLocalStorageItem(Keys.AtomStakeHash);
        state.stakeHash = payload;
      } else {
        setLocalStorageItem(Keys.AtomStakeHash, payload), (state.stakeHash = payload);
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
const atomServer = new AtomServer();
const stafiServer = new Stafi();
const rpcServer = new RpcServer();
export const {
  setAtomAccounts,
  setAtomAccount,
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
} = rATOMClice.actions;

export const reloadData = (): AppThunk => async (dispatch, getState) => {
  const account = getState().rATOMModule.atomAccount;
  if (account) {
    dispatch(createSubstrate(account));
  }
  // dispatch(balancesAll())
  dispatch(query_rBalances_account());
  dispatch(getTotalIssuance());
};
export const createSubstrate =
  (account: any): AppThunk =>
  async (dispatch, getState) => {
    queryBalance(account, dispatch, getState);
  };

const queryBalance = async (account: any, dispatch: any, getState: any) => {
  try {
    dispatch(setAtomAccounts(account));
    let account2: any = { ...account };
    const client = await atomServer.createApi();
    let balances = await client.getAllBalances(account2.address);

    if (balances.length > 0) {
      const balanace = balances.find((item: any) => {
        return item.denom == config.rAtomDenom();
      });
      account2.balance = balanace ? NumberUtil.tokenAmountToHuman(balanace.amount, rSymbol.Atom) : 0;
    } else {
      account2.balance = 0;
    }
    account2.balance = NumberUtil.handleFisAmountToFixed(account2.balance);
    dispatch(setTransferrableAmountShow(account2.balance));
    dispatch(setAtomAccount(account2));
    dispatch(setAtomAccounts(account2));
  } catch (error) {}
};

export const transfer =
  (amountparam: string, cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    const processParameter = getState().rATOMModule.processParameter;
    const notice_uuid = (processParameter && processParameter.uuid) || stafi_uuid();

    dispatch(initProcess(null));

    const amount = NumberUtil.tokenAmountToChain(amountparam, rSymbol.Atom);

    const demon = config.rAtomDenom();
    const memo = getState().FISModule.fisAccount.address;
    const address = getState().rATOMModule.atomAccount.address;
    const validPools = getState().rATOMModule.validPools;
    const poolLimit = getState().rATOMModule.poolLimit;

    const selectedPool = commonClice.getPool(amount, validPools, poolLimit);
    if (selectedPool == null) {
      return;
    }
    try {
      const client = await atomServer.createApi();
      dispatch(
        setProcessSending({
          brocasting: processStatus.loading,
          packing: processStatus.default,
          finalizing: processStatus.default,
        }),
      );
      dispatch(setProcessType(rSymbol.Atom));
      dispatch(setProcessSlider(true));
      const sendTokens: any = await client.sendTokens(address, selectedPool.address, coins(amount, demon), memo);
      if (sendTokens.code == 0) {
        const block = await client.getBlock(sendTokens.height);
        const txHash = sendTokens.transactionHash;
        const blockHash = block.id;
        dispatch(
          setProcessSending({
            brocasting: processStatus.success,
            packing: processStatus.success,
            checkTx: txHash,
          }),
        );

        dispatch(reloadData());
        // dispatch(add_ATOM_stake_Notice(notice_uuid,amountparam,noticeStatus.Pending));
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
              type: rSymbol.Atom,
              poolAddress: selectedPool.poolPubkey,
            },
            href: cb ? '/rATOM/staker/info' : null,
          }),
        );

        dispatch(
          add_ATOM_stake_Notice(notice_uuid, amountparam, noticeStatus.Pending, {
            process: getState().globalModule.process,
            processParameter: getState().rATOMModule.processParameter,
          }),
        );
        blockHash &&
          dispatch(
            bound(address, txHash, blockHash, amount, selectedPool.poolPubkey, rSymbol.Atom, (r: string) => {
              if (r == 'loading') {
                dispatch(add_ATOM_stake_Notice(notice_uuid, amountparam, noticeStatus.Pending));
              } else {
                dispatch(setStakeHash(null));
              }

              if (r == 'failure') {
                dispatch(add_ATOM_stake_Notice(notice_uuid, amountparam, noticeStatus.Error));
              }

              if (r == 'successful') {
                dispatch(add_ATOM_stake_Notice(notice_uuid, amountparam, noticeStatus.Confirmed));
                cb && cb();
                dispatch(reloadData());
              }
            }),
          );
      } else {
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
            href: cb ? '/rATOM/staker/info' : null,
          }),
        );
        dispatch(reloadData());
        dispatch(
          add_ATOM_stake_Notice(notice_uuid, amountparam, noticeStatus.Error, {
            process: getState().globalModule.process,
            processParameter: getState().rATOMModule.processParameter,
          }),
        );
      }
    } catch (error) {
      dispatch(
        setProcessParameter({
          sending: {
            amount: amountparam,
            address,
            uuid: notice_uuid,
          },
          href: cb ? '/rATOM/staker/info' : null,
        }),
      );
      dispatch(
        setProcessSending({
          brocasting: processStatus.failure,
          packing: processStatus.default,
        }),
      );
    }
  };

export const swapAtomForFis =
  (
    poolAddress: string,
    amountparam: string,
    receiveFisAmountParam: any,
    minOutFisAmountParam: any,
    cb?: Function,
  ): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setLoading(true));
      dispatch(setSwapLoadingStatus(1));
      const notice_uuid = stafi_uuid();
      const amount = NumberUtil.tokenAmountToChain(amountparam, rSymbol.Atom);
      const minOutFisAmount = NumberUtil.tokenAmountToChain(minOutFisAmountParam, rSymbol.Fis);

      const demon = config.rAtomDenom();
      const memo = getState().FISModule.fisAccount.address;
      const address = getState().rATOMModule.atomAccount.address;

      if (!poolAddress) {
        dispatch(setSwapLoadingStatus(0));
        return;
      }

      try {
        const client = await atomServer.createApi();
        const sendTokens: any = await client.sendTokens(address, poolAddress, coins(amount, demon), memo);
        if (sendTokens.code == 0) {
          const block = await client.getBlock(sendTokens.height);
          const txHash = sendTokens.transactionHash;
          const blockHash = block.id;

          dispatch(reloadData());
          dispatch(setSwapLoadingStatus(2));

          dispatch(
            add_ATOM_feeStation_Notice(notice_uuid, amountparam, noticeStatus.Pending, {
              receiveFisAmount: receiveFisAmountParam,
              fisAddress: getState().FISModule.fisAccount && getState().FISModule.fisAccount.address,
              symbol: 'ATOM',
              txHash: '0x' + txHash,
              blockHash: '0x' + blockHash,
            }),
          );

          const fiskeyringInstance = keyring.init(Symbol.Fis);
          const stafiAddress = u8aToHex(fiskeyringInstance.decodeAddress(getState().FISModule.fisAccount.address));

          blockHash &&
            cb &&
            cb({
              stafiAddress,
              symbol: 'ATOM',
              blockHash: '0x' + blockHash,
              txHash: '0x' + txHash,
              poolAddress,
              signature: config.rAtomAignature,
              pubKey: getState().rATOMModule.atomAccount && getState().rATOMModule.atomAccount.pubkey,
              inAmount: amount.toString(),
              minOutAmount: minOutFisAmount.toString(),
            });
        } else {
          dispatch(reloadData());
          dispatch(setSwapLoadingStatus(0));
          dispatch(
            add_ATOM_feeStation_Notice(notice_uuid, amountparam, noticeStatus.Error, {
              receiveFisAmount: receiveFisAmountParam,
              fisAddress: getState().FISModule.fisAccount && getState().FISModule.fisAccount.address,
              symbol: 'ATOM',
            }),
          );
        }
      } catch (error) {
        dispatch(setSwapLoadingStatus(0));
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

export const query_rBalances_account = (): AppThunk => async (dispatch, getState) => {
  commonClice.query_rBalances_account(getState().FISModule.fisAccount, rSymbol.Atom, (data: any) => {
    if (data == null) {
      dispatch(setTokenAmount(NumberUtil.handleFisAmountToFixed(0)));
    } else {
      dispatch(setTokenAmount(NumberUtil.tokenAmountToHuman(data.free, rSymbol.Atom)));
    }
  });
};

export const reSending =
  (cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    const processParameter = getState().rATOMModule.processParameter;
    if (processParameter) {
      const href = processParameter.href;
      dispatch(
        transfer(processParameter.sending.amount, () => {
          cb && href && cb(href);
        }),
      );
    }
  };

export const reStaking =
  (cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    const processParameter = getState().rATOMModule.processParameter;
    if (processParameter) {
      const staking = processParameter.staking;
      const href = processParameter.href;
      processParameter &&
        dispatch(
          bound(
            staking.address,
            staking.txHash,
            staking.blockHash,
            NumberUtil.tokenAmountToChain(staking.amount, rSymbol.Atom),
            staking.poolAddress,
            staking.type,
            (r: string) => {
              // if (r != "failure") {
              //   (href && cb) && cb(href);
              // }

              if (r == 'loading') {
                dispatch(add_ATOM_stake_Notice(processParameter.sending.uuid, staking.amount, noticeStatus.Pending));
              } else {
                dispatch(setStakeHash(null));
              }

              if (r == 'failure') {
                dispatch(add_ATOM_stake_Notice(processParameter.sending.uuid, staking.amount, noticeStatus.Error));
              }

              if (r == 'successful') {
                dispatch(add_ATOM_stake_Notice(processParameter.sending.uuid, staking.amount, noticeStatus.Confirmed));
                href && cb && cb(href);
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
      const validPools = getState().rATOMModule.validPools;
      let selectedPool = commonClice.getPoolForUnbond(amount, validPools, rSymbol.Atom);
      if (selectedPool == null) {
        cb && cb();
        return;
      }
      const keyringInstance = keyring.init(Symbol.Atom);

      dispatch(
        fisUnbond(
          amount,
          rSymbol.Atom,
          u8aToHex(keyringInstance.decodeAddress(recipient)),
          selectedPool.poolPubkey,
          'Unbond succeeded, unbonding period is around ' + config.unboundAroundDays(Symbol.Atom) + ' days',
          (r?: string) => {
            dispatch(reloadData());
            if (r == 'Success') {
              dispatch(add_ATOM_unbond_Notice(stafi_uuid(), willAmount, noticeStatus.Confirmed));
            }
            if (r == 'Failed') {
              dispatch(add_ATOM_unbond_Notice(stafi_uuid(), willAmount, noticeStatus.Error));
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
  const stakeHash = getState().rATOMModule.stakeHash;
  if (stakeHash && stakeHash.blockHash && stakeHash.txHash) {
    // let bondSuccessParamArr:any[] = [];
    // bondSuccessParamArr.push("0x" + stakeHash.blockHash);
    // bondSuccessParamArr.push("0x" + stakeHash.txHash);
    // let statusObj={
    //   num:0
    // }
    dispatch(
      bondStates(rSymbol.Atom, '0x' + stakeHash.txHash, '0x' + stakeHash.blockHash, (e: string) => {
        if (e == 'successful') {
          message.success('minting succeeded', 3, () => {
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
    try {
      const client = await atomServer.createApi();
      let indexedTx = null;
      try {
        indexedTx = await client.getTx(txHash);
      } catch (error) {
        message.error('Please input the right TxHash');
        return;
      }
      if (!indexedTx) {
        message.error('Please input the right TxHash');
        return;
      }

      const block = await client.getBlock(indexedTx.height);
      const blockHash = block.id;

      const noticeData = findUuid(getstate().noticeModule.noticeData, txHash, blockHash, dispatch);

      let bondSuccessParamArr: any[] = [];
      bondSuccessParamArr.push('0x' + blockHash);
      bondSuccessParamArr.push('0x' + txHash);
      let statusObj = {
        num: 0,
      };
      dispatch(
        rTokenSeries_bondStates(rSymbol.Atom, bondSuccessParamArr, statusObj, (e: string) => {
          if (e == 'successful') {
            dispatch(setStakeHash(null));
            message.success('Transaction has been proceeded', 3, () => {
              cb && cb('successful');
            });
            noticeData && dispatch(add_ATOM_stake_Notice(noticeData.uuid, noticeData.amount, noticeStatus.Confirmed));
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
                }),
              );
              dispatch(setProcessSlider(true));
            }
          }
        }),
      );
    } catch (error) {}
  };

export const getBlock =
  (blockHash: string, txHash: string, uuid?: string, cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    try {
      const address = getState().rATOMModule.atomAccount.address;
      const validPools = getState().rATOMModule.validPools;

      const client = await atomServer.createApi();
      const indexedTx = await client.getTx(txHash);
      if (!indexedTx) {
        message.error('Please input the right TxHash');
        return;
      }
      const decodeTx = decodeTxRaw(indexedTx.tx);
      let messageValue: MsgSend = null;
      if (decodeTx.body && decodeTx.body.messages) {
        if (!decodeTx.body.memo) {
          message.error('No memo in the transaction. Please Check your TxHash');
          return;
        }

        const keyringInstance = keyring.init(Symbol.Fis);
        if (!keyringInstance.checkAddress(decodeTx.body.memo)) {
          message.error('Wrong memo in the transaction. Please Check your TxHash');
          return;
        }
        decodeTx.body.messages.forEach((message: any) => {
          if (message.typeUrl.indexOf('MsgSend') != -1) {
            messageValue = decodeMessageValue(message.value);
          }
        });
      }
      if (!messageValue) {
        message.error('Something is wrong. Please Check your TxHash');
        return;
      }

      const denom = config.rAtomDenom();
      let amount = 0;
      messageValue.amount.forEach((item) => {
        if (item.denom == denom) {
          amount = Number(item.amount);
        }
      });
      if (amount <= 0) {
        message.error('Wrong amount. Please Check your TxHash');
        return;
      }
      if (messageValue.fromAddress != address) {
        message.error(
          'Please switch your ATOM account in the Keplr extension to the account that sent the transaction',
        );
        return;
      }

      const atomKeyringInstance = keyring.init(Symbol.Atom);
      let poolPubkey = u8aToHex(atomKeyringInstance.decodeAddress(messageValue.toAddress));

      const poolData = validPools.find((item: any) => {
        if (item.poolPubkey == poolPubkey) {
          return true;
        }
      });

      if (!poolData) {
        message.error('The destination address in the transaction does not match the pool address');
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
        }),
      );
      dispatch(setProcessSlider(true));
      dispatch(
        setProcessParameter({
          staking: {
            amount: NumberUtil.tokenAmountToHuman(amount, rSymbol.Atom),
            txHash,
            blockHash,
            address,
            type: rSymbol.Atom,
            poolAddress: poolPubkey,
          },
        }),
      );
      dispatch(
        bound(address, txHash, blockHash, amount, poolPubkey, rSymbol.Atom, (r: string) => {
          // dispatch(setStakeHash(null));

          if (r == 'loading') {
            uuid &&
              dispatch(
                add_ATOM_stake_Notice(
                  uuid,
                  NumberUtil.tokenAmountToHuman(amount, rSymbol.Atom).toString(),
                  noticeStatus.Pending,
                ),
              );
          } else {
            dispatch(setStakeHash(null));
          }

          if (r == 'failure') {
            uuid &&
              dispatch(
                add_ATOM_stake_Notice(
                  uuid,
                  NumberUtil.tokenAmountToHuman(amount, rSymbol.Atom).toString(),
                  noticeStatus.Error,
                ),
              );
          }
          if (r == 'successful') {
            uuid &&
              dispatch(
                add_ATOM_stake_Notice(
                  uuid,
                  NumberUtil.tokenAmountToHuman(amount, rSymbol.Atom).toString(),
                  noticeStatus.Confirmed,
                ),
              );
            cb && cb();
          }
        }),
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
    dispatch(setValidPools(null));
    commonClice.getPools(rSymbol.Atom, Symbol.Atom, (data: any) => {
      dispatch(setValidPools(data));
      cb && cb();
    });
    const data = await commonClice.poolBalanceLimit(rSymbol.Atom);
    dispatch(setPoolLimit(data));
  };

export const getUnbondCommission = (): AppThunk => async (dispatch, getState) => {
  const unbondCommission = await commonClice.getUnbondCommission();
  dispatch(setUnbondCommission(unbondCommission));
};

export const bondFees = (): AppThunk => async (dispatch, getState) => {
  const result = await commonClice.bondFees(rSymbol.Atom);
  dispatch(setBondFees(result));
};

export const unbondFees = (): AppThunk => async (dispatch, getState) => {
  const result = await commonClice.unbondFees(rSymbol.Atom);
  dispatch(setUnBondFees(result));
};
export const getTotalIssuance = (): AppThunk => async (dispatch, getState) => {
  const result = await commonClice.getTotalIssuance(rSymbol.Atom);
  dispatch(setTotalIssuance(result));
};

export const rTokenLedger = (): AppThunk => async (dispatch, getState) => {
  const stafiApi = await stafiServer.createStafiApi();
  const eraResult = await stafiApi.query.rTokenLedger.chainEras(rSymbol.Atom);
  let currentEra = eraResult.toJSON();
  if (currentEra) {
    let rateResult = await stafiApi.query.rTokenRate.eraRate(rSymbol.Atom, currentEra - 1);
    const currentRate = rateResult.toJSON();
    const rateResult2 = await stafiApi.query.rTokenRate.eraRate(rSymbol.Atom, currentEra - 8);
    let lastRate = rateResult2.toJSON();
    dispatch(handleStakerApr(currentRate, lastRate));
  } else {
    dispatch(handleStakerApr());
  }
};

const handleStakerApr =
  (currentRate?: any, lastRate?: any): AppThunk =>
  async (dispatch, getState) => {
    if (currentRate && lastRate) {
      const apr =
        NumberUtil.handleEthRoundToFixed(((currentRate - lastRate) / 1000000000000 / 7.2) * 365.25 * 100) + '%';
      dispatch(setStakerApr(apr));
    } else {
      dispatch(setStakerApr('9.8%'));
    }
  };
// };
// const handleStakerApr =
//   (currentRate?: any, lastRate?: any): AppThunk =>
//   async (dispatch, getState) => {
//     dispatch(setStakerApr('9.8%'));
//     //  if (currentRate && lastRate) {
//     //     const apr = NumberUtil.handleEthRoundToFixed((currentRate - lastRate)/lastRate * 365.25 * 100) + '%';
//     //     dispatch(setStakerApr(apr));
//     //   } else {
//     //     dispatch(setStakerApr('9.8%'));
//     //   }
//   };
export const checkAddress = (address: string) => {
  const keyringInstance = keyring.init(Symbol.Atom);
  return keyringInstance.checkAddress(address);
};
export const accountUnbonds = (): AppThunk => async (dispatch, getState) => {
  // dispatch(getTotalUnbonding(rSymbol.Atom,(total:any)=>{
  //   dispatch(setTotalUnbonding(total));
  // }))

  let fisAddress = getState().FISModule.fisAccount.address;
  commonClice.getTotalUnbonding(fisAddress, rSymbol.Atom, (total: any) => {
    dispatch(setTotalUnbonding(total));
  });
};

const add_ATOM_stake_Notice =
  (uuid: string, amount: string, status: string, subData?: any): AppThunk =>
  async (dispatch, getState) => {
    setTimeout(() => {
      dispatch(
        add_ATOM_Notice(uuid, noticeType.Staker, noticesubType.Stake, amount, status, {
          process: getState().globalModule.process,
          processParameter: getState().rATOMModule.processParameter,
        }),
      );
    }, 20);
  };

const add_ATOM_feeStation_Notice =
  (uuid: string, amount: string, status: string, subData?: any): AppThunk =>
  async (dispatch, getState) => {
    setTimeout(() => {
      dispatch(add_ATOM_Notice(uuid, noticeType.Staker, noticesubType.FeeStation, amount, status, subData));
    }, 20);
  };

export const getReward =
  (pageIndex: Number, cb: Function): AppThunk =>
  async (dispatch, getState) => {
    const fisSource = getState().FISModule.fisAccount.address;
    const ethAccount = getState().rETHModule.ethAccount;
    dispatch(setLoading(true));
    try {
      if (pageIndex == 0) {
        dispatch(setRewardList([]));
        dispatch(setRewardList_lastdata(null));
      }
      const result = await rpcServer.getReward(
        fisSource,
        ethAccount ? ethAccount.address : '',
        rSymbol.Atom,
        pageIndex,
      );
      if (result.status == 80000) {
        const rewardList = getState().rATOMModule.rewardList;
        if (result.data.rewardList.length > 0) {
          const list = result.data.rewardList.map((item: any) => {
            const rate = NumberUtil.rTokenRateToHuman(item.rate);
            const rbalance = NumberUtil.tokenAmountToHuman(item.rbalance, rSymbol.Atom);
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
  const ratio = await commonClice.rTokenRate(rSymbol.Atom);
  dispatch(setRatio(ratio));
};
export const rLiquidityRate = (): AppThunk => async (dispatch, getState) => {
  const rate = await commonClice.rLiquidityRate(rSymbol.Atom);
  dispatch(setLiquidityRate(rate));
};
export const rSwapFee = (): AppThunk => async (dispatch, getState) => {
  const fee = await commonClice.rSwapFee(rSymbol.Atom);
  dispatch(setSwapFee(fee));
};
const add_ATOM_unbond_Notice =
  (uuid: string, amount: string, status: string, subData?: any): AppThunk =>
  async (dispatch, getState) => {
    dispatch(add_ATOM_Notice(uuid, noticeType.Staker, noticesubType.Unbond, amount, status, subData));
  };
const add_DOT_Withdraw_Notice =
  (uuid: string, amount: string, status: string, subData?: any): AppThunk =>
  async (dispatch, getState) => {
    dispatch(add_ATOM_Notice(uuid, noticeType.Staker, noticesubType.Withdraw, amount, status, subData));
  };
const add_DOT_Swap_Notice =
  (uuid: string, amount: string, status: string, subData?: any): AppThunk =>
  async (dispatch, getState) => {
    dispatch(add_ATOM_Notice(uuid, noticeType.Staker, noticesubType.Swap, amount, status, subData));
  };
const add_ATOM_Notice =
  (uuid: string, type: string, subType: string, content: string, status: string, subData?: any): AppThunk =>
  async (dispatch, getState) => {
    dispatch(add_Notice(uuid, Symbol.Atom, type, subType, content, status, subData));
  };
export default rATOMClice.reducer;
