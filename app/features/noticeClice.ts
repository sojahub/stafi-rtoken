import config from '@config/index';
import { rSymbol } from '@keyring/defaults';
import { createSlice } from '@reduxjs/toolkit';
import { getLocalStorageItem, Keys, setLocalStorageItem } from '@util/common';
import { Modal } from 'antd';
import moment from 'moment';
import { AppThunk } from '../store';
import { bondStates, getMinting } from './FISClice';
import { initProcess, processStatus, setProcessSending, setProcessSlider, setProcessStaking } from './globalClice';
import { setProcessParameter as atomSetProcessParameter } from './rATOMClice';
import { setProcessParameter } from './rDOTClice';
import { setProcessParameter as krmSetProcessParameter } from './rKSMClice';
export enum noticeStatus{
  Confirmed="Confirmed",
  Pending="Pending",
  Error="Error",
  Empty="",
}
export enum noticeType{
  Staker='Staker',
  Validator='Validator'
}
export enum noticesubType{
  Stake="Stake",
  Unbond="Unbond",
  Withdraw="Withdraw",
  Swap="Swap",
  Onboard="Onboard",
  Offboard="Offboard",
  Liquify="Liquify",
  Deposit="Deposit",
  Apply="Apply"
}
const noticeModal={
  showNew:false,
  datas:[
    { 
      title:'',
      context:"",
      status:noticeStatus.Confirmed,
      hxHash:"",
      blockHash:"",
      dateTime:moment(),
      rSymbol:''
    }
  ]
}

const formatStr="yyyy-MM-DD HH:mm"
const noticeClice = createSlice({
  name: 'noticeModule',
  initialState: { 
    noticeData:getLocalStorageItem(Keys.StafiNoticeKey)
  },
  reducers: {  
    // initNotice(state,{payload}){ 
    //   state.noticeData=getLocalStorageItem(payload.key);
    // },
    addNoticeModal(state,{payload}){ 
      let data= getLocalStorageItem(Keys.StafiNoticeKey);
     
      if(!data){ 
        data={};  
        data.datas=[] 
      } 
      if(payload.showNew){
        data.showNew=payload.showNew;
      }
      const m=data.datas.find((item:any)=>{
        return item.uuid==payload.data.uuid
      })
      if(m){
        data.datas=data.datas.map((item:any)=>{ 
          return item.uuid==payload.data.uuid ? payload.data :item;
        })
      }else{
        data.datas.push(payload.data);
      }  
      data.datas = data.datas.sort((a:any,b:any)=>{ 
        return moment(a.dateTime,formatStr).isAfter(moment(b.dateTime,formatStr))?-1:1;
      }) 
      if(data.datas.length>10){
        data.datas.pop();
      }
      setLocalStorageItem(Keys.StafiNoticeKey,data)
      state.noticeData=data;
    },
    readNotice(state,{payload}){
      let data= getLocalStorageItem(Keys.StafiNoticeKey);
      if(data){
        data.showNew=false;
        setLocalStorageItem(Keys.StafiNoticeKey,data)
        state.noticeData=data;
      }
    }
  },
});
export const {addNoticeModal,readNotice}=noticeClice.actions


export const add_Notice=(uuid:string,rSymbol:string,type:string,subType:string,amount:string,status:string,subData?:any):AppThunk=>async (dispatch,getState)=>{
  dispatch(addNoticeModal({
    data:{
      uuid:uuid,   //信息唯一标识
      title:subType,   
      type:type,
      subType:subType,
      // content:content,
      amount:amount,
      dateTime:moment().format(formatStr),
      status:status,
      rSymbol:rSymbol,
      subData:subData, 
    },
    showNew:true
  }))
}

export const update_Notice=(uuid:string,rSymbol:string,type:string,subType:string,amount:string,status:string,subData?:any):AppThunk=>async (dispatch,getState)=>{
  dispatch(addNoticeModal({
    data:{
      uuid:uuid,   //信息唯一标识
      title:subType,   
      type:type,
      subType:subType,
      // content:content,
      amount:amount,
      dateTime:moment().format(formatStr),
      status:status,
      rSymbol:rSymbol,
      subData:subData, 
    },
    showNew:false
  }))
}
 

export const setProcess=(item:any,list:any,cb?:Function):AppThunk=>async (dispatch,getState)=>{
  if(list){
    const o=list.filter((i:any)=>{
      return i.status == noticeStatus.Pending;
    }); 
    if(o && o.length>0){
      if(o.length==1 ){
        Modal.confirm({
          title: 'message',
          content: 'There is a pending transation, please check it later after the pending tx finalizes.', 
          className:'stafi_modal_confirm',
          onOk:()=>{
            dispatch(setProcessSlider(true))
            dispatch(initProcess(o[0].subData.process));
            dispatch(setProcessParameter(o[0].subData.processParameter));
            dispatch(re_Minting(o[0]))
          }
        }); 
      }else{
        dispatch(re_Minting(o[0]));
        Modal.warning({
          title: 'message',
          content: 'Transactions are pending, please check it later.', 
          className:'stafi_modal_warning'
        });
      }
    }else{ 
      dispatch(setProcessSlider(true))
      dispatch(initProcess(item.subData.process)); 
      if(item.subData.process.rSymbol==rSymbol.Ksm){
        dispatch(krmSetProcessParameter(item.subData.processParameter));
      }
      if(item.subData.process.rSymbol==rSymbol.Dot){
        dispatch(setProcessParameter(item.subData.processParameter));
      }
      if(item.subData.process.rSymbol==rSymbol.Atom){
        dispatch(atomSetProcessParameter(item.subData.processParameter));
      }
      
    }
  }
}

const re_Minting=(item:any,):AppThunk=>(dispatch,getState)=>{
  dispatch(setProcessSending({
    brocasting: processStatus.success,
    packing: processStatus.success,
    finalizing:  processStatus.success,
  }));
  dispatch(setProcessStaking({
    brocasting: processStatus.success,
    packing: processStatus.success,
    finalizing:  processStatus.success,
  })); 
  const staking=item.subData.processParameter.staking;
  let txHash="";
  let blockHash="";
  if(staking.type==rSymbol.Atom){
    txHash="0x"+staking.txHash;
    blockHash="0x"+staking.blockHash;
  }else{
    txHash=staking.txHash;
    blockHash=staking.blockHash;
  }
  dispatch(getMinting(staking.type,txHash,blockHash,(e:string)=>{ 
    if(e=="successful"){ 
     dispatch(add_Notice(item.uuid,item.rSymbol,item.type,item.subType,item.amount,noticeStatus.Confirmed,{
      process:getState().globalModule.process,
      processParameter:item.subData.processParameter
     }))
    }else if(e=="failure" || e=="stakingFailure"){
      dispatch(add_Notice(item.uuid,item.rSymbol,item.type,item.subType,item.amount,noticeStatus.Error,{
        process:getState().globalModule.process,
        processParameter:item.subData.processParameter
      }));
    }
  }));
}


export const findUuid=(datas:any,txHash:string,blockHash:string)=>{  
  if(datas){
    const data = datas.datas.find((item:any)=>{
      if(item && item.subData && item.subData.processParameter && item.subData.processParameter.sending.txHash==txHash && item.subData.processParameter.sending.blockHash==blockHash){
        return true;
      }else{
        return false;
      }
    })
    if(data && data.status!=noticeStatus.Confirmed){
      return {
        uuid:data.uuid,
        amount:data.subData.processParameter.sending.amount
      }
    } 
  }
  return null;
}

export const findUuidWithoutBlockhash = (datas: any, txHash: string) => {
  if (datas) {
    const data = datas.datas.find((item: any) => {
      if (
        item &&
        item.subData &&
        item.subData.processParameter &&
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
 
export const checkAll_minting=(list:any):AppThunk=>(dispatch,getState)=>{
  if(list){
    const arryList=list.filter((i:any)=>{
      return i.status != noticeStatus.Confirmed;
    }); 
    arryList.forEach((item:any) => {
      const staking=item.subData.processParameter.staking;
      if (!staking) {
        // continue
        return true;
      }
      let process={...item.subData.process}; 
      let txHash="";
      let blockHash="";
      if(staking.type==rSymbol.Atom){
        txHash="0x"+staking.txHash;
        blockHash="0x"+staking.blockHash;
      }else{
        txHash=staking.txHash;
        blockHash=staking.blockHash;
      }
      dispatch(bondStates(staking.type,txHash,blockHash,(e:string)=>{ 
        if(e=="successful"){ 
          process.sending={...process.sending,...{
            brocasting: processStatus.success,
            packing: processStatus.success,
            finalizing:  processStatus.success,
          }}
          process.staking={...process.staking,...{
            brocasting: processStatus.success,
            packing: processStatus.success,
            finalizing:  processStatus.success,
          }}
          process.minting={...process.minting,...{
            brocasting: processStatus.success, 
            minting:  processStatus.success,
          }}
         dispatch(update_Notice(item.uuid,item.rSymbol,item.type,item.subType,item.amount,noticeStatus.Confirmed,{
          process:process,
          processParameter:item.subData.processParameter
         }))
        }else if(e=="stakingFailure"){
          if(item.status==noticeStatus.Pending){
            process.sending={...process.sending,...{
              brocasting: processStatus.success,
              packing: processStatus.success,
              finalizing:  processStatus.success,
            }}
            process.staking={...process.staking,...{
              brocasting: processStatus.success,
              packing: processStatus.failure,
              finalizing:  processStatus.failure,
            }}
            process.minting={...process.minting,...{
              brocasting: processStatus.default, 
              minting:  processStatus.default,
            }}
          }
          dispatch(update_Notice(item.uuid,item.rSymbol,item.type,item.subType,item.amount,noticeStatus.Error,{
            process:process,
            processParameter:item.subData.processParameter
          }));
        }else if(e=="pending"){ 
          process.sending={...process.sending,...{
            brocasting: processStatus.success,
            packing: processStatus.success,
            finalizing:  processStatus.success,
          }}
          process.staking={...process.staking,...{
            brocasting: processStatus.success,
            packing: processStatus.success,
            finalizing:  processStatus.success,
          }}
          process.minting={...process.minting,...{
            brocasting: processStatus.loading, 
            minting:  processStatus.loading,
          }}  
          dispatch(update_Notice(item.uuid,item.rSymbol,item.type,item.subType,item.amount,noticeStatus.Pending,{
            process:process,
            processParameter:item.subData.processParameter
          }));
        }else{
          if(item.status==noticeStatus.Pending){
            process.sending={...process.sending,...{
              brocasting: processStatus.success,
              packing: processStatus.success,
              finalizing:  processStatus.success,
            }}
            process.staking={...process.staking,...{
              brocasting: processStatus.success,
              packing: processStatus.success,
              finalizing:  processStatus.success,
            }}
            process.minting={...process.minting,...{
              brocasting: processStatus.failure, 
              minting:  processStatus.failure,
            }}
          }
          dispatch(update_Notice(item.uuid,item.rSymbol,item.type,item.subType,item.amount,noticeStatus.Error,{
            process:process,
            processParameter:item.subData.processParameter
          }));
        }
      }));
    });
  }
}
export const notice_text=(item:any)=>{
  if(item.subType==noticesubType.Stake){
    return `Staked ${item.amount} ${item.rSymbol.toUpperCase()} from your Wallet to StaFi Validator Pool Contract`
  }else if(item.subType==noticesubType.Unbond){
    return `Unbond ${item.amount} ${item.rSymbol.toUpperCase()} from Pool Contract, it will be completed around ${moment(item.dateTime).add(config.unboundAroundDays(item.rSymbol), 'days').format("MM.DD")}`
  }else if(item.subType==noticesubType.Withdraw){
    return `Withdraw ${item.amount} ${item.rSymbol.toUpperCase()} from contracts to wallet`
  }else if(item.subType==noticesubType.Swap){
    if(item.subData.swapType == "native"){
      return `Swap ${item.amount} Native ${item.rSymbol} to ERC20, it may take 2~10 minutes to arrive`
    }else{
      return `Swap ${item.amount}  ERC20 ${item.rSymbol} to Native, it may take 2~10 minutes to arrive`
    } 
  }
  return "";
}
export default noticeClice.reducer