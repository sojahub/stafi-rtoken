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
} from 'src/features/rMATICClice';
import NumberUtil from 'src/util/numberUtil';
import qs from 'querystring';
import { getRMATICAssetBalance as getBEP20RMATICAssetBalance } from 'src/features/BSCClice';
import { getRMaticAssetBalance as getERC20RMATICAssetBalance } from 'src/features/ETHClice';
import CommonClice from 'src/features/commonClice';

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
      ratio: state.rMATICModule.ratio,
      ratioShow: state.rMATICModule.ratioShow,
      totalUnbonding: state.rMATICModule.totalUnbonding,
    };
  });

  const { tokenAmount, lastEraRate, redeemableTokenAmount, metaMaskNetworkId } = useSelector((state: any) => {
    const tokenAmount =
      platform === 'Native'
        ? state.rMATICModule.tokenAmount
        : platform === 'ERC20'
        ? state.ETHModule.ercRMATICBalance
        : platform === 'BEP20'
        ? state.BSCModule.bepRMATICBalance
        : '--';

    return {
      metaMaskNetworkId: state.globalModule.metaMaskNetworkId,
      tokenAmount,
      lastEraRate: state.rMATICModule.lastEraRate,
      redeemableTokenAmount: commonClice.getWillAmount(
        state.rMATICModule.ratio,
        state.rMATICModule.unbondCommission,
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
      dispatch(getERC20RMATICAssetBalance());
    } else if (platform === 'BEP20') {
      dispatch(getBEP20RMATICAssetBalance());
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
        props.history.push('/rMATIC/staker/index');
      }}
      onRdeemClick={() => {
        props.history.push('/rMATIC/staker/redeem');
      }}
      onUniswapClick={() => {
        window.open('');
      }}
      onSwapClick={() => {
        props.history.push({
          pathname: '/rAsset/swap/native/default',
          state: {
            rSymbol: 'rMATIC',
          },
        });
      }}
      hours={24}
      type='rMATIC'></Content>
  );
}
