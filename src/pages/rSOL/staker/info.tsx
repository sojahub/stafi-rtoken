import qs from 'querystring';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Content from 'src/components/content/stakeInfoContent';
import CommonClice from 'src/features/commonClice';
import {
  accountUnbonds,
  getLastEraRate,
  getUnbondCommission,
  query_rBalances_account,
  rTokenRate,
  setRatioShow,
} from 'src/features/rSOLClice';
import { getRSOLAssetBalance } from 'src/features/SOLClice';
import NumberUtil from 'src/util/numberUtil';

const commonClice = new CommonClice();

export default function Index(props: any) {
  const dispatch = useDispatch();
  const history = useHistory();

  let platform = 'Native';
  if (history.location.search) {
    platform = qs.parse(history.location.search.slice(1)).platform as string;
  }

  const { ratio, tokenAmount, ratioShow, totalUnbonding, redeemableTokenAmount } = useSelector((state: any) => {
    const tokenAmount =
      platform === 'Native' ? state.rSOLModule.tokenAmount : platform === 'SPL' ? state.SOLModule.rSOLBalance : '--';
    return {
      ratio: state.rSOLModule.ratio,
      tokenAmount,
      ratioShow: state.rSOLModule.ratioShow,
      totalUnbonding: state.rSOLModule.totalUnbonding,
      redeemableTokenAmount: commonClice.getWillAmount(
        state.rSOLModule.ratio,
        state.rSOLModule.unbondCommission,
        tokenAmount,
      ),
    };
  });

  const { fisAddress, solAddress } = useSelector((state: any) => {
    return {
      fisAddress: state.FISModule.fisAccount && state.FISModule.fisAccount.address,
      solAddress: state.SOLModule.solAccount && state.SOLModule.solAccount.address,
    };
  });

  useEffect(() => {
    dispatch(rTokenRate());
    dispatch(accountUnbonds());
    dispatch(getLastEraRate());
    dispatch(getUnbondCommission());
  }, [fisAddress, dispatch]);

  useEffect(() => {
    if (platform === 'Native') {
      dispatch(query_rBalances_account());
    } else if (platform === 'SPL') {
      dispatch(getRSOLAssetBalance());
    }
  }, [platform, fisAddress, solAddress, dispatch]);

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
      hours={66}
      ratioShow={ratioShow}
      tokenAmount={tokenAmount}
      totalUnbonding={totalUnbonding}
      platform={platform}
      redeemableTokenAmount={redeemableTokenAmount}
      onStakeClick={() => {
        props.history.push('/rSOL/staker/index');
      }}
      onRdeemClick={() => {
        props.history.push(`/rSOL/staker/redeem`);
      }}
      onUniswapClick={() => {
        window.open('');
      }}
      onSwapClick={() => {
        props.history.push({
          pathname: '/rAsset/swap/native/default',
          state: {
            rSymbol: 'rSOL',
          },
        });
      }}
      type='rSOL'></Content>
  );
}
