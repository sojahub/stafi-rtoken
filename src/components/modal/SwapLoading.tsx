import { LoadingOutlined } from '@ant-design/icons';
import { message, Modal, Progress, Spin } from 'antd';
import { cloneDeep } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import close_bold_svg from 'src/assets/images/close_bold.svg';
import complete_svg from 'src/assets/images/complete.svg';
import {
  BSC_CHAIN_ID,
  ETH_CHAIN_ID,
  setSwapLoadingStatus,
  SOL_CHAIN_ID,
  STAFIHUB_CHAIN_ID,
  STAFI_CHAIN_ID,
} from 'src/features/bridgeClice';
import {
  getAssetBalance as getBscAssetBalance,
  getAssetBalanceAll as getBep20AssetBalanceAll,
} from 'src/features/BSCClice';
import CommonClice from 'src/features/commonClice';
import {
  getAssetBalance as getEthAssetBalance,
  getAssetBalanceAll as getErc20AssetBalanceAll,
} from 'src/features/ETHClice';
import { queryTokenBalances } from 'src/features/FISClice';
import { noticeStatus, update_NoticeStatus } from 'src/features/noticeClice';
import { getAssetBalance as getSlpAssetBalance, getSlp20AssetBalanceAll } from 'src/features/SOLClice';
import {
  getAssetBalance as getStafiHubAssetBalance,
  getStafiHubBalanceAll,
  getStafiHubFisAssetBalance,
  getStafiHubRAtomAssetBalance,
} from 'src/features/StafiHubClice';
import { rSymbol } from 'src/keyring/defaults';
import Stafi from 'src/servers/stafi/index';
import numberUtil from 'src/util/numberUtil';
import { useInterval } from 'src/util/utils';
import './SwapLoading.scss';

const commonClice = new CommonClice();
const stafiServer = new Stafi();
const antIcon = <LoadingOutlined style={{ fontSize: '60px', color: '#fff' }} spin />;

type Props = {
  destChainName: string;
  destChainType: string;
  transferDetail: string;
  viewTxUrl: string;
};

const STAGE1_MAX_PROGRESS = 15;

export default function SwapLoading(props: Props) {
  const dispatch = useDispatch();

  const { swapLoadingStatus, swapWaitingTime, swapLoadingParams } = useSelector((state: any) => {
    return {
      swapLoadingStatus: state.bridgeModule.swapLoadingStatus,
      swapWaitingTime: state.bridgeModule.swapWaitingTime,
      swapLoadingParams: state.bridgeModule.swapLoadingParams,
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
          message.info('We are transferring tokens to the received address, please check your wallet later.');
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
      return;
    }

    if (swapLoadingParams.destChainId === STAFI_CHAIN_ID) {
      let rType;
      if (swapLoadingParams.tokenType === 'rfis' || swapLoadingParams.tokenType === 'fis') {
        rType = rSymbol.Fis;
      } else if (swapLoadingParams.tokenType === 'rksm') {
        rType = rSymbol.Ksm;
      } else if (swapLoadingParams.tokenType === 'rdot') {
        rType = rSymbol.Dot;
      } else if (swapLoadingParams.tokenType === 'ratom') {
        rType = rSymbol.Atom;
      } else if (swapLoadingParams.tokenType === 'rsol') {
        rType = rSymbol.Sol;
      } else if (swapLoadingParams.tokenType === 'rmatic') {
        rType = rSymbol.Matic;
      } else if (swapLoadingParams.tokenType === 'reth') {
        rType = rSymbol.Eth;
      } else if (swapLoadingParams.tokenType === 'rbnb') {
        rType = rSymbol.Bnb;
      }

      let data;
      if (swapLoadingParams.tokenType === 'fis') {
        const api = await stafiServer.createStafiApi();
        const result = (await api.query.system.account(swapLoadingParams.address)) as any;
        if (result) {
          data = result.data;
        }
      } else {
        data = await commonClice.query_rBalances_account({ address: swapLoadingParams.address }, rType, (v: any) => {});
      }
      if (data) {
        if (
          numberUtil.tokenAmountToHuman(Number(data.free) - Number(swapLoadingParams.oldBalance), rType) ===
          Number(swapLoadingParams.amount)
        ) {
          setSwapStatus(1);
          dispatch(queryTokenBalances());
          dispatch(update_NoticeStatus(swapLoadingParams.noticeUuid, noticeStatus.Confirmed));
        }
      }
    } else if (swapLoadingParams.destChainId === ETH_CHAIN_ID) {
      if (swapLoadingParams.tokenAbi && swapLoadingParams.tokenAddress) {
        getEthAssetBalance(
          swapLoadingParams.address,
          cloneDeep(swapLoadingParams.tokenAbi),
          swapLoadingParams.tokenAddress,
          (v: any) => {
            if (Number(v) === Number(swapLoadingParams.oldBalance) + Number(swapLoadingParams.amount)) {
              setSwapStatus(1);
              dispatch(getErc20AssetBalanceAll());
              dispatch(update_NoticeStatus(swapLoadingParams.noticeUuid, noticeStatus.Confirmed));
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
            if (Number(v) === Number(swapLoadingParams.oldBalance) + Number(swapLoadingParams.amount)) {
              setSwapStatus(1);
              dispatch(getBep20AssetBalanceAll());
              dispatch(update_NoticeStatus(swapLoadingParams.noticeUuid, noticeStatus.Confirmed));
            }
          },
          true,
        );
      }
    } else if (swapLoadingParams.destChainId === SOL_CHAIN_ID) {
      getSlpAssetBalance(swapLoadingParams.address, swapLoadingParams.tokenType, (v: any) => {
        // console.log('new amount:', v);
        if (Number(v) === Number(swapLoadingParams.oldBalance) + Number(swapLoadingParams.amount)) {
          setSwapStatus(1);
          dispatch(getSlp20AssetBalanceAll());
          dispatch(update_NoticeStatus(swapLoadingParams.noticeUuid, noticeStatus.Confirmed));
        }
      });
    } else if (swapLoadingParams.destChainId === STAFIHUB_CHAIN_ID) {
      let denom = '';
      if (swapLoadingParams.tokenType === 'fis') {
        denom = 'ufis';
      } else if (swapLoadingParams.tokenType === 'ratom') {
        denom = 'uratom';
      }
      getStafiHubAssetBalance(swapLoadingParams.address, denom, (v: any) => {
        console.log(swapLoadingParams.oldBalance, swapLoadingParams.amount);
        if (
          Number(v) - Number(swapLoadingParams.oldBalance) <= Number(swapLoadingParams.amount) * 1.1 &&
          Number(v) - Number(swapLoadingParams.oldBalance) >= Number(swapLoadingParams.amount) * 0.9
        ) {
          setSwapStatus(1);
          dispatch(getStafiHubBalanceAll());
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
