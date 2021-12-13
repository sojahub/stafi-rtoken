import React from 'react';
import { useHistory } from 'react-router-dom';
import poolPancakeIcon from 'src/assets/images/pancake.svg';
import poolUniswapIcon from 'src/assets/images/poolUniswapIcon.png';
import poolQuickSwapIcon from 'src/assets/images/quick_swap.png';
import GhostButton from 'src/shared/components/button/ghostButton';
import poolCurveIcon from 'src/assets/images/poolCurveIcon.svg';
import poolAtrixIcon from 'src/assets/images/pool_atrix.svg';
import { LPPoolName, LPType } from 'src/util/lpConfig';
import numberUtil from 'src/util/numberUtil';
import styled from 'styled-components';

type Props = {
  type: LPType;
  addLiquidityUrl?: string;
  isEnd: boolean;
  pairIcon: any;
  pairValue: string;
  apyList: any[];
  liquidity: any;
  slippage: any;
  poolOn: LPPoolName;
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
        {props.poolOn === LPPoolName.UNISWAP && (
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <img src={poolUniswapIcon} style={{ width: '20px', height: '20px', marginRight: '5px' }} />
            <div style={{ fontSize: '14px' }}>Uniswap</div>
          </div>
        )}

        {props.poolOn === LPPoolName.PANCAKE && (
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <img src={poolPancakeIcon} style={{ width: '20px', height: '20px', marginRight: '5px' }} />

            <div style={{ fontSize: '14px' }}>Pancake</div>
          </div>
        )}

        {props.poolOn === LPPoolName.QUICKSWAP && (
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <img src={poolQuickSwapIcon} style={{ width: '20px', height: '20px', marginRight: '5px' }} />

            <div style={{ fontSize: '14px' }}>QuickSwap</div>
          </div>
        )}

        {props.poolOn === LPPoolName.ATRIX && (
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <img src={poolAtrixIcon} style={{ width: '20px', height: '20px', marginRight: '5px' }} />

            <div style={{ fontSize: '14px' }}>Atrix</div>
          </div>
        )}

        {props.poolOn === LPPoolName.CURVE && (
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <img src={poolCurveIcon} style={{ width: '20px', height: '20px', marginRight: '5px' }} />

            <div style={{ fontSize: '14px' }}>Curve</div>
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
              {props.isEnd ? (
                <>
                  <div style={{ fontSize: '14px', lineHeight: '14px', color: '#7c7c7c' }}>Completed</div>
                </>
              ) : (
                <>
                  {item.status === -1 ? (
                    <EmptyApyText
                      onClick={() => {
                        props.addLiquidityUrl && window.open(props.addLiquidityUrl);
                      }}>
                      ? ?
                    </EmptyApyText>
                  ) : (
                    <div style={{ fontSize: '14px', lineHeight: '14px' }}>+{item.apy}%</div>
                  )}

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
                </>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ flex: '0 0 16%' }}>
        {!isNaN(props.slippage) && !props.isEnd ? `$${numberUtil.amount_format(props.liquidity)}` : '--'}
      </div>

      <div style={{ flex: '0 0 14%' }}>
        {!isNaN(props.slippage) && !props.isEnd ? `${Number(props.slippage).toFixed(2)}%` : '--'}
      </div>

      <div style={{ flex: '0 0 14%' }}>
        {props.type === LPType.ADD_LIQUIDITY ? (
          <GhostButton
            className='liquidity_btn'
            onClick={() => {
              window.open(props.addLiquidityUrl);
            }}>
            {' '}
            Add liquidity
          </GhostButton>
        ) : (
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
        )}

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

const EmptyApyText = styled.div`
  cursor: pointer;
  font-size: 14px;
  line-height: 14px;
  text-decoration: underLine;
  margin-right: 6px;
`;
