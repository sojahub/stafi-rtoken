import React from 'react';
import { useHistory } from 'react-router-dom';
import poolPancakeIcon from 'src/assets/images/pancake.svg';
import poolUniswapIcon from 'src/assets/images/poolUniswapIcon.png';
import poolQuickSwapIcon from 'src/assets/images/quick_swap.png';
import GhostButton from 'src/shared/components/button/ghostButton';
import numberUtil from 'src/util/numberUtil';

type Props = {
  pairIcon: any;
  pairValue: string;
  apyList: any[];
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
      <div style={{ flex: '0 0 14%' }}>
        {props.pairIcon && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src={props.pairIcon} />
            <div style={{ textAlign: 'center', marginTop: '3px' }}>{props.pairValue}</div>
          </div>
        )}
      </div>

      <div style={{ flex: '0 0 14%' }}>
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

      <div style={{ flex: '0 0 14%' }}>{props.platform}</div>

      <div style={{ flex: '0 0 14%' }}>
        {/* <div style={{ fontSize: '14px', lineHeight: '14px' }}>{props.apr !== '--' ? `+${props.apr}%` : '--'}</div>
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
        </div> */}
        {props.apyList.length === 0 && '0%'}

        {props.apyList.map((item, i) => {
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', margin: '15px 0' }}>
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

      <div style={{ flex: '0 0 16%' }}>
        {!isNaN(props.slippage) ? `$${numberUtil.amount_format(props.liquidity)}` : '--'}
      </div>

      <div style={{ flex: '0 0 14%' }}>{!isNaN(props.slippage) ? `${Number(props.slippage).toFixed(2)}%` : '--'}</div>

      <div style={{ flex: '0 0 14%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          {props.apyList.map((item) => (
            <div style={{ padding: '5px 0' }} key={item.index}>
              <GhostButton
                className='liquidity_btn'
                onClick={() => {
                  history.push(`/rPool/lp/${props.platform}/${props.poolIndex}/${props.lpContract}`, {
                    apy: item.apy,
                    status: item.status,
                  });
                }}>
                {' '}
                Earn
              </GhostButton>
            </div>
          ))}
        </div>

        {/* <GhostButton
          className='liquidity_btn'
          onClick={() => {
            history.push(`/rPool/lp/${props.platform}/${props.poolIndex}/${props.lpContract}`);
          }}>
          {' '}
          Earn
        </GhostButton> */}

        {/* {props.poolOn==3?<BottonPopover data={[{label:"StaFi",url:props.stakeUrl},{label:"WrapFi",url:props.wrapFiUrl}]}>
                      Stake 
                    </BottonPopover>:<GhostButton onClick={()=>{
                      window.open(props.stakeUrl);
                    }} className="stake_btn">Stake</GhostButton> } */}
      </div>
    </div>
  );
}
