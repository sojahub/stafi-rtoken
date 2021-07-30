import Content from '@components/content/stakeContent_DOT';
import { balancesAll, rTokenLedger, rTokenRate, transfer } from '@features/FISClice';
import { ratioToAmount } from '@util/common';
import NumberUtil from '@util/numberUtil';
import { message } from 'antd';
import { RootState } from 'app/store';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function Index(props: any) {
  const dispatch = useDispatch();

  const [amount, setAmount] = useState<any>();
  useEffect(() => {
    dispatch(balancesAll());
    dispatch(rTokenRate());
    dispatch(rTokenLedger());
  }, []);

  const { transferrableAmount, ratio, stakerApr, fisCompare, validPools, totalIssuance, bondFees } = useSelector(
    (state: RootState) => {
      const fisCompare =
        Number(NumberUtil.fisAmountToChain(state.FISModule.fisAccount.balance)) <
        Number(state.FISModule.bondFees + state.FISModule.estimateBondTxFees);
      return {
        transferrableAmount: state.FISModule.transferrableAmountShow,
        ratio: state.FISModule.ratio,
        stakerApr: state.FISModule.stakerApr,
        fisCompare: fisCompare,
        validPools: state.FISModule.validPools,
        totalIssuance: state.FISModule.totalIssuance,
        bondFees: state.FISModule.bondFees,
      };
    },
  );

  return (
    <Content
      amount={amount}
      willAmount={ratio == '--' ? '--' : ratioToAmount(amount, Number(ratio))}
      unit={'FIS'}
      transferrableAmount={transferrableAmount}
      apr={stakerApr}
      onChange={(value: any) => {
        setAmount(value);
      }}
      bondFees={NumberUtil.fisAmountToHuman(bondFees) || '--'}
      onRecovery={() => {
        props.history.push('/rFIS/search');
      }}
      validPools={validPools}
      totalStakedToken={NumberUtil.handleFisAmountToFixed(Number(totalIssuance) * Number(ratio)) || '--'}
      onStakeClick={() => {
        if (amount) {
          if (fisCompare) {
            message.error('No enough FIS to pay for the fee');
            return;
          }
          dispatch(
            transfer(amount, () => {
              props.history.push('/rFIS/staker/info');
            }),
          );
        } else {
          message.error('Please enter the amount');
        }
      }}
      type='rFIS'></Content>
  );
}
