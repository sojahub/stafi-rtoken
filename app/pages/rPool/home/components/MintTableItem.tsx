import { getRsymbolByTokenTitle } from '@config/index';
import stafiIcon from '@images/stafi_green.svg';
import { rSymbol } from '@keyring/defaults';
import GhostButton from '@shared/components/button/ghostButton';
import numberUtil from '@util/numberUtil';
import { message } from 'antd';
import React from 'react';
import { useHistory } from 'react-router-dom';

type Props = {
  actData: any;
  tokenType: string;
  pairIcon: any;
  pairValue: string;
  poolOn: 1 | 2 | 3;
  stakeUrl?: string;
  history: any;
  liquidityUrl: string;
  wrapFiUrl: string;
};

export default function MintTableItem(props: Props) {
  const history = useHistory();
  const { actData, tokenType } = props;

  const clickEarn = () => {
    let symbol;
    if (tokenType === 'rDOT') {
      symbol = rSymbol.Dot;
    } else if (tokenType === 'rMATIC') {
      symbol = rSymbol.Matic;
    } else if (tokenType === 'rFIS') {
      symbol = rSymbol.Fis;
    } else if (tokenType === 'rKSM') {
      symbol = rSymbol.Ksm;
    } else if (tokenType === 'rATOM') {
      symbol = rSymbol.Atom;
    } else if (tokenType === 'rETH') {
      symbol = rSymbol.Eth;
    } else {
      message.error('Unsupported token type');
      return;
    }
    history.push(`/rPool/mint/${symbol}/${actData.cycle}`);
  };

  if (!actData) {
    return null;
  }

  return (
    <div className='row'>
      <div className='col col1' style={{ display: 'flex', alignItems: 'center' }}>
        {props.pairIcon && (
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <img src={props.pairIcon} style={{ width: '26px', height: '26px', marginRight: '10px' }} />
            <div style={{ fontSize: '16px' }}>{props.pairValue}</div>
          </div>
        )}
      </div>

      <div className='col col5' style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <img src={stafiIcon} style={{ width: '16px', height: '16px', marginRight: '5px' }} />

          <div style={{ fontSize: '14px' }}>StaFi</div>
        </div>
      </div>

      <div className='col col2' style={{ display: 'flex', alignItems: 'center' }}>
        <div>1:{numberUtil.tokenMintRewardRateToHuman(actData.reward_rate, getRsymbolByTokenTitle(tokenType))}</div>
      </div>

      <div className='col  col5' style={{ display: 'flex', alignItems: 'center' }}>
        {numberUtil.amount_format(numberUtil.fisAmountToHuman(actData.total_reward))}
      </div>

      <div className='col  col5' style={{ display: 'flex', alignItems: 'center' }}>
        {actData.nowBlock >= actData.end ? 'End' : `${actData.durationInDays}D(${actData.remainingTime})`}
      </div>

      <div className='col col6' style={{ display: 'flex', alignItems: 'center' }}>
        <GhostButton className='liquidity_btn' onClick={clickEarn}>
          Earn
        </GhostButton>
      </div>
    </div>
  );
}
