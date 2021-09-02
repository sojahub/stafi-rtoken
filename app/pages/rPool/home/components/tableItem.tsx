import poolCurveIcon from '@images/poolCurveIcon.svg';
import poolUniswapIcon from '@images/poolUniswapIcon.png';
import poolWrapFiIcon from '@images/poolWrapFiIcon.svg';
import GhostButton from '@shared/components/button/ghostButton';
import numberUtil from '@util/numberUtil';
import React from 'react';
import { useHistory } from 'react-router-dom';

type Props = {
  pairIcon: any;
  pairValue: string;
  apr: any;
  liquidity: any;
  slippage: any;
  poolOn: 1 | 2 | 3;
  platform: string;
  poolIndex: number;
  stakeUrl?: string;
  history: any;
  liquidityUrl: string;
  wrapFiUrl: string;
  lpName: string;
  rTokenName: string;
};

export default function Index(props: Props) {
  const history = useHistory();

  return (
    <div className='row' style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <div className='col col2'>
        {props.pairIcon && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src={props.pairIcon} />
            <div style={{ textAlign: 'center', marginTop: '3px' }}>{props.pairValue}</div>
          </div>
        )}
      </div>

      <div className='col col5'>
        {props.poolOn == 1 && (
          <>
            <img src={poolUniswapIcon} /> Uniswap
          </>
        )}
        {props.poolOn == 2 && (
          <>
            <img src={poolCurveIcon} /> Curve
          </>
        )}
        {props.poolOn == 3 && (
          <>
            <img src={poolWrapFiIcon} /> WrapFi
          </>
        )}
      </div>

      <div className='col col5'>{props.platform}</div>

      <div className='col col2'>
        {/* {props.apyList.length == 0 && '0.00%'}
        {props.apyList.map((item, i) => {
          return (
            <div key={i}>
              <div>+{item.apy}% </div>
              <label>{item.symbol}</label>
            </div>
          );
        })} */}
        {props.apr !== '--' ? `+${props.apr}%` : '--'}
      </div>

      <div className='col  col3'>${numberUtil.amount_format(props.liquidity)}</div>

      <div className='col col5'>{props.slippage ? `${Number(props.slippage).toFixed(2)}%` : '--'}</div>

      <div className='col col2'>
        <GhostButton
          className='liquidity_btn'
          onClick={() => {
            history.push(`/rPool/lp/${props.platform}/${props.poolIndex}`, {
              lpName: props.lpName,
              rTokenName: props.rTokenName,
            });
          }}>
          {' '}
          Earn
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
