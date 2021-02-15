import React, { useState } from 'react';

type Props={
  text:string,
  onClick?:Function,
  child?:{
    text:string
  }[],
  selectValue?:string
}
export default function Index(props:Props){

  const [showChild,setShowChild]=useState(false);
  const active=()=>{
    if(props.text==props.selectValue){
      return true
    }
    if(props.child){
      const has=props.child.filter(item=>{
        return item.text==props.selectValue
      })
      if(has && has.length>0){
        return true;
      }
    }
    return false
  }
  return <div className= {`sider_item ${active() && 'active'}`} onClick={()=>{
    if(props.child){
      setShowChild(!showChild);
    }else{
      props.onClick && props.onClick(props.text);
    }
  }}>
    {props.text}
    {(showChild && props.child) && props.child.map((item)=>{
      return <div className={`sub_item ${props.selectValue==item.text && 'sub_active'}`} key={item.text} onClick={(e)=>{
        e.stopPropagation();
        props.onClick && props.onClick(item.text);
      }}>
          {item.text}
      </div>
    })}
  </div>
}

