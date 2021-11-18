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
  rTokenRate,
  setRatioShow,
} from 'src/features/rDOTClice';
import NumberUtil from 'src/util/numberUtil';

const commonClice = new CommonClice();

export default function Index(props: any) {
  const dispatch = useDispatch();
  const history = useHistory();

  let platform = 'Native';
  if (history.location.search) {
    platform = qs.parse(history.location.search.slice(1)).platform as string;
  }

  const { metaMaskNetworkId, ratio, tokenAmount, ratioShow, totalUnbonding, lastEraRate, redeemableTokenAmount } =
    useSelector((state: any) => {
      const tokenAmount =
        platform === 'Native'
          ? state.rDOTModule.tokenAmount
          : platform === 'ERC20'
          ? state.ETHModule.ercRDOTBalance
          : platform === 'BEP20'
          ? state.BSCModule.bepRDOTBalance
          : '--';
      return {
        metaMaskNetworkId: state.globalModule.metaMaskNetworkId,
        ratio: state.rDOTModule.ratio,
        tokenAmount,
        ratioShow: state.rDOTModule.ratioShow,
        totalUnbonding: state.rDOTModule.totalUnbonding,
        lastEraRate: state.rDOTModule.lastEraRate,
        redeemableTokenAmount: commonClice.getWillAmount(
          state.rDOTModule.ratio,
          state.rDOTModule.unbondCommission,
          tokenAmount,
        ),
      };
    });

  const { fisAddress, ethAddress } = useSelector((state: any) => {
    return {
      fisAddress: state.FISModule.fisAccount && state.FISModule.fisAccount.address,
      ethAddress: state.rETHModule.ethAccount && state.rETHModule.ethAccount.address,
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
    } else if (platform === 'ERC20') {
      dispatch(getERC20RDOTAssetBalance());
    } else if (platform === 'BEP20') {
      dispatch(getBEP20RDOTAssetBalance());
    }
  }, [dispatch, platform, metaMaskNetworkId, fisAddress, ethAddress]);

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
        props.history.push('/rDOT/staker/index');
      }}
      onRdeemClick={() => {
        props.history.push(`/rDOT/staker/redeem`);
      }}
      onUniswapClick={() => {
        //
      }}
      onSwapClick={() => {
        props.history.push({
          pathname: '/rAsset/swap/native/default',
          state: {
            rSymbol: 'rDOT',
          },
        });
      }}
      hours={24}
      type='rDOT'></Content>
  );
}
