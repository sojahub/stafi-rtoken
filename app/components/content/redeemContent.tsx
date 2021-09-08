import leftArrowSvg from '@images/left_arrow.svg';
import rATOM from '@images/selected_rATOM.svg';
import rDOT from '@images/selected_rDOT.svg';
import rFIS from '@images/selected_rFIS.svg';
import rKSM from '@images/selected_rKSM.svg';
import rMATIC from '@images/selected_rMatic.svg';
import rSOL from '@images/selected_r_sol.svg';
import Button from '@shared/components/button/button';
import Input from '@shared/components/input/amountInput';
import EditInput from '@shared/components/input/editAddresInput';
import NumberUtil from '@util/numberUtil';
import React, { useState } from 'react';
import LeftContent from './leftContent';

type Props = {
  onRdeemClick?: Function;
  amount?: string;
  onAmountChange?: Function;
  tokenAmount?: any;
  history?: any;
  fisFee?: any;
  address?: string;
  onInputChange?: Function;
  onInputConfirm?: Function;
  type: 'rDOT' | 'rETH' | 'rFIS' | 'rKSM' | 'rATOM' | 'rSOL' | 'rMATIC' | 'rBNB';
};

export default function Index(props: Props) {
  const [inputEdit, setInputEdit] = useState(false);
  const getIcon = () => {
    if (props.type == 'rDOT') {
      return rDOT;
    } else if (props.type == 'rKSM') {
      return rKSM;
    } else if (props.type == 'rATOM') {
      return rATOM;
    } else if (props.type == 'rSOL') {
      return rSOL;
    } else if (props.type == 'rMATIC') {
      return rMATIC;
    } else if (props.type == 'rFIS') {
      return rFIS;
    } else if (props.type == 'rBNB') {
      return rMATIC;
    }
  };

  return (
    <LeftContent className='stafi_stake_redeem_context'>
      <img
        className='back_icon'
        onClick={() => {
          props.history.goBack();
        }}
        src={leftArrowSvg}
      />

      <div className='title'>
        {props.type == 'rDOT' && ' Redeem DOT'}
        {props.type == 'rKSM' && ' Redeem KSM'}
        {props.type == 'rATOM' && ' Redeem ATOM'}
        {props.type == 'rSOL' && ' Redeem SOL'}
        {props.type == 'rMATIC' && ' Redeem MATIC'}
        {props.type == 'rFIS' && ' Redeem FIS'}
        {props.type == 'rBNB' && ' Redeem BNB'}
      </div>

      <div className='subTitle'>
        <div className='label'>
          {props.type == 'rDOT' && '1. Unbond DOT'}
          {props.type == 'rKSM' && '1. Unbond KSM'}
          {props.type == 'rATOM' && '1. Unbond ATOM'}
          {props.type == 'rSOL' && '1. Unbond SOL'}
          {props.type == 'rMATIC' && '1. Unbond MATIC'}
          {props.type == 'rFIS' && '1. Unbond FIS'}
          {props.type == 'rBNB' && '1. Unbond BNB'}
        </div>
        <div className='balance'></div>
      </div>

      <div className='input_panel'>
        <Input
          placeholder={'AMOUNT'}
          maxInput={props.tokenAmount}
          value={props.amount}
          onChange={(e: string) => {
            props.onAmountChange && props.onAmountChange(e);
          }}
          icon={getIcon()}
        />
        <div className='balance'>
          {props.type} balance {props.tokenAmount == '--' ? '--' : NumberUtil.handleFisAmountToFixed(props.tokenAmount)}
        </div>
      </div>
      {/* <div className="btns">
           <Button disabled={!props.amount} size="small" btnType="ellipse" onClick={()=>{
               props.onRdeemClick && props.onRdeemClick();
           }}>Unbond</Button> Unbond will take 28 days and {(props.fisFee != "--") && numberUtil.fisFeeToFixed(props.fisFee)}% fee
         </div> */}

      <div className='subTitle'>
        <div className='label'> 2. Receiving address</div>
      </div>

      <EditInput
        value={props.address}
        onEdit={(e: boolean) => {
          const r = props.onInputConfirm(e);
          if (r) {
            setInputEdit(e);
          }
          return r;
        }}
        onInputChange={(e: string) => {
          props.onInputChange && props.onInputChange(e);
        }}
      />
      {/* <Button size="small" btnType="ellipse">Withdraw</Button> */}

      <div className='unbond_btns'>
        <Button
          disabled={!props.amount || props.amount == '0' || !props.address || inputEdit}
          btnType='ellipse'
          onClick={() => {
            props.onRdeemClick && props.onRdeemClick();
          }}>
          Unbond
        </Button>
      </div>
    </LeftContent>
  );
}
