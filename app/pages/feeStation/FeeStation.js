import CommonButton from '@components/CommonButton';
import { CardContainer, HContainer, Text } from '@components/commonComponents';
import FeeStationSwapLoading from '@components/modal/FeeStationSwapLoading';
import TokenSelector from '@components/selector/TokenSelector';
import config from '@config/index';
import { reloadData as feeStation_reloadData, uploadSwapInfo } from '@features/feeStationClice';
import { queryBalance as fis_queryBalance } from '@features/FISClice';
import {
  connectAtomjs,
  connectPolkadot,
  connectPolkadot_fis,
  connectPolkadot_ksm,
  reloadData
} from '@features/globalClice';
import { swapAtomForFis } from '@features/rATOMClice';
import { getPools as dot_getPools, swapDotForFis } from '@features/rDOTClice';
import { get_eth_getBalance, swapEthForFis } from '@features/rETHClice';
import { swapKsmForFis } from '@features/rKSMClice';
import arrowDownIcon from '@images/arrow_down.svg';
import doubt from '@images/doubt.svg';
import left_arrow from '@images/left_arrow.svg';
import atomIcon from '@images/rATOM.svg';
import dotIcon from '@images/rDOT.svg';
import ethIcon from '@images/rETH.svg';
import ksmIcon from '@images/rKSM.svg';
import settingIcon from '@images/setting.svg';
import { Symbol } from '@keyring/defaults';
import TypeSelectorInput from '@shared/components/input/TypeSelectorInput';
import Modal from '@shared/components/modal/connectModal';
import numberUtil from '@util/numberUtil';
import { message, Spin, Tooltip } from 'antd';
import { divide, multiply, subtract } from 'mathjs';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Page_FIS from '../rATOM/selectWallet_rFIS/index';
import Page_DOT from '../rDOT/selectWallet/index.tsx';
import Page_KSM from '../rKSM/selectWallet/index.tsx';

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
  const [minReceiveFisAmount, setMinReceiveFisAmount] = useState('--');
  const [slippageTolerance, setSlippageTolerance] = useState(1);
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
    swapLimit,
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
      swapLimit: state.feeStationModule.swapLimit,
    };
  });

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
    if (fisAccount && fisAccount.address) {
      dispatch(fis_queryBalance());
    }
  }, [fisAccount && fisAccount.address]);

  useEffect(() => {
    if (dotAccount && dotAccount.address) {
      dispatch(reloadData(Symbol.Dot));
      dispatch(dot_getPools());
    }
  }, [dotAccount && dotAccount.address]);

  useEffect(() => {
    if (ksmAccount && ksmAccount.address) {
      dispatch(reloadData(Symbol.Ksm));
    }
  }, [ksmAccount && ksmAccount.address]);

  useEffect(() => {
    if (atomAccount && atomAccount.address) {
      dispatch(reloadData(Symbol.Atom));
    }
  }, [atomAccount && atomAccount.address]);

  useEffect(() => {
    if (ethAccount && ethAccount.address) {
      dispatch(get_eth_getBalance());
    }
  }, [ethAccount && ethAccount.address, metaMaskNetworkId]);

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
    if (!selectedToken || !poolInfoList) {
      setCurrentPoolInfo(null);
      return;
    }
    const poolInfo = poolInfoList.find((item) => {
      return item.symbol === selectedToken.title;
    });
    setCurrentPoolInfo(poolInfo);
    if (!tokenAmount || isNaN(tokenAmount) || Number(tokenAmount) <= Number(0) || !poolInfo) {
      setReceiveFisAmount('');
      setMinReceiveFisAmount('--');
    } else {
      setReceiveFisAmount(divide(multiply(tokenAmount, poolInfo.swapRate), 1000000));
      setMinReceiveFisAmount(
        divide(multiply(tokenAmount, poolInfo.swapRate, subtract(1, divide(slippageTolerance, 100))), 1000000),
      );
    }
  }, [selectedToken, poolInfoList, tokenAmount, slippageTolerance]);

  useEffect(() => {
    if (receiveFisAmount && !isNaN(receiveFisAmount)) {
      if (receiveFisAmount < 1 || receiveFisAmount > 100) {
        message.warn('You can swap 1~100 FIS every transaction.');
        setTokenAmount('');
      }
    }
  }, [receiveFisAmount]);

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
  };

  const clickSwap = () => {
    if (!checkInput()) {
      return;
    }
    setTransferDetail(numberUtil.handleFisRoundToFixed(receiveFisAmount) + ' FIS');
    if (selectedToken.type === Symbol.Dot) {
      dispatch(
        swapDotForFis(currentPoolInfo.poolAddress, tokenAmount, receiveFisAmount, minReceiveFisAmount, (params) => {
          if (params) {
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
            setSwapInfoParams(params);
            dispatch(uploadSwapInfo(params));
          }
        }),
      );
    }
    if (selectedToken.type === Symbol.Eth) {
      dispatch(
        swapEthForFis(currentPoolInfo.poolAddress, tokenAmount, minReceiveFisAmount, (params) => {
          if (params) {
            setSwapInfoParams(params);
            dispatch(uploadSwapInfo(params));
          }
        }),
      );
    }
  };

  const checkInput = () => {
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
    if (!currentPoolInfo) {
      message.error('Unable to swap, system is waiting for matching pool');
      return false;
    }
    return true;
  };

  return (
    <Container>
      <Title>Fee Station</Title>

      <Description mb={'24px'}>If you have no native FIS to pay for the fee, you can swap</Description>

      <Spin spinning={loading} size='large' tip='loading'>
        <CardContainer width={'340px'} pt={'17px'} pb={'8px'} style={{ minHeight: '468px' }} alignSelf='center'>
          <HContainer mb={'20px'} ml={'20px'} mr={'20px'} style={{ opacity: contentOpacity }}>
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
                      setScene(0);
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
                        onChange={setTokenAmount}
                        disabled={!fisAccount || !fisAccount.address || needConnectWalletName}
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
                        selectedTitle='FIS'
                        value={
                          receiveFisAmount === '--' || !receiveFisAmount
                            ? ''
                            : numberUtil.handleFisRoundToFixed(receiveFisAmount)
                        }
                        disabled={true}
                      />

                      <div style={{ marginTop: '24px', height: '15px' }}>
                        {selectedToken && (
                          <HContainer justifyContent='center' alignItems='flex-start'>
                            <Text size={'12px'} color={'#a5a5a5'}>
                              {`1 ${selectedToken.title} =  ${
                                currentPoolInfo ? currentPoolInfo.swapRate / 1000000 : '--'
                              } FIS`}
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
                      disabled={!selectedToken || Number(tokenAmount) <= Number(0) || !currentPoolInfo}
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
              </div>
            </>
          )}
        </CardContainer>
      </Spin>

      <Description mt='30px'>Note: You can swap 1~100 FIS every transaction.</Description>

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
        transferDetail={transferDetail}
        viewTxUrl={config.stafiScanUrl(fisAccount && fisAccount.address)}
        swapInfoParams={swapInfoParams}
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
