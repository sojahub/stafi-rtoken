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
} from 'src/features/rKSMClice';
import NumberUtil from 'src/util/numberUtil';
import qs from 'querystring';
import CommonClice from 'src/features/commonClice';
import { getRKSMAssetBalance as getBEP20RKSMAssetBalance } from 'src/features/BSCClice';
import { getRKSMAssetBalance as getERC20RKSMAssetBalance } from 'src/features/ETHClice';

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
      ratio: state.rKSMModule.ratio,
      ratioShow: state.rKSMModule.ratioShow,
      totalUnbonding: state.rKSMModule.totalUnbonding,
    };
  });

  const { tokenAmount, lastEraRate, redeemableTokenAmount, metaMaskNetworkId } = useSelector((state: any) => {
    const tokenAmount =
      platform === 'Native'
        ? state.rKSMModule.tokenAmount
        : platform === 'ERC20'
        ? state.ETHModule.ercRKSMBalance
        : platform === 'BEP20'
        ? state.BSCModule.bepRKSMBalance
        : '--';

    return {
      metaMaskNetworkId: state.globalModule.metaMaskNetworkId,
      tokenAmount,
      lastEraRate: state.rKSMModule.lastEraRate,
      redeemableTokenAmount: commonClice.getWillAmount(
        state.rKSMModule.ratio,
        state.rKSMModule.unbondCommission,
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
    dispatch(rTokenRate());
    dispatch(accountUnbonds());
    dispatch(getUnbondCommission());
    dispatch(getLastEraRate());
  }, [fisAddress, dispatch]);

  useEffect(() => {
    if (platform === 'Native') {
      dispatch(query_rBalances_account());
    } else if (platform === 'ERC20') {
      dispatch(getERC20RKSMAssetBalance());
    } else if (platform === 'BEP20') {
      dispatch(getBEP20RKSMAssetBalance());
    }
  }, [platform, metaMaskNetworkId, fisAddress, dispatch]);

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
        props.history.push('/rKSM/staker/index');
      }}
      onRdeemClick={() => {
        props.history.push('/rKSM/staker/redeem');
      }}
      onUniswapClick={() => {
        window.open('');
      }}
      onSwapClick={() => {
        props.history.push({
          pathname: '/rAsset/swap/native/default',
          state: {
            rSymbol: 'rKSM',
          },
        });
      }}
      hours={6}
      type='rKSM'></Content>
  );
}
