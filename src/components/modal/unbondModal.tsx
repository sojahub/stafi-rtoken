import { Modal, Tooltip } from 'antd';
import React from 'react';
import doubt from 'src/assets/images/doubt.svg';
import config from 'src/config/index';
import { Symbol } from 'src/keyring/defaults';
import A from 'src/shared/components/button/a';
import Button from 'src/shared/components/button/button';
import NumberUtil from 'src/util/numberUtil';
import './unbondModal.scss';

type Props = {
  visible: boolean;
  unbondAmount: any;
  commission: any;
  getAmount: any;
  onOk?: Function;
  onCancel?: Function;
  bondFees?: any;
  type: 'rDOT' | 'rETH' | 'rFIS' | 'rKSM' | 'rATOM' | 'rSOL' | 'rMATIC' | 'rBNB';
};

export default function Index(props: Props) {
  return (
    <Modal visible={props.visible} className='stafi_unbond_modal' closable={false} footer={false}>
      <div className='title'>
        Unbond {NumberUtil.handleFisAmountToFixed(props.unbondAmount)} {props.type}
      </div>
      <div className='content'>
        <div className='row'>
          —Commission: {NumberUtil.handleFisAmountToFixed(props.commission)} {props.type}
          <div className='doubt'>
            <Tooltip
              overlayClassName='modal_doubt_overlay'
              placement='topLeft'
              title={'Fee charged by the StaFi to reserve as Protocol Treasury'}>
              <img src={doubt} />
            </Tooltip>
          </div>
        </div>
        <div className='row'>
          —Relay Fee: {props.bondFees} FIS
          <div className='doubt'>
            <Tooltip
              overlayClassName='modal_doubt_overlay'
              placement='topLeft'
              title={
                'Fee charged by the relayers to pay for the cross-chain contract interaction service fee between StaFi chain and designated chain.'
              }>
              <img src={doubt} />
            </Tooltip>
          </div>
        </div>
        <div className='row period'>
          {props.type == 'rDOT' && `-Date: around ${config.unboundAroundDays(Symbol.Dot)} days`}
          {props.type == 'rKSM' && `—Date: around ${config.unboundAroundDays(Symbol.Ksm)} days`}
          {props.type == 'rATOM' && `—Date: around ${config.unboundAroundDays(Symbol.Atom)} days`}
          {props.type == 'rSOL' && `—Date: around ${config.unboundAroundDays(Symbol.Sol)} days`}
          {props.type == 'rMATIC' && `—Date: around ${config.unboundAroundDays(Symbol.Matic)} days`}
          {props.type == 'rFIS' && `—Date: around ${config.unboundAroundDays(Symbol.Fis)} days`}
          {props.type == 'rBNB' && `—Date: around ${config.unboundAroundDays(Symbol.Bnb)} days`}

          <div className='doubt'>
            <Tooltip
              overlayClassName='modal_doubt_overlay'
              placement='topLeft'
              title={'unbond period is deteminted by designated chain.'}>
              <img src={doubt} />
            </Tooltip>
          </div>
        </div>

        <div className='get_count'>
          {props.type == 'rDOT' && `You will get ${props.getAmount} DOT`}
          {props.type == 'rKSM' && `You will get ${props.getAmount} KSM`}
          {props.type == 'rATOM' && `You will get ${props.getAmount} ATOM`}
          {props.type == 'rSOL' && `You will get ${props.getAmount} SOL`}
          {props.type == 'rMATIC' && `You will get ${props.getAmount} MATIC`}
          {props.type == 'rFIS' && `You will get ${props.getAmount} FIS`}
          {props.type == 'rBNB' && `You will get ${props.getAmount} BNB`}
        </div>

        <div className='btns'>
          <A
            onClick={() => {
              props.onCancel && props.onCancel();
            }}>
            Cancel
          </A>
          <Button
            onClick={() => {
              props.onOk && props.onOk();
            }}>
            Unbond
          </Button>
        </div>
      </div>
    </Modal>
  );
}
