import React from 'react';
 
type Props={
  children:any,
  onClick?:Function,
  bold?:boolean,
  underline?:boolean
}
export default function Index(props:Props){
  return <a className={`stafi_a ${props.bold && 'bold'} ${props.underline && "underline"}`}  onClick={()=>{
    props.onClick && props.onClick()
  }}>
    {props.children}
  </a>
}