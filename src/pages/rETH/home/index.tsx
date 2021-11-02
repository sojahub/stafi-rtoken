import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router';
import metamask_png from 'src/assets/images/metamask.png';
import HomeCard from 'src/components/card/homeCard';
import config from 'src/config/index';
import { connectMetamask, handleEthAccount, monitoring_Method } from 'src/features/rETHClice';
import Button from 'src/shared/components/button/connect_button';
import './index.scss';

export default function Inde(props: any) {
  const dispatch = useDispatch();

  const { ethAccount } = useSelector((state: any) => {
    return {
      ethAccount: state.rETHModule.ethAccount,
    };
  });

  if (ethAccount) {
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
          dispatch(connectMetamask(config.ethChainId()));
          dispatch(monitoring_Method());
          ethAccount && dispatch(handleEthAccount(ethAccount.address, config.goerliChainId()));
          props.history.push('/rETH/type');
        }}>
        Connect to Metamask
      </Button>
    </HomeCard>
  );
}
