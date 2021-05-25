import React from 'react';
import {Popover} from 'antd';
import './index.scss';

type Props={
    children:any,
    data:any[]
}
export default function Index(props:Props){
    return <Popover overlayClassName={"stafi-popover-link"} trigger="click" content={<div>
        {
            props.data && props.data.map((item)=>{

                return <div className="item-link" onClick={()=>{
                    window.open(item.url)
                }}>
                    {item.label}
                </div>
            })
        }
    </div>}>
            {props.children}
      </Popover>
}