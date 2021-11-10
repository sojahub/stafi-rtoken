import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Content from 'src/components/content/stakeInfoContent';
import { accountUnbonds, query_rBalances_account, rTokenRate, setRatioShow } from 'src/features/rMATICClice';
import NumberUtil from 'src/util/numberUtil';

export default function Index(props: any) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(query_rBalances_account());
    dispatch(rTokenRate());
    dispatch(accountUnbonds());
  }, []);

  const { ratio, tokenAmount, ratioShow, totalUnbonding } = useSelector((state: any) => {
    return {
      ratio: state.rMATICModule.ratio,
      tokenAmount: state.rMATICModule.tokenAmount,
      ratioShow: state.rMATICModule.ratioShow,
      totalUnbonding: state.rMATICModule.totalUnbonding,
    };
  });

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
