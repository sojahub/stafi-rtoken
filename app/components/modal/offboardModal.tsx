import React from 'react'
import { Modal } from 'antd';
import payment from '@images/payment.png'
import './offboardModal.scss';

type Props={
    visible:boolean,
    onClose?:Function,
    onOK?:Function
}
export default function Index(props:Props){
    return <Modal
    visible={props.visible}
    width={310}
    closable={false} 
    title={false}
    className="stafi_offboard_modal"
    onCancel={()=>{
        props.onClose && props.onClose();
    }}
    footer={<><div onClick={()=>{
        props.onOK && props.onOK()
    }}>
            Offboard
        </div><div onClick={()=>{
        props.onClose && props.onClose();
    }}>
        Cancel
    </div></>}
    >
        <div><img width={50} src={payment}/></div>
            <div className="title">Confirm to offboard</div>
            <div className="content">
            Are your sure to offboard? All deposits will be refunded once confirm
            </div>
    </Modal>
}