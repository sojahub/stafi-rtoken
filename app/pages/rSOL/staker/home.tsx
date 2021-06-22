import Content from '@components/content/stakeContent_DOT';
import { setProcessSlider } from '@features/globalClice';
import { balancesAll, rTokenLedger, rTokenRate, transfer } from '@features/rSOLClice';
import SolServer from '@servers/sol/index';
import { PublicKey } from '@solana/web3.js';
import { ratioToAmount } from '@util/common';
import NumberUtil from '@util/numberUtil';
import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const solServer = new SolServer();

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
        state.rSOLModule.bondFees + state.FISModule.estimateBondTxFees;
      return {
        transferrableAmount: state.rSOLModule.transferrableAmountShow,
        ratio: state.rSOLModule.ratio,
        stafiStakerApr: state.rSOLModule.stakerApr,
        fisCompare: fisCompare,
        validPools: state.rSOLModule.validPools,
        totalIssuance: state.rSOLModule.totalIssuance,
        bondFees: state.rSOLModule.bondFees,
      };
    },
  );

  const clickStake = () => {
    if (amount) {
      if (fisCompare) {
        message.error('No enough FIS to pay for the fee');
        return;
      }

      const wallet = solServer.getWallet();
      if (!wallet.connected) {
        wallet.connect().then((res) => {
          if (res) {
            startStake();
          }
        });
      } else {
        startStake();
      }
    } else {
      message.error('Please enter the amount');
    }
  };

  const getAddress = (result: any) => {
    return new PublicKey(result._bn).toBase58();
  };

  const startStake = () => {
    dispatch(
      transfer(amount, () => {
        dispatch(setProcessSlider(false));
        props.history.push('/rSOL/staker/info');
      }),
    );
  };

  return (
    <Content
      amount={amount}
      willAmount={ratio == '--' ? '--' : ratioToAmount(amount, ratio)}
      unit={'SOL'}
      transferrableAmount={transferrableAmount}
      apr={stafiStakerApr}
      onChange={(value: any) => {
        setAmount(value);
      }}
      onRecovery={() => {
        props.history.push('/rSOL/search');
      }}
      validPools={validPools}
      bondFees={NumberUtil.fisAmountToHuman(bondFees) || '--'}
      totalStakedToken={NumberUtil.handleFisAmountToFixed(totalIssuance * ratio)}
      onStakeClick={clickStake}
      type='rSOL'></Content>
  );
}
