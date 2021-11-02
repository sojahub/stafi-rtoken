import { HContainer, Text } from '@components/commonComponents';
import { BSC_CHAIN_ID, ETH_CHAIN_ID, SOL_CHAIN_ID, STAFI_CHAIN_ID } from '@features/bridgeClice';
import doubt from '@images/doubt.svg';
import bep20Icon from '@images/mint_type_bep20.svg';
import bep20SelectedIcon from '@images/mint_type_bep20_selected.svg';
import erc20Icon from '@images/mint_type_erc20.svg';
import erc20SelectedIcon from '@images/mint_type_erc20_selected.svg';
import nativeIcon from '@images/mint_type_native.svg';
import nativeSelectedIcon from '@images/mint_type_native_selected.svg';
import splIcon from '@images/mint_type_spl.svg';
import splSelectedIcon from '@images/mint_type_spl_selected.svg';
import numberUtil from '@util/numberUtil';
import { Tooltip } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

interface MintTypeCardProps {
  tokenType: 'rDOT' | 'rFIS' | 'rKSM' | 'rATOM' | 'rSOL' | 'rMATIC' | 'rBNB';
  relayFee: any;
  swapFee?: any;
  selected: boolean;
  chainId: number;
  onClick: Function;
}

export default function MintTypeCard(props: MintTypeCardProps) {
  let platformIcon;
  let title;
  if (props.chainId === STAFI_CHAIN_ID) {
    platformIcon = props.selected ? nativeSelectedIcon : nativeIcon;
    title = 'NATIVE';
  } else if (props.chainId === ETH_CHAIN_ID) {
    platformIcon = props.selected ? erc20SelectedIcon : erc20Icon;
    title = 'ERC20';
  } else if (props.chainId === BSC_CHAIN_ID) {
    platformIcon = props.selected ? bep20SelectedIcon : bep20Icon;
    title = 'BEP20';
  } else if (props.chainId === SOL_CHAIN_ID) {
    platformIcon = props.selected ? splSelectedIcon : splIcon;
    title = 'SPL';
  }

  const { processSlider } = useSelector((state: any) => {
    return {
      processSlider: state.globalModule.processSlider,
    };
  });

  return (
    <CardContainer
      selected={props.selected}
      disabled={processSlider}
      onClick={() => {
        if (!processSlider) {
          props.onClick(props.chainId);
        }
      }}>
      <HeadContainer selected={props.selected} type='erc20' img={platformIcon}>
        <Text color={props.selected ? '#00F3AB' : '#fff'} size='14px' sameLineHeight bold>
          {title}
        </Text>

        <Text color='#ffffff' size='12px' sameLineHeight mt='3px' scale={0.7}>
          {props.chainId === ETH_CHAIN_ID
            ? 'Ethereum'
            : props.chainId === BSC_CHAIN_ID
            ? 'BSC'
            : props.chainId === STAFI_CHAIN_ID
            ? 'StaFi Chain'
            : props.chainId === SOL_CHAIN_ID
            ? 'Solana'
            : ''}
        </Text>
      </HeadContainer>

      <Divider />

      <Text bold size='12px' scale={0.83} transformOrigin='top center' whiteSpace='nowrap' mt='6px'>
        {props.chainId === ETH_CHAIN_ID
          ? 'Used for DeFi on Ethereum'
          : props.chainId === BSC_CHAIN_ID
          ? 'Used for DeFi on BSC'
          : props.chainId === STAFI_CHAIN_ID
          ? 'Used on StaFi Ecosystem'
          : props.chainId === SOL_CHAIN_ID
          ? 'Used for DeFi on Solana'
          : ''}
      </Text>

      <StakeDetailContainer>
        {props.tokenType !== 'rFIS' && (
          <HContainer alignItems='flex-start'>
            <Text size='12px' scale={0.83} transformOrigin='top center' color='#C4C4C4' sameLineHeight mb='2px'>
              Relay Fee: {props.relayFee} FIS
            </Text>

            <Tooltip
              overlayClassName='doubt_overlay'
              placement='topLeft'
              title={
                'Fee charged by the relayers to pay for the cross-chain contract interaction service fee between StaFi chain and designated chain.'
              }>
              <img src={doubt} style={{ width: '6px', height: '6px', marginLeft: '-6px' }} />
            </Tooltip>
          </HContainer>
        )}

        {props.chainId !== STAFI_CHAIN_ID && (
          <Text size='12px' scale={0.83} transformOrigin='top center' color='#C4C4C4' sameLineHeight mb='2px'>
            Bridge Fee: {isNaN(props.swapFee) ? '--' : Math.ceil(numberUtil.mul(props.swapFee * 1, 100)) / 100} FIS
          </Text>
        )}

        <Text size='12px' scale={0.83} transformOrigin='top center' color='#C4C4C4' sameLineHeight>
          Time:{' '}
          {props.tokenType === 'rFIS' && props.chainId === STAFI_CHAIN_ID
            ? '<1 minute'
            : props.tokenType === 'rFIS' || props.chainId === STAFI_CHAIN_ID
            ? '1~2 minutes'
            : '2~4 minutes'}
        </Text>
      </StakeDetailContainer>
    </CardContainer>
  );
}

type CardContainerProps = {
  selected: boolean;
  disabled: boolean;
};

export const CardContainer = styled.div<CardContainerProps>`
  cursor: ${(props) => (props.disabled ? 'no-drop' : 'pointer')};
  width: 148px;
  height: 220px;
  border-radius: 4px;
  border: 1px solid #696367;
  border-width: ${(props) => (props.selected ? '2px' : '1px')};
  border-color: ${(props) => (props.selected ? '#159272' : '#696367')};
  margin: 0 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

type HeadContainerProps = {
  selected: boolean;
  type: string;
  img: any;
};

export const HeadContainer = styled.div<HeadContainerProps>`
  background: url(${(props) => props.img}) center center no-repeat;
  width: 148px;
  height: 130px;
  padding-top: 32px;
  padding-left: 74px;
`;

export const StakeDetailContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Divider = styled.div`
  height: 1px;
  background-color: rgba(71, 71, 71, 0.5);
  margin: 0 4px;
  align-self: stretch;
`;
