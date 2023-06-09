import React from 'react';
import { useSelector } from 'react-redux';
import apr_svg from 'src/assets/images/apr.svg';
import rate_eleted_svg from 'src/assets/images/rate_eleted.svg';
import rDOT_svg from 'src/assets/images/rDOT_black2.svg';
import reth_staker from 'src/assets/images/reth_staker.svg';
import reth_validator from 'src/assets/images/reth_validator.svg';
import rFIS_svg from 'src/assets/images/rFIS_black.svg';
import rKSM_svg from 'src/assets/images/rKSM_black2.svg';
import rSOL_svg from 'src/assets/images/rSOL_stafi.svg';
import rBnb_svg from 'src/assets/images/selected_bnb.svg';
import rATOM_svg from 'src/assets/images/selected_rATOM.svg';
import rMatic_svg from 'src/assets/images/selected_rMatic.svg';
import validator_svg from 'src/assets/images/validator_2.svg';
import './index.scss';

type Props = {
  type: 'rDOT' | 'rETH' | 'rFIS' | 'rKSM' | 'rATOM' | 'rSOL' | 'rMATIC' | 'rBNB';
  onClick: Function;
  total?: any;
  apr?: any;
};

export default function Index(props: Props) {
  const { poolCount } = useSelector((state: any) => {
    if (props.type == 'rETH') {
      return {
        poolCount: state.rETHModule.poolCount,
      };
    } else {
      return {
        poolCount: '--',
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
          {props.type == 'rMATIC' && 'Delegate your MATIC, get rMATIC'}
          {props.type == 'rBNB' && 'Delegate your BNB, get rBNB'}
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
          {props.type == 'rETH' && <img src={reth_staker} />}
          {props.type == 'rSOL' && <img src={rSOL_svg} />}
          {props.type == 'rMATIC' && <img src={rMatic_svg} />}
          {props.type == 'rBNB' && <img src={rBnb_svg} />}
          <div>{props.type == 'rETH' ? 'Staked' : props.type}</div>
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
          {props.type == 'rETH' ? <img src={reth_validator} /> : <img src={validator_svg} />}

          <div>{props.type == 'rETH' ? 'Pools' : 'All OVs'}</div>
          <label>{props.type == 'rETH' ? poolCount : 16}</label>
        </div>
      </div>
    </div>
  );
}
