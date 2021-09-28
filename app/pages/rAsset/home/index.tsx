import Content from '@shared/components/content';
import React from 'react';
import { Redirect, useParams } from 'react-router';
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
    <Content>
      <Tag type='native' onClick={(type: string) => {}} />

      {selectedPlatform === 'native' && <NativePage />}
      {selectedPlatform === 'erc' && <ErcPage />}
      {selectedPlatform === 'bep' && <BepPage />}
      {selectedPlatform === 'spl' && <SplPage />}
    </Content>
  );
}
