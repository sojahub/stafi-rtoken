import { Tooltip } from 'antd';
import React from 'react';
import { Redirect, useParams } from 'react-router';
import doubt from 'src/assets/images/doubt.svg';
import styled from 'styled-components';
import BepPage from './bep';
import Tag from './components/carTag/index';
import ErcPage from './erc';
import NativePage from './native';
import SplPage from './spl';

export default function Index() {
  const { selectedPlatform, rTokenPlatform } = useParams<any>();

  if (
    (selectedPlatform !== 'native' &&
      selectedPlatform !== 'erc' &&
      selectedPlatform !== 'bep' &&
      selectedPlatform !== 'spl') ||
    (rTokenPlatform && rTokenPlatform !== 'erc' && rTokenPlatform !== 'bep' && rTokenPlatform !== 'spl') ||
    selectedPlatform === rTokenPlatform ||
    (selectedPlatform === 'native' && !rTokenPlatform)
  ) {
    return <Redirect to='/rAsset/home/native/erc' />;
  }

  return (
    <div
      style={{
        width: '660px',
        marginTop: '36px',
      }}>
      <Tag type='native' onClick={(type: string) => {}} />

      <HContainer
        style={{
          width: '660px',
          marginBottom: '12px',
          marginTop: '35px',
        }}>
        <TableHeader
          style={{
            paddingLeft: '47px',
            width: '174px',
          }}>
          Derivative
        </TableHeader>

        <TableHeader
          style={{
            width: '137px',
          }}>
          <HContainer style={{ alignItems: 'flex-start' }}>
            <div
              style={{
                marginRight: '2px',
              }}>
              Staked
            </div>

            <Tooltip
              overlayClassName='doubt_overlay'
              placement='topLeft'
              overlayInnerStyle={{ color: '#A4A4A4' }}
              title={'The amount of your staked token'}>
              <img src={doubt} alt='tooltip' />
            </Tooltip>
          </HContainer>
        </TableHeader>

        <TableHeader
          style={{
            width: '106px',
          }}>
          <HContainer style={{ alignItems: 'flex-start' }}>
            <div
              style={{
                marginRight: '2px',
              }}>
              rToken
            </div>

            <Tooltip
              overlayClassName='doubt_overlay'
              placement='topLeft'
              overlayInnerStyle={{ color: '#A4A4A4' }}
              title={'This amount only includes the rToken of the selected network.'}>
              <img src={doubt} alt='tooltip' />
            </Tooltip>
          </HContainer>
        </TableHeader>

        <TableHeader
          style={{
            width: '96px',
          }}>
          APY
        </TableHeader>

        <TableHeader>Operations</TableHeader>
      </HContainer>

      {selectedPlatform === 'native' && <NativePage />}
      {selectedPlatform === 'erc' && <ErcPage />}
      {selectedPlatform === 'bep' && <BepPage />}
      {selectedPlatform === 'spl' && <SplPage />}
    </div>
  );
}

const HContainer = styled.div`
  display: flex;
  align-items: center;
`;

const TableHeader = styled.div`
  color: #818181;
  font-size: 14px;
  line-height: 14px;
`;
