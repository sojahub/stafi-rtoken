import { createSlice } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../store';
import AtomServer from '@servers/atom/index';
import PolkadotServer from '@servers/polkadot';
import Stafi from '@servers/stafi/index';
import { message as M, message } from 'antd';
import keyring from '@servers/index'; 
import { setLocalStorageItem, getLocalStorageItem, removeLocalStorageItem, Keys } from '@util/common';
import CommonClice from './commonClice'

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
import { bound, fisUnbond ,rTokenSeries_bondStates} from './FISClice';
import {stafi_uuid} from '@util/common'
import {findUuid,noticesubType,noticeStatus,noticeType} from './noticeClice';
import { u8aToHex } from '@polkadot/util';
import config,{isdev} from '@config/index';
import { SigningStargateClient, coins } from '@cosmjs/stargate'; 
import {
    makeAuthInfoBytes,
    makeSignDoc,
    makeSignBytes
} from "@cosmjs/proto-signing";
const commonClice=new CommonClice();
declare const window: any;

const rATOMClice = createSlice({
  name: 'rATOMModule',
  initialState: {
    atomAccounts: [],
    atomAccount:getLocalStorageItem(Keys.AtomAccountKey) && {...getLocalStorageItem(Keys.AtomAccountKey),balance:"--"},
    validPools: [],
    poolLimit: 0,
    transferrableAmountShow: "--",
    ratio: "--",
    ratioShow: "--",
    tokenAmount: "--",
    processParameter: null,
    stakeHash: getLocalStorageItem(Keys.AtomStakeHash),
    unbondCommission:"--",
    bondFees:"--",
    unBondFees:"--",
    totalIssuance:"--",
    stakerApr:"--",

    
    ercBalance:"--",
    totalUnbonding:null,
 
  },
  reducers: {
    setAtomAccounts(state, { payload }) {
      const accounts = state.atomAccounts;
      const account = accounts.find((item: any) => {
        return item.address == payload.address; 
      })
      if (account) {
        account.balance = payload.balance;
        account.name = payload.name;
      } else {
        state.atomAccounts.push(payload)
      }
    },
    setAtomAccount(state, { payload }) { 
      if(payload){
        setLocalStorageItem(Keys.AtomAccountKey, { address: payload.address,pubkey:payload.pubkey})
      }  
      state.atomAccount = payload;
    },
    setTransferrableAmountShow(state, { payload }) {
      state.transferrableAmountShow = payload;
    },
    setRatio(state, { payload }) {
      state.ratio = payload;
    },
    setRatioShow(state,{payload}){
      state.ratioShow=payload
    },
    setTokenAmount(state, { payload }) {
      state.tokenAmount = payload
    },
    setProcessParameter(state, { payload }) {
      if (payload == null) { 
        state.processParameter = payload
      } else {
        let param = { ...state.processParameter, ...payload } 
        state.processParameter = param;
      }
    },
    setStakeHash(state, { payload }) {
      if (payload == null) {
        removeLocalStorageItem(Keys.AtomStakeHash)
        state.stakeHash = payload
      } else { 
        setLocalStorageItem(Keys.AtomStakeHash, payload),
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

    setTotalIssuance(state,{payload}){
      state.totalIssuance=payload
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
const atomServer = new AtomServer();
const polkadotServer = new PolkadotServer();
const stafiServer = new Stafi();
export const { setAtomAccounts,
  setAtomAccount,
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
  setRatioShow
} = rATOMClice.actions;




export const reloadData = (): AppThunk => async (dispatch, getState) => {
  const account = getState().rATOMModule.atomAccount;
  if(account){
    dispatch(createSubstrate(account));
  }
  // dispatch(balancesAll())
  dispatch(query_rBalances_account());
  dispatch(getTotalIssuance());
}
export const createSubstrate = (account: any): AppThunk => async (dispatch, getState) => { 
  queryBalance(account, dispatch, getState)
}

const queryBalance = async (account: any, dispatch: any, getState: any) => {  
  dispatch(setAtomAccounts(account));
  let account2: any = { ...account } 
  const client = await atomServer.createApi();
   let balances = await client.getAllBalances(account2.address);
 
  if(balances.length>0){ 
      const balanace=balances.find(item=>{
        return item.denom==config.rAtomDenom();
      });
      account2.balance=balanace? NumberUtil.tokenAmountToHuman(balanace.amount,rSymbol.Atom):0; 
  }else{
    account2.balance=0; 
  } 
  account2.balance=NumberUtil.handleFisAmountToFixed(account2.balance);
  dispatch(setTransferrableAmountShow(account2.balance));
  dispatch(setAtomAccount(account2)); 
  dispatch(setAtomAccounts(account2));  
}

export const transfer = (amountparam: string, cb?: Function): AppThunk => async (dispatch, getState) => {
  const processParameter=getState().rATOMModule.processParameter;
  const notice_uuid=(processParameter && processParameter.uuid) || stafi_uuid(); 

  dispatch(initProcess(null));
 
  const amount = NumberUtil.tokenAmountToChain(amountparam,rSymbol.Atom);
  
  const demon = config.rAtomDenom(); 
  const memo = getState().FISModule.fisAccount.address;
  const address= getState().rATOMModule.atomAccount.address;
  const validPools = getState().rATOMModule.validPools;
  const poolLimit = getState().rATOMModule.poolLimit;
  
  const client =await atomServer.createApi(); 
  const selectedPool =commonClice.getPool(amount, validPools, poolLimit);
  if (selectedPool == null) { 
    return;
  }  
  try {
    
    dispatch(setProcessSending({
      brocasting: processStatus.loading,
      packing: processStatus.default,
      finalizing: processStatus.default
    }));
    dispatch(setProcessType(rSymbol.Atom));
    dispatch(setProcessSlider(true));
    const sendTokens:any= await client.sendTokens(address, selectedPool.address, coins(amount, demon), memo);
    if(sendTokens.code==0){
   
      const block = await client.getBlock(sendTokens.height);
      const txHash=sendTokens.transactionHash;
      const blockHash=block.id
      dispatch(setProcessSending({
        brocasting: processStatus.success,
        packing: processStatus.success,
        checkTx: txHash
      }));
   
      dispatch(reloadData());
      // dispatch(add_ATOM_stake_Notice(notice_uuid,amountparam,noticeStatus.Pending));
      dispatch(setProcessParameter({
        sending: {
          amount: amountparam,
          txHash: txHash,
          blockHash: blockHash,
          address,
          uuid:notice_uuid
        },
        staking: {
          amount: amountparam,
          txHash: txHash,
          blockHash: blockHash,
          address,
          type: rSymbol.Atom,
          poolAddress: selectedPool.poolPubkey
        },
        href: cb ? "/rATOM/staker/info" : null
      }))  

      dispatch(add_ATOM_stake_Notice(notice_uuid,amountparam,noticeStatus.Pending,{
        process:getState().globalModule.process,
        processParameter:getState().rATOMModule.processParameter}))
        blockHash && dispatch(bound(address, "0x"+txHash, "0x"+blockHash, amount, selectedPool.poolPubkey, rSymbol.Atom, (r: string) => {
        if(r=="loading"){
          dispatch(add_ATOM_stake_Notice(notice_uuid,amountparam,noticeStatus.Pending))
        }else{ 
          dispatch(setStakeHash(null));
        }

        if(r == "failure"){
          dispatch(add_ATOM_stake_Notice(notice_uuid,amountparam,noticeStatus.Error)
          );
        }

        if(r=="successful"){
            dispatch(add_ATOM_stake_Notice(notice_uuid,amountparam,noticeStatus.Confirmed));
            cb && cb(); 
            dispatch(reloadData());
        } 
      }))
    }else{
      dispatch(setProcessSending({
        brocasting: processStatus.success,
        packing: processStatus.failure
      }));
      dispatch(setProcessParameter({
        sending: {
          amount: amountparam,
          address,
          uuid:notice_uuid
        }, 
        href: cb ? "/rATOM/staker/info" : null
      }))
      dispatch(reloadData());
      dispatch(add_ATOM_stake_Notice(notice_uuid,amountparam,noticeStatus.Error,{
        process:getState().globalModule.process,
        processParameter:getState().rATOMModule.processParameter}));
 
    }
    console.log(sendTokens)
    
  } catch (error) { 
    dispatch(setProcessParameter({
      sending: {
        amount: amountparam,
        address,
        uuid:notice_uuid
      }, 
      href: cb ? "/rATOM/staker/info" : null
    }))
    dispatch(setProcessSending({
      brocasting: processStatus.failure,
      packing: processStatus.default
    }));
  } 
}

 


export const query_rBalances_account = (): AppThunk => async (dispatch, getState) => { 
  commonClice.query_rBalances_account(getState().FISModule.fisAccount,rSymbol.Atom,(data:any)=>{
    if (data == null) {
      dispatch(setTokenAmount(NumberUtil.handleFisAmountToFixed(0)))
    } else {
      dispatch(setTokenAmount(NumberUtil.tokenAmountToHuman(data.free,rSymbol.Atom)))
    }
  })
}

export const reSending = (cb?: Function): AppThunk => async (dispatch, getState) => {
  const processParameter = getState().rATOMModule.processParameter;
  console.log(processParameter)
  if (processParameter) {
    const href = processParameter.href;
    dispatch(transfer(processParameter.sending.amount, () => {
      (cb && href) && cb(href)
    }));
  }
}

export const reStaking = (cb?: Function): AppThunk => async (dispatch, getState) => { 
  const processParameter = getState().rATOMModule.processParameter 
  if (processParameter) {
    const staking = processParameter.staking
    const href = processParameter.href
    processParameter && dispatch(bound(staking.address,
      "0x"+staking.txHash,
      "0x"+staking.blockHash,
      NumberUtil.tokenAmountToChain(staking.amount,rSymbol.Atom),
      staking.poolAddress,
      staking.type,
      (r: string) => { 
        // if (r != "failure") { 
        //   (href && cb) && cb(href);
        // }

        if(r=="loading"){
          dispatch(add_ATOM_stake_Notice(processParameter.sending.uuid,staking.amount,noticeStatus.Pending))
        }else{ 
          dispatch(setStakeHash(null));
        }

        if(r == "failure"){
          dispatch(add_ATOM_stake_Notice(processParameter.sending.uuid,staking.amount,noticeStatus.Error)
          );
        }

        if(r=="successful"){
            dispatch(add_ATOM_stake_Notice(processParameter.sending.uuid,staking.amount,noticeStatus.Confirmed));
            (href && cb) && cb(href); 
            dispatch(reloadData());
        } 
      }
    ));
  }
}


export const unbond = (amount: string,recipient:string,willAmount:any, cb?: Function): AppThunk => async (dispatch, getState) => {
  try{
    const validPools = getState().rATOMModule.validPools; 
    let selectedPool =commonClice.getPoolForUnbond(amount, validPools,rSymbol.Atom);
    if (selectedPool == null) { 
      cb && cb();
      return;
    } 
    const keyringInstance = keyring.init(Symbol.Atom);
    
    dispatch(fisUnbond(amount, rSymbol.Atom, u8aToHex(keyringInstance.decodeAddress(recipient)), selectedPool.poolPubkey,"Unbond succeeded, unbonding period is around "+config.unboundAroundDays(Symbol.Atom)+" days", (r?:string) => {
      dispatch(reloadData()); 
      if(r != "Failed"){  
        dispatch(add_ATOM_unbond_Notice(stafi_uuid(),willAmount,noticeStatus.Confirmed));
      }else{
        dispatch(add_ATOM_unbond_Notice(stafi_uuid(),willAmount,noticeStatus.Error));
      } 
      cb && cb(); 
    }))
  }catch(e){
    cb && cb();
  }
 
}

export const continueProcess = (): AppThunk => async (dispatch, getState) => {
  const stakeHash = getState().rATOMModule.stakeHash;
  if (stakeHash && stakeHash.blockHash && stakeHash.txHash) { 
    let bondSuccessParamArr:any[] = [];
    bondSuccessParamArr.push(stakeHash.blockHash);
    bondSuccessParamArr.push(stakeHash.txHash);
    let statusObj={
      num:0
    }
    dispatch(rTokenSeries_bondStates(rSymbol.Atom, bondSuccessParamArr,statusObj,(e:string)=>{
      if(e=="successful"){
        message.success("minting succeeded",3,()=>{ 
          dispatch(setStakeHash(null));
        }); 
      }else{
        dispatch(getBlock(stakeHash.blockHash, stakeHash.txHash,stakeHash.notice_uuid))
      } 
    }));
  }
}

export const onProceed=(blockHash: string, txHash: string,cb?:Function):AppThunk => async (dispatch,getstate)=>{
  const noticeData=findUuid(getstate().noticeModule.noticeData,txHash,blockHash)
  
  let bondSuccessParamArr:any[] = [];
  bondSuccessParamArr.push(blockHash);
  bondSuccessParamArr.push(txHash);
  let statusObj={
    num:0
  } 
  dispatch(rTokenSeries_bondStates(rSymbol.Atom, bondSuccessParamArr,statusObj,(e:string)=>{
    if(e=="successful"){ 
      dispatch(setStakeHash(null));
      message.success("Transaction has been proceeded",3,()=>{
        cb && cb("successful");
      })
      noticeData && dispatch(add_ATOM_stake_Notice(noticeData.uuid,noticeData.amount,noticeStatus.Confirmed));
    }else if(e=="failure" || e=="stakingFailure"){ 
      dispatch(getBlock(blockHash, txHash,(noticeData?noticeData.uuid:null),()=>{
        cb && cb("successful");
      }))
    }else{ 
      if(getstate().globalModule.processSlider==false){
        dispatch(initProcess({
          sending: {
            packing: processStatus.success,
            brocasting: processStatus.success,
            finalizing: processStatus.success,
            checkTx:txHash
          },
          staking: {
            packing: processStatus.success,
            brocasting: processStatus.success,
            finalizing: processStatus.success,
          },
          minting:{
            minting:processStatus.loading
          }
        }))
        dispatch(setProcessSlider(true));
      }
    }
  }));
}

export const getBlock = (blockHash: string, txHash: string, uuid?:string,cb?: Function): AppThunk => async (dispatch, getState) => {
  try {
    const api = await polkadotServer.createPolkadotApi();
    const address = getState().rATOMModule.atomAccount.address;
    const validPools = getState().rATOMModule.validPools;
    const poolLimit = getState().rATOMModule.poolLimit;
    const result = await api.rpc.chain.getBlock(blockHash);
    let u = false;
    result.block.extrinsics.forEach((ex: any) => { 
      if (ex.hash.toHex() == txHash) {
        const { method: { args, method, section } } = ex;
        if (section == 'balances' && (method == 'transfer' || method == 'transferKeepAlive')) {
          u = true;
          let amount = args[1].toJSON();


          let selectedPool =commonClice.getPool(amount, validPools, poolLimit);
          if (selectedPool == null) {
            // message.error("There is no matching pool, please try again later.");
            return;
          } 
          dispatch(initProcess({
            sending: {
              packing: processStatus.success,
              brocasting: processStatus.success,
              finalizing: processStatus.success,
              checkTx:txHash
            },
            staking: {
              packing: processStatus.default,
              brocasting: processStatus.default,
              finalizing: processStatus.default,
            },
            minting:{
              minting:processStatus.default
            }
          }))
          dispatch(setProcessSlider(true));
          dispatch(setProcessParameter({
            staking: {
              amount: NumberUtil.tokenAmountToHuman(amount,rSymbol.Atom),
              txHash,
              blockHash,
              address,
              type: rSymbol.Atom,
              poolAddress: selectedPool.address
            }
          }))
          dispatch(bound(address, txHash, blockHash, amount, selectedPool.address, rSymbol.Atom, (r:string) => {
            // dispatch(setStakeHash(null));

            if(r=="loading"){
              uuid && dispatch(add_ATOM_stake_Notice(uuid,NumberUtil.tokenAmountToHuman(amount,rSymbol.Atom).toString(),noticeStatus.Pending))
            }else{ 
              dispatch(setStakeHash(null));
            }

            if(r == "failure"){
              uuid && dispatch(add_ATOM_stake_Notice(uuid,NumberUtil.tokenAmountToHuman(amount,rSymbol.Atom).toString(),noticeStatus.Error)
              );
            }
            if(r=="successful"){
                uuid && dispatch(add_ATOM_stake_Notice(uuid,NumberUtil.tokenAmountToHuman(amount,rSymbol.Atom).toString(),noticeStatus.Confirmed));
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
  dispatch(setValidPools(null)); 
  commonClice.getPools(rSymbol.Atom,Symbol.Atom,(data:any)=>{
    dispatch(setValidPools(data));
    cb && cb()
  }) 
  const data = await commonClice.poolBalanceLimit(rSymbol.Atom);
  dispatch(setPoolLimit(data)); 
}
 
 
export const getUnbondCommission=():AppThunk=>async (dispatch, getState)=>{
  const unbondCommission =await commonClice.getUnbondCommission(); 
  dispatch(setUnbondCommission(unbondCommission)); 
}

export const bondFees=():AppThunk=>async (dispatch, getState)=>{
  const result =await commonClice.bondFees(rSymbol.Atom)
  dispatch(setBondFees(result));
}

export const unbondFees=():AppThunk=>async (dispatch, getState)=>{
  const result=await commonClice.unbondFees(rSymbol.Atom)
  dispatch(setUnBondFees(result));
}
export const getTotalIssuance=():AppThunk=>async (dispatch, getState)=>{
  const result=await commonClice.getTotalIssuance(rSymbol.Atom);
  dispatch(setTotalIssuance(result))
}

export const rTokenLedger=():AppThunk=>async (dispatch, getState)=>{
  const stafiApi = await stafiServer.createStafiApi();
  const eraResult = await stafiApi.query.rTokenLedger.chainEras(rSymbol.Atom);
  let currentEra = eraResult.toJSON();
  if (currentEra) {
    let rateResult = await stafiApi.query.rTokenRate.eraRate(rSymbol.Atom, currentEra - 1) 
    const currentRate = rateResult.toJSON(); 
    const rateResult2 = await stafiApi.query.rTokenRate.eraRate(rSymbol.Atom, currentEra - 2)
    let lastRate = rateResult2.toJSON();
    dispatch(handleStakerApr(currentRate,lastRate));
  } else {
    dispatch(handleStakerApr());
  }  
}
const handleStakerApr = (currentRate?: any, lastRate?: any): AppThunk => async (dispatch, getState) => {
    dispatch(setStakerApr('16.0%')); 
  //  if (currentRate && lastRate) {
  //     const apr = NumberUtil.handleEthRoundToFixed((currentRate - lastRate)/lastRate * 4 * 365.25 * 100) + '%';
  //     dispatch(setStakerApr(apr));
  //   } else {
  //     dispatch(setStakerApr('16.0%')); 
  //   }
  }
  export const checkAddress = (address:string)=>{
    const keyringInstance = keyring.init(Symbol.Atom);
    return keyringInstance.checkAddress(address);
  }
export const accountUnbonds=():AppThunk=>async (dispatch, getState)=>{
  // dispatch(getTotalUnbonding(rSymbol.Atom,(total:any)=>{
  //   dispatch(setTotalUnbonding(total));
  // }))

  let fisAddress = getState().FISModule.fisAccount.address;
  commonClice.getTotalUnbonding(fisAddress,rSymbol.Atom,(total:any)=>{ 
    dispatch(setTotalUnbonding(total));
  })
}
const add_ATOM_stake_Notice=(uuid:string,amount:string,status:string,subData?:any):AppThunk=>async (dispatch,getState)=>{
  setTimeout(()=>{
    dispatch(add_ATOM_Notice(uuid,noticeType.Staker,noticesubType.Stake,amount,status,{
    process:getState().globalModule.process,
    processParameter:getState().rATOMModule.processParameter}))
  },20);
}


 
export const rTokenRate = (): AppThunk => async (dispatch, getState) => {
  const ratio=await commonClice.rTokenRate(rSymbol.Atom);
  dispatch(setRatio(ratio))
}
const add_ATOM_unbond_Notice=(uuid:string,amount:string,status:string,subData?:any):AppThunk=>async (dispatch,getState)=>{
  
  dispatch(add_ATOM_Notice(uuid,noticeType.Staker,noticesubType.Unbond,amount,status,subData))
}
const add_DOT_Withdraw_Notice=(uuid:string,amount:string,status:string,subData?:any):AppThunk=>async (dispatch,getState)=>{
  dispatch(add_ATOM_Notice(uuid,noticeType.Staker,noticesubType.Withdraw,amount,status,subData))
}
const add_DOT_Swap_Notice=(uuid:string,amount:string,status:string,subData?:any):AppThunk=>async (dispatch,getState)=>{
  dispatch(add_ATOM_Notice(uuid,noticeType.Staker,noticesubType.Swap,amount,status,subData))
}
const add_ATOM_Notice=(uuid:string,type:string,subType:string,content:string,status:string,subData?:any):AppThunk=>async (dispatch,getState)=>{
 
    dispatch(add_Notice(uuid,Symbol.Atom,type,subType,content,status,subData))
} 
export default rATOMClice.reducer;