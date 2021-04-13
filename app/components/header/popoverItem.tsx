import React from 'react';
import {Empty} from 'antd'; 
import { noticesubType } from '@features/noticeClice'

type Props={ 
  data?:any,
  onClick?:Function,
  noData?:boolean
}
export default function Index(props:Props){ 
  if(props.noData){
    return <div className="empty">
        <Empty />
    </div>
  }
  return <div className="popover_item">
  <div className="title">
   {props.data.title}
  </div>
  <div className="context">
  {props.data.content}
  </div>
  <div className="footer">
    <div>
      {props.data.dateTime}
    </div>
    <a className={`${props.data.status} ${props.data.subType}`} onClick={()=>{ 
      props.data.subType==noticesubType.Stake && props.onClick && props.onClick();
    }}>
      {props.data.status}
    </a>
  </div>
</div>
}