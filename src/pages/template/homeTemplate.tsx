import React, { Suspense, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import Header from 'src/components/header';
import StakeSwapLoading from 'src/components/modal/StakeSwapLoading';
import Sider from 'src/components/slider';
import LiquidingProcesSlider from 'src/components/slider/liquidingProcessSlider';
import { queryBalance } from 'src/features/FISClice';
import {
  checkMetaMaskNetworkId,
  getAllApr,
  initMetaMaskAccount,
  monitorMetaMaskChainChange,
} from 'src/features/globalClice';
import { useInit } from 'src/hooks/init';
import { useStafiAccount } from 'src/hooks/useStafiAccount';

export default function Index(props: any) {
  const dispatch = useDispatch();
  const { fisAccount } = useStafiAccount();
  useInit();

  useEffect(() => {
    dispatch(initMetaMaskAccount());
    dispatch(checkMetaMaskNetworkId());
    dispatch(monitorMetaMaskChainChange());
    dispatch(getAllApr());
  }, [dispatch]);

  useEffect(() => {
    dispatch(queryBalance(fisAccount));
  }, [fisAccount && fisAccount.address, dispatch]);

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
