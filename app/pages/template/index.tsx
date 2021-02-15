import React, { useEffect } from 'react'; 
import Header from '@components/header';
import Sider from '@components/slider';
import Content from '@components/content';
import {renderRoutes}  from 'react-router-config';
import LiquidingProcesSlider from '@components/slider/liquidingProcesSlider'
import './index.scss';

export default function Index(props:any){
  useEffect(()=>{ 
  },[])
  return <div>
    <Header />
    <div className="stafi_layout">
      <Sider /> 
      <LiquidingProcesSlider />
      <div className="stafi_container">
        
         <Content>
           {renderRoutes(props.route.routes)}
         </Content>
      </div>
    </div>
  </div>
}