import React from 'react';
 
type Props={
  children:any,
  onClick?:Function,
  bold?:boolean,
}
export default function Index(props:Props){
  return <a className={`stafi_a ${props.bold && 'bold'}`}  onClick={()=>{
    props.onClick && props.onClick()
  }}>
    {props.children}
  </a>
}