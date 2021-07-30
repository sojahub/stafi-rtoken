import { bondSwitch } from '@features/FISClice';
import { connectAtomjs, keplr_keystorechange, reloadData } from '@features/globalClice';
import { bondFees, continueProcess, getPools, getTotalIssuance, query_rBalances_account } from '@features/rATOMClice';
import { Symbol } from '@keyring/defaults';
import Content from '@shared/components/content';
import { getLocalStorageItem, Keys } from '@util/common';
import { Spin } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import '../template/index.scss';
export default function Index(props:any){
  const dispatch = useDispatch();
  
  const {fisAccount,atomAccount}=useSelector((state:any)=>{
    return {
      fisAccount:state.FISModule.fisAccount,
      atomAccount:state.rATOMModule.atomAccount
    }
  })

  useEffect(()=>{
    dispatch(getTotalIssuance()); 
    dispatch(query_rBalances_account());
   
  },[fisAccount,atomAccount])
  useEffect(()=>{ 
    dispatch(bondFees());
    dispatch(bondSwitch()); 
    if(getLocalStorageItem(Keys.AtomAccountKey)){
      setTimeout(()=>{ 
        dispatch(connectAtomjs()); 
      },1000)
   
    } 
    if(getLocalStorageItem(Keys.FisAccountKey)){
      dispatch(reloadData(Symbol.Fis)); 
    }
    dispatch(getPools());
    setTimeout(()=>{
      dispatch(continueProcess());
    },50)
    setTimeout(()=>{
      dispatch(keplr_keystorechange()); 
    },500)
  },[]) 
  const {loading} =useSelector((state:any)=>{
    return {
      loading:state.globalModule.loading
    }
  })
  return  <div className="stafi_layout"> 
      {/* <LiquidingProcesSlider route={props.route}  history={props.history}/> */}
      <div className="stafi_container">
        <Spin spinning={loading} size="large" tip="loading">
          <Content>
            {renderRoutes(props.route.routes)}
          </Content>
         </Spin>
      </div> 
  </div>
}