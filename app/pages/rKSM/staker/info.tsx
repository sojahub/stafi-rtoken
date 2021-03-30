import React, { useEffect, useState } from 'react'; 
import {useSelector,useDispatch} from 'react-redux'; 
import { rTokenRate } from '@features/FISClice';
import {query_rBalances_account} from '@features/rKSMClice'
import {rSymbol} from '@keyring/defaults'
import Content from '@components/content/stakeInfoContent'; 


export default function Index(props:any){ 

  const dispatch=useDispatch();
  useEffect(()=>{ 
    dispatch(query_rBalances_account())
    dispatch(rTokenRate(rSymbol.Ksm));
  },[])
 

  const {ratio,tokenAmount,ratioShow} = useSelector((state:any)=>{
    return {
      ratio:state.FISModule.ratio,
      tokenAmount:state.rKSMModule.tokenAmount,
      ratioShow:state.FISModule.ratioShow,
    }
  })
  return  <Content 
  ratio={ratio}
  ratioShow={ratioShow}
  tokenAmount={tokenAmount}
  onStakeClick={()=>{
    props.history.push("/rKSM/staker/index")
  }}
  onRdeemClick={()=>{
    props.history.push("/rKSM/staker/redeem")
  }}
  type="rKSM"></Content>
}