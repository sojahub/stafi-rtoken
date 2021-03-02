import React, { useState } from 'react';
import {useDispatch} from 'react-redux';
import Item from './liquidingProcessSliderItem';
import {useSelector} from 'react-redux'
import Liquiding_heard from '@images/liquiding_heard.svg';
import close_svg from '@images/close.svg';
import {setProcessSlider} from '@features/globalClice';
import {reStaking,reSending} from '@features/rDOTClice'

import './liquidingProcessSlider.scss';
type Props={
  route:any,
  history:any
}
export default function Index(props:Props){ 

  const dispatch = useDispatch();
  const {show,process} =useSelector((state:any)=>{ 
    return {
      show:state.globalModule.processSlider,
      process:state.globalModule.process
    }
  }) 

  const reSendingClick=()=>{
    if(props.route.type=="rDOT"){
      dispatch(reSending((href:any)=>{
        href && props.history.push(href)
      }));
    }
  }
  const reStakingClick=()=>{
    if(props.route.type=="rDOT"){
      dispatch(reStaking((href:any)=>{
        href && props.history.push(href)
      }));
    }
  }
  if(!show){
    return null;
  }
  return <div className="stafi_liquiding_proces_slider">
   
    <div className="header">
      <img className="close" src={close_svg} onClick={()=>{
        dispatch(setProcessSlider(false));
      }}/>
      <img className="logo" src={Liquiding_heard}/> Liquiding Process
    </div>
    <div className="body">
        <Item index={1} title="Sending" data={process.sending} onClick={reSendingClick} showButton={true}/>
        <Item index={2} title="Staking"  data={process.staking} onClick={reStakingClick} showButton={true}/>
        <Item index={3} title="Minting" data={process.minting} showButton={false}/>
    </div>
  </div>
}