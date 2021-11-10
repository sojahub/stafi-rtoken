import { message, Modal } from 'antd';
import PubSub from 'pubsub-js';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import atom_stake_tips from 'src/assets/images/atom_stake_tips.png';
import Content from 'src/components/content/stakeContent_DOT';
import { STAFI_CHAIN_ID } from 'src/features/bridgeClice';
import { setProcessSlider } from 'src/features/globalClice';
import { rTokenLedger, rTokenRate, transfer } from 'src/features/rATOMClice';
import Button from 'src/shared/components/button/button';
import { getSessionStorageItem, ratioToAmount, setSessionStorageItem } from 'src/util/common';
import NumberUtil from 'src/util/numberUtil';
import './index.scss';
export default function Index(props: any) {
  const dispatch = useDispatch();

  const [amount, setAmount] = useState<any>();
  const [visible, setVisible] = useState(false);
  const [savedChainId, setSavedChainId] = useState(0);
  const [savedTargetAddress, setSavedTargetAddress] = useState('');

  useEffect(() => {
    dispatch(rTokenRate());
    dispatch(rTokenLedger());
  }, []);

  const { transferrableAmount, ratio, stafiStakerApr, fisCompare, validPools, totalIssuance, bondFees } = useSelector(
    (state: any) => {
      const fisCompare =
        NumberUtil.fisAmountToChain(state.FISModule.fisAccount.balance) <
        state.rATOMModule.bondFees + state.FISModule.estimateBondTxFees;
      return {
        transferrableAmount: state.rATOMModule.transferrableAmountShow,
        ratio: state.rATOMModule.ratio,
        stafiStakerApr: state.rATOMModule.stakerApr,
        fisCompare: fisCompare,
        validPools: state.rATOMModule.validPools,
        totalIssuance: state.rATOMModule.totalIssuance,
        bondFees: state.rATOMModule.bondFees,
      };
    },
  );

  return (
    <>
      {' '}
      <Content
        amount={amount}
        willAmount={ratio == '--' ? '--' : ratioToAmount(amount, ratio)}
        unit={'ATOM'}
        transferrableAmount={transferrableAmount}
        apr={stafiStakerApr}
        onChange={(value: any) => {
          setAmount(value);
        }}
        onRecovery={() => {
          props.history.push('/rATOM/search');
        }}
        validPools={validPools}
        bondFees={NumberUtil.fisAmountToHuman(bondFees) || '--'}
        totalStakedToken={NumberUtil.handleFisAmountToFixed(totalIssuance * ratio)}
        onStakeClick={(chainId: number, targetAddress: string) => {
          if (amount) {
            if (getSessionStorageItem('atom_stake_tips_modal')) {
              dispatch(
                transfer(Number(amount).toString(), chainId, targetAddress, () => {
                  dispatch(setProcessSlider(false));
                  if (chainId === STAFI_CHAIN_ID) {
                    props.history.push('/rATOM/staker/info');
                  } else {
                    PubSub.publish('stakeSuccess');
                  }
                }),
              );
            } else {
              setSavedChainId(chainId);
              setSavedTargetAddress(targetAddress);
              setVisible(true);
            }
          } else {
            message.error('Please enter the amount');
          }
        }}
        type='rATOM'></Content>
      <Modal
        visible={visible}
        title={null}
        footer={null}
        width={350}
        onCancel={() => {
          setVisible(false);
        }}
        className='atom_stake_tips_modal'>
        <img src={atom_stake_tips} />
        <Button
          btnType='square'
          onClick={() => {
            setSessionStorageItem('atom_stake_tips_modal', true);
            setVisible(false);
            dispatch(
              transfer(amount, savedChainId, savedTargetAddress, () => {
                dispatch(setProcessSlider(false));
                props.history.push('/rATOM/staker/info');
              }),
            );
          }}>
          Understood
        </Button>
      </Modal>
    </>
  );
}
