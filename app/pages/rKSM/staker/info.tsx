import React, { useEffect, useState } from 'react'; 
import {useSelector,useDispatch} from 'react-redux'; 
import { rTokenRate } from '@features/rKSMClice';
import {query_rBalances_account,accountUnbonds,setRatioShow} from '@features/rKSMClice';
import NumberUtil from '@util/numberUtil';
import {rSymbol} from '@keyring/defaults'
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
      ratio:state.rKSMModule.ratio,
      tokenAmount:state.rKSMModule.tokenAmount,
      ratioShow:state.rKSMModule.ratioShow,
      totalUnbonding:state.rKSMModule.totalUnbonding
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
    props.history.push("/rKSM/staker/index")
  }}
  onRdeemClick={()=>{
    props.history.push("/rKSM/staker/redeem")
  }}
  onSwapClick={()=>{
    props.history.push({
      pathname:"/rAsset/swap/native",
      state:{ 
        rSymbol:"rKSM", 
      }
    })
  }}
  type="rKSM"></Content>
}