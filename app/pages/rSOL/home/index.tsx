import HomeCard from '@components/card/homeCard';
import { connectPolkadot_sol } from '@features/globalClice';
import rDOT_svg from '@images/rDOT.svg';
import Button from '@shared/components/button/connect_button';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router';
import './index.scss';

export default function Inde(props: any) {
  const dispatch = useDispatch();
  const hasAcount = useSelector((state: any) => {
    if (state.FISModule.fisAccount) {
      return true;
    } else {
      return false;
    }
  });
  if (hasAcount) {
    return <Redirect to='/rSOL/type' />;
  }
  return (
    <HomeCard
      title={
        <>
          <label>Liquify</label> Your Staking SOL
        </>
      }
      subTitle={'Staking via StaFi Staking Contract and get rSOL in return'}
      onIntroUrl=''>
      <Button
        icon={rDOT_svg}
        onClick={() => {
          dispatch(
            connectPolkadot_sol(() => {
              props.history.push('/rSOL/wallet');
            }),
          );
        }}>
        Connect to Polkadotjs extension
      </Button>
    </HomeCard>
  );
}
