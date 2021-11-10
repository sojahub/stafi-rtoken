import { Spin } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import config from 'src/config/index';
import { bondSwitch } from 'src/features/FISClice';
import { reloadData } from 'src/features/globalClice';
import {
    bondFees,
    connectMetamask,
    continueProcess,
    getPools,
    getTotalIssuance,
    monitoring_Method,
    query_rBalances_account
} from 'src/features/rMATICClice';
import { Symbol } from 'src/keyring/defaults';
import Content from 'src/shared/components/content';
import { getLocalStorageItem, Keys } from 'src/util/common';
import '../template/index.scss';

export default function Index(props: any) {
  const dispatch = useDispatch();

  const { fisAccount, metaMaskNetworkId } = useSelector((state: any) => {
    return {
      metaMaskNetworkId: state.globalModule.metaMaskNetworkId,
      fisAccount: state.FISModule.fisAccount,
    };
  });

  useEffect(() => {
    dispatch(getTotalIssuance());
    dispatch(query_rBalances_account());
  }, [fisAccount]);

  useEffect(() => {
    dispatch(bondFees());
    dispatch(bondSwitch());
    // if(getLocalStorageItem(Keys.AtomAccountKey)){
    //   setTimeout(()=>{
    //     dispatch(connectAtomjs());
    //   },1000)
    // }
    if (getLocalStorageItem(Keys.FisAccountKey)) {
      dispatch(reloadData(Symbol.Fis));
    }
    dispatch(getPools());
    setTimeout(() => {
      dispatch(continueProcess());
    }, 50);
    // setTimeout(()=>{
    //   dispatch(keplr_keystorechange());
    // },500)
  }, []);

  const { maticAccount } = useSelector((state: any) => {
    return {
      maticAccount: state.rMATICModule.maticAccount,
    };
  });

  useEffect(() => {
    maticAccount && maticAccount.address && dispatch(reloadData(Symbol.Matic));
  }, [maticAccount && maticAccount.address, metaMaskNetworkId]);

  useEffect(() => {
    dispatch(connectMetamask(config.ethChainId(), true));
    dispatch(monitoring_Method());
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
