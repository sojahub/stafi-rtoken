import React from 'react';
import {Button} from 'antd'; 

import './index.scss';

type Props={
  btnType?:"ellipse"| "square",  //ellipse 椭圆  square 方形
  children:any,
  disabled?:boolean,
  onClick?:Function,
  htmlType?:"button"|"submit"|"reset"
}
export default function Index(props:Props){
    return <Button htmlType={props.htmlType} disabled={props.disabled} onClick={()=>{
      props.onClick && props.onClick();
    }} className={`stafi_button ${props.btnType || "ellipse"}`}>
      {props.children}
    </Button>
}