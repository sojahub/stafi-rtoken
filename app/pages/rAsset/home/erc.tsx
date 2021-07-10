import config from '@config/index';
import { getRtokenPriceList } from '@features/bridgeClice';
import CommonClice from '@features/commonClice';
import { getAssetBalanceAll } from '@features/ETHClice';
import { getUnbondCommission as fis_getUnbondCommission, rTokenRate as fis_rTokenRate } from '@features/FISClice';
import { getUnbondCommission as atom_getUnbondCommission, rTokenRate as atom_rTokenRate } from '@features/rATOMClice';
import { getUnbondCommission as dot_getUnbondCommission, rTokenRate as dot_rTokenRate } from '@features/rDOTClice';
import { connectMetamask, handleEthAccount, monitoring_Method } from '@features/rETHClice';
import { getUnbondCommission as ksm_getUnbondCommission, rTokenRate as ksm_rTokenRate } from '@features/rKSMClice';
import metamask from '@images/metamask.png';
import rasset_fis_svg from '@images/rFIS.svg';
import rasset_ratom_svg from '@images/r_atom.svg';
import rasset_rdot_svg from '@images/r_dot.svg';
import rasset_reth_svg from '@images/r_eth.svg';
import rasset_rfis_svg from '@images/r_fis.svg';
import rasset_rksm_svg from '@images/r_ksm.svg';
import Button from '@shared/components/button/connect_button';
import Content from '@shared/components/content';
import NumberUtil from '@util/numberUtil';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tag from './components/carTag/index';
import CountAmount from './components/countAmount';
import DataList from './components/list';
import DataItem from './components/list/item';
import './page.scss';

const commonClice=new CommonClice();
export default function Index(props:any){ 
 
  const dispatch=useDispatch();

  const {ethAccount,ksm_ercBalance,fis_ercBalance,eth_ercBalance,rfis_ercBalance,dot_ercBalance,atom_ercBalance,
    ksmWillAmount,fisWillAmount,dotWillAmount,unitPriceList,atomWillAmount}=useSelector((state:any)=>{ 
    return {
      unitPriceList:state.bridgeModule.priceList,
      ethAccount:state.rETHModule.ethAccount,
      ksm_ercBalance:state.ETHModule.ercRKSMBalance,
      fis_ercBalance:state.ETHModule.ercFISBalance,
      rfis_ercBalance:state.ETHModule.ercRFISBalance,
      eth_ercBalance:state.ETHModule.ercETHBalance,
      dot_ercBalance:state.ETHModule.ercRDOTBalance,
      atom_ercBalance:state.ETHModule.ercRATOMBalance,
      ksmWillAmount:commonClice.getWillAmount(state.rKSMModule.ratio,state.rKSMModule.unbondCommission,state.ETHModule.ercRKSMBalance),
      fisWillAmount:commonClice.getWillAmount(state.FISModule.ratio,state.FISModule.unbondCommission,state.ETHModule.ercRFISBalance),
      dotWillAmount:commonClice.getWillAmount(state.rDOTModule.ratio,state.rDOTModule.unbondCommission,state.ETHModule.ercRDOTBalance),
      atomWillAmount:commonClice.getWillAmount(state.rATOMModule.ratio,state.rATOMModule.unbondCommission,state.ETHModule.ercRATOMBalance)
    }
  })
  const totalPrice=useMemo(()=>{
    let count:any="--";
    unitPriceList.forEach((item:any) => {
      if(count=="--"){
        count=0;
      }
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
      }else if(item.symbol=="rATOM" && atom_ercBalance && atom_ercBalance!="--"){
        count=count+(item.price*atom_ercBalance);
      }
    });
    return count
  },[unitPriceList,ksm_ercBalance,fis_ercBalance,rfis_ercBalance,eth_ercBalance,dot_ercBalance, atom_ercBalance]);
  useEffect(()=>{ 
    if(ethAccount && ethAccount.address){
      dispatch(handleEthAccount(ethAccount.address));

      dispatch(getAssetBalanceAll()); 

      dispatch(ksm_rTokenRate());
      dispatch(fis_rTokenRate() );
      dispatch(dot_rTokenRate() );
      dispatch(atom_rTokenRate() );
      dispatch(ksm_getUnbondCommission());
      dispatch(fis_getUnbondCommission());
      dispatch(dot_getUnbondCommission());
      dispatch(atom_getUnbondCommission());
    }

  },[ethAccount && ethAccount.address])
  useEffect(()=>{
    dispatch(getRtokenPriceList());
    dispatch(monitoring_Method());
  },[])

  const toSwap = (tokenSymbol: string) => {
    props.history.push({
      pathname: "/rAsset/swap/erc20/native",
      state: {
        rSymbol: tokenSymbol,
      },
    });
  };

  return  <Content>
    <Tag type="erc" onClick={(type:string)=>{
      props.history.push(`/rAsset/${type}`)
    }}/>
     {ethAccount?<><DataList >
      <DataItem 
          rSymbol="FIS"
          icon={rasset_fis_svg}
          fullName="StaFi" 
          balance={fis_ercBalance=="--" ?"--":NumberUtil.handleFisAmountToFixed(fis_ercBalance)}
          willGetBalance={0}
          unit="FIS"
          trade={config.uniswap.fisURL}
          operationType="erc20"
          onSwapClick={()=>toSwap('FIS')}
        />

        <DataItem 
          rSymbol="rFIS"
          icon={rasset_rfis_svg}
          fullName="StaFi" 
          balance={rfis_ercBalance=="--" ?"--":NumberUtil.handleFisAmountToFixed(rfis_ercBalance)}
          willGetBalance={fisWillAmount}
          unit="FIS"
          trade={config.uniswap.rfisURL}
          operationType="erc20"
          onSwapClick={()=>toSwap('rFIS')}
        />
      <DataItem 
          rSymbol="rETH"
          icon={rasset_reth_svg}
          fullName="Ethereum" 
          balance={eth_ercBalance=="--" ?"--":NumberUtil.handleFisAmountToFixed(eth_ercBalance)}
          willGetBalance={"0.000000"}
          unit="ETH"
          operationType="erc20"
          trade={config.uniswap.rethURL}
          onSwapClick={()=>{}}
        />
        <DataItem 
          rSymbol="rDOT"
          icon={rasset_rdot_svg}
          fullName="Polkadot"
          balance={dot_ercBalance=="--" ?"--":NumberUtil.handleFisAmountToFixed(dot_ercBalance)}
          willGetBalance={dotWillAmount}
          unit="DOT"
          trade={config.uniswap.rdotURL}
          operationType="erc20"
          onSwapClick={()=>toSwap('rDOT')}
        />
        
        <DataItem 
          rSymbol="rKSM"
          icon={rasset_rksm_svg}
          fullName="Kusama"
          balance={ksm_ercBalance=="--" ?"--":NumberUtil.handleFisAmountToFixed(ksm_ercBalance)}
          willGetBalance={ksmWillAmount}
          unit="KSM"
          trade={config.uniswap.rksmURL}
          operationType="erc20"
          onSwapClick={()=>toSwap('rKSM')}
        />
         <DataItem 
          rSymbol="rATOM"
          icon={rasset_ratom_svg}
          fullName="Cosmos"
          balance={atom_ercBalance=="--" ?"--":NumberUtil.handleFisAmountToFixed(atom_ercBalance)}
          willGetBalance={atomWillAmount}
          unit="ATOM"
          trade={config.uniswap.ratomURL}
          operationType="erc20"
          onSwapClick={()=>toSwap('rATOM')}
        />
       </DataList> <CountAmount totalValue={totalPrice} /></> : <div className="rAsset_content"> 
     <Button icon={metamask} onClick={()=>{
        dispatch(connectMetamask('0x3'));
        dispatch(monitoring_Method());
      }}>
          Connect to Metamask
      </Button>
    </div>}
    </Content>
}
