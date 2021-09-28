import trade_svg from '@images/trade.png';
import { Modal } from 'antd';
import React from 'react';
import './swap.scss';

type Props = {
  visible: boolean;
  onClickSwap?: Function;
  onCancel: Function;
  type: string;
  label: string;
  tradeUrl: string;
};

export default function Index(props: Props) {
  return (
    <Modal
      visible={props.visible}
      className='stafi_swap_modal'
      closable={false}
      footer={
        <div>
          <a
            onClick={() => {
              props.onCancel();
              window.open(props.tradeUrl);
            }}>
            Trade
          </a>

          <a
            onClick={() => {
              props.onCancel();
              props.onClickSwap && props.onClickSwap();
            }}>
            Swap
          </a>
        </div>
      }
      onCancel={() => {
        props.onCancel();
      }}>
      <div>
        <div className='title'>
          <img src={trade_svg} />

          <div style={{ marginTop: 0, fontFamily: 'Helvetica-Bold' }}>Trade</div>
        </div>

        <div
          className='context'
          style={{ color: 'rgba(34,36,31,0.8)', lineHeight: '18px', marginTop: '10px', marginBottom: '18px' }}>
          Swap Native {props.type} to ERC20 {props.type} before trading on {props.label}
        </div>
      </div>
    </Modal>
  );
}
