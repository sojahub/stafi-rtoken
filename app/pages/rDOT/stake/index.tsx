import React from 'react';
import Card from '@components/card/stakeCard';
import Sider from '@components/sider/stakeSider';
import Content from '@components/content/stakeContent';

export default function Index(){
  return <Card>
      <Sider />
      <Content></Content>
  </Card>
}