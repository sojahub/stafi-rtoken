import Card from '@components/card/stakeCard';
import Slider from '@components/slider/stakeSlider';
import React from 'react';
import { rBNB_data } from '../systemData';
import Content from './validatorContent';

export default function Index(props: any) {
  return (
    <Card>
      <Slider history={props.history} data={rBNB_data} type={props.route.type} />
      <Content
        onRecovery={() => {
          props.history.push('/rBNB/search');
        }}></Content>
    </Card>
  );
}
