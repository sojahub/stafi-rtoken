import React, { useEffect } from 'react'; 
import {useDispatch} from 'react-redux';
import Header from '@components/header';
import Sider from '@components/slider';
import Content from '@components/content';
import {renderRoutes}  from 'react-router-config';
import LiquidingProcesSlider from '@components/slider/liquidingProcessSlider';
import {fetchStafiStakerApr} from '@features/globalClice'
import './index.scss';

export default function Index(props:any){
  const dispatch = useDispatch();
  useEffect(()=>{ 
    dispatch(fetchStafiStakerApr()); 
  },[]) 
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