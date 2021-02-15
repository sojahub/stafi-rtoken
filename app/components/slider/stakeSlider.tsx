import React, { useState } from 'react';
import Item from './stakeSliderItem'
import './index.scss';


type Props={
  type:string,
  data:any
}
export default function Index(props:Props){
 // const [value,setValue]=useState();

  const click=(e:string)=>{
      //setValue(e);
  }
  return <div className="stafi_stake_sider"> 
          {props.data.map((item:any)=>{
            return <Item text={item.text} selectValue={props.type} key={item.text} child={item.child}  onClick={click}/>
          })}
  </div>
}