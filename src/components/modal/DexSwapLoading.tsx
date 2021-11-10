// @ts-nocheck

import { LoadingOutlined } from '@ant-design/icons';
import { message, Modal, Progress, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import close_bold_svg from 'src/assets/images/close_bold.svg';
import complete_svg from 'src/assets/images/complete.svg';
import { setSwapLoadingStatus } from 'src/features/dexClice';
import { noticeStatus, update_NoticeStatus } from 'src/features/noticeClice';
import Stafi from 'src/servers/stafi';
import numberUtil from 'src/util/numberUtil';
import { useInterval } from 'src/util/utils';
import './DexSwapLoading.scss';

const stafiServer = new Stafi();

const antIcon = <LoadingOutlined style={{ fontSize: '60px', color: '#fff' }} spin />;

type Props = {
  transferDetail: string;
  viewTxUrl?: string;
};

const STAGE1_MAX_PROGRESS = 20;

export default function DexSwapLoading(props: Props) {
  const dispatch = useDispatch();

  const { swapLoadingStatus, swapWaitingTime, swapLoadingParams } = useSelector((state: any) => {
    return {
      swapLoadingStatus: state.dexModule.swapLoadingStatus,
      swapWaitingTime: state.dexModule.swapWaitingTime,
      swapLoadingParams: state.dexModule.swapLoadingParams,
    };
  });

  const STAGE1_PERIOD = swapWaitingTime / 30;
  const STAGE2_PERIOD = swapWaitingTime;

  const [stage1TimeLeft, setStage1TimeLeft] = useState(STAGE1_PERIOD);
  const [stage2TimeLeft, setStage2TimeLeft] = useState(STAGE2_PERIOD);
  const [progress, setProgress] = useState(0);
  // 0	default, 1	success, other failed
  const [swapStatus, setSwapStatus] = useState(0);
  const [success, setSuccess] = useState(false);

  let stage1IntervalId: any;
  let stage2IntervalId: any;
  let successTimeoutId: any;
  let stage2StartProgress = 0;

  useEffect(() => {
    if (swapLoadingStatus === 1) {
      resetStatus();
    }
  }, [swapLoadingStatus]);

  useInterval(() => {
    if (swapLoadingStatus === 2) {
      updateSwapStatus();
    }
  }, 3000);

  useEffect(() => {
    if (swapLoadingStatus === 1) {
      if (stage1TimeLeft > 0) {
        stage1IntervalId = setTimeout(() => {
          setStage1TimeLeft(numberUtil.max(stage1TimeLeft - 0.5, 0));
        }, 500);
      }
    } else if (swapLoadingStatus === 2) {
      clearTimeout(stage1IntervalId);
      stage2StartProgress = ((STAGE1_PERIOD - stage1TimeLeft) * STAGE1_MAX_PROGRESS) / STAGE1_PERIOD;
      if (stage2TimeLeft > 0) {
        stage2IntervalId = setTimeout(() => {
          setStage2TimeLeft(numberUtil.max(stage2TimeLeft - 0.5, 0));
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
      if (swapStatus !== 1) {
        newProgress = Math.min(
          90,
          stage2StartProgress + ((STAGE2_PERIOD - stage2TimeLeft) * (100 - stage2StartProgress) * 15) / STAGE2_PERIOD,
        );
        if (stage2TimeLeft === 0) {
          message.info('We are tranferring tokens to the received address, please check your wallet later.');
          dispatch(setSwapLoadingStatus(0));
        }
      } else {
        newProgress = Math.min(
          98,
          stage2StartProgress + ((STAGE2_PERIOD - stage2TimeLeft) * (100 - stage2StartProgress) * 15) / STAGE2_PERIOD,
        );
      }
      setProgress(newProgress);
    } else if (swapLoadingStatus === 3) {
    } else {
      setProgress(0);
    }
    if (stage2TimeLeft === 0) {
      setStatusToSuccess();
    }
  }, [stage1TimeLeft, stage2TimeLeft, swapLoadingStatus]);

  useEffect(() => {
    if (progress === 100) {
      setStatusToSuccess();
    }
  }, [progress]);

  useEffect(() => {
    if (swapStatus === 1) {
      successTimeoutId = setTimeout(() => {
        setStatusToSuccess();
      }, 20000);
    }
  }, [swapStatus]);

  const resetStatus = () => {
    clearTimeout(stage1IntervalId);
    clearTimeout(stage2IntervalId);
    clearTimeout(successTimeoutId);
    setStage1TimeLeft(STAGE1_PERIOD);
    setStage2TimeLeft(STAGE2_PERIOD);
    stage2StartProgress = 0;
    setSwapStatus(0);
  };

  const setStatusToSuccess = () => {
    setSuccess(true);
    clearTimeout(stage1IntervalId);
    clearTimeout(stage2IntervalId);
    clearTimeout(successTimeoutId);
    setStage1TimeLeft(STAGE1_PERIOD);
    setStage2TimeLeft(STAGE2_PERIOD);
  };

  const updateSwapStatus = async () => {
    if (!swapLoadingParams || !swapLoadingParams.blockHeight || swapStatus === 1) {
      return;
    }
    const stafiApi = await stafiServer.createStafiApi();
    let arr = [];
    arr.push(swapLoadingParams.tokenSymbol);
    arr.push(swapLoadingParams.blockHeight);
    const result = await stafiApi.query.rDexnSwap.transInfos(arr);
    // console.log('sdfsdfsd result---------------', result.toJSON());
    if (result && result.toJSON()) {
      result.toJSON().forEach((item: any) => {
        if (item.is_deal) {
          setSwapStatus(1);
          dispatch(update_NoticeStatus(swapLoadingParams.noticeUuid, noticeStatus.Confirmed));
        }
      });
    }
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
