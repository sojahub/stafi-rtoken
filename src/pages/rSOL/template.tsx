import { Spin } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { bondSwitch } from 'src/features/FISClice';
import { reloadData } from 'src/features/globalClice';
import {
  bondFees,
  rTokenRate,
  continueProcess,
  earglyConnectPhantom,
  getPools,
  getTotalIssuance,
} from 'src/features/rSOLClice';
import { Symbol } from 'src/keyring/defaults';
import Content from 'src/shared/components/content';
import '../template/index.scss';

export default function Index(props: any) {
  const dispatch = useDispatch();

  const { fisAccount, solAddress } = useSelector((state: any) => {
    return {
      fisAccount: state.FISModule.fisAccount,
      solAddress: state.rSOLModule.solAddress,
    };
  });

  useEffect(() => {
    dispatch(earglyConnectPhantom());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getTotalIssuance());
    dispatch(rTokenRate());
  }, [dispatch, fisAccount, solAddress]);

  useEffect(() => {
    dispatch(bondFees());
    dispatch(bondSwitch());
    if (fisAccount) {
      dispatch(reloadData(Symbol.Fis));
    }
    if (solAddress) {
      dispatch(reloadData(Symbol.Sol));
    }
    dispatch(getPools());
    setTimeout(() => {
      dispatch(continueProcess());
    }, 50);
  }, [dispatch, solAddress, fisAccount && fisAccount.address]);

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
