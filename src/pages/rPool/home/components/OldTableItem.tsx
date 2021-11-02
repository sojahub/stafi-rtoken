import React from 'react';
import poolCurveIcon from 'src/assets/images/poolCurveIcon.svg';
import GhostButton from 'src/shared/components/button/ghostButton';
import numberUtil from 'src/util/numberUtil';

type Props = {
  pairIcon: any;
  pairValue: string;
  apyList: any[];
  liquidity: any;
  slippage: any;
  poolOn: 1 | 2 | 3;
  history: any;
  liquidityUrl: string;
  wrapFiUrl: string;
  platform: string;
};

export default function OldTableItem(props: Props) {
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
      <div className='col col2'>
        {props.pairIcon && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src={props.pairIcon} />
            <div style={{ textAlign: 'center', marginTop: '3px' }}>{props.pairValue}</div>
          </div>
        )}
      </div>

      <div className='col col5'>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <img src={poolCurveIcon} style={{ width: '20px', height: '20px', marginRight: '5px' }} />
          <div style={{ fontSize: '14px' }}>Curve</div>
        </div>
      </div>

      <div className='col col5'>{props.platform}</div>

      <div className='col col2'>
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

      <div className='col  col4'>${numberUtil.amount_format(props.liquidity)}</div>

      <div className='col col5'>
        {props.slippage && !isNaN(Number(props.slippage)) ? `${Number(props.slippage).toFixed(2)}%` : '--'}
      </div>

      <div className='col col2'>
        <GhostButton
          className='liquidity_btn'
          onClick={() => {
            if (props.poolOn == 3) {
              window.open(props.wrapFiUrl);
            } else {
              window.open(props.liquidityUrl);
            }
          }}>
          {' '}
          Add liquidity
        </GhostButton>
        {/* {props.poolOn==3?<BottonPopover data={[{label:"StaFi",url:props.stakeUrl},{label:"WrapFi",url:props.wrapFiUrl}]}>
                      Stake 
                    </BottonPopover>:<GhostButton onClick={()=>{
                      window.open(props.stakeUrl);
                    }} className="stake_btn">Stake</GhostButton> } */}
      </div>
    </div>
  );
}
