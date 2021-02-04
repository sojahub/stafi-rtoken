import React from 'react';
import {Input} from 'antd';

import './index.scss';

type Props={
    placeholder?:string,
    icon:any,
    unit?:string,
    value?:string | number ,
    onChange?:Function
}
export default function Index(props:Props){
    return <Input 
    className="amount_input" 
    onChange={(e)=>{
        props.onChange && props.onChange(e);
    }}
    value={props.value}
    placeholder={props.placeholder} 
    suffix={<><label className="input_unit">{props.unit}</label><img src={props.icon}/></>}/>
}