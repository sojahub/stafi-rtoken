import { Spin } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import config from 'src/config/index';
import { handleEthAccount, monitoring_Method, reloadData } from 'src/features/rETHClice';
import Content from 'src/shared/components/content';
import '../template/index.scss';
import './index.scss';
export default function Index(props: any) {
  const dispatch = useDispatch();

  const { ethAccount, metaMaskNetworkId } = useSelector((state: any) => {
    return {
      ethAccount: state.rETHModule.ethAccount,
      metaMaskNetworkId: state.globalModule.metaMaskNetworkId,
    };
  });

  useEffect(() => {
    ethAccount && ethAccount.address && dispatch(handleEthAccount(ethAccount.address, config.goerliChainId()));
    ethAccount && ethAccount.address && dispatch(reloadData());
  }, [ethAccount && ethAccount.address, metaMaskNetworkId]);

  useEffect(() => {
    dispatch(monitoring_Method());
  }, []);

  const { loading } = useSelector((state: any) => {
    return {
      loading: state.globalModule.loading,
    };
  });

  return (
    <div className='stafi_layout'>
      {/* <Sider route={props.route} history={props.history}/>  */}

      <div className='stafi_container'>
        <Spin spinning={loading} size='large' tip='loading'>
          <Content>{renderRoutes(props.route.routes)}</Content>
        </Spin>
      </div>
    </div>
  );
}
