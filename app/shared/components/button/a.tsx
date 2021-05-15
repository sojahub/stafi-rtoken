import React from 'react';
 
type Props={
  children:any,
  onClick?:Function,
  bold?:boolean,
  underline?:boolean,
  isGrey?:boolean
}
export default function Index(props:Props){
  return <a className={`stafi_a  ${props.isGrey && 'grey'}  ${props.bold && 'bold'} ${props.underline && "underline"}`}  onClick={()=>{
    props.onClick && props.onClick()
  }}>
    {props.children}
  </a>
}