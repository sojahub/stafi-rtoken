import config, { isdev } from '@config/index';
import { rSymbol, Symbol } from '@keyring/defaults';
import { u8aToHex } from '@polkadot/util';
import { createSlice } from '@reduxjs/toolkit';
import EthServer from '@servers/eth/index';
import keyring from '@servers/index';
import MaticServer from '@servers/matic/index';
import RpcServer, { pageCount } from '@servers/rpc/index';
import Stafi from '@servers/stafi/index';
import { getLocalStorageItem, Keys, removeLocalStorageItem, setLocalStorageItem, stafi_uuid } from '@util/common';
import NumberUtil from '@util/numberUtil';
import { message } from 'antd';
import InputDataDecoder from 'ethereum-input-data-decoder';
import _m0 from 'protobufjs/minimal';
import { AppThunk } from '../store';
import { ETH_CHAIN_ID, STAFI_CHAIN_ID, updateSwapParamsOfBep, updateSwapParamsOfErc } from './bridgeClice';
import CommonClice from './commonClice';
import { getAssetBalance } from './ETHClice';
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
import { setIsloadMonitoring } from './rETHClice';

declare const window: any;
declare const ethereum: any;

const commonClice = new CommonClice();
const maticServer = new MaticServer();
const stafiServer = new Stafi();
const rpcServer = new RpcServer();
const ethServer = new EthServer();

const rMATICClice = createSlice({
  name: 'rMATICModule',
  initialState: {
    maticAccounts: [],
    maticAccount: getLocalStorageItem(Keys.MaticAccountKey) && {
      ...getLocalStorageItem(Keys.MaticAccountKey),
      balance: '--',
    },
    validPools: [],
    poolLimit: 0,
    transferrableAmountShow: '--',
    ratio: '--',
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
    setMaticAccounts(state, { payload }) {
      const accounts = state.maticAccounts;
      const account = accounts.find((item: any) => {
        return item.address == payload.address;
      });
      if (account) {
        account.balance = payload.balance;
        account.name = payload.name;
      } else {
        state.maticAccounts.push(payload);
      }
    },
    setMaticAccount(state, { payload }) {
      if (payload) {
        setLocalStorageItem(Keys.MaticAccountKey, { address: payload.address, pubkey: payload.pubkey });
      }
      state.maticAccount = payload;
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

export const {
  setMaticAccounts,
  setMaticAccount,
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
} = rMATICClice.actions;

export const reloadData = (): AppThunk => async (dispatch, getState) => {
  //const account = getState().rMATICModule.maticAccount;
  // if(account){
  //   dispatch(createSubstrate(account));
  // }

  dispatch(balancesAll());
  dispatch(query_rBalances_account());
  dispatch(getTotalIssuance());
  dispatch(accountUnbonds());
  dispatch(getPools());
};

export const connectMetamask =
  (chainId: string, isAutoConnect?: boolean): AppThunk =>
  async (dispatch, getState) => {
    if (typeof window.ethereum !== 'undefined' && ethereum.isMetaMask) {
      ethereum.autoRefreshOnNetworkChange = false;

      ethereum.request({ method: 'eth_chainId' }).then((chainId: any) => {
        if (isdev()) {
          if (ethereum.chainId != chainId) {
            if (chainId == '0x3') {
              if (!isAutoConnect) {
                message.warning('Please connect to Ropsten Test Network!');
              }
            }
            if (chainId == '0x5') {
              if (!isAutoConnect) {
                message.warning('Please connect to Goerli Test Network!');
              }
            }
            return;
          }
        } else if (ethereum.chainId != '0x1') {
          if (!isAutoConnect) {
            message.warning('Please connect to Ethereum Main Network!');
          }
          return;
        }

        ethereum
          .request({ method: 'eth_requestAccounts' })
          .then((accounts: any) => {
            dispatch(handleMaticAccount(accounts[0]));
          })
          .catch((error: any) => {
            dispatch(setMaticAccount(null));
            if (error.code === 4001) {
              message.error('Please connect to MetaMask.');
            } else {
              message.error('error.message');
            }
          });
      });
    } else {
      message.warning('Please install MetaMask!');
    }
  };

export const handleMaticAccount =
  (address: string): AppThunk =>
  (dispatch, getState) => {
    if (!address) {
      return;
    }
    dispatch(setMaticAccount({ address: address, balance: '--' }));

    getAssetBalance(address, maticServer.getTokenAbi(), maticServer.getMaticTokenAddress(), (v: any) => {
      dispatch(setTransferrableAmountShow(v));
      dispatch(setMaticAccount({ address: address, balance: v }));
    });
  };

export const monitoring_Method = (): AppThunk => (dispatch, getState) => {
  const isload_monitoring = getState().rETHModule.isload_monitoring;

  if (isload_monitoring) {
    return;
  }
  if (typeof window.ethereum !== 'undefined' && ethereum.isMetaMask) {
    dispatch(setIsloadMonitoring(true));
    ethereum.autoRefreshOnNetworkChange = false;
    ethereum.on('accountsChanged', (accounts: any) => {
      if (accounts.length > 0) {
        dispatch(handleMaticAccount(accounts[0]));

        setTimeout(() => {
          dispatch(reloadData());
        }, 20);
      } else {
        // dispatch(handleMaticAccount(null));
      }
    });

    ethereum.on('chainChanged', (chainId: any) => {
      if (isdev()) {
        if (ethereum.chainId != '0x3' && location.pathname.includes('/rAsset/erc')) {
          // message.warning('Please connect to Ropsten Test Network!');
          dispatch(setMaticAccount(null));
        }
        if (ethereum.chainId != '0x5' && location.pathname.includes('/rETH')) {
          // message.warning('Please connect to Goerli Test Network!');
          dispatch(setMaticAccount(null));
        }
      } else if (ethereum.chainId != '0x1') {
        // message.warning('Please connect to Ethereum Main Network!');

        dispatch(setMaticAccount(null));
      }
    });
  }
};

export const balancesAll = (): AppThunk => (dispatch, getState) => {
  if (getState().rMATICModule.maticAccount) {
    const address = getState().rMATICModule.maticAccount.address;
    getAssetBalance(address, maticServer.getTokenAbi(), maticServer.getMaticTokenAddress(), (v: any) => {
      dispatch(setTransferrableAmountShow(v));
      dispatch(setMaticAccount({ address: address, balance: v }));
    });
  }
};

export const transfer =
  (amountparam: string, destChainId: number, targetAddress: string, cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    const processParameter = getState().rMATICModule.processParameter;
    const notice_uuid = (processParameter && processParameter.uuid) || stafi_uuid();

    dispatch(initProcess(null));

    const address = getState().rMATICModule.maticAccount.address;
    const validPools = getState().rMATICModule.validPools;
    const poolLimit = getState().rMATICModule.poolLimit;

    let web3 = ethServer.getWeb3();
    let contract = new web3.eth.Contract(maticServer.getTokenAbi(), maticServer.getMaticTokenAddress(), {
      from: address,
    });
    const amount = web3.utils.toWei(amountparam.toString()); // NumberUtil.tokenAmountToChain(amountparam,rSymbol.Matic);

    const selectedPool = commonClice.getPool(amount, validPools, poolLimit);
    if (selectedPool == null) {
      return;
    }
    try {
      dispatch(
        setProcessSending({
          brocasting: processStatus.loading,
          packing: processStatus.default,
          finalizing: processStatus.default,
        }),
      );
      dispatch(setProcessType(rSymbol.Matic));
      dispatch(setProcessDestChainId(destChainId));
      dispatch(setProcessSlider(true));

      const sendTokens: any = await contract.methods.transfer(selectedPool.address, amount).send();
      if (sendTokens && sendTokens.status) {
        const txHash = sendTokens.transactionHash;
        // const blockHash = sendTokens.blockHash;

        //const block = await client.getBlock(sendTokens.height);
        // const txHash=sendTokens.transactionHash;
        // const blockHash=block.id

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

          if (txDetail.blockHash || !txDetail) {
            break;
          }
        }

        const blockHash = txDetail && txDetail.blockHash;
        if (!blockHash) {
          message.error('Error! Please try again');
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
              href: cb ? '/rMATIC/staker/info' : null,
              destChainId,
              targetAddress,
            }),
          );
          dispatch(reloadData());
          dispatch(
            add_Matic_stake_Notice(notice_uuid, amountparam, noticeStatus.Error, {
              process: getState().globalModule.process,
              processParameter: getState().rMATICModule.processParameter,
            }),
          );
        }

        // console.log('tx, block:', txHash, blockHash);

        dispatch(
          setProcessSending({
            brocasting: processStatus.success,
            packing: processStatus.success,
            checkTx: txHash,
          }),
        );

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
              type: rSymbol.Matic,
              poolAddress: selectedPool.poolPubkey,
            },
            href: cb ? '/rMATIC/staker/info' : null,
            destChainId,
            targetAddress,
          }),
        );

        dispatch(
          add_Matic_stake_Notice(notice_uuid, amountparam, noticeStatus.Pending, {
            process: getState().globalModule.process,
            processParameter: getState().rMATICModule.processParameter,
          }),
        );
        message.info('Sending succeeded, proceeding signature');

        blockHash &&
          dispatch(
            bound(
              address,
              txHash,
              blockHash,
              amount,
              selectedPool.poolPubkey,
              rSymbol.Matic,
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
                    updateSwapParamsOfErc(dispatch, notice_uuid, 'rmatic', 0, targetAddress, true);
                  } else {
                    updateSwapParamsOfBep(dispatch, notice_uuid, 'rmatic', 0, targetAddress, true);
                  }
                  dispatch(setStakeSwapLoadingStatus(destChainId === STAFI_CHAIN_ID ? 0 : 2));
                  cb && cb();
                  dispatch(reloadData());
                }
              },
            ),
          );
      } else {
        message.error('Error! Please try again');
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
            href: cb ? '/rMATIC/staker/info' : null,
            destChainId,
            targetAddress,
          }),
        );
        dispatch(reloadData());
        dispatch(
          add_Matic_stake_Notice(notice_uuid, amountparam, noticeStatus.Error, {
            process: getState().globalModule.process,
            processParameter: getState().rMATICModule.processParameter,
          }),
        );
      }
    } catch (error) {
      if (error.message === 'MetaMask Tx Signature: User denied transaction signature.') {
        message.error('Error: cancelled');
        dispatch(setProcessSlider(false));
      } else {
        dispatch(
          setProcessParameter({
            sending: {
              amount: amountparam,
              address,
              uuid: notice_uuid,
            },
            href: cb ? '/rMATIC/staker/info' : null,
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
  commonClice.query_rBalances_account(getState().FISModule.fisAccount, rSymbol.Matic, (data: any) => {
    if (data == null) {
      dispatch(setTokenAmount(NumberUtil.handleFisAmountToFixed(0)));
    } else {
      dispatch(setTokenAmount(NumberUtil.tokenAmountToHuman(data.free, rSymbol.Matic)));
    }
  });
};

export const reSending =
  (cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    const processParameter = getState().rMATICModule.processParameter;
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
    const processParameter = getState().rMATICModule.processParameter;
    if (processParameter) {
      const { href, staking, destChainId, targetAddress } = processParameter.href;
      processParameter &&
        dispatch(
          bound(
            staking.address,
            staking.txHash,
            staking.blockHash,
            NumberUtil.tokenAmountToChain(staking.amount, rSymbol.Matic),
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
                dispatch(add_Matic_stake_Notice(processParameter.sending.uuid, staking.amount, noticeStatus.Confirmed));
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
      const validPools = getState().rMATICModule.validPools;
      let selectedPool = commonClice.getPoolForUnbond(amount, validPools, rSymbol.Matic);
      if (selectedPool == null) {
        cb && cb();
        return;
      }
      const keyringInstance = keyring.init(Symbol.Matic);

      dispatch(
        fisUnbond(
          amount,
          rSymbol.Matic,
          u8aToHex(keyringInstance.decodeAddress(recipient)),
          selectedPool.poolPubkey,
          'Unbond succeeded, unbonding period is around ' + config.unboundAroundDays(Symbol.Matic) + ' days',
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
  const stakeHash = getState().rMATICModule.stakeHash;
  if (stakeHash && stakeHash.blockHash && stakeHash.txHash) {
    dispatch(
      bondStates(rSymbol.Matic, stakeHash.txHash, stakeHash.blockHash, (e: string) => {
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
      const address = getstate().rMATICModule.maticAccount.address;
      if (address.toLowerCase() != result.from.toLowerCase()) {
        message.error('Please select your Matic account that sent the transaction');
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
        rTokenSeries_bondStates(rSymbol.Matic, bondSuccessParamArr, statusObj, (e: string) => {
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
    } else {
      message.error('No results were found');
    }
  };

export const getBlock =
  (blockHash: string, txHash: string, uuid?: string, cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    try {
      const address = getState().rMATICModule.maticAccount.address;
      const validPools = getState().rMATICModule.validPools;

      const processParameter = getState().rMATICModule.processParameter;
      const { destChainId, targetAddress } = processParameter;

      const result = await ethereum.request({
        method: 'eth_getTransactionByHash',
        params: [txHash],
      });
      if (address.toLowerCase() != result.from.toLowerCase()) {
        message.error('Please select your Matic account that sent the transaction');
        return;
      }

      let amount = 0;
      // if (!poolData) {
      //   // message.error("The destination address in the transaction does not match the pool address");
      //   return;
      // }

      const decoder = new InputDataDecoder(maticServer.getTokenAbi());
      const result2 = decoder.decodeData(result.input);
      amount = result2.inputs[1].toString(10);
      if (Number(amount) <= 0) {
        message.error('Wrong amount. Please Check your TxHash');
        return;
      }

      let poolPubkey = '0x' + result2.inputs[0];

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
            amount: NumberUtil.tokenAmountToHuman(amount, rSymbol.Matic),
            txHash,
            blockHash,
            address,
            type: rSymbol.Matic,
            poolAddress: poolPubkey,
          },
        }),
      );
      dispatch(
        bound(
          address,
          txHash,
          blockHash,
          amount.toString(),
          poolPubkey,
          rSymbol.Matic,
          destChainId,
          targetAddress,
          (r: string) => {
            // dispatch(setStakeHash(null));

            if (r == 'loading') {
              uuid &&
                dispatch(
                  add_Matic_stake_Notice(
                    uuid,
                    NumberUtil.tokenAmountToHuman(amount, rSymbol.Matic).toString(),
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
                    NumberUtil.tokenAmountToHuman(amount, rSymbol.Matic).toString(),
                    noticeStatus.Error,
                  ),
                );
            }
            if (r == 'successful') {
              uuid &&
                dispatch(
                  add_Matic_stake_Notice(
                    uuid,
                    NumberUtil.tokenAmountToHuman(amount, rSymbol.Matic).toString(),
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
    commonClice.getPools(rSymbol.Matic, Symbol.Matic, (data: any) => {
      dispatch(setValidPools(data));
      cb && cb();
    });
    const data = await commonClice.poolBalanceLimit(rSymbol.Matic);
    dispatch(setPoolLimit(data));
  };

export const getUnbondCommission = (): AppThunk => async (dispatch, getState) => {
  const unbondCommission = await commonClice.getUnbondCommission();
  dispatch(setUnbondCommission(unbondCommission));
};

export const bondFees = (): AppThunk => async (dispatch, getState) => {
  const result = await commonClice.bondFees(rSymbol.Matic);
  dispatch(setBondFees(result));
};

export const unbondFees = (): AppThunk => async (dispatch, getState) => {
  const result = await commonClice.unbondFees(rSymbol.Matic);
  dispatch(setUnBondFees(result));
};
export const getTotalIssuance = (): AppThunk => async (dispatch, getState) => {
  const result = await commonClice.getTotalIssuance(rSymbol.Matic);
  dispatch(setTotalIssuance(result));
};

export const rTokenLedger = (): AppThunk => async (dispatch, getState) => {
  const stafiApi = await stafiServer.createStafiApi();
  const eraResult = await stafiApi.query.rTokenLedger.chainEras(rSymbol.Matic);
  let currentEra = eraResult.toJSON();
  if (currentEra) {
    let rateResult = await stafiApi.query.rTokenRate.eraRate(rSymbol.Matic, currentEra - 1);
    const currentRate = rateResult.toJSON();
    const rateResult2 = await stafiApi.query.rTokenRate.eraRate(rSymbol.Matic, currentEra - 8);
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
      const apr = NumberUtil.handleEthRoundToFixed(((currentRate - lastRate) / 1000000000000 / 7) * 365.25 * 100) + '%';
      dispatch(setStakerApr(apr));
    } else {
      dispatch(setStakerApr('13.7%'));
    }
  };
export const checkAddress = (address: string) => {
  const keyringInstance = keyring.init(Symbol.Matic);
  return keyringInstance.checkAddress(address);
};
export const accountUnbonds = (): AppThunk => async (dispatch, getState) => {
  // dispatch(getTotalUnbonding(rSymbol.Matic,(total:any)=>{
  //   dispatch(setTotalUnbonding(total));
  // }))

  let fisAddress = getState().FISModule.fisAccount.address;
  commonClice.getTotalUnbonding(fisAddress, rSymbol.Matic, (total: any) => {
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
          processParameter: getState().rMATICModule.processParameter,
        }),
      );
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
        rSymbol.Matic,
        pageIndex,
      );
      if (result.status == 80000) {
        const rewardList = getState().rMATICModule.rewardList;
        if (result.data.rewardList.length > 0) {
          const list = result.data.rewardList.map((item: any) => {
            const rate = NumberUtil.rTokenRateToHuman(item.rate);
            const rbalance = NumberUtil.tokenAmountToHuman(item.rbalance, rSymbol.Matic);
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
  const ratio = await commonClice.rTokenRate(rSymbol.Matic);
  dispatch(setRatio(ratio));
};
const add_Matic_unbond_Notice =
  (uuid: string, amount: string, status: string, subData?: any): AppThunk =>
  async (dispatch, getState) => {
    dispatch(add_Matic_Notice(uuid, noticeType.Staker, noticesubType.Unbond, amount, status, subData));
  };

const add_Matic_Notice =
  (uuid: string, type: string, subType: string, content: string, status: string, subData?: any): AppThunk =>
  async (dispatch, getState) => {
    dispatch(add_Notice(uuid, Symbol.Matic, type, subType, content, status, subData));
  };
export default rMATICClice.reducer;
