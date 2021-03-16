import React, { useEffect } from 'react'; 
import {useDispatch,useSelector} from 'react-redux';
import Header from '@components/header';
import Sider from '@components/slider';
import Content from '@components/content';
import {renderRoutes}  from 'react-router-config';
import {getLocalStorageItem,Keys} from '@util/common';
import LiquidingProcesSlider from '@components/slider/liquidingProcessSlider'; 
import {Symbol} from '@keyring/defaults'
import {fetchStafiStakerApr,connectPolkadotjs} from '@features/globalClice';
import {continueProcess,getPools,bondFees} from '@features/rDOTClice'
import {bondSwitch} from '@features/FISClice'; 
import './index.scss';

export default function Index(props:any){
  const dispatch = useDispatch();
  
  useEffect(()=>{ 
    dispatch(fetchStafiStakerApr());
    if(getLocalStorageItem(Keys.DotAccountKey) && getLocalStorageItem(Keys.FisAccountKey)){
        dispatch(connectPolkadotjs(Symbol.Dot)); 
        dispatch(connectPolkadotjs(Symbol.Fis)); 
        dispatch(continueProcess());
        dispatch(getPools());
        dispatch(bondFees());
        dispatch(bondSwitch()); 
    } 
  },[]) 
  return <div>
    <Header route={props.route}  history={props.history}/>
    <div className="stafi_layout">
      <Sider route={props.route} history={props.history}/> 
      <LiquidingProcesSlider route={props.route}  history={props.history}/>
      <div className="stafi_container">
         <Content>
           {renderRoutes(props.route.routes)}
         </Content>
      </div>
    </div>
  </div>
}