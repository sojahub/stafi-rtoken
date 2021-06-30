import React, { useEffect } from 'react'; 
import {Spin} from 'antd';
import {useDispatch,useSelector} from 'react-redux'; 
import Content from '@shared/components/content';
import {renderRoutes}  from 'react-router-config';
import {getLocalStorageItem,Keys} from '@util/common';

import {Symbol} from '@keyring/defaults'
import {reloadData} from '@features/globalClice'; 
import '../template/index.scss'
export default function Index(props:any){
  const dispatch = useDispatch();

  const {fisAccount}=useSelector((state:any)=>{
    return {
      fisAccount:state.FISModule.fisAccount
    }
  })
   
  useEffect(()=>{ 
    if(getLocalStorageItem(Keys.FisAccountKey)){
      dispatch(reloadData(Symbol.Fis)); 
    }
  },[]) 

  const {loading} =useSelector((state:any)=>{
    return {
      loading:state.globalModule.loading
    }
  })
 
  return <div className="stafi_layout"> 
      <div className="stafi_container">
        <Spin spinning={loading} size="large" tip="loading">
          <Content>
            {renderRoutes(props.route.routes)}
          </Content> 
        </Spin>
      </div> 
  </div>
}