import React, { useEffect } from 'react';
import {Redirect} from 'react-router'
import {useDispatch, useSelector} from 'react-redux';
import TypeCard from '@components/card/typeCard';
import {getTotalIssuance,rTokenLedger} from '@features/rMaticClice'

export default function Index(props:any){

  const dispatch=useDispatch();
  const {totalIssuance,stakerApr,tokenAmount}=useSelector((state:any)=>{
    return {  
      totalIssuance:state.rMaticModule.totalIssuance,
      stakerApr:state.rMaticModule.stakerApr,
      tokenAmount:state.rMaticModule.tokenAmount,
    }
  })
  useEffect(()=>{
    dispatch(getTotalIssuance());
    dispatch(rTokenLedger())
  },[])

  if(tokenAmount!="--" && tokenAmount!=0){
    return <Redirect to="/rMatic/staker/info" />
  }
  return <TypeCard 
      type="rMATIC"  
      total={totalIssuance}
      apr={stakerApr}
      onClick={(e:string)=>{
        if(e=="Staker"){
          props.history.push("/rMatic/staker")
        }else{
          props.history.push("/rMatic/validator")
        }
  }}/> 
}