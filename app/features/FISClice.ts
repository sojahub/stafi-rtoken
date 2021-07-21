import config from '@config/index';
import { rSymbol, Symbol } from '@keyring/defaults';
import { web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import { u8aToHex } from '@polkadot/util';
import { createSlice } from '@reduxjs/toolkit';
import { default as keyring, default as keyringInstance } from '@servers/index';
import SolServer from '@servers/sol/index';
import Stafi from '@servers/stafi/index';
import { PublicKey } from '@solana/web3.js';
import { getLocalStorageItem, Keys, removeLocalStorageItem, setLocalStorageItem, stafi_uuid, timeout } from '@util/common';
import NumberUtil from '@util/numberUtil';
import StringUtil from '@util/stringUtil';
import { message as M, message } from 'antd';
import { keccakFromHexString } from 'ethereumjs-util';
import { AppThunk } from '../store';
import CommonClice from './commonClice';
import RpcServer,{pageCount} from '@servers/rpc/index';
import {
  initProcess,
  processStatus,
  setLoading,
  setProcessMinting, setProcessSlider,
  setProcessStaking,
  setProcessType
} from './globalClice';
import { add_Notice, noticeStatus, noticesubType, noticeType } from './noticeClice';

declare const ethereum: any;
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
    unbondCommission: "--",
    totalIssuance: "--",

    stakerApr: "--",
    bondFees: "--",
    totalUnbonding: "--",
    unBondFees: "--",
    withdrawToken: "--",
    unbondingToken: "--",
    leftDays: "--",
    unbondings: [],

    unbondWarn: false,
    currentLedgerData: "",



    nominateStatus: 0,
    lastReward: "--",
    currentCommission: "--",
    exposure: null,
    validatorAddressItems: [],

    rewardList:[],
    rewardList_lastdata:null
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
        setLocalStorageItem(Keys.FisStakeHash, param), (state.stakeHash = payload);
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
      state.stakerApr = payload
    },
    setBondFees(state, { payload }) {
      state.bondFees = payload
    },
    setTotalUnbonding(state, { payload }) {
      state.bondFees = payload;
    },
    setUnBondFees(state, { payload }) {
      state.unBondFees = payload
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
      state.exposure = payload
    },
    setValidatorAddressItems(state, { payload }) {
      state.validatorAddressItems = payload
    },

    setRewardList(state,{payload}){
      state.rewardList=payload;
    },

    setRewardList_lastdata(state,{payload}){
      state.rewardList_lastdata=payload;
    }
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


  setRewardList,
  setRewardList_lastdata
} = FISClice.actions;


export const reloadData = (): AppThunk => async (dispatch, getState) => {
  const account = getState().FISModule.fisAccount;
  if (account) {
    dispatch(createSubstrate(account));
  }
  dispatch(query_rBalances_account());
  dispatch(balancesAll());
  dispatch(getTotalIssuance());
};
export const createSubstrate =
  (account: any): AppThunk =>
    async (dispatch, getState) => {
      queryBalance(account, dispatch, getState);
    };

const queryBalance = async (account: any, dispatch: any, getState: any) => {
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

export const transfer =
  (amountparam: number, cb?: Function): AppThunk =>
    async (dispatch, getState) => {
      const amount = NumberUtil.fisAmountToChain(amountparam);
      const poolLimit = getState().FISModule.poolLimit;
      const validPools = getState().FISModule.validPools;
      const selectedPool = commonClice.getFisPool(amount, validPools, poolLimit, "The cumulative FIS amount exceeds the pool limit, please try again later!");
      if (selectedPool == null) {
        return;
      }

      try {
        dispatch(setLoading(true))
        web3Enable(stafiServer.getWeb3EnalbeName());
        const injector = await web3FromSource(stafiServer.getPolkadotJsSource());
        const stafiApi = await stafiServer.createStafiApi();
        let currentAccount = getState().FISModule.fisAccount.address;
        stafiApi.tx.rFis.liquidityBond(selectedPool.address, amount.toString())
          .signAndSend(currentAccount, { signer: injector.signer }, (result: any) => {
            if (result.status.isInBlock) {
              dispatch(setLoading(false))
              result.events
                .filter((result2: any) => () => {
                  const section = result2.event.section;
                  return section === 'system';
                })
                .forEach((result3: any) => {
                  const data = result3.event.data;
                  const method = result3.event.method;
                  if (method === 'ExtrinsicFailed') {
                    const [dispatchError] = data
                    if (dispatchError.isModule) {
                      try {
                        const mod = dispatchError.asModule;
                        const error = data.registry.findMetaError(new Uint8Array([mod.index.toNumber(), mod.error.toNumber()]));

                        let messageStr = 'Something is wrong, please try again later!';
                        if (error.name == 'NominateSwitchClosed') {
                          messageStr = 'Unable to stake, system is waiting for matching validators';
                        } else if (error.name == 'LiquidityBondZero') {
                          messageStr = 'The amount should be larger than 0';
                        } else if (error.name == 'PoolLimitReached') {
                          messageStr = 'The cumulative FIS amount exceeds the pool limit, please try again later!';
                        }
                        message.error(message);
                      } catch (error) {
                        message.error(error.message);
                      }
                    }
                  } else if (method === 'ExtrinsicSuccess') {
                    message.success('Stake successfully');
                    dispatch(reloadData());
                    dispatch(add_FIS_stake_Notice(stafi_uuid(), amountparam.toString(), noticeStatus.Confirmed))
                    cb && cb();
                  }
                });

            } else if (result.isError) {
              dispatch(setLoading(false));
              message.error(result.toHuman())
            }

          }).catch((error: any) => {
            dispatch(setLoading(false))
            message.error(error.message)
            if (error.message == "Error: Cancelled") {
              message.error("Cancelled");
            } else {
              console.error(error.message);
            }
          });

      } catch (e: any) {
      }


    };

export const stakingSignature = async (address: any, txHash: string) => {
  message.info('Sending succeeded, proceeding signature.');
  await timeout(5000);
  web3Enable(stafiServer.getWeb3EnalbeName());
  const injector = await web3FromSource(stafiServer.getPolkadotJsSource());
  const signRaw = injector?.signer?.signRaw;
  const { signature } = await signRaw({
    address: address,
    data: txHash,
    type: 'bytes',
  });
  return signature;
};

export const solSignature = async (address: any, fisAddress: string) => {
  message.info('Sending succeeded, proceeding signature.');
  await timeout(3000);
  message.info('Please approve sign request in sollet wallet.', 5);

  const fisKeyring = keyringInstance.init(Symbol.Fis);
  const solServer = new SolServer();

  // fisAddress = '34bwmgT1NtcL8FayGiFSB9F1qZFGPjhbDfTaZRoM2AXgjrpo';
  // let { signature } = await solServer.getWallet().sign(new TextEncoder().encode(fisAddress), 'utf8');
  let { signature } = await solServer.getWallet().sign(fisKeyring.decodeAddress(fisAddress), 'utf8');
  // return new TextDecoder().decode(signature);
  console.log('signature: ', signature);
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
    amount: number,
    pooladdress: string,
    type: rSymbol,
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
        let fisAddress = getState().FISModule.fisAccount.address;
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
          message.info('Sending succeeded, proceeding signature.');
          await timeout(3000);
          const ethAddress = getState().rMATICModule.maticAccount.address;
          const fisPubkey = u8aToHex(keyringInstance.decodeAddress(fisAddress));
          const msgHash = keccakFromHexString(fisPubkey);
          pubkey = address;
          signature = await ethereum.request({
            method: 'eth_sign',
            params: [ethAddress, u8aToHex(msgHash)],
          })
          message.info('Signature succeeded, proceeding staking');
        } else if (type == rSymbol.Sol) {
          signature = await solSignature(address, fisAddress);
          const solKeyring = keyring.init(Symbol.Sol);
          pubkey = u8aToHex(new PublicKey(getState().rSOLModule.solAccount.address).toBytes());
          // blockhash = u8aToHex(base58.decode(blockhash));
          // txhash = u8aToHex(base58.decode(txhash));

          // console.log('solAccount: ', getState().rSOLModule.solAccount);
          message.info('Signature succeeded, proceeding staking');
        } else {
          signature = await stakingSignature(address, u8aToHex(keyringInstance.decodeAddress(fisAddress)));
          pubkey = u8aToHex(keyringInstance.decodeAddress(address));

          message.info('Signature succeeded, proceeding staking');
        }

        await timeout(5000);

        web3Enable(stafiServer.getWeb3EnalbeName());
        const injector = await web3FromSource(stafiServer.getPolkadotJsSource());

        const bondResult = await stafiApi.tx.rTokenSeries.liquidityBond(
          pubkey,
          signature,
          poolPubkey,
          blockhash,
          txhash,
          amount.toString(),
          type,
        );

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

                            let message: string = 'Something is wrong, please try again later!';
                            if (error.name == '') {
                              message = '';
                            }
                            message && M.info(message);
                          } catch (error) {
                            console.log('catch error');
                            M.error(error.message);
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
                  M.error(result.toHuman());
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
                M.error(e.message);
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
        }
      }
    };

export const balancesAll = (): AppThunk => async (dispatch, getState) => {
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
        const address = getState().FISModule.fisAccount.address;
        const validPools = getState().FISModule.validPools;
        const poolLimit = getState().FISModule.poolLimit;
        const result = await api.rpc.chain.getBlock(blockHash);
        let u = false;
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
              bound(address, txHash, blockHash, amount, selectedPool.poolPubkey, 0);
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
            message.success('minting succeeded', 3, () => {
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
      console.log(`bondSuccessParamArr: ${type} ${JSON.stringify(bondSuccessParamArr)}`);
      console.log('bondState result: ', bondState);
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
      console.log(`bondSuccessParamArr2: ${type} ${JSON.stringify(bondSuccessParamArr)}`);
      console.log('bondState result2: ', JSON.stringify(result));
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

export const unbond = (amount: string, willAmount: any, cb?: Function): AppThunk => async (dispatch, getState) => {

  try {
    dispatch(setLoading(true));
    const validPools = getState().FISModule.validPools;
    let selectedPool = commonClice.getPoolForUnbond(amount, validPools, rSymbol.Fis, "'No pool available, please try again later!");
    if (selectedPool == null) {
      dispatch(setLoading(false));
      return;
    }
    let address = getState().FISModule.fisAccount.address

    const stafiApi = await stafiServer.createStafiApi();

    web3Enable(stafiServer.getWeb3EnalbeName());
    const injector = await web3FromSource(stafiServer.getPolkadotJsSource());

    const api = await stafiApi.tx.rFis.liquidityUnbond(selectedPool.address, NumberUtil.tokenAmountToChain(amount, rSymbol.Fis).toString())

    api.signAndSend(address, { signer: injector.signer }, (result: any) => {
      if (result.status.isInBlock) {
        dispatch(setLoading(false));
        result.events
          .filter((data: any) => {
            let section = data.event.section;
            return section === 'system';
          })
          .forEach((item: any) => {
            let data = item.event.data;
            let method = item.event.method;
            if (method === 'ExtrinsicFailed') {
              const [dispatchError] = data;
              if (dispatchError.isModule) {

                try {
                  const mod = dispatchError.asModule;
                  const error = data.registry.findMetaError(new Uint8Array([mod.index.toNumber(), mod.error.toNumber()]));

                  let messageStr = 'Something is wrong, please try again later!';
                  if (error.name == 'LiquidityUnbondZero') {
                    messageStr = 'The input amount should be larger than 0';
                  } else if (error.name == 'InsufficientBalance') {
                    messageStr = 'Insufficient balance!';
                  }
                  message.error(messageStr);
                } catch (error) {
                  message.error(error.message);
                }
                dispatch(add_FIS_unbond_Notice(stafi_uuid(), willAmount, noticeStatus.Error));
              }
            } else if (method === 'ExtrinsicSuccess') {
              dispatch(reloadData());
              message.success("Unbond successfully, you can withdraw your unbonded FIS 14 days later");
              dispatch(add_FIS_unbond_Notice(stafi_uuid(), willAmount, noticeStatus.Confirmed));
              cb && cb();
            }
          });
      } else if (result.isError) {
        dispatch(setLoading(false));
        message.error(result.toHuman());
      }
    }).catch((e: any) => {
      dispatch(setLoading(false));
      if (e == 'Error: Cancelled') {
        message.error('Cancelled');
        cb && cb();
      } else {
        console.error(e);
      }
    });;
  } catch (e) {
    dispatch(setLoading(false));
  }
}



export const fisUnbond =
  (amount: string, rSymbol: number, recipient: string, selectedPool: string, topstr: string, cb?: Function): AppThunk =>
    async (dispatch, getState) => {
      try {
        const address = getState().FISModule.fisAccount.address;
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
                      dispatch(reloadData());
                      cb && cb('Success');
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
}

export const rTokenLedger = (): AppThunk => async (dispatch, getState) => {
  const stafiApi = await stafiServer.createStafiApi();
  const eraResult = await stafiApi.query.rTokenLedger.chainEras(rSymbol.Fis);
  let currentEra = eraResult.toJSON();
  if (currentEra) {
    let rateResult = await stafiApi.query.rTokenRate.eraRate(rSymbol.Fis, currentEra - 1)
    const currentRate = rateResult.toJSON();
    const rateResult2 = await stafiApi.query.rTokenRate.eraRate(rSymbol.Fis, currentEra - 8)
    let lastRate = rateResult2.toJSON();
    dispatch(handleStakerApr(currentRate, lastRate));
  } else {
    dispatch(handleStakerApr());
  }
}
const handleStakerApr = (currentRate?: any, lastRate?: any): AppThunk => async (dispatch, getState) => {
  if (currentRate && lastRate) {
    const apr = NumberUtil.handleEthRoundToFixed((currentRate - lastRate) / 1000000000000 / 7 * 365.25 * 100) + '%';
    dispatch(setStakerApr(apr));
  } else {
    dispatch(setStakerApr('14.9%'));
  }
}
export const bondFees = (): AppThunk => async (dispatch, getState) => {

  const result = await commonClice.bondFees(rSymbol.Fis)
  dispatch(setBondFees(result));
}

export const accountUnbonds = (): AppThunk => async (dispatch, getState) => {
  let fisAddress = getState().FISModule.fisAccount.address;
  const validPools = getState().FISModule.validPools;
  // await getTotalUnbonding(fisAddress,validPools,(total:any)=>{ 
  //   dispatch(setTotalUnbonding(total));
  // })
  dispatch(getTotalUnbonding(fisAddress, validPools))
}


const getTotalUnbonding = (fisAddress: string, pools: any): AppThunk => async (dispatch, getState) => {
  // let fisAddress = getState().FISModule.fisAccount.address;

  const stafiApi = await stafiServer.createStafiApi();
  const eraResult = await stafiApi.query.staking.currentEra();
  let currentEra = eraResult.toJSON();
  if (pools && pools.length > 0) {
    let unbondingToken = 0;

    pools.forEach(async (pool: any) => {
      const unbondingData = await stafiApi.query.rFis.unbonding(fisAddress, pool);
      let unbondings = unbondingData.toJSON();
      if (unbondings && unbondings.length > 0) {
        unbondings.forEach((unbonding: any) => {
          if (currentEra < unbonding.era) {
            unbondingToken += Number(unbonding.value);
          }
        });
      }
      dispatch(setTotalUnbonding(unbondingToken));

    })
  }
}

export const unbondFees = (): AppThunk => async (dispatch, getState) => {
  const result = await commonClice.unbondFees(rSymbol.Fis)
  dispatch(setUnBondFees(result));
}


export const getPools = (cb?: Function): AppThunk => async (dispatch, getState) => {
  dispatch(setValidPools(null));
  const data = await commonClice.fis_poolBalanceLimit();
  dispatch(setPoolLimit(data));

  commonClice.getFisPools((poolData: any) => {
    dispatch(setValidPools(poolData));
    cb && cb();
  });
}


export const RefreshUnbonding = (): AppThunk => async (dispatch, getState) => {
  let currentAccount = getState().FISModule.fisAccount.address;
  const api = await stafiServer.createStafiApi();
  const eraResult = await api.query.staking.currentEra();
  let validPools: any[] = [];
  dispatch(setUnbondWarn(false))
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
            unlocks: unbondings
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
          const leftDays = (minEra - currentEra) * 6 / 24;
          dispatch(setLeftDays(leftDays))
        } else {
          dispatch(setLeftDays("--"))
        }
        dispatch(setWithdrawToken(NumberUtil.handleFisAmountToFixed(NumberUtil.fisAmountToHuman(withdrawToken))))
        // this.withdrawToken = NumberUtil.handleFisAmountToFixed(NumberUtil.fisAmountToHuman(withdrawToken));
        dispatch(setUnbondingToken(NumberUtil.handleFisAmountToFixed(NumberUtil.fisAmountToHuman(unbondingToken))));
      });

      let count = 0;
      api.query.staking.ledger(pool).then((ledgerData: any) => {
        count++;
        let ledger = ledgerData.toJSON();
        if (ledger && ledger.active > 0) {
          validPools.push({
            address: pool,
            active: ledger.active
          });
        }
        if (count >= pools.length) {
          if (validPools.length <= 0) {
            dispatch(setUnbondWarn(true))
          }
        }
      }).catch((error: any) => { });

    });
  }
  // }).catch((error) => {}); 

}

export const withdraw = (): AppThunk => async (dispatch, getState) => {

  dispatch(setLoading(true));
  try {

    const unbondings = getState().FISModule.unbondings;
    web3Enable(stafiServer.getWeb3EnalbeName());
    const injector = await web3FromSource(stafiServer.getPolkadotJsSource());

    const api = await stafiServer.createStafiApi();

    const eraResult = await api.query.staking.currentEra();
    let currentEra = eraResult.toJSON();

    let currentAccount = getState().FISModule.fisAccount.address;

    let txs: any[] = [];

    unbondings.forEach(unbondingData => {
      unbondingData.unlocks.some((unlock: any) => {
        if (currentEra >= unlock.era) {
          txs.push(api.tx.rFis.liquidityWithdrawUnbond(unbondingData.pool));
          return true;
        }
      });
    });

    if (txs.length <= 0) {
      dispatch(setLoading(false));
      message.error('Nothing to withdraw, please try again later!')
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
              return section === 'system'
            })
            .forEach((item: any) => {
              const { data, method } = item.event;
              if (method === 'ExtrinsicFailed') {
                const [dispatchError] = data
                if (dispatchError.isModule) {
                  try {
                    const mod = dispatchError.asModule;
                    const error = data.registry.findMetaError(new Uint8Array([mod.index.toNumber(), mod.error.toNumber()]));

                    let messageStr = 'Something is wrong, please try again later!';
                    message.error(messageStr)
                  } catch (error) {
                    message.error(error.message)
                  }
                }
              } else if (method === 'ExtrinsicSuccess') {
                dispatch(reloadData());
                message.success('Withdraw successfully')
              }
            });
        } else if (result.isError) {
          dispatch(setLoading(false))
          message.error(result.toHuman())
        }

      }).catch((error: any) => {
        dispatch(setLoading(false))
        message.error(error.message);
      });
  } catch (error) {
    dispatch(setLoading(false))
    message.error(error.message)
  }

}


export const getCurrentLedgerData = (): AppThunk => async (dispatch, getState) => {
  let currentAccount = getState().FISModule.fisAccount.address;
  const api = await stafiServer.createStafiApi();
  const ledgerData = await api.query.staking.ledger(currentAccount);
  let ledger = ledgerData.toJSON();
  dispatch(setCurrentLedgerData(ledger));
}

export const handleOnboard = (cb?: Function): AppThunk => async (dispatch, getState) => {


  dispatch(setLoading(true));

  web3Enable(stafiServer.getWeb3EnalbeName());
  const injector = await web3FromSource(stafiServer.getPolkadotJsSource());
  try {

    const api = await stafiServer.createStafiApi();
    let currentAccount = getState().FISModule.fisAccount.address;

    api.tx.rFis
      .onboard()
      .signAndSend(currentAccount, { signer: injector.signer }, (result: any) => {

        if (result.status.isInBlock) {
          dispatch(setLoading(false));
          result.events
            .filter((data: any) => {
              const section = data.event.section;
              return section === 'system'
            })
            .forEach((item: any) => {
              const { data, method } = item.event
              if (method === 'ExtrinsicFailed') {
                const [dispatchError] = data
                if (dispatchError.isModule) {
                  try {
                    const mod = dispatchError.asModule;
                    const error = data.registry.findMetaError(new Uint8Array([mod.index.toNumber(), mod.error.toNumber()]));

                    let messageStr = 'Something is wrong, please try again!';
                    if (error.name == 'NotController') {
                      messageStr = 'Please use your controller account';
                    } else if (error.name == 'NoSessionKey') {
                      messageStr = 'Please register your session key first';
                    } else if (error.name == 'ValidatorLimitReached') {
                      messageStr = 'The maximum number of onboarded validators has been reached';
                    } else if (error.name == 'AlreadyOnboard') {
                      messageStr = 'You are already onboard';
                    }
                    message.error(messageStr);
                  } catch (error) {
                    message.error(error.message);
                  }
                }
              } else if (method === 'ExtrinsicSuccess') {
                dispatch(reloadData());
                cb && cb();
                message.error('Onboard successfully');
              }
            }).catch((e: any) => {
              dispatch(setLoading(false));
              if (e == 'Error: Cancelled') {
                message.error('Cancelled');
                cb && cb('Cancel');
              } else {
                console.error(e);
              }
            });;
        } else if (result.isError) {
          dispatch(setLoading(false));
          message.error(result.toHuman());
        }

      }).catch((error: any) => {
        dispatch(setLoading(false));
        message.error(error.message,);
      });


  } catch (error) {
    dispatch(setLoading(false));
    message.error(error.message)
  }



}


export const initValidatorStatus = (): AppThunk => async (dispatch, getState) => {
  const currentAddress = getState().FISModule.fisAccount.address;
  dispatch(setNominateStatus(0))
  const api = await stafiServer.createStafiApi();
  const eraData = await api.query.staking.currentEra()
  let era = eraData.toJSON();

  const ledgerData = await api.query.staking.ledger(currentAddress)
  let ledger = ledgerData.toJSON(); 
  if (ledger) {
    const validatorsData = await api.query.session.validators()
    let validators = validatorsData.toJSON();
    if (validators && validators.length > 0 && validators.indexOf(ledger.stash) != -1) {
      dispatch(setNominateStatus(1))
    }


    const result = await stafiServer.fetchStafiValidatorApr({ validatorAddress: ledger.stash })
    if (result.status == '80000') {
      if (result.data) {
        let reward = '0';
        if (result.data.rewards) {
          reward = result.data.rewards;
        }
        dispatch(setLastReward(NumberUtil.handleFisAmountToFixed(reward)));
      }
    }


    const exposureData = await api.query.staking.erasStakersClipped(era, ledger.stash)
    let exposure = exposureData.toJSON();
    if (exposure) {
      dispatch(setExposure(exposure));
      // this.totalStakedETHShow = NumberUtil.handleFisAmountToFixed(NumberUtil.fisAmountToHuman(exposure.total));
      // this.selfDepositedShow = NumberUtil.handleFisAmountToFixed(NumberUtil.fisAmountToHuman(exposure.own));
      let exposureOthers = exposure.others;
      let addressItems: any[] = [];
      if (exposureOthers.length > 0) {
        const poolsData = await api.query.rFis.pools()
        let pools = poolsData.toJSON();
        if (pools && pools.length > 0) {
          pools.forEach((pool: any) => {
            exposureOthers.some((other: any) => {
              if (other.who == pool) {
                addressItems.push({
                  address: pool,
                  shortAddress: StringUtil.replacePkh(pool, 4, 44),
                  era: era,
                  amount: NumberUtil.handleFisAmountToFixed(NumberUtil.fisAmountToHuman(other.value))
                });
                return true;
              }
            });

          });
          dispatch(setValidatorAddressItems(addressItems))
        }
      }

    }

    try {
      const validatorData = await api.query.staking.validators(ledger.stash)
      let validatorPrefs = validatorData.toJSON();
      if (validatorPrefs) {
        let feeToHuman = NumberUtil.fisFeeToHuman(validatorPrefs.commission);
        dispatch(setCurrentCommission(NumberUtil.fisFeeToFixed(feeToHuman) + '%'));
      }
    } catch (error) {

    }

  }

}



export const handleOffboard=(cb?:Function):AppThunk=>async (dispatch, getState)=>{
  dispatch(setLoading(true));
  web3Enable(stafiServer.getWeb3EnalbeName());
  const injector=await web3FromSource(stafiServer.getPolkadotJsSource());
  const api = await stafiServer.createStafiApi();

    let currentAccount = getState().FISModule.fisAccount.address;

    api.tx.rFis
        .offboard()
        .signAndSend(currentAccount, { signer: injector.signer }, (result:any) => {
      
      if (result.status.isInBlock) {
        dispatch(setLoading(false));

        result.events
          .filter((data:any) => { 
            const section=data.event.section
            return section === 'system'
          })
          .forEach((item:any) => {
            const { data, method } =item.event
            if (method === 'ExtrinsicFailed') {
              const [dispatchError] = data
              if (dispatchError.isModule) {
                try {
                  const mod = dispatchError.asModule;
                  const error = data.registry.findMetaError(new Uint8Array([mod.index.toNumber(), mod.error.toNumber()]));

                  let messageStr = 'Something is wrong, please try again!';
                  if (error.name == 'NotController') {
                    messageStr = 'Please use your controller account';
                  }
                  message.error(messageStr)
                } catch (error) { 
                  message.error(error.message)
                }
              }
            } else if (method === 'ExtrinsicSuccess') {
              cb && cb();
              dispatch(reloadData());
              message.success('Offboard successfully')
            }
          }).catch((e: any) => {
            dispatch(setLoading(false));
            if (e == 'Error: Cancelled') {
              message.error('Cancelled');
              cb && cb('Cancel');
            } else {
              console.error(e);
            }
          });;
      } else if (result.isError) { 
        dispatch(setLoading(false));
        message.error(result.toHuman())
      }

    }).catch((error:any) => {
      dispatch(setLoading(false));
      message.error(error.message)
    });  
}

const add_FIS_stake_Notice = (uuid: string, amount: string, status: string, subData?: any): AppThunk => async (dispatch, getState) => {
  dispatch(add_FIS_Notice(uuid, noticeType.Staker, noticesubType.Stake, amount, status))
}
const add_FIS_unbond_Notice = (uuid: string, amount: string, status: string, subData?: any): AppThunk => async (dispatch, getState) => {
  dispatch(add_FIS_Notice(uuid, noticeType.Staker, noticesubType.Unbond, amount, status, subData))
}
const add_FIS_Withdraw_Notice = (uuid: string, amount: string, status: string, subData?: any): AppThunk => async (dispatch, getState) => {
  dispatch(add_FIS_Notice(uuid, noticeType.Staker, noticesubType.Withdraw, amount, status, subData))
}
const add_FIS_Swap_Notice = (uuid: string, amount: string, status: string, subData?: any): AppThunk => async (dispatch, getState) => {
  dispatch(add_FIS_Notice(uuid, noticeType.Staker, noticesubType.Swap, amount, status, subData))
}
const add_FIS_Notice = (uuid: string, type: string, subType: string, content: string, status: string, subData?: any): AppThunk => async (dispatch, getState) => {
  dispatch(add_Notice(uuid, Symbol.Fis, type, subType, content, status, subData))
}


export const getReward=(pageIndex:Number,cb:Function):AppThunk=>async (dispatch, getState)=>{
  const source=getState().FISModule.fisAccount.address; //"36NQ98C5uri7ruBKvdzWFeEJQEhGpzCvJVbMHkbTu2mCgMRo"
  const result=await rpcServer.getReward(source,rSymbol.Fis,pageIndex); 
  if(result.status==80000){ 
    const rewardList=getState().FISModule.rewardList; 
    if(result.data.rewardList.length>0){
      const list=result.data.rewardList.map((item:any)=>{
        const rate=NumberUtil.rTokenRateToHuman(item.rate);
        const rbalance=NumberUtil.tokenAmountToHuman(item.rbalance,rSymbol.Fis);
        return {
          ...item,
          rbalance:rbalance,
          rate:rate
        }
      })
      if(result.data.rewardList.length<=pageCount){
        dispatch(setRewardList_lastdata(null))
      }else{
        dispatch(setRewardList_lastdata(list[list.length-1]));
        list.pop()
      } 
      dispatch(setRewardList([...rewardList,...list])); 
      if(result.data.rewardList.length<=pageCount){
        cb && cb(false)
      }else{
        cb && cb(true)
      }
    }else{
      cb && cb(false)
    }
  }
}