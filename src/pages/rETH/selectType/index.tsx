import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router';
import TypeCard from 'src/components/card/typeCard';

export default function Index(props:any){

  const dispatch=useDispatch();
  const {totalStakedAmount,stakerApr,tokenAmount}=useSelector((state:any)=>{
    return {  
      totalStakedAmount:state.rETHModule.totalStakedAmount,
      stakerApr:state.rETHModule.stakerApr,
      tokenAmount:state.rETHModule.balance,
      poolCount:state.rETHModule.poolCount
    }
  }) 

  if(tokenAmount!="--" && tokenAmount!=0){
    return <Redirect to="/rETH/staker/info" />
  }
  return <TypeCard 
      type="rETH"  
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