import { useState } from 'react';
import { useDispatch } from 'react-redux';
import no_data_png from 'src/assets/images/nodata.png';
import pendingIcon from 'src/assets/images/unbond_record_pending.png';
import successIcon from 'src/assets/images/unbond_record_success.png';
import { useUnbondList } from 'src/hooks/useUnbondList';
import numberUtil from 'src/util/numberUtil';
import styled from 'styled-components';
import { HContainer, Text } from '../commonComponents';
import LeftContent from './leftContent';

type Props = {
  type: 'rDOT' | 'rETH' | 'rFIS' | 'rKSM' | 'rATOM' | 'rSOL' | 'rMATIC' | 'rBNB';
};

export const UnbondRecord = (props: Props) => {
  const { unbondList, isLoading } = useUnbondList(props.type);

  // useEffect(() => {
  //   if (props.type === 'rFIS') {
  //     setUnbondRecords(localStorageUtil.getRTokenUnbondRecords('rFIS'));
  //     setLoading(false);
  //   } else {
  //     dispatch(setGlobalLoading(true));
  //     commonClice.getUnbondRecords(fisAddress, getRsymbolByTokenTitle(props.type)).then((items) => {
  //       dispatch(setGlobalLoading(false));
  //       setLoading(false);
  //       setUnbondRecords(items);
  //     });
  //   }
  // }, [props.type, fisAddress, dispatch]);

  return (
    <LeftContent className='stafi_stake_info_context' padding='36px 10px 0'>
      <div style={{ flex: 1, position: 'relative' }}>
        <HContainer justifyContent='flex-start'>
          <Text size='30px' bold color='white' ml='20px'>
            Unbonded Records
          </Text>
        </HContainer>

        {unbondList.length === 0 && !isLoading && (
          <NoDataContainer>
            <NoDataImage src={no_data_png} />
          </NoDataContainer>
        )}

        {unbondList.length > 0 && (
          <HContainer ml='20px' mr='10px' mt='30px' mb='9px' style={{ width: '530px' }}>
            <div style={{ width: '20px' }}></div>

            <div style={{ width: '90px', marginLeft: '10px' }}>
              <Text size='14px' color='#7C7C7C' style={{ width: '95px' }}>
                Amount
              </Text>
            </div>

            <div style={{ width: '100px' }}>
              <Text size='14px' color='#7C7C7C' ml='15px'>
                Period
              </Text>
            </div>

            <div style={{ flex: 1 }}>
              <Text size='14px' color='#7C7C7C' style={{ flex: 1 }}>
                Received Address
              </Text>
            </div>
          </HContainer>
        )}
        <ContentContainer>
          {unbondList.map((itemObj, index: number) => (
            <ItemContainer key={index}>
              <HContainer ml='20px' mr='10px' justifyContent='flex-start'>
                <div style={{ width: '20px' }}>
                  <img
                    src={itemObj.lockLeftTimeInDays <= 0 ? successIcon : pendingIcon}
                    alt='success'
                    width='12px'
                    height='12px'
                  />
                </div>

                <div style={{ width: '105px', marginLeft: '10px' }}>
                  <Text size='16px' color='white'>
                    {itemObj.formatTokenAmount !== '--'
                      ? Number(itemObj.formatTokenAmount) > 0 && Number(itemObj.formatTokenAmount) < 0.0001
                        ? '<0.0001'
                        : numberUtil.handleAmountFloorToFixed(itemObj.formatTokenAmount, 3)
                      : '--'}
                  </Text>
                </div>

                <div style={{ width: '85px' }}>
                  <Text size='12px' color='#C8C8C8' scale={0.83} transformOrigin='center left' sameLineHeight>
                    ≈ {itemObj.lockTotalTimeInDays} days
                  </Text>
                  {Number(itemObj.lockLeftTimeInDays) > 0 && (
                    <Text size='12px' color='#C8C8C8' scale={0.83} transformOrigin='center left' sameLineHeight>
                      {Number(itemObj.lockLeftTimeInDays) === 1 ? '<1' : itemObj.lockLeftTimeInDays}d left
                    </Text>
                  )}
                </div>

                <div style={{ position: 'relative', marginBottom: '15px' }}>
                  <Text
                    size='12px'
                    color='#C8C8C8'
                    scale={0.83}
                    transformOrigin='center left'
                    bold
                    style={{ position: 'absolute', left: 0, top: 0 }}>
                    {itemObj.formatReceiveAddress}
                  </Text>
                </div>
              </HContainer>

              <ItemDivider />
            </ItemContainer>
          ))}
        </ContentContainer>

        <MaxCountText>Only the last 10 records are displayed</MaxCountText>
      </div>
    </LeftContent>
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
  left: 5px;
  font-size: 12px;
  color: #c4c4c4;
`;
