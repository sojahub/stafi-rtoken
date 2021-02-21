import React, { useState } from 'react';
import Item from './liquidingProcessSliderItem';
import {useSelector} from 'react-redux'
import Liquiding_heard from '@images/liquiding_heard.svg';

import './liquidingProcessSlider.scss';
type Props={

}
export default function Index(props:Props){
  const {show} =useSelector((state:any)=>{ 
    return {
      show:state.globalModule.processSlider
    }
  }) 
  if(!show){
    return null;
  }
  return <div className="stafi_liquiding_proces_slider">
    <div className="header">
      <img src={Liquiding_heard}/> Liquiding Process
    </div>
    <div className="body">
        <Item index={1} title="Sending" showButton={true}/>
        <Item index={2} title="Staking" failure={true} showButton={true}/>
        <Item index={3} title="Minting" showButton={false}/>
    </div>
  </div>
}