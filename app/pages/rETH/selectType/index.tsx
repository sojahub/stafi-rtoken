import React, { useEffect } from 'react';
import {Redirect} from 'react-router'
import {useDispatch, useSelector} from 'react-redux';
import TypeCard from '@components/card/typeCard'; 

export default function Index(props:any){

  const dispatch=useDispatch();
  const {stafiStakerApr,totalStakedAmount,stakerApr,tokenAmount}=useSelector((state:any)=>{
    return { 
      stafiStakerApr:state.globalModule.stafiStakerApr,
      totalStakedAmount:state.rETHModule.totalStakedAmount,
      stakerApr:state.rETHModule.apr,
      tokenAmount:state.rETHModule.balance,
      poolCount:state.rETHModule.poolCount
    }
  }) 

  if(tokenAmount!="--" && tokenAmount!=0){
    return <Redirect to="/rETH/staker/info" />
  }
  return <TypeCard 
      type="rETH" 
      stafiStakerApr={stafiStakerApr}
      total={totalStakedAmount}
      apr={stakerApr}
      onClick={(e:string)=>{
        if(e=="Staker"){
          props.history.push("/rETH/staker")
        }else{
          props.history.push("/rETH/validator/index")
        }
  }}/> 
}