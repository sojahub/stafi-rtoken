import config from '@config/index';
import { rSymbol } from '@keyring/defaults';
import { createSlice } from '@reduxjs/toolkit';
import FeeStationServer from '@servers/feeStation';
import { getLocalStorageItem, Keys, setLocalStorageItem } from '@util/common';
import { Modal } from 'antd';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import { AppThunk } from '../store';
import { bondStates, getMinting } from './FISClice';
import { initProcess, processStatus, setProcessSending, setProcessSlider, setProcessStaking } from './globalClice';
import { setProcessParameter as atomSetProcessParameter } from './rATOMClice';
import { setProcessParameter as bnbSetProcessParameter } from './rBNBClice';
import { setProcessParameter } from './rDOTClice';
import { setProcessParameter as krmSetProcessParameter } from './rKSMClice';
import { setProcessParameter as maticSetProcessParameter } from './rMATICClice';
import { setProcessParameter as solSetProcessParameter } from './rSOLClice';

const feeStationServer = new FeeStationServer();

export enum noticeStatus {
  Confirmed = 'Confirmed',
  Pending = 'Pending',
  Error = 'Error',
  Empty = '',
}

export enum noticeType {
  Staker = 'Staker',
  Validator = 'Validator',
}

export enum noticesubType {
  Stake = 'Stake',
  Unbond = 'Unbond',
  Withdraw = 'Withdraw',
  Swap = 'Swap',
  Onboard = 'Onboard',
  Offboard = 'Offboard',
  Liquify = 'Liquify',
  Deposit = 'Deposit',
  Apply = 'Apply',
  DexSwap = 'DexSwap',
  FeeStation = 'FeeStation',
  Claim = 'Claim',
}
const noticeModal = {
  showNew: false,
  datas: [
    {
      title: '',
      context: '',
      status: noticeStatus.Confirmed,
      hxHash: '',
      blockHash: '',
      dateTime: moment(),
      rSymbol: '',
    },
  ],
};

const formatStr = 'yyyy-MM-DD HH:mm';
const noticeClice = createSlice({
  name: 'noticeModule',
  initialState: {
    noticeData: getLocalStorageItem(Keys.StafiNoticeKey),
  },
  reducers: {
    // initNotice(state,{payload}){
    //   state.noticeData=getLocalStorageItem(payload.key);
    // },
    addNoticeModal(state, { payload }) {
      let data = getLocalStorageItem(Keys.StafiNoticeKey);

      if (!data) {
        data = {};
        data.datas = [];
      }
      if (payload.showNew) {
        data.showNew = payload.showNew;
      }
      const m = data.datas.find((item: any) => {
        return item.uuid == payload.data.uuid;
      });
      if (m) {
        data.datas = data.datas.map((item: any) => {
          return item.uuid == payload.data.uuid ? payload.data : item;
        });
      } else {
        data.datas.push(payload.data);
      }
      data.datas = data.datas.sort((a: any, b: any) => {
        return moment(a.dateTime, formatStr).isAfter(moment(b.dateTime, formatStr)) ? -1 : 1;
      });
      if (data.datas.length > 10) {
        data.datas.pop();
      }
      setLocalStorageItem(Keys.StafiNoticeKey, data);
      state.noticeData = data;
    },

    updateNoticeModal(state, { payload }) {
      let data = getLocalStorageItem(Keys.StafiNoticeKey);

      if (!data) {
        data = {};
        data.datas = [];
      }
      if (payload.showNew) {
        data.showNew = payload.showNew;
      }
      const m = data.datas.find((item: any) => {
        return item.uuid == payload.data.uuid;
      });
      if (m) {
        data.datas = data.datas.map((item: any) => {
          return item.uuid == payload.data.uuid ? { ...payload.data, dateTime: item.dateTime } : item;
        });
        setLocalStorageItem(Keys.StafiNoticeKey, data);
        state.noticeData = data;
      }
    },
    readNotice(state, { payload }) {
      let data = getLocalStorageItem(Keys.StafiNoticeKey);
      if (data) {
        data.showNew = false;
        setLocalStorageItem(Keys.StafiNoticeKey, data);
        state.noticeData = data;
      }
    },
  },
});
export const { addNoticeModal, readNotice, updateNoticeModal } = noticeClice.actions;

export const add_Notice =
  (
    uuid: string,
    rSymbol: string,
    type: string,
    subType: string,
    amount: string,
    status: string,
    subData?: any,
  ): AppThunk =>
  async (dispatch, getState) => {
    dispatch(
      addNoticeModal({
        data: {
          uuid: uuid, //信息唯一标识
          title: subType,
          type: type,
          subType: subType,
          // content:content,
          amount: amount,
          dateTime: moment().format(formatStr),
          status: status,
          rSymbol: rSymbol,
          subData: subData,
        },
        showNew: true,
      }),
    );
  };

export const update_Notice =
  (
    uuid: string,
    rSymbol: string,
    type: string,
    subType: string,
    amount: string,
    status: string,
    subData?: any,
  ): AppThunk =>
  async (dispatch, getState) => {
    dispatch(
      addNoticeModal({
        data: {
          uuid: uuid, //信息唯一标识
          title: subType,
          type: type,
          subType: subType,
          // content:content,
          amount: amount,
          dateTime: moment().format(formatStr),
          status: status,
          rSymbol: rSymbol,
          subData: subData,
        },
        showNew: false,
      }),
    );
  };

export const update_NoticeNew =
  (
    uuid: string,
    rSymbol: string,
    type: string,
    subType: string,
    amount: string,
    status: string,
    subData?: any,
  ): AppThunk =>
  async (dispatch, getState) => {
    dispatch(
      updateNoticeModal({
        data: {
          uuid: uuid, //信息唯一标识
          title: subType,
          type: type,
          subType: subType,
          // content:content,
          amount: amount,
          status: status,
          rSymbol: rSymbol,
          subData: subData,
        },
        showNew: false,
      }),
    );
  };

export const setProcess =
  (item: any, list: any, cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    if (list) {
      const o = list.filter((i: any) => {
        return i.status == noticeStatus.Pending;
      });
      if (o && o.length > 0) {
        if (o.length == 1) {
          Modal.confirm({
            title: 'message',
            content: 'There is a pending transation, please check it later after the pending tx finalizes.',
            className: 'stafi_modal_confirm',
            onOk: () => {
              dispatch(setProcessSlider(true));
              dispatch(initProcess(o[0].subData.process));
              dispatch(setProcessParameter(o[0].subData.processParameter));
              dispatch(re_Minting(o[0]));
            },
          });
        } else {
          dispatch(re_Minting(o[0]));
          Modal.warning({
            title: 'message',
            content: 'Transactions are pending, please check it later.',
            className: 'stafi_modal_warning',
          });
        }
      } else {
        dispatch(setProcessSlider(true));
        dispatch(initProcess(item.subData.process));
        if (item.subData.process.rSymbol == rSymbol.Ksm) {
          dispatch(krmSetProcessParameter(item.subData.processParameter));
        }
        if (item.subData.process.rSymbol == rSymbol.Dot) {
          dispatch(setProcessParameter(item.subData.processParameter));
        }
        if (item.subData.process.rSymbol == rSymbol.Atom) {
          dispatch(atomSetProcessParameter(item.subData.processParameter));
        }
        if (item.subData.process.rSymbol == rSymbol.Sol) {
          dispatch(solSetProcessParameter(item.subData.processParameter));
        }
        if (item.subData.process.rSymbol == rSymbol.Matic) {
          dispatch(maticSetProcessParameter(item.subData.processParameter));
        }
        if (item.subData.process.rSymbol == rSymbol.Bnb) {
          dispatch(bnbSetProcessParameter(item.subData.processParameter));
        }
      }
    }
  };

const re_Minting =
  (item: any): AppThunk =>
  (dispatch, getState) => {
    if (item.subData && item.subData.processParameter) {
      dispatch(
        setProcessSending({
          brocasting: processStatus.success,
          packing: processStatus.success,
          finalizing: processStatus.success,
        }),
      );
      dispatch(
        setProcessStaking({
          brocasting: processStatus.success,
          packing: processStatus.success,
          finalizing: processStatus.success,
        }),
      );
      const staking = item.subData.processParameter.staking;
      let txHash = '';
      let blockHash = '';
      if (staking.type == rSymbol.Atom) {
        txHash = '0x' + staking.txHash;
        blockHash = '0x' + staking.blockHash;
      } else {
        txHash = staking.txHash;
        blockHash = staking.blockHash;
      }
      dispatch(
        getMinting(staking.type, txHash, blockHash, (e: string) => {
          if (e == 'successful') {
            dispatch(
              add_Notice(item.uuid, item.rSymbol, item.type, item.subType, item.amount, noticeStatus.Confirmed, {
                process: getState().globalModule.process,
                processParameter: item.subData.processParameter,
              }),
            );
          } else if (e == 'failure' || e == 'stakingFailure') {
            dispatch(
              add_Notice(item.uuid, item.rSymbol, item.type, item.subType, item.amount, noticeStatus.Error, {
                process: getState().globalModule.process,
                processParameter: item.subData.processParameter,
              }),
            );
          }
        }),
      );
    }
  };

export const findUuid = (datas: any, txHash: string, blockHash: string, dispatch: any) => {
  if (datas) {
    const data = datas.datas.find((item: any) => {
      if (
        item &&
        item.subData &&
        item.subData.processParameter &&
        item.subData.processParameter.sending &&
        item.subData.processParameter.sending.txHash == txHash &&
        item.subData.processParameter.sending.blockHash == blockHash
      ) {
        return true;
      } else {
        return false;
      }
    });
    if (data && data.status != noticeStatus.Confirmed) {
      if (data.subData.process.rSymbol == rSymbol.Ksm) {
        dispatch && dispatch(krmSetProcessParameter(data.subData.processParameter));
      }
      if (data.subData.process.rSymbol == rSymbol.Dot) {
        dispatch && dispatch(setProcessParameter(data.subData.processParameter));
      }
      if (data.subData.process.rSymbol == rSymbol.Atom) {
        dispatch && dispatch(atomSetProcessParameter(data.subData.processParameter));
      }
      if (data.subData.process.rSymbol == rSymbol.Matic) {
        dispatch && dispatch(maticSetProcessParameter(data.subData.processParameter));
      }
      if (data.subData.process.rSymbol == rSymbol.Sol) {
        dispatch && dispatch(solSetProcessParameter(data.subData.processParameter));
      }
      if (data.subData.process.rSymbol == rSymbol.Bnb) {
        dispatch && dispatch(bnbSetProcessParameter(data.subData.processParameter));
      }
      return {
        uuid: data.uuid,
        amount: data.subData.processParameter.sending.amount,
      };
    }
  }
  return null;
};

export const findUuidWithoutBlockhash = (datas: any, txHash: string) => {
  if (datas) {
    const data = datas.datas.find((item: any) => {
      if (
        item &&
        item.subData &&
        item.subData.processParameter &&
        item.subData.processParameter.sending &&
        item.subData.processParameter.sending.txHash == txHash
      ) {
        return true;
      } else {
        return false;
      }
    });
    if (data && data.status != noticeStatus.Confirmed) {
      return {
        uuid: data.uuid,
        amount: data.subData.processParameter.sending.amount,
      };
    }
  }
  return null;
};

export const checkAll_minting =
  (list: any): AppThunk =>
  (dispatch, getState) => {
    if (list) {
      const arryList = list.filter((i: any) => {
        return i.status != noticeStatus.Confirmed;
      });
      arryList.forEach((item: any) => {
        if (!item.subData || !item.subData.processParameter || !item.subData.processParameter.staking) {
          // continue
          return true;
        }
        const staking = item.subData.processParameter.staking;
        if (item.subData && item.subData.processParameter) {
          const staking = item.subData.processParameter.staking;
          let process = { ...item.subData.process };
          let txHash = '';
          let blockHash = '';
          if (staking.type == rSymbol.Atom) {
            txHash = '0x' + staking.txHash;
            blockHash = '0x' + staking.blockHash;
          } else {
            txHash = staking.txHash;
            blockHash = staking.blockHash;
          }
          dispatch(
            bondStates(staking.type, txHash, blockHash, (e: string) => {
              if (e == 'successful') {
                process.sending = {
                  ...process.sending,
                  ...{
                    brocasting: processStatus.success,
                    packing: processStatus.success,
                    finalizing: processStatus.success,
                  },
                };
                process.staking = {
                  ...process.staking,
                  ...{
                    brocasting: processStatus.success,
                    packing: processStatus.success,
                    finalizing: processStatus.success,
                  },
                };
                process.minting = {
                  ...process.minting,
                  ...{
                    brocasting: processStatus.success,
                    minting: processStatus.success,
                  },
                };
                dispatch(
                  update_Notice(item.uuid, item.rSymbol, item.type, item.subType, item.amount, noticeStatus.Confirmed, {
                    process: process,
                    processParameter: item.subData.processParameter,
                  }),
                );
              } else if (e == 'stakingFailure') {
                if (item.status == noticeStatus.Pending) {
                  process.sending = {
                    ...process.sending,
                    ...{
                      brocasting: processStatus.success,
                      packing: processStatus.success,
                      finalizing: processStatus.success,
                    },
                  };
                  process.staking = {
                    ...process.staking,
                    ...{
                      brocasting: processStatus.success,
                      packing: processStatus.failure,
                      finalizing: processStatus.failure,
                    },
                  };
                  process.minting = {
                    ...process.minting,
                    ...{
                      brocasting: processStatus.default,
                      minting: processStatus.default,
                    },
                  };
                }
                dispatch(
                  update_Notice(item.uuid, item.rSymbol, item.type, item.subType, item.amount, noticeStatus.Error, {
                    process: process,
                    processParameter: item.subData.processParameter,
                  }),
                );
              } else if (e == 'pending') {
                process.sending = {
                  ...process.sending,
                  ...{
                    brocasting: processStatus.success,
                    packing: processStatus.success,
                    finalizing: processStatus.success,
                  },
                };
                process.staking = {
                  ...process.staking,
                  ...{
                    brocasting: processStatus.success,
                    packing: processStatus.success,
                    finalizing: processStatus.success,
                  },
                };
                process.minting = {
                  ...process.minting,
                  ...{
                    brocasting: processStatus.loading,
                    minting: processStatus.loading,
                  },
                };
                dispatch(
                  update_Notice(item.uuid, item.rSymbol, item.type, item.subType, item.amount, noticeStatus.Pending, {
                    process: process,
                    processParameter: item.subData.processParameter,
                  }),
                );
              } else {
                if (item.status == noticeStatus.Pending) {
                  process.sending = {
                    ...process.sending,
                    ...{
                      brocasting: processStatus.success,
                      packing: processStatus.success,
                      finalizing: processStatus.success,
                    },
                  };
                  process.staking = {
                    ...process.staking,
                    ...{
                      brocasting: processStatus.success,
                      packing: processStatus.success,
                      finalizing: processStatus.success,
                    },
                  };
                  process.minting = {
                    ...process.minting,
                    ...{
                      brocasting: processStatus.failure,
                      minting: processStatus.failure,
                    },
                  };
                }
                dispatch(
                  update_Notice(item.uuid, item.rSymbol, item.type, item.subType, item.amount, noticeStatus.Error, {
                    process: process,
                    processParameter: item.subData.processParameter,
                  }),
                );
              }
            }),
          );
        }
      });
    }
  };

declare const window: any;
declare const ethereum: any;

export const check_swap_status = (): AppThunk => async (dispatch, getState) => {
  let data = getState().noticeModule.noticeData;

  if (!data || !data.datas) {
    return;
  }
  data.datas.forEach((item: any) => {
    if (item.type == noticeType.Staker && item.subType == noticesubType.Swap) {
      if (moment().isAfter(moment(item.dateTime, formatStr).add((config.swapWaitingTime() * 3) / 2, 's'))) {
        dispatch(
          updateNoticeModal({
            data: { ...item, status: noticeStatus.Confirmed },
            showNew: false,
          }),
        );
      }
    }
    if (
      item.type == noticeType.Staker &&
      item.subType == noticesubType.FeeStation &&
      item.status === noticeStatus.Pending
    ) {
      feeStationServer.getSwapInfo(item.subData).then((res) => {
        if (res.status === '80000' && res.data) {
          let newStatus = noticeStatus.Pending;
          if (res.data.swapStatus === 0 || res.data.swapStatus === 1) {
            newStatus = noticeStatus.Pending;
          } else if (res.data.swapStatus === 2) {
            newStatus = noticeStatus.Confirmed;
          } else {
            newStatus = noticeStatus.Error;
          }

          dispatch(
            updateNoticeModal({
              data: { ...item, status: newStatus },
              showNew: false,
            }),
          );
        } else {
          // console.log('xcvsd', item.subData);
          if (moment().isBefore(moment(item.dateTime, formatStr).add(14, 'd'))) {
            reHandleFeeStation(item.subData);
          }
        }
      });
    }
  });
};

function sleep(ms: any) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const reHandleFeeStation = async (params: any) => {
  const newParams = cloneDeep(params);
  if (newParams && newParams.txHash) {
    if (newParams.blockHash) {
      feeStationServer.postSwapInfo(newParams);
    } else if (newParams.symbol === 'ETH') {
      if (typeof window.ethereum !== 'undefined' && ethereum.isMetaMask) {
        let txDetail;
        while (true) {
          await sleep(1000);
          txDetail = await ethereum
            .request({
              method: 'eth_getTransactionByHash',
              params: [newParams.txHash],
            })
            .catch((err: any) => {});

          if (!txDetail || txDetail.blockHash) {
            break;
          }
        }

        const blockHash = txDetail && txDetail.blockHash;
        if (blockHash) {
          newParams.blockHash = blockHash;
          feeStationServer.postSwapInfo(newParams);
        }
      }
    }
  }
};

export const notice_text = (item: any) => {
  if (item.type == noticeType.Staker && item.subType == noticesubType.Stake) {
    return `Staked ${item.amount} ${item.rSymbol.toUpperCase()} from your Wallet to StaFi Validator Pool Contract`;
  } else if (item.type == noticeType.Validator && item.subType == noticesubType.Stake) {
    return `Your pool contract is staked`;
  } else if (item.subType == noticesubType.Unbond) {
    return `Unbond ${
      item.amount
    } ${item.rSymbol.toUpperCase()} from Pool Contract, it will be completed around ${moment(item.dateTime)
      .add(config.unboundAroundDays(item.rSymbol), 'days')
      .format('MM.DD')}`;
  } else if (item.subType == noticesubType.Withdraw) {
    return `Withdraw ${item.amount} ${item.rSymbol.toUpperCase()} from contracts to wallet`;
  } else if (item.subType == noticesubType.Swap) {
    if (item.subData.swapType == 'native') {
      if (item.subData.destSwapType === 'bep20') {
        return `Swap ${item.amount} Native ${item.rSymbol} to BEP20, it may take 2~10 minutes to arrive`;
      }
      if (item.subData.destSwapType === 'slp20') {
        return `Swap ${item.amount} Native ${item.rSymbol} to SLP20, it may take 2~10 minutes to arrive`;
      }
      return `Swap ${item.amount} Native ${item.rSymbol} to ERC20, it may take 2~10 minutes to arrive`;
    } else if (item.subData.swapType == 'bep20') {
      if (item.subData.destSwapType == 'erc20') {
        return `Swap ${item.amount} BEP20 ${item.rSymbol} to ERC20, it may take 2~10 minutes to arrive`;
      } else {
        return `Swap ${item.amount} BEP20 ${item.rSymbol} to Native, it may take 2~10 minutes to arrive`;
      }
    } else if (item.subData.swapType == 'slp20') {
      if (item.subData.destSwapType == 'native') {
        return `Swap ${item.amount} SLP20 ${item.rSymbol} to Native, it may take 2~10 minutes to arrive`;
      }
    } else {
      if (item.subData.destSwapType == 'bep20') {
        return `Swap ${item.amount} ERC20 ${item.rSymbol} to BEP20, it may take 2~10 minutes to arrive`;
      } else {
        return `Swap ${item.amount} ERC20 ${item.rSymbol} to Native, it may take 2~10 minutes to arrive`;
      }
    }
  } else if (item.subType == noticesubType.Deposit) {
    return `Deposit ${item.amount} ETH to register as a validator`;
  } else if (item.subType == noticesubType.Offboard) {
    return `Validator Offboarded`;
  } else if (item.type == noticeType.Staker && item.subType == noticesubType.DexSwap) {
    return `Swap ${item.amount} ${item.rSymbol} to ${item.subData.receivedAmount} ${item.subData.destTokenName}.`;
  } else if (item.type == noticeType.Staker && item.subType == noticesubType.FeeStation) {
    return `Swap ${item.amount} ${item.subData && item.subData.symbol} to ${
      item.subData && item.subData.receiveFisAmount
    } FIS.`;
  } else if (item.type == noticeType.Staker && item.subType == noticesubType.Claim) {
    return `Claim ${item.amount} FIS from the Mint Program.`;
  }
  return '';
};
export default noticeClice.reducer;
