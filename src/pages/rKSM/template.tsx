import { Spin } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { bondSwitch } from 'src/features/FISClice';
import { reloadData } from 'src/features/globalClice';
import { bondFees, continueProcess, getPools, getTotalIssuance } from 'src/features/rKSMClice';
import { Symbol } from 'src/keyring/defaults';
import Content from 'src/shared/components/content';
import { getLocalStorageItem, Keys } from 'src/util/common';
import '../template/index.scss';
export default function Index(props:any){
  const dispatch = useDispatch();
  
  const {fisAccount,ksmAccount}=useSelector((state:any)=>{
    return {
      fisAccount:state.FISModule.fisAccount,
      ksmAccount:state.rKSMModule.ksmAccount
    }
  })

  useEffect(()=>{
    dispatch(getTotalIssuance());
    
  },[fisAccount,ksmAccount])
  useEffect(()=>{ 
    dispatch(bondFees());
    dispatch(bondSwitch()); 
    if(getLocalStorageItem(Keys.KsmAccountKey) && getLocalStorageItem(Keys.FisAccountKey)){
        dispatch(reloadData(Symbol.Ksm)); 
        dispatch(reloadData(Symbol.Fis)); 
    }  
    dispatch(getPools()); 
    setTimeout(()=>{ 
      dispatch(continueProcess());
    },50)
  },[]) 
  const {loading} =useSelector((state:any)=>{
    return {
      loading:state.globalModule.loading
    }
  })
  return  <div className="stafi_layout"> 
      {/* <LiquidingProcesSlider route={props.route}  history={props.history}/> */}
      <div className="stafi_container">
        <Spin spinning={loading}size="large" tip="loading">
          <Content>
            {renderRoutes(props.route.routes)}
          </Content>
         </Spin>
      </div> 
  </div>
}