import React from 'react';
import { renderRoutes } from 'react-router-config';
import Card from 'src/components/card/stakeCard';
import Slider from 'src/components/slider/stakeSlider';
// import Content from './home/validatorContent';
import { rDOT_data } from '../systemData';
import './index.scss';

export default function Index(props:any){ 
  return <Card>
      <Slider  history={props.history} data={rDOT_data} type={props.route.type}/>
      {renderRoutes(props.route.routes)} 
  </Card>
}