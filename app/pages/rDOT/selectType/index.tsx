import React from 'react';
import TypeCard from '@components/card/typeCard'

export default function Index(props:any){
  return <TypeCard type="rDOT" onClick={(e:string)=>{
    if(e=="Staker"){
      props.history.push("/rDOT/staker")
    }else{
      props.history.push("/rDOT/validator")
    }
  }}/> 
}