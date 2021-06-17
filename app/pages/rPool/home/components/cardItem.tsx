import React from 'react'
import './cardItem.scss';
type Props={
    label:string,
    value:any
}
export default function Index(props:Props){
    return <div className="rpool_card_item">
        <div className="label">{props.label}</div>
        <div className="value">{props.value}</div>
    </div>
}