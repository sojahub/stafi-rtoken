import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Content from 'src/components/content/redeemContent';
import UnbondModal from 'src/components/modal/unbondModal';
import CommonClice from 'src/features/commonClice';
import { setLoading } from 'src/features/globalClice';
import { checkEthAddress } from 'src/features/rETHClice';
import { getUnbondCommission, query_rBalances_account, rTokenRate, unbond, unbondFees } from 'src/features/rMATICClice';
import NumberUtil from 'src/util/numberUtil';

const commonClice = new CommonClice();
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
    let unbondCommission: any = 0;
    let ratio = state.rMATICModule.ratio;
    let tokenAmount = state.rMATICModule.tokenAmount;

    if (state.rMATICModule.unbondCommission && amount) {
      unbondCommission = amount * state.rMATICModule.unbondCommission;
    }
    return {
      ratio: ratio,
      tokenAmount: tokenAmount,
      unbondCommission: unbondCommission,
      fisFee: state.rMATICModule.unbondCommission,
      address: state.globalModule.metaMaskAddress,
      unBondFees: state.rMATICModule.unBondFees,
      willAmount: commonClice.getWillAmount(ratio, state.rMATICModule.unbondCommission, amount),
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
            if (!checkEthAddress(recipient)) {
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
          if (checkEthAddress(recipient)) {
            setVisible(true);
          } else {
            message.error('Address input error');
          }
        }}
        type='rMATIC'
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
            unbond(amount, recipient, willAmount, (success) => {
              dispatch(setLoading(false));
              if (success) {
                history.push('/rMATIC/staker/unbondRecords');
              }
            }),
          );
        }}
        type='rMATIC'
      />
    </>
  );
}
