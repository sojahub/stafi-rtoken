import { message } from 'antd';
import PubSub from 'pubsub-js';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Content from 'src/components/content/stakeContent_DOT';
import { STAFI_CHAIN_ID } from 'src/features/bridgeClice';
import { setProcessSlider } from 'src/features/globalClice';
import { balancesAll, rTokenLedger, rTokenRate, transfer } from 'src/features/rKSMClice';
import { ratioToAmount } from 'src/util/common';
import NumberUtil from 'src/util/numberUtil';

export default function Index(props: any) {
  const dispatch = useDispatch();

  const [amount, setAmount] = useState<any>();
  useEffect(() => {
    dispatch(balancesAll());
    dispatch(rTokenRate());
    dispatch(rTokenLedger());
  }, []);
  const { transferrableAmount, ratio, stafiStakerApr, fisCompare, validPools, totalIssuance, bondFees } = useSelector(
    (state: any) => {
      const fisCompare =
        NumberUtil.fisAmountToChain(state.FISModule.fisAccount && state.FISModule.fisAccount.balance) <
        state.rKSMModule.bondFees + state.FISModule.estimateBondTxFees;
      return {
        transferrableAmount: state.rKSMModule.transferrableAmountShow,
        ratio: state.rKSMModule.ratio,
        stafiStakerApr: state.rKSMModule.stakerApr,
        fisCompare: fisCompare,
        validPools: state.rKSMModule.validPools,
        totalIssuance: state.rKSMModule.totalIssuance,
        bondFees: state.rKSMModule.bondFees,
      };
    },
  );

  return (
    <Content
      amount={amount}
      willAmount={ratio == '--' ? '--' : ratioToAmount(amount, ratio)}
      unit={'KSM'}
      transferrableAmount={transferrableAmount}
      apr={stafiStakerApr}
      onChange={(value: any) => {
        setAmount(value);
      }}
      onRecovery={() => {
        props.history.push('/rKSM/search');
      }}
      validPools={validPools}
      bondFees={NumberUtil.fisAmountToHuman(bondFees) || '--'}
      totalStakedToken={NumberUtil.handleFisAmountToFixed(totalIssuance * ratio)}
      onStakeClick={(chainId: number, targetAddress: string) => {
        if (amount) {
          dispatch(
            transfer(Number(amount).toString(), chainId, targetAddress, () => {
              dispatch(setProcessSlider(false));
              if (chainId === STAFI_CHAIN_ID) {
                props.history.push('/rKSM/staker/info');
              } else {
                PubSub.publish('stakeSuccess');
              }
            }),
          );
        } else {
          message.error('Please enter the amount');
        }
      }}
      type='rKSM'></Content>
  );
}
