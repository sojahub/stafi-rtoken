import React, { useEffect, useState } from 'react'; 
import {useSelector,useDispatch} from 'react-redux';  
import {setRatioShow,getRethAmount} from '@features/rETHClice'
import Content from '@components/content/stakeInfoContent'; 
import NumberUtil from '@util/numberUtil';
import { message } from 'antd';


export default function Index(props:any){ 

  const dispatch=useDispatch();
  useEffect(()=>{ 
    dispatch(getRethAmount());
  },[])
 

  const {ratio,tokenAmount,ratioShow,totalUnbonding} = useSelector((state:any)=>{
    return {
      ratio:state.rETHModule.ratio, 
      ratioShow:state.rETHModule.ratioShow, 
      tokenAmount:state.rETHModule.rethAmount,

      totalUnbonding:state.rDOTModule.totalUnbonding
    }
  }) 

  useEffect(()=>{
    
    let count = 0;
    let totalCount = 10;
    let ratioAmount = 0;
    let piece = ratio / totalCount;
  
    if(ratio!="--"){
      let interval = setInterval(() => {
        count++;
        ratioAmount += piece;
        if (count == totalCount) {
          ratioAmount = ratio;
          window.clearInterval(interval);
        }
        dispatch(setRatioShow(NumberUtil.handleFisAmountRateToFixed(ratioAmount)))
      }, 100);
    }
  },[ratio])
  return  <Content 
  ratio={NumberUtil.handleEthAmountRateToFixed(ratio)}
  ratioShow={ratioShow}
  tokenAmount={tokenAmount}
  totalUnbonding={totalUnbonding}
  onStakeClick={()=>{
    props.history.push("/rETH/staker/index")
  }}
  onRdeemClick={()=>{
    message.info("Redeem Function will be supported once ETH2.0 Phase 1.5 is released");
  }}
  onUniswapClick={()=>{
    // 
  }}
  hours={8}
  type="rETH"></Content>
}