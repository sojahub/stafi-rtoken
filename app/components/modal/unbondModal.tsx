import React from 'react';
import {Modal,Tooltip} from 'antd';
import A from '@shared/components/button/a';
import doubt from "@images/doubt.svg"
import Button from '@shared/components/button/button';
import NumberUtil from '@util/numberUtil'

import './unbondModal.scss';

type Props={
  visible:boolean,
  unbondAmount:any,
  commission:any,
  getAmount:any,
  onOk?:Function,
  onCancel?:Function,
  bondFees?:any,
  type:"rDOT"|"rETH"|"rFIS"|"rKSM",
}
export default function Index(props:Props){
  return <Modal visible={props.visible} 
                className="stafi_unbond_modal"
                closable={false}
                footer={false}>
         <div className="title">
         Unbond {props.unbondAmount} {props.type}
            
         </div>
         <div className="content">
            <div className="row">—Commission: {props.commission} {props.type}
            <div className="doubt"><Tooltip overlayClassName="modal_doubt_overlay" placement="topLeft" title={"Fee charged by the StaFi to reserve as Protocol Treasury"}>
                        <img src={doubt} />
                    </Tooltip></div>
            </div>
            <div className="row">—Relay Fee: {NumberUtil.fisAmountToHuman(props.bondFees) || "--"} FIS
            
            <div className="doubt"><Tooltip overlayClassName="modal_doubt_overlay" placement="topLeft" title={"Fee charged by the relay to pay for the fee of interact tx to designated chain"}>
                        <img src={doubt} />
                    </Tooltip></div></div>
            <div className="row period">
              {props.type=="rDOT" && `—Period: around 24 days`}
              {props.type=="rKSM" && `—Period: around 6 days`}
            <div className="doubt"><Tooltip overlayClassName="modal_doubt_overlay" placement="topLeft" title={"unbond period is deteminted by designated chain."}>
                        <img src={doubt} />
                    </Tooltip></div></div>

            <div className="get_count"> 
              {props.type=="rDOT" && `You will get ${props.getAmount} DOT`}
              {props.type=="rKSM" && `You will get ${props.getAmount} KSM`}
            </div>

            <div className="btns">
              <A onClick={()=>{
                props.onCancel && props.onCancel();
              }}>Cancel</A>
                <Button onClick={()=>{
                  props.onOk && props.onOk();
                }}>Unbond</Button>
            </div>
         </div>
  </Modal>
}