import apr_svg from '@images/apr.svg';
import rate_eleted_svg from '@images/rate_eleted.svg';
import rDOT_svg from '@images/rDOT_black2.svg';
import rFIS_svg from '@images/rFIS_black.svg';
import rKSM_svg from '@images/rKSM_black2.svg';
import rATOM_svg from '@images/selected_rATOM.svg';
import validator_svg from '@images/validator_2.svg';
import React from 'react';
import { useSelector } from 'react-redux';
import './index.scss';

type Props = {
  type: 'rDOT' | 'rETH' | 'rFIS' | 'rKSM' | 'rATOM' | 'rSOL';
  onClick: Function;
  stafiStakerApr?: any;
  total?: any;
  apr?: any;
};
export default function Index(props: Props) {
  const { balance } = useSelector((state: any) => {
    if (props.type == 'rDOT') {
      return {
        balance: state.rDOTModule.dotAccount ? state.rDOTModule.dotAccount.balance : '--',
      };
    }
    if (props.type == 'rKSM') {
      return {
        balance: state.rKSMModule.ksmAccount ? state.rKSMModule.ksmAccount.balance : '--',
      };
    }
    if (props.type == 'rATOM') {
      return {
        balance: state.rATOMModule.ksmAccount ? state.rATOMModule.atomAccount.balance : '--',
      };
    }
    if (props.type == 'rSOL') {
      return {
        balance: state.rSOLModule.solAccount ? state.rSOLModule.solAccount.balance : '--',
      };
    }
  });
  return (
    <div className='stafi_type_card'>
      <div
        className='type_card_item'
        onClick={() => {
          props.onClick && props.onClick('Staker');
        }}>
        <div className='title'>Staker</div>
        <div className='sub_title'>
          {props.type == 'rDOT' && 'Delegate your DOT, get rDOT'}
          {props.type == 'rKSM' && 'Delegate your KSM, get rKSM'}
          {props.type == 'rATOM' && 'Delegate your ATOM, get rATOM'}
          {props.type == 'rETH' && 'Delegate your ETH'}
          {props.type == 'rFIS' && 'Delegate your FIS, get rFIS'}
          {props.type == 'rSOL' && 'Delegate your SOL, get rSOL'}
        </div>
        <div className='apr_panel'>
          <img src={apr_svg} />
          <label>{props.apr}</label>
        </div>
        <div className='r_panel'>
          {props.type == 'rDOT' && <img src={rDOT_svg} />}
          {props.type == 'rKSM' && <img src={rKSM_svg} />}
          {props.type == 'rFIS' && <img src={rFIS_svg} />}
          {props.type == 'rATOM' && <img src={rATOM_svg} />}
          {props.type == 'rSOL' && <img src={rKSM_svg} />}
          <div>{props.type}</div>
          <label>{props.total}</label>
        </div>
      </div>
      <div
        className='type_card_item'
        onClick={() => {
          props.onClick && props.onClick('Validator');
        }}>
        <div className='title'>Validator</div>
        <div className='sub_title'>Apply to be delegated</div>
        <div className='apr_panel'>
          <img src={rate_eleted_svg} />
          <label>12.89%</label>
        </div>
        <div className='r_panel'>
          <img src={validator_svg} />
          <div>All OVs</div>
          <label>16</label>
        </div>
      </div>
    </div>
  );
}
