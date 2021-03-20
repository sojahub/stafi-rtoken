import React from 'react'; 
import './index.scss';
type Props={
    children:any,
    className?:string
}
export default function Index(props:Props){
    return <div className={`stafi_content ${props.className}`}>
        {props.children}
    </div>
}