import React, { useEffect, useState } from 'react'; 
import {useSelector,useDispatch} from 'react-redux'; 
import { rTokenRate } from '@features/rDOTClice';
import {query_rBalances_account,accountUnbonds,setRatioShow} from '@features/rDOTClice'
import {rSymbol} from '@keyring/defaults'
import Content from '@components/content/stakeInfoContent'; 
import NumberUtil from '@util/numberUtil';


export default function Index(props:any){ 

  const dispatch=useDispatch();
  useEffect(()=>{ 
    dispatch(query_rBalances_account())
    dispatch(rTokenRate());
    dispatch(accountUnbonds())
  },[])
 

  const {ratio,tokenAmount,ratioShow,totalUnbonding} = useSelector((state:any)=>{
    return {
      ratio:state.rDOTModule.ratio,
      tokenAmount:state.rDOTModule.tokenAmount,
      ratioShow:state.rDOTModule.ratioShow,
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
    props.history.push("/rDOT/staker/index")
  }}
  onRdeemClick={()=>{
    props.history.push("/rDOT/staker/redeem")
  }}
  onSwapClick={()=>{
    props.history.push({
      pathname:"/rAsset/swap/native",
      state:{ 
        rSymbol:"rDOT", 
      }
    })
  }}
  type="rDOT"></Content>
}