import React, { useEffect } from 'react';
import {Redirect} from 'react-router'
import {useDispatch, useSelector} from 'react-redux';
import TypeCard from '@components/card/typeCard';
import {getTotalIssuance,rTokenLedger} from '@features/rATOMClice'

export default function Index(props:any){

  const dispatch=useDispatch();
  const {stafiStakerApr,totalRDot,stakerApr,tokenAmount}=useSelector((state:any)=>{
    return { 
      stafiStakerApr:state.globalModule.stafiStakerApr,
      totalRDot:state.rATOMModule.totalRDot,
      stakerApr:state.rATOMModule.stakerApr,
      tokenAmount:state.rATOMModule.tokenAmount,
    }
  })
  useEffect(()=>{
    dispatch(getTotalIssuance());
    dispatch(rTokenLedger())
  },[])

  if(tokenAmount!="--" && tokenAmount!=0){
    return <Redirect to="/rATOM/staker/info" />
  }
  return <TypeCard 
      type="rATOM" 
      stafiStakerApr={stafiStakerApr}
      total={totalRDot}
      apr={stakerApr}
      onClick={(e:string)=>{
        if(e=="Staker"){
          props.history.push("/rATOM/staker")
        }else{
          props.history.push("/rATOM/validator")
        }
  }}/> 
}