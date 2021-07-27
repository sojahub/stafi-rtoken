import { LoadingOutlined } from '@ant-design/icons';
import config from '@config/index';
import close_bold_svg from '@images/close_bold.svg';
import complete_svg from '@images/complete.svg';
import { Modal, Progress, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import './SwapLoading.scss';

const antIcon = <LoadingOutlined style={{ fontSize: '60px', color: '#fff' }} spin />;

type Props = {
  visible: boolean;
  destChainName: string;
  destChainType: string;
  transferDetail: string;
  viewTxUrl: string;
  onClose: Function;
};

export default function SwapLoading(props: Props) {
  const [timeLeft, setTimeLeft] = useState(config.swapWaitingTime());
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!timeLeft || !props.visible) {
      return;
    }
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 0.5);
    }, 500);

    return () => clearInterval(intervalId);
  }, [timeLeft, props.visible]);

  useEffect(() => {
    if (!props.visible) {
      setTimeLeft(config.swapWaitingTime());
      setSuccess(false);
    }
  }, [props.visible]);

  useEffect(() => {
    if (timeLeft === 0) {
      setSuccess(true);
    }
  }, [timeLeft]);

  return (
    <Modal
      visible={props.visible}
      className='swap_loading_modal'
      destroyOnClose
      closable={false}
      footer={null}
      title={null}
      bodyStyle={{
        backgroundColor: '#23292F',
      }}
      style={{
        left: '88px',
      }}>
      <div>
        <div className={'icon_container_outer'}>
          <a className={'icon_container_inner'} onClick={() => props.onClose && props.onClose()}>
            <img src={close_bold_svg} className={'close_icon'} />
          </a>
        </div>

        {success ? (
          <>
            <div className='title'>Congratulations!</div>

            <div className='context'>
              You have successfully transferred your tokens.Please check your{' '}
              {props.destChainType === 'native' ? 'Polkadot.js wallet' : 'wallet'}
            </div>

            <div className={'center_container'}>
              <img src={complete_svg} className={'success_icon'} />
            </div>

            <div className={'center_container'}>
              <div className={'success_btn'} onClick={() => props.viewTxUrl && window.open(props.viewTxUrl)}>
                VIEW YOUR TRANSACTION
              </div>
            </div>
          </>
        ) : (
          <>
            <div className='title'>Transferring</div>

            <div className='context'>We are transferring your tokens to {props.destChainName}</div>

            <div className='transfer_detail'>{props.transferDetail}</div>

            <div style={{ margin: 'auto', marginTop: '20px', width: '594px' }}>
              <Progress
                percent={((config.swapWaitingTime() - timeLeft) * 100) / config.swapWaitingTime()}
                showInfo={false}
                strokeColor={'#00F3AB'}
              />
            </div>

            <div className={'spin_container'}>
              <Spin indicator={antIcon} />
            </div>

            <div className='view_tx_text' onClick={() => props.viewTxUrl && window.open(props.viewTxUrl)}>
              View your transaction
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
