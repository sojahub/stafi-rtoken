import Content from '@components/content/stakeContent_DOT';
import { BSC_CHAIN_ID, ETH_CHAIN_ID, SOL_CHAIN_ID, STAFI_CHAIN_ID } from '@features/bridgeClice';
import { setProcessSlider } from '@features/globalClice';
import { balancesAll, rTokenLedger, rTokenRate, transfer } from '@features/rKSMClice';
import { ratioToAmount } from '@util/common';
import NumberUtil from '@util/numberUtil';
import { message } from 'antd';
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
  const { transferrableAmount, ratio, stafiStakerApr, fisCompare, validPools, totalIssuance, bondFees } = useSelector(
    (state: any) => {
      const fisCompare =
        NumberUtil.fisAmountToChain(state.FISModule.fisAccount.balance) <
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
          if (fisCompare) {
            message.error('No enough FIS to pay for the fee');
            return;
          }
          dispatch(
            transfer(amount, chainId, targetAddress, () => {
              dispatch(setProcessSlider(false));
              if (chainId === STAFI_CHAIN_ID) {
                props.history.push('/rKSM/staker/info');
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
      type='rKSM'></Content>
  );
}
