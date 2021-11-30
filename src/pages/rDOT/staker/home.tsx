import { message } from 'antd';
import PubSub from 'pubsub-js';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Content from 'src/components/content/stakeContent_DOT';
import { STAFI_CHAIN_ID } from 'src/features/bridgeClice';
import { setProcessSlider } from 'src/features/globalClice';
import { balancesAll, rTokenLedger, rTokenRate, transfer } from 'src/features/rDOTClice';
import { ratioToAmount } from 'src/util/common';
import NumberUtil from 'src/util/numberUtil';

export default function Index(props: any) {
  const dispatch = useDispatch();

  const [amount, setAmount] = useState<any>();
  useEffect(() => {
    dispatch(balancesAll());
    dispatch(rTokenLedger());
  }, []);

  const { transferrableAmount, ratio, stafiStakerApr, fisCompare, validPools, totalIssuance, bondFees } = useSelector(
    (state: any) => {
      const fisCompare =
        NumberUtil.fisAmountToChain(state.FISModule.fisAccount.balance) <
        state.rDOTModule.bondFees + state.FISModule.estimateBondTxFees;
      return {
        transferrableAmount: state.rDOTModule.transferrableAmountShow,
        ratio: state.rDOTModule.ratio,
        stafiStakerApr: state.rDOTModule.stakerApr,
        fisCompare: fisCompare,
        validPools: state.rDOTModule.validPools,
        totalIssuance: state.rDOTModule.totalIssuance,
        bondFees: state.rDOTModule.bondFees,
      };
    },
  );

  return (
    <Content
      amount={amount}
      willAmount={ratio == '--' ? '--' : ratioToAmount(amount, ratio)}
      unit={'DOT'}
      transferrableAmount={transferrableAmount}
      apr={stafiStakerApr}
      onChange={(value: any) => {
        setAmount(value);
      }}
      bondFees={NumberUtil.fisAmountToHuman(bondFees) || '--'}
      onRecovery={() => {
        props.history.push('/rDOT/search');
      }}
      validPools={validPools}
      totalStakedToken={NumberUtil.handleFisAmountToFixed(totalIssuance * ratio) || '--'}
      onStakeClick={(chainId: number, targetAddress: string) => {
        if (amount) {
          dispatch(
            transfer(Number(amount).toString(), chainId, targetAddress, () => {
              dispatch(setProcessSlider(false));
              if (chainId === STAFI_CHAIN_ID) {
                props.history.push('/rDOT/staker/info');
              } else {
                PubSub.publish('stakeSuccess');
              }
            }),
          );
        } else {
          message.error('Please enter the amount');
        }
      }}
      type='rDOT'></Content>
  );
}
