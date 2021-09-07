import Content from '@components/content/stakeContent_DOT';
import { setProcessSlider } from '@features/globalClice';
import { rTokenLedger, rTokenRate, transfer } from '@features/rMATICClice';
import { ratioToAmount } from '@util/common';
import NumberUtil from '@util/numberUtil';
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
      return {
        transferrableAmount: state.rBNBModule.transferrableAmountShow,
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
        transferrableAmount={NumberUtil.handleFisAmountToFixed(transferrableAmount)}
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
        onStakeClick={() => {
          if (amount) {
            if (fisCompare) {
              message.error('No enough FIS to pay for the fee');
              return;
            }

            dispatch(
              transfer(amount, () => {
                dispatch(setProcessSlider(false));
                props.history.push('/rBNB/staker/info');
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
        type='rBNB'></Content>
    </>
  );
}
