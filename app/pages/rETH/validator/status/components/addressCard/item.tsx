import React from 'react';
import A from '@shared/components/button/a'
import './index.scss'

type Props={
    status:"Active" | "Pending" | "Waiting" |"Unresponsive" | "Exit"
}
export default function Index(props:Props){
    return <div className="address_item">
        <div>
        Address: <A underline={true}>0x23…HNe8</A>
        </div>
        <div>
        Active
        </div>
    </div>
}