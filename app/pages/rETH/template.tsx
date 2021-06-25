import React, { useEffect } from 'react'; 
import {Spin} from 'antd';
import {useDispatch,useSelector} from 'react-redux'; 
import Content from '@shared/components/content';
import {renderRoutes}  from 'react-router-config'; 
import {reloadData,monitoring_Method} from '@features/rETHClice'  
import '../template/index.scss'
import './index.scss'
export default function Index(props:any){
  const dispatch = useDispatch();
 
  const {ethAccount}=useSelector((state:any)=>{ 
    return { 
      ethAccount:state.rETHModule.ethAccount, 
    }
  })
  useEffect(()=>{ 
    ethAccount && ethAccount.address &&  dispatch(reloadData());  
  },[(ethAccount==null)])
  useEffect(()=>{  
    dispatch(monitoring_Method());
  },[])
  const {loading} =useSelector((state:any)=>{
    return {
      loading:state.globalModule.loading
    }
  })
 
  return <div className="stafi_layout">
    {/* <Sider route={props.route} history={props.history}/>  */}
    
      <div className="stafi_container">
        <Spin spinning={loading} size="large" tip="loading">
          <Content> 
            {renderRoutes(props.route.routes)}
          </Content> 
        </Spin>
      </div> 
  </div>
}