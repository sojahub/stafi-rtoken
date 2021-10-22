import { LoadingOutlined } from '@ant-design/icons';
import { getRsymbolByTokenType, getSymbolRTitle } from '@config/index';
import { BSC_CHAIN_ID, ETH_CHAIN_ID, SOL_CHAIN_ID } from '@features/bridgeClice';
import {
  getAssetBalance as getBscAssetBalance,
  getAssetBalanceAll as getBep20AssetBalanceAll
} from '@features/BSCClice';
import {
  getAssetBalance as getEthAssetBalance,
  getAssetBalanceAll as getErc20AssetBalanceAll
} from '@features/ETHClice';
import { processStatus, setStakeSwapLoadingStatus } from '@features/globalClice';
import { noticeStatus, update_NoticeProcessSwppingStatus, update_NoticeStatus } from '@features/noticeClice';
import { getAssetBalance as getSlpAssetBalance, getSlp20AssetBalanceAll } from '@features/SOLClice';
import close_bold_svg from '@images/close_bold.svg';
import complete_svg from '@images/complete.svg';
import { requestAddTokenToMetaMask } from '@util/metamaskUtil';
import numberUtil from '@util/numberUtil';
import { useInterval } from '@util/utils';
import { message, Modal, Progress, Spin } from 'antd';
import { cloneDeep } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './SwapLoading.scss';

const antIcon = <LoadingOutlined style={{ fontSize: '60px', color: '#fff' }} spin />;

type Props = {};

const STAGE1_MAX_PROGRESS = 15;
const swapWaitingTime = 300;

export default function StakeSwapLoading(props: Props) {
  const dispatch = useDispatch();

  const { swapLoadingStatus, swapLoadingParams, metaMaskNetworkId } = useSelector((state: any) => {
    return {
      swapLoadingStatus: state.globalModule.stakeSwapLoadingStatus,
      swapLoadingParams: state.globalModule.stakeSwapLoadingParams,
      metaMaskNetworkId: state.globalModule.metaMaskNetworkId,
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
    if (swapLoadingStatus === 0) {
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
          // console.log('tik tik tik tik tik tik tik tik tik tik tik tik tik tik: ', stage1TimeLeft);
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
          dispatch(setStakeSwapLoadingStatus(0));
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
      }, 10000);
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
    if (
      !swapLoadingParams ||
      isNaN(swapLoadingParams.amount) ||
      isNaN(swapLoadingParams.oldBalance) ||
      !swapLoadingParams.tokenType ||
      swapStatus === 1
    ) {
      // console.log('invalid swapLoadingParams');
      return;
    }

    if (swapLoadingParams.destChainId === ETH_CHAIN_ID) {
      if (swapLoadingParams.tokenAbi && swapLoadingParams.tokenAddress) {
        getEthAssetBalance(
          swapLoadingParams.address,
          cloneDeep(swapLoadingParams.tokenAbi),
          swapLoadingParams.tokenAddress,
          (v: any) => {
            // console.log('sdfsdfsdf', Number(v), targetBalance * 1.1, targetBalance * 0.9);
            // console.log('new amount', v);
            if (
              Number(v) - Number(swapLoadingParams.oldBalance) <= Number(swapLoadingParams.amount) * 1.05 &&
              Number(v) - Number(swapLoadingParams.oldBalance) >= Number(swapLoadingParams.amount) * 0.95
            ) {
              setSwapStatus(1);
              dispatch(getErc20AssetBalanceAll());
              dispatch(update_NoticeStatus(swapLoadingParams.noticeUuid, noticeStatus.Confirmed));
              dispatch(
                update_NoticeProcessSwppingStatus(swapLoadingParams.noticeUuid, {
                  brocasting: processStatus.success,
                  checkAddr: swapLoadingParams.viewTxUrl,
                }),
              );
            }
          },
          true,
        );
      }
    } else if (swapLoadingParams.destChainId === BSC_CHAIN_ID) {
      if (swapLoadingParams.tokenAbi && swapLoadingParams.tokenAddress) {
        getBscAssetBalance(
          swapLoadingParams.address,
          cloneDeep(swapLoadingParams.tokenAbi),
          swapLoadingParams.tokenAddress,
          (v: any) => {
            if (
              Number(v) - Number(swapLoadingParams.oldBalance) <= Number(swapLoadingParams.amount) * 1.05 &&
              Number(v) - Number(swapLoadingParams.oldBalance) >= Number(swapLoadingParams.amount) * 0.95
            ) {
              setSwapStatus(1);
              dispatch(getBep20AssetBalanceAll());
              dispatch(update_NoticeStatus(swapLoadingParams.noticeUuid, noticeStatus.Confirmed));
              dispatch(
                update_NoticeProcessSwppingStatus(swapLoadingParams.noticeUuid, {
                  brocasting: processStatus.success,
                  checkAddr: swapLoadingParams.viewTxUrl,
                }),
              );
            }
          },
          true,
        );
      }
    } else if (swapLoadingParams.destChainId === SOL_CHAIN_ID) {
      // console.log('check spl token balance');
      getSlpAssetBalance(swapLoadingParams.address, swapLoadingParams.tokenType, (v: any) => {
        // console.log('new amount:', v);
        if (
          Number(v) - Number(swapLoadingParams.oldBalance) <= Number(swapLoadingParams.amount) * 1.05 &&
          Number(v) - Number(swapLoadingParams.oldBalance) >= Number(swapLoadingParams.amount) * 0.95
        ) {
          // console.log('check splt token balance success');
          setSwapStatus(1);
          dispatch(getSlp20AssetBalanceAll());
          dispatch(update_NoticeStatus(swapLoadingParams.noticeUuid, noticeStatus.Confirmed));
          dispatch(
            update_NoticeProcessSwppingStatus(swapLoadingParams.noticeUuid, {
              brocasting: processStatus.success,
              checkAddr: swapLoadingParams.viewTxUrl,
            }),
          );
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
          <a className={'icon_container_inner'} onClick={() => dispatch(setStakeSwapLoadingStatus(0))}>
            <img src={close_bold_svg} className={'close_icon'} />
          </a>
        </div>

        {success ? (
          <>
            <div className='title'>Congratulations!</div>

            <div className='context'>You have successfully transferred your tokens.Please check your wallet</div>

            <div className={'center_container'}>
              <img src={complete_svg} className={'success_icon'} />
            </div>

            <div className={'center_container'}>
              <div
                className={'success_btn'}
                style={{ marginBottom: 0 }}
                onClick={() =>
                  swapLoadingParams && swapLoadingParams.viewTxUrl && window.open(swapLoadingParams.viewTxUrl)
                }>
                VIEW YOUR TRANSACTION
              </div>

              {(swapLoadingParams.destChainId === ETH_CHAIN_ID || swapLoadingParams.destChainId === BSC_CHAIN_ID) && (
                <div
                  className='add_token_text'
                  onClick={() => {
                    requestAddTokenToMetaMask(swapLoadingParams.tokenType, swapLoadingParams.destChainId);
                  }}>
                  Add {getSymbolRTitle(getRsymbolByTokenType(swapLoadingParams.tokenType))} to Metamask
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className='title'>Transferring</div>

            <div className='context'>We are transferring your tokens to your received address</div>

            <div className='transfer_detail'>{swapLoadingParams && swapLoadingParams.transferDetail}</div>

            <div style={{ margin: 'auto', marginTop: '20px', width: '594px' }}>
              <Progress percent={progress} showInfo={false} strokeColor={'#00F3AB'} />
            </div>

            <div className={'spin_container'}>
              <Spin indicator={antIcon} />
            </div>

            <div
              className='view_tx_text'
              onClick={() =>
                swapLoadingParams && swapLoadingParams.viewTxUrl && window.open(swapLoadingParams.viewTxUrl)
              }>
              View your transaction
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
