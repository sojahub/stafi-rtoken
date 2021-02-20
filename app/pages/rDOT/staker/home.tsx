import React, { useState } from 'react'; 
import Content from '@components/content/stakeContent_DOT'; 

export default function Index(props:any){
  console.log(props)
  const [amount,setAmount]=useState();
  return  <Content
  amount={amount}
  onChange={(value:any)=>{
    setAmount(value);
  }}
  onRecovery={()=>{
    props.history.push("/rDOT/search")
  }}
  onStakeClick={()=>{
    props.history.push("/rDOT/staker/info")
  }}></Content>
}