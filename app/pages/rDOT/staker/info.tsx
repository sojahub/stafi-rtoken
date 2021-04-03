import React, { useEffect, useState } from 'react'; 
import {useSelector,useDispatch} from 'react-redux'; 
import { rTokenRate } from '@features/FISClice';
import {query_rBalances_account,accountUnbonds} from '@features/rDOTClice'
import {rSymbol} from '@keyring/defaults'
import Content from '@components/content/stakeInfoContent'; 


export default function Index(props:any){ 

  const dispatch=useDispatch();
  useEffect(()=>{ 
    dispatch(query_rBalances_account())
    dispatch(rTokenRate(rSymbol.Dot));
    dispatch(accountUnbonds())
  },[])
 

  const {ratio,tokenAmount,ratioShow,totalUnbonding} = useSelector((state:any)=>{
    return {
      ratio:state.FISModule.ratio,
      tokenAmount:state.rDOTModule.tokenAmount,
      ratioShow:state.FISModule.ratioShow,
      totalUnbonding:state.rDOTModule.totalUnbonding
    }
  })
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
  type="rDOT"></Content>
}