import close_bold_svg from '@images/close_bold.svg';
import { Modal } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';
import './ClaimModal.scss';

type Props = {
  visible: boolean;
  onClose: Function;
};

export default function ClaimModal(props: Props) {
  const dispatch = useDispatch();

  return (
    <Modal
      visible={props.visible}
      className='claim_reward_modal'
      destroyOnClose={false}
      closable={false}
      footer={null}
      title={null}
      bodyStyle={{
        backgroundColor: '#23292F',
      }}
      style={{
        left: '70px',
        top: '260px',
      }}>
      <div>
        <div className='head_container'>
          <div className='head_title'>Claim Reward</div>

          <div className={'icon_container_outer'}>
            <a className={'icon_container_inner'} onClick={() => props.onClose && props.onClose()}>
              <img src={close_bold_svg} className={'close_icon'} />
            </a>
          </div>
        </div>

        <div className='claim_container'>
          <div className='claim_amount'>123.23</div>
          <div className='claim_button'>Claim</div>
        </div>

        <div className='content_container'>
          <div className='label'>Total Reward</div>
          <div className='content'>1.0323 FIS</div>
        </div>

        <div className='content_container'>
          <div className='label'>Claimable Reward</div>
          <div className='content'>1.0323 FIS</div>
        </div>

        <div className='content_container'>
          <div className='label'>Locked Reward</div>
          <div className='content'>1.0323 FIS</div>
        </div>
      </div>
    </Modal>
  );
}
