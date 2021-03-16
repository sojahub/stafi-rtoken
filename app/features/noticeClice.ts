import { createSlice } from '@reduxjs/toolkit'; 
import { AppThunk, RootState } from '../store';
import { setLocalStorageItem, getLocalStorageItem, removeLocalStorageItem, Keys } from '@util/common';
import {setProcessParameter} from './rDOTClice';
import {initProcess} from './globalClice'
import moment from 'moment'; 
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


export const setProcess=(item:any):AppThunk=>async (dispatch,getState)=>{
  dispatch(initProcess(item.subData.process));
  dispatch(setProcessParameter(item.subData.processParameter))
}
export default noticeClice.reducer