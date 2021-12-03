import React from 'react';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router';
import metamask_png from 'src/assets/images/metamask.png';
import HomeCard from 'src/components/card/homeCard';
import { initMetaMaskAccount } from 'src/features/globalClice';
import { useMetaMaskAccount } from 'src/hooks/useMetaMaskAccount';
import Button from 'src/shared/components/button/connect_button';
import './index.scss';

export default function Inde(props: any) {
  const dispatch = useDispatch();
  const { metaMaskAddress } = useMetaMaskAccount();

  if (metaMaskAddress) {
    return <Redirect to='/rETH/type' />;
  }

  return (
    <HomeCard
      title={
        <>
          <label>Liquify</label> Your Staking ETH 2.0
        </>
      }
      subTitle={'Staking via StaFi Staking Contract and get rETH in return.'}

      // onIntroUrl="https://docs.stafi.io/rproduct/rdot-solution"
    >
      <Button
        icon={metamask_png}
        onClick={() => {
          dispatch(initMetaMaskAccount());
        }}>
        Connect to Metamask
      </Button>
    </HomeCard>
  );
}
