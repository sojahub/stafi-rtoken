import Content from '@shared/components/content';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import '../template/index.scss';
export default function Index(props: any) {
  const dispatch = useDispatch();

  useEffect(() => {}, []);
  const { loading } = useSelector((state: any) => {
    return {
      loading: state.globalModule.loading,
    };
  });
  return (
    <div className='stafi_layout_full' style={{ paddingTop: 0 }}>
      <div className='stafi_container'>
        {/* <Spin spinning={loading} size='large' tip='loading'> */}
        <Content location={props.location} routes={props.route.routes}>
          {renderRoutes(props.route.routes)}
        </Content>
        {/* </Spin> */}
      </div>
    </div>
  );
}
