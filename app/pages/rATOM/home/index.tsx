import HomeCard from '@components/card/homeCard';
import { connectAtomjs, connectPolkadot_fis } from '@features/globalClice';
import keplr from '@images/keplr.png';
import rDOT_svg from '@images/rDOT.svg';
import Button from '@shared/components/button/connect_button';
import Modal from '@shared/components/modal/connectModal';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router';
import Page_FIS from '../../rATOM/selectWallet_rFIS/index';
import './index.scss';

export default function Inde(props: any) {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const { fisAccount, atomAccount, fisAccounts, atomAccounts } = useSelector((state: any) => {
    return {
      fisAccount: state.FISModule.fisAccount,
      fisAccounts: state.FISModule.fisAccounts,
      atomAccount: state.rATOMModule.atomAccount,
      atomAccounts: state.rATOMModule.atomAccounts,
    };
  });
  if (fisAccount && atomAccount) {
    return <Redirect to='/rATOM/type' />;
  }
  return (
    <HomeCard
      title={
        <>
          <label>Liquify</label> Your Staking ATOM
        </>
      }
      subTitle={'Staking via StaFi Staking Contract and get rATOM in return'}
      onIntroUrl=''>
      <Button
        width={'380px'}
        disabled={!!atomAccount}
        icon={keplr}
        onClick={() => {
          dispatch(
            connectAtomjs(() => {
              if (fisAccount) {
                props.history.push('/rATOM/type');
              } else if (fisAccounts && fisAccounts.length > 0) {
                props.history.push({
                  pathname: '/rATOM/fiswallet',
                  state: {
                    showBackIcon: false,
                  },
                });
              }
            }),
          );
        }}>
        Connect to Keplr extension
      </Button>

      <Button
        width={'380px'}
        disabled={!!fisAccount}
        icon={rDOT_svg}
        onClick={() => {
          setVisible(true);
          dispatch(
            connectPolkadot_fis(() => {
              setVisible(true);
              // if(atomAccount){
              //   props.history.push({
              //     pathname:"/rATOM/fiswallet",
              //     state:{
              //         showBackIcon:false,
              //     }
              //   });
              // }
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
