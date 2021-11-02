import React, { useEffect } from 'react';
import {Redirect} from 'react-router'
import {useDispatch, useSelector} from 'react-redux';
import TypeCard from '@components/card/typeCard';
import {getTotalIssuance,rTokenLedger} from '@features/rDOTClice'

export default function Index(props:any){

  const dispatch=useDispatch();
  const { totalIssuance,stakerApr,tokenAmount}=useSelector((state:any)=>{
    return {  
      totalIssuance:state.rDOTModule.totalIssuance,
      stakerApr:state.rDOTModule.stakerApr,
      tokenAmount:state.rDOTModule.tokenAmount
    }
  })
  useEffect(()=>{
    dispatch(getTotalIssuance());
    dispatch(rTokenLedger())
  },[])

  if(tokenAmount!="--" && tokenAmount!=0){
    return <Redirect to="/rDOT/staker/info" />
  }
  return <TypeCard 
      type="rDOT"  
      total={totalIssuance}
      apr={stakerApr}
      onClick={(e:string)=>{
        if(e=="Staker"){
          props.history.push("/rDOT/staker")
        }else{
          props.history.push("/rDOT/validator")
        }
  }}/> 
}