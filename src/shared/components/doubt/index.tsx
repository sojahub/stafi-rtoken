import { Tooltip } from 'antd';
import React from 'react';
import doubt from "src/assets/images/doubt.svg";
import './index.scss';
type Props={
    tip:string
}
export default function Index(props:Props){
    return <Tooltip overlayClassName="stafi_doubt_overlay" placement="topLeft" title={props.tip}>
    <img className="stafi_doubt_icon" src={doubt} />
</Tooltip>
}