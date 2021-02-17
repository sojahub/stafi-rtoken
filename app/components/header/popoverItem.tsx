import React from 'react';

type Props={
  title:string,
  content:string,
  time:string,
  status?:string,
  onClick?:Function
}
export default function Index(props:Props){
  return <div className="popover_item">
  <div className="title">
   {props.title}
  </div>
  <div className="context">
  {props.content}
  </div>
  <div className="footer">
    <div>
      {props.time}
    </div>
    <a onClick={()=>{
      props.onClick && props.onClick();
    }}>
      Confirmed
    </a>
  </div>
</div>
}