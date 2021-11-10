import React from 'react'

import './index.scss'

type Props={
    label?:string,
    children:any
}
export default function Index(props:Props){
    return <div className="pool_item">
        {props.label && <div className="label">
            {props.label}
        </div>}
        <div className="content">
            {props.children}
        </div>
    </div>
}