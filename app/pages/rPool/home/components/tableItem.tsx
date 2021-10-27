import poolPancakeIcon from '@images/pancake.svg';
import poolUniswapIcon from '@images/poolUniswapIcon.png';
import poolQuickSwapIcon from '@images/quick_swap.png';
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
  lpContract: string;
  history: any;
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
        {props.platform === 'Ethereum' && (
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <img src={poolUniswapIcon} style={{ width: '20px', height: '20px', marginRight: '5px' }} />
            <div style={{ fontSize: '14px' }}>Uniswap</div>
          </div>
        )}

        {props.platform === 'BSC' && (
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <img src={poolPancakeIcon} style={{ width: '20px', height: '20px', marginRight: '5px' }} />

            <div style={{ fontSize: '14px' }}>Pancake</div>
          </div>
        )}

        {props.platform === 'Polygon' && (
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <img src={poolQuickSwapIcon} style={{ width: '20px', height: '20px', marginRight: '5px' }} />

            <div style={{ fontSize: '14px' }}>QuickSwap</div>
          </div>
        )}
      </div>

      <div className='col col5'>{props.platform}</div>

      <div className='col col2' style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
        <div style={{ fontSize: '14px', lineHeight: '14px' }}>{props.apr !== '--' ? `+${props.apr}%` : '--'}</div>
        <div
          style={{
            lineHeight: '12px',
            fontSize: '12px',
            color: '#7c7c7c',
            transform: 'scale(0.8)',
            transformOrigin: 'bottom',
            marginLeft: '2px',
            marginRight: '6px',
            marginBottom: '1px',
          }}>
          FIS
        </div>
      </div>

      <div className='col  col4'>{!isNaN(props.slippage) ? `$${numberUtil.amount_format(props.liquidity)}` : '--'}</div>

      <div className='col col5'>{!isNaN(props.slippage) ? `${Number(props.slippage).toFixed(2)}%` : '--'}</div>

      <div className='col col2'>
        <GhostButton
          className='liquidity_btn'
          onClick={() => {
            history.push(`/rPool/lp/${props.platform}/${props.poolIndex}/${props.lpContract}`);
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
