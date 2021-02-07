import React from 'react'; 
import Content from '@components/content/stakeContent_DOT'; 

export default function Index(props:any){
  console.log(props)
  return  <Content onRecovery={()=>{
    props.history.push("/rDOT/search")
  }}
  onStakeClick={()=>{
    props.history.push("/rDOT/staker/info")
  }}></Content>
}