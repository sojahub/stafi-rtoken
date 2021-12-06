import { message } from 'antd';
import PubSub from 'pubsub-js';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Content from 'src/components/content/stakeContent_DOT';
import config from 'src/config';
import { STAFI_CHAIN_ID } from 'src/features/bridgeClice';
import { reloadData, setProcessSlider } from 'src/features/globalClice';
import { rTokenLedger, rTokenRate, transfer } from 'src/features/rBNBClice';
import { useMetaMaskAccount } from 'src/hooks/useMetaMaskAccount';
import { Symbol } from 'src/keyring/defaults';
import { ratioToAmount } from 'src/util/common';
import { default as numberUtil, default as NumberUtil } from 'src/util/numberUtil';
import './index.scss';

export default function Index(props: any) {
  const dispatch = useDispatch();
  const { metaMaskBalance, metaMaskNetworkId } = useMetaMaskAccount();

  const [amount, setAmount] = useState<any>();

  useEffect(() => {
    dispatch(rTokenRate());
    dispatch(rTokenLedger());
  }, [dispatch]);

  const { transferrableAmount, ratio, stafiStakerApr, fisCompare, validPools, totalIssuance, bondFees } = useSelector(
    (state: any) => {
      const fisCompare =
        NumberUtil.fisAmountToChain(state.FISModule.fisAccount.balance) <
        state.rBNBModule.bondFees + state.FISModule.estimateBondTxFees;

      let transferrableAmount = '--';
      if (!isNaN(metaMaskBalance) && config.metaMaskNetworkIsBsc(metaMaskNetworkId)) {
        transferrableAmount = numberUtil.max(0, numberUtil.sub(metaMaskBalance * 1, 0.0003));
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
        willAmount={ratio === '--' ? '--' : ratioToAmount(amount, ratio)}
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
            dispatch(
              transfer(Number(amount).toString(), chainId, targetAddress, () => {
                dispatch(reloadData(Symbol.Bnb));
                dispatch(setProcessSlider(false));
                if (chainId === STAFI_CHAIN_ID) {
                  props.history.push('/rBNB/staker/info');
                } else {
                  PubSub.publish('stakeSuccess');
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
