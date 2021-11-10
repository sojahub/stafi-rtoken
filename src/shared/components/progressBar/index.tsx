import React from 'react';

import './index.scss'
type Props={
    text?:any,
    icon?:any,
    progress?:number
}
export default function Index(props:Props){
    return <div className="stafi_progress_bar">
        <div className="content">{props.icon && <img src={props.icon} />}{props.text}</div>
        <div className="progress" style={{width:`${props.progress?props.progress:0}%`}}>

        </div>
    </div>
}