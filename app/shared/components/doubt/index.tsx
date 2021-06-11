import React from 'react'
import {Tooltip} from 'antd'
import doubt from "@images/doubt.svg";
import './index.scss';
type Props={
    tip:string
}
export default function Index(props:Props){
    return <Tooltip overlayClassName="stafi_doubt_overlay" placement="topLeft" title={props.tip}>
    <img src={doubt} />
</Tooltip>
}