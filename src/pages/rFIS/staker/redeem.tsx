import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Content from 'src/components/content/redeemContent_FIS';
import {
  getUnbondCommission,
  query_rBalances_account,
  RefreshUnbonding,
  rTokenRate,
  unbond,
  unbondFees,
  withdraw,
} from 'src/features/FISClice';
import { setLoading } from 'src/features/globalClice';
import NumberUtil from 'src/util/numberUtil';

export default function Index(props: any) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [recipient, setRecipient] = useState<string>();
  const [amount, setAmount] = useState<any>();

  const {
    tokenAmount,
    unbondCommission,
    ratio,
    withdrawToken,
    fisFee,
    address,
    willAmount,
    estimateUnBondTxFees,
    fisBalance,
    validPools,
    leftDays,
    unbondingToken,
    unbondWarn,
  } = useSelector((state: any) => {
    let willAmount: any = 0;
    let unbondCommission: any = 0;
    let ratio = state.FISModule.ratio;
    let tokenAmount = state.FISModule.tokenAmount;

    if (ratio && state.FISModule.unbondCommission && amount) {
      let returnValue = amount * (1 - state.FISModule.unbondCommission);
      unbondCommission = amount * state.FISModule.unbondCommission;
      willAmount = NumberUtil.handleFisAmountToFixed(returnValue * ratio);
    }

    return {
      ratio: ratio,
      tokenAmount: tokenAmount,
      unbondCommission: unbondCommission,
      fisFee: state.FISModule.unbondCommission,
      address: state.FISModule.fisAccount.address,
      willAmount: willAmount,
      estimateUnBondTxFees: state.FISModule.estimateUnBondTxFees,
      fisBalance: state.FISModule.fisAccount.balance,
      leftDays: state.FISModule.leftDays,
      unbondingToken: state.FISModule.unbondingToken,
      withdrawToken: state.FISModule.withdrawToken,
      validPools: state.FISModule.validPools,
      unbondWarn: state.FISModule.unbondWarn,
    };
  });
  useEffect(() => {
    setRecipient(address);
  }, [address]);
  useEffect(() => {
    dispatch(query_rBalances_account());
    dispatch(getUnbondCommission());
    dispatch(rTokenRate());
    dispatch(unbondFees());
    dispatch(RefreshUnbonding());
    return () => {
      dispatch(setLoading(false));
    };
  }, []);
  return (
    <>
      <Content
        history={props.history}
        amount={amount}
        tokenAmount={tokenAmount}
        onAmountChange={(e: string) => {
          setAmount(e);
        }}
        fisFee={fisFee}
        leftDays={leftDays}
        unbondingToken={unbondingToken}
        withdrawToken={withdrawToken}
        validPools={validPools}
        unbondWarn={unbondWarn}
        willAmount={willAmount}
        onRdeemClick={() => {
          dispatch(
            unbond(amount, willAmount, () => {
              setAmount(undefined);
              history.push('/rFIS/staker/unbondRecords');
            }),
          );
        }}
        onWithdrawClick={() => {
          dispatch(withdraw(() => {}));
        }}
      />
    </>
  );
}
