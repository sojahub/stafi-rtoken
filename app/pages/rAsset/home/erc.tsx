import React, { useEffect, useState } from 'react'; 
import {useDispatch,useSelector} from 'react-redux'; 
import metamask from '@images/metamask.png'
import Button from '@shared/components/button/connect_button';
import Tag from './components/carTag/index'
import DataList from './components/list'
import Content from '@shared/components/content';
import {connectMetamask,monitoring_Method,handleEthAccount} from '@features/rETHClice';
import {getAssetBalanceAll} from '@features/ETHClice';
import CountAmount from './components/countAmount'; 
import DataItem from './components/list/item';
import NumberUtil from '@util/numberUtil';
import rasset_fis_svg from '@images/rFIS.svg';
import rasset_rfis_svg from '@images/rasset_rfis.svg'; 
import rasset_reth_svg from '@images/rasset_reth.svg'; 
import rasset_rksm_svg from '@images/rasset_rksm.svg'; 
import './page.scss'

 
export default function Index(props:any){ 
 
  const dispatch=useDispatch();

  const {ethAccount,ksm_ercBalance,fis_ercBalance,eth_ercBalance,rfis_ercBalance}=useSelector((state:any)=>{ 
    return {
      ethAccount:state.rETHModule.ethAccount,
      ksm_ercBalance:state.ETHModule.ercRKSMBalance,
      fis_ercBalance:state.ETHModule.ercFISBalance,
      rfis_ercBalance:state.ETHModule.ercRFISBalance,
      eth_ercBalance:state.ETHModule.ercETHBalance
    }
  })
  useEffect(()=>{ 
    if(ethAccount && ethAccount.address){
      dispatch(handleEthAccount(ethAccount.address));

      dispatch(getAssetBalanceAll()); 
    }

  },[ethAccount && ethAccount.address])
  return  <Content>
    <Tag type="erc" onClick={()=>{
      props.history.push("/rAsset/native")
    }}/>
     {ethAccount?<><DataList >
      <DataItem 
          rSymbol="FIS"
          icon={rasset_fis_svg}
          fullName="StaFi" 
          balance={fis_ercBalance=="--" ?"--":NumberUtil.handleFisAmountToFixed(fis_ercBalance)}
          willGetBalance={0}
          unit="FIS"
          trade={`https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xef3a930e1ffffacd2fc13434ac81bd278b0ecc8d`}
          operationType="erc20"
          onSwapClick={()=>{
            props.history.push({
              pathname:"/rAsset/swap/erc20",
              state:{
                type:"erc20",
                rSymbol:"FIS"
              }
            })
          }}
        />

<DataItem 
          rSymbol="rFIS"
          icon={rasset_rfis_svg}
          fullName="StaFi" 
          balance={rfis_ercBalance=="--" ?"--":NumberUtil.handleFisAmountToFixed(rfis_ercBalance)}
          willGetBalance={0}
          unit="FIS"
          trade={`https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xc82eb6dea0c93edb8b697b89ad1b13d19469d635`}
          operationType="erc20"
          onSwapClick={()=>{
            props.history.push({
              pathname:"/rAsset/swap/erc20",
              state:{
                type:"erc20",
                rSymbol:"rFIS"
              }
            })
          }}
        />
      <DataItem 
          rSymbol="rETH"
          icon={rasset_reth_svg}
          fullName="Ethereum" 
          balance={eth_ercBalance=="--" ?"--":NumberUtil.handleFisAmountToFixed(eth_ercBalance)}
          willGetBalance={0}
          unit="ETH"
          operationType="erc20"
          trade={`https://app.uniswap.org/#/swap?inputCurrency=0x9559aaa82d9649c7a7b220e7c461d2e74c9a3593&outputCurrency=ETH`}
          onSwapClick={()=>{
            props.history.push({
              pathname:"/rAsset/swap/native/erc20",
              state:{
                type:"erc20",
                rSymbol:"rETH"
              }
            })
          }}
        />
         
        
        <DataItem 
          rSymbol="rKSM"
          icon={rasset_rksm_svg}
          fullName="Kusama"
          balance={ksm_ercBalance=="--" ?"--":NumberUtil.handleFisAmountToFixed(ksm_ercBalance)}
          willGetBalance={0}
          unit="KSM"
          operationType="erc20"
          onSwapClick={()=>{
            props.history.push({
              pathname:"/rAsset/swap/erc20",
              state:{
                type:"erc20",
                rSymbol:"rKSM"
              }
            })
          }}
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
