import Content from '@components/content/stakeContent_DOT';
import { STAFI_CHAIN_ID } from '@features/bridgeClice';
import { getGasPrice } from '@features/ETHClice';
import { setProcessSlider } from '@features/globalClice';
import { rTokenLedger, rTokenRate, transfer } from '@features/rMATICClice';
import { ratioToAmount } from '@util/common';
import { default as NumberUtil } from '@util/numberUtil';
import { message } from 'antd';
import PubSub from 'pubsub-js';
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
    dispatch(getGasPrice());
  }, []);

  const { transferrableAmount, ratio, stafiStakerApr, fisCompare, validPools, totalIssuance, bondFees } = useSelector(
    (state: any) => {
      const fisCompare =
        NumberUtil.fisAmountToChain(state.FISModule.fisAccount.balance) <
        state.rMATICModule.bondFees + state.FISModule.estimateBondTxFees;
      return {
        transferrableAmount: state.rMATICModule.transferrableAmountShow,
        ratio: state.rMATICModule.ratio,
        stafiStakerApr: state.rMATICModule.stakerApr,
        fisCompare: fisCompare,
        validPools: state.rMATICModule.validPools,
        totalIssuance: state.rMATICModule.totalIssuance,
        bondFees: state.rMATICModule.bondFees,
      };
    },
  );

  return (
    <>
      {' '}
      <Content
        amount={amount}
        willAmount={ratio == '--' ? '--' : ratioToAmount(amount, ratio)}
        unit={'MATIC'}
        transferrableAmount={NumberUtil.handleFisAmountToFixed(transferrableAmount)}
        apr={stafiStakerApr}
        onChange={(value: any) => {
          setAmount(value);
        }}
        onRecovery={() => {
          props.history.push('/rMATIC/search');
        }}
        validPools={validPools}
        bondFees={NumberUtil.fisAmountToHuman(bondFees) || '--'}
        totalStakedToken={NumberUtil.handleFisAmountToFixed(totalIssuance * ratio)}
        onStakeClick={(chainId: number, targetAddress: string) => {
          if (amount) {
            dispatch(
              transfer(amount, chainId, targetAddress, () => {
                dispatch(setProcessSlider(false));
                if (chainId === STAFI_CHAIN_ID) {
                  props.history.push('/rMATIC/staker/info');
                } else {
                  PubSub.publish('stakeSuccess');
                }
              }),
            );
            // if(getSessionStorageItem("atom_stake_tips_modal")){
            //     dispatch(transfer(amount,()=>{
            //       dispatch(setProcessSlider(false));
            //       props.history.push("/rMATIC/staker/info")
            //     }));
            // }else{
            //   setVisible(true)
            // }
          } else {
            message.error('Please enter the amount');
          }
        }}
        type='rMATIC'></Content>
    </>
  );
}
