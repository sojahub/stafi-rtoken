import config from '@config/index';
import { bondSwitch } from '@features/FISClice';
import { reloadData } from '@features/globalClice';
import { bondFees, continueProcess, getPools } from '@features/rBNBClice';
import { get_eth_getBalance } from '@features/rETHClice';
import { Symbol } from '@keyring/defaults';
import Content from '@shared/components/content';
import { Spin } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import '../template/index.scss';

export default function Index(props: any) {
  const dispatch = useDispatch();

  const { fisAccount } = useSelector((state: any) => {
    return {
      fisAccount: state.FISModule.fisAccount,
    };
  });

  useEffect(() => {
    fisAccount && fisAccount.address && dispatch(reloadData(Symbol.Fis));
  }, [fisAccount && fisAccount.address]);

  useEffect(() => {
    dispatch(bondFees());
    dispatch(bondSwitch());
    dispatch(getPools());
    setTimeout(() => {
      dispatch(continueProcess());
    }, 50);
  }, []);

  const { ethAccount, metaMaskNetworkId } = useSelector((state: any) => {
    return {
      metaMaskNetworkId: state.globalModule.metaMaskNetworkId,
      ethAccount: state.rETHModule.ethAccount,
    };
  });

  useEffect(() => {
    if (config.metaMaskNetworkIsBsc(metaMaskNetworkId) && ethAccount && ethAccount.address) {
      dispatch(get_eth_getBalance());
      dispatch(reloadData(Symbol.Bnb));
    }
  }, [ethAccount && ethAccount.address, fisAccount && fisAccount.address, metaMaskNetworkId]);

  const { loading } = useSelector((state: any) => {
    return {
      loading: state.globalModule.loading,
    };
  });

  return (
    <div className='stafi_layout'>
      {/* <LiquidingProcesSlider route={props.route}  history={props.history}/> */}
      <div className='stafi_container'>
        <Spin spinning={loading} size='large' tip='loading'>
          <Content>{renderRoutes(props.route.routes)}</Content>
        </Spin>
      </div>
    </div>
  );
}
