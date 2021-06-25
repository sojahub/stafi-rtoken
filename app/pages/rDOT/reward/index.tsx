import React from 'react'; 
import Card from '@components/card/stakeCard';
import Slider from '@components/slider/stakeSlider'; 
import {renderRoutes}  from 'react-router-config';
import {rDOT_data} from '../systemData';

export default function Index(props:any){ 
  return <Card>
      <Slider history={props.history} data={rDOT_data} type={props.route.type}/>
      {renderRoutes(props.route.routes)} 
  </Card>
}