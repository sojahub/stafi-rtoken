import React from 'react';
import {Button} from 'antd'; 

import './index.scss';

type Props={ 
  children:any,
  disabled?:boolean,
  onClick?:Function,
  htmlType?:"button"|"submit"|"reset", 
}
export default function Index(props:Props){
    return <Button htmlType={props.htmlType} ghost disabled={props.disabled} onClick={()=>{
      props.onClick && props.onClick();
    }} className={`stafi_ghost_button`}>
      {props.children}
    </Button>
}