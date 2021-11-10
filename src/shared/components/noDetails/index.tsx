import React from 'react';
import no_details from 'src/assets/images/noDetail.png';
import './index.scss';


type Props={
    type:"max" |"small"
}
export default function Index(props:Props){
    return <div className={`stafi_no_details ${props.type}`}>
        <img src={no_details} />
        <label>No Details</label>
    </div>
}