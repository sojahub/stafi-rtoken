import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import Card from 'src/components/card/stakeCard';
import Slider from 'src/components/slider/stakeSlider';
import { onboardValidators } from 'src/features/FISClice';
import { rFIS_data } from '../systemData';
export default function Index(props:any){ 
  const dispatch=useDispatch();
  useEffect(()=>{
    dispatch(onboardValidators());
  },[])
  return <Card>
      <Slider  history={props.history} data={rFIS_data} type={props.route.type}/>
      {renderRoutes(props.route.routes)}
  </Card>
}