import React from 'react';
import Card from '@components/card/stakeCard';
import Slider from '@components/slider/stakeSlider';
import Content from '@components/content/stakeContent_DOT';
import {renderRoutes}  from 'react-router-config';
import {rDOT_data} from '../systemData';

export default function Index(props:any){
  console.log(props)
  return <Card>
      <Slider data={rDOT_data} type={props.route.type}/>
      {renderRoutes(props.route.routes)} 
  </Card>
}