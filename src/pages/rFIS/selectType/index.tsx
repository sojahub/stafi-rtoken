import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router';
import TypeCard from 'src/components/card/typeCard';
import { getTotalIssuance, rTokenLedger } from 'src/features/FISClice';
import { RootState } from 'src/store';

export default function Index(props: any) {
  const dispatch = useDispatch();
  const { totalIssuance, stakerApr, tokenAmount } = useSelector((state: RootState) => {
    return {
      totalIssuance: state.FISModule.totalIssuance,
      stakerApr: state.FISModule.stakerApr,
      tokenAmount: state.FISModule.tokenAmount,
    };
  });

  useEffect(() => {
    dispatch(getTotalIssuance());
    dispatch(rTokenLedger());
  }, [dispatch]);

  if (tokenAmount !== '--' && Number(tokenAmount) !== 0) {
    return <Redirect to='/rFIS/staker/info' />;
  }
  return (
    <TypeCard
      type='rFIS'
      total={totalIssuance}
      apr={stakerApr}
      onClick={(e: string) => {
        if (e == 'Staker') {
          props.history.push('/rFIS/staker');
        } else {
          props.history.push('/rFIS/validator');
        }
      }}
    />
  );
}
