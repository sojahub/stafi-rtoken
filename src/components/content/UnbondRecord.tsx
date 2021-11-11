import leftArrowSvg from 'src/assets/images/left_arrow.svg';
import { useEffect, useState } from 'react';
import { HContainer, Text } from '../commonComponents';
import localStorageUtil from 'src/util/localStorage';
import styled from 'styled-components';
import no_data_png from 'src/assets/images/nodata.png';
import successIcon from 'src/assets/images/unbond_record_success.png';
import pendingIcon from 'src/assets/images/unbond_record_pending.png';
import moment from 'moment';
import CommonClice from 'src/features/commonClice';
import { useSelector } from 'react-redux';
import { getRsymbolByTokenTitle } from 'src/config';

const commonClice = new CommonClice();

type Props = {
  type: 'rDOT' | 'rETH' | 'rFIS' | 'rKSM' | 'rATOM' | 'rSOL' | 'rMATIC' | 'rBNB';
  onClickBack: Function;
};

export const UnbondRecord = (props: Props) => {
  const [loading, setLoading] = useState(true);
  const [unbondRecords, setUnbondRecords] = useState([]);

  const { fisAddress } = useSelector((state: any) => {
    return {
      fisAddress: state.FISModule.fisAccount && state.FISModule.fisAccount.address,
    };
  });

  useEffect(() => {
    // setUnbondRecords(localStorageUtil.getRTokenUnbondRecords(props.type));
    commonClice.getUnbondRecords(fisAddress, getRsymbolByTokenTitle(props.type)).then((items) => {
      setLoading(false);
      setUnbondRecords(items);
    });
  }, [props.type, fisAddress]);

  return (
    <div style={{ flex: 1, position: 'relative' }}>
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

      {unbondRecords.length === 0 && !loading && (
        <NoDataContainer>
          <NoDataImage src={no_data_png} />
        </NoDataContainer>
      )}

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
      <ContentContainer>
        {unbondRecords.map((itemObj: any, index: number) => (
          <ItemContainer key={index}>
            <HContainer ml='20px' mr='10px' justifyContent='flex-start'>
              <div style={{ width: '20px' }}>
                <img
                  src={itemObj.remainingDays * 1 <= 0 ? successIcon : pendingIcon}
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
                  ≈ {itemObj.remainingDays} days
                </Text>
              </div>

              <div style={{ position: 'relative', marginBottom: '15px' }}>
                <Text
                  size='12px'
                  color='#C8C8C8'
                  scale={0.83}
                  transformOrigin='center left'
                  style={{ position: 'absolute', left: 0, top: 0 }}>
                  {itemObj.receiver}
                </Text>
              </div>
            </HContainer>

            <ItemDivider />
          </ItemContainer>
        ))}
      </ContentContainer>

      <MaxCountText>This form only shows the recent 10 records</MaxCountText>
    </div>
  );
};

const ContentContainer = styled.div`
  overflow: auto;
  max-height: 345px;
`;

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

const NoDataContainer = styled.div`
  width: 100%;
  text-align: center;
`;

const NoDataImage = styled.img`
  margin-top: 116px;
  width: 146px;
  height: 95px;
`;

const MaxCountText = styled.div`
  position: absolute;
  bottom: 14px;
  right: 5px;
  font-size: 12px;
  color: #c4c4c4;
`;
