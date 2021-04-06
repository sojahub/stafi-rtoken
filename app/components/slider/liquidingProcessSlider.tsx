import React, { useState } from 'react';
import {useDispatch} from 'react-redux';
import Item from './liquidingProcessSliderItem';
import {useSelector} from 'react-redux'
import Liquiding_heard from '@images/liquiding_heard.svg';
import close_svg from '@images/close.svg';
import {setProcessSlider} from '@features/globalClice';
import {reStaking,reSending} from '@features/rDOTClice'; 
import {reStaking as ksmReStaking,reSending as ksmReSending } from '@features/rKSMClice'; 
import util from '@util/toolUtil'
import {rSymbol} from '@keyring/defaults'

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

  console.log(process,"====process")
  const reSendingClick=()=>{
    if(util.pageType()==rSymbol.Dot){
      dispatch(reSending((href:any)=>{
        href && props.history.push(href)
      }));
    }
    if(util.pageType()==rSymbol.Ksm){
      dispatch(ksmReSending((href:any)=>{
        href && props.history.push(href)
      }));
    }
  }
  const reStakingClick=()=>{ 
    if(util.pageType()==rSymbol.Dot){
      dispatch(reStaking((href:any)=>{
        href && props.history.push(href)
      }));
    }
    if(util.pageType()==rSymbol.Ksm){
      dispatch(ksmReStaking((href:any)=>{
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
        <Item rSymbol={process.rSymbol} index={1} title="Sending" tooltipText="Stake is sending to the contract and is recorded to wait for staking" data={process.sending} onClick={reSendingClick} showButton={true}/>
        <Item rSymbol={process.rSymbol} index={2} title="Staking" tooltipText="Contract is interacting with original chain and stake on your behalf"  data={process.staking} onClick={reStakingClick} showButton={true}/>
        <Item rSymbol={process.rSymbol} index={3} title="Minting" tooltipText="Staked proof gets validated, contract is issuing rToken to your address" data={process.minting} showButton={false}/>
    </div>
  </div>
}