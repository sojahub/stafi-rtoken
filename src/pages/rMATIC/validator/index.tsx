import React from 'react';
import Card from '@components/card/stakeCard';
import Slider from '@components/slider/stakeSlider';
import Content from './validatorContent';
import {rMATIC_data} from '../systemData';
export default function Index(props:any){ 
  return <Card>
      <Slider  history={props.history} data={rMATIC_data} type={props.route.type}/>
      <Content onRecovery={()=>{
        props.history.push("/rMATIC/search")
      }}></Content>
  </Card>
}