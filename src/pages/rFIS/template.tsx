import { Spin } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { fis_bondSwitch, getPools, rTokenRate } from 'src/features/FISClice';
import { reloadData } from 'src/features/globalClice';
import { useStafiAccount } from 'src/hooks/useStafiAccount';
import { Symbol } from 'src/keyring/defaults';
import Content from 'src/shared/components/content';
import { getLocalStorageItem, Keys } from 'src/util/common';
import '../template/index.scss';
export default function Index(props: any) {
  const dispatch = useDispatch();

  const { stafiAddress } = useStafiAccount();

  useEffect(() => {
    dispatch(fis_bondSwitch());
    dispatch(getPools());
    if (getLocalStorageItem(Keys.FisAccountKey)) {
      dispatch(reloadData(Symbol.Fis));
    }
    dispatch(rTokenRate());
  }, [stafiAddress, dispatch]);

  const { loading } = useSelector((state: any) => {
    return {
      loading: state.globalModule.loading,
    };
  });

  return (
    <div className='stafi_layout'>
      <div className='stafi_container'>
        <Spin spinning={loading} size='large' tip='loading'>
          <Content>{renderRoutes(props.route.routes)}</Content>
        </Spin>
      </div>
    </div>
  );
}
