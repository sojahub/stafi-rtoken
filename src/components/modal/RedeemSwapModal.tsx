import { Modal } from 'antd';
import React from 'react';
import { useHistory } from 'react-router';
import trade_svg from 'src/assets/images/trade.png';
import './swap.scss';

type Props = {
  visible: boolean;
  onCancel: Function;
  type: 'rDOT' | 'rETH' | 'rFIS' | 'rKSM' | 'rATOM' | 'rSOL' | 'rMATIC' | 'rBNB';
  platform: string;
};

export default function RedeemSwapModal(props: Props) {
  const history = useHistory();

  return (
    <Modal
      visible={props.visible}
      className='stafi_swap_modal'
      closable={false}
      style={{
        left: '88px',
        top: '150px',
      }}
      footer={
        <div>
          <a
            onClick={() => {
              props.onCancel();
            }}>
            Cancel
          </a>

          <a
            onClick={() => {
              props.onCancel();
              if (props.type !== 'rETH') {
                history.push(`/rAsset/swap/${props.platform.toLowerCase()}/native`, {
                  rSymbol: props.type,
                });
              } else {
                history.push(`/rAsset/swap/${props.platform.toLowerCase()}/erc20`, {
                  rSymbol: 'rETH',
                });
              }
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

          <div style={{ marginTop: 0, fontFamily: 'Helvetica-Bold' }}>Swap</div>
        </div>

        <div
          className='context'
          style={{ color: 'rgba(34,36,31,0.8)', lineHeight: '18px', marginTop: '10px', marginBottom: '18px' }}>
          Only Native rToken can redeem. You can use rBridge to swap rToken.{' '}
        </div>
      </div>
    </Modal>
  );
}
