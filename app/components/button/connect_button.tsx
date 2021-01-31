import React from 'react';
import {Button} from 'antd';
import rDOT_svg from '@images/rDOT.svg'

import './index.scss';

export default function Index(){
    return <Button className="stafi_connect_button">
       <img src={rDOT_svg} />  Connect to Polkadotjs extension
    </Button>
}