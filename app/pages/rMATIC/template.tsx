import React, { useEffect,useLayoutEffect } from 'react'; 
import { Spin} from 'antd'
import {useDispatch,useSelector} from 'react-redux'; 
import Content from '@shared/components/content';
import {renderRoutes}  from 'react-router-config';
import {getLocalStorageItem,Keys} from '@util/common'; 
import {Symbol} from '@keyring/defaults'
import {fetchStafiStakerApr,reloadData} from '@features/globalClice';
import {continueProcess,monitoring_Method,getPools,bondFees,getTotalIssuance,query_rBalances_account} from '@features/rMATICClice'
 
import {bondSwitch} from '@features/FISClice'; 
import '../template/index.scss'
export default function Index(props:any){
  const dispatch = useDispatch();
  
  const {fisAccount}=useSelector((state:any)=>{
    return {
      fisAccount:state.FISModule.fisAccount
    }
  })

  useEffect(()=>{
    dispatch(getTotalIssuance()); 
    dispatch(query_rBalances_account());
   
  },[fisAccount])
  useEffect(()=>{ 
    dispatch(fetchStafiStakerApr()); 
    dispatch(bondFees());
    dispatch(bondSwitch()); 
    // if(getLocalStorageItem(Keys.AtomAccountKey)){
    //   setTimeout(()=>{ 
    //     dispatch(connectAtomjs()); 
    //   },1000) 
    // } 
    if(getLocalStorageItem(Keys.FisAccountKey)){
      dispatch(reloadData(Symbol.Fis)); 
    }
    dispatch(getPools());
    setTimeout(()=>{
      dispatch(continueProcess());
    },50)
    // setTimeout(()=>{
    //   dispatch(keplr_keystorechange()); 
    // },500)
  },[]) 

 
  const {maticAccount}=useSelector((state:any)=>{ 
    return { 
      maticAccount:state.rMATICModule.maticAccount, 
    }
  })
  useEffect(()=>{ 
    maticAccount && maticAccount.address &&  dispatch(reloadData(Symbol.Matic));  
  },[(maticAccount==null)])
  useEffect(()=>{  
    dispatch(monitoring_Method());
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