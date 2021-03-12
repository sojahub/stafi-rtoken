import { createSlice } from '@reduxjs/toolkit';
import { Button, message as M, message } from 'antd';
import { Route } from 'react-router-dom'
import { AppThunk, RootState } from '../store';
import stafi from '@util/SubstrateApi';
import {
  processStatus, setProcessSlider, setProcessSending, setProcessStaking,
  setProcessMinting, gSetTimeOut, gClearTimeOut,
  initProcess, process
} from './globalClice';
import {
  web3Enable,
  web3FromSource,
} from '@polkadot/extension-dapp';

import { stringToHex, u8aToHex } from '@polkadot/util'
import NumberUtil from '@util/numberUtil';
import keyring from '@servers/index';
import { Symbol,rSymbol } from '@keyring/defaults';

import { setLocalStorageItem, getLocalStorageItem, Keys, removeLocalStorageItem } from '@util/common'



const FISClice = createSlice({
  name: 'FISModule',
  initialState: {
    fisAccounts: [],
    fisAccount: getLocalStorageItem(Keys.FisAccountKey),     //选中的fis账号,
    validPools: [],
    poolLimit: 0,
    transferrableAmountShow: "--",
    processParameter: null,
    stakeHash: getLocalStorageItem(Keys.FisStakeHash),
    ratio: "--",   //汇率
    ratioShow: "--",
    tokenAmount: "--",

    bondSwitch:true
  },
  reducers: {
    setFisAccounts(state, { payload }) {
      const accounts = state.fisAccounts;
      const account = accounts.find((item: any) => {
        return item.address == payload.address;
      })
      if (account) {
        account.balance = payload.balance;
      } else {
        state.fisAccounts.push(payload)
      }
    },
    setFisAccount(state, { payload }) {
      setLocalStorageItem(Keys.FisAccountKey, payload)
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
      state.tokenAmount = payload
    },
    setPoolLimit(state, { payload }) {
      state.poolLimit = payload;
    },
    setValidPools(state, { payload }) {
      if (payload == null) {
        state.validPools = []
      } else {
        state.validPools.push(payload)
      }
    },
    setStakeHash(state, { payload }) {
      if (payload == null) {
        removeLocalStorageItem(Keys.FisStakeHash)
        state.stakeHash = payload
      } else {
        let param = { ...state.processParameter, ...payload }
        setLocalStorageItem(Keys.FisStakeHash, param),
          state.stakeHash = payload;
      }
    },
    setProcessParameter(state, { payload }) {
      if (payload == null) {
        // removeLocalStorageItem(Keys.DotProcessParameter)
        state.processParameter = payload
      } else {
        let param = { ...state.processParameter, ...payload }
        // setLocalStorageItem(Keys.DotProcessParameter,param),
        state.processParameter = param;
      }
    },
    setBondSwitch(state,{payload}){
      state.bondSwitch=payload
    }
  },
});

export const { setTokenAmount,
  setFisAccounts,
  setFisAccount,
  setTransferrableAmountShow,
  setRatio,
  setRatioShow,
  setValidPools,
  setPoolLimit,
  setProcessParameter,
  setStakeHash,
  setBondSwitch } = FISClice.actions;


export const reloadData = (): AppThunk => async (dispatch, getState) => {
  const account = getState().FISModule.fisAccount;
  dispatch(createSubstrate(account));   //更新账户数据
  dispatch(balancesAll())    //更新Transferable DOT/FIS
}
export const createSubstrate = (account: any): AppThunk => async (dispatch, getState) => {
  queryBalance(account, dispatch, getState)
}

const queryBalance = async (account: any, dispatch: any, getState: any) => {
  dispatch(setFisAccounts(account));
  let account2: any = { ...account }
  const api = await stafi.createStafiApi();
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
}

export const transfer = (amountparam: string, cb?: Function): AppThunk => async (dispatch, getState) => {

  dispatch(setProcessSending({
    brocasting: processStatus.loading,
    packing: processStatus.default,
    finalizing: processStatus.default
  }));
  dispatch(setProcessSlider(true));
  const validPools = getState().FISModule.validPools;
  const poolLimit = getState().FISModule.poolLimit;
  const address = getState().FISModule.fisAccount.address;
  const amount = NumberUtil.fisAmountToChain(amountparam)
  web3Enable(stafi.getWeb3EnalbeName());
  const injector = await web3FromSource(stafi.getPolkadotJsSource())
  const stafiApi = await stafi.createStafiApi();

  const selectedPool = getPool(amountparam, validPools, poolLimit);
  if (selectedPool == null) {
    message.error("There is no matching pool, please try again later.");
    return;
  }
  const ex = stafiApi.tx.balances.transferKeepAlive(selectedPool, amount);



  ex.signAndSend(address, { signer: injector.signer }, (result: any) => {
    const tx = ex.hash.toHex()
    try {
      let asInBlock = ""
      try {
        asInBlock = "" + result.status.asInBlock;
      } catch (e) {
        //忽略异常
      }
      if (asInBlock) {
        dispatch(setProcessParameter({
          sending: {
            amount: amount,
            txHash: tx,
            blockHash: asInBlock,
            address
          },
          href: cb ? "/rDOT/staker/info" : null
        }))
        dispatch(setStakeHash({
          txHash: tx,
          blockHash: asInBlock,
        }))
      } 
      if (result.status.isInBlock) { 
        dispatch(setProcessSending({
          brocasting: processStatus.success,
          packing: processStatus.loading
        }));

        result.events
          .filter((e: any) => {
            return e.event.section == "system"
          }).forEach((data: any) => {
            if (data.event.method === 'ExtrinsicFailed') {
              const [dispatchError] = data.event.data;
              if (dispatchError.isModule) {
                try {
                  const mod = dispatchError.asModule;
                  const error = data.registry.findMetaError(new Uint8Array([mod.index.toNumber(), mod.error.toNumber()]));

                  let message: string = 'Something is wrong, please try again later!';
                  if (error.name == '') {
                    message = '';
                  }
                  message && M.info(message);
                } catch (error) {
                  M.error(error.message);
                }
              }
              dispatch(setProcessSending({
                packing: processStatus.failure,
              }));
              dispatch(reloadData());
            } else if (data.event.method === 'ExtrinsicSuccess') {
              M.success('Successfully');
              dispatch(setProcessSending({
                packing: processStatus.success,
                finalizing: processStatus.loading,
              }));
              dispatch(reloadData());
              dispatch(setProcessParameter({
                staking: {
                  amount: amount,
                  txHash: tx,
                  blockHash: asInBlock,
                  address,
                  type: rSymbol.Fis,
                  poolAddress: selectedPool
                }
              }))
              asInBlock && dispatch(bound(address, tx, asInBlock, amount, selectedPool, rSymbol.Fis, (r: any) => {
                dispatch(setStakeHash(null));
                if (r != "failure") {
                  cb && cb();
                }
              }))
              //十分钟后   finalizing失败处理 
              dispatch(gSetTimeOut(() => {
                dispatch(setProcessSending({
                  finalizing: processStatus.failure,
                }));
              }, 10 * 60 * 1000));
            }
          })
      } else if (result.isError) {
        M.error(result.toHuman());
      }
      if (result.status.isFinalized) {
        dispatch(setProcessSending({
          finalizing: processStatus.success
        }));
        //finalizing 成功清除定时器
        gClearTimeOut();

      }


    } catch (e: any) {
      M.error(e.message)
    }
  });
}


export const stakingSignature = async (address: any, txHash: string) => {
  const injector = await web3FromSource(stafi.getPolkadotJsSource());
  const signRaw = injector?.signer?.signRaw;
  const { signature } = await signRaw({
    address: address,
    data: txHash,
    type: 'bytes'
  });
  return signature
}

export const bound = (address: string, txhash: string, blockhash: string, amount: number, pooladdress: string, type: number, cb?: Function): AppThunk => async (dispatch, getState) => {
  //进入 staking 签名  
  dispatch(setProcessStaking({
    brocasting: processStatus.loading,
    packing: processStatus.default,
    finalizing: processStatus.default
  }));
  const signature = await stakingSignature(address, txhash);
  const stafiApi = await stafi.createStafiApi();
  const keyringInstance = keyring.init(Symbol.Fis);
  let pubkey = u8aToHex(keyringInstance.decodeAddress(address));
  let poolPubkey = u8aToHex(keyringInstance.decodeAddress(pooladdress));
  const injector = await web3FromSource(stafi.getPolkadotJsSource())

  let fisAddress = getState().FISModule.fisAccount.address
  const bondResult = await stafiApi.tx.rTokenSeries.liquidityBond(pubkey,
    signature,
    poolPubkey,
    blockhash,
    txhash,
    amount.toString(),
    type);
  const tx = bondResult.hash.toHex().toString();
  dispatch(setProcessStaking({
    checkTx: tx
  }));
  bondResult.signAndSend(fisAddress, { signer: injector.signer }, (result: any) => {
    try {
      if (result.status.isInBlock) {
        dispatch(setProcessStaking({
          brocasting: processStatus.success,
          packing: processStatus.loading,
        }));

        result.events
          .filter((e: any) => {
            return e.event.section == "system"
          }).forEach((data: any) => {
            if (data.event.method === 'ExtrinsicFailed') {
              const [dispatchError] = data.event.data;
              if (dispatchError.isModule) {
                try {
                  const mod = dispatchError.asModule;
                  const error = data.registry.findMetaError(new Uint8Array([mod.index.toNumber(), mod.error.toNumber()]));

                  let message: string = 'Something is wrong, please try again later!';
                  if (error.name == '') {
                    message = '';
                  }
                  message && M.info(message);
                } catch (error) {
                  M.error(error.message);
                }
              }
              dispatch(setProcessStaking({
                packing: processStatus.failure,
              }));
              cb && cb("failure");
              dispatch(reloadData());
            } else if (data.event.method === 'ExtrinsicSuccess') {
              M.success('Successfully');
              dispatch(setProcessStaking({
                packing: processStatus.success,
                finalizing: processStatus.loading,
              }));
              dispatch(getMinting(type, txhash, blockhash, cb));
              //十分钟后   finalizing失败处理 
              dispatch(gSetTimeOut(() => {
                dispatch(setProcessStaking({
                  finalizing: processStatus.failure,
                }));
              }, 10 * 60 * 1000));
              dispatch(reloadData());
            }
          })
      } else if (result.isError) {
        M.error(result.toHuman());
      }
      if (result.status.isFinalized) {
        dispatch(setProcessStaking({
          finalizing: processStatus.success
        }));
        //finalizing 成功清除定时器
        gClearTimeOut();

      }
    } catch (e: any) {
      M.error(e.message)
    }
  })
}

export const balancesAll = (): AppThunk => async (dispatch, getState) => {
  const api = await stafi.createStafiApi();
  const address = getState().FISModule.fisAccount.address;
  const result = await api.derive.balances.all(address);
  if (result) {
    const transferrableAmount = NumberUtil.fisAmountToHuman(result.availableBalance);
    const transferrableAmountShow = NumberUtil.handleFisAmountToFixed(transferrableAmount);
    dispatch(setTransferrableAmountShow(transferrableAmountShow));
  }
}


export const rTokenRate = (type: number): AppThunk => async (dispatch, getState) => {
  const api = await stafi.createStafiApi();
  const result = await api.query.rTokenRate.rate(type);   //1代表DOT    0代表FIS
  let ratio = NumberUtil.fisAmountToHuman(result.toJSON());
  if (!ratio) {
    ratio = 1;
  }
  dispatch(setRatio(ratio))
  let count = 0;
  let totalCount = 10;
  let ratioAmount = 0;
  let piece = ratio / totalCount;

  let interval = setInterval(() => {
    count++;
    ratioAmount += piece;
    if (count == totalCount) {
      ratioAmount = ratio;
      window.clearInterval(interval);
    }
    dispatch(setRatioShow(NumberUtil.handleFisAmountRateToFixed(ratioAmount)))
  }, 100);
}
export const continueProcess=():AppThunk=>async (dispatch,getState)=>{ 
  const stakeHash=getState().FISModule.stakeHash;
  if(stakeHash && stakeHash.blockHash && stakeHash.txHash){
    dispatch(getBlock(stakeHash.blockHash,stakeHash.txHash))
  }
}
export const getBlock = (blockHash: string, txHash: string, cb?: Function): AppThunk => async (dispatch, getState) => {

  try {
    const api = await stafi.createStafiApi();
    const address = getState().FISModule.fisAccount.address;
    const validPools = getState().FISModule.validPools;
    const poolLimit = getState().FISModule.poolLimit;
    const result = await api.rpc.chain.getBlock(blockHash);

    let u = false;
    result.block.extrinsics.forEach((ex: any) => {
      if (ex.hash.toHex() == txHash) {

        const { method: { args, method, section } } = ex;
        if (section == 'balances' && (method == 'transfer' || method == 'transferKeepAlive')) {
          u = true;
          let amount = args[1].toJSON();
          let selectedPool = getPool(amount, validPools, poolLimit);

          dispatch(initProcess({
            sending: {
              packing: processStatus.success,
              brocasting: processStatus.success,
              finalizing: processStatus.success,
            }
          }))
          dispatch(setProcessSlider(true));
          dispatch(setProcessParameter({
            staking: {
              amount: amount,
              txHash,
              blockHash,
              address,
              type: rSymbol.Fis,
              poolAddress: selectedPool
            }
          }))
          bound(address, txHash, blockHash, amount, selectedPool, 0);
        }
      }
    });

    if (!u) {
      message.error("No results were found");
    }
  } catch (e: any) {
    message.error(e.message)
  }
}


export const getMinting = (type: number, txHash: string, blockHash: string, cb?: Function): AppThunk => async (dispatch, getState) => {
  dispatch(setProcessMinting({
    brocasting: processStatus.loading
  }));
  let bondSuccessParamArr = [];
  bondSuccessParamArr.push(type);
  bondSuccessParamArr.push(blockHash);
  bondSuccessParamArr.push(txHash);
  const stafiApi = await stafi.createStafiApi();
  stafiApi.query.rTokenSeries.bondSuccess(bondSuccessParamArr).then((result: any) => {
    let isSuccess = result.toJSON();
    if (isSuccess) {
      dispatch(setProcessMinting({
        brocasting: processStatus.success
      }));
      cb && cb();
    } else if (isSuccess === false) {
      dispatch(setProcessMinting({
        brocasting: processStatus.failure
      }));
    }
    // isSuccess为null，代表结果还未知；isSuccess为false代表失败；isSuccess为true则代表minting成功
  });
}

export const query_rBalances_account = (): AppThunk => async (dispatch, getState) => {
  const address = getState().FISModule.fisAccount.address; // 当前用户的FIS账号
  const stafiApi = await stafi.createStafiApi();
  const accountData = await stafiApi.query.rBalances.account(rSymbol.Fis, address);
  let data = accountData.toJSON();
  if (data == null) {
    dispatch(setTokenAmount(NumberUtil.handleFisAmountToFixed(0)))
  } else {
    dispatch(setTokenAmount(NumberUtil.fisAmountToHuman(data.free)))
  }
}

export const unbond=(amount:string,cb?:Function):AppThunk=>async (dispatch,getState)=>{
  const recipient=getState().FISModule.fisAccount.address;
  const validPools=getState().FISModule.validPools;
  const poolLimit = getState().FISModule.poolLimit;
  let selectedPool =getPool(amount,validPools,poolLimit);
  fisUnbond(amount,rSymbol.Fis,recipient,selectedPool,()=>{
    dispatch(reloadData());
  }) 
}

export const fisUnbond = (amount: string, rSymbol: number, recipient: string, selectedPool: string, cb?: Function): AppThunk => async (dispatch, getState) => {
  
  try { 
    const address = getState().FISModule.fisAccount.address; 
    const stafiApi = await stafi.createStafiApi();
    web3Enable(stafi.getWeb3EnalbeName());
    const injector = await web3FromSource(stafi.getPolkadotJsSource())

    const api = stafiApi.tx.rTokenSeries.liquidityUnbond(rSymbol, selectedPool, NumberUtil.fisAmountToChain(amount).toString(), recipient);

    api.signAndSend(address, { signer: injector.signer }, (result: any) => {

      if (result.status.isInBlock) {
        result.events
          .filter((e: any) => {
            return e.event.section == "system"
          }).forEach((data: any) => {
            if (data.event.method === 'ExtrinsicSuccess') {
              // dispatch(reloadData());
              cb && cb("Success");
              message.success("Unbond successfully, you can withdraw your unbonded DOT 29 days later.")
            } else if (data.event.method === 'ExtrinsicFailed') {
              // dispatch(reloadData());
              cb && cb("Failed");
              message.error("Unbond failure")
            }
          })
      }
    });
  } catch (e: any) {
    message.error("Unbond failure")
  }
}



export const getPools = (): AppThunk => async (dispatch, getState) => {
 
  const stafiApi = await stafi.createStafiApi();
  const poolsData = await stafiApi.query.rTokenLedger.pools(rSymbol)
  let pools = poolsData.toJSON();
  dispatch(setValidPools(null));
  if (pools && pools.length > 0) { 
    pools.forEach((poolPubkey: any) => {
      let arr = [];
      arr.push(rSymbol.Fis);
      arr.push(poolPubkey);
      stafiApi.query.rTokenLedger.poolWillBonded(arr).then((bondedData: any) => {
        // count++;
        let bonded = bondedData.toJSON();
        const keyringInstance = keyring.init('fis');
        let poolAddress = keyringInstance.encodeAddress(poolPubkey);
        dispatch(setValidPools({
          address: poolAddress,
          active: bonded || 0
        }));
      }).catch((error: any) => { });
    })
  };

  dispatch(poolBalanceLimit());
}

export const poolBalanceLimit = (): AppThunk => async (dispatch, getState) => {
 
  const stafiApi = await stafi.createStafiApi();
  stafiApi.query.rTokenSeries.poolBalanceLimit(rSymbol.Fis).then((result: any) => {
    dispatch(setPoolLimit(result.toJSON()));
  });
}
export const getPool = (tokenAmount: any, validPools: any, poolLimit: any) => {
  const amount = NumberUtil.fisAmountToChain(tokenAmount.toString());
  const data = validPools.find((item: any) => {
    if (poolLimit == 0 || Number(item.active) + amount <= poolLimit) {
      return true;
    }
  });
  if (data) {
    return data.address
  } else {
    return null;
  }
}



export const bondSwitch=():AppThunk=>async (dispatch, getState)=>{
  const stafiApi = await stafi.createStafiApi();
  const result=await stafiApi.query.rTokenSeries.bondSwitch(); 
  dispatch(setBondSwitch(result.toJSON()))
}

export default FISClice.reducer;