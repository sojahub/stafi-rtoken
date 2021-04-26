import React, { useEffect, useState,useMemo } from 'react'; 
import {useDispatch,useSelector} from 'react-redux'; 
import metamask from '@images/metamask.png'
import Button from '@shared/components/button/connect_button';
import Tag from './components/carTag/index'
import DataList from './components/list'
import Content from '@shared/components/content';
import {connectMetamask,monitoring_Method,handleEthAccount} from '@features/rETHClice';
import {getAssetBalanceAll} from '@features/ETHClice';
import {rTokenRate as ksm_rTokenRate,getUnbondCommission as ksm_getUnbondCommission} from '@features/rKSMClice';
import {rTokenRate as dot_rTokenRate,getUnbondCommission as dot_getUnbondCommission} from '@features/rDOTClice'
import {rTokenRate as fis_rTokenRate,getUnbondCommission as fis_getUnbondCommission} from '@features/FISClice'
import CommonClice from '@features/commonClice';
import CountAmount from './components/countAmount'; 
import DataItem from './components/list/item';
import NumberUtil from '@util/numberUtil';
import rasset_fis_svg from '@images/rFIS.svg';
import rasset_rfis_svg from '@images/rasset_rfis.svg'; 
import rasset_reth_svg from '@images/rasset_reth.svg'; 
import rasset_rksm_svg from '@images/rasset_rksm.svg'; 
import rasset_rdot_svg from '@images/rasset_rdot.svg'; 
import {getRtokenPriceList} from '@features/bridgeClice'
import './page.scss'

const commonClice=new CommonClice();
export default function Index(props:any){ 
 
  const dispatch=useDispatch();

  const {ethAccount,ksm_ercBalance,fis_ercBalance,eth_ercBalance,rfis_ercBalance,dot_ercBalance,
    ksmWillAmount,fisWillAmount,dotWillAmount,unitPriceList}=useSelector((state:any)=>{ 
    return {
      unitPriceList:state.bridgeModule.priceList,
      ethAccount:state.rETHModule.ethAccount,
      ksm_ercBalance:state.ETHModule.ercRKSMBalance,
      fis_ercBalance:state.ETHModule.ercFISBalance,
      rfis_ercBalance:state.ETHModule.ercRFISBalance,
      eth_ercBalance:state.ETHModule.ercETHBalance,
      dot_ercBalance:state.ETHModule.ercRDOTBalance,
      ksmWillAmount:commonClice.getWillAmount(state.rKSMModule.ratio,state.rKSMModule.unbondCommission,state.ETHModule.ercRKSMBalance),
      fisWillAmount:commonClice.getWillAmount(state.FISModule.ratio,state.FISModule.unbondCommission,state.ETHModule.ercRFISBalance),
      dotWillAmount:commonClice.getWillAmount(state.rDOTModule.ratio,state.rDOTModule.unbondCommission,state.ETHModule.ercRDOTBalance)
    }
  })
  const totalPrice=useMemo(()=>{
    let count=0;
    unitPriceList.forEach((item:any) => {
      if(item.symbol=="rFIS" && rfis_ercBalance && rfis_ercBalance!="--"){
        count=count+(item.price*rfis_ercBalance);
      }else if(item.symbol=="FIS" && fis_ercBalance && fis_ercBalance!="--"){
        count=count+(item.price*fis_ercBalance);
      }else if(item.symbol=="rKSM" && ksm_ercBalance && ksm_ercBalance!="--"){
        count=count+(item.price*ksm_ercBalance);
      }else if(item.symbol=="rDOT" && dot_ercBalance && dot_ercBalance!="--"){
        count=count+(item.price*dot_ercBalance);
      }else if(item.symbol=="rETH" && eth_ercBalance && eth_ercBalance!="--"){
        count=count+(item.price*eth_ercBalance);
      }
    });
    return count
  },[ksm_ercBalance,fis_ercBalance,rfis_ercBalance,eth_ercBalance,dot_ercBalance]);
  useEffect(()=>{ 
    if(ethAccount && ethAccount.address){
      dispatch(handleEthAccount(ethAccount.address));

      dispatch(getAssetBalanceAll()); 

      dispatch(ksm_rTokenRate());
      dispatch(fis_rTokenRate() );
      dispatch(dot_rTokenRate() );
      dispatch(ksm_getUnbondCommission());
      dispatch(fis_getUnbondCommission());
      dispatch(dot_getUnbondCommission());
    }

  },[ethAccount && ethAccount.address])
  useEffect(()=>{
    dispatch(getRtokenPriceList());
  },[])
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
          willGetBalance={fisWillAmount}
          unit="FIS"
          trade={`https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xc82eb6dea0c93edb8b697b89ad1b13d19469d635`}
          operationType="erc20"
          onSwapClick={()=>{
            props.history.push({
              pathname:"/rAsset/swap/erc20",
              state:{ 
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
          willGetBalance={"0.000000"}
          unit="ETH"
          operationType="erc20"
          trade={`https://app.uniswap.org/#/swap?inputCurrency=0x9559aaa82d9649c7a7b220e7c461d2e74c9a3593&outputCurrency=ETH`}
          onSwapClick={()=>{
            props.history.push({
              pathname:"/rAsset/swap/native/erc20",
              state:{ 
                rSymbol:"rETH"
              }
            })
          }}
        />
        <DataItem 
          rSymbol="rDOT"
          icon={rasset_rdot_svg}
          fullName="Polkadot"
          balance={dot_ercBalance=="--" ?"--":NumberUtil.handleFisAmountToFixed(dot_ercBalance)}
          willGetBalance={dotWillAmount}
          unit="DOT"
          operationType="erc20"
          onSwapClick={()=>{
            props.history.push({
              pathname:"/rAsset/swap/erc20",
              state:{ 
                rSymbol:"rDOT"
              }
            })
          }}
        />
        
        <DataItem 
          rSymbol="rKSM"
          icon={rasset_rksm_svg}
          fullName="Kusama"
          balance={ksm_ercBalance=="--" ?"--":NumberUtil.handleFisAmountToFixed(ksm_ercBalance)}
          willGetBalance={ksmWillAmount}
          unit="KSM"
          operationType="erc20"
          onSwapClick={()=>{
            props.history.push({
              pathname:"/rAsset/swap/erc20",
              state:{ 
                rSymbol:"rKSM"
              }
            })
          }}
        />
       </DataList> <CountAmount totalValue={totalPrice} /></> : <div className="rAsset_content"> 
     <Button icon={metamask} onClick={()=>{
        dispatch(connectMetamask());
        dispatch(monitoring_Method());
      }}>
          Connect to Metamask
      </Button>
    </div>}
    </Content>
}
