import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router';
import rDOT_svg from 'src/assets/images/rDOT.svg';
import HomeCard from 'src/components/card/homeCard';
import { connectPolkadot } from 'src/features/globalClice';
import Button from 'src/shared/components/button/connect_button';
import PubSub from 'pubsub-js';
import './index.scss';

export default function Inde(props: any) {
  const dispatch = useDispatch();

  const hasAcount = useSelector((state: any) => {
    if (state.FISModule.fisAccount && state.rDOTModule.dotAccount) {
      return true;
    } else {
      return false;
    }
  });

  if (hasAcount) {
    return <Redirect to='/rDOT/type' />;
  }

  return (
    <HomeCard
      title={
        <>
          <label>Liquify</label> Your Staking DOT
        </>
      }
      subTitle={'Staking via StaFi Staking Contract and get rDOT in return'}

      // onIntroUrl="https://docs.stafi.io/rproduct/rdot-solution"
    >
      <Button
        icon={rDOT_svg}
        onClick={() => {
          dispatch(
            connectPolkadot(() => {
              props.history.push('/rDOT/wallet');
            }),
          );
          // PubSub.publish('connectDotWallet');
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
