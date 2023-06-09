import { message } from 'antd';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Content from 'src/components/content/stakeContent_ETH';
import { reloadData, send } from 'src/features/rETHClice';
import { ratioToAmount } from 'src/util/common';
import numberUtil from 'src/util/numberUtil';

export default function Index(props: any) {
  const [ethNoteModalVisible, setEthNoteModalVisible] = useState(false);
  const dispatch = useDispatch();

  const [amount, setAmount] = useState<any>();

  const { balance, ratio, stakerApr, minimumDeposit, totalStakedAmount, waitingStaked, isPoolWaiting } = useSelector(
    (state: any) => {
      return {
        balance: state.rETHModule.balance,
        ratio: state.rETHModule.ratio,
        stakerApr: state.rETHModule.stakerApr,
        minimumDeposit: state.rETHModule.minimumDeposit,

        isPoolWaiting: state.rETHModule.isPoolWaiting,
        waitingStaked: state.rETHModule.waitingStaked,
        totalStakedAmount: state.rETHModule.totalStakedAmount,
      };
    },
  );
  return (
    <>
      <Content
        history={props.history}
        amount={amount}
        willAmount={ratio == '--' ? '--' : ratioToAmount(amount, ratio)}
        transferrableAmount={numberUtil.handleFisAmountToFixed(balance)}
        apr={stakerApr}
        onChange={(value: any) => {
          if (Number(value) > 0 && Number(value) < Number(minimumDeposit)) {
            message.error(`The deposited amount is less than the minimum deposit size:${minimumDeposit}`);
            setAmount('');
            return;
          }
          setAmount(value);
        }}
        totalStakedAmount={totalStakedAmount}
        waitingStaked={waitingStaked}
        isPoolWaiting={isPoolWaiting}
        onStakeClick={() => {
          dispatch(
            send(amount, () => {
              dispatch(reloadData());
              props.history.push('/rETH/staker/insurance');
            }),
          );
        }}
        type='rETH'></Content>
      {/* <EthNoteModal 
    visible={ethNoteModalVisible}
    onCancel={()=>{
      setEthNoteModalVisible(false);
    }}
    onNext={()=>{
      setEthNoteModalVisible(false);
      dispatch(send(amount,()=>{ 
        dispatch(reloadData());
        props.history.push("/rETH/staker/info")
      }))
    }}
  />  */}
    </>
  );
}
