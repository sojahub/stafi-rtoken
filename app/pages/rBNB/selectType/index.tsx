import TypeCard from '@components/card/typeCard';
import { getTotalIssuance, rTokenLedger } from '@features/rMATICClice';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router';

export default function Index(props: any) {
  const dispatch = useDispatch();
  const { totalIssuance, stakerApr, tokenAmount } = useSelector((state: any) => {
    return {
      totalIssuance: state.rMATICModule.totalIssuance,
      stakerApr: state.rMATICModule.stakerApr,
      tokenAmount: state.rMATICModule.tokenAmount,
    };
  });
  useEffect(() => {
    dispatch(getTotalIssuance());
    dispatch(rTokenLedger());
  }, []);

  if (tokenAmount != '--' && tokenAmount != 0) {
    return <Redirect to='/rBNB/staker/info' />;
  }
  return (
    <TypeCard
      type='rBNB'
      total={totalIssuance}
      apr={stakerApr}
      onClick={(e: string) => {
        if (e == 'Staker') {
          props.history.push('/rBNB/staker');
        } else {
          props.history.push('/rBNB/validator');
        }
      }}
    />
  );
}
