import qs from 'querystring';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Content from 'src/components/content/stakeInfoContent';
import { getRDOTAssetBalance as getBEP20RDOTAssetBalance } from 'src/features/BSCClice';
import CommonClice from 'src/features/commonClice';
import { getRDOTAssetBalance as getERC20RDOTAssetBalance } from 'src/features/ETHClice';
import {
  accountUnbonds,
  getLastEraRate,
  getUnbondCommission,
  query_rBalances_account,
  setRatioShow,
} from 'src/features/rDOTClice';
import { useMetaMaskAccount } from 'src/hooks/useMetaMaskAccount';
import NumberUtil from 'src/util/numberUtil';

const commonClice = new CommonClice();

export default function Index(props: any) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { metaMaskAddress, metaMaskNetworkId } = useMetaMaskAccount();

  let platform = 'Native';
  if (history.location.search) {
    platform = qs.parse(history.location.search.slice(1)).platform as string;
  }

  const { ratio, tokenAmount, ratioShow, totalUnbonding, redeemableTokenAmount } = useSelector((state: any) => {
    const tokenAmount =
      platform === 'Native'
        ? state.rDOTModule.tokenAmount
        : platform === 'ERC20'
        ? state.ETHModule.ercRDOTBalance
        : platform === 'BEP20'
        ? state.BSCModule.bepRDOTBalance
        : '--';
    return {
      ratio: state.rDOTModule.ratio,
      tokenAmount,
      ratioShow: state.rDOTModule.ratioShow,
      totalUnbonding: state.rDOTModule.totalUnbonding,
      redeemableTokenAmount: commonClice.getWillAmount(
        state.rDOTModule.ratio,
        state.rDOTModule.unbondCommission,
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
    dispatch(accountUnbonds());
    dispatch(getLastEraRate());
    dispatch(getUnbondCommission());
  }, [fisAddress, dispatch]);

  useEffect(() => {
    if (platform === 'Native') {
      dispatch(query_rBalances_account());
    } else if (platform === 'ERC20') {
      dispatch(getERC20RDOTAssetBalance());
    } else if (platform === 'BEP20') {
      dispatch(getBEP20RDOTAssetBalance());
    }
  }, [dispatch, platform, metaMaskNetworkId, fisAddress, metaMaskAddress]);

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
  }, [dispatch, ratio]);

  return (
    <Content
      ratio={ratio}
      ratioShow={ratioShow}
      tokenAmount={tokenAmount}
      totalUnbonding={totalUnbonding}
      platform={platform}
      redeemableTokenAmount={redeemableTokenAmount}
      onStakeClick={() => {
        props.history.push('/rDOT/staker/index');
      }}
      onRdeemClick={() => {
        props.history.push(`/rDOT/staker/redeem`);
      }}
      onUniswapClick={() => {
        //
      }}
      onSwapClick={() => {
        props.history.push('/rAsset/swap/rDOT?first=native');
      }}
      hours={24}
      type='rDOT'></Content>
  );
}
