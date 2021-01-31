import React, { useEffect } from 'react'; 
import Header from '@components/header';
import Sider from '@components/sider';
import Content from '@components/content';
import {renderRoutes}  from 'react-router-config';
import './index.scss';

export default function Index(props:any){
  useEffect(()=>{
    console.log(props)
  },[])
  return <div>
    <Header />
    <div className="stafi_layout">
      <Sider /> 
      <div className="stafi_container">
         <Content>
           {renderRoutes(props.route.routes)}
         </Content>
      </div>
    </div>
  </div>
}