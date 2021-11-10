import React from 'react';
import './index.scss';

type Props={
  children:any
}
export default function Index(props:Props){
  return <div className="stafi_stake_card">
    {props.children}
  </div>
}