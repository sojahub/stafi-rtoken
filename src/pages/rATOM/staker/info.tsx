import React, { useEffect, useState } from 'react'; 
import {useSelector,useDispatch} from 'react-redux';  
import {query_rBalances_account,accountUnbonds,setRatioShow,rTokenRate} from '@features/rATOMClice';
import NumberUtil from '@util/numberUtil'; 
import Content from '@components/content/stakeInfoContent'; 


export default function Index(props:any){ 

  const dispatch=useDispatch();
  useEffect(()=>{ 
    dispatch(query_rBalances_account())
    dispatch(rTokenRate());
    dispatch(accountUnbonds())
  },[])
 

  
  const {ratio,tokenAmount,ratioShow,totalUnbonding} = useSelector((state:any)=>{
    return {
      ratio:state.rATOMModule.ratio,
      tokenAmount:state.rATOMModule.tokenAmount,
      ratioShow:state.rATOMModule.ratioShow,
      totalUnbonding:state.rATOMModule.totalUnbonding
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
    props.history.push("/rATOM/staker/index")
  }}
  onRdeemClick={()=>{
    props.history.push("/rATOM/staker/redeem")
  }}
  onUniswapClick={()=>{
    window.open("")
  }}
  onSwapClick={()=>{
    props.history.push({
      pathname:"/rAsset/swap/native/default",
      state:{ 
        rSymbol:"rATOM", 
      }
    })
  }}
  hours={24}
  type="rATOM"></Content>
}