import { LoadingOutlined } from '@ant-design/icons';
import { setSwapLoadingStatus } from '@features/feeStationClice';
import close_bold_svg from '@images/close_bold.svg';
import complete_svg from '@images/complete.svg';
import FeeStationServer from '@servers/feeStation';
import { useInterval } from '@util/utils';
import { message, Modal, Progress, Spin } from 'antd';
import { max } from 'mathjs';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './SwapLoading.scss';

const antIcon = <LoadingOutlined style={{ fontSize: '60px', color: '#fff' }} spin />;
const feeStationServer = new FeeStationServer();

type Props = {
  transferDetail: string;
  viewTxUrl?: string;
  swapInfoParams?: any;
  onSwapSuccess: Function;
};

const STAGE1_MAX_PROGRESS = 50;

export default function FeeStationSwapLoading(props: Props) {
  const dispatch = useDispatch();

  const { swapLoadingStatus, swapWaitingTime } = useSelector((state: any) => {
    return {
      swapLoadingStatus: state.feeStationModule.swapLoadingStatus,
      swapWaitingTime: state.feeStationModule.swapWaitingTime,
    };
  });

  const STAGE1_PERIOD = swapWaitingTime / 2;
  const STAGE2_PERIOD = swapWaitingTime;

  const [stage1TimeLeft, setStage1TimeLeft] = useState(STAGE1_PERIOD);
  const [stage2TimeLeft, setStage2TimeLeft] = useState(STAGE2_PERIOD);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);

  // 0	VerifySigs, 1	VerifyTxOk, 2	PayOk, other failed
  const [swapStatus, setSwapStatus] = useState(0);

  let stage1IntervalId: any;
  let stage2IntervalId: any;
  let stage2StartProgress = 0;

  useEffect(() => {
    if (swapLoadingStatus === 1) {
      resetStatus();
    }
  }, [swapLoadingStatus]);

  useInterval(() => {
    if (swapLoadingStatus === 2 && swapStatus !== 2) {
      updateSwapStatus();
    }
  }, 5000);

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
    } else if (swapLoadingStatus === 3) {
      clearTimeout(stage1IntervalId);
      clearTimeout(stage2IntervalId);
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
      let newProgress;
      if (swapStatus !== 2) {
        newProgress = Math.min(
          95,
          stage2StartProgress + ((STAGE2_PERIOD - stage2TimeLeft) * (100 - stage2StartProgress)) / STAGE2_PERIOD,
        );
        if (stage2TimeLeft === 0) {
          message.info('We are tranferring tokens to the received address, please check your wallet later.');
          dispatch(setSwapLoadingStatus(0));
        }
      } else {
        newProgress =
          stage2StartProgress + ((STAGE2_PERIOD - stage2TimeLeft) * (100 - stage2StartProgress)) / STAGE2_PERIOD;
      }
      setProgress(newProgress);
    } else if (swapLoadingStatus === 3) {
    } else {
      setProgress(0);
    }
  }, [stage1TimeLeft, stage2TimeLeft, swapLoadingStatus, swapStatus]);

  useEffect(() => {
    if (progress === 100 || swapStatus === 2) {
      setSuccess(true);
      clearTimeout(stage1IntervalId);
      clearTimeout(stage2IntervalId);
      setStage1TimeLeft(STAGE1_PERIOD);
      setStage2TimeLeft(STAGE2_PERIOD);
    }
  }, [progress, swapStatus]);

  const updateSwapStatus = async () => {
    if (props.swapInfoParams) {
      const res = await feeStationServer.getSwapInfo(props.swapInfoParams);
      if (res.status === '80000' && res.data) {
        if (res.data.swapStatus === 0 || res.data.swapStatus === 1 || res.data.swapStatus === 2) {
          setSwapStatus(res.data.swapStatus);
          if (res.data.swapStatus === 2) {
            props.onSwapSuccess && props.onSwapSuccess();
          }
        } else {
          message.error('get swapStatus error');
          dispatch(setSwapLoadingStatus(0));
        }
      }
    }
  };

  const resetStatus = () => {
    clearTimeout(stage1IntervalId);
    clearTimeout(stage2IntervalId);
    setStage1TimeLeft(STAGE1_PERIOD);
    setStage2TimeLeft(STAGE2_PERIOD);
    stage2StartProgress = 0;
    setSwapStatus(0);
  };

  return (
    <Modal
      visible={swapLoadingStatus === 1 || swapLoadingStatus === 2 || swapLoadingStatus === 3}
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
