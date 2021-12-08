import { Spin } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import config from 'src/config/index';
import { bondSwitch } from 'src/features/FISClice';
import { reloadData } from 'src/features/globalClice';
import { bondFees, continueProcess, getPools } from 'src/features/rBNBClice';
import { useMetaMaskAccount } from 'src/hooks/useMetaMaskAccount';
import { Symbol } from 'src/keyring/defaults';
import Content from 'src/shared/components/content';
import '../template/index.scss';

export default function Index(props: any) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { metaMaskAddress, metaMaskNetworkId } = useMetaMaskAccount();

  const { fisAddress } = useSelector((state: any) => {
    return {
      fisAddress: state.FISModule.fisAccount && state.FISModule.fisAccount.address,
    };
  });

  useEffect(() => {
    fisAddress && dispatch(reloadData(Symbol.Fis));
  }, [dispatch, fisAddress]);

  useEffect(() => {
    dispatch(bondFees());
    dispatch(bondSwitch());
    dispatch(getPools());
    setTimeout(() => {
      dispatch(continueProcess());
    }, 50);
  }, [dispatch]);

  useEffect(() => {
    if (config.metaMaskNetworkIsBsc(metaMaskNetworkId) && metaMaskAddress) {
      dispatch(reloadData(Symbol.Bnb));
    }
  }, [dispatch, metaMaskAddress, fisAddress, metaMaskNetworkId]);

  const { loading } = useSelector((state: any) => {
    return {
      loading: state.globalModule.loading,
    };
  });

  useEffect(() => {
    if (!metaMaskAddress) {
      history.push('/rBNB/home');
    }
  }, [history, metaMaskAddress]);

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
