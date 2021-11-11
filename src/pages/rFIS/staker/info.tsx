import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Content from 'src/components/content/stakeInfoContent';
import {
  getLastEraRate,
  getUnbondCommission,
  query_rBalances_account,
  RefreshUnbonding,
  rTokenRate,
  setRatioShow,
} from 'src/features/FISClice';
import CommonClice from 'src/features/commonClice';
import NumberUtil from 'src/util/numberUtil';
import qs from 'querystring';
import { getFISAssetBalance as getBEP20FISAssetBalance } from 'src/features/BSCClice';
import { getFISAssetBalance as getERC20FISAssetBalance } from 'src/features/ETHClice';
import { difference } from 'lodash';

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
      ratio: state.FISModule.ratio,
      ratioShow: state.FISModule.ratioShow,
      totalUnbonding: state.FISModule.unbondingToken,
    };
  });

  const { tokenAmount, lastEraRate, redeemableTokenAmount, metaMaskNetworkId } = useSelector((state: any) => {
    const tokenAmount =
      platform === 'Native'
        ? state.FISModule.tokenAmount
        : platform === 'ERC20'
        ? state.ETHModule.ercFISBalance
        : platform === 'BEP20'
        ? state.BSCModule.bepFISBalance
        : '--';

    return {
      metaMaskNetworkId: state.globalModule.metaMaskNetworkId,
      tokenAmount,
      lastEraRate: state.FISModule.lastEraRate,
      redeemableTokenAmount: commonClice.getWillAmount(
        state.FISModule.ratio,
        state.FISModule.unbondCommission,
        tokenAmount,
      ),
    };
  });

  const { fisAddress } = useSelector((state: any) => {
    return {
      fisAddress: state.FISModule.fisAccount && state.FISModule.fisAccount.address,
    };
  });

  useEffect(() => {
    dispatch(RefreshUnbonding());
    dispatch(rTokenRate());
    dispatch(getLastEraRate());
    dispatch(getUnbondCommission());
  }, [fisAddress, dispatch]);

  useEffect(() => {
    if (platform === 'Native') {
      dispatch(query_rBalances_account());
    } else if (platform === 'ERC20') {
      dispatch(getERC20FISAssetBalance());
    } else if (platform === 'BEP20') {
      dispatch(getBEP20FISAssetBalance());
    }
  }, [platform, metaMaskNetworkId, fisAddress, dispatch]);

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
        props.history.push('/rFIS/staker/index');
      }}
      onRdeemClick={() => {
        props.history.push('/rFIS/staker/redeem');
      }}
      onUniswapClick={() => {
        //
      }}
      onSwapClick={() => {
        props.history.push({
          pathname: '/rAsset/swap/native/default',
          state: {
            rSymbol: 'rFIS',
          },
        });
      }}
      hours={6}
      type='rFIS'></Content>
  );
}
