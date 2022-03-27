import { Spin } from 'antd';
import qs from 'querystring';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import config from 'src/config/index';
import { getETHAssetBalance } from 'src/features/ETHClice';
import { reloadData } from 'src/features/rETHClice';
import { useMetaMaskAccount } from 'src/hooks/useMetaMaskAccount';
import Content from 'src/shared/components/content';
import '../template/index.scss';
import './index.scss';

export default function Index(props: any) {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { metaMaskAddress, metaMaskNetworkId } = useMetaMaskAccount();

  let platform = 'ERC20';
  if (location.search) {
    platform = qs.parse(location.search.slice(1)).platform as string;
  }

  useEffect(() => {
    if (metaMaskNetworkId === config.ethChainId()) {
      metaMaskAddress && dispatch(reloadData());
      dispatch(getETHAssetBalance());
    }
  }, [metaMaskAddress, metaMaskNetworkId, dispatch]);

  const { loading } = useSelector((state: any) => {
    return {
      loading: state.globalModule.loading,
    };
  });

  useEffect(() => {
    if (!metaMaskAddress) {
      history.replace('/rETH/home');
    } else {
      history.replace('/rETH/type');
    }
  }, [history, metaMaskAddress]);

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
