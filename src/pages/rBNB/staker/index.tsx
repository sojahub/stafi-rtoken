import Card from '@components/card/stakeCard';
import Slider from '@components/slider/stakeSlider';
import React from 'react';
import { renderRoutes } from 'react-router-config';
import { rBNB_data } from '../systemData';

export default function Index(props: any) {
  return (
    <Card>
      <Slider history={props.history} data={rBNB_data} type={props.route.type} />
      {renderRoutes(props.route.routes)}
    </Card>
  );
}
