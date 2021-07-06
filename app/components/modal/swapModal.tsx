import React from 'react';
import {Modal,message} from 'antd';
import Uniswap_svg from '@images/uniswap.png';

import './swap.scss';

type Props={
  visible:boolean,
  onOk?:Function,
  onCancel?: Function,
  onUniswapClick?:Function,
  type:"rDOT"|"rETH"|"rFIS"|"rKSM"|"rATOM"|"rMatic",
}
export default function Index(props:Props){
  return <Modal visible={props.visible} 
  className="stafi_swap_modal"
  closable={false}
  footer={<div>
    <a onClick={()=>{
        props.onOk && props.onOk(1);
    }}>
      Swap
    </a>

    <a onClick={()=>{ 
       message.info("Uniswap Pool hasn't been established yet, stay tuned");
        // props.onUniswapClick && props.onUniswapClick();
    }}>
      Uniswap
    </a>
  </div>}
  onOk={()=>{
    props.onOk && props.onOk();
  }} onCancel={()=>{
    props.onCancel && props.onCancel();
  }}>
        <div>
          <div className="title">
              <img src={Uniswap_svg} />
              <div>
                Uniswap
              </div>
          </div>
          <div className="context">
          Uniswap only supports ERC20 tokens, before you trade {props.type} token on Uniswap, please use our rBridge to swap ERC-20 {props.type} first.
          </div>
        </div>
      </Modal>
}