// @ts-nocheck

import React, { useMemo, useState } from 'react';
import { useHistory } from 'react-router';
import dow_svg from 'src/assets/images/left_arrow_black.svg';
import rDOT_DOT_svg from 'src/assets/images/rDOT_DOT.svg';
import rATOM_stafi_svg from 'src/assets/images/selected_r_atom.svg';
import rBnb_stafi_svg from 'src/assets/images/selected_r_bnb.svg';
import rDOT_stafi_svg from 'src/assets/images/selected_r_dot.svg';
import rETH_stafi_svg from 'src/assets/images/selected_r_eth.svg';
import rFIS_stafi_svg from 'src/assets/images/selected_r_fis.svg';
import rKSM_stafi_svg from 'src/assets/images/selected_r_ksm.svg';
import rMatic_stafi_svg from 'src/assets/images/selected_r_matic.svg';
import rSOL_stafi_svg from 'src/assets/images/selected_r_sol.svg';
import config from 'src/config/index';
import Button from 'src/shared/components/button/button';
import NumberUtil from 'src/util/numberUtil';
import styled from 'styled-components';
import { HContainer, Text } from '../commonComponents';
import SwapModalNew from '../modal/swapModalNew';
import TradePopover from '../tradePopover';
import LeftContent from './leftContent';
import { SelectPlatformPopover } from './SelectPlatformPopover';
import { UnbondRecord } from './UnbondRecord';

type Props = {
  onRdeemClick?: Function;
  ratio?: any;
  tokenAmount?: any;
  ratioShow?: any;
  onStakeClick?: any;
  type: 'rDOT' | 'rETH' | 'rFIS' | 'rKSM' | 'rATOM' | 'rSOL' | 'rMATIC' | 'rBNB';
  totalUnbonding?: any;
  onSwapClick?: Function;
  onUniswapClick?: Function;
  hours?: number;
  lastEraRate?: any;
  platform?: string;
  redeemableTokenAmount?: any;
};

export default function Index(props: Props) {
  const history = useHistory();

  const [showUnbondRecord, setShowUnbondRecord] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [tradeLabel, setTradeLabel] = useState('Uniswap');
  const [selectedExchange, setSelectedExchange] = useState('');

  const tradeUrl = useMemo(() => {
    if (props.type === 'rDOT') {
      return config.uniswap.rdotURL;
    }
    if (props.type === 'rFIS') {
      return config.uniswap.rfisURL;
    }
    if (props.type === 'rKSM') {
      return config.uniswap.rksmURL;
    }
    if (props.type === 'rATOM') {
      return config.uniswap.ratomURL;
    }
    if (props.type === 'rMATIC') {
      return config.quickswap.rmaticURL;
    }
    if (props.type === 'rETH') {
      if (selectedExchange === 'Uniswap') {
        return config.uniswap.rethURL;
      }
      if (selectedExchange === 'Curve') {
        return config.curve.rethURL;
      }
    }
  }, [props.type, selectedExchange]);

  const showNative = props.type !== 'rETH';
  const showErc20 =
    props.type === 'rETH' ||
    props.type === 'rFIS' ||
    props.type === 'rKSM' ||
    props.type === 'rDOT' ||
    props.type === 'rATOM' ||
    props.type === 'rMATIC';
  const showBep20 =
    props.type === 'rFIS' ||
    props.type === 'rKSM' ||
    props.type === 'rDOT' ||
    props.type === 'rATOM' ||
    props.type === 'rMATIC' ||
    props.type === 'rBNB';
  const showSpl = props.type === 'rSOL';

  const platformArr = [];
  if (showNative) {
    platformArr.push('Native');
  }
  if (showErc20) {
    platformArr.push('ERC20');
  }
  if (showBep20) {
    platformArr.push('BEP20');
  }
  if (showSpl) {
    platformArr.push('SPL');
  }

  if (showUnbondRecord) {
    return (
      <LeftContent className='stafi_stake_info_context' padding='36px 10px'>
        <UnbondRecord onClickBack={() => setShowUnbondRecord(false)} />
      </LeftContent>
    );
  }

  return (
    <LeftContent className='stafi_stake_info_context'>
      <div className='item'>
        <SelectPlatformPopover
          currentPlatform={props.platform}
          platforms={platformArr}
          onClick={(platform: string) => {
            history.push(history.location.pathname + `?platform=${platform}`);
          }}
        />

        <TitleContainer>
          <div className='title'>
            {props.type === 'rDOT' && <img src={rDOT_stafi_svg} style={{ width: '40px' }} alt='icon' />}
            {props.type === 'rKSM' && <img src={rKSM_stafi_svg} style={{ width: '40px' }} alt='icon' />}
            {props.type === 'rATOM' && <img src={rATOM_stafi_svg} style={{ width: '40px' }} alt='icon' />}
            {props.type === 'rETH' && <img src={rETH_stafi_svg} style={{ width: '40px' }} alt='icon' />}
            {props.type === 'rFIS' && <img src={rFIS_stafi_svg} style={{ width: '40px' }} alt='icon' />}
            {props.type === 'rSOL' && <img src={rSOL_stafi_svg} style={{ width: '40px' }} alt='icon' />}
            {props.type === 'rMATIC' && <img src={rMatic_stafi_svg} style={{ width: '40px' }} alt='icon' />}
            {props.type === 'rBNB' && <img src={rBnb_stafi_svg} style={{ width: '40px' }} alt='icon' />}
            {props.type}
          </div>

          <TokenAmountContainer>
            <Text size='30px' bold sameLineHeight color='#00F3AB'>
              {props.tokenAmount === '--' ? '--' : NumberUtil.handleFisAmountToFixed(props.tokenAmount)}
            </Text>

            <Text size='12px' sameLineHeight color='#c4c4c4' mt='10px'>
              Redeemable {props.type.slice(1)}: {props.redeemableTokenAmount}
            </Text>
          </TokenAmountContainer>
        </TitleContainer>

        <InfoContainer>
          <InfoItem>
            <Text size='12px' scale={0.67} bold transformOrigin='center top' color='#C4C4C4'>
              Staked {props.type.slice(1)}
            </Text>

            <Text size='16px' bold color='#ffffff' mt='8px'>
              {props.tokenAmount !== '--' && props.ratio !== '--'
                ? NumberUtil.handleAmountFloorToFixed(props.tokenAmount * props.ratio, 2)
                : '--'}{' '}
              {props.type.slice(1)}
            </Text>
          </InfoItem>

          <InfoDivider />

          <InfoItem style={{ cursor: 'pointer' }} onClick={() => setShowUnbondRecord(true)}>
            <Text size='12px' scale={0.67} bold transformOrigin='center top' color='#C4C4C4' clickable>
              Unbonding {props.type.slice(1)} &gt;
            </Text>

            <Text size='16px' bold color='#ffffff' mt='8px' clickable>
              {NumberUtil.handleAmountFloorToFixed(props.totalUnbonding, 2)} {props.type.slice(1)}
            </Text>
          </InfoItem>

          <InfoDivider />

          <InfoItem>
            <Text size='12px' scale={0.67} bold transformOrigin='center top' color='#C4C4C4'>
              Reward of last era &gt;
            </Text>

            <Text size='16px' bold color='#ffffff' mt='8px'>
              {NumberUtil.handleAmountFloorToFixed(props.lastEraRate * props.tokenAmount, 2)} {props.type.slice(1)}
            </Text>
          </InfoItem>
        </InfoContainer>

        <div className='content'>
          <div className='btns'>
            <Button
              size='small'
              btnType='ellipse'
              onClick={() => {
                props.onRdeemClick && props.onRdeemClick();
              }}>
              Redeem
            </Button>

            {props.type === 'rETH' && (
              <TradePopover
                data={[
                  { label: 'Curve', url: config.curve.rethURL },
                  { label: 'Uniswap', url: config.uniswap.rethURL },
                ]}
                onClick={(item: any) => {
                  setSelectedExchange(item.label);
                  setVisibleModal(true);
                  setTradeLabel(item.label);
                }}>
                {' '}
                <Button size='small' btnType='ellipse'>
                  Trade <img className='dow_svg' src={dow_svg} alt='down arrow' />{' '}
                </Button>{' '}
              </TradePopover>
            )}

            {/* {props.type === 'rBNB' && (
              <Button
                onClick={() => {
                  message.info('DEX Pool for rBNB will be open soon.');
                }}
                size='small'
                btnType='ellipse'>
                Trade
              </Button>
            )} */}

            {props.type !== 'rETH' && (
              <TradePopover
                data={[{ label: props.type !== 'rMATIC' ? 'Uniswap' : 'Quickswap', url: tradeUrl }]}
                onClick={(item: any) => {
                  setSelectedExchange(item.label);
                  setVisibleModal(true);
                  setTradeLabel(item.label);
                }}>
                <Button size='small' btnType='ellipse' disabled={!tradeUrl}>
                  Trade
                  <img className='dow_svg' src={dow_svg} alt='down arrow' />
                </Button>
              </TradePopover>
            )}
          </div>
        </div>
      </div>

      <TitleContainer style={{ marginTop: '40px' }}>
        <HContainer>
          <img src={rDOT_DOT_svg} alt='icon' width='36px' height='36px' />
          <Text size='30px' bold color='white' ml='10px'>
            {props.type === 'rDOT' && `rDOT / DOT`}
            {props.type === 'rFIS' && `rFIS / FIS`}
            {props.type === 'rKSM' && `rKSM / KSM`}
            {props.type === 'rATOM' && `rATOM / ATOM`}
            {props.type === 'rETH' && `rETH / ETH`}
            {props.type === 'rSOL' && `rSOL / SOL`}
            {props.type === 'rMATIC' && `rMATIC / MATIC`}
            {props.type === 'rBNB' && `rBNB / BNB`}
          </Text>
        </HContainer>

        <Text size='30px' bold color='#00F3AB'>
          {props.ratioShow}
        </Text>
      </TitleContainer>

      <Text size='12px' color='#c4c4c4' mt='44px' ml='10px' mb='10px'>
        Updated every {props.hours} hours
      </Text>

      <SwapModalNew
        type={props.type}
        visible={visibleModal}
        label={tradeLabel}
        tradeUrl={tradeUrl}
        onCancel={() => {
          setVisibleModal(false);
        }}
        onClickSwap={() => {
          if (props.type === 'rETH') {
            history.push(`/rAsset/swap/erc20/default`, {
              rSymbol: props.type,
            });
          } else {
            history.push(`/rAsset/swap/native/default`, {
              rSymbol: props.type,
            });
          }
        }}
      />
    </LeftContent>
  );
}

const TitleContainer = styled.div`
  margin-left: 10px;
  margin-right: 20px;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
`;

const TokenAmountContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const InfoContainer = styled.div`
  margin: 50px 20px 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const InfoDivider = styled.div`
  width: 1px;
  height: 38px;
  background-color: #444545;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 45px;
  flex: 1;
`;
