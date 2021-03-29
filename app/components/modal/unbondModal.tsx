import React from 'react';
import {Modal,Tooltip} from 'antd';
import A from '@shared/components/button/a';
import doubt from "@images/doubt.svg"
import Button from '@shared/components/button/button';

import './unbondModal.scss';

type Props={
  visible:boolean,
  unbondAmount:any,
  commission:any,
  getAmount:any,
  onOk?:Function,
  onCancel?:Function,
}
export default function Index(props:Props){
  return <Modal visible={props.visible} 
                className="stafi_unbond_modal"
                closable={false}
                footer={false}>
         <div className="title">
            Unbond {props.unbondAmount} rDOT
         </div>
         <div className="content">
            <div className="row">—Commission:{props.commission} rDOT
            <div className="doubt"><Tooltip overlayClassName="modal_doubt_overlay" placement="topLeft" title={"Fee charged by the StaFi to reserve as Protocol Treasury"}>
                        <img src={doubt} />
                    </Tooltip></div>
            </div>
            <div className="row">—Relay Fee: 3 FIS
            
            <div className="doubt"><Tooltip overlayClassName="modal_doubt_overlay" placement="topLeft" title={"Fee charged by the relay to pay for the fee of interact tx to designated chain"}>
                        <img src={doubt} />
                    </Tooltip></div></div>
            <div className="row period">—Period:around 29 days
            
            <div className="doubt"><Tooltip overlayClassName="modal_doubt_overlay" placement="topLeft" title={"unbond period is deteminted by designated chain."}>
                        <img src={doubt} />
                    </Tooltip></div></div>

            <div className="get_count">
              You will get {props.getAmount} DOT
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