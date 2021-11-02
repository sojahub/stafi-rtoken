import Content from '@shared/components/content';
import {
  getLpMetaMaskNetworkName,
  getLpPlatformFromUrl,
  getLpPrefix,
  liquidityPlatformMatchMetaMask,
  requestSwitchMetaMaskNetwork
} from '@util/metaMaskUtil';
import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import '../template/index.scss';

export default function Index(props: any) {
  const dispatch = useDispatch();

  const { loading, metaMaskNetworkId } = useSelector((state: any) => {
    return {
      loading: state.globalModule.loading,
      metaMaskNetworkId: state.globalModule.metaMaskNetworkId,
    };
  });

  const metaMaskNetworkMatched = useMemo(() => {
    return liquidityPlatformMatchMetaMask(metaMaskNetworkId, getLpPlatformFromUrl(location.pathname));
  }, [metaMaskNetworkId, location.pathname]);

  return (
    <div className='stafi_layout_full' style={{ paddingTop: 0 }}>
      <div className='stafi_container'>
        {/* <Spin spinning={loading} size='large' tip='loading'> */}
        <Content location={props.location} routes={props.route.routes}>
          {renderRoutes(props.route.routes)}
        </Content>
        {/* </Spin> */}

        {location.pathname.includes('/rPool/lp/') && !metaMaskNetworkMatched && (
          <div className='switch_network_container'>
            <div className='switch_network_prefix'>
              {getLpPrefix(location.pathname)} LP need to connect to {getLpMetaMaskNetworkName(location.pathname)}.
            </div>

            <div
              className='switch_network_link'
              onClick={() => {
                requestSwitchMetaMaskNetwork(getLpPlatformFromUrl(location.pathname));
              }}>
              Add / Switch to {getLpMetaMaskNetworkName(location.pathname)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
