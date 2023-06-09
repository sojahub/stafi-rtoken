import React, { useState } from 'react';
import dow_svg from 'src/assets/images/dow_green.svg';
import TradePopover from 'src/components/tradePopover';
import GhostButton from 'src/shared/components/button/ghostButton';
import SwapModalNew from '../../../../../components/modal/swapModalNew';

type Props = {
  rSymbol: string;
  icon: any;
  fullName: string;
  balance: any;
  willGetBalance: any;
  unit: string;
  onSwapClick?: Function;
  trade?: string;
  tradeList?: Array<any>;
  operationType?: 'erc20' | 'bep20' | 'native' | 'spl';
  disabled?: boolean;
};

export default function Index(props: Props) {
  const [tradeModalVisible, setTradeModalVisible] = useState(false);
  const [tradeLabel, setTradeLabel] = useState('');
  const [tradeUrl, setTradeUrl] = useState('');

  const tradeUrlsData = props.tradeList?.map((item: any) => {
    return {
      label: item.label,
      url: item.url,
    };
  });

  return (
    <div className='list_item'>
      <div className='col_type'>
        <img src={props.icon} /> {props.rSymbol} <label>{props.fullName}</label>
      </div>

      <div className='col_amount'>
        <div>{props.balance}</div>
        <div>{props.rSymbol == 'FIS' ? '' : `Redeemable: ${props.willGetBalance} ${props.unit}`}</div>
      </div>

      <div className='col_btns'>
        {
          <TradePopover
            data={tradeUrlsData}
            onClick={
              props.operationType === 'erc20' || props.operationType === 'bep20'
                ? null
                : (item: any) => {
                    setTradeLabel(item.label);
                    setTradeUrl(item.url);
                    setTradeModalVisible(true);
                  }
            }>
            <GhostButton disabled={!props.tradeList || props.tradeList.length === 0}>
              Trade
              {<img className='dow_svg' src={dow_svg} alt='down' />}
            </GhostButton>
          </TradePopover>
        }

        <GhostButton
          disabled={props.disabled}
          onClick={() => {
            props.onSwapClick && props.onSwapClick();
          }}>
          Swap
        </GhostButton>
      </div>

      <SwapModalNew
        type={props.rSymbol}
        visible={tradeModalVisible}
        label={tradeLabel}
        tradeUrl={tradeUrl}
        onCancel={() => {
          setTradeModalVisible(false);
        }}
        onClickSwap={() => {
          props.onSwapClick && props.onSwapClick(tradeLabel === 'Uniswap' && 'erc20');
        }}
      />
    </div>
  );
}
