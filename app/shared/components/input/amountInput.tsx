import React from 'react';
import {Input} from 'antd';
import {regular,parseInterge} from '@util/utils'

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
        let value = e.target.value.replace(/[^\d\.]/g,""); //清除"数字"和"."以外的字符 
        value = value.replace(/^\./g,""); //验证第一个字符是数字而不是字符          
        value = value.replace(/\.{2,}/g,"."); //只保留第一个.清除多余的       
        value = value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
        value = value.replace(/^(\-)*(\d+)\.(\d\d\d\d\d\d).*$/,'$1$2.$3'); //只能输入两个小数 
        props.onChange && props.onChange(value);
    }}
    value={props.value}
    placeholder={props.placeholder} 
    suffix={<><label className="input_unit">{props.unit}</label><img src={props.icon}/></>}/>
}