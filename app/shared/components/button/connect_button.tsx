import React from 'react';
import {Button} from 'antd';
import rDOT_svg from '@images/rDOT.svg'

import './index.scss';
import { ProgressPlugin } from 'webpack';

type Props={
    icon:any,
    children:any,
    onClick?:Function,
    disabled?:boolean
}
export default function Index(props:Props){
    return <Button disabled={props.disabled} className="stafi_connect_button" onClick={()=>{
        props.onClick && props.onClick();
    }}>
       <img src={props.icon} />  {props.children}
    </Button>
}