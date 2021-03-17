import React from 'react';
import Sider from '@components/slider';
import Header from '@components/header';
import {renderRoutes}  from 'react-router-config';

export default function index(props:any){ 
  return <div className="stafi_layout" style={{height:"100%"}}>
       <Sider route={props.route} history={props.history}/> 

       <div className={"stafi_layout_content"}>
        <Header route={props.route}  history={props.history}/>
        {renderRoutes(props.route.routes)}
      </div>
  </div>
}