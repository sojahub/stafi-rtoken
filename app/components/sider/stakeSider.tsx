import React, { useState } from 'react';
import Item from './stakeSiderItem'
import './index.scss';

const data=[{
  text:"Staker",
},{
  text:"Validator",
  child:[
    {
      text:'-OV'
    },
    {
      text:'-SSV'
    }
  ]
}]
export default function Index(){
  const [value,setValue]=useState("Staker");

  const click=(e:string)=>{
      setValue(e);
  }
  return <div className="stafi_stake_sider"> 
          {data.map((item)=>{
            return <Item text={item.text} selectValue={value} key={item.text} child={item.child}  onClick={click}/>
          })}
  </div>
}