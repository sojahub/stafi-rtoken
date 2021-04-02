import React, { useEffect } from 'react'; 
import {useDispatch,useSelector} from 'react-redux'; 
import Content from '@shared/components/content';
import {renderRoutes}  from 'react-router-config';
import {getLocalStorageItem,Keys} from '@util/common';
import LiquidingProcesSlider from '@components/slider/liquidingProcessSlider'; 
import {Symbol} from '@keyring/defaults'
import {fetchStafiStakerApr,reloadData,} from '@features/globalClice';
import {continueProcess,getPools,bondFees} from '@features/rKSMClice'
import {bondSwitch} from '@features/FISClice'; 
import '../template/index.scss'
export default function Index(props:any){
  const dispatch = useDispatch();
  
  useEffect(()=>{ 
    dispatch(fetchStafiStakerApr());
  
    dispatch(bondFees());
    dispatch(bondSwitch()); 
    if(getLocalStorageItem(Keys.KsmAccountKey) && getLocalStorageItem(Keys.FisAccountKey)){
        dispatch(reloadData(Symbol.Ksm)); 
        dispatch(reloadData(Symbol.Fis));   

        dispatch(getPools(()=>{
          setTimeout(()=>{
            dispatch(continueProcess());
          },20)
        }));
    } 
  },[]) 
 
  return  <div className="stafi_layout"> 
      {/* <LiquidingProcesSlider route={props.route}  history={props.history}/> */}
      <div className="stafi_container">
         <Content>
           {renderRoutes(props.route.routes)}
         </Content>
      </div> 
  </div>
}