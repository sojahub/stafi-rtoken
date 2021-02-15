import React from 'react';
import Card from '@components/card/stakeCard';
import Slider from '@components/slider/stakeSlider';
import Content from './validatorContent';
import {rDOT_data} from '../systemData';
export default function Index(props:any){
  console.log(props)
  return <Card>
      <Slider data={rDOT_data} type={props.route.type}/>
      <Content onRecovery={()=>{
        props.history.push("/rDOT/search")
      }}></Content>
  </Card>
}