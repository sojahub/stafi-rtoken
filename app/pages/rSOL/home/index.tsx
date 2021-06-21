import HomeCard from '@components/card/homeCard';
import { clice, connectPolkadot_sol, connectSoljs } from '@features/globalClice';
import rFIS_svg from '@images/rFIS.svg';
import sollet from '@images/sollet.png';
import { Symbol } from '@keyring/defaults';
import SolServer from '@servers/sol/index';
import Button from '@shared/components/button/connect_button';
import Modal from '@shared/components/modal/connectModal';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router';
import Page_FIS from '../../rATOM/selectWallet_rFIS/index';
import './index.scss';

const solServer = new SolServer();

export default function Inde(props: any) {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const { fisAccount, solAccount, fisAccounts, solAccounts } = useSelector((state: any) => {
    return {
      fisAccount: state.FISModule.fisAccount,
      fisAccounts: state.FISModule.fisAccounts,
      solAccount: state.rSOLModule.solAccount,
      solAccounts: state.rSOLModule.solAccounts,
    };
  });

  const wallet = solServer.getWallet();
  useEffect(() => {
    if (wallet) {
      wallet.on('connect', (publicKey) => {
        console.log('on sol wallet connect: ', publicKey.toString());
        if (fisAccount) {
          props.history.push('/rSOL/type');
        } else if (fisAccounts && fisAccounts.length > 0) {
          props.history.push({
            pathname: '/rSOL/fiswallet',
            state: {
              showBackIcon: false,
            },
          });
        }

        const account = {
          name: '',
          pubkey: publicKey.toString(),
          address: publicKey.toString(),
          balance: '--',
        };
        dispatch(clice(Symbol.Sol).createSubstrate(account));
      });
    }
  }, [wallet]);

  if (fisAccount && solAccount) {
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
        disabled={!!solAccount}
        icon={sollet}
        onClick={() => {
          dispatch(connectSoljs());
        }}>
        Connect to Sollet extension
      </Button>
      {
        <Button
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
