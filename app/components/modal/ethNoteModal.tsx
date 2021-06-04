import React, { useEffect, useState } from 'react';
import {Modal,Radio} from 'antd'
import './ethNoteModal.scss'

type Props={
    onCancel:Function,
    onNext:Function,
    visible:boolean
}
export default function Index(props:Props){

    const [agree,setAgree]=useState(false);
    useEffect(()=>{
        console.log(setAgree(false))
        setAgree(false); 
    },[props.visible])
    return <Modal 
    visible={props.visible}
    title={"Note"}
    className="stafi_eth_note_modal"
    footer={<div className={`next_btn ${agree && "agree"}`} onClick={()=>{
        props.onNext && agree && props.onNext();
        setAgree(false);
    }}>
        Next
    </div>}
    onCancel={()=>{
        setAgree(false);
        props.onCancel && props.onCancel();
    }}
    width={310}
    >
ETH2.0 is not enable staked ETH (like rETH) to be redeemed until phase1.5. rETH can only be swapped to ETH in Uniswap. Other marketplaces are in construction.

    <div className="radio_panel">
        <Radio value={true} checked={agree} onChange={(e)=>{
            setAgree(e.target.checked)
        }}>I am fully aware of it</Radio>
    </div>
    </Modal>
}