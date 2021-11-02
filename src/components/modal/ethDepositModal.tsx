import React from 'react'
import { Modal,Spin } from 'antd';
import Spin_Icon from '@shared/components/spin'
import './ethDepositModal.scss';

type Props={
    visible:boolean,
    onClose:Function
}
export default function Index(props:Props){
    return <Modal
    visible={props.visible}
    width={310}
    closable={false} 
    title={false}
    className="eth_deposit_modal"
    onCancel={()=>{
        props.onClose && props.onClose();
    }}
    footer={<div onClick={()=>{
        props.onClose && props.onClose();
    }}>
        Close
    </div>}
    >
        <div>Tx is pending to be finalized</div>
        <Spin indicator={<Spin_Icon type="icon-loading1" />} />
    </Modal>
}