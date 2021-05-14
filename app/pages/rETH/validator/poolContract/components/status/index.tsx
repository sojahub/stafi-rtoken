import React from 'react';
import zs_svg from '@images/zs.svg'
import './index.scss';
type Props={
    status:string
}
export default function Index(props:Props){
    return <div className="stafi_pool_status">
       <div className="icon"><img src={zs_svg} /></div>  {props.status}
    </div>
}