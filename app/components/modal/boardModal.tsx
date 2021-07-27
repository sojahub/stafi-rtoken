import React from 'react'
import { Modal } from 'antd';
import payment from '@images/payment.png'
import './boardModal.scss';

type Props = {
    visible: boolean,
    content?: string,
    title?: string
    onClose?: Function,
    onOK?: Function
    OKText: string,
    CancelText: string
}
export default function Index(props: Props) {
    return <Modal
        visible={props.visible}
        width={310}
        closable={false}
        title={false}
        className="stafi_offboard_modal"
        // onCancel={() => {
        //     props.onClose && props.onClose();
        // }}
        footer={<><div onClick={() => {
            props.onOK && props.onOK()
        }}>
                {props.OKText}
            </div><div onClick={() => {
            props.onClose && props.onClose();
        }}>
           {props.CancelText}
        </div></>}
    >
        <div className="offboardModal_icon"><img width={50} src={payment} /></div>
        <div className="title">
            {props.title}
        </div>
        <div className="content">
            {props.content}
        </div>
    </Modal>
}