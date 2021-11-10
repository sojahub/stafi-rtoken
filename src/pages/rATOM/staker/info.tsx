import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Content from 'src/components/content/stakeInfoContent';
import {
  accountUnbonds,
  getLastEraRate,
  getUnbondCommission,
  query_rBalances_account,
  rTokenRate,
  setRatioShow,
} from 'src/features/rATOMClice';
import NumberUtil from 'src/util/numberUtil';
import qs from 'querystring';
import { useHistory } from 'react-router';
import CommonClice from 'src/features/commonClice';
import { getRATOMAssetBalance as getBEP20RATOMAssetBalance } from 'src/features/BSCClice';
import { getRATOMAssetBalance as getERC20RATOMAssetBalance } from 'src/features/ETHClice';

const commonClice = new CommonClice();

export default function Index(props: any) {
  const dispatch = useDispatch();
  const history = useHistory();

  let platform = 'Native';
  if (history.location.search) {
    platform = qs.parse(history.location.search.slice(1)).platform as string;
  }

  const { ratio, ratioShow, totalUnbonding } = useSelector((state: any) => {
    return {
      ratio: state.rATOMModule.ratio,
      ratioShow: state.rATOMModule.ratioShow,
      totalUnbonding: state.rATOMModule.totalUnbonding,
    };
  });

  const { tokenAmount, lastEraRate, redeemableTokenAmount, metaMaskNetworkId } = useSelector((state: any) => {
    const tokenAmount =
      platform === 'Native'
        ? state.rATOMModule.tokenAmount
        : platform === 'ERC20'
        ? state.ETHModule.ercRATOMBalance
        : platform === 'BEP20'
        ? state.BSCModule.bepRATOMBalance
        : '--';

    return {
      metaMaskNetworkId: state.globalModule.metaMaskNetworkId,
      tokenAmount,
      lastEraRate: state.rATOMModule.lastEraRate,
      redeemableTokenAmount: commonClice.getWillAmount(
        state.rATOMModule.ratio,
        state.rATOMModule.unbondCommission,
        tokenAmount,
      ),
    };
  });

  useEffect(() => {
    dispatch(rTokenRate());
    dispatch(accountUnbonds());
    dispatch(getUnbondCommission());
    dispatch(getLastEraRate());
  }, []);

  useEffect(() => {
    if (platform === 'Native') {
      dispatch(query_rBalances_account());
    } else if (platform === 'ERC20') {
      dispatch(getERC20RATOMAssetBalance());
    } else if (platform === 'BEP20') {
      dispatch(getBEP20RATOMAssetBalance());
    }
  }, [platform, metaMaskNetworkId]);

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
        props.history.push('/rATOM/staker/index');
      }}
      onRdeemClick={() => {
        props.history.push('/rATOM/staker/redeem');
      }}
      onUniswapClick={() => {
        window.open('');
      }}
      onSwapClick={() => {
        props.history.push({
          pathname: '/rAsset/swap/native/default',
          state: {
            rSymbol: 'rATOM',
          },
        });
      }}
      hours={24}
      type='rATOM'></Content>
  );
}