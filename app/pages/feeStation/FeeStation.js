import CommonButton from '@components/CommonButton';
import { CardContainer, HContainer, Text } from '@components/commonComponents';
import FeeStationSwapLoading from '@components/modal/FeeStationSwapLoading';
import TokenSelector from '@components/selector/TokenSelector';
import config from '@config/index';
import {
  reloadData as feeStation_reloadData,
  setPoolInfoList,
  setSwapMaxLimit,
  setSwapMinLimit,
  uploadSwapInfo
} from '@features/feeStationClice';
import { queryBalance as fis_queryBalance } from '@features/FISClice';
import {
  connectAtomjs,
  connectPolkadot,
  connectPolkadot_fis,
  connectPolkadot_ksm,
  reloadData,
  setLoading
} from '@features/globalClice';
import { swapAtomForFis } from '@features/rATOMClice';
import { getPools as dot_getPools, swapDotForFis } from '@features/rDOTClice';
import { connectMetamask, get_eth_getBalance, monitoring_Method, swapEthForFis } from '@features/rETHClice';
import { swapKsmForFis } from '@features/rKSMClice';
import arrowDownIcon from '@images/arrow_down.svg';
import left_arrow from '@images/left_arrow.svg';
import atomIcon from '@images/rATOM.svg';
import dotIcon from '@images/rDOT.svg';
import ethIcon from '@images/rETH.svg';
import ksmIcon from '@images/rKSM.svg';
import settingIcon from '@images/setting.svg';
import { Symbol } from '@keyring/defaults';
import FeeStationServer from '@servers/feeStation';
import SlippageToleranceInputEmbed from '@shared/components/input/slippageToleranceInputEmbed';
import TypeSelectorInput from '@shared/components/input/TypeSelectorInput';
import Modal from '@shared/components/modal/connectModal';
import { getLocalStorageItem, Keys } from '@util/common';
import numberUtil from '@util/numberUtil';
import { useInterval } from '@util/utils';
import { message, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Page_FIS from '../rATOM/selectWallet_rFIS/index';
import Page_DOT from '../rDOT/selectWallet/index.tsx';
import Page_KSM from '../rKSM/selectWallet/index.tsx';

const feeStationServer = new FeeStationServer();

const allTokenDatas = [
  {
    icon: ethIcon,
    title: 'ETH',
    content: '',
    balance: '--',
    type: Symbol.Eth,
  },
  {
    icon: dotIcon,
    title: 'DOT',
    content: '',
    balance: '--',
    type: Symbol.Dot,
  },
  {
    icon: ksmIcon,
    title: 'KSM',
    content: '',
    balance: '--',
    type: Symbol.Ksm,
  },
  {
    icon: atomIcon,
    title: 'ATOM',
    content: '',
    balance: '--',
    type: Symbol.Atom,
  },
];

export default function FeeStation() {
  const dispatch = useDispatch();
  const history = useHistory();
  let urlTokenType = useParams().tokenType;

  // 0-main, 2-setting, 3-select token
  const [scene, setScene] = useState(0);
  const [tokenTypes, setTokenTypes] = useState(allTokenDatas);
  const [selectedToken, setSelectedToken] = useState();
  const [tokenAmount, setTokenAmount] = useState();
  const [receiveFisAmount, setReceiveFisAmount] = useState();
  const [inputFromReceive, setInputFromReceive] = useState(false);
  const [minReceiveFisAmount, setMinReceiveFisAmount] = useState('--');
  const [slippageTolerance, setSlippageTolerance] = useState(1);
  const [customSlippageTolerance, setCustomSlippageTolerance] = useState();
  const [contentOpacity, setContentOpacity] = useState(1);
  const [needConnectWalletName, setNeedConnectWalletName] = useState();

  const [fisAccountModalVisible, setFisAccountModalVisible] = useState(false);
  const [dotAccountModalVisible, setDotAccountModalVisible] = useState(false);
  const [ksmAccountModalVisible, setKsmAccountModalVisible] = useState(false);

  const [currentPoolInfo, setCurrentPoolInfo] = useState();

  const [transferDetail, setTransferDetail] = useState('');
  const [swapInfoParams, setSwapInfoParams] = useState();

  const {
    loading,
    fisAccount,
    dotAccount,
    ksmAccount,
    atomAccount,
    ethAccount,
    metaMaskNetworkId,
    poolInfoList,
    swapMinLimit,
    swapMaxLimit,
  } = useSelector((state) => {
    return {
      loading: state.globalModule.loading,
      fisAccount: state.FISModule.fisAccount,
      dotAccount: state.rDOTModule.dotAccount,
      ksmAccount: state.rKSMModule.ksmAccount,
      atomAccount: state.rATOMModule.atomAccount,
      ethAccount: state.rETHModule.ethAccount,
      metaMaskNetworkId: state.globalModule.metaMaskNetworkId,
      poolInfoList: state.feeStationModule.poolInfoList,
      swapMinLimit: state.feeStationModule.swapMinLimit,
      swapMaxLimit: state.feeStationModule.swapMaxLimit,
    };
  });

  useInterval(() => {
    if (fisAccount) {
      dispatch(fis_queryBalance(fisAccount));
    }
    dispatch(feeStation_reloadData());
  }, 15000);

  useEffect(() => {
    if (
      urlTokenType !== 'default' &&
      urlTokenType !== Symbol.Eth &&
      urlTokenType !== Symbol.Atom &&
      urlTokenType !== Symbol.Ksm &&
      urlTokenType !== Symbol.Dot
    ) {
      history.replace('/feeStation/default');
      return;
    }
    dispatch(feeStation_reloadData());
    const token = tokenTypes.find((item) => {
      return item.type === urlTokenType;
    });
    setSelectedToken(token);
    setTokenAmount('');
  }, [urlTokenType, tokenTypes]);

  useEffect(() => {
    if (fisAccount) {
      dispatch(fis_queryBalance(fisAccount));
    }
  }, [fisAccount && fisAccount.address]);

  useEffect(() => {
    if (selectedToken && selectedToken.type === 'dot' && dotAccount && dotAccount.address) {
      dispatch(reloadData(Symbol.Dot));
      dispatch(dot_getPools());
    }
  }, [selectedToken && selectedToken.type, dotAccount && dotAccount.address]);

  useEffect(() => {
    if (selectedToken && selectedToken.type === 'ksm' && ksmAccount && ksmAccount.address) {
      dispatch(reloadData(Symbol.Ksm));
    }
  }, [selectedToken && selectedToken.type, ksmAccount && ksmAccount.address]);

  useEffect(() => {
    if (selectedToken && selectedToken.type === 'atom' && atomAccount && atomAccount.address) {
      dispatch(reloadData(Symbol.Atom));
      if (getLocalStorageItem(Keys.AtomAccountKey)) {
        setTimeout(() => {
          dispatch(connectAtomjs());
        }, 1000);
      }
    }
  }, [selectedToken && selectedToken.type, atomAccount && atomAccount.address]);

  useEffect(() => {
    if (selectedToken && selectedToken.type === 'eth' && ethAccount && ethAccount.address) {
      dispatch(get_eth_getBalance());
      dispatch(monitoring_Method());
    }
  }, [selectedToken && selectedToken.type, ethAccount && ethAccount.address, metaMaskNetworkId]);

  useEffect(() => {
    tokenTypes.forEach((item) => {
      if (item.type === Symbol.Dot && dotAccount) {
        item.balance = dotAccount.balance;
      }
      if (item.type === Symbol.Ksm && ksmAccount) {
        item.balance = ksmAccount.balance;
      }
      if (item.type === Symbol.Atom && atomAccount) {
        item.balance = atomAccount.balance;
      }
      if (item.type === Symbol.Eth && ethAccount) {
        item.balance = ethAccount.balance;
      }
    });

    if (scene === 0) {
      if (!fisAccount || !fisAccount.address) {
        setConnectWallet('FIS');
        return;
      }
      if (selectedToken && selectedToken.type === Symbol.Dot) {
        if (!dotAccount || !dotAccount.address) {
          setConnectWallet('DOT');
        } else {
          clearConnectWallet();
        }
      } else if (selectedToken && selectedToken.type === Symbol.Ksm) {
        if (!ksmAccount || !ksmAccount.address) {
          setConnectWallet('KSM');
        } else {
          clearConnectWallet();
        }
      } else if (selectedToken && selectedToken.type === Symbol.Atom) {
        if (!atomAccount || !atomAccount.address) {
          setConnectWallet('ATOM');
        } else {
          clearConnectWallet();
        }
      } else if (selectedToken && selectedToken.type === Symbol.Eth) {
        if (!ethAccount || !ethAccount.address) {
          setConnectWallet('ETH');
        } else {
          clearConnectWallet();
        }
      } else {
        setContentOpacity(1);
        setNeedConnectWalletName(null);
      }
    }
  }, [scene, selectedToken, fisAccount, dotAccount, ksmAccount, atomAccount, ethAccount]);

  useEffect(() => {
    let poolInfo = null;
    if (!selectedToken || !poolInfoList) {
      poolInfo = null;
    } else {
      poolInfo = poolInfoList.find((item) => {
        return item.symbol === selectedToken.title;
      });
    }
    setCurrentPoolInfo(poolInfo);
  }, [selectedToken, poolInfoList]);

  useEffect(() => {
    if (inputFromReceive) {
      return;
    }
    if (!tokenAmount || isNaN(tokenAmount) || Number(tokenAmount) <= Number(0) || !currentPoolInfo) {
      setReceiveFisAmount('');
      setMinReceiveFisAmount('--');
    } else {
      const fisAmount = numberUtil.divide(numberUtil.mul(tokenAmount, currentPoolInfo.swapRate), 1000000);
      setReceiveFisAmount(numberUtil.handleFisRoundToFixed(fisAmount));

      setMinReceiveFisAmount(
        numberUtil.divide(
          numberUtil.mul(
            numberUtil.mul(tokenAmount, currentPoolInfo.swapRate),
            numberUtil.sub(
              1,
              numberUtil.divide(
                customSlippageTolerance && Number(customSlippageTolerance) > Number(0)
                  ? customSlippageTolerance
                  : slippageTolerance,
                100,
              ),
            ),
          ),
          1000000,
        ),
      );
    }
  }, [inputFromReceive, tokenAmount, currentPoolInfo, slippageTolerance, customSlippageTolerance]);

  useEffect(() => {
    if (!inputFromReceive) {
      return;
    }
    if (!receiveFisAmount || isNaN(receiveFisAmount) || Number(receiveFisAmount) <= Number(0) || !currentPoolInfo) {
      setTokenAmount('');
      setMinReceiveFisAmount('--');
    } else {
      const tokenAmount = numberUtil.divide(numberUtil.mul(receiveFisAmount, 1000000), currentPoolInfo.swapRate);
      if (!selectedToken || selectedToken.balance === '--' || tokenAmount > selectedToken.balance) {
        setTokenAmount('');
        setTokenAmount('');
        if (selectedToken && selectedToken.balance !== '--') {
          message.error('The amount of input exceeds your transferrable balance');
        }
        return;
      }

      setTokenAmount(numberUtil.handleFisRoundToFixed(tokenAmount));

      setMinReceiveFisAmount(
        numberUtil.mul(
          receiveFisAmount,
          numberUtil.sub(
            1,
            numberUtil.divide(
              customSlippageTolerance && Number(customSlippageTolerance) > Number(0)
                ? customSlippageTolerance
                : slippageTolerance,
              100,
            ),
          ),
        ),
      );
    }
  }, [
    inputFromReceive,
    receiveFisAmount,
    selectedToken && selectedToken.balance,
    currentPoolInfo && currentPoolInfo.swapRate,
    slippageTolerance,
    customSlippageTolerance,
  ]);

  useEffect(() => {
    if (receiveFisAmount && !isNaN(receiveFisAmount) && !isNaN(swapMinLimit) && !isNaN(swapMaxLimit)) {
      if (receiveFisAmount < swapMinLimit || receiveFisAmount > swapMaxLimit) {
        message.warn(`You can swap ${swapMinLimit}~${swapMaxLimit} FIS every transaction.`);
        // setTokenAmount('');
      }
    }
  }, [receiveFisAmount, swapMinLimit, swapMaxLimit]);

  const onChangeTokenAmount = (value) => {
    setInputFromReceive(false);
    setTokenAmount(value);
  };

  const onChangeFisAmount = (value) => {
    setInputFromReceive(true);
    setReceiveFisAmount(value);
  };

  const setConnectWallet = (name) => {
    setContentOpacity(0.5);
    setNeedConnectWalletName(name);
  };

  const clearConnectWallet = () => {
    setContentOpacity(1);
    setNeedConnectWalletName(null);
  };

  const connectWallet = () => {
    if (needConnectWalletName === 'FIS') {
      dispatch(
        connectPolkadot_fis(() => {
          setFisAccountModalVisible(true);
        }),
      );
    }
    if (needConnectWalletName === 'DOT') {
      dispatch(
        connectPolkadot(() => {
          setDotAccountModalVisible(true);
        }),
      );
    }
    if (needConnectWalletName === 'KSM') {
      dispatch(
        connectPolkadot_ksm(() => {
          setKsmAccountModalVisible(true);
        }),
      );
    }
    if (needConnectWalletName === 'ATOM') {
      dispatch(connectAtomjs(() => {}));
    }
    if (needConnectWalletName === 'ETH') {
      dispatch(connectMetamask(config.ethChainId(), false));
    }
  };

  const clickSwap = async () => {
    const result = await checkInput();
    if (!result) {
      return;
    }

    setTransferDetail(numberUtil.handleFisRoundToFixed(receiveFisAmount) + ' FIS');
    if (selectedToken.type === Symbol.Dot) {
      dispatch(
        swapDotForFis(currentPoolInfo.poolAddress, tokenAmount, receiveFisAmount, minReceiveFisAmount, (params) => {
          if (params) {
            setInputFromReceive(false);
            setTokenAmount('');
            setSwapInfoParams(params);
            dispatch(uploadSwapInfo(params));
          }
        }),
      );
    }
    if (selectedToken.type === Symbol.Ksm) {
      dispatch(
        swapKsmForFis(currentPoolInfo.poolAddress, tokenAmount, receiveFisAmount, minReceiveFisAmount, (params) => {
          if (params) {
            setInputFromReceive(false);
            setTokenAmount('');
            setSwapInfoParams(params);
            dispatch(uploadSwapInfo(params));
          }
        }),
      );
    }
    if (selectedToken.type === Symbol.Atom) {
      dispatch(
        swapAtomForFis(currentPoolInfo.poolAddress, tokenAmount, receiveFisAmount, minReceiveFisAmount, (params) => {
          if (params) {
            setInputFromReceive(false);
            setTokenAmount('');
            setSwapInfoParams(params);
            dispatch(uploadSwapInfo(params));
          }
        }),
      );
    }
    if (selectedToken.type === Symbol.Eth) {
      dispatch(
        swapEthForFis(currentPoolInfo.poolAddress, tokenAmount, receiveFisAmount, minReceiveFisAmount, (params) => {
          if (params) {
            setInputFromReceive(false);
            setTokenAmount('');
            setSwapInfoParams(params);
            dispatch(uploadSwapInfo(params));
          }
        }),
      );
    }
  };

  const checkInput = async () => {
    if (!fisAccount || !fisAccount.address) {
      return false;
    }
    if (!selectedToken) {
      return false;
    }
    if (selectedToken && selectedToken.type === Symbol.Dot) {
      if (!dotAccount || !dotAccount.address) {
        return false;
      }
    }
    if (!currentPoolInfo || !currentPoolInfo.poolAddress) {
      message.error('Unable to swap, system is waiting for matching pool');
      return false;
    }
    if (!swapMinLimit || swapMinLimit === '--' || !swapMaxLimit || swapMaxLimit === '--') {
      message.error('Unable to swap, system is waiting for swapLimit data');
      return false;
    }
    dispatch(setLoading(true));
    const res = await feeStationServer.getPoolInfo();
    if (res.status === '80000' && res.data) {
      const poolInfo = res.data.poolInfoList?.find((item) => {
        return item.symbol === selectedToken?.title;
      });
      if (
        !poolInfo ||
        minReceiveFisAmount > numberUtil.divide(numberUtil.mul(tokenAmount, poolInfo.swapRate), 1000000)
      ) {
        dispatch(setLoading(false));
        message.error('Swap Rate refreshed, please recheck');
        dispatch(setSwapMaxLimit(numberUtil.fisAmountToHuman(res.data.swapMaxLimit)));
        dispatch(setSwapMinLimit(numberUtil.fisAmountToHuman(res.data.swapMinLimit)));
        dispatch(setPoolInfoList(res.data.poolInfoList));
        return false;
      }
    } else {
      dispatch(setLoading(false));
      return false;
    }

    return true;
  };

  return (
    <Container>
      <Title>Fee Station</Title>

      <Description>If you have no native FIS to pay for the fee, you can swap</Description>
      <Description mb={'24px'}>native FIS using native DOT, ETH, ATOM, etc.</Description>

      <Spin spinning={loading} size='large' tip='loading'>
        <CardContainer width={'340px'} pt={'17px'} pb={'8px'} style={{ minHeight: '468px' }} alignSelf='center'>
          <HContainer mb={'20px'} ml={'20px'} mr={'20px'} style={{ opacity: contentOpacity }}>
            <div style={{ height: '20px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              {scene === 0 && (
                <Text size={'18px'} sameLineHeight bold>
                  Swap
                </Text>
              )}
              {scene === 2 && (
                <HContainer>
                  <img
                    src={left_arrow}
                    style={{ cursor: 'pointer', width: '12px', height: '12px' }}
                    onClick={() => {
                      setScene(0);
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

                  <Text size={'18px'} ml={'12px'} sameLineHeight>
                    Select a token
                  </Text>
                </HContainer>
              )}
            </div>

            {scene === 0 && (
              <IconContainer clickable>
                <Icon
                  src={settingIcon}
                  onClick={() => {
                    if (fisAccount && fisAccount.address && !needConnectWalletName) {
                      setScene(2);
                    }
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
                  value && history.replace(`/feeStation/${value.type}`);
                  setScene(0);
                }}
              />
            </InnerContainer>
          )}

          {scene !== 3 && (
            <>
              <InnerContainer>
                <Content style={{ opacity: contentOpacity }}>
                  {scene === 0 && (
                    <>
                      <TypeSelectorInput
                        selectDataSource={tokenTypes}
                        title='From'
                        maxInput={
                          selectedToken && selectedToken.balance !== '--' && selectedToken.balance
                            ? selectedToken.balance
                            : 0
                        }
                        value={tokenAmount}
                        selectedData={selectedToken}
                        onClickSelect={() => setScene(3)}
                        onChange={onChangeTokenAmount}
                        disabled={
                          !fisAccount ||
                          !fisAccount.address ||
                          needConnectWalletName ||
                          !currentPoolInfo ||
                          !selectedToken
                        }
                        selectable={true}
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
                        maxInput={Number.MAX_SAFE_INTEGER}
                        selectedTitle='FIS'
                        value={receiveFisAmount}
                        onChange={onChangeFisAmount}
                        disabled={needConnectWalletName || !currentPoolInfo || !selectedToken}
                      />

                      {selectedToken && (
                        <HContainer justifyContent='center' alignItems='center' mt='24px'>
                          <Text size={'12px'} color={'#a5a5a5'}>
                            {`1 ${selectedToken.title} =  ${
                              currentPoolInfo ? currentPoolInfo.swapRate / 1000000 : '--'
                            } FIS`}
                          </Text>
                        </HContainer>
                      )}
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

                {scene === 0 &&
                  (needConnectWalletName ? (
                    <CommonButton
                      text={`Connect to a ${needConnectWalletName} wallet`}
                      mt='25px'
                      onClick={connectWallet}
                    />
                  ) : (
                    <CommonButton
                      text={'Swap'}
                      disabled={
                        !selectedToken ||
                        Number(tokenAmount) <= Number(0) ||
                        !currentPoolInfo ||
                        isNaN(swapMinLimit) ||
                        isNaN(swapMaxLimit) ||
                        receiveFisAmount < swapMinLimit ||
                        receiveFisAmount > swapMaxLimit
                      }
                      mt='25px'
                      onClick={clickSwap}
                    />
                  ))}
              </InnerContainer>

              <div style={{ visibility: scene === 0 ? 'visible' : 'hidden' }}>
                <div style={{ opacity: contentOpacity }}>
                  <Divider />

                  <InnerContainer>
                    <HContainer mb='8px'>
                      <Text size='10px' color='#a5a5a5' sameLineHeight>
                        Slippage Tolerance :
                      </Text>
                      <Text size='10px' color='white' sameLineHeight>
                        {customSlippageTolerance && Number(customSlippageTolerance) > Number(0)
                          ? customSlippageTolerance
                          : slippageTolerance}
                        %
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
              </div>
            </>
          )}
        </CardContainer>
      </Spin>

      {swapMinLimit && swapMinLimit !== '--' && swapMaxLimit && swapMaxLimit !== '--' && (
        <Description mt='30px'>
          Note: You can swap {swapMinLimit}~{swapMaxLimit} FIS every transaction.
        </Description>
      )}

      <Modal visible={fisAccountModalVisible}>
        <Page_FIS
          location={{}}
          type='header'
          onClose={() => {
            setFisAccountModalVisible(false);
          }}
        />
      </Modal>

      <Modal visible={dotAccountModalVisible}>
        <Page_DOT
          location={{}}
          type='header'
          onClose={() => {
            setDotAccountModalVisible(false);
          }}
        />
      </Modal>

      <Modal visible={ksmAccountModalVisible}>
        <Page_KSM
          location={{}}
          type='header'
          onClose={() => {
            setKsmAccountModalVisible(false);
          }}
        />
      </Modal>

      <FeeStationSwapLoading
        showSignatureHint={selectedToken && selectedToken.type !== 'atom'}
        transferDetail={transferDetail}
        viewTxUrl={config.stafiScanUrl(fisAccount && fisAccount.address)}
        swapInfoParams={swapInfoParams}
        onSwapSuccess={() => {
          if (fisAccount) {
            dispatch(fis_queryBalance(fisAccount));
          }
        }}
      />
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
  marginBottom: props.mb,
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
  fontFamily: "'Helvetica-Bold', sans-serif",
  marginRight: '14px',
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
