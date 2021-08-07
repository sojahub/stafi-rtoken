import CommonButton from '@components/CommonButton';
import { CardContainer, HContainer, Text } from '@components/commonComponents';
import TokenSelector from '@components/selector/TokenSelector';
import arrowDownIcon from '@images/arrow_down.svg';
import doubt from '@images/doubt.svg';
import left_arrow from '@images/left_arrow.svg';
import atomIcon from '@images/rATOM.svg';
import dotIcon from '@images/rDOT.svg';
import ethIcon from '@images/rETH.svg';
import ksmIcon from '@images/rKSM.svg';
import settingIcon from '@images/setting.svg';
import TypeSelectorInput from '@shared/components/input/TypeSelectorInput';
import numberUtil from '@util/numberUtil';
import { Tooltip } from 'antd';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const allTokenDatas = [
  {
    icon: ethIcon,
    title: 'ETH',
    content: '',
    balance: '--',
    type: 'eth',
  },
  {
    icon: dotIcon,
    title: 'DOT',
    content: '',
    balance: '--',
    type: 'dot',
  },
  {
    icon: ksmIcon,
    title: 'KSM',
    content: '',
    balance: '--',
    type: 'ksm',
  },
  {
    icon: atomIcon,
    title: 'ATOM',
    content: '',
    balance: '--',
    type: 'atom',
  },
];

export default function FeeStation() {
  // 0-main, 2-setting, 3-select token
  const [scene, setScene] = useState(0);
  const [tokenTypes, setTokenTypes] = useState(allTokenDatas);
  const [selectedToken, setSelectedToken] = useState();
  const [tokenAmount, setTokenAmount] = useState();
  const [currentTotalRate, setCurrentTotalRate] = useState(1);
  const [minReceiveFisAmount, setMinReceiveFisAmount] = useState('--');
  const [slippageTolerance, setSlippageTolerance] = useState(1);

  const { fisAccount } = useSelector((state) => {
    return {
      fisAccount: numberUtil.handleFisAmountToFixed(state.FISModule.fisAccount),
    };
  });

  return (
    <Container>
      <Title>Fee Station</Title>

      <Description>If you have no native FIS to pay for the fee, you can swap</Description>

      <CardContainer
        width={'340px'}
        mt={'24px'}
        pt={'17px'}
        pb={'8px'}
        style={{ minHeight: '468px' }}
        alignSelf='center'>
        <HContainer mb={'20px'} ml={'20px'} mr={'20px'}>
          <div style={{ height: '20px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            {scene === 0 && (
              <Text size={'18px'} sameLineHeight>
                Swap
              </Text>
            )}
            {scene === 2 && (
              <HContainer>
                <img
                  src={left_arrow}
                  style={{ cursor: 'pointer', width: '12px', height: '12px' }}
                  onClick={() => {
                    setScene(1);
                  }}
                />

                <Text size={'18px'} ml={'12px'} sameLineHeight>
                  Setting
                </Text>
              </HContainer>
            )}
            {scene === 3 && (
              <HContainer>
                <img
                  src={left_arrow}
                  style={{ cursor: 'pointer', width: '12px', height: '12px' }}
                  onClick={() => {
                    setScene(0);
                  }}
                />

                <Text size={'18px'} ml={'12px'} sameLineHeight>
                  Select a native token
                </Text>
              </HContainer>
            )}
          </div>

          {scene === 0 && (
            <IconContainer clickable>
              <Icon
                src={settingIcon}
                onClick={() => {
                  setScene(2);
                }}
              />
            </IconContainer>
          )}
        </HContainer>

        {scene === 3 && (
          <InnerContainer>
            <TokenSelector
              selectDataSource={tokenTypes}
              selectedData={selectedToken}
              onSelectChange={(value) => {
                setSelectedToken(value);
                setTokenAmount('');
              }}
            />
          </InnerContainer>
        )}

        {scene !== 3 && (
          <>
            <InnerContainer>
              <Content>
                {scene === 0 && (
                  <>
                    <TypeSelectorInput
                      selectDataSource={tokenTypes}
                      title='From'
                      maxInput={selectedToken && selectedToken.content !== '--' ? selectedToken.content : 0}
                      value={tokenAmount}
                      selectedData={selectedToken}
                      selectable={true}
                      onClickSelect={() => setScene(3)}
                      onChange={setTokenAmount}
                    />

                    <HContainer justifyContent='flex-end' mt={'6px'}>
                      <Text size={'10px'} color={'#a5a5a5'} sameLineHeight>
                        Balance: {selectedToken ? selectedToken.balance : '--'}
                      </Text>
                    </HContainer>

                    <HContainer justifyContent='center' mb={'15px'}>
                      <IconContainer size='15px'>
                        <Icon src={arrowDownIcon} />
                      </IconContainer>
                    </HContainer>

                    <TypeSelectorInput
                      selectDataSource={tokenTypes}
                      title='To'
                      selectedTitle='FIS'
                      value={''}
                      disabled={true}
                    />

                    <div style={{ marginTop: '24px', height: '15px' }}>
                      {selectedToken && (
                        <HContainer justifyContent='center' alignItems='flex-start'>
                          <Text size={'12px'} color={'#a5a5a5'}>
                            {`1 ${selectedToken.title} = ${numberUtil.handleFisRoundToFixed(currentTotalRate)} FIS`}
                          </Text>
                          <Tooltip
                            overlayClassName='doubt_overlay'
                            placement='topLeft'
                            title={`FIS = ${selectedToken.title} * ExchangeRate * N (N is % of liquidity fee,govered by the protocol, it is 95% atm.)`}>
                            <img src={doubt} />
                          </Tooltip>
                        </HContainer>
                      )}
                    </div>
                  </>
                )}

                {scene === 2 && (
                  <>
                    <Text size={'12px'} mt={'10px'}>
                      Slippage Tolerance
                    </Text>

                    <SlippageToleranceContainer>
                      <SlippageToleranceItem
                        active={slippageTolerance.toString() === '0.1'}
                        onClick={() => setSlippageTolerance(0.1)}>
                        0.1%
                      </SlippageToleranceItem>

                      <SlippageToleranceItem
                        active={slippageTolerance.toString() === '0.5'}
                        onClick={() => setSlippageTolerance(0.5)}>
                        0.5%
                      </SlippageToleranceItem>

                      <SlippageToleranceItem
                        active={slippageTolerance.toString() === '1'}
                        onClick={() => setSlippageTolerance(1)}>
                        1%
                      </SlippageToleranceItem>
                    </SlippageToleranceContainer>
                  </>
                )}
              </Content>

              {scene === 0 && (
                <CommonButton
                  text={'Swap'}
                  onClick={() => {}}
                  disabled={!selectedToken || Number(tokenAmount) <= Number(0)}
                  mt='25px'
                  onClick={() => {}}
                />
              )}
            </InnerContainer>

            <div style={{ visibility: scene === 2 ? 'hidden' : 'visible' }}>
              <Divider />

              <InnerContainer>
                <HContainer mb='8px'>
                  <Text size='10px' color='#a5a5a5' sameLineHeight>
                    Slippage Tolerance :
                  </Text>
                  <Text size='10px' color='white' sameLineHeight>
                    {slippageTolerance}%
                  </Text>
                </HContainer>

                <HContainer mb='8px'>
                  <Text size='10px' color='#a5a5a5' sameLineHeight>
                    Minimum receive :
                  </Text>
                  <Text size='10px' color='white' sameLineHeight>
                    {minReceiveFisAmount === '--' || !minReceiveFisAmount
                      ? '--'
                      : numberUtil.handleFisRoundToFixed(minReceiveFisAmount)}{' '}
                    FIS
                  </Text>
                </HContainer>
              </InnerContainer>
            </div>
          </>
        )}
      </CardContainer>

      <Description mt='30px'>Note: You can only swap up to 10 FIS every transaction.</Description>
    </Container>
  );
}

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  fontFamily: "'Helvetica', sans-serif",
});

const Title = styled.div({
  fontSize: '30px',
  color: 'white',
  fontFamily: "'Helvetica-Bold', sans-serif",
  textAlign: 'center',
});

const Description = styled.div((props) => ({
  fontSize: '14px',
  color: '#a5a5a5',
  textAlign: 'center',
  lineHeight: '16px',
  marginTop: props.mt,
}));

const InnerContainer = styled.div({
  marginLeft: '20px',
  marginRight: '20px',
});

const Content = styled.div({
  height: '220px',
  position: 'relative',
});

const SlippageToleranceContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  flexWrap: 'wrap',
  marginTop: '6px',
});

const SlippageToleranceItem = styled.div((props) => ({
  cursor: 'pointer',
  borderRadius: '5px',
  backgroundColor: props.active ? '#02C09A' : '#40464C',
  color: '#ffffff',
  fontSize: '14px',
  marginRight: '15px',
  display: 'flex',
  flexDirection: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  width: '60px',
  height: '27px',
  marginTop: '8px',
}));

const IconContainer = styled.div((props) => ({
  width: props.size || '20px',
  height: props.size || '20px',
  cursor: props.clickable ? 'pointer' : '',
}));

const Divider = styled.div({
  backgroundColor: '#383E44',
  height: '1px',
  marginTop: '20px',
  marginBottom: '20px',
});

const Icon = styled.img({
  width: '100%',
});
