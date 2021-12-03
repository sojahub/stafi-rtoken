import { PublicKey } from '@solana/web3.js';
import PubSub from 'pubsub-js';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Content from 'src/components/content/stakeContent_DOT';
import { STAFI_CHAIN_ID } from 'src/features/bridgeClice';
import { clice, connectSoljs, setProcessSlider } from 'src/features/globalClice';
import { queryBalance, rTokenLedger, rTokenRate, transfer } from 'src/features/rSOLClice';
import { Symbol } from 'src/keyring/defaults';
import SolServer from 'src/servers/sol/index';
import { ratioToAmount } from 'src/util/common';
import NumberUtil from 'src/util/numberUtil';

const solServer = new SolServer();

export default function Index(props: any) {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState<any>();

  const { solAddress } = useSelector((state: any) => {
    return {
      solAddress: state.rSOLModule.solAddress,
    };
  });

  useEffect(() => {
    dispatch(rTokenRate());
    dispatch(rTokenLedger());
    dispatch(queryBalance());
  }, [dispatch, solAddress]);

  // useEffect(() => {
  //   let publicKey: any;
  //   if (solServer.getProvider() && solServer.getProvider().isConnected) {
  //     publicKey = solServer.getProvider().publicKey;
  //   }
  //   if (publicKey && publicKey.toString() !== solAddress) {
  //     // message.warn('Sollet address switched', 5);
  //     setAmount('');
  //     dispatch(connectSoljs());
  //   }
  // }, [dispatch]);

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

  const clickStake = (chainId: number, targetAddress: string) => {
    if (amount) {
      dispatch(
        transfer(Number(amount).toString(), chainId, targetAddress, () => {
          dispatch(setProcessSlider(false));
          if (chainId === STAFI_CHAIN_ID) {
            props.history.push('/rSOL/staker/info');
          } else {
            PubSub.publish('stakeSuccess');
          }
        }),
      );
    }
  };

  if (!solAddress) {
    return <Redirect to={'/rSOL/home'} />;
  }

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
