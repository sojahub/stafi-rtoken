import { SyncOutlined } from '@ant-design/icons';
import config from '@config/index';
import { processStatus } from '@features/globalClice';
import doubt from '@images/doubt.svg';
import failure from '@images/failure.svg';
import success from '@images/success.png';
import { rSymbol } from '@keyring/defaults';
import Button from '@shared/components/button/button';
import StringUtil from '@util/stringUtil';
import { Tooltip } from 'antd';
import React from 'react';
import './liquidingProcessSliderItem.scss';

type Props = {
  index: number;
  title: string;
  failure?: boolean;
  showButton?: boolean;
  data?: any;
  onClick?: Function;
  tooltipText?: string;
  rSymbol?: any;
};
export default function Index(props: Props) {
  return (
    <div className='liquidingProcesSliderItem'>
      <div className='title'>
        <div className='sequence'>{props.index}</div> <label>{props.title}</label>
        <Tooltip placement='topLeft' title={props.tooltipText}>
          {' '}
          <img className='doubt' src={doubt} />
        </Tooltip>
      </div>

      <div className='item'>
        <label>{props.index == 3 ? 'Minting...' : 'Broadcasting...'} </label>
        {props.data && props.data.brocasting == processStatus.success && <img src={success} />}
        {props.data && props.data.brocasting == processStatus.failure && <img src={failure} />}
        {props.data && props.data.brocasting == processStatus.loading && <SyncOutlined type='spin' spin={true} />}
      </div>

      {props.index != 3 && (
        <div className='item'>
          <label>Packing...</label>
          {props.data && props.data.packing == processStatus.success && <img src={success} />}
          {props.data && props.data.packing == processStatus.failure && <img src={failure} />}
          {props.data && props.data.packing == processStatus.loading && <SyncOutlined type='spin' spin={true} />}
        </div>
      )}

      {(props.index == 2 ||
        (props.index == 1 && !(props.rSymbol == rSymbol.Atom || props.rSymbol == rSymbol.Matic))) && (
        <div className='item'>
          {props.data && props.data.finalizing ? <label>Finalizing...</label> : null}
          {props.data && props.data.finalizing == processStatus.success && <img src={success} />}
          {props.data && props.data.finalizing == processStatus.failure && <img src={failure} />}
          {props.data && props.data.finalizing == processStatus.loading && <SyncOutlined type='spin' spin={true} />}
        </div>
      )}

      <div className='info_panel'>
        {props.data && props.data.checkTx && (
          <div className='item'>
            <label>
              Check Tx
              {props.index == 1 && (
                <a target='_blank' href={config.txHashUrl(props.rSymbol, props.data.checkTx)} className='address'>
                  {StringUtil.replacePkhRemain6(props.data.checkTx)}
                </a>
              )}
              {props.index == 2 && (
                <a
                  target='_blank'
                  href={`https://stafi.subscan.io/extrinsic/${props.data.checkTx}`}
                  className='address'>
                  {StringUtil.replacePkh(props.data.checkTx, 6, 60)}
                </a>
              )}
              {/* ”https://kusama.subscan.io/extrinsic/" + txHash */}
            </label>
          </div>
        )}

        {props.data && (props.data.brocasting == processStatus.failure || props.data.packing == processStatus.failure) && (
          <div className='item failure'>
            <label>{props.title} is fail</label>
            {props.showButton && (
              <Button
                btnType='square'
                size='small'
                onClick={() => {
                  props.onClick && props.onClick();
                }}>
                Re-{props.title}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
