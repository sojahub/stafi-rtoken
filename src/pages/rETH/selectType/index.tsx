import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useHistory } from 'react-router';
import TypeCard from 'src/components/card/typeCard';

export default function Index(props: any) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { totalStakedAmount, stakerApr, tokenAmount } = useSelector((state: any) => {
    return {
      totalStakedAmount: state.rETHModule.totalStakedAmount,
      stakerApr: state.rETHModule.stakerApr,
      tokenAmount: state.ETHModule.ercETHBalance,
      poolCount: state.rETHModule.poolCount,
    };
  });

  if (!isNaN(Number(tokenAmount)) && Number(tokenAmount) !== 0) {
    history.replace('/rETH/staker/info');
    return null;
    // return <Redirect to='/rETH/staker/info' />;
  }

  return (
    <TypeCard
      type='rETH'
      total={totalStakedAmount}
      apr={stakerApr}
      onClick={(e: string) => {
        if (e === 'Staker') {
          props.history.push('/rETH/staker');
        } else {
          props.history.push('/rETH/validator/index');
        }
      }}
    />
  );
}
