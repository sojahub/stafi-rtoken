import React, { useEffect, useState } from 'react'; 
import {useDispatch,useSelector} from 'react-redux'; 
import metamask from '@images/metamask.png'
import Button from '@shared/components/button/connect_button';
import Tag from './components/carTag/index'
import DataList from './components/list'
import Content from '@shared/components/content';
import {connectMetamask,monitoring_Method,handleEthAccount,getAssetBalance} from '@features/rETHClice';
import {getAssetBalance as ksm_getAssetBalance} from '@features/rKSMClice';
import {getAssetBalance as fis_getAssetBalance,getFISAssetBalance} from '@features/FISClice'
import CountAmount from './components/countAmount'; 
import DataItem from './components/list/item';
import NumberUtil from '@util/numberUtil';
import rFIS_svg from '@images/rFIS.svg';
import rETH_svg from '@images/rETH.svg';
import rKSM_svg from '@images/rKSM.svg';
import './page.scss'

 
export default function Index(props:any){ 
 
  const dispatch=useDispatch();

  const {ethAccount,ksm_ercBalance,fis_ercBalance,eth_ercBalance,fis_ercFISBalance}=useSelector((state:any)=>{ 
    return {
      ethAccount:state.rETHModule.ethAccount,
      ksm_ercBalance:state.rKSMModule.ercBalance,
      fis_ercBalance:state.FISModule.ercBalance,
      fis_ercFISBalance:state.FISModule.ercFISBalance,
      eth_ercBalance:state.rETHModule.ercBalance
    }
  })
  useEffect(()=>{ 
    if(ethAccount && ethAccount.address){
      dispatch(handleEthAccount(ethAccount.address));

      dispatch(getAssetBalance());
      dispatch(ksm_getAssetBalance());
      dispatch(fis_getAssetBalance());
      dispatch(getFISAssetBalance());
    }

  },[ethAccount && ethAccount.address])
  return  <Content>
    <Tag type="erc" onClick={()=>{
      props.history.push("/rAsset/native")
    }}/>
     {ethAccount?<><DataList >
      <DataItem 
          rSymbol="rETH"
          icon={rETH_svg}
          fullName="Ethereum" 
          balance={eth_ercBalance=="--" ?"--":NumberUtil.handleFisAmountToFixed(eth_ercBalance)}
          willGetBalance={0}
          unit="ETH"
        />
         <DataItem 
          rSymbol="FIS"
          icon={rFIS_svg}
          fullName="StaFi" 
          balance={fis_ercFISBalance=="--" ?"--":NumberUtil.handleFisAmountToFixed(fis_ercFISBalance)}
          willGetBalance={0}
          unit="FIS"
        />
        <DataItem 
          rSymbol="rFIS"
          icon={rFIS_svg}
          fullName="StaFi" 
          balance={fis_ercBalance=="--" ?"--":NumberUtil.handleFisAmountToFixed(fis_ercBalance)}
          willGetBalance={0}
          unit="FIS"
        />
        <DataItem 
          rSymbol="rKSM"
          icon={rKSM_svg}
          fullName="Kusama"
          balance={ksm_ercBalance=="--" ?"--":NumberUtil.handleFisAmountToFixed(ksm_ercBalance)}
          willGetBalance={0}
          unit="KSM"
        />
       </DataList> <CountAmount /></> : <div className="rAsset_content"> 
     <Button icon={metamask} onClick={()=>{
        dispatch(connectMetamask());
        dispatch(monitoring_Method());
      }}>
          Connect to Metamask
      </Button>
    </div>}
    </Content>
}
