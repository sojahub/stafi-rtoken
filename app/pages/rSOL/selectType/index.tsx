import TypeCard from '@components/card/typeCard';
import { getTotalIssuance, rTokenLedger } from '@features/rSOLClice';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router';

export default function Index(props: any) {
  const dispatch = useDispatch();
  const { stafiStakerApr, totalIssuance, stakerApr, tokenAmount } = useSelector((state: any) => {
    return {
      stafiStakerApr: state.globalModule.stafiStakerApr,
      totalIssuance: state.rSOLModule.totalIssuance,
      stakerApr: state.rSOLModule.stakerApr,
      tokenAmount: state.rSOLModule.tokenAmount,
    };
  });
  useEffect(() => {
    dispatch(getTotalIssuance());
    dispatch(rTokenLedger());
  }, []);

  if (tokenAmount != '--' && tokenAmount != 0) {
    return <Redirect to='/rSOL/staker/info' />;
  }
  return (
    <TypeCard
      type='rSOL'
      stafiStakerApr={stafiStakerApr}
      total={totalIssuance}
      apr={stakerApr}
      onClick={(e: string) => {
        if (e == 'Staker') {
          props.history.push('/rSOL/staker');
        } else {
          props.history.push('/rSOL/validator');
        }
      }}
    />
  );
}
