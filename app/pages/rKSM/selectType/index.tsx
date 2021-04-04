import React, { useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import TypeCard from '@components/card/typeCard';
import {totalIssuance,rTokenLedger} from '@features/rKSMClice'

export default function Index(props:any){

  const dispatch=useDispatch();
  const {stafiStakerApr,totalRDot,stakerApr}=useSelector((state:any)=>{
    return { 
      stafiStakerApr:state.globalModule.stafiStakerApr,
      totalRDot:state.rKSMModule.totalRDot,
      stakerApr:state.rKSMModule.stakerApr
    }
  })
  useEffect(()=>{
    dispatch(totalIssuance());
    dispatch(rTokenLedger())
  },[])
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