import React, { useEffect } from 'react'; 
import {Redirect} from 'react-router'
import {useDispatch, useSelector} from 'react-redux';
import TypeCard from '@components/card/typeCard'; 
import { RootState } from 'app/store';
import {getTotalIssuance} from '@features/FISClice';
import { fetchStafiStakerApr } from '@features/globalClice'; 

export default function Index(props:any){

  const dispatch=useDispatch();
  const { totalIssuance,stakerApr,tokenAmount}=useSelector((state:RootState)=>{
    return {  
      totalIssuance:state.FISModule.totalIssuance,
      stakerApr:state.globalModule.stafiStakerApr,
      tokenAmount:state.FISModule.tokenAmount
    }
  })
 
  useEffect(()=>{
    dispatch(getTotalIssuance());
    dispatch(fetchStafiStakerApr())
  },[])

  if(tokenAmount!="--" && Number(tokenAmount)!=0){
    return <Redirect to="/rFIS/staker/info" />
  }
  return <TypeCard 
      type="rFIS"  
      total={totalIssuance}
      apr={stakerApr}
      onClick={(e:string)=>{
        if(e=="Staker"){
          props.history.push("/rFIS/staker")
        }else{
          props.history.push("/rFIS/validator")
        }
  }}/> 
}