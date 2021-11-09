import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Content from 'src/components/content/stakeInfoContent';
import {
  accountUnbonds,
  getLastEraRate,
  getUnbondCommission,
  query_rBalances_account,
  rTokenRate,
  setRatioShow,
} from 'src/features/rBNBClice';
import NumberUtil from 'src/util/numberUtil';
import qs from 'querystring';
import CommonClice from 'src/features/commonClice';
import { getRBNBAssetBalance } from 'src/features/BSCClice';

const commonClice = new CommonClice();

export default function Index(props: any) {
  const dispatch = useDispatch();
  const history = useHistory();

  let platform = 'Native';
  if (history.location.search) {
    platform = qs.parse(history.location.search.slice(1)).platform as string;
  }

  useEffect(() => {
    dispatch(query_rBalances_account());
    dispatch(rTokenRate());
    dispatch(accountUnbonds());
    dispatch(getUnbondCommission());
    dispatch(getLastEraRate());
  }, []);

  const { ratio, tokenAmount, ratioShow, totalUnbonding, metaMaskNetworkId, lastEraRate, redeemableTokenAmount } =
    useSelector((state: any) => {
      const tokenAmount =
        platform === 'Native'
          ? state.rBNBModule.tokenAmount
          : platform === 'BEP20'
          ? state.BSCModule.bepRBNBBalance
          : '--';
      return {
        ratio: state.rBNBModule.ratio,
        tokenAmount,
        ratioShow: state.rBNBModule.ratioShow,
        totalUnbonding: state.rBNBModule.totalUnbonding,
        lastEraRate: state.rBNBModule.lastEraRate,
        redeemableTokenAmount: commonClice.getWillAmount(
          state.rBNBModule.ratio,
          state.rBNBModule.unbondCommission,
          tokenAmount,
        ),
        metaMaskNetworkId: state.globalModule.metaMaskNetworkId,
      };
    });

  useEffect(() => {
    if (platform === 'Native') {
      dispatch(query_rBalances_account());
    } else if (platform === 'BEP20') {
      dispatch(getRBNBAssetBalance());
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
      ratio={ratio}
      ratioShow={ratioShow}
      tokenAmount={tokenAmount}
      totalUnbonding={totalUnbonding}
      lastEraRate={lastEraRate}
      platform={platform}
      redeemableTokenAmount={redeemableTokenAmount}
      onStakeClick={() => {
        props.history.push('/rBNB/staker/index');
      }}
      onRdeemClick={() => {
        props.history.push('/rBNB/staker/redeem');
      }}
      onUniswapClick={() => {
        window.open('');
      }}
      onSwapClick={() => {
        props.history.push({
          pathname: '/rAsset/swap/native/default',
          state: {
            rSymbol: 'rBNB',
          },
        });
      }}
      hours={24}
      type='rBNB'></Content>
  );
}
