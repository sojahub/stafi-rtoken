import React from 'react';
import {Input} from 'antd'; 
import selected_rDOT_svg from '@images/selected_rDOT.svg';
import bottom_arrow from '@images/bottom_arrow.svg';
import leftArrowSvg from '@images/left_arrow.svg';
import './index.scss';

type Props={
    placeholder?:string, 
    unit?:string,
    value?:string | number ,
    onChange?:Function
}
export default function Index(props:Props){
    return <Input 
    className="amount_input type_input" 
    onChange={(e)=>{  
        let value:any = e.target.value.replace(/[^\d\.]/g,'')
        props.onChange && props.onChange(value);
    }}
    value={props.value}
    placeholder={props.placeholder} 
    suffix={<div><img src={selected_rDOT_svg} />rFIS <img src={leftArrowSvg} /></div>}/>
}

{/* <Popover placement="bottomRight" title={text} content={content} trigger="click">
        <Button>BR</Button>
      </Popover> */}