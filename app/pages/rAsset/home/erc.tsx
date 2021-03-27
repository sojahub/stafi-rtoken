import React, { useEffect, useState } from 'react'; 
import {useDispatch,useSelector} from 'react-redux'; 
import metamask from '@images/metamask.png'
import Button from '@shared/components/button/connect_button';
import Tag from './components/carTag/index'
import DataList from './components/list'
import Content from '@shared/components/content';
import {connectMetamask,monitoring_Method} from '@features/rETHClice';
import CountAmount from './components/countAmount'
import './page.scss'
export default function Index(props:any){ 
 
  const dispatch=useDispatch();
  useEffect(()=>{
    dispatch(connectMetamask());
    dispatch(monitoring_Method());
  },[])
  const {ethAccount}=useSelector((state:any)=>{ 
    return {
      ethAccount:state.rETHModule.ethAccount
    }
  })
  return  <Content>
    <Tag type="erc" onClick={()=>{
      props.history.push("/rAsset/native")
    }}/>
     {ethAccount?<><DataList /> <CountAmount /></> : <div className="rAsset_content"> 
     <Button icon={metamask} onClick={()=>{
        dispatch(connectMetamask());
      }}>
          Connect to Metamask
      </Button>
    </div>}
    </Content>
}
