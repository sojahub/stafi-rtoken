import React from 'react';
import { ProgressPlugin } from 'webpack';
import './index.scss';
type Props={
    children:any
}
export default function Index(props:Props){
    return <div className="stafi_content">
        {props.children}
    </div>
}