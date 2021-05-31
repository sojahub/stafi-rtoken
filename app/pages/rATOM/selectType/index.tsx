import React, { useEffect } from 'react';
import {Redirect} from 'react-router'
import {useDispatch, useSelector} from 'react-redux';
import TypeCard from '@components/card/typeCard';
import {getTotalIssuance,rTokenLedger} from '@features/rATOMClice'

export default function Index(props:any){

  const dispatch=useDispatch();
  const {totalIssuance,stakerApr,tokenAmount}=useSelector((state:any)=>{
    return {  
      totalIssuance:state.rATOMModule.totalIssuance,
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
      total={totalIssuance}
      apr={stakerApr}
      onClick={(e:string)=>{
        if(e=="Staker"){
          props.history.push("/rATOM/staker")
        }else{
          props.history.push("/rATOM/validator")
        }
  }}/> 
}