import { LoadingOutlined } from '@ant-design/icons';
import { setSwapLoadingStatus } from '@features/dexClice';
import close_bold_svg from '@images/close_bold.svg';
import complete_svg from '@images/complete.svg';
import { Modal, Progress, Spin } from 'antd';
import { max } from 'mathjs';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './DexSwapLoading.scss';

const antIcon = <LoadingOutlined style={{ fontSize: '60px', color: '#fff' }} spin />;

type Props = {
  transferDetail: string;
  viewTxUrl?: string;
};

const STAGE1_MAX_PROGRESS = 50;

export default function DexSwapLoading(props: Props) {
  const dispatch = useDispatch();

  const { swapLoadingStatus, swapWaitingTime } = useSelector((state: any) => {
    return {
      swapLoadingStatus: state.dexModule.swapLoadingStatus,
      swapWaitingTime: state.dexModule.swapWaitingTime,
    };
  });

  const STAGE1_PERIOD = swapWaitingTime / 2;
  const STAGE2_PERIOD = swapWaitingTime;

  const [stage1TimeLeft, setStage1TimeLeft] = useState(STAGE1_PERIOD);
  const [stage2TimeLeft, setStage2TimeLeft] = useState(STAGE2_PERIOD);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);

  let stage1IntervalId: any;
  let stage2IntervalId: any;
  let stage2StartProgress = 0;

  useEffect(() => {
    if (swapLoadingStatus === 1) {
      resetStatus();
    }
  }, [swapLoadingStatus]);

  useEffect(() => {
    if (swapLoadingStatus === 1) {
      if (stage1TimeLeft > 0) {
        stage1IntervalId = setTimeout(() => {
          setStage1TimeLeft(max(stage1TimeLeft - 0.5, 0));
        }, 500);
      }
    } else if (swapLoadingStatus === 2) {
      clearTimeout(stage1IntervalId);
      stage2StartProgress = ((STAGE1_PERIOD - stage1TimeLeft) * STAGE1_MAX_PROGRESS) / STAGE1_PERIOD;
      if (stage2TimeLeft > 0) {
        stage2IntervalId = setTimeout(() => {
          setStage2TimeLeft(max(stage2TimeLeft - 0.5, 0));
        }, 500);
      }
    } else {
      setSuccess(false);
    }
    return () => {
      clearTimeout(stage1IntervalId);
      clearTimeout(stage2IntervalId);
    };
  }, [stage1TimeLeft, stage2TimeLeft, swapLoadingStatus]);

  useEffect(() => {
    if (swapLoadingStatus === 1) {
      setProgress(((STAGE1_PERIOD - stage1TimeLeft) * STAGE1_MAX_PROGRESS) / STAGE1_PERIOD);
    } else if (swapLoadingStatus === 2) {
      setProgress(
        stage2StartProgress + ((STAGE2_PERIOD - stage2TimeLeft) * (100 - stage2StartProgress)) / STAGE2_PERIOD,
      );
    } else {
      setProgress(0);
    }
    if (stage2TimeLeft === 0) {
      setSuccess(true);
      clearTimeout(stage1IntervalId);
      clearTimeout(stage2IntervalId);
      setStage1TimeLeft(STAGE1_PERIOD);
      setStage2TimeLeft(STAGE2_PERIOD);
    }
  }, [stage1TimeLeft, stage2TimeLeft, swapLoadingStatus]);

  const resetStatus = () => {
    clearTimeout(stage1IntervalId);
    clearTimeout(stage2IntervalId);
    setStage1TimeLeft(STAGE1_PERIOD);
    setStage2TimeLeft(STAGE2_PERIOD);
    stage2StartProgress = 0;
  };

  return (
    <Modal
      visible={swapLoadingStatus === 1 || swapLoadingStatus === 2}
      className='swap_loading_modal'
      destroyOnClose={false}
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
          <a className={'icon_container_inner'} onClick={() => dispatch(setSwapLoadingStatus(0))}>
            <img src={close_bold_svg} className={'close_icon'} />
          </a>
        </div>

        {success ? (
          <>
            <div className='title'>Congratulations!</div>

            <div className='context'>You have successfully swapped your tokens.Please check your wallet</div>

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
            <div className='title'>Swapping</div>

            <div className='context'>We are tranferring tokens to the received address</div>

            <div className='transfer_detail'>{props.transferDetail}</div>

            <div style={{ margin: 'auto', marginTop: '20px', width: '594px' }}>
              <Progress percent={progress} showInfo={false} strokeColor={'#00F3AB'} />
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