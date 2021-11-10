import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router';
import Modal from 'src/components/modal/boardModal';
import { getCurrentLedgerData, handleOnboard } from 'src/features/FISClice';
import { RootState } from 'src/store';
import Content from '../components/validatorContent';

 
export default function Index(props:any){
  const dispatch=useDispatch();
  const [visible,setVisible]=useState(false);
  useEffect(()=>{
    dispatch(getCurrentLedgerData())
  },[])
  const {currentLedgerData,showValidatorStatus}=useSelector((state:RootState)=>{
    return {
      currentLedgerData:state.FISModule.currentLedgerData,
      showValidatorStatus:state.FISModule.showValidatorStatus
    }
  })
  if(showValidatorStatus){
    return <Redirect to="/rFIS/validator/offboard" />
  }
    return <><Content onBoard={()=>{ 
        if(currentLedgerData){
          setVisible(true);
        }else{
          message.warning("Please register as a validator on StaFi Chain first, then import and select your controller account")
        } 
      }}></Content>
      <Modal visible={visible} 
        title="Confirm to onboard"
        content="Make sure your current FIS account is your Controller account"
        OKText="Cancel"
        CancelText="Onboard"
        onClose={()=>{
          setVisible(false);
          dispatch(handleOnboard(()=>{
            props.history.push("/rFIS/validator/offboard")
          }))
        }}
        onOK={()=>{
          setVisible(false);
        }}
      />
      </>
}