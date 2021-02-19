import React, { useState } from 'react';
import Item from './walletCardItem';
import Button from '../button/button'
import './index.scss';

const data=[
  {
    title:"F1C",
    address:'34nSuoNtTiA44WRnbuPGYw5Br6JSGdPsoDbZBzpVhh6RcEDS',
    money:'29.345'
  },
  {
    title:"StaFi1",
    address:'34nSuoNtTiA44WRnbuPGYw5Br6JSGdPsoDbZBzpVhh6RcEDS',
    money:'29.345'
  },
  {
    title:"StaFi2",
    address:'34nSuoNtTiA44WRnbuPGYw5Br6JSGdPsoDbZBzpVhh6RcEDS',
    money:'29.345'
  }
]

type Props={
  onConfirm?:Function,
  children?:any
}
export default function Index(props:Props){ 
  return <div className="wallet_card">
      <div>
        <label className="title">Select a wallet</label> 
        {props.children}
      </div>
      <div className="btn_panel">
         <Button onClick={()=>{
           props.onConfirm && props.onConfirm();
         }}>Confirm</Button>
      </div>
  </div>
}