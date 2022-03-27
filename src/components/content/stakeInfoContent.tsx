// @ts-nocheck

import { message } from 'antd';
import qs from 'querystring';
import React, { useEffect, useState } from 'react';
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
import arrowIcon from 'src/assets/images/staker_info_content_arrow.svg';
import { useLastEraReward } from 'src/hooks/useEraReward';
import { useTradeList } from 'src/hooks/useTradeList';
import Button from 'src/shared/components/button/button';
import { requestSwitchMetaMaskNetwork } from 'src/util/metaMaskUtil';
import NumberUtil from 'src/util/numberUtil';
import styled from 'styled-components';
import { HContainer, Text } from '../commonComponents';
import RedeemSwapModal from '../modal/RedeemSwapModal';
import SwapModalNew from '../modal/swapModalNew';
import TradePopover from '../tradePopover';
import LeftContent from './leftContent';
import { SelectPlatformPopover } from './SelectPlatformPopover';

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
  platform?: string;
  redeemableTokenAmount?: any;
};

export default function Index(props: Props) {
  const history = useHistory();

  const [visibleModal, setVisibleModal] = useState(false);
  const [redeemSwapModalVisible, setRedeemSwapModalVisible] = useState(false);
  const [tradeLabel, setTradeLabel] = useState('Uniswap');
  const [selectedTradeUrl, setSelectedTradeUrl] = useState();
  const tradeList = useTradeList(props.platform?.toLowerCase(), props.type);
  const { lastEraReward } = useLastEraReward(props.platform, props.type);

  useEffect(() => {
    if (props.platform === 'ERC20') {
      requestSwitchMetaMaskNetwork('Ethereum');
    } else if (props.platform === 'BEP20') {
      requestSwitchMetaMaskNetwork('BSC');
    }
  }, [props.platform]);

  useEffect(() => {
    if (
      !history.location.search ||
      history.location.search.length < 1 ||
      !qs.parse(history.location.search.slice(1)).platform
    ) {
      // const defaultPlatform = props.type === 'rETH' ? 'ERC20' : 'Native';
      const defaultPlatform = 'Native';
      // console.log('defaultPlatform', defaultPlatform);
      history.replace(`${history.location.pathname}?platform=${defaultPlatform}`);
    }
  }, [history, props.type]);

  return (
    <LeftContent className='stafi_stake_info_context'>
      <div className='item'>
        <div style={{ marginLeft: '20px', marginTop: '20px' }}>
          <SelectPlatformPopover
            type={props.type}
            currentPlatform={props.platform}
            onClick={(platform: string) => {
              history.replace(history.location.pathname + `?platform=${platform}`);
            }}
          />
        </div>

        <TitleContainer>
          <div className='title'>
            {props.type === 'rDOT' && <img src={rDOT_stafi_svg} style={{ width: '36px' }} alt='icon' />}
            {props.type === 'rKSM' && <img src={rKSM_stafi_svg} style={{ width: '36px' }} alt='icon' />}
            {props.type === 'rATOM' && <img src={rATOM_stafi_svg} style={{ width: '36px' }} alt='icon' />}
            {props.type === 'rETH' && <img src={rETH_stafi_svg} style={{ width: '36px' }} alt='icon' />}
            {props.type === 'rFIS' && <img src={rFIS_stafi_svg} style={{ width: '36px' }} alt='icon' />}
            {props.type === 'rSOL' && <img src={rSOL_stafi_svg} style={{ width: '36px' }} alt='icon' />}
            {props.type === 'rMATIC' && <img src={rMatic_stafi_svg} style={{ width: '36px' }} alt='icon' />}
            {props.type === 'rBNB' && <img src={rBnb_stafi_svg} style={{ width: '36px' }} alt='icon' />}
            {props.type}
          </div>

          <TokenAmountContainer>
            <Text size='30px' bold sameLineHeight color='#00F3AB'>
              {isNaN(Number(props.tokenAmount)) ? '--' : NumberUtil.handleFisAmountToFixed(props.tokenAmount)}
            </Text>

            <Text size='12px' sameLineHeight color='#c4c4c4' mt='10px'>
              Redeemable {props.type.slice(1)}:{' '}
              {isNaN(props.redeemableTokenAmount) ? '--' : props.redeemableTokenAmount}
            </Text>
          </TokenAmountContainer>
        </TitleContainer>

        <InfoContainer>
          <InfoItem>
            <Text size='12px' scale={0.83} bold transformOrigin='center top' color='#C4C4C4'>
              Staked {props.type.slice(1)}
            </Text>

            <Text size='16px' bold color='#ffffff' mt='8px'>
              {props.tokenAmount !== '--' && props.ratio !== '--'
                ? Number(props.tokenAmount * props.ratio) > 0 && Number(props.tokenAmount * props.ratio) < 0.0001
                  ? '<0.0001'
                  : NumberUtil.handleAmountFloorToFixed(props.tokenAmount * props.ratio, 3)
                : '--'}{' '}
              {/* {props.type.slice(1)} */}
            </Text>
          </InfoItem>

          <InfoDivider />

          <InfoItem
            style={{ cursor: 'pointer' }}
            onClick={() => {
              if (props.type === 'rETH') {
                message.info('Redemption will be supported once ETH2.0 Phase 1.5 is released');
                return;
              }
              history.push(`/${props.type}/staker/unbondRecords`);
            }}>
            <HContainer>
              <Text size='12px' scale={0.83} bold transformOrigin='center top' color='#C4C4C4' clickable>
                Unbonding {props.type.slice(1)}
              </Text>

              <img src={arrowIcon} width='3px' height='5.1px' alt='arrow' />
            </HContainer>

            <Text size='16px' bold color='#ffffff' mt='8px' clickable>
              {props.totalUnbonding !== '--'
                ? Number(props.totalUnbonding) > 0 && Number(props.totalUnbonding) < 0.0001
                  ? '<0.0001'
                  : NumberUtil.handleAmountFloorToFixed(props.totalUnbonding, 3)
                : '--'}{' '}
              {/* {props.type.slice(1)} */}
            </Text>
          </InfoItem>

          <InfoDivider />

          <InfoItem style={{ cursor: 'pointer' }} onClick={() => history.push(`/${props.type}/staker/reward`)}>
            <HContainer>
              <Text size='12px' scale={0.83} bold transformOrigin='center top' color='#C4C4C4' clickable>
                Reward of last era
              </Text>

              <img src={arrowIcon} width='3px' height='5.1px' alt='arrow' />
            </HContainer>

            <Text size='16px' bold color='#ffffff' mt='8px' clickable>
              {lastEraReward !== '--'
                ? Number(lastEraReward) > 0 && Number(lastEraReward) < 0.000001
                  ? '<0.000001'
                  : NumberUtil.handleAmountFloorToFixed(lastEraReward, 6)
                : '--'}{' '}
              {/* {props.type.slice(1)} */}
            </Text>
          </InfoItem>
        </InfoContainer>

        <div className='content'>
          <div className='btns'>
            <Button
              size='small'
              btnType='ellipse'
              onClick={() => {
                if (props.platform === 'Native' || (props.platform === 'ERC20' && props.type === 'rETH')) {
                  props.onRdeemClick && props.onRdeemClick();
                } else {
                  setRedeemSwapModalVisible(true);
                }
              }}
              btnStyle={{ marginRight: '10px' }}>
              Redeem
            </Button>

            <TradePopover
              data={tradeList}
              onClick={
                props.platform === 'ERC20' || props.platform === 'BEP20'
                  ? null
                  : (item: any) => {
                      setVisibleModal(true);
                      setTradeLabel(item.label);
                      setSelectedTradeUrl(item.url);
                    }
              }>
              <Button
                size='small'
                btnType='ellipse'
                disabled={!tradeList || tradeList.length === 0}
                btnStyle={{ marginLeft: '0px' }}>
                Trade <img className='dow_svg' src={dow_svg} alt='down arrow' />{' '}
              </Button>{' '}
            </TradePopover>
          </div>
        </div>
      </div>

      <TitleContainer style={{ marginTop: '40px', marginLeft: '20px' }}>
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

      <Text size='12px' color='#c4c4c4' mt='44px' ml='20px' mb='10px'>
        Updated every {props.hours} hours
      </Text>

      <SwapModalNew
        visible={visibleModal}
        type={props.type}
        label={tradeLabel}
        tradeUrl={selectedTradeUrl}
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

      <RedeemSwapModal
        type={props.type}
        platform={props.platform}
        visible={redeemSwapModalVisible}
        onCancel={() => {
          setRedeemSwapModalVisible(false);
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
