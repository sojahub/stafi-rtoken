// @ts-nocheck

import React from 'react';
import { useHistory } from 'react-router';
import selected_rFIS_svg from 'src/assets/images/selected_r_fis.svg';
import tidalLogo from 'src/assets/images/tidal.png';
import Button from 'src/shared/components/button/button';
import styled from 'styled-components';
import { HContainer, Text } from '../commonComponents';
import LeftContent from '../content/leftContent';
import './index.scss';

type Props = {
  type: 'rDOT' | 'rKSM' | 'rATOM' | 'rETH' | 'rMATIC' | 'rFIS' | 'rBNB' | 'rSOL';
};

export default function Index(props: Props) {
  const history = useHistory();

  return (
    <LeftContent className='stafi_reward_card'>
      <div style={{ margin: '0 12px 0 11px' }}>
        <HContainer alignItems='flex-end' justifyContent='flex-start'>
          <img src={tidalLogo} width='119px' height='30px' alt='logo' />

          <Text size='20px' bold sameLineHeight ml='20px'>
            Buy insurance to cover loss
          </Text>
        </HContainer>

        <Text size='16px' color='#c4c4c4' lineHeight='20px' mt='20px' mr='20px'>
          StaFi is collaborate with Tidal.finance to provide an insurance to cover the POTENTIAL LOSS of your rETH.
        </Text>

        <Text size='16px' color='#c4c4c4' lineHeight='20px' mt='20px' mr='20px'>
          Such as the designated smart contract was used in an unintended way, or The designated smart contract suffered
          hacks or exploitation of the protocol code for any bug that was not publicly disclosed before the coverage
          period began, etc.
        </Text>

        <Text size='16px' color='#c4c4c4' lineHeight='20px' mt='20px' mr='20px'>
          You can go to Tidal Finance to check the details, and here is a{' '}
          <a href='javascript;' style={{ color: '#00F3AB', textDecoration: 'underline' }}>
            guide
          </a>{' '}
          on how to buy cover on Tidal.
        </Text>

        <HContainer justifyContent='flex-end' mt='42px'>
          <Button size='small' btnType='ellipse' onClick={() => {}}>
            Buy Cover
          </Button>
        </HContainer>
      </div>

      <Divider />

      <HContainer mt='50px' ml='8px' mr='12px' justifyContent='space-between'>
        <HContainer>
          <img src={selected_rFIS_svg} width='36px' height='36px' alt='logo' />

          <Text size='20px' sameLineHeight bold ml='20px'>
            Go to rToken Status
          </Text>
        </HContainer>

        <Button
          size='small'
          btnType='ellipse'
          onClick={() => {
            history.push('/rETH/staker/info');
          }}>
          Go
        </Button>
      </HContainer>
    </LeftContent>
  );
}

const Divider = styled.div`
  height: 1px;
  background-color: rgba(71, 71, 71, 0.5);
  margin-top: 34px;
`;
