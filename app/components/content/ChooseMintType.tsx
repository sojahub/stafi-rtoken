import leftArrowSvg from '@images/left_arrow.svg';
import Button from '@shared/components/button/button';
import AddressInputEmbed from '@shared/components/input/addressInputEmbed';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import './index.scss';
import MintTypeCard from './MintTypeCard';

type ChooseMintTypeProps = {
  clickBack: Function;
  clickStake: Function;
};

export default function ChooseMintType(props: ChooseMintTypeProps) {
  const [selectedType, setSelectedType] = useState('native');
  const [targetAddress, setTargetAddress] = useState('');

  useEffect(() => {
    setTargetAddress('');
  }, [selectedType]);

  const onClickMintType = (type: string) => {
    setSelectedType(type);
  };

  return (
    <div className='stafi_stake_mint_type'>
      <div className='title_container'>
        <img className='back_icon' onClick={() => props.clickBack()} src={leftArrowSvg} />

        <div className='title'>Choose minted type</div>
      </div>

      <div className='types_container'>
        <MintTypeCard selected={selectedType === 'native'} type='native' onClick={onClickMintType} />

        <MintTypeCard selected={selectedType === 'erc20'} type='erc20' onClick={onClickMintType} />

        <MintTypeCard selected={selectedType === 'bep20'} type='bep20' onClick={onClickMintType} />

        {/* <MintTypeCard selected={selectedType === 'spl'} type='spl' onClick={onClickMintType} /> */}
      </div>

      <div style={{ height: '110px', marginTop: '12px' }}>
        <div className='address_input_container' style={{ display: selectedType === 'native' ? 'none' : 'block' }}>
          <div className='title'>Received address</div>

          <AddressInputEmbed
            backgroundcolor='#2B3239'
            placeholder={'...'}
            value={targetAddress}
            onChange={(e: any) => {
              setTargetAddress(e.target.value);
            }}
          />

          <div className='divider' />

          <div className='note'>
            Note: Make sure you have the right address, otherwise you will not receive the token If you provide a wrong
            address.
          </div>
        </div>
      </div>

      <div className='btns'>
        <Button
          disabled={isEmpty(targetAddress) && selectedType !== 'native'}
          onClick={() => {
            props.clickStake();
          }}>
          Stake
        </Button>
      </div>
    </div>
  );
}
