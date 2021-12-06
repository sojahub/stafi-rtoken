import { message } from 'antd';
import qs from 'querystring';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Content from 'src/components/content/stakeInfoContent';
import { getRETHAssetBalance as getBEP20RETHAssetBalance } from 'src/features/BSCClice';
import { getETHAssetBalance } from 'src/features/ETHClice';
import { getLastEraRate, setRatioShow } from 'src/features/rETHClice';
import { useMetaMaskAccount } from 'src/hooks/useMetaMaskAccount';
import NumberUtil from 'src/util/numberUtil';

export default function Index(props: any) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { metaMaskAddress, metaMaskNetworkId } = useMetaMaskAccount();

  let platform = 'ERC20';
  if (history.location.search) {
    platform = qs.parse(history.location.search.slice(1)).platform as string;
  }

  const { ratio, tokenAmount, ratioShow } = useSelector((state: any) => {
    return {
      ratio: state.rETHModule.ratio,
      ratioShow: state.rETHModule.ratioShow,
      tokenAmount:
        platform === 'ERC20'
          ? state.ETHModule.ercETHBalance
          : platform === 'BEP20'
          ? state.BSCModule.bepRETHBalance
          : '--',
    };
  });

  useEffect(() => {
    dispatch(getLastEraRate());
  }, [dispatch]);

  useEffect(() => {
    if (platform === 'ERC20') {
      setTimeout(() => {
        dispatch(getETHAssetBalance());
      }, 500);
    } else if (platform === 'BEP20') {
      setTimeout(() => {
        dispatch(getBEP20RETHAssetBalance());
      }, 500);
    }
  }, [platform, metaMaskNetworkId, metaMaskAddress, dispatch]);

  useEffect(() => {
    let count = 0;
    let totalCount = 10;
    let ratioAmount = 0;
    let piece = ratio / totalCount;

    if (ratio !== '--') {
      let interval = setInterval(() => {
        count++;
        ratioAmount += piece;
        if (count === totalCount) {
          ratioAmount = ratio;
          window.clearInterval(interval);
        }
        dispatch(setRatioShow(NumberUtil.handleFisAmountRateToFixed(ratioAmount)));
      }, 100);
    }
  }, [ratio, dispatch]);

  return (
    <Content
      ratio={NumberUtil.handleEthAmountRateToFixed(ratio)}
      ratioShow={ratioShow}
      tokenAmount={tokenAmount}
      totalUnbonding={0}
      platform={platform}
      redeemableTokenAmount={'0'}
      onStakeClick={() => {
        props.history.push('/rETH/staker/index');
      }}
      onRdeemClick={() => {
        message.info('Redemption will be supported once ETH2.0 Phase 1.5 is released');
      }}
      onUniswapClick={() => {
        //
      }}
      hours={8}
      type='rETH'></Content>
  );
}
