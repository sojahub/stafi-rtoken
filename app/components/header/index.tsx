import React from 'react';
import logo from '@images/header_logo.png';
import notice from '@images/notice.png';
import Popover from './popover'
import './index.scss';

type Props={
    route:any
}
export default function Index(props:any){
    return <div className="stafi_header">
        <img className="header_logo" src={logo} />
        {/* <div className="header_tool">
            Connect to Polkadotjs
        </div> */}
        <div className="header_tools">
            <div className="header_tool notice new">
                
                <Popover>
                <img src={notice} />
                </Popover>
            </div>
            <div className="header_tool">
                39.203 DOT
            </div>
            <div className="header_tool">
                3N2J…JS23
            </div>
        </div>
    </div>
}