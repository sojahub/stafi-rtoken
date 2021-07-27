import React, { useEffect, useState } from 'react'; 
import {useSelector,useDispatch} from 'react-redux';  
import {query_rBalances_account,setRatioShow,rTokenRate,RefreshUnbonding} from '@features/FISClice'
import Content from '@components/content/stakeInfoContent'; 
import NumberUtil from '@util/numberUtil'; 
import { RootState } from 'app/store';


export default function Index(props:any){ 

  const dispatch=useDispatch();
  useEffect(()=>{ 
    dispatch(RefreshUnbonding());
    dispatch(query_rBalances_account())
    dispatch(rTokenRate()); 
  },[])
 

  const {ratio,tokenAmount,ratioShow,totalUnbonding,validPools,} = useSelector((state:any)=>{
    return {
      ratio:state.FISModule.ratio,
      tokenAmount:state.FISModule.tokenAmount,
      ratioShow:state.FISModule.ratioShow,
      totalUnbonding:state.FISModule.unbondingToken,
      validPools:state.FISModule.validPools, 
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
    props.history.push("/rFIS/staker/index")
  }}
  onRdeemClick={()=>{
    props.history.push("/rFIS/staker/redeem")
  }}
  onUniswapClick={()=>{
    // 
  }}
  onSwapClick={()=>{
    props.history.push({
      pathname:"/rAsset/swap/native/default",
      state:{ 
        rSymbol:"rFIS", 
      }
    })
  }}
  hours={6}
  type="rFIS"></Content>
}