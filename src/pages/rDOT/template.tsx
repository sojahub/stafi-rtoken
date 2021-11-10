import { Spin } from 'antd';
import qs from 'querystring';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { renderRoutes } from 'react-router-config';
import config, { isdev } from 'src/config';
import { bondSwitch } from 'src/features/FISClice';
import { reloadData } from 'src/features/globalClice';
import { bondFees, continueProcess, getPools, getTotalIssuance } from 'src/features/rDOTClice';
import { Symbol } from 'src/keyring/defaults';
import Content from 'src/shared/components/content';
import { getLocalStorageItem, Keys } from 'src/util/common';
import { requestSwitchMetaMaskNetwork } from 'src/util/metaMaskUtil';
import '../template/index.scss';

export default function Index(props: any) {
  const dispatch = useDispatch();
  const location = useLocation();

  let platform = 'Native';
  if (location.search) {
    platform = qs.parse(location.search.slice(1)).platform as string;
  }

  const { fisAccount, dotAccount } = useSelector((state: any) => {
    return {
      fisAccount: state.FISModule.fisAccount,
      dotAccount: state.rDOTModule.dotAccount,
    };
  });

  useEffect(() => {
    dispatch(getTotalIssuance());
  }, [fisAccount, dotAccount]);

  useEffect(() => {
    dispatch(bondFees());
    dispatch(bondSwitch());
    if (getLocalStorageItem(Keys.DotAccountKey) && getLocalStorageItem(Keys.FisAccountKey)) {
      dispatch(reloadData(Symbol.Dot));
      dispatch(reloadData(Symbol.Fis));
    }
    dispatch(getPools());
    setTimeout(() => {
      dispatch(continueProcess());
    }, 50);
  }, []);

  const { loading, metaMaskNetworkId } = useSelector((state: any) => {
    return {
      loading: state.globalModule.loading,
      metaMaskNetworkId: state.globalModule.metaMaskNetworkId,
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
