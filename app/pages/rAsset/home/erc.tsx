import React, { useEffect, useState } from 'react'; 
import {useDispatch,useSelector} from 'react-redux'; 
import metamask from '@images/metamask.png'
import Button from '@shared/components/button/connect_button';
import Tag from './components/carTag/index'
import DataList from './components/list'
import Content from '@shared/components/content';
import {connectMetamask,monitoring_Method,handleEthAccount,getAssetBalance} from '@features/rETHClice';
import CountAmount from './components/countAmount'; 
import rFIS_svg from '@images/rFIS.svg';
import rKSM_svg from '@images/rKSM.svg';
import './page.scss'

let dataList=[{
  rSymbol:"rFIS",
  icon:rFIS_svg,
  fullName:"StaFi",
  
}]
export default function Index(props:any){ 
 
  const dispatch=useDispatch();

  const {ethAccount}=useSelector((state:any)=>{ 
    return {
      ethAccount:state.rETHModule.ethAccount
    }
  })
  useEffect(()=>{ 
    if(ethAccount && ethAccount.address){
      dispatch(handleEthAccount(ethAccount.address));
    }
    dispatch(getAssetBalance());
  },[])
  return  <Content>
    <Tag type="erc" onClick={()=>{
      props.history.push("/rAsset/native")
    }}/>
     {ethAccount?<><DataList /> <CountAmount /></> : <div className="rAsset_content"> 
     <Button icon={metamask} onClick={()=>{
        dispatch(connectMetamask());
        dispatch(monitoring_Method());
      }}>
          Connect to Metamask
      </Button>
    </div>}
    </Content>
}
