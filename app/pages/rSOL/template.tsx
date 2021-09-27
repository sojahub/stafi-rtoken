import { bondSwitch } from '@features/FISClice';
import { reloadData } from '@features/globalClice';
import { bondFees, continueProcess, getPools, getTotalIssuance, setSolAccount } from '@features/rSOLClice';
import { Symbol } from '@keyring/defaults';
import SolServer from '@servers/sol/index';
import Content from '@shared/components/content';
import { getLocalStorageItem, Keys, removeLocalStorageItem } from '@util/common';
import { Spin } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import '../template/index.scss';

const solServer = new SolServer();

export default function Index(props: any) {
  const dispatch = useDispatch();

  const { fisAccount, solAccount } = useSelector((state: any) => {
    return {
      fisAccount: state.FISModule.fisAccount,
      solAccount: state.rSOLModule.solAccount,
    };
  });

  useEffect(() => {
    const solana = solServer.getProvider();
    if (!solana) {
      dispatch(setSolAccount(null));
      removeLocalStorageItem(Keys.SolAccountKey);
    }
  }, []);

  useEffect(() => {
    dispatch(getTotalIssuance());
  }, [fisAccount, solAccount]);

  useEffect(() => {
    dispatch(bondFees());
    dispatch(bondSwitch());
    if (getLocalStorageItem(Keys.SolAccountKey) && getLocalStorageItem(Keys.FisAccountKey)) {
      dispatch(reloadData(Symbol.Sol));
      dispatch(reloadData(Symbol.Fis));
    }
    dispatch(getPools());
    setTimeout(() => {
      dispatch(continueProcess());
    }, 50);
  }, []);

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
