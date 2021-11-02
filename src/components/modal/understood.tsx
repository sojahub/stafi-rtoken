import { Modal } from 'antd';
import React from 'react';
import understood_png from 'src/assets/images/understood.png';
import './swap.scss';

type Props = {
  visible: boolean;
  context: string;
  onOk?: Function;
};
export default function Index(props: Props) {
  return (
    <Modal
      visible={props.visible}
      className='stafi_understood_modal'
      closable={false}
      footer={
        <div>
          <a
            onClick={() => {
              props.onOk && props.onOk();
            }}>
            Understood
          </a>
        </div>
      }
      onOk={() => {
        props.onOk && props.onOk();
      }}
      onCancel={() => {
        props.onOk && props.onOk();
      }}>
      <div>
        <div className='title'>
          <img src={understood_png} style={{ width: 50, height: 50 }} />
          <div>Tx Broadcasting</div>
        </div>
        <div className='context'>{props.context}</div>
      </div>
    </Modal>
  );
}
