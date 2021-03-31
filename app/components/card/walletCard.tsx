import React, { useState } from 'react';
import Item from './walletCardItem';
import leftArrowSvg from '@images/left_arrow.svg';
import Button from '@shared/components/button/button';
import A from '@shared/components/button/a'
import './index.scss';


type Props={
  onConfirm?:Function,
  children?:any,
  title?:string,
  btnText?:string,
  history?:any,
  showBackIcon?:boolean,
  form?:any,
  onCancel?:Function
}
export default function Index(props:Props){ 
  return <div className="wallet_card">
    {props.showBackIcon && <img className="back_icon" onClick={()=>{
      props.history.goBack();
    }} src={leftArrowSvg}/>}
      <div className="context">
        <label className="title">{props.title}</label> 
        <div className="wallet_card_content">
        {props.children} 
        </div>
      </div>
      <div className="btn_panel">
        {props.form=="header" && <A  onClick={()=>{ 
               props.onCancel && props.onCancel();
         }}>Cancel</A>}
         <Button onClick={()=>{
           props.onConfirm && props.onConfirm();
         }}>{props.btnText?props.btnText:"Confirm"}</Button>
      </div>
  </div>
}