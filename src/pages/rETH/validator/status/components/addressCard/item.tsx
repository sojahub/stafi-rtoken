import React from 'react';
import A from 'src/shared/components/button/a';
import './index.scss';

type Props={
    status:string,
    address:string,
    onClick?:Function
}
export default function Index(props:Props){
    return <div className="address_item">
        <div>
        Address: <A onClick={props.onClick} underline={true}>{props.address}</A>
        </div>
        <div>
        {props.status}
        </div>
    </div>
}