import React from 'react';
import {Button} from 'antd'; 

import './index.scss';

type Props={
  btnType?:"ellipse"| "square",  //ellipse 椭圆  square 方形
  children:any,
  disabled?:boolean,
  onClick?:Function,
  htmlType?:string
}
export default function Index(props:Props){
    return <Button disabled={props.disabled} onClick={()=>{
      props.onClick && props.onClick();
    }} className={`stafi_button ${props.btnType || "ellipse"}`}>
      {props.children}
    </Button>
}