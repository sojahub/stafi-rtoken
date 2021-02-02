import React from 'react';
import logo from '@images/header_logo.png';
import './index.scss';

export default function Index(){
    return <div className="stafi_header">
        <img className="header_logo" src={logo} />
        <div className="header_tool">
            Connect to Polkadotjs
        </div>
    </div>
}