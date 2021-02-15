import React from 'react';
import Item from './liquidingProcesSliderItem'
import Liquiding_heard from '@images/liquiding_heard.svg'

import './liquidingProcesSlider.scss';
type Props={

}
export default function Index(props:Props){
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