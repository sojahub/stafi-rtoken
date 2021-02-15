import React from 'react';
import './index.scss'

type Props={
    icon?:any,
    selectedIcon?:any,
    onClick?:Function,
    selected?:boolean;
    text:string;
}
export default function Index(props:Props){
    return <div onClick={()=>{
        props.onClick && props.onClick();
    }} className={`sider_item ${props.selected?'selected':''}`}>
        <img src={props.selected?props.selectedIcon:props.icon}/> {props.text}
    </div>
}