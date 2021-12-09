import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router';
import metamask from 'src/assets/images/metamask.png';
import rFIS_svg from 'src/assets/images/rFIS.svg';
import HomeCard from 'src/components/card/homeCard';
import { connectPolkadot_fis, initMetaMaskAccount } from 'src/features/globalClice';
import { useMetaMaskAccount } from 'src/hooks/useMetaMaskAccount';
import Button from 'src/shared/components/button/connect_button';
import Modal from 'src/shared/components/modal/connectModal';
import Page_FIS from '../../rATOM/selectWallet_rFIS/index';
import './index.scss';

export default function Inde(props: any) {
  const dispatch = useDispatch();
  const { metaMaskAddress } = useMetaMaskAccount();
  const [visible, setVisible] = useState(false);

  const { fisAccount, fisAccounts } = useSelector((state: any) => {
    return {
      fisAccount: state.FISModule.fisAccount,
      fisAccounts: state.FISModule.fisAccounts,
    };
  });

  if (fisAccount && fisAccount.address && metaMaskAddress) {
    return <Redirect to='/rBNB/type' />;
  }

  return (
    <HomeCard
      title={
        <>
          <label>Liquify</label> Your Staking BNB
        </>
      }
      subTitle={'Staking via StaFi Staking Contract and get rBNB in return'}
      onIntroUrl=''>
      <Button
        disabled={!!metaMaskAddress}
        icon={metamask}
        onClick={() => {
          dispatch(initMetaMaskAccount());
          // if (fisAccount) {
          //   props.history.push('/rBNB/type');
          // } else if (fisAccounts && fisAccounts.length > 0) {
          //   props.history.push({
          //     pathname: '/rBNB/fiswallet',
          //     state: {
          //       showBackIcon: false,
          //     },
          //   });
          // }
          // props.history.push("/rMATIC/type")
        }}>
        Connect to Metamask
      </Button>

      <Button
        disabled={!!(fisAccount && fisAccount.address)}
        icon={rFIS_svg}
        onClick={() => {
          setVisible(true);
          dispatch(
            connectPolkadot_fis(() => {
              setVisible(true);
            }),
          );
        }}>
        Connect to FIS extension
      </Button>

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
