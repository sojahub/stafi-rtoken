import React, { useEffect } from 'react';
import {Redirect} from 'react-router'
import {useDispatch, useSelector} from 'react-redux';
import TypeCard from '@components/card/typeCard';
import {totalIssuance,rTokenLedger} from '@features/rDOTClice'

export default function Index(props:any){

  const dispatch=useDispatch();
  const {stafiStakerApr,totalRDot,stakerApr,tokenAmount}=useSelector((state:any)=>{
    return { 
      stafiStakerApr:state.globalModule.stafiStakerApr,
      totalRDot:state.rDOTModule.totalRDot,
      stakerApr:state.rDOTModule.stakerApr,
      tokenAmount:state.rDOTModule.tokenAmount
    }
  })
  useEffect(()=>{
    dispatch(totalIssuance());
    dispatch(rTokenLedger())
  },[])

  if(tokenAmount!="--" && tokenAmount!=0){
    return <Redirect to="/rDOT/staker/info" />
  }
  return <TypeCard 
      type="rDOT" 
      stafiStakerApr={stafiStakerApr}
      total={totalRDot}
      apr={stakerApr}
      onClick={(e:string)=>{
        if(e=="Staker"){
          props.history.push("/rDOT/staker")
        }else{
          props.history.push("/rDOT/validator")
        }
  }}/> 
}