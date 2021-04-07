import React, { useEffect } from 'react'; 
import { Spin} from 'antd'
import {useDispatch,useSelector} from 'react-redux'; 
import Content from '@shared/components/content';
import {renderRoutes}  from 'react-router-config';
import {getLocalStorageItem,Keys} from '@util/common';
import LiquidingProcesSlider from '@components/slider/liquidingProcessSlider'; 
import {Symbol} from '@keyring/defaults'
import {fetchStafiStakerApr,reloadData,} from '@features/globalClice';
import {continueProcess,getPools,bondFees,totalIssuance} from '@features/rKSMClice'
import {bondSwitch} from '@features/FISClice'; 
import '../template/index.scss'
export default function Index(props:any){
  const dispatch = useDispatch();
  
  const {fisAccount,ksmAccount}=useSelector((state:any)=>{
    return {
      fisAccount:state.FISModule.fisAccount,
      ksmAccount:state.rKSMModule.ksmAccount
    }
  })

  useEffect(()=>{
    dispatch(totalIssuance());
    
  },[fisAccount,ksmAccount])
  useEffect(()=>{ 
    dispatch(fetchStafiStakerApr()); 
    dispatch(bondFees());
    dispatch(bondSwitch()); 
    if(getLocalStorageItem(Keys.KsmAccountKey) && getLocalStorageItem(Keys.FisAccountKey)){
        dispatch(reloadData(Symbol.Ksm)); 
        dispatch(reloadData(Symbol.Fis)); 
    } 
    dispatch(getPools(()=>{ 
      setTimeout(()=>{
        dispatch(continueProcess());
      },20)
    }));
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