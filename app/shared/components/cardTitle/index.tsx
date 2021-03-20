import React from 'react';
import './index.scss'
type Props={
  label:string
}
export default function Index(props:Props){
  return <div className="stafi_card_title">
    {props.label}
  </div>
}