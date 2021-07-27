import { Input, message } from 'antd';
import React from 'react';
import './index.scss';


type Props={
    placeholder?:string,
    icon?:any,
    unit?:string,
    value?:string | number ,
    onChange?:Function,
    maxInput?:string | number,
    disabled?:boolean
}
export default function Index(props:Props){
    return <Input 
    className="amount_input" 
    disabled={props.disabled}
    onChange={(e)=>{   
        let value = e.target.value.replace(/[^\d\.]/g,""); 
        value = value.replace(/^\./g,"");         
        value = value.replace(/\.{2,}/g,".");     
        value = value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
        value = value.replace(/^(\-)*(\d+)\.(\d\d\d\d\d\d).*$/,'$1$2.$3');  
        if(Number(value)>Number(props.maxInput)){ 
            message.error("The input amount exceeds your transferrable balance");
            props.onChange && props.onChange("");
        }else{
            props.onChange && props.onChange(value);
        }
     
    }}
    value={props.value}
    placeholder={props.placeholder} 
    suffix={props.icon?<><label className="input_unit">{props.unit}</label><img src={props.icon}/></>:null}/>
}