import HomeCard from '@components/card/homeCard';
import { connectPolkadot_fis } from '@features/globalClice';
import rFIS_svg from '@images/rFIS.svg';
import Button from '@shared/components/button/connect_button';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router';
import './index.scss';

export default function Inde(props: any) {
  const dispatch = useDispatch();
  const { fisAccount } = useSelector((state: any) => {
    return {
      fisAccount: state.FISModule.fisAccount,
    };
  });
  if (fisAccount) {
    return <Redirect to='/rFIS/type' />;
  }
  return (
    <HomeCard
      title={
        <>
          <label>Liquify</label> Your Staking FIS
        </>
      }
      subTitle={'Staking via StaFi Staking Contract and get rFIS in return'}
      onIntroUrl=''>
      <Button
        icon={rFIS_svg}
        onClick={() => {
          // setVisible(true);

          dispatch(
            connectPolkadot_fis(() => {
              props.history.push('/rFIS/fiswallet');
            }),
          );
        }}>
        Connect to Polkadotjs extension
      </Button>

      <div
        style={{
          color: '#b0b0b0',
          fontSize: '10px',
          lineHeight: '14px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <div>PolkadotJS extention DOES NOT support Ledger. </div>
        <div>DO NOT use ledger when you are signing</div>
      </div>
    </HomeCard>
  );
}
