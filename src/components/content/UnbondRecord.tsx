import leftArrowSvg from 'src/assets/images/left_arrow.svg';
import { useEffect, useState } from 'react';
import { HContainer, Text } from '../commonComponents';
import localStorageUtil from 'src/util/localStorage';
import styled from 'styled-components';
import successIcon from 'src/assets/images/unbond_record_success.png';
import pendingIcon from 'src/assets/images/unbond_record_pending.png';
import moment from 'moment';

type Props = {
  type: 'rDOT' | 'rETH' | 'rFIS' | 'rKSM' | 'rATOM' | 'rSOL' | 'rMATIC' | 'rBNB';
  onClickBack: Function;
};

export const UnbondRecord = (props: Props) => {
  const [unbondRecords, setUnbondRecords] = useState([]);

  useEffect(() => {
    setUnbondRecords(localStorageUtil.getRTokenUnbondRecords(props.type));
  }, [props.type]);

  return (
    <div style={{ flex: 1 }}>
      <HContainer justifyContent='flex-start'>
        <img
          onClick={() => {
            props.onClickBack();
          }}
          src={leftArrowSvg}
          alt='back'
          style={{
            cursor: 'pointer',
            width: '13px',
            height: '24px',
          }}
        />

        <Text size='30px' bold color='white' ml='20px'>
          Unbonded Records
        </Text>
      </HContainer>

      {unbondRecords.length > 0 && (
        <HContainer ml='20px' mr='10px' mt='35px' mb='9px' style={{ width: '530px' }}>
          <div style={{ width: '20px' }}></div>

          <div style={{ width: '80px', marginLeft: '10px' }}>
            <Text size='12px' color='#7C7C7C' style={{ width: '95px' }}>
              Amount
            </Text>
          </div>

          <div style={{ width: '100px' }}>
            <Text size='12px' color='#7C7C7C' ml='15px'>
              Period
            </Text>
          </div>

          <div style={{ flex: 1 }}>
            <Text size='12px' color='#7C7C7C' style={{ flex: 1 }}>
              Unbond to
            </Text>
          </div>
        </HContainer>
      )}

      {unbondRecords.map((itemObj: any) => (
        <ItemContainer key={itemObj.id}>
          <HContainer ml='20px' mr='10px' justifyContent='flex-start'>
            <div style={{ width: '20px' }}>
              <img
                src={Number(itemObj.estimateSuccessTime) <= moment().valueOf() ? successIcon : pendingIcon}
                alt='success'
                width='12px'
                height='12px'
              />
            </div>

            <div style={{ width: '95px', marginLeft: '10px' }}>
              <Text size='16px' color='white'>
                {itemObj.amount}
              </Text>
            </div>

            <div style={{ width: '85px' }}>
              <Text size='12px' color='#C8C8C8' scale={0.83} transformOrigin='center left'>
                ≈ {Math.ceil(Math.max(0, Number(itemObj.estimateSuccessTime) - moment().valueOf()) / 86400000)} days
              </Text>
            </div>

            <div style={{ position: 'relative', marginBottom: '15px' }}>
              <Text
                size='12px'
                color='#C8C8C8'
                scale={0.83}
                transformOrigin='center left'
                style={{ position: 'absolute', left: 0, top: 0 }}>
                {itemObj.recipient}
              </Text>
            </div>
          </HContainer>

          <ItemDivider />
        </ItemContainer>
      ))}
    </div>
  );
};

const ItemContainer = styled.div`
  height: 46px;
  width: 530px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  position: relative;
`;

const ItemDivider = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #3b3b3b;
`;