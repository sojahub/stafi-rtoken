import CommonButton from '@components/CommonButton';
import { CardContainer, HContainer, Text } from '@components/commonComponents';
import DexSwapLoading from '@components/modal/DexSwapLoading';
import TokenSelector from '@components/selector/TokenSelector';
import { swap } from '@features/dexClice';
import {
  query_rBalances_account as fis_query_rBalances_account,
  reloadData,
  rTokenRate as fis_rTokenRate
} from '@features/FISClice';
import {
  checkAddress as atom_checkAddress,
  query_rBalances_account as atom_query_rBalances_account,
  rLiquidityRate as atom_rLiquidityRate,
  rSwapFee as atom_rSwapFee,
  rTokenRate as atom_rTokenRate
} from '@features/rATOMClice';
import {
  query_rBalances_account as dot_query_rBalances_account,
  rLiquidityRate as dot_rLiquidityRate,
  rTokenRate as dot_rTokenRate
} from '@features/rDOTClice';
import { query_rBalances_account, rTokenRate as ksm_rTokenRate } from '@features/rKSMClice';
import arrowDownIcon from '@images/arrow_down.svg';
import doubt from '@images/doubt.svg';
import left_arrow from '@images/left_arrow.svg';
import rasset_ratom_svg from '@images/r_atom.svg';
// import rasset_rdot_svg from '@images/r_dot.svg';
// import rasset_rfis_svg from '@images/r_fis.svg';
// import rasset_rksm_svg from '@images/r_ksm.svg';
import settingIcon from '@images/setting.svg';
import { rSymbol } from '@keyring/defaults';
import AddressInputEmbedNew from '@shared/components/input/addressInputEmbedNew';
import TypeSelectorInput from '@shared/components/input/TypeSelectorInput';
import numberUtil from '@util/numberUtil';
import { message, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import SwapRateChart from './SwapRateChart';

const allTokenDatas = [
  // {
  //   icon: rasset_rfis_svg,
  //   title: 'rFIS',
  //   content: '--',
  //   type: 'rfis',
  // },
  // {
  //   icon: rasset_rdot_svg,
  //   title: 'rDOT',
  //   content: '--',
  //   type: 'rdot',
  // },
  // {
  //   icon: rasset_rksm_svg,
  //   title: 'rKSM',
  //   content: '--',
  //   type: 'rksm',
  // },
  {
    icon: rasset_ratom_svg,
    title: 'rATOM',
    content: '--',
    type: 'ratom',
  },
  // {
  //   icon: rasset_rsol_svg,
  //   title: 'rSOL',
  //   content: '--',
  //   type: 'rsol',
  // },
  // {
  //   icon: rasset_rmatic_svg,
  //   title: 'rMATIC',
  //   content: '--',
  //   type: 'rmatic',
  // },
];

export default function RDEXHome() {
  const dispatch = useDispatch();
  // 0-main, 1-input address, 2-setting, 3-select token
  const [scene, setScene] = useState(0);
  const [lastScene, setLastScene] = useState(0);
  const [rTokenAmount, setRTokenAmount] = useState();
  const [receiveTokenAmount, setReceiveTokenAmount] = useState();
  const [minReceiveTokenAmount, setMinReceiveTokenAmount] = useState('--');
  const [tokenTypes, setTokenTypes] = useState(allTokenDatas);
  const [selectedToken, setSelectedToken] = useState();
  const [currentSwapFee, setCurrentSwapFee] = useState('--');
  const [currentRatio, setCurrentRatio] = useState('--');
  const [currentLiquidityRate, setCurrentLiquidityRate] = useState('--');
  const [currentTotalRate, setCurrentTotalRate] = useState('--');
  const [address, setAddress] = useState('');
  const [slippageTolerance, setSlippageTolerance] = useState(1);

  const {
    fisAccount,
    transferrableAmount,
    rFISTokenAmount,
    rKSMTokenAmount,
    rDOTTokenAmount,
    rATOMTokenAmount,
    // rSOLTokenAmount,
    // rMATICTokenAmount,
  } = useSelector((state) => {
    return {
      fisAccount: state.FISModule.fisAccount,
      transferrableAmount: state.FISModule.transferrableAmountShow,
      rFISTokenAmount: numberUtil.handleFisAmountToFixed(state.FISModule.tokenAmount),
      rKSMTokenAmount: numberUtil.handleFisAmountToFixed(state.rKSMModule.tokenAmount),
      rDOTTokenAmount: numberUtil.handleFisAmountToFixed(state.rDOTModule.tokenAmount),
      rATOMTokenAmount: numberUtil.handleFisAmountToFixed(state.rATOMModule.tokenAmount),
      // rSOLTokenAmount: numberUtil.handleFisAmountToFixed(state.rSOLModule.tokenAmount),
      // rMATICTokenAmount: numberUtil.handleFisAmountToFixed(state.rMATICModule.tokenAmount),
    };
  });

  const { rDOTRatio, rDOTLiquidityRate, rATOMSwapFee, rATOMRatio, rATOMLiquidityRate } = useSelector((state) => {
    return {
      rDOTRatio: state.rDOTModule.ratio,
      rDOTLiquidityRate: state.rDOTModule.liquidityRate,
      rATOMSwapFee: state.rATOMModule.swapFee,
      rATOMRatio: state.rATOMModule.ratio,
      rATOMLiquidityRate: state.rATOMModule.liquidityRate,
    };
  });

  useEffect(() => {
    if (fisAccount && fisAccount.address) {
      dispatch(reloadData());
      dispatch(dot_query_rBalances_account());
      dispatch(dot_rTokenRate());
      dispatch(dot_rLiquidityRate());
      dispatch(atom_query_rBalances_account());
      dispatch(atom_rSwapFee());
      dispatch(atom_rTokenRate());
      dispatch(atom_rLiquidityRate());
      dispatch(query_rBalances_account());
      dispatch(fis_query_rBalances_account());
      // dispatch(sol_query_rBalances_account());
      // dispatch(matic_query_rBalances_account());
      dispatch(ksm_rTokenRate());
      dispatch(fis_rTokenRate());
      // dispatch(sol_rTokenRate());
      // dispatch(matic_rTokenRate());
    }
  }, [fisAccount && fisAccount.address]);

  useEffect(() => {
    if (!selectedToken) {
      setCurrentSwapFee('--');
      return;
    }
    if (selectedToken.type === 'ratom') {
      setCurrentSwapFee(rATOMSwapFee);
    }
  }, [selectedToken, rATOMSwapFee]);

  useEffect(() => {
    if (!selectedToken) {
      setCurrentLiquidityRate('--');
      return;
    }
    if (selectedToken.type === 'rdot') {
      setCurrentRatio(rDOTRatio);
      setCurrentLiquidityRate(rDOTLiquidityRate);
    }
    if (selectedToken.type === 'ratom') {
      setCurrentRatio(rATOMRatio);
      setCurrentLiquidityRate(rATOMLiquidityRate);
    }
  }, [selectedToken, rDOTLiquidityRate, rATOMLiquidityRate]);

  useEffect(() => {
    if (!currentRatio || isNaN(currentRatio) || !currentLiquidityRate || isNaN(currentLiquidityRate)) {
      setCurrentTotalRate('--');
    } else {
      setCurrentTotalRate(currentRatio * currentLiquidityRate);
    }
  }, [currentRatio, currentLiquidityRate]);

  useEffect(() => {
    if (!rTokenAmount || isNaN(rTokenAmount) || Number(rTokenAmount) <= Number(0)) {
      setReceiveTokenAmount('');
      setMinReceiveTokenAmount('--');
    }
    let result = rTokenAmount;
    if (currentTotalRate && !isNaN(currentTotalRate)) {
      result = rTokenAmount * currentTotalRate;
    }
    setReceiveTokenAmount(result);
    setMinReceiveTokenAmount((result * (100 - slippageTolerance)) / 100);
  }, [rTokenAmount, currentTotalRate, slippageTolerance]);

  useEffect(() => {
    allTokenDatas.forEach((item) => {
      if (item.type === 'rfis') {
        item.content = rFISTokenAmount;
      }
      if (item.type === 'rksm') {
        item.content = rKSMTokenAmount;
      }
      if (item.type === 'rdot') {
        item.content = rDOTTokenAmount;
      }
      if (item.type === 'ratom') {
        item.content = rATOMTokenAmount;
      }
      // if (item.type === 'rsol') {
      //   item.content = rSOLTokenAmount;
      // }
      // if (item.type === 'rmatic') {
      //   item.content = rMATICTokenAmount;
      // }
    });
  }, [rFISTokenAmount, rKSMTokenAmount, rDOTTokenAmount, rATOMTokenAmount]);

  const getTokenName = () => {
    if (!selectedToken) {
      return '';
    }
    if (selectedToken.type === 'rfis') {
      return 'FIS';
    }
    if (selectedToken.type === 'rdot') {
      return 'DOT';
    }
    if (selectedToken.type === 'rksm') {
      return 'KSM';
    }
    if (selectedToken.type === 'ratom') {
      return 'ATOM';
    }
    if (selectedToken.type === 'rsol') {
      return 'SOL';
    }
    if (selectedToken.type === 'rmatic') {
      return 'MATIC';
    }
  };

  const startSwap = () => {
    if (!selectedToken) {
      return;
    }
    let leastFee = Number(currentSwapFee) + 0.003;
    let leastFeeStr = parseInt(leastFee * 1000) / 1000;
    if (Number(transferrableAmount) < Number(leastFeeStr)) {
      message.error('Insufficient available FIS balance, at least ' + leastFeeStr + 'FIS');
      return;
    }
    if (selectedToken.type === 'ratom') {
      if (!atom_checkAddress(address)) {
        message.error('address input error');
        return;
      }
      dispatch(
        swap(rSymbol.Atom, rTokenAmount, address,
          numberUtil.handleFisRoundToFixed(minReceiveTokenAmount),
          numberUtil.handleFisRoundToFixed(receiveTokenAmount), () => {
            message.success('swap success');
            setScene(0);
            setRTokenAmount('');
            setAddress('');
            reloadData()
        }),
      );
    }
  };

  return (
    <HContainer alignItems='flex-start'>
      <Container>
        <Text size={'30px'} sameLineHeight bold>
          rDEX
        </Text>
        <Text size={'14px'} color={'#a5a5a5'} sameLineHeight marginTop={'1px'}>
          Protocol Liquidity for rTokens. Read <span style={{ color: '#00F3AB', cursor: 'pointer', textDecoration: 'underline' }}>Mechanism</span>
        </Text>

        <CardContainer width={'340px'} mt={'50px'} pt={'17px'} pb={'8px'} style={{ minHeight: '468px' }}>
          <HContainer mb={'20px'} ml={'20px'} mr={'20px'}>
            <div style={{ height: '20px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              {scene === 0 && (
                <Text size={'18px'} sameLineHeight bold>
                  Swap
                </Text>
              )}
              {scene === 1 && (
                <img
                  src={left_arrow}
                  style={{ cursor: 'pointer', width: '12px', height: '12px' }}
                  onClick={() => {
                    setAddress('');
                    setScene(0);
                  }}
                />
              )}
              {scene === 2 && (
                <HContainer>
                  <img
                    src={left_arrow}
                    style={{ cursor: 'pointer', width: '12px', height: '12px' }}
                    onClick={() => {
                      setScene(lastScene);
                    }}
                  />

                  <Text size={'18px'} ml={'12px'} sameLineHeight bold>
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

                  <Text size={'18px'} ml={'12px'} sameLineHeight bold>
                    Select a native token
                  </Text>
                </HContainer>
              )}
            </div>

            {(scene === 0 || scene === 1) && (
              <IconContainer clickable>
                <Icon
                  src={settingIcon}
                  onClick={() => {
                    setLastScene(scene);
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
                  setRTokenAmount('');
                  setScene(0);
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
                        value={rTokenAmount}
                        selectedData={selectedToken}
                        selectable={true}
                        onClickSelect={() => setScene(3)}
                        onChange={setRTokenAmount}
                      />

                      <HContainer justifyContent='flex-end' mt={'6px'}>
                        <Text size={'10px'} color={'#a5a5a5'} sameLineHeight>
                          Balance: {selectedToken ? selectedToken.content : '--'}
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
                        selectedTitle={getTokenName()}
                        value={
                          receiveTokenAmount === '--' || !receiveTokenAmount
                            ? ''
                            : numberUtil.handleFisRoundToFixed(receiveTokenAmount)
                        }
                        disabled={true}
                      />

                      <div style={{ marginTop: '24px', height: '15px' }}>
                        {selectedToken && (
                          <HContainer justifyContent='center' alignItems='flex-start'>
                            <Text size={'12px'} color={'#a5a5a5'}>
                              {`1 ${selectedToken.title} = ${numberUtil.handleFisRoundToFixed(
                                currentTotalRate,
                              )} ${getTokenName()}`}
                            </Text>
                            <Tooltip
                              overlayClassName='doubt_overlay'
                              placement='topLeft'
                              overlayInnerStyle={{ color: '#A4A4A4' }}
                              title={`${getTokenName()} = ${
                                selectedToken.title
                              } * ExchangeRate * N (N is % of liquidity fee, govered by the protocol, it is ${numberUtil.percentageAmountToHuman(currentLiquidityRate)} atm.)`}>
                              <img src={doubt} />
                            </Tooltip>
                          </HContainer>
                        )}
                      </div>
                    </>
                  )}

                  {scene === 1 && (
                    <>
                      <AddressInputContainer>
                        <Text size={'14px'} mb={'15px'} mt={'2px'}>
                          Received
                        </Text>
                        <AddressInputEmbedNew
                          placeholder={getTokenName() + ' Address'}
                          value={address}
                          onChange={(e) => {
                            setAddress(e.target.value);
                          }}
                        />
                      </AddressInputContainer>
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
                    text={'Next'}
                    onClick={() => {}}
                    disabled={!selectedToken || Number(rTokenAmount) <= Number(0)}
                    mt='25px'
                    onClick={() => setScene(1)}
                  />
                )}

                {scene === 1 && (
                  <CommonButton
                    text={'Swap'}
                    onClick={() => {}}
                    disabled={!address}
                    mt='25px'
                    onClick={() => setScene(1)}
                    onClick={startSwap}
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
                      {minReceiveTokenAmount === '--' || !minReceiveTokenAmount
                        ? '--'
                        : numberUtil.handleFisRoundToFixed(minReceiveTokenAmount)}{' '}
                      {getTokenName()}
                    </Text>
                  </HContainer>

                  <HContainer mb='8px'>
                    <Text size='10px' color='#a5a5a5' sameLineHeight>
                      Fee :
                    </Text>
                    <Text size='10px' color='white' sameLineHeight>
                      {currentSwapFee} FIS
                    </Text>
                  </HContainer>

                  <HContainer>
                    <Text size='10px' color='#a5a5a5' sameLineHeight>
                      Liquidity Rate :
                    </Text>
                    <Text size='10px' color='white' sameLineHeight>
                      {numberUtil.percentageAmountToHuman(currentLiquidityRate)}
                    </Text>
                  </HContainer>
                </InnerContainer>
              </div>
            </>
          )}
        </CardContainer>
      </Container>

      <div style={{ flex: 1, marginTop: '90px', marginLeft: '40px', marginRight: '50px' }}>
        <Text size={'20px'} bold>
          rATOM / ATOM
        </Text>

        <HContainer>
          <Text>{numberUtil.handleFisRoundToFixed(rATOMRatio)}</Text>

          <ChartPeriodContainer>
            <ChartPeriodItem active={true}>24h</ChartPeriodItem>

            <ChartPeriodItem>1W</ChartPeriodItem>

            <ChartPeriodItem>1M</ChartPeriodItem>
          </ChartPeriodContainer>
        </HContainer>

        <Divider />
        <SwapRateChart />
      </div>

      <DexSwapLoading transferDetail={numberUtil.handleFisRoundToFixed(receiveTokenAmount) + ' ' + getTokenName()} />
    </HContainer>
  );
}

const Container = styled.div({
  marginLeft: '88px',
});

const InnerContainer = styled.div({
  marginLeft: '20px',
  marginRight: '20px',
});

const Content = styled.div({
  height: '220px',
  position: 'relative',
});

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

const AddressInputContainer = styled.div({
  padding: '0 10px',
  height: '100px',
  borderRadius: '4px',
  border: 'solid 1px #979797',
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

const ChartPeriodContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  flexWrap: 'wrap',
});

const ChartPeriodItem = styled.div((props) => ({
  cursor: 'pointer',
  borderRadius: '5px',
  backgroundColor: props.active ? '#40464C' : '',
  color: props.active ? '#ffffff' : '#6F7A9F',
  fontSize: '12px',
  marginRight: '15px',
  display: 'flex',
  flexDirection: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  width: '36px',
  height: '20px',
  marginTop: '8px',
}));
