import { Spin } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import config from 'src/config/index';
import { bondSwitch } from 'src/features/FISClice';
import { reloadData } from 'src/features/globalClice';
import {
  bondFees,
  continueProcess,
  getPools,
  getTotalIssuance,
  query_rBalances_account,
} from 'src/features/rMATICClice';
import { useMetaMaskAccount } from 'src/hooks/useMetaMaskAccount';
import { Symbol } from 'src/keyring/defaults';
import Content from 'src/shared/components/content';
import { getLocalStorageItem, Keys } from 'src/util/common';
import '../template/index.scss';

export default function Index(props: any) {
  const dispatch = useDispatch();
  const { metaMaskAddress, metaMaskNetworkId } = useMetaMaskAccount();

  const { fisAccount } = useSelector((state: any) => {
    return {
      fisAccount: state.FISModule.fisAccount,
    };
  });

  useEffect(() => {
    dispatch(getTotalIssuance());
    dispatch(query_rBalances_account());
  }, [dispatch, fisAccount]);

  useEffect(() => {
    dispatch(bondFees());
    dispatch(bondSwitch());
    if (getLocalStorageItem(Keys.FisAccountKey)) {
      dispatch(reloadData(Symbol.Fis));
    }
    dispatch(getPools());
    setTimeout(() => {
      dispatch(continueProcess());
    }, 50);
  }, [dispatch]);

  useEffect(() => {
    if (metaMaskAddress && config.metaMaskNetworkIsGoerliEth(metaMaskNetworkId)) {
      dispatch(reloadData(Symbol.Matic));
    }
  }, [dispatch, metaMaskAddress, metaMaskNetworkId]);

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
