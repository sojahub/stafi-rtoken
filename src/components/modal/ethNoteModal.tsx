import { Modal, Radio } from 'antd';
import React, { useEffect, useState } from 'react';
import config from 'src/config/index';
import A from 'src/shared/components/button/a';
import './ethNoteModal.scss';

type Props={
    onCancel:Function,
    onNext:Function,
    visible:boolean
}
export default function Index(props:Props){

    const [agree,setAgree]=useState(false);
    useEffect(()=>{ 
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
ETH2.0 Staking does't support withdraw function 
for now, so You couldn't redeem the staked ETH 
until ETH 2.0 Phase1.5 is rolled out. 
You could trade rETH token into ETH for liquidity 
on DEX like <A onClick={()=>{
    window.open(config.uniswap.rethURL_pair)
}} underline={true}>Uniswap</A> or <A underline={true} onClick={()=>{
    window.open(config.curve.rethURL)
}}>Curve</A>.

    <div className="radio_panel">
        <Radio value={true} checked={agree} onChange={(e)=>{
            setAgree(e.target.checked)
        }}>I am fully aware of it</Radio>
    </div>
    </Modal>
}