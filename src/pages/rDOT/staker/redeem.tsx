import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Content from 'src/components/content/redeemContent';
import UnbondModal from 'src/components/modal/unbondModal';
import { setLoading } from 'src/features/globalClice';
import {
  checkAddress,
  getUnbondCommission,
  query_rBalances_account,
  rTokenRate,
  unbond,
  unbondFees,
} from 'src/features/rDOTClice';
import NumberUtil from 'src/util/numberUtil';

export default function Index(props: any) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [recipient, setRecipient] = useState<string>();
  const [amount, setAmount] = useState<any>();
  const [visible, setVisible] = useState(false);

  const {
    tokenAmount,
    unbondCommission,
    ratio,
    fisFee,
    address,
    unBondFees,
    willAmount,
    estimateUnBondTxFees,
    fisBalance,
  } = useSelector((state: any) => {
    let willAmount: any = 0;
    let unbondCommission: any = 0;
    let ratio = state.rDOTModule.ratio;
    let tokenAmount = state.rDOTModule.tokenAmount;

    if (ratio && state.rDOTModule.unbondCommission && amount) {
      let returnValue = amount * (1 - state.rDOTModule.unbondCommission);
      unbondCommission = amount * state.rDOTModule.unbondCommission;
      willAmount = NumberUtil.handleFisAmountToFixed(returnValue * ratio);
    }

    return {
      ratio: ratio,
      tokenAmount: tokenAmount,
      unbondCommission: unbondCommission,
      fisFee: state.rDOTModule.unbondCommission,
      address: state.rDOTModule.dotAccount.address,
      unBondFees: state.rDOTModule.unBondFees,
      willAmount: willAmount,
      estimateUnBondTxFees: state.FISModule.estimateUnBondTxFees,
      fisBalance: state.FISModule.fisAccount.balance,
    };
  });
  useEffect(() => {
    setRecipient(address);
  }, [address]);
  useEffect(() => {
    dispatch(query_rBalances_account());
    dispatch(getUnbondCommission());
    dispatch(rTokenRate());
    dispatch(unbondFees());

    return () => {
      dispatch(setLoading(false));
    };
  }, []);
  return (
    <>
      <Content
        history={props.history}
        amount={amount}
        tokenAmount={tokenAmount}
        onAmountChange={(e: string) => {
          setAmount(e);
        }}
        fisFee={fisFee}
        address={recipient}
        onInputConfirm={(e: boolean) => {
          if (!e) {
            if (!checkAddress(recipient)) {
              message.error('Address input error');
              return false;
            }
          }
          return true;
        }}
        onInputChange={(e: string) => {
          setRecipient(e);
        }}
        onRdeemClick={() => {
          if (checkAddress(recipient)) {
            setVisible(true);
          } else {
            message.error('Address input error');
          }
        }}
        type='rDOT'
      />
      <UnbondModal
        visible={visible}
        unbondAmount={amount}
        commission={unbondCommission}
        getAmount={willAmount}
        bondFees={NumberUtil.fisAmountToHuman(unBondFees) || '--'}
        onCancel={() => {
          setVisible(false);
        }}
        onOk={() => {
          if (NumberUtil.fisAmountToChain(fisBalance) <= unBondFees + estimateUnBondTxFees) {
            message.error('No enough FIS to pay for the fee');
            return;
          }
          setAmount('');
          dispatch(setLoading(true));
          setVisible(false);
          dispatch(
            unbond(amount, recipient, willAmount, (success) => {
              dispatch(setLoading(false));
              if (success) {
                history.push('/rDOT/staker/unbondRecords');
              }
            }),
          );
        }}
        type='rDOT'
      />
    </>
  );
}
