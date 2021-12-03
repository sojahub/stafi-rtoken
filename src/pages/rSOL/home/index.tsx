import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router';
import phantom from 'src/assets/images/phantom.png';
import rFIS_svg from 'src/assets/images/rFIS.svg';
import HomeCard from 'src/components/card/homeCard';
import { connectPolkadot_sol, connectSoljs } from 'src/features/globalClice';
import SolServer from 'src/servers/sol/index';
import Button from 'src/shared/components/button/connect_button';
import Modal from 'src/shared/components/modal/connectModal';
import Page_FIS from '../../rATOM/selectWallet_rFIS/index';
import './index.scss';

export default function Inde(props: any) {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const { fisAccount, solAddress } = useSelector((state: any) => {
    return {
      fisAccount: state.FISModule.fisAccount,
      solAddress: state.rSOLModule.solAddress,
    };
  });

  if (fisAccount && solAddress) {
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
        width={'370px'}
        disabled={!!solAddress}
        icon={phantom}
        onClick={() => {
          dispatch(connectSoljs());
        }}>
        Connect to Phantom extension
      </Button>

      {
        <Button
          width={'370px'}
          disabled={!!fisAccount}
          icon={rFIS_svg}
          onClick={() => {
            setVisible(true);
            dispatch(
              connectPolkadot_sol(() => {
                setVisible(true);
              }),
            );
          }}>
          Connect to FIS extension
        </Button>
      }

      <Modal visible={visible}>
        <Page_FIS
          location={{}}
          type='header'
          onClose={() => {
            setVisible(false);
          }}
        />
      </Modal>
    </HomeCard>
  );
}
