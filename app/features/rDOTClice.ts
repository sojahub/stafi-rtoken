import { createSlice } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../store';
import PolkadotServer from '@servers/polkadot/index';
import Stafi from '@servers/stafi/index';
import { message as M, message } from 'antd';
import keyring from '@servers/index';
import { setLocalStorageItem, getLocalStorageItem, removeLocalStorageItem, Keys } from '@util/common';
import {rSymbol,Symbol} from '@keyring/defaults'
import {
  processStatus, setProcessSlider, setProcessSending,
   initProcess,setLoading,setProcessType
} from './globalClice';
import {add_Notice,findUuid} from './noticeClice';
import {
  web3Enable,
  web3FromSource,
} from '@polkadot/extension-dapp';
import NumberUtil from '@util/numberUtil';
import { bound, fisUnbond,rTokenSeries_bondStates } from './FISClice';
import {stafi_uuid} from '@util/common'
import {addNoticeModal,noticesubType,noticeStatus,noticeType} from './noticeClice';
import { u8aToHex } from '@polkadot/util' 
import CommonClice from './commonClice'
 



const rDOTClice = createSlice({
  name: 'rDOTModule',
  initialState: {
    dotAccounts: [],
    dotAccount: getLocalStorageItem(Keys.DotAccountKey) && {...getLocalStorageItem(Keys.DotAccountKey),balance:"--"}, 
    validPools: [],
    poolLimit: 0,
    transferrableAmountShow: "--",
    ratio: "--",
    ratioShow:"--",
    tokenAmount: "--",
    processParameter: null,
    stakeHash: getLocalStorageItem(Keys.DotStakeHash),
    unbondCommission:"--",
    bondFees:"--",
    unBondFees:"--",
    totalIssuance:"--",
    stakerApr:"--",
    totalUnbonding:null,
  },
  reducers: {
    setDotAccounts(state, { payload }) {
      const accounts = state.dotAccounts;
      const account = accounts.find((item: any) => {
        return item.address == payload.address;
      })
      if (account) {
        account.balance = payload.balance;
        account.name = payload.name;
      } else {
        state.dotAccounts.push(payload)
      }
    },
    setDotAccount(state, { payload }) {
      if(payload){
        setLocalStorageItem(Keys.DotAccountKey, { address: payload.address})
      }
      state.dotAccount = payload;
    },
    setTransferrableAmountShow(state, { payload }) {
      state.transferrableAmountShow = payload;
    },
    setRatio(state, { payload }) {
      state.ratio = payload;
    },
    setRatioShow(state,{payload}){
      state.ratioShow = payload;
    },
    setTokenAmount(state, { payload }) {
      state.tokenAmount = payload
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
    setStakeHash(state, { payload }) {
      if (payload == null) {
        removeLocalStorageItem(Keys.DotStakeHash)
        state.stakeHash = payload
      } else { 
        setLocalStorageItem(Keys.DotStakeHash, payload),
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
const polkadotServer = new PolkadotServer();
const commonClice=new CommonClice();
const stafiServer = new Stafi();
export const { setDotAccounts,
  setDotAccount,
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
} = rDOTClice.actions;




export const reloadData = (): AppThunk => async (dispatch, getState) => {
  const account = getState().rDOTModule.dotAccount;
  if(account){
    dispatch(createSubstrate(account));
  }
  dispatch(balancesAll())
  dispatch(query_rBalances_account());
  dispatch(getTotalIssuance());

}
export const createSubstrate = (account: any): AppThunk => async (dispatch, getState) => {
  queryBalance(account, dispatch, getState)
}

const queryBalance = async (account: any, dispatch: any, getState: any) => {
  dispatch(setDotAccounts(account));
  let account2: any = { ...account }

  const api = await polkadotServer.createPolkadotApi();
  const result = await api.query.system.account(account2.address);
  if (result) {
    let fisFreeBalance = NumberUtil.tokenAmountToHuman(result.data.free,rSymbol.Dot);
    account2.balance = NumberUtil.handleEthAmountRound(fisFreeBalance);
  }
  const dotAccount = getState().rDOTModule.dotAccount;
  if (dotAccount && dotAccount.address == account2.address) {
    dispatch(setDotAccount(account2));
  }
  dispatch(setDotAccounts(account2));
}

export const transfer = (amountparam: string, cb?: Function): AppThunk => async (dispatch, getState) => {
  const processParameter=getState().rDOTModule.processParameter;
  const notice_uuid=(processParameter && processParameter.uuid) || stafi_uuid(); 

  dispatch(initProcess(null));
  const amount = NumberUtil.tokenAmountToChain(amountparam,rSymbol.Dot)
  const validPools = getState().rDOTModule.validPools;
  const poolLimit = getState().rDOTModule.poolLimit;
  const address = getState().rDOTModule.dotAccount.address;
  web3Enable(stafiServer.getWeb3EnalbeName());
  const injector = await web3FromSource(stafiServer.getPolkadotJsSource())

  const dotApi = await polkadotServer.createPolkadotApi();

  const selectedPool =commonClice.getPool(amount, validPools, poolLimit);
  if (selectedPool == null) { 
    return;
  } 
  
  const ex =await dotApi.tx.balances.transferKeepAlive(selectedPool, amount.toString()); 
  
  let index=0;
  ex.signAndSend(address, { signer: injector.signer }, (result: any) => {
    if(index==0){
      dispatch(setProcessSlider(true));
      dispatch(setProcessSending({
        brocasting: processStatus.loading,
        packing: processStatus.default,
        finalizing: processStatus.default
      }));
      dispatch(setProcessType(rSymbol.Dot));
      index=index+1;
    }
   
    const tx = ex.hash.toHex()
    try {
      let asInBlock = ""
      try {
        asInBlock = "" + result.status.asInBlock;
      } catch (e) {
        // do nothinig
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
          href: cb ? "/rDOT/staker/info" : null
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
        //Message notice
        dispatch(add_DOT_stake_Notice(notice_uuid,amountparam,noticeStatus.Pending));

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
              dispatch(add_DOT_stake_Notice(notice_uuid,amountparam,noticeStatus.Error));
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
                  type: rSymbol.Dot,
                  poolAddress: selectedPool
                }
              }))  

              // Pending
              dispatch(add_DOT_stake_Notice(notice_uuid,amountparam,noticeStatus.Pending,{
                process:getState().globalModule.process,
                processParameter:getState().rDOTModule.processParameter}))
              asInBlock && dispatch(bound(address, tx, asInBlock, amount, selectedPool, rSymbol.Dot, (r: string) => {
                if(r=="loading"){
                  dispatch(add_DOT_stake_Notice(notice_uuid,amountparam,noticeStatus.Pending))
                }else{ 
                  dispatch(setStakeHash(null));
                }

                if(r == "failure"){
                  dispatch(add_DOT_stake_Notice(notice_uuid,amountparam,noticeStatus.Error)
                  );
                }

                if(r=="successful"){
                    dispatch(reloadData());
                    dispatch(add_DOT_stake_Notice(notice_uuid,amountparam,noticeStatus.Confirmed));
                    cb && cb(); 
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
  const address = getState().rDOTModule.dotAccount.address;
  const result = await api.derive.balances.all(address);
  if (result) {
    const transferrableAmount = NumberUtil.tokenAmountToHuman(result.availableBalance,rSymbol.Dot);
    const transferrableAmountShow = NumberUtil.handleFisAmountToFixed(transferrableAmount);
    dispatch(setTransferrableAmountShow(transferrableAmountShow));
  }
}


export const query_rBalances_account = (): AppThunk => async (dispatch, getState) => {
  commonClice.query_rBalances_account(getState().FISModule.fisAccount,rSymbol.Dot,(data:any)=>{
    if (data == null) {
      dispatch(setTokenAmount(NumberUtil.handleFisAmountToFixed(0)))
    } else {
      dispatch(setTokenAmount(NumberUtil.tokenAmountToHuman(data.free,rSymbol.Dot)))
    }
  }) 
}

export const reSending = (cb?: Function): AppThunk => async (dispatch, getState) => {
  const processParameter = getState().rDOTModule.processParameter
  if (processParameter) {
    const href = processParameter.href
    dispatch(transfer(processParameter.sending.amount, () => {
      (cb && href) && cb(href)
    }));
  }
}

export const reStaking = (cb?: Function): AppThunk => async (dispatch, getState) => { 
  const processParameter = getState().rDOTModule.processParameter
  if (processParameter) {
    const staking = processParameter.staking;
    const href = processParameter.href;
    processParameter && dispatch(bound(staking.address,
      staking.txHash,
      staking.blockHash,
      NumberUtil.tokenAmountToChain(staking.amount,rSymbol.Dot),
      staking.poolAddress,
      staking.type,
      (r: string) => { 
        if(r=="loading"){
          dispatch(add_DOT_stake_Notice(processParameter.sending.uuid,staking.amount,noticeStatus.Pending))
        }else{ 
          dispatch(setStakeHash(null));
        }

        if(r == "failure"){
          dispatch(add_DOT_stake_Notice(processParameter.sending.uuid,staking.amount,noticeStatus.Error)
          );
        }

        if(r=="successful"){
            dispatch(add_DOT_stake_Notice(processParameter.sending.uuid,staking.amount,noticeStatus.Confirmed));
            (href && cb) && cb(href); 
            dispatch(reloadData());
        } 
      }
    ));
  }
}


export const unbond = (amount: string,recipient:string,willAmount:any, cb?: Function): AppThunk => async (dispatch, getState) => {
  try{
    const validPools = getState().rDOTModule.validPools; 
    let selectedPool=commonClice.getPoolForUnbond(amount, validPools,rSymbol.Dot);
    if (selectedPool == null) { 
      cb && cb();
      return;
    } 
    const keyringInstance = keyring.init(Symbol.Dot);
    
    dispatch(fisUnbond(amount, rSymbol.Dot, u8aToHex(keyringInstance.decodeAddress(recipient)), u8aToHex(keyringInstance.decodeAddress(selectedPool)),"Unbond succeeded, unbonding period is around 29 days", (r?:string) => {
      dispatch(reloadData()); 
      if(r != "Failed"){  
        dispatch(add_DOT_unbond_Notice(stafi_uuid(),willAmount,noticeStatus.Confirmed));
      }else{
        dispatch(add_DOT_unbond_Notice(stafi_uuid(),willAmount,noticeStatus.Error));
      } 
      cb && cb(); 
    }))
  }catch(e){
    cb && cb();
  }
}

export const continueProcess = (): AppThunk => async (dispatch, getState) => {
  const stakeHash = getState().rDOTModule.stakeHash; 
  if (stakeHash && stakeHash.blockHash && stakeHash.txHash) { 
    let bondSuccessParamArr:any[] = [];
    bondSuccessParamArr.push(stakeHash.blockHash);
    bondSuccessParamArr.push(stakeHash.txHash);
    let statusObj={
      num:0
    }
    dispatch(rTokenSeries_bondStates(rSymbol.Dot, bondSuccessParamArr,statusObj,(e:string)=>{
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
  const noticeData=findUuid(getstate().noticeModule.noticeData || [],txHash,blockHash)
  
  let bondSuccessParamArr:any[] = [];
  bondSuccessParamArr.push(blockHash);
  bondSuccessParamArr.push(txHash);
  let statusObj={
    num:0
  } 
  dispatch(rTokenSeries_bondStates(rSymbol.Dot, bondSuccessParamArr,statusObj,(e:string)=>{
    if(e=="successful"){ 
      dispatch(setStakeHash(null));
      message.success("Transaction has been proceeded",3,()=>{
        cb && cb("successful");
      })
      noticeData && dispatch(add_DOT_stake_Notice(noticeData.uuid,noticeData.amount,noticeStatus.Confirmed));
    }else if(e=="failure" || e=="stakingFailure"){ 
      dispatch(getBlock(blockHash, txHash,noticeData.uuid,()=>{
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
    const address = getState().rDOTModule.dotAccount.address;
    const validPools = getState().rDOTModule.validPools;
    const poolLimit = getState().rDOTModule.poolLimit;
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
            }
          }))
          dispatch(setProcessSlider(true));
          dispatch(setProcessParameter({
            staking: {
              amount: NumberUtil.tokenAmountToHuman(amount,rSymbol.Dot),
              txHash,
              blockHash,
              address,
              type: rSymbol.Dot,
              poolAddress: selectedPool
            }
          }))
          dispatch(bound(address, txHash, blockHash, amount, selectedPool, rSymbol.Dot, (r:string) => {
            // dispatch(setStakeHash(null));

            if(r=="loading"){
              uuid && dispatch(add_DOT_stake_Notice(uuid,NumberUtil.tokenAmountToHuman(amount,rSymbol.Dot).toString(),noticeStatus.Pending))
            }else{ 
              dispatch(setStakeHash(null));
            }

            if(r == "failure"){
              uuid && dispatch(add_DOT_stake_Notice(uuid,NumberUtil.tokenAmountToHuman(amount,rSymbol.Dot).toString(),noticeStatus.Error)
              );
            }
            if(r=="successful"){
                uuid && dispatch(add_DOT_stake_Notice(uuid,NumberUtil.tokenAmountToHuman(amount,rSymbol.Dot).toString(),noticeStatus.Confirmed));
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
  commonClice.getPools(rSymbol.Dot,Symbol.Dot,(data:any)=>{
    dispatch(setValidPools(data));
    cb && cb()
  }) 
  const data=await commonClice.poolBalanceLimit(rSymbol.Dot);
  dispatch(setPoolLimit(data));
}
 
export const getUnbondCommission=():AppThunk=>async (dispatch, getState)=>{ 
  const unbondCommission =await commonClice.getUnbondCommission(); 
  dispatch(setUnbondCommission(unbondCommission)); 
}

export const bondFees=():AppThunk=>async (dispatch, getState)=>{
  
  const result =await commonClice.bondFees(rSymbol.Dot)
  dispatch(setBondFees(result));
}
export const unbondFees=():AppThunk=>async (dispatch, getState)=>{ 
  const result=await commonClice.unbondFees(rSymbol.Dot)
  dispatch(setUnBondFees(result));
}
 
export const getTotalIssuance=():AppThunk=>async (dispatch, getState)=>{ 
  const result=await commonClice.getTotalIssuance(rSymbol.Dot);
  dispatch(setTotalIssuance(result))
 
}

export const rTokenLedger=():AppThunk=>async (dispatch, getState)=>{
  const stafiApi = await stafiServer.createStafiApi();
  const eraResult = await stafiApi.query.rTokenLedger.chainEras(rSymbol.Dot);
  let currentEra = eraResult.toJSON();
  if (currentEra) {
    let rateResult = await stafiApi.query.rTokenRate.eraRate(rSymbol.Dot, currentEra - 1) 
    const currentRate = rateResult.toJSON(); 
    const rateResult2 = await stafiApi.query.rTokenRate.eraRate(rSymbol.Dot, currentEra - 2)
    let lastRate = rateResult2.toJSON();
    dispatch(handleStakerApr(currentRate,lastRate));
  } else {
    dispatch(handleStakerApr());
  }  
}
 const handleStakerApr=(currentRate?:any,lastRate?:any):AppThunk=>async (dispatch, getState)=>{
    if (currentRate && lastRate) {
      const apr = NumberUtil.handleEthRoundToFixed((currentRate - lastRate)/lastRate * 365.25 * 100) + '%';
      dispatch(setStakerApr(apr));
    } else {
      dispatch(setStakerApr('15.9%')); 
    }
  }

  export const checkAddress = (address:string)=>{
    const keyringInstance = keyring.init(Symbol.Dot);
    return keyringInstance.checkAddress(address);
  }

  export const accountUnbonds=():AppThunk=>async (dispatch, getState)=>{ 
      let fisAddress = getState().FISModule.fisAccount.address;
      commonClice.getTotalUnbonding(fisAddress,rSymbol.Dot,(total:any)=>{ 
        dispatch(setTotalUnbonding(total));
      })
  }
  export const rTokenRate = (): AppThunk => async (dispatch, getState) => {
    const ratio=await commonClice.rTokenRate(rSymbol.Dot);
    dispatch(setRatio(ratio)) 
  }
 
const add_DOT_stake_Notice=(uuid:string,amount:string,status:string,subData?:any):AppThunk=>async (dispatch,getState)=>{
  setTimeout(()=>{
    dispatch(add_DOT_Notice(uuid,noticeType.Staker,noticesubType.Stake,amount,status,{
    process:getState().globalModule.process,
    processParameter:getState().rDOTModule.processParameter}))
  },10);
}
const add_DOT_unbond_Notice=(uuid:string,amount:string,status:string,subData?:any):AppThunk=>async (dispatch,getState)=>{
  dispatch(add_DOT_Notice(uuid,noticeType.Staker,noticesubType.Unbond,amount,status,subData))
}
const add_DOT_Withdraw_Notice=(uuid:string,amount:string,status:string,subData?:any):AppThunk=>async (dispatch,getState)=>{
  dispatch(add_DOT_Notice(uuid,noticeType.Staker,noticesubType.Withdraw,amount,status,subData))
}
const add_DOT_Swap_Notice=(uuid:string,amount:string,status:string,subData?:any):AppThunk=>async (dispatch,getState)=>{
  dispatch(add_DOT_Notice(uuid,noticeType.Staker,noticesubType.Swap,amount,status,subData))
}
const add_DOT_Notice=(uuid:string,type:string,subType:string,content:string,status:string,subData?:any):AppThunk=>async (dispatch,getState)=>{
    dispatch(add_Notice(uuid,Symbol.Dot,type,subType,content,status,subData))
}

 
export default rDOTClice.reducer;