import Content from '@components/content/stakeContent_DOT';
import { BSC_CHAIN_ID, ETH_CHAIN_ID, SOL_CHAIN_ID, STAFI_CHAIN_ID } from '@features/bridgeClice';
import { reloadData, setProcessSlider } from '@features/globalClice';
import { rTokenLedger, rTokenRate, transfer } from '@features/rBNBClice';
import { Symbol } from '@keyring/defaults';
import { ratioToAmount } from '@util/common';
import { default as numberUtil, default as NumberUtil } from '@util/numberUtil';
import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './index.scss';
export default function Index(props: any) {
  const dispatch = useDispatch();

  const [amount, setAmount] = useState<any>();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    dispatch(rTokenRate());
    dispatch(rTokenLedger());
  }, []);

  const { transferrableAmount, ratio, stafiStakerApr, fisCompare, validPools, totalIssuance, bondFees } = useSelector(
    (state: any) => {
      const fisCompare =
        NumberUtil.fisAmountToChain(state.FISModule.fisAccount.balance) <
        state.rBNBModule.bondFees + state.FISModule.estimateBondTxFees;

      const ethAccount = state.rETHModule.ethAccount;
      const balance = ethAccount ? ethAccount.balance : '--';
      let transferrableAmount = '--';
      if (!isNaN(balance)) {
        transferrableAmount = numberUtil.max(0, numberUtil.sub(balance, 0.0003));
      }

      return {
        transferrableAmount,
        ratio: state.rBNBModule.ratio,
        stafiStakerApr: state.rBNBModule.stakerApr,
        fisCompare: fisCompare,
        validPools: state.rBNBModule.validPools,
        totalIssuance: state.rBNBModule.totalIssuance,
        bondFees: state.rBNBModule.bondFees,
      };
    },
  );

  return (
    <>
      {' '}
      <Content
        amount={amount}
        willAmount={ratio == '--' ? '--' : ratioToAmount(amount, ratio)}
        unit={'BNB'}
        transferrableAmount={
          isNaN(Number(transferrableAmount)) ? 0 : NumberUtil.handleFisAmountToFixed(transferrableAmount)
        }
        apr={stafiStakerApr}
        onChange={(value: any) => {
          setAmount(value);
        }}
        onRecovery={() => {
          props.history.push('/rBNB/search');
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
                dispatch(reloadData(Symbol.Bnb));
                dispatch(setProcessSlider(false));
                if (chainId === STAFI_CHAIN_ID) {
                  props.history.push('/rBNB/staker/info');
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
        type='rBNB'></Content>
    </>
  );
}
