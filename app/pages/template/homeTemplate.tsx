import Header from '@components/header';
import StakeSwapLoading from '@components/modal/StakeSwapLoading';
import Sider from '@components/slider';
import LiquidingProcesSlider from '@components/slider/liquidingProcessSlider';
import { checkMetaMaskNetworkId, initMetaMaskAccount, monitorMetaMaskChainChange } from '@features/globalClice';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { renderRoutes } from 'react-router-config';

export default function index(props: any) {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(initMetaMaskAccount());
    dispatch(checkMetaMaskNetworkId());
    dispatch(monitorMetaMaskChainChange());
  }, []);

  return (
    <div className='stafi_layout' style={{ height: '100%' }}>
      <Sider route={props.route} history={props.history} />

      <LiquidingProcesSlider route={props.route} history={props.history} />

      <div className={'stafi_layout_content'}>
        <Header route={props.route} history={props.history} />
        {renderRoutes(props.route.routes)}
      </div>

      <StakeSwapLoading />
    </div>
  );
}
