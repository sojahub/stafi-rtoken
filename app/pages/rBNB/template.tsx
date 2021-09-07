import { bondSwitch } from '@features/FISClice';
import { reloadData } from '@features/globalClice';
import { bondFees, continueProcess, getPools, reloadData as bnb_reloadData } from '@features/rBNBClice';
import { Symbol } from '@keyring/defaults';
import Content from '@shared/components/content';
import { getLocalStorageItem, Keys } from '@util/common';
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
    dispatch(bnb_reloadData());
  }, [fisAccount && fisAccount.address]);

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
  }, []);

  const { maticAccount } = useSelector((state: any) => {
    return {
      maticAccount: state.rMATICModule.maticAccount,
    };
  });

  useEffect(() => {
    maticAccount && maticAccount.address && dispatch(reloadData(Symbol.Matic));
  }, [maticAccount && maticAccount.address]);

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
