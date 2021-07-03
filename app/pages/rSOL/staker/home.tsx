import Content from '@components/content/stakeContent_DOT';
import { clice, setProcessSlider } from '@features/globalClice';
import { balancesAll, rTokenLedger, rTokenRate, transfer } from '@features/rSOLClice';
import { Symbol } from '@keyring/defaults';
import SolServer from '@servers/sol/index';
import { PublicKey } from '@solana/web3.js';
import { ratioToAmount } from '@util/common';
import NumberUtil from '@util/numberUtil';
import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

const solServer = new SolServer();

export default function Index(props: any) {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState<any>();
  const { solAccount } = useSelector((state: any) => {
    return {
      solAccount: state.rSOLModule.solAccount,
    };
  });

  if (!solAccount) {
    return <Redirect to={'/rSOL/home'} />;
  }

  useEffect(() => {
    dispatch(balancesAll());
    dispatch(rTokenRate());
    dispatch(rTokenLedger());
  }, []);

  let publicKey: any;
  if (solServer.getWallet() && solServer.getWallet().connected) {
    publicKey = solServer.getWallet().publicKey;
  }
  useEffect(() => {
    if (publicKey && publicKey.toBase58() !== solAccount.address) {
      // message.warn('Sollet address switched', 5);
      setAmount('');
      const account = {
        name: '',
        pubkey: publicKey.toBase58(),
        address: publicKey.toBase58(),
        balance: '--',
      };
      dispatch(clice(Symbol.Sol).createSubstrate(account));
    }
  }, [publicKey]);

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
        wallet
          .connect()
          .then((res: any) => {
            if (res) {
              checkWalletAddress(getPublicKey(res));
            }
          })
          .catch((error) => {
            console.warn('stake home connect sollet error: ', error);
          });
      } else {
        checkWalletAddress(wallet.publicKey);
      }
    } else {
      message.error('Please enter the amount');
    }
  };

  const getPublicKey = (result: any) => {
    return new PublicKey(result._bn);
  };

  const checkWalletAddress = (publicKey: PublicKey) => {
    if (publicKey.toBase58() == solAccount.address) {
      startStake();
    } else {
      message.warn('Sollet address mismatch, please resubmit', 5);
      setAmount('');
      const account = {
        name: '',
        pubkey: publicKey.toBase58(),
        address: publicKey.toBase58(),
        balance: '--',
      };
      dispatch(clice(Symbol.Sol).createSubstrate(account));
    }
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
