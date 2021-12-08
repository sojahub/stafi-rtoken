import React from 'react';
import poolCurveIcon from 'src/assets/images/poolCurveIcon.svg';
import poolAtrixIcon from 'src/assets/images/pool_atrix.svg';
import GhostButton from 'src/shared/components/button/ghostButton';
import numberUtil from 'src/util/numberUtil';

type Props = {
  pairIcon: any;
  pairValue: string;
  apyList: any[];
  liquidity: any;
  slippage: any;
  poolOn: number;
  history: any;
  liquidityUrl: string;
  wrapFiUrl: string;
  platform: string;
};

export default function OldTableItem(props: Props) {
  const poolName = props.poolOn === 2 ? 'Curve' : props.poolOn === 6 ? 'Atrix' : '';
  const poolIcon = props.poolOn === 2 ? poolCurveIcon : props.poolOn === 6 ? poolAtrixIcon : null;

  return (
    <div
      className='row'
      style={{
        backgroundColor: '#293038',
        marginBottom: '30px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <div style={{ flex: '0 0 14%' }}>
        {props.pairIcon && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src={props.pairIcon} alt='pair' />
            <div style={{ textAlign: 'center', marginTop: '3px' }}>{props.pairValue}</div>
          </div>
        )}
      </div>

      <div style={{ flex: '0 0 14%' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <img src={poolIcon} style={{ width: '20px', height: '20px', marginRight: '5px' }} alt={poolName} />
          <div style={{ fontSize: '14px' }}>{poolName}</div>
        </div>
      </div>

      <div style={{ flex: '0 0 14%' }}>{props.platform}</div>

      <div style={{ flex: '0 0 14%' }}>
        {props.apyList.length == 0 && '0.00%'}
        {props.apyList.map((item, i) => {
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', marginBottom: '5px' }}>
              <div style={{ fontSize: '14px', lineHeight: '14px' }}>+{item.apy}% </div>
              <div
                style={{
                  lineHeight: '12px',
                  marginLeft: '2px',
                  fontSize: '12px',
                  color: '#7c7c7c',
                  transform: 'scale(0.8)',
                  transformOrigin: 'bottom',
                  marginRight: '6px',
                  marginBottom: '1px',
                }}>
                {item.symbol}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ flex: '0 0 16%' }}>${numberUtil.amount_format(props.liquidity)}</div>

      <div style={{ flex: '0 0 14%' }}>
        {props.slippage && !isNaN(Number(props.slippage)) ? `${Number(props.slippage).toFixed(2)}%` : '--'}
      </div>

      <div style={{ flex: '0 0 14%' }}>
        <GhostButton
          className='liquidity_btn'
          onClick={() => {
            window.open(props.liquidityUrl);
          }}>
          {' '}
          Add liquidity
        </GhostButton>
      </div>
    </div>
  );
}
