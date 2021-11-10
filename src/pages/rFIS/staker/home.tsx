import { message } from 'antd';
import PubSub from 'pubsub-js';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Content from 'src/components/content/stakeContent_DOT';
import { STAFI_CHAIN_ID } from 'src/features/bridgeClice';
import { balancesAll, rTokenLedger, rTokenRate, transfer } from 'src/features/FISClice';
import { RootState } from 'src/store';
import { ratioToAmount } from 'src/util/common';
import { default as NumberUtil } from 'src/util/numberUtil';

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
      onStakeClick={(chainId: number, targetAddress: string) => {
        if (amount) {
          dispatch(
            transfer(Number(amount), chainId, targetAddress, () => {
              if (chainId === STAFI_CHAIN_ID) {
                props.history.push('/rFIS/staker/info');
              } else {
                PubSub.publish('stakeSuccess');
              }
            }),
          );
        } else {
          message.error('Please enter the amount');
        }
      }}
      type='rFIS'></Content>
  );
}
