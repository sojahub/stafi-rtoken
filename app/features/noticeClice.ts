import { createSlice } from '@reduxjs/toolkit'; 
import { AppThunk, RootState } from '../store';
import { setLocalStorageItem, getLocalStorageItem, removeLocalStorageItem, Keys } from '@util/common';
import {setProcessParameter} from './rDOTClice';
import {setProcessParameter as krmSetProcessParameter} from './rKSMClice';
import {initProcess,setProcessSlider,setProcessSending,setProcessStaking,processStatus} from './globalClice';
import {rTokenSeries_bondStates,getMinting} from './FISClice';
import {rSymbol} from '@keyring/defaults'
import moment from 'moment'; 
import { message,Modal } from 'antd';
export enum noticeStatus{
  Confirmed="Confirmed",
  Pending="Pending",
  Error="Error",
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
      data.showNew=true;
      const m=data.datas.find((item:any)=>{
        return item.uuid==payload.uuid
      })
      if(m){
        data.datas=data.datas.map((item:any)=>{ 
          return item.uuid==payload.uuid ? payload :item;
        })
      }else{
        data.datas.push(payload);
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
      }else{
        dispatch(setProcessParameter(item.subData.processParameter));
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
  dispatch(getMinting(staking.type,staking.txHash,staking.blockHash,(e:string)=>{
    if(e=="successful"){ 
     dispatch(add_Notice(item.uuid,item.rSymbol,item.type,item.subType,item.content,noticeStatus.Confirmed,{
      process:getState().globalModule.process,
      processParameter:item.subData.processParameter
     }))
    }else{
      dispatch(add_Notice(item.uuid,item.rSymbol,item.type,item.subType,item.content,noticeStatus.Error,{
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
 

export const notice_text=(item:any)=>{
  if(item.subType==noticesubType.Stake){
    return `Staked ${item.amount} ${item.rSymbol.toUpperCase()} from your Wallet to StaFi Validator Pool Contract`
  }else if(item.subType==noticesubType.Unbond){
    return `Unbond ${item.amount} ${item.rSymbol.toUpperCase()} from Pool Contract, it will be completed around ${moment(item.dateTime).add(8, 'days').format("MM.DD")}`
  }else if(item.subType==noticesubType.Withdraw){
    return `Withdraw ${item.amount} ${item.rSymbol.toUpperCase()} from contracts to wallet`
  }else if(item.subType==noticesubType.Swap){
    return `Swap ${item.amount} Native ${item.rSymbol.toUpperCase()} to ERC20`
  }
  return "";
}
export default noticeClice.reducer