import React, { useEffect } from 'react'; 
import {Spin} from 'antd';
import {useDispatch,useSelector} from 'react-redux'; 

import {renderRoutes}  from 'react-router-config'; 
import '../template/index.scss'
export default function Index(props:any){
  const dispatch = useDispatch();
 
  const {loading} =useSelector((state:any)=>{
    return {
      loading:state.globalModule.loading
    }
  })
  return  <div className="stafi_layout"> 
      
          <div className="stafi_container"> 
            <Spin spinning={loading} size="large" tip="loading"> 
              {renderRoutes(props.route.routes)} 
            </Spin>
          </div> 
     
  </div>
}