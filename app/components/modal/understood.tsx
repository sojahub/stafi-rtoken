import React from 'react';
import {Modal} from 'antd';
import understood_svg from '@images/understood.svg';

import './swap.scss';

type Props={
  visible:boolean,
  onOk?:Function,
  onCancel?:Function, 
}
export default function Index(props:Props){
  return <Modal visible={props.visible} 
  className="stafi_understood_modal"
  closable={false}
  footer={<div>
    <a onClick={()=>{
        props.onOk && props.onOk();
    }}>
      understood
    </a> 
  </div>}
  onOk={()=>{
    props.onOk && props.onOk();
  }} onCancel={()=>{
    props.onCancel && props.onCancel();
  }}>
        <div>
          <div className="title">
              <img src={understood_svg} />
              <div>
              Tx Broadcasting
              </div>
          </div>
          <div className="context">
                Tx is broadcasting, please check your FIS balance on Metamask later. It may take 2~10 minuts.
          </div>
        </div>
      </Modal>
}