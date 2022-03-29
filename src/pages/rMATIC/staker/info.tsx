import qs from 'querystring';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Content from 'src/components/content/stakeInfoContent';
import { getRMATICAssetBalance as getBEP20RMATICAssetBalance } from 'src/features/BSCClice';
import CommonClice from 'src/features/commonClice';
import { getRMaticAssetBalance as getERC20RMATICAssetBalance } from 'src/features/ETHClice';
import {
  accountUnbonds,
  getLastEraRate,
  getUnbondCommission,
  query_rBalances_account,
  setRatioShow,
} from 'src/features/rMATICClice';
import NumberUtil from 'src/util/numberUtil';
import { useMetaMaskAccount } from 'src/hooks/useMetaMaskAccount';
import config from 'src/config';

const commonClice = new CommonClice();

export default function Index(props: any) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { metaMaskAddress, metaMaskNetworkId } = useMetaMaskAccount();

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

  const { tokenAmount, redeemableTokenAmount } = useSelector((state: any) => {
    const tokenAmount =
      platform === 'Native'
        ? state.rMATICModule.tokenAmount
        : platform === 'ERC20'
        ? state.ETHModule.ercRMaticBalance
        : platform === 'BEP20'
        ? state.BSCModule.bepRMATICBalance
        : '--';

    return {
      tokenAmount,
      redeemableTokenAmount: commonClice.getWillAmount(
        state.rMATICModule.ratio,
        state.rMATICModule.unbondCommission,
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
    dispatch(getUnbondCommission());
    dispatch(getLastEraRate());
  }, [fisAddress, dispatch]);

  useEffect(() => {
    if (platform === 'Native') {
      dispatch(query_rBalances_account());
    } else if (platform === 'ERC20' && config.metaMaskNetworkIsGoerliEth(metaMaskNetworkId)) {
      dispatch(getERC20RMATICAssetBalance());
    } else if (platform === 'BEP20' && config.metaMaskNetworkIsBsc(metaMaskNetworkId)) {
      dispatch(getBEP20RMATICAssetBalance());
    }
  }, [platform, metaMaskNetworkId, fisAddress, metaMaskAddress, dispatch]);

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
      ratio={ratio}
      ratioShow={ratioShow}
      tokenAmount={tokenAmount}
      totalUnbonding={totalUnbonding}
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
        props.history.push('/rAsset/swap/rMATIC?first=native');
      }}
      hours={24}
      type='rMATIC'></Content>
  );
}
