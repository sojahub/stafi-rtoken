import React, { Suspense, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import Header from 'src/components/header';
import StakeSwapLoading from 'src/components/modal/StakeSwapLoading';
import Sider from 'src/components/slider';
import LiquidingProcesSlider from 'src/components/slider/liquidingProcessSlider';
import { checkMetaMaskNetworkId, initMetaMaskAccount, monitorMetaMaskChainChange } from 'src/features/globalClice';

export default function Index(props: any) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initMetaMaskAccount());
    dispatch(checkMetaMaskNetworkId());
    dispatch(monitorMetaMaskChainChange());
  }, [dispatch]);

  return (
    <div className='stafi_layout' style={{ height: '100%' }}>
      <Sider route={props.route} history={props.history} />

      <LiquidingProcesSlider route={props.route} history={props.history} />

      <div className={'stafi_layout_content'}>
        <Header route={props.route} history={props.history} />
        <Suspense fallback={<div></div>}>{renderRoutes(props.route.routes)}</Suspense>
      </div>

      <StakeSwapLoading />
    </div>
  );
}
