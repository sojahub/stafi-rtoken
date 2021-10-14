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
import { Tooltip } from 'antd';
import React from 'react';
import styled from 'styled-components';

interface MintTypeCardProps {
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

  return (
    <CardContainer selected={props.selected} onClick={() => props.onClick(props.chainId)}>
      <HeadContainer selected={props.selected} type='erc20' img={platformIcon}>
        <Text color={props.selected ? '#00F3AB' : '#fff'} size='14px' sameLineHeight>
          {title}
        </Text>

        <Text color='#ffffff' size='12px' sameLineHeight mt='3px' scale={0.6}>
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

      <Text size='12px' scale={0.83} transformOrigin='top center' whiteSpace='nowrap'>
        Used for DeFi on Ethereum
      </Text>

      <StakeDetailContainer>
        <HContainer alignItems='flex-start'>
          <Text size='12px' scale={0.83} transformOrigin='top center' color='#C4C4C4' sameLineHeight>
            Relay Fee: 3 FIS
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

        {props.chainId !== STAFI_CHAIN_ID && (
          <Text size='12px' scale={0.83} transformOrigin='top center' color='#C4C4C4' sameLineHeight mt='2px'>
            Bridge Fee: 30 FIS
          </Text>
        )}

        <Text size='12px' scale={0.83} transformOrigin='top center' color='#C4C4C4' sameLineHeight mt='2px'>
          Time: 1~2 minutes
        </Text>
      </StakeDetailContainer>
    </CardContainer>
  );
}

type CardContainerProps = {
  selected: boolean;
};

export const CardContainer = styled.div<CardContainerProps>`
  cursor: pointer;
  width: 148px;
  height: 220px;
  border-radius: 4px;
  border: 1px solid #696367;
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
  height: 140px;
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
