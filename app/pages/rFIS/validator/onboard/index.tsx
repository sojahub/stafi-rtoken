import { getCurrentLedgerData,handleOnboard } from '@features/FISClice';
import { message } from 'antd';
import { RootState } from 'app/store';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Content from '../components/validatorContent';
 
export default function Index(props:any){
  const dispatch=useDispatch();
  useEffect(()=>{
    dispatch(getCurrentLedgerData())
  })
  const {currentLedgerData}=useSelector((state:RootState)=>{
    return {
      currentLedgerData:state.FISModule.currentLedgerData
    }
  })
    return <Content onBoard={()=>{
        if(currentLedgerData){
            dispatch(handleOnboard(()=>{
              props.history.push("/rFIS/validator/offboard")
            }))
        }else{
          message.warning("Please register as a validator on StaFi Chain first, then import and select your controller account")
        } 
      }}></Content>
}