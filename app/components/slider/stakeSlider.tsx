import React, { useState } from 'react';
import Item from './stakeSliderItem'
import './index.scss';


type Props={
  type:string,
  data:any,
  history?:any
}
export default function Index(props:Props){
 // const [value,setValue]=useState();

  const click=(e:string)=>{ 
      if(e=="Staker"){
        props.history.push("/rDOT/staker/index")
      }else if(e=="Validator"){
        props.history.push("/rDOT/validator")
      }
  }
  return <div className="stafi_stake_sider"> 
          {props.data.map((item:any)=>{
            return <Item text={item.text} selectValue={props.type} key={item.text} child={item.child}  onClick={click}/>
          })}
  </div>
}