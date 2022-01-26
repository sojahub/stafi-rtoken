import { Spin } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { useLocation } from 'react-router-dom';
import { Text } from 'src/components/commonComponents';
import '../template/index.scss';

export default function Index(props: any) {
  const location = useLocation();

  const { loading } = useSelector((state: any) => {
    return {
      loading: state.globalModule.loading,
    };
  });
  return (
    <div className='stafi_layout' style={{ marginTop: '-30px' }}>
      <div className='stafi_container'>
        <Spin spinning={loading} size='large' tip='loading'>
          {renderRoutes(props.route.routes)}
        </Spin>

        {location.pathname.includes('/rAsset/swap/') && (
          <Text size='12px' color='#c4c4c4' mt='15px'>
            Reminder: You cannot directly swap tokens to Exchange address from rBridge UI.
          </Text>
        )}
      </div>
    </div>
  );
}
