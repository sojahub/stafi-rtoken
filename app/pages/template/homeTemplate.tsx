import Header from '@components/header';
import Sider from '@components/slider';
import LiquidingProcesSlider from '@components/slider/liquidingProcessSlider';
import React from 'react';
import { renderRoutes } from 'react-router-config';

export default function index(props: any) {
  return (
    <div className='stafi_layout' style={{ height: '100%' }}>
      <Sider route={props.route} history={props.history} />

      <LiquidingProcesSlider route={props.route} history={props.history} />

      <div className={'stafi_layout_content'}>
        <Header route={props.route} history={props.history} />
        {renderRoutes(props.route.routes)}
      </div>
    </div>
  );
}
