import { createSlice } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../store';
import PolkadotServer from '@servers/ksm/index';
import Stafi from '@servers/stafi/index';
import { message as M, message } from 'antd';
import keyring from '@servers/index';
import { setLocalStorageItem, getLocalStorageItem, removeLocalStorageItem, Keys } from '@util/common'

import {rSymbol,Symbol} from '@keyring/defaults'
import {
  processStatus, setProcessSlider, setProcessSending,initProcess,setLoading,setProcessType
} from './globalClice';
import {add_Notice} from './noticeClice'
import {
  web3Enable,
  web3FromSource,
} from '@polkadot/extension-dapp';
import NumberUtil from '@util/numberUtil';
import { bound, fisUnbond ,getTotalUnbonding,rTokenSeries_bondStates} from './FISClice';
import {stafi_uuid} from '@util/common'
import {addNoticeModal,noticesubType,noticeStatus,noticeType} from './noticeClice';
import { u8aToHex } from '@polkadot/util'



const rKSMClice = createSlice({
  name: 'rKSMModule',
  initialState: {
    ksmAccounts: [],
    ksmAccount:getLocalStorageItem(Keys.KsmAccountKey) && {...getLocalStorageItem(Keys.KsmAccountKey),balance:"--"},
    validPools: [],
    poolLimit: 0,
    transferrableAmountShow: "--",
    ratio: "--",
    tokenAmount: "--",
    processParameter: null,
    stakeHash: getLocalStorageItem(Keys.KsmStakeHash),
    unbondCommission:"--",

    bondFees:"--",
    unBondFees:"--",
    estimateTxFees : 30000000000, 

    totalRDot:"--",
    stakerApr:"--",


    totalUnbonding:null
  },
  reducers: {
    setKsmAccounts(state, { payload }) {
      const accounts = state.ksmAccounts;
      const account = accounts.find((item: any) => {
        return item.address == payload.address; 
      })
      if (account) {
        account.balance = payload.balance;
        account.name = payload.name;
      } else {
        state.ksmAccounts.push(payload)
      }
    },
    setKsmAccount(state, { payload }) { 
      if(payload){
        setLocalStorageItem(Keys.KsmAccountKey, { address: payload.address})
      } 
      state.ksmAccount = payload;
    },
    setTransferrableAmountShow(state, { payload }) {
      state.transferrableAmountShow = payload;
    },
    setRatio(state, { payload }) {
      state.ratio = payload;
    },
    setTokenAmount(state, { payload }) {
      state.tokenAmount = payload
    },
    setProcessParameter(state, { payload }) {
      if (payload == null) {
        // removeLocalStorageItem(Keys.KsmProcessParameter)
        state.processParameter = payload
      } else {
        let param = { ...state.processParameter, ...payload }
        // setLocalStorageItem(Keys.KsmProcessParameter,param),
        state.processParameter = param;
      }
    },
    setStakeHash(state, { payload }) {
      if (payload == null) {
        removeLocalStorageItem(Keys.KsmStakeHash)
        state.stakeHash = payload
      } else { 
        setLocalStorageItem(Keys.KsmStakeHash, payload),
        state.stakeHash = payload;
      }
    },
    setValidPools(state, { payload }) {
      if (payload == null) {
        state.validPools = []
      } else {
        state.validPools.push(payload)
      }
    },
    setPoolLimit(state, { payload }) {
      state.poolLimit = payload
    },
    setUnbondCommission(state,{payload}){
      state.unbondCommission=payload;
    },
    setBondFees(state,{payload}){
      state.bondFees=payload
    },

    setTotalRDot(state,{payload}){
      state.totalRDot=payload
    },
    setStakerApr(state,{payload}){
      state.stakerApr=payload;
    },
    setTotalUnbonding(state,{payload}){
      state.totalUnbonding=payload;
    },
    setUnBondFees(state,{payload}){
      state.unBondFees=payload
    }
  },
});
const polkadotServer = new PolkadotServer();
const stafiServer = new Stafi();
export const { setKsmAccounts,
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
  setTotalRDot,
  setStakerApr,
  setTotalUnbonding,
  setUnBondFees
} = rKSMClice.actions;




export const reloadData = (): AppThunk => async (dispatch, getState) => {
  const account = getState().rKSMModule.ksmAccount;
  if(account){
    dispatch(createSubstrate(account));
  }
  dispatch(balancesAll())
  dispatch(query_rBalances_account());
  dispatch(totalIssuance());
}
export const createSubstrate = (account: any): AppThunk => async (dispatch, getState) => { 
  queryBalance(account, dispatch, getState)
}

const queryBalance = async (account: any, dispatch: any, getState: any) => { 
  dispatch(setKsmAccounts(account));
  let account2: any = { ...account }

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
}

export const transfer = (amountparam: string, cb?: Function): AppThunk => async (dispatch, getState) => {
  const processParameter=getState().rKSMModule.processParameter;
  const notice_uuid=(processParameter && processParameter.uuid) || stafi_uuid(); 

  dispatch(initProcess(null));
  const amount = NumberUtil.fisAmountToChain(amountparam)
  const validPools = getState().rKSMModule.validPools;
  const poolLimit = getState().rKSMModule.poolLimit;
  const address = getState().rKSMModule.ksmAccount.address;
  web3Enable(stafiServer.getWeb3EnalbeName());
  const injector = await web3FromSource(stafiServer.getPolkadotJsSource())

  const dotApi = await polkadotServer.createPolkadotApi();

  const selectedPool = getPool(amount, validPools, poolLimit);
  if (selectedPool == null) {
    message.error("There is no matching pool, please try again later.");
    return;
  } 
 
  const ex =await dotApi.tx.balances.transferKeepAlive(selectedPool, amount.toString()); 
  let index=0;
  ex.signAndSend(address, { signer: injector.signer }, (result: any) => {
   
    if(index==0){
      dispatch(setProcessSending({
        brocasting: processStatus.loading,
        packing: processStatus.default,
        finalizing: processStatus.default
      }));
      dispatch(setProcessType(rSymbol.Ksm));
      dispatch(setProcessSlider(true));
      index=index+1;
    }
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
            amount: amountparam,
            txHash: tx,
            blockHash: asInBlock,
            address,
            uuid:notice_uuid
          },
          href: cb ? "/rKSM/staker/info" : null
        }))
        dispatch(setStakeHash({
          txHash: tx,
          blockHash: asInBlock,
          notice_uuid:notice_uuid
        }))
      }


      if (result.status.isInBlock) {
        dispatch(setProcessSending({
          brocasting: processStatus.success,
          packing: processStatus.loading,
          checkTx: tx
        })); 
        dispatch(add_KSM_stake_Notice(notice_uuid,amountparam,noticeStatus.Pending));

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
              dispatch(reloadData());
              dispatch(setProcessSending({
                packing: processStatus.failure,
                checkTx: tx
              })); 
              dispatch(setStakeHash(null));
              dispatch(add_KSM_stake_Notice(notice_uuid,amountparam,noticeStatus.Error));
            } else if (data.event.method === 'ExtrinsicSuccess') {
              dispatch(setProcessSending({
                packing: processStatus.success,
                finalizing: processStatus.loading,
              })); 
              // dispatch(gSetTimeOut(() => {
              //   dispatch(setProcessSending({
              //     finalizing: processStatus.failure,
              //   }));
              // }, 10 * 60 * 1000));
              dispatch(reloadData());
              dispatch(setProcessParameter({
                staking: {
                  amount: amountparam,
                  txHash: tx,
                  blockHash: asInBlock,
                  address,
                  type: rSymbol.Ksm,
                  poolAddress: selectedPool
                }
              }))  

              dispatch(add_KSM_stake_Notice(notice_uuid,amountparam,noticeStatus.Pending,{
                process:getState().globalModule.process,
                processParameter:getState().rKSMModule.processParameter}))
              asInBlock && dispatch(bound(address, tx, asInBlock, amount, selectedPool, rSymbol.Ksm, (r: string) => {
                if(r=="loading"){
                  dispatch(add_KSM_stake_Notice(notice_uuid,amountparam,noticeStatus.Pending))
                }else{ 
                  dispatch(setStakeHash(null));
                }

                if(r == "failure"){
                  dispatch(add_KSM_stake_Notice(notice_uuid,amountparam,noticeStatus.Error)
                  );
                }

                if(r=="successful"){
                    dispatch(add_KSM_stake_Notice(notice_uuid,amountparam,noticeStatus.Confirmed));
                    cb && cb(); 
                    dispatch(reloadData());
                } 
              }))

            }
          })
        
      } else if (result.status.isFinalized) {
        dispatch(setProcessSending({
          finalizing: processStatus.success,
        }));
      } else if (result.isError) {
        M.error(result.toHuman());
      }
    } catch (e) {
      M.error(e.message)
    }
  }).catch ((e:any)=>{ 
    dispatch(setLoading(false));
    if(e=="Error: Cancelled"){
      message.error("Cancelled");  
    }else{
      console.error(e)
    } 
  });
}

export const balancesAll = (): AppThunk => async (dispatch, getState) => {
  const api = await polkadotServer.createPolkadotApi();
  const address = getState().rKSMModule.ksmAccount.address;
  const result = await api.derive.balances.all(address);
  if (result) {
    const transferrableAmount = NumberUtil.fisAmountToHuman(result.availableBalance);
    const transferrableAmountShow = NumberUtil.handleFisAmountToFixed(transferrableAmount);
    dispatch(setTransferrableAmountShow(transferrableAmountShow));
  }
}


export const query_rBalances_account = (): AppThunk => async (dispatch, getState) => {
  const address = getState().FISModule.fisAccount.address;
  const stafiApi = await stafiServer.createStafiApi();
  const accountData = await stafiApi.query.rBalances.account(rSymbol.Ksm, address);
  let data = accountData.toJSON();
  if (data == null) {
    dispatch(setTokenAmount(NumberUtil.handleFisAmountToFixed(0)))
  } else {
    dispatch(setTokenAmount(NumberUtil.fisAmountToHuman(data.free)))
  }
}

export const reSending = (cb?: Function): AppThunk => async (dispatch, getState) => {
  const processParameter = getState().rKSMModule.processParameter
  if (processParameter) {
    const href = processParameter.href;
    dispatch(transfer(processParameter.sending.amount, () => {
      (cb && href) && cb(href)
    }));
  }
}

export const reStaking = (cb?: Function): AppThunk => async (dispatch, getState) => { 
  const processParameter = getState().rKSMModule.processParameter
  console.log(processParameter,"====processParameter")
  if (processParameter) {
    const staking = processParameter.staking
    const href = processParameter.href
    processParameter && dispatch(bound(staking.address,
      staking.txHash,
      staking.blockHash,
      NumberUtil.fisAmountToChain(staking.amount),
      staking.poolAddress,
      staking.type,
      (r: string) => { 
        // if (r != "failure") { 
        //   (href && cb) && cb(href);
        // }

        if(r=="loading"){
          dispatch(add_KSM_stake_Notice(processParameter.sending.uuid,staking.amount,noticeStatus.Pending))
        }else{ 
          dispatch(setStakeHash(null));
        }

        if(r == "failure"){
          dispatch(add_KSM_stake_Notice(processParameter.sending.uuid,staking.amount,noticeStatus.Error)
          );
        }

        if(r=="successful"){
            dispatch(add_KSM_stake_Notice(processParameter.sending.uuid,staking.amount,noticeStatus.Confirmed));
            (href && cb) && cb(href); 
            dispatch(reloadData());
        } 
      }
    ));
  }
}


export const unbond = (amount: string,recipient:string,willAmount:any, cb?: Function): AppThunk => async (dispatch, getState) => {
  try{
    const validPools = getState().rKSMModule.validPools; 
    let selectedPool = getPoolForUnbond(amount, validPools);
    if (selectedPool == null) {
      message.error("There is no matching pool, please try again later.");
      cb && cb();
      return;
    } 
    const keyringInstance = keyring.init(Symbol.Ksm);
    
    dispatch(fisUnbond(amount, rSymbol.Ksm, u8aToHex(keyringInstance.decodeAddress(recipient)), u8aToHex(keyringInstance.decodeAddress(selectedPool)),"Unbond succeeded, unbonding period is around 8 days", (r?:string) => {
      dispatch(reloadData()); 
      if(r != "Failed"){  
        dispatch(add_KSM_unbond_Notice(stafi_uuid(),willAmount,noticeStatus.Confirmed));
      }else{
        dispatch(add_KSM_unbond_Notice(stafi_uuid(),willAmount,noticeStatus.Error));
      } 
      cb && cb(); 
    }))
  }catch(e){
    cb && cb();
  }
 
}

export const continueProcess = (): AppThunk => async (dispatch, getState) => {
  const stakeHash = getState().rKSMModule.stakeHash;
  if (stakeHash && stakeHash.blockHash && stakeHash.txHash) { 
    let bondSuccessParamArr:any[] = [];
    bondSuccessParamArr.push(stakeHash.blockHash);
    bondSuccessParamArr.push(stakeHash.txHash);
    let statusObj={
      num:0
    }
    dispatch(rTokenSeries_bondStates(rSymbol.Ksm, bondSuccessParamArr,statusObj,(e:string)=>{
      if(e=="successful"){
        dispatch(setStakeHash(null));
      }else{
        dispatch(getBlock(stakeHash.blockHash, stakeHash.txHash,stakeHash.notice_uuid))
      }
    }));
  }
}



export const getBlock = (blockHash: string, txHash: string, uuid?:string,cb?: Function): AppThunk => async (dispatch, getState) => {
  try {
    const api = await polkadotServer.createPolkadotApi();
    const address = getState().rKSMModule.ksmAccount.address;
    const validPools = getState().rKSMModule.validPools;
    const poolLimit = getState().rKSMModule.poolLimit;
    const result = await api.rpc.chain.getBlock(blockHash);
    let u = false;
    result.block.extrinsics.forEach((ex: any) => { 
      if (ex.hash.toHex() == txHash) {
        const { method: { args, method, section } } = ex;
        if (section == 'balances' && (method == 'transfer' || method == 'transferKeepAlive')) {
          u = true;
          let amount = args[1].toJSON();


          let selectedPool = getPool(amount, validPools, poolLimit);
          if (selectedPool == null) {
            // message.error("There is no matching pool, please try again later.");
            return;
          } 
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
              amount: NumberUtil.fisAmountToHuman(amount),
              txHash,
              blockHash,
              address,
              type: rSymbol.Ksm,
              poolAddress: selectedPool
            }
          }))
          dispatch(bound(address, txHash, blockHash, amount, selectedPool, rSymbol.Ksm, (r:string) => {
            // dispatch(setStakeHash(null));

            if(r=="loading"){
              uuid && dispatch(add_KSM_stake_Notice(uuid,NumberUtil.fisAmountToHuman(amount).toString(),noticeStatus.Pending))
            }else{ 
              dispatch(setStakeHash(null));
            }

            if(r == "failure"){
              uuid && dispatch(add_KSM_stake_Notice(uuid,NumberUtil.fisAmountToHuman(amount).toString(),noticeStatus.Error)
              );
            }
            if(r=="successful"){
                uuid && dispatch(add_KSM_stake_Notice(uuid,NumberUtil.fisAmountToHuman(amount).toString(),noticeStatus.Confirmed));
                cb && cb(); 
            } 
          }));
        }
      }
    });

    if (!u) {
      message.error("No results were found");
    }
  } catch (e) {
    message.error(e.message)
  }
}



export const getPools = (cb?:Function): AppThunk => async (dispatch, getState) => {

 
  const stafiApi = await stafiServer.createStafiApi();
  const poolsData = await stafiApi.query.rTokenLedger.bondedPools(rSymbol.Ksm)
  let pools = poolsData.toJSON();
  dispatch(setValidPools(null));
  if (pools && pools.length > 0) {
    pools.forEach((poolPubkey: any) => {
      stafiApi.query.rTokenLedger.bondPipelines(rSymbol.Ksm, poolPubkey).then((bondedData: any) => {
        let active = 0;
        let bonded = bondedData.toJSON();
        if (bonded) {
          active = bonded.active;
        }
        const keyringInstance = keyring.init('ksm');
        let poolAddress = keyringInstance.encodeAddress(poolPubkey);
        dispatch(setValidPools({
          address: poolAddress,
          active: active
        }));
        cb && cb()
      }).catch((error: any) => { });
    })
  };
 
  dispatch(poolBalanceLimit());
}

export const poolBalanceLimit = (): AppThunk => async (dispatch, getState) => {
  const stafiApi = await stafiServer.createStafiApi();
  stafiApi.query.rTokenSeries.poolBalanceLimit(rSymbol.Ksm).then((result: any) => {
    dispatch(setPoolLimit(result.toJSON()));
  });
}
export const getPool = (tokenAmount: any, validPools: any, poolLimit: any) => {
  const data = validPools.find((item: any) => {
    if (poolLimit == 0 || Number(item.active) + tokenAmount <= poolLimit) {
      return true;
    }
  });
  if (data) {
    return data.address
  } else {
    return null;
  }
}
export const getPoolForUnbond = (tokenAmount: any, validPools: any) => {
  const amount = NumberUtil.fisAmountToChain(tokenAmount.toString());
  const data = validPools.find((item: any) => {
    if (Number(item.active) >= amount) {
      return true;
    }
  });
  if (data) {
    return data.address
  } else {
    return null;
  }
}

export const getUnbondCommission=():AppThunk=>async (dispatch, getState)=>{
  const stafiApi = await stafiServer.createStafiApi();
  const result=await stafiApi.query.rTokenSeries.unbondCommission();
  const unbondCommission = NumberUtil.fisFeeToHuman(result.toJSON());
 
  dispatch(setUnbondCommission(unbondCommission));
  //const unbondCommissionShow = NumberUtil.fisFeeToFixed(this.unbondCommission) + '%';
}

export const bondFees=():AppThunk=>async (dispatch, getState)=>{
  const stafiApi = await stafiServer.createStafiApi();
  const result = await stafiApi.query.rTokenSeries.bondFees(rSymbol.Ksm)
  // this.bondFees = result.toJSON(); 
  dispatch(setBondFees(result.toJSON()));
}

export const unbondFees=():AppThunk=>async (dispatch, getState)=>{
  const stafiApi = await stafiServer.createStafiApi();
  const result = await stafiApi.query.rTokenSeries.unbondFees(rSymbol.Dot) 
  dispatch(setUnBondFees(result.toJSON()));
}
export const totalIssuance=():AppThunk=>async (dispatch, getState)=>{
  const stafiApi = await stafiServer.createStafiApi(); 
  const  result =await stafiApi.query.rBalances.totalIssuance(rSymbol.Ksm) 
  let totalRDot:any = NumberUtil.fisAmountToHuman(result.toJSON());
  totalRDot = NumberUtil.handleFisAmountToFixed(totalRDot); 
  dispatch(setTotalRDot(totalRDot))
}

export const rTokenLedger=():AppThunk=>async (dispatch, getState)=>{
  const stafiApi = await stafiServer.createStafiApi();
  const eraResult = await stafiApi.query.rTokenLedger.chainEras(rSymbol.Ksm);
  let currentEra = eraResult.toJSON();
  if (currentEra) {
    let rateResult = await stafiApi.query.rTokenRate.eraRate(rSymbol.Ksm, currentEra - 1) 
    const currentRate = rateResult.toJSON(); 
    const rateResult2 = await stafiApi.query.rTokenRate.eraRate(rSymbol.Ksm, currentEra - 2)
    let lastRate = rateResult2.toJSON();
    dispatch(handleStakerApr(currentRate,lastRate));
  } else {
    dispatch(handleStakerApr());
  }  
}
 const handleStakerApr=(currentRate?:any,lastRate?:any):AppThunk=>async (dispatch, getState)=>{
   if (currentRate && lastRate) {
      const apr = NumberUtil.handleEthRoundToFixed((currentRate - lastRate)/lastRate * 4 * 365.25 * 100) + '%';
      dispatch(setStakerApr(apr));
    } else {
      dispatch(setStakerApr('16.0%')); 
    }
  }
  export const checkAddress = (address:string)=>{
    const keyringInstance = keyring.init(Symbol.Ksm);
    return keyringInstance.checkAddress(address);
  }
export const accountUnbonds=():AppThunk=>async (dispatch, getState)=>{
  dispatch(getTotalUnbonding(rSymbol.Ksm,(total:any)=>{
    dispatch(setTotalUnbonding(total));
  }))
}
const add_KSM_stake_Notice=(uuid:string,amount:string,status:string,subData?:any):AppThunk=>async (dispatch,getState)=>{
  setTimeout(()=>{
    dispatch(add_KSM_Notice(uuid,noticeType.Staker,noticesubType.Stake,`Staked ${amount} KSM from your Wallet to StaFi Validator Pool Contract`,status,{
    process:getState().globalModule.process,
    processParameter:getState().rKSMModule.processParameter}))
  },20);
}
const add_KSM_unbond_Notice=(uuid:string,amount:string,status:string,subData?:any):AppThunk=>async (dispatch,getState)=>{
  dispatch(add_KSM_Notice(uuid,noticeType.Staker,noticesubType.Unbond,`Unbond ${amount} KSM from Pool Contract`,status,subData))
}
const add_DOT_Withdraw_Notice=(uuid:string,amount:string,status:string,subData?:any):AppThunk=>async (dispatch,getState)=>{
  dispatch(add_KSM_Notice(uuid,noticeType.Staker,noticesubType.Withdraw,`Withdraw ${amount} FIS from contracts to wallet`,status,subData))
}
const add_DOT_Swap_Notice=(uuid:string,amount:string,status:string,subData?:any):AppThunk=>async (dispatch,getState)=>{
  dispatch(add_KSM_Notice(uuid,noticeType.Staker,noticesubType.Swap,`Swap ${amount} Native FIS to ERC20`,status,subData))
}
const add_KSM_Notice=(uuid:string,type:string,subType:string,content:string,status:string,subData?:any):AppThunk=>async (dispatch,getState)=>{
 
    dispatch(add_Notice(uuid,Symbol.Ksm,type,subType,content,status,subData))
  
}

export default rKSMClice.reducer;