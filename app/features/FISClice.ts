import { createSlice } from '@reduxjs/toolkit';
import { Button, message as M, message } from 'antd';
import { AppThunk, RootState } from '../store';
import Stafi from '@servers/stafi/index';
import {
  processStatus, setProcessSlider, setProcessSending, setProcessStaking,
  setProcessMinting, gSetTimeOut, gClearTimeOut,
  initProcess, process,setLoading
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
    fisAccount: getLocalStorageItem(Keys.FisAccountKey)&&{...getLocalStorageItem(Keys.FisAccountKey),balance:"--"},
    validPools: [],
    poolLimit: 0,
    transferrableAmountShow: "--",
    processParameter: null,
    stakeHash: getLocalStorageItem(Keys.FisStakeHash),
    ratio: "--",
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
        account.name = payload.name;
      } else {
        state.fisAccounts.push(payload)
      }
    },
    setFisAccount(state, { payload }) { 
      if(payload){
        setLocalStorageItem(Keys.FisAccountKey, { address: payload.address})
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

const stafiServer = new Stafi();

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
  if(account){
    dispatch(createSubstrate(account));
  }
  // Update Transferable DOT/FIS
  dispatch(balancesAll())
}
export const createSubstrate = (account: any): AppThunk => async (dispatch, getState) => { 
  queryBalance(account, dispatch, getState)
}

const queryBalance = async (account: any, dispatch: any, getState: any) => {
  dispatch(setFisAccounts(account));
  let account2: any = { ...account }
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
  const amount = NumberUtil.fisAmountToChain(amountparam);
  web3Enable(stafiServer.getWeb3EnalbeName());
  const injector = await web3FromSource(stafiServer.getPolkadotJsSource())
  
  
  const stafiApi = await stafiServer.createStafiApi();

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
        // do nothing
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
              // Wait ten minutes 
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
        // clear
        gClearTimeOut();

      }


    } catch (e: any) {
      M.error(e.message)
    }
  }) 
}


export const stakingSignature = async (address: any, txHash: string) => {
  web3Enable(stafiServer.getWeb3EnalbeName());
  const injector = await web3FromSource(stafiServer.getPolkadotJsSource());
  const signRaw = injector?.signer?.signRaw;
  const { signature } = await signRaw({
    address: address,
    data: txHash,
    type: 'bytes'
  });
  return signature
}

export const bound = (address: string, txhash: string, blockhash: string, amount: number, pooladdress: string, type: number, cb?: Function): AppThunk => async (dispatch, getState) => {
  try{
    dispatch(setProcessStaking({
      brocasting: processStatus.loading,
      packing: processStatus.default,
      finalizing: processStatus.default
    }));

    let fisAddress = getState().FISModule.fisAccount.address;
    const keyringInstance = keyring.init(Symbol.Fis);
    const signature = await stakingSignature(address, u8aToHex(keyringInstance.decodeAddress(fisAddress)));
    const stafiApi = await stafiServer.createStafiApi();
    let pubkey = u8aToHex(keyringInstance.decodeAddress(address));
    let poolPubkey = u8aToHex(keyringInstance.decodeAddress(pooladdress));
      
    
    web3Enable(stafiServer.getWeb3EnalbeName());
    const injector = await web3FromSource(stafiServer.getPolkadotJsSource());
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
   
    try{ 
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
                  cb && cb("loading");
                  dispatch(getMinting(type, txhash, blockhash, cb));
                  // dispatch(gSetTimeOut(() => {
                  //   dispatch(setProcessStaking({
                  //     finalizing: processStatus.failure,
                  //   }));
                  // }, 10 * 60 * 1000));
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
            // cb && cb("loading");
            // gClearTimeOut();

          }
        } catch (e: any) {
          M.error(e.message)
        }
      }).catch ((e:any)=>{ 
        dispatch(setLoading(false));
        if(e=="Error: Cancelled"){
          message.error("Cancelled");
          dispatch(setProcessStaking({
            brocasting: processStatus.failure
          }));
          cb && cb("failure");
        }else{
          console.error(e)
        } 
      })
      
    }catch(e){
      console.error("signAndSend error:",e)
    }
  }catch(e){ 
    dispatch(setLoading(false));
    if(e=="Error: Cancelled"){
      message.error("Cancelled");
      dispatch(setProcessStaking({
        brocasting: processStatus.failure
      }));
      cb && cb("failure");
    }else{
      console.error(e)
    } 
  }
}

export const balancesAll = (): AppThunk => async (dispatch, getState) => {
  const api = await stafiServer.createStafiApi();
  const address = getState().FISModule.fisAccount.address;
  const result = await api.derive.balances.all(address);
  if (result) {
    const transferrableAmount = NumberUtil.fisAmountToHuman(result.availableBalance);
    const transferrableAmountShow = NumberUtil.handleFisAmountToFixed(transferrableAmount);
    dispatch(setTransferrableAmountShow(transferrableAmountShow));
  }
}


export const rTokenRate = (type: number): AppThunk => async (dispatch, getState) => {
  const api = await stafiServer.createStafiApi();
  const result = await api.query.rTokenRate.rate(type);
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
    const api = await stafiServer.createStafiApi();
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
  let bondSuccessParamArr:any[] = [];
  bondSuccessParamArr.push(type);
  bondSuccessParamArr.push(blockHash);
  bondSuccessParamArr.push(txHash);
  let statusObj={
    num:0
  }
  dispatch(rTokenSeries_bondStates(bondSuccessParamArr,statusObj,cb));
} 

const rTokenSeries_bondStates=(bondSuccessParamArr:any,statusObj:any,cb?:Function): AppThunk => async (dispatch, getState)=>{
  statusObj.num=statusObj.num+1; 
  const stafiApi = await stafiServer.createStafiApi();
  const result= await stafiApi.query.rTokenSeries.bondStates(bondSuccessParamArr) 
  let bondState = result.toJSON();  
  if (bondState=="Success") {
    dispatch(setProcessMinting({
      brocasting: processStatus.success
    }));
    cb && cb("successful");
  } else if (bondState == "Fail") { 
    dispatch(setProcessMinting({
      brocasting: processStatus.failure
    }));
    cb && cb("failure");
  } else if(statusObj.num<=40){ 
    setTimeout(()=>{ 
      dispatch(rTokenSeries_bondStates(bondSuccessParamArr,statusObj,cb))
    }, 15000); 
  }else{
    dispatch(setProcessMinting({
      brocasting: processStatus.failure
    }));
  } 
}

 
export const query_rBalances_account = (): AppThunk => async (dispatch, getState) => {
  const address = getState().FISModule.fisAccount.address;
  const stafiApi = await stafiServer.createStafiApi();
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
  fisUnbond(amount,rSymbol.Fis,recipient,selectedPool,"Unbond successfully, you can withdraw your unbonded FIS 29 days later.",()=>{
    dispatch(reloadData());
  }) 
}

export const fisUnbond = (amount: string, rSymbol: number, recipient: string, selectedPool: string,topstr:string, cb?: Function): AppThunk => async (dispatch, getState) => {
  
  try { 
    const address = getState().FISModule.fisAccount.address; 
    const stafiApi = await stafiServer.createStafiApi();
    web3Enable(stafiServer.getWeb3EnalbeName());
    
    const injector = await web3FromSource(stafiServer.getPolkadotJsSource())
  
  
    const api =await stafiApi.tx.rTokenSeries.liquidityUnbond(rSymbol, selectedPool, NumberUtil.fisAmountToChain(amount).toString(), recipient);

      api.signAndSend(address, { signer: injector.signer }, (result: any) => {
        try{ 
          if (result.status.isInBlock) {
            result.events
              .filter((e: any) => {
                return e.event.section == "system"
              }).forEach((data: any) => {
                if (data.event.method === 'ExtrinsicSuccess') {
                  dispatch(reloadData());
                  cb && cb("Success");
                  message.success(topstr)
                } else if (data.event.method === 'ExtrinsicFailed') {
                  dispatch(reloadData());
                  cb && cb("Failed");
                  message.error("Unbond failure")
                }
              })
          }
        }catch(e){ 
          cb && cb("Failed");
        }
      }).catch ((e:any)=>{ 
        dispatch(setLoading(false));
        if(e=="Error: Cancelled"){
          message.error("Cancelled"); 
          cb && cb("Failed");
        }else{
          console.error(e);
        }
      })
  
  } catch (e: any) {
    message.error("Unbond failure"); 
    cb && cb("Failed");
  }
}



export const getPools = (): AppThunk => async (dispatch, getState) => {
 
  const stafiApi = await stafiServer.createStafiApi();
  const poolsData = await stafiApi.query.rTokenLedger.pools(rSymbol.Fis)
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
 
  const stafiApi = await stafiServer.createStafiApi();
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
  const stafiApi = await stafiServer.createStafiApi();
  const result=await stafiApi.query.rTokenSeries.bondSwitch(); 
  dispatch(setBondSwitch(result.toJSON()))
}


export const getTotalUnbonding=(rSymbol:any,cb?:Function):AppThunk=>async (dispatch, getState)=>{
  let fisAddress = getState().FISModule.fisAccount.address;
  let totalUnbonding:any = 0;
  const stafiApi = await stafiServer.createStafiApi();
  const  eraResult = await stafiApi.query.rTokenLedger.chainEras(rSymbol);
  let currentEra = eraResult.toJSON(); 
  if (currentEra) {
    const result = await stafiApi.query.rTokenSeries.accountUnbonds(fisAddress, rSymbol) 
    let accountUnbonds = result.toJSON(); 
    if (accountUnbonds && accountUnbonds.length > 0) {
      accountUnbonds.forEach((accountUnbond:any) => {
        if (accountUnbond.unlock_era > currentEra) {
            totalUnbonding = totalUnbonding + accountUnbond.value;
        }
      });

      totalUnbonding = NumberUtil.handleFisAmountToFixed(NumberUtil.fisAmountToHuman(totalUnbonding));
      cb && cb(totalUnbonding)
    } 
  }else{
    cb && cb(0)
  }
}
export default FISClice.reducer;