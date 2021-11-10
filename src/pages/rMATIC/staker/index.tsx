import React from 'react';
import { renderRoutes } from 'react-router-config';
import Card from 'src/components/card/stakeCard';
import Slider from 'src/components/slider/stakeSlider';
import { rMATIC_data } from '../systemData';

export default function Index(props:any){ 
  return <Card>
      <Slider history={props.history} data={rMATIC_data} type={props.route.type}/>
      {renderRoutes(props.route.routes)} 
  </Card>
}