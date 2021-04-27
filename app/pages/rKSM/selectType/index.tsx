import React, { useEffect } from 'react';
import {Redirect} from 'react-router'
import {useDispatch, useSelector} from 'react-redux';
import TypeCard from '@components/card/typeCard';
import {getTotalIssuance,rTokenLedger} from '@features/rKSMClice'

export default function Index(props:any){

  const dispatch=useDispatch();
  const {stafiStakerApr,totalRDot,stakerApr,tokenAmount}=useSelector((state:any)=>{
    return { 
      stafiStakerApr:state.globalModule.stafiStakerApr,
      totalRDot:state.rKSMModule.totalRDot,
      stakerApr:state.rKSMModule.stakerApr,
      tokenAmount:state.rKSMModule.tokenAmount,
    }
  })
  useEffect(()=>{
    dispatch(getTotalIssuance());
    dispatch(rTokenLedger())
  },[])

  if(tokenAmount!="--" && tokenAmount!=0){
    return <Redirect to="/rKSM/staker/info" />
  }
  return <TypeCard 
      type="rKSM" 
      stafiStakerApr={stafiStakerApr}
      total={totalRDot}
      apr={stakerApr}
      onClick={(e:string)=>{
        if(e=="Staker"){
          props.history.push("/rKSM/staker")
        }else{
          props.history.push("/rKSM/validator")
        }
  }}/> 
}