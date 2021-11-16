import { message, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { query_rBalances_account, rTokenRate as ksm_rTokenRate } from 'src/features/rKSMClice';
import arrowDownIcon from 'src/assets/images/arrow_down.svg';
import doubt from 'src/assets/images/doubt.svg';
import left_arrow from 'src/assets/images/left_arrow.svg';
import rasset_ratom_svg from 'src/assets/images/r_atom.svg';
// import rasset_rfis_svg from 'src/assets/images/r_fis.svg';
// import rasset_rksm_svg from 'src/assets/images/r_ksm.svg';
// import rasset_rbnb_svg from 'src/assets/images/r_bnb.svg';
// import rasset_rdot_svg from 'src/assets/images/r_dot.svg';
import settingIcon from 'src/assets/images/setting.svg';
import CommonButton from 'src/components/CommonButton';
import { CardContainer, HContainer, Text } from 'src/components/commonComponents';
import DexSwapLoading from 'src/components/modal/DexSwapLoading';
import TokenSelector from 'src/components/selector/TokenSelector';
import config from 'src/config/index';
import { swap } from 'src/features/dexClice';
import {
  fetchRTokenStatDetail as fis_fetchRTokenStatDetail,
  reloadData as fis_reloadData,
  rTokenRate as fis_rTokenRate,
} from 'src/features/FISClice';
import { connectPolkadot_fis } from 'src/features/globalClice';
import {
  checkAddress as atom_checkAddress,
  fetchRTokenStatDetail as atomFetchRTokenStatDetail,
  query_rBalances_account as atom_query_rBalances_account,
  rLiquidityRate as atom_rLiquidityRate,
  rSwapFee as atom_rSwapFee,
  rTokenRate as atom_rTokenRate,
} from 'src/features/rATOMClice';
import {
  checkAddress as bnb_checkAddress,
  query_rBalances_account as bnb_query_rBalances_account,
  rLiquidityRate as bnb_rLiquidityRate,
  rSwapFee as bnb_rSwapFee,
  rTokenRate as bnb_rTokenRate,
} from 'src/features/rBNBClice';
import {
  checkAddress as dot_checkAddress,
  query_rBalances_account as dot_query_rBalances_account,
  rLiquidityRate as dot_rLiquidityRate,
  rSwapFee as dot_rSwapFee,
  rTokenRate as dot_rTokenRate,
} from 'src/features/rDOTClice';
import { rSymbol } from 'src/keyring/defaults';
import Stafi from 'src/servers/stafi';
import AddressInputEmbedNew from 'src/shared/components/input/addressInputEmbedNew';
import SlippageToleranceInputEmbed from 'src/shared/components/input/slippageToleranceInputEmbed';
import TypeSelectorInput from 'src/shared/components/input/TypeSelectorInput';
import Modal from 'src/shared/components/modal/connectModal';
import numberUtil from 'src/util/numberUtil';
import styled from 'styled-components';
import Page_FIS from '../../rATOM/selectWallet_rFIS/index';
import DexTokenItem from './DexTokenItem';

const stafiServer = new Stafi();

const allTokenDatas = [
  // {
  //   icon: rasset_rfis_svg,
  //   title: 'rFIS',
  //   content: '--',
  //   type: 'rfis',
  // },
  {
    icon: rasset_ratom_svg,
    title: 'rATOM',
    type: 'ratom',
    content: '--',
    ratio: '--',
    totalRate: '--',
  },
  // {
  //   icon: rasset_rbnb_svg,
  //   title: 'rBNB',
  //   type: 'rbnb',
  //   content: '--',
  //   ratio: '--',
  //   totalRate: '--',
  // },
  // {
  //   icon: rasset_rdot_svg,
  //   title: 'rDOT',
  //   type: 'rdot',
  //   content: '--',
  //   ratio: '--',
  //   totalRate: '--',
  // },
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
  const [tokenTypes, setTokenTypes] = useState([]);
  const [selectedToken, setSelectedToken] = useState();
  const [currentSwapFee, setCurrentSwapFee] = useState('--');
  const [currentRatio, setCurrentRatio] = useState('--');
  const [currentLiquidityRate, setCurrentLiquidityRate] = useState('--');
  const [currentTotalRate, setCurrentTotalRate] = useState('--');
  const [address, setAddress] = useState('');
  const [slippageTolerance, setSlippageTolerance] = useState(1);
  const [customSlippageTolerance, setCustomSlippageTolerance] = useState();
  const [currentNativeTokenReserves, setCurrentNativeTokenReserves] = useState('--');

  const [transferDetail, setTransferDetail] = useState('');
  const [viewTxUrl, setViewTxUrl] = useState('');

  const [fisAccountModalVisible, setFisAccountModalVisible] = useState(false);

  const [chartTimeUnit, setChartTimeUnit] = useState('d');

  const { fisAccount, transferrableAmount, rDOTTokenAmount, rATOMTokenAmount, rBNBTokenAmount } = useSelector(
    (state) => {
      return {
        fisAccount: state.FISModule.fisAccount,
        transferrableAmount: state.FISModule.transferrableAmountShow,
        rFISTokenAmount: numberUtil.handleFisAmountToFixed(state.FISModule.tokenAmount),
        rKSMTokenAmount: numberUtil.handleFisAmountToFixed(state.rKSMModule.tokenAmount),
        rDOTTokenAmount: numberUtil.handleFisAmountToFixed(state.rDOTModule.tokenAmount),
        rATOMTokenAmount: numberUtil.handleFisAmountToFixed(state.rATOMModule.tokenAmount),
        rBNBTokenAmount: numberUtil.handleFisAmountToFixed(state.rBNBModule.tokenAmount),
      };
    },
  );

  const {
    rDOTSwapFee,
    rDOTRatio,
    rDOTLiquidityRate,
    rATOMSwapFee,
    rATOMRatio,
    rATOMLiquidityRate,
    rBNBSwapFee,
    rBNBRatio,
    rBNBLiquidityRate,
  } = useSelector((state) => {
    return {
      rDOTSwapFee: state.rDOTModule.swapFee,
      rDOTRatio: state.rDOTModule.ratio,
      rDOTLiquidityRate: state.rDOTModule.liquidityRate,
      rATOMSwapFee: state.rATOMModule.swapFee,
      rATOMRatio: state.rATOMModule.ratio,
      rATOMLiquidityRate: state.rATOMModule.liquidityRate,
      rBNBSwapFee: state.rBNBModule.swapFee,
      rBNBRatio: state.rBNBModule.ratio,
      rBNBLiquidityRate: state.rBNBModule.liquidityRate,
    };
  });

  useEffect(() => {
    clearInput();
    updateAllData();
  }, [fisAccount && fisAccount.address]);

  const updateAllData = () => {
    dispatch(fis_reloadData());
    dispatch(fis_rTokenRate());
    // atom
    dispatch(atom_query_rBalances_account());
    dispatch(atom_rSwapFee());
    dispatch(atom_rTokenRate());
    dispatch(atom_rLiquidityRate());
    // dot
    dispatch(dot_query_rBalances_account());
    dispatch(dot_rSwapFee());
    dispatch(dot_rTokenRate());
    dispatch(dot_rLiquidityRate());
    // bnb
    dispatch(bnb_query_rBalances_account());
    dispatch(bnb_rSwapFee());
    dispatch(bnb_rTokenRate());
    dispatch(bnb_rLiquidityRate());
  };

  useEffect(() => {
    if (!selectedToken) {
      setCurrentSwapFee('--');
      return;
    }
    if (selectedToken.type === 'ratom') {
      setCurrentSwapFee(rATOMSwapFee);
    }
    if (selectedToken.type === 'rdot') {
      setCurrentSwapFee(rDOTSwapFee);
    }
    if (selectedToken.type === 'rbnb') {
      setCurrentSwapFee(rBNBSwapFee);
    }
  }, [selectedToken, rATOMSwapFee, rDOTSwapFee, rBNBSwapFee]);

  useEffect(() => {
    updateTokenReserves();
  }, [selectedToken]);

  const updateTokenReserves = async () => {
    if (!selectedToken) {
      return;
    }
    let rTokenSymbol;
    if (selectedToken.type === 'ratom') {
      rTokenSymbol = rSymbol.Atom;
    } else if (selectedToken.type === 'rdot') {
      rTokenSymbol = rSymbol.Dot;
    } else if (selectedToken.type === 'rbnb') {
      rTokenSymbol = rSymbol.Bnb;
    }
    if (!rTokenSymbol) {
      return;
    }
    const stafiApi = await stafiServer.createStafiApi();
    const reserves = await stafiApi.query.rDexnSwap.nativeTokenReserves(rTokenSymbol);
    if (reserves) {
      setCurrentNativeTokenReserves(numberUtil.tokenAmountToHuman(reserves.toJSON(), rTokenSymbol));
    }
  };

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
    if (selectedToken.type === 'rbnb') {
      setCurrentRatio(rBNBRatio);
      setCurrentLiquidityRate(rBNBLiquidityRate);
    }
  }, [selectedToken, rDOTLiquidityRate, rATOMLiquidityRate, rBNBLiquidityRate, rDOTRatio, rATOMRatio, rBNBRatio]);

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
    setMinReceiveTokenAmount(
      (result *
        (100 -
          (customSlippageTolerance && Number(customSlippageTolerance) > Number(0)
            ? customSlippageTolerance
            : slippageTolerance))) /
        100,
    );
  }, [rTokenAmount, currentTotalRate, slippageTolerance, customSlippageTolerance]);

  useEffect(() => {
    allTokenDatas.forEach((item) => {
      if (item.type === 'rdot') {
        item.content = rDOTTokenAmount;
        item.ratio = isNaN(Number(rDOTRatio)) ? '--' : numberUtil.handleAmountRoundToFixed(rDOTRatio, 2);
        item.totalRate = isNaN(Number(rDOTRatio * rDOTLiquidityRate))
          ? '--'
          : numberUtil.handleAmountRoundToFixed(rDOTRatio * rDOTLiquidityRate, 2);
      }
      if (item.type === 'ratom') {
        item.content = rATOMTokenAmount;
        item.ratio = isNaN(Number(rATOMRatio)) ? '--' : numberUtil.handleAmountRoundToFixed(rATOMRatio, 2);
        item.totalRate = isNaN(Number(rATOMRatio * rATOMLiquidityRate))
          ? '--'
          : numberUtil.handleAmountRoundToFixed(rATOMRatio * rATOMLiquidityRate, 2);
      }
      if (item.type === 'rbnb') {
        item.content = rBNBTokenAmount;
        item.ratio = isNaN(Number(rBNBRatio)) ? '--' : numberUtil.handleAmountRoundToFixed(rBNBRatio, 2);
        item.totalRate = isNaN(Number(rBNBRatio * rBNBLiquidityRate))
          ? '--'
          : numberUtil.handleAmountRoundToFixed(rBNBRatio * rBNBLiquidityRate, 2);
      }
    });
    setTokenTypes([...allTokenDatas]);
  }, [
    rDOTTokenAmount,
    rATOMTokenAmount,
    rBNBTokenAmount,
    rDOTRatio,
    rATOMRatio,
    rBNBRatio,
    rDOTLiquidityRate,
    rATOMLiquidityRate,
    rBNBLiquidityRate,
  ]);

  const updateChartData = () => {
    const cycle = chartTimeUnit === 'd' ? 1 : chartTimeUnit === 'w' ? 2 : 3;
    if (selectedToken && selectedToken.type === 'ratom') {
      dispatch(atomFetchRTokenStatDetail(cycle));
    } else {
      dispatch(fis_fetchRTokenStatDetail(cycle));
    }
  };

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
    if (selectedToken.type === 'rbnb') {
      return 'BNB';
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
    setTransferDetail(numberUtil.handleFisRoundToFixed(receiveTokenAmount) + ' ' + getTokenName());

    let symbol;
    if (selectedToken.type === 'ratom') {
      if (!atom_checkAddress(address)) {
        message.error('Address input error');
        return;
      }
      symbol = rSymbol.Atom;
      setViewTxUrl(config.atomScanAddressUrl(address));
    } else if (selectedToken.type === 'rdot') {
      if (!dot_checkAddress(address)) {
        message.error('Address input error');
        return;
      }
      symbol = rSymbol.Dot;
      setViewTxUrl(config.dotScanAddressUrl(address));
    } else if (selectedToken.type === 'rbnb') {
      if (!bnb_checkAddress(address)) {
        message.error('Address input error');
        return;
      }
      symbol = rSymbol.Bnb;
      setViewTxUrl(config.bnbScanAddressUrl(address));
    }

    dispatch(
      swap(
        symbol,
        rTokenAmount,
        address,
        numberUtil.handleFisRoundToFixed(minReceiveTokenAmount),
        numberUtil.handleFisRoundToFixed(receiveTokenAmount),
        () => {
          clearInput();
          updateAllData();
        },
      ),
    );
  };

  const clearInput = () => {
    setScene(0);
    setRTokenAmount('');
    setAddress('');
  };

  return (
    <HContainer alignItems='flex-start'>
      <Container>
        <Text size={'30px'} sameLineHeight bold>
          rSWAP
        </Text>

        <Text size={'14px'} color={'#a5a5a5'} sameLineHeight mt={'5px'}>
          Protocol Liquidity for rTokens. Read{' '}
          <span
            style={{ color: '#00F3AB', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => window.open('https://docs.stafi.io/rtoken-app/rswap-v1-erd-solution')}>
            Mechanism
          </span>
        </Text>

        <CardContainer width={'342px'} mt={'50px'} pt={'17px'} pb={'8px'} style={{ minHeight: '468px' }}>
          <HContainer mb={'20px'} ml={'20px'} mr={'20px'}>
            <div style={{ height: '20px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              {scene === 0 && (
                <Text size={'18px'} sameLineHeight bold>
                  Swap
                </Text>
              )}
              {scene === 1 && (
                <img
                  alt='back'
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
                    alt='back'
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
                    alt='back'
                    src={left_arrow}
                    style={{ cursor: 'pointer', width: '12px', height: '12px' }}
                    onClick={() => {
                      setScene(0);
                    }}
                  />

                  <Text size={'18px'} ml={'12px'} sameLineHeight bold>
                    Select a rToken
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
                        showMax={true}
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
                              } * ExchangeRate * N (N is % of liquidity fee, govered by the protocol, it is ${numberUtil.percentageAmountToHuman(
                                currentLiquidityRate,
                              )} atm.)`}>
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
                          active={
                            slippageTolerance.toString() === '0.1' &&
                            (!customSlippageTolerance || Number(customSlippageTolerance) <= Number(0))
                          }
                          onClick={() => {
                            setCustomSlippageTolerance('');
                            setSlippageTolerance(0.1);
                          }}>
                          0.1%
                        </SlippageToleranceItem>

                        <SlippageToleranceItem
                          active={
                            slippageTolerance.toString() === '0.5' &&
                            (!customSlippageTolerance || Number(customSlippageTolerance) <= Number(0))
                          }
                          onClick={() => {
                            setCustomSlippageTolerance('');
                            setSlippageTolerance(0.5);
                          }}>
                          0.5%
                        </SlippageToleranceItem>

                        <SlippageToleranceItem
                          active={
                            slippageTolerance.toString() === '1' &&
                            (!customSlippageTolerance || Number(customSlippageTolerance) <= Number(0))
                          }
                          onClick={() => {
                            setCustomSlippageTolerance('');
                            setSlippageTolerance(1);
                          }}>
                          1%
                        </SlippageToleranceItem>

                        <HContainer mt={'8px'}>
                          <SlippageToleranceInputEmbed
                            onChange={setCustomSlippageTolerance}
                            value={customSlippageTolerance}
                          />
                          <Text size={'14px'}>%</Text>
                        </HContainer>
                      </SlippageToleranceContainer>
                    </>
                  )}
                </Content>

                {scene === 0 && (
                  <CommonButton
                    text={fisAccount && fisAccount.address ? 'Next' : 'Connect Wallet'}
                    disabled={
                      fisAccount &&
                      fisAccount.address &&
                      (!selectedToken || Number(rTokenAmount) <= Number(0) || isNaN(currentNativeTokenReserves))
                    }
                    mt='25px'
                    onClick={() => {
                      if (fisAccount && fisAccount.address) {
                        if (!isNaN(receiveTokenAmount) && !isNaN(currentNativeTokenReserves)) {
                          if (Number(receiveTokenAmount) > Number(currentNativeTokenReserves)) {
                            message.error(`No enough ${selectedToken.title.slice(1)} to be swapped in the pool`);
                            return;
                          }
                        }
                        setScene(1);
                      } else {
                        dispatch(
                          connectPolkadot_fis(() => {
                            setFisAccountModalVisible(true);
                          }),
                        );
                      }
                    }}
                  />
                )}

                {scene === 1 && <CommonButton text={'Swap'} disabled={!address} mt='25px' onClick={startSwap} />}
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
                    <HContainer alignItems='flex-start'>
                      <Text size='10px' color='#a5a5a5' mr='2px' sameLineHeight>
                        Fee
                      </Text>

                      <Tooltip
                        overlayClassName='doubt_overlay'
                        placement='topLeft'
                        overlayInnerStyle={{ color: '#A4A4A4' }}
                        title={'Fee charged by the rSWAP, it will be distributed to the Treasury.'}>
                        <img src={doubt} />
                      </Tooltip>

                      <Text size='10px' color='#a5a5a5' ml='2px' sameLineHeight>
                        :
                      </Text>
                    </HContainer>

                    <Text size='10px' color='white' sameLineHeight>
                      {currentSwapFee} FIS
                    </Text>
                  </HContainer>

                  <HContainer mb='8px'>
                    <HContainer alignItems='flex-start'>
                      <Text size='10px' color='#a5a5a5' mr='2px' sameLineHeight>
                        Liquidity Rate
                      </Text>

                      <Tooltip
                        overlayClassName='doubt_overlay'
                        placement='topLeft'
                        overlayInnerStyle={{ color: '#A4A4A4' }}
                        title={'Liquidity Rate is used to cover the risk and potential loss of holding rTokens.'}>
                        <img src={doubt} />
                      </Tooltip>

                      <Text size='10px' color='#a5a5a5' ml='2px' sameLineHeight>
                        :
                      </Text>
                    </HContainer>

                    <Text size='10px' color='white' sameLineHeight>
                      {numberUtil.percentageAmountToHuman(currentLiquidityRate)}
                    </Text>
                  </HContainer>

                  <HContainer style={{ visibility: !selectedToken || !selectedToken.title ? 'hidden' : '' }}>
                    <HContainer alignItems='flex-start'>
                      <Text size='10px' color='#a5a5a5' mr='2px' sameLineHeight>
                        Pooled {selectedToken && selectedToken.title.slice(1)}
                      </Text>

                      <Tooltip
                        overlayClassName='doubt_overlay'
                        placement='topLeft'
                        overlayInnerStyle={{ color: '#A4A4A4' }}
                        title={`Available ${selectedToken && selectedToken.title.slice(1)} amount in the pool`}>
                        <img src={doubt} />
                      </Tooltip>

                      <Text size='10px' color='#a5a5a5' ml='2px' sameLineHeight>
                        :
                      </Text>
                    </HContainer>

                    <Text size='10px' color='white' sameLineHeight>
                      {!isNaN(Number(currentNativeTokenReserves))
                        ? Math.floor(currentNativeTokenReserves * 100) / 100
                        : '--'}
                    </Text>
                  </HContainer>
                </InnerContainer>
              </div>
            </>
          )}
        </CardContainer>
      </Container>

      <div style={{ flex: 1, marginTop: '140px', marginLeft: '100px', marginRight: '50px' }}>
        {tokenTypes.map((tokenData) => (
          <DexTokenItem key={tokenData.type} {...tokenData} />
        ))}
      </div>

      <DexSwapLoading transferDetail={transferDetail} viewTxUrl={viewTxUrl} />

      <Modal visible={fisAccountModalVisible}>
        <Page_FIS
          location={{}}
          type='header'
          onClose={() => {
            setFisAccountModalVisible(false);
          }}
        />
      </Modal>
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
