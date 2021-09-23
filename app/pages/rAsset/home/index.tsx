import Content from '@shared/components/content';
import React from 'react';
import { Redirect, useParams } from 'react-router';
import BepPage from './bep';
import Tag from './components/carTag/index';
import ErcPage from './erc';
import NativePage from './native';
import SlpPage from './slp';

export default function Index() {
  const { selectedPlatform, rTokenPlatform } = useParams<any>();

  if (
    (selectedPlatform !== 'native' &&
      selectedPlatform !== 'erc' &&
      selectedPlatform !== 'bep' &&
      selectedPlatform !== 'sol') ||
    (rTokenPlatform && rTokenPlatform !== 'erc' && rTokenPlatform !== 'bep' && rTokenPlatform !== 'sol') ||
    selectedPlatform === rTokenPlatform ||
    (selectedPlatform === 'native' && !rTokenPlatform)
  ) {
    return <Redirect to='/rAsset/home/native/erc' />;
  }

  return (
    <Content>
      <Tag type='native' onClick={(type: string) => {}} />

      {selectedPlatform === 'native' && <NativePage />}
      {selectedPlatform === 'erc' && <ErcPage />}
      {selectedPlatform === 'bep' && <BepPage />}
      {selectedPlatform === 'sol' && <SlpPage />}
    </Content>
  );
}
