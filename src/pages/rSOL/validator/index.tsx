import React from 'react';
import Card from 'src/components/card/stakeCard';
import Slider from 'src/components/slider/stakeSlider';
import { rSOL_data } from '../systemData';
import Content from './validatorContent';
export default function Index(props: any) {
  return (
    <Card>
      <Slider history={props.history} data={rSOL_data} type={props.route.type} />
      <Content
        onRecovery={() => {
          props.history.push('/rSOL/search');
        }}></Content>
    </Card>
  );
}
