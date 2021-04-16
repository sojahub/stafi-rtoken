import React, { useEffect, useState } from 'react'; 
import {useSelector,useDispatch} from 'react-redux'; 
import { rTokenRate } from '@features/rKSMClice';
import {query_rBalances_account,accountUnbonds} from '@features/rKSMClice'
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
  type="rKSM"></Content>
}