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
  onConfirm?:Function
}
export default function Index(props:Props){
  const [selected,setSelected]=useState("F1C");
  return <div className="wallet_card">
      <div>
        <label className="title">Select a wallet</label>
        {data.map((item)=>{
          return <Item data={item} key={item.title} selected={item.title==selected} onClick={()=>{
                setSelected(item.title);
          }}/>
        })}  
 
      </div>
      <div className="btn_panel">
         <Button onClick={()=>{
           props.onConfirm && props.onConfirm();
         }}>Confirm</Button>
      </div>
  </div>
}