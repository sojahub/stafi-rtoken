import React from 'react';

import './index.scss'
type Props={
    label:string,
    value:string | number,
    other?:any
}
export default function Index(props:Props){
    return <div className="pool_status_item">
        <div className={"label"}>
           {props.label}
        </div>
        <div className="value">
           <label> {props.value}</label>
           {props.other && <div className="other">
               {props.other}
           </div>}
        </div>
    </div>
}