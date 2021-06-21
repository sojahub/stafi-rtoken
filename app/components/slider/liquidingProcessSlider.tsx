import { setProcessSlider } from '@features/globalClice';
import { reSending as atomReSending, reStaking as atomReStaking } from '@features/rATOMClice';
import { reSending, reStaking } from '@features/rDOTClice';
import { reSending as ksmReSending, reStaking as ksmReStaking } from '@features/rKSMClice';
import { reSending as solReSending, reStaking as solReStaking } from '@features/rSOLClice';
import close_svg from '@images/close.svg';
import Liquiding_heard from '@images/liquiding_heard.svg';
import { rSymbol } from '@keyring/defaults';
import util from '@util/toolUtil';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './liquidingProcessSlider.scss';
import Item from './liquidingProcessSliderItem';

type Props = {
  route: any;
  history: any;
};
export default function Index(props: Props) {
  const dispatch = useDispatch();
  const { show, process } = useSelector((state: any) => {
    return {
      show: state.globalModule.processSlider,
      process: state.globalModule.process,
    };
  });

  const reSendingClick = () => {
    if (util.pageType() == rSymbol.Dot) {
      dispatch(
        reSending((href: any) => {
          href && props.history.push(href);
        }),
      );
    }
    if (util.pageType() == rSymbol.Ksm) {
      dispatch(
        ksmReSending((href: any) => {
          href && props.history.push(href);
        }),
      );
    }
    if (util.pageType() == rSymbol.Atom) {
      dispatch(
        atomReSending((href: any) => {
          href && props.history.push(href);
        }),
      );
    }
    if (util.pageType() == rSymbol.Sol) {
      dispatch(
        solReSending((href: any) => {
          href && props.history.push(href);
        }),
      );
    }
  };
  const reStakingClick = () => {
    if (util.pageType() == rSymbol.Dot) {
      dispatch(
        reStaking((href: any) => {
          href && props.history.push(href);
        }),
      );
    }
    if (util.pageType() == rSymbol.Ksm) {
      dispatch(
        ksmReStaking((href: any) => {
          href && props.history.push(href);
        }),
      );
    }
    if (util.pageType() == rSymbol.Atom) {
      dispatch(
        atomReStaking((href: any) => {
          href && props.history.push(href);
        }),
      );
    }
    if (util.pageType() == rSymbol.Sol) {
      dispatch(
        solReStaking((href: any) => {
          href && props.history.push(href);
        }),
      );
    }
  };
  if (!show) {
    return null;
  }
  return (
    <div className='stafi_liquiding_proces_slider'>
      <div className='header'>
        <img
          className='close'
          src={close_svg}
          onClick={() => {
            dispatch(setProcessSlider(false));
          }}
        />
        <img className='logo' src={Liquiding_heard} /> Liquiding Process
      </div>
      <div className='body'>
        <Item
          rSymbol={process.rSymbol}
          index={1}
          title='Sending'
          tooltipText='Stake is sending to the contract and is recorded to wait for staking'
          data={process.sending}
          onClick={reSendingClick}
          showButton={true}
        />
        <Item
          rSymbol={process.rSymbol}
          index={2}
          title='Staking'
          tooltipText='Contract is interacting with original chain and stake on your behalf'
          data={process.staking}
          onClick={reStakingClick}
          showButton={true}
        />
        <Item
          rSymbol={process.rSymbol}
          index={3}
          title='Minting'
          tooltipText='Staked proof gets validated, contract is issuing rToken to your address'
          data={process.minting}
          showButton={false}
        />
      </div>
    </div>
  );
}
