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
  ratio={ratio}
  ratioShow={ratioShow}
  tokenAmount={tokenAmount}
  totalUnbonding={totalUnbonding}
  onStakeClick={()=>{
    props.history.push("/rETH/staker/index")
  }}
  onRdeemClick={()=>{
    message.info("Redemption will be available once Phase 1.5 of ETH2 lives.");
  }}
  onUniswapClick={()=>{
    // 
  }}
  hours={8}
  type="rETH"></Content>
}