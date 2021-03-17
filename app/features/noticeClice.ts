import { createSlice } from '@reduxjs/toolkit'; 
import { AppThunk, RootState } from '../store';
import { setLocalStorageItem, getLocalStorageItem, removeLocalStorageItem, Keys } from '@util/common';
import {setProcessParameter} from './rDOTClice';
import {initProcess,setProcessSlider} from './globalClice'
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


export const add_Notice=(uuid:string,rSymbol:string,type:string,subType:string,content:string,status:string,subData?:any):AppThunk=>async (dispatch,getState)=>{
  dispatch(addNoticeModal({
    uuid:uuid,   //信息唯一标识
    title:subType,   
    type:type,
    subType:subType,
    content:content,
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
          }
        });
      // }else if(o.length==1 && o[0].uuid==item.uuid){
      //   dispatch(setProcessSlider(true))
      //   dispatch(initProcess(item.subData.process));
      //   dispatch(setProcessParameter(item.subData.processParameter));
      }else{
        Modal.warning({
          title: 'message',
          content: 'Transactions are pending, please check it later.', 
          className:'stafi_modal_warning'
        });
      }
    }else{
      dispatch(setProcessSlider(true))
      dispatch(initProcess(item.subData.process));
      dispatch(setProcessParameter(item.subData.processParameter));
    }
  }
 
}
export default noticeClice.reducer