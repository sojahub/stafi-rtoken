import Content from '@components/content/stakeContent_DOT';
import { BSC_CHAIN_ID, ETH_CHAIN_ID, SOL_CHAIN_ID, STAFI_CHAIN_ID } from '@features/bridgeClice';
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
      onStakeClick={(chainId: number, targetAddress: string) => {
        if (amount) {
          if (fisCompare) {
            message.error('No enough FIS to pay for the fee');
            return;
          }
          dispatch(
            transfer(amount, chainId, targetAddress, () => {
              if (chainId === STAFI_CHAIN_ID) {
                props.history.push('/rFIS/staker/info');
              } else if (chainId === ETH_CHAIN_ID) {
                props.history.push('/rAsset/home/erc');
              } else if (chainId === BSC_CHAIN_ID) {
                props.history.push('/rAsset/home/bep');
              } else if (chainId === SOL_CHAIN_ID) {
                props.history.push('/rAsset/home/spl');
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
