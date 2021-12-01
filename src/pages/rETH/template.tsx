import { Spin } from 'antd';
import qs from 'querystring';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { renderRoutes } from 'react-router-config';
import config from 'src/config/index';
import { getETHAssetBalance } from 'src/features/ETHClice';
import { handleEthAccount, reloadData, rTokenRate } from 'src/features/rETHClice';
import Content from 'src/shared/components/content';
import '../template/index.scss';
import './index.scss';

export default function Index(props: any) {
  const dispatch = useDispatch();
  const location = useLocation();

  let platform = 'ERC20';
  if (location.search) {
    platform = qs.parse(location.search.slice(1)).platform as string;
  }

  const { ethAccount, metaMaskNetworkId } = useSelector((state: any) => {
    return {
      ethAccount: state.rETHModule.ethAccount,
      metaMaskNetworkId: state.globalModule.metaMaskNetworkId,
    };
  });

  useEffect(() => {
    ethAccount && ethAccount.address && dispatch(handleEthAccount(ethAccount.address, config.goerliChainId()));
    ethAccount && ethAccount.address && dispatch(reloadData());
    dispatch(getETHAssetBalance());
  }, [ethAccount && ethAccount.address, metaMaskNetworkId, dispatch]);

  useEffect(() => {
    // dispatch(monitoring_Method());
    dispatch(rTokenRate());
  }, []);

  const { loading } = useSelector((state: any) => {
    return {
      loading: state.globalModule.loading,
    };
  });

  const showSwitchMetamaskButton = useMemo(() => {
    return (
      (platform === 'ERC20' && metaMaskNetworkId !== config.ethChainId()) ||
      (platform === 'BEP20' && metaMaskNetworkId !== config.bscChainId())
    );
  }, [metaMaskNetworkId, platform]);

  return (
    <div className='stafi_layout'>
      {/* <Sider route={props.route} history={props.history}/>  */}

      <div className='stafi_container'>
        <Spin spinning={loading} size='large' tip='loading'>
          <Content>{renderRoutes(props.route.routes)}</Content>
        </Spin>

        {/* {location.pathname.includes('/staker/info') && showSwitchMetamaskButton && (
          <div className='switch_network_container'>
            <div className='switch_network_prefix'></div>

            <div
              className='switch_network_link'
              onClick={() => {
                requestSwitchMetaMaskNetwork(platform === 'ERC20' ? 'Ethereum' : platform === 'BEP20' ? 'BSC' : '');
              }}>
              Add / Switch to {platform === 'ERC20' ? 'Ethereum' : platform === 'BEP20' ? 'BSC' : ''}{' '}
              {isdev() ? 'Testnet' : 'Mainnet'}
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}
