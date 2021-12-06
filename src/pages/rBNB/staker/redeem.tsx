import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Content from 'src/components/content/redeemContent';
import UnbondModal from 'src/components/modal/unbondModal';
import CommonClice from 'src/features/commonClice';
import { setLoading } from 'src/features/globalClice';
import { getUnbondCommission, query_rBalances_account, rTokenRate, unbond, unbondFees } from 'src/features/rBNBClice';
import { checkEthAddress } from 'src/features/rETHClice';
import { useMetaMaskAccount } from 'src/hooks/useMetaMaskAccount';
import NumberUtil from 'src/util/numberUtil';

const commonClice = new CommonClice();
export default function Index(props: any) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [recipient, setRecipient] = useState<string>();
  const [amount, setAmount] = useState<any>();
  const [visible, setVisible] = useState(false);
  const { metaMaskAddress } = useMetaMaskAccount();

  const { tokenAmount, unbondCommission, ratio, fisFee, unBondFees, willAmount, estimateUnBondTxFees, fisBalance } =
    useSelector((state: any) => {
      let unbondCommission: any = 0;
      let ratio = state.rBNBModule.ratio;
      let tokenAmount = state.rBNBModule.tokenAmount;

      if (state.rBNBModule.unbondCommission && amount) {
        unbondCommission = amount * state.rBNBModule.unbondCommission;
      }
      return {
        ratio: ratio,
        tokenAmount: tokenAmount,
        unbondCommission: unbondCommission,
        fisFee: state.rBNBModule.unbondCommission,
        unBondFees: state.rBNBModule.unBondFees,
        willAmount: commonClice.getWillAmount(ratio, state.rBNBModule.unbondCommission, amount),
        estimateUnBondTxFees: state.FISModule.estimateUnBondTxFees,
        fisBalance: state.FISModule.fisAccount.balance,
      };
    });

  useEffect(() => {
    setRecipient(metaMaskAddress);
  }, [metaMaskAddress]);

  useEffect(() => {
    dispatch(query_rBalances_account());
    dispatch(getUnbondCommission());
    dispatch(rTokenRate());
    dispatch(unbondFees());
    return () => {
      dispatch(setLoading(false));
    };
  }, [dispatch]);

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
            if (!checkEthAddress(recipient)) {
              return false;
            }
          }
          return true;
        }}
        onInputChange={(e: string) => {
          setRecipient(e);
        }}
        onRdeemClick={() => {
          if (Number(amount) > Number(tokenAmount)) {
            message.error('The input amount exceeds your rToken balance');
            setAmount('');
            return;
          }
          if (checkEthAddress(recipient)) {
            setVisible(true);
          } else {
            message.error('Address input error');
          }
        }}
        type='rBNB'
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
          dispatch(setLoading(true));
          setVisible(false);
          setAmount('');
          dispatch(
            unbond(amount, recipient, willAmount, () => {
              dispatch(setLoading(false));
              history.push('/rBNB/staker/unbondRecords');
            }),
          );
        }}
        type='rBNB'
      />
    </>
  );
}
