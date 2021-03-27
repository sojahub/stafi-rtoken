import React, { useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import TypeCard from '@components/card/typeCard';
import {totalIssuance,rTokenLedger} from '@features/rDOTClice'

export default function Index(props:any){

  const dispatch=useDispatch();
  const {stafiStakerApr,totalRDot,stakerApr}=useSelector((state:any)=>{
    return { 
      stafiStakerApr:state.globalModule.stafiStakerApr,
      totalRDot:state.rDOTModule.totalRDot,
      stakerApr:state.rDOTModule.stakerApr
    }
  })
  useEffect(()=>{
    dispatch(totalIssuance());
    dispatch(rTokenLedger())
  },[])
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