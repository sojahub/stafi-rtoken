import React from 'react';
import {Modal} from 'antd';

import './connectModal.scss';
type Props={
  visible:boolean,
  children:any
}
export default function Index(props:Props){
  return  <Modal footer={false} closeIcon={true} visible={props.visible} className="stafi_wallet_modal" width={638}>
            {props.children}  
        </Modal>
}