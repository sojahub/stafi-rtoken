import React, { useState } from 'react';
import {Input, message} from 'antd'
import A from '@shared/components/button/a';

type Props={
  value:string,
  onInputChange?:Function,
  onEdit:Function
}

export default function Index(props:Props){
  const [showEdit,setShowEdit]=useState(false);
  return <div className="stafi_editAddressINput">
        {showEdit?<div className={"stafi_show_address"}>
          <Input 
          value={props.value}
          onChange={(e)=>{ 
            
            props.onInputChange && props.onInputChange(e.target.value);
         
          }}
          />
          <A onClick={()=>{ 
            if(props.value){
              if(props.onEdit(false)){
                setShowEdit(false);
              }
              // props.onEdit && props.onEdit(false);
            }else{
              message.error("pieas fill in your withdraw address")
            }
          }}>confirm</A>
        </div>:<div className={"stafi_show_address"}>
          <label>{props.value}</label>
          <A onClick={()=>{
            setShowEdit(true);
            props.onEdit && props.onEdit(true);
          }}>Edit</A>
        </div> } 
  </div>
}