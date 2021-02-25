import React from 'react';
import {useSelector} from 'react-redux';
import TypeCard from '@components/card/typeCard'

export default function Index(props:any){

  const {stafiStakerApr}=useSelector((state:any)=>{
    return { 
      stafiStakerApr:state.globalModule.stafiStakerApr
    }
  })
  return <TypeCard 
  type="rDOT" 
  stafiStakerApr={stafiStakerApr}
  onClick={(e:string)=>{
    if(e=="Staker"){
      props.history.push("/rDOT/staker")
    }else{
      props.history.push("/rDOT/validator")
    }
  }}/> 
}