import { message } from 'antd';
import qs from 'querystring';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Content from 'src/components/content/stakeInfoContent';
import { getRETHAssetBalance as getBEP20RETHAssetBalance } from 'src/features/BSCClice';
import { getETHAssetBalance as getRETHErc20Allowance } from 'src/features/ETHClice';
import { getLastEraRate, rTokenRate, setRatioShow } from 'src/features/rETHClice';
import NumberUtil from 'src/util/numberUtil';

export default function Index(props: any) {
  const dispatch = useDispatch();
  const history = useHistory();

  let platform = 'ERC20';
  if (history.location.search) {
    platform = qs.parse(history.location.search.slice(1)).platform as string;
  }

  const { ratio, tokenAmount, ratioShow, lastEraRate, metaMaskNetworkId } = useSelector((state: any) => {
    return {
      metaMaskNetworkId: state.globalModule.metaMaskNetworkId,
      ratio: state.rETHModule.ratio,
      ratioShow: state.rETHModule.ratioShow,
      tokenAmount:
        platform === 'Native'
          ? state.rETHModule.rethAmount
          : platform === 'ERC20'
          ? state.ETHModule.ercETHBalance
          : platform === 'BEP20'
          ? state.BSCModule.bepRETHBalance
          : '--',
      lastEraRate: state.rETHModule.lastEraRate,
    };
  });

  useEffect(() => {
    dispatch(rTokenRate());
    dispatch(getLastEraRate());
  }, []);

  useEffect(() => {
    if (platform === 'ERC20') {
      setTimeout(() => {
        dispatch(getRETHErc20Allowance());
      }, 500);
    } else if (platform === 'BEP20') {
      setTimeout(() => {
        dispatch(getBEP20RETHAssetBalance());
      }, 500);
    }
  }, [platform, metaMaskNetworkId]);

  useEffect(() => {
    let count = 0;
    let totalCount = 10;
    let ratioAmount = 0;
    let piece = ratio / totalCount;

    if (ratio != '--') {
      let interval = setInterval(() => {
        count++;
        ratioAmount += piece;
        if (count == totalCount) {
          ratioAmount = ratio;
          window.clearInterval(interval);
        }
        dispatch(setRatioShow(NumberUtil.handleFisAmountRateToFixed(ratioAmount)));
      }, 100);
    }
  }, [ratio]);

  return (
    <Content
      ratio={NumberUtil.handleEthAmountRateToFixed(ratio)}
      ratioShow={ratioShow}
      tokenAmount={tokenAmount}
      totalUnbonding={0}
      lastEraRate={lastEraRate}
      platform={platform}
      redeemableTokenAmount={'0'}
      onStakeClick={() => {
        props.history.push('/rETH/staker/index');
      }}
      onRdeemClick={() => {
        message.info('Redeem Function will be supported once ETH2.0 Phase 1.5 is released');
      }}
      onUniswapClick={() => {
        //
      }}
      hours={8}
      type='rETH'></Content>
  );
}
