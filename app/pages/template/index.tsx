import React, { useEffect } from 'react'; 
import Header from '@components/header';
import Sider from '@components/slider';
import Content from '@components/content';
import {renderRoutes}  from 'react-router-config';
import LiquidingProcesSlider from '@components/slider/liquidingProcessSlider'
import './index.scss';

export default function Index(props:any){
  useEffect(()=>{ 
  },[])
  console.log(props)
  return <div>
    <Header route={props.route}/>
    <div className="stafi_layout">
      <Sider route={props.route} histroy={props.histroy}/> 
      <LiquidingProcesSlider />
      <div className="stafi_container">
        
         <Content>
           {renderRoutes(props.route.routes)}
         </Content>
      </div>
    </div>
  </div>
}