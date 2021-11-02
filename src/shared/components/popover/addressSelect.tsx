import React from 'react';
import {Popover} from 'antd'
import './addressSelect.scss';
type Props={
    children:any,
    datas?:any[],
    data?:string
    onClick?:Function
}
export default function Index(props:Props){
    return <Popover overlayClassName={"stafi_popover_addressSelect"}  content={<div>
        {
            props.datas && props.datas.map((item)=>{
                return  <div onClick={()=>{ 
                    item!=props.data && props.onClick && props.onClick(item);
                }} className={`address_Item ${item==props.data && 'selected'}`}>
                    {item}
                </div>
            })
        } 
    </div>}>
        {props.children}
    </Popover>
}