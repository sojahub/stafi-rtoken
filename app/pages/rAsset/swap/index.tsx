import SwapLoading from '@components/modal/SwapLoading';
import config from '@config/index';
import {
  bep20ToNativeSwap,
  bridgeCommon_ChainFees,
  BSC_CHAIN_ID,
  erc20ToNativeSwap,
  ETH_CHAIN_ID,
  getBridgeEstimateEthFee,
  nativeToOtherSwap
} from '@features/bridgeClice';
import {
  clickSwapToBep20Link,
  getAssetBalanceAll as getBep20AssetBalanceAll,
  getBep20Allowances,
  handleBscAccount,
  monitoring_Method as bsc_Monitoring_Method
} from '@features/BSCClice';
import {
  clickSwapToErc20Link,
  clickSwapToNativeLink,
  getAssetBalanceAll,
  getErc20Allowances
} from '@features/ETHClice';
import {
  checkAddress as fis_checkAddress,
  getUnbondCommission as fis_getUnbondCommission,
  query_rBalances_account as fis_query_rBalances_account,
  reloadData,
  rTokenRate as fis_rTokenRate
} from '@features/FISClice';
import {
  getUnbondCommission as atom_getUnbondCommission,
  query_rBalances_account as atom_query_rBalances_account,
  rTokenRate as atom_rTokenRate
} from '@features/rATOMClice';
import {
  getUnbondCommission as dot_getUnbondCommission,
  query_rBalances_account as dot_query_rBalances_account,
  rTokenRate as dot_rTokenRate
} from '@features/rDOTClice';
import { checkEthAddress, handleEthAccount, monitoring_Method as eth_Monitoring_Method } from '@features/rETHClice';
import { getUnbondCommission, query_rBalances_account, rTokenRate as ksm_rTokenRate } from '@features/rKSMClice';
import {
  getUnbondCommission as matic_getUnbondCommission,
  query_rBalances_account as matic_query_rBalances_account,
  rTokenRate as matic_rTokenRate
} from '@features/rMATICClice';
import {
  getUnbondCommission as sol_getUnbondCommission,
  query_rBalances_account as sol_query_rBalances_account,
  rTokenRate as sol_rTokenRate
} from '@features/rSOLClice';
import bsc_white from '@images/bsc_white.svg';
import eth_white from '@images/eth_white.svg';
import exchange_svg from '@images/exchange.svg';
import rasset_fis_svg from '@images/rFIS.svg';
import rasset_rsol_svg from '@images/rSOL.svg';
import rasset_ratom_svg from '@images/r_atom.svg';
import rasset_rdot_svg from '@images/r_dot.svg';
import rasset_rfis_svg from '@images/r_fis.svg';
import rasset_rksm_svg from '@images/r_ksm.svg';
import rasset_rmatic_svg from '@images/r_matic.svg';
import stafi_white from '@images/stafi_white.svg';
import Back from '@shared/components/backIcon';
import Button from '@shared/components/button/button';
import Title from '@shared/components/cardTitle';
import Content from '@shared/components/content';
import AddressInputEmbed from '@shared/components/input/addressInputEmbed';
import AmountInputEmbed from '@shared/components/input/amountInputEmbed';
import TypeSelector from '@shared/components/input/typeSelector';
import NumberUtil from '@util/numberUtil';
import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './index.scss';

type SelectorType = {
  icon: any;
  title: string;
  content: string;
  type: string;
};

const tokenDatas = [
  {
    icon: rasset_fis_svg,
    title: 'FIS',
    content: '--',
    type: 'fis',
  },
  {
    icon: rasset_rfis_svg,
    title: 'rFIS',
    content: '--',
    type: 'rfis',
  },
  {
    icon: rasset_rdot_svg,
    title: 'rDOT',
    content: '--',
    type: 'rdot',
  },
  {
    icon: rasset_rksm_svg,
    title: 'rKSM',
    content: '--',
    type: 'rksm',
  },
  {
    icon: rasset_ratom_svg,
    title: 'rATOM',
    content: '--',
    type: 'ratom',
  },
  {
    icon: rasset_rsol_svg,
    title: 'rSOL',
    content: '--',
    type: 'rsol',
  },
  {
    icon: rasset_rmatic_svg,
    title: 'rMATIC',
    content: '--',
    type: 'rmatic',
  },
];

const assetDatas = [
  {
    icon: stafi_white,
    title: 'StaFi Chain',
    content: 'Native',
    type: 'native',
  },
  {
    icon: eth_white,
    title: 'Ethereum',
    content: 'ERC20',
    type: 'erc20',
  },
  {
    icon: bsc_white,
    title: 'Binance Smart Chain',
    content: 'BEP20',
    type: 'bep20',
  },
];

export default function Index(props: any) {
  const dispatch = useDispatch();
  const [fromAoumt, setFormAmount] = useState<any>();
  const [selectDataSource, setSelectDataSource] = useState(tokenDatas);
  const [tokenType, setTokenType] = useState(tokenDatas[0]);
  const [address, setAddress] = useState<any>();
  const [visible, setVisible] = useState(false);
  const [transferringModalVisible, setTransferringModalVisible] = useState(false);

  // const [operationType, setOperationType] = useState<
  //   undefined | "erc20" | "native"
  // >();
  const [fromTypeData, setFromTypeData] = useState<undefined | SelectorType>();
  const [fromTypeSelections, setFromTypeSelections] = useState(assetDatas);
  const [destTypeData, setDestTypeData] = useState<undefined | SelectorType>();
  const [destTypeSelections, setDestTypeSelections] = useState(assetDatas);

  const [reloadFlag, setReloadFlag] = useState(0);
  const [transferDetail, setTransferDetail] = useState('');
  const [viewTxUrl, setViewTxUrl] = useState('');

  const {
    erc20EstimateFee,
    bep20EstimateFee,
    estimateEthFee,
    estimateBscFee,
    rksm_balance,
    rfis_balance,
    fis_balance,
    rdot_balance,
    ratom_balance,
    rsol_balance,
    rmatic_balance,
  } = useSelector((state: any) => {
    if (fromTypeData && fromTypeData.type === 'erc20') {
      return {
        rksm_balance: NumberUtil.handleFisAmountToFixed(state.ETHModule.ercRKSMBalance),
        rfis_balance: NumberUtil.handleFisAmountToFixed(state.ETHModule.ercRFISBalance),
        fis_balance: NumberUtil.handleFisAmountToFixed(state.ETHModule.ercFISBalance),
        rdot_balance: NumberUtil.handleFisAmountToFixed(state.ETHModule.ercRDOTBalance),
        ratom_balance: NumberUtil.handleFisAmountToFixed(state.ETHModule.ercRATOMBalance),
        rsol_balance: NumberUtil.handleFisAmountToFixed(state.ETHModule.ercRSOLBalance),
        rmatic_balance: NumberUtil.handleFisAmountToFixed(state.ETHModule.ercRMaticBalance),
        estimateEthFee: state.bridgeModule.estimateEthFee,
        fisAccount: state.FISModule.fisAccount,
        ethAccount: state.rETHModule.ethAccount,
      };
    } else if (fromTypeData && fromTypeData.type === 'bep20') {
      return {
        rksm_balance: NumberUtil.handleFisAmountToFixed(state.BSCModule.bepRKSMBalance),
        rfis_balance: NumberUtil.handleFisAmountToFixed(state.BSCModule.bepRFISBalance),
        fis_balance: NumberUtil.handleFisAmountToFixed(state.BSCModule.bepFISBalance),
        rdot_balance: NumberUtil.handleFisAmountToFixed(state.BSCModule.bepRDOTBalance),
        ratom_balance: NumberUtil.handleFisAmountToFixed(state.BSCModule.bepRATOMBalance),
        rsol_balance: NumberUtil.handleFisAmountToFixed(state.BSCModule.bepRSOLBalance),
        rmatic_balance: NumberUtil.handleFisAmountToFixed(state.BSCModule.bepRMATICBalance),
        estimateBscFee: state.bridgeModule.estimateBscFee,
        fisAccount: state.FISModule.fisAccount,
        ethAccount: state.rETHModule.ethAccount,
        bscAccount: state.BSCModule.bscAccount,
      };
    } else {
      return {
        rksm_balance: NumberUtil.handleFisAmountToFixed(state.rKSMModule.tokenAmount),
        rfis_balance: NumberUtil.handleFisAmountToFixed(state.FISModule.tokenAmount),
        rdot_balance: NumberUtil.handleFisAmountToFixed(state.rDOTModule.tokenAmount),
        ratom_balance: NumberUtil.handleFisAmountToFixed(state.rATOMModule.tokenAmount),
        fis_balance: state.FISModule.fisAccount ? state.FISModule.fisAccount.balance : '--',
        rsol_balance: NumberUtil.handleFisAmountToFixed(state.rSOLModule.tokenAmount),
        rmatic_balance: NumberUtil.handleFisAmountToFixed(state.rMATICModule.tokenAmount),
        erc20EstimateFee: state.bridgeModule.erc20EstimateFee,
        bep20EstimateFee: state.bridgeModule.bep20EstimateFee,
        fisAccount: state.FISModule.fisAccount,
        ethAccount: state.rETHModule.ethAccount,
      };
    }
  });

  const { fisAccount, ethAccount, bscAccount } = useSelector((state: any) => {
    if ((fromTypeData && fromTypeData.type === 'erc20') || (destTypeData && destTypeData.type === 'erc20')) {
      return {
        fisAccount: state.FISModule.fisAccount,
        ethAccount: state.rETHModule.ethAccount,
      };
    } else if ((fromTypeData && fromTypeData.type === 'bep20') || (destTypeData && destTypeData.type === 'bep20')) {
      return {
        fisAccount: state.FISModule.fisAccount,
        bscAccount: state.BSCModule.bscAccount,
      };
    } else {
      return {
        fisAccount: state.FISModule.fisAccount,
      };
    }
  });

  const { metaMaskNetworkId } = useSelector((state: any) => {
    return {
      metaMaskNetworkId: state.globalModule.metaMaskNetworkId,
    };
  });

  useEffect(() => {
    if (props.match.params && props.match.params.fromType && props.match.params.destType) {
      if (
        props.match.params.fromType !== 'native' &&
        props.match.params.fromType !== 'erc20' &&
        props.match.params.fromType !== 'bep20' &&
        props.match.params.fromType !== 'default'
      ) {
        returnToAsset();
        return;
      }
      if (
        props.match.params.destType !== 'native' &&
        props.match.params.destType !== 'erc20' &&
        props.match.params.destType !== 'bep20' &&
        props.match.params.destType !== 'default'
      ) {
        returnToAsset();
        return;
      }
      if (props.match.params.fromType === props.match.params.destType) {
        returnToAsset();
        return;
      }
      if (
        (props.match.params.fromType === 'erc20' && props.match.params.destType === 'bep20') ||
        (props.match.params.fromType === 'bep20' && props.match.params.destType === 'erc20')
      ) {
        returnToAsset();
        return;
      }

      const fromData = assetDatas.find((item) => item.type == props.match.params.fromType);
      setFromTypeData(fromData);
      const destData = assetDatas.find((item) => item.type == props.match.params.destType);
      setDestTypeData(destData);
    } else {
      returnToAsset();
    }
  }, [props.match.params && props.match.params.fromType && props.match.params.destType]);

  useEffect(() => {
    dispatch(bridgeCommon_ChainFees());
    dispatch(getBridgeEstimateEthFee());
  }, []);

  useEffect(() => {
    if (fisAccount && fisAccount.address) {
      dispatch(reloadData());
      dispatch(query_rBalances_account());
      dispatch(fis_query_rBalances_account());
      dispatch(dot_query_rBalances_account());
      dispatch(atom_query_rBalances_account());
      dispatch(sol_query_rBalances_account());
      dispatch(matic_query_rBalances_account());
      dispatch(ksm_rTokenRate());
      dispatch(fis_rTokenRate());
      dispatch(dot_rTokenRate());
      dispatch(atom_rTokenRate());
      dispatch(sol_rTokenRate());
      dispatch(matic_rTokenRate());
      dispatch(getUnbondCommission());
      dispatch(fis_getUnbondCommission());
      dispatch(dot_getUnbondCommission());
      dispatch(atom_getUnbondCommission());
      dispatch(sol_getUnbondCommission());
      dispatch(matic_getUnbondCommission());
    }
  }, [reloadFlag, fisAccount && fisAccount.address]);

  useEffect(() => {
    console.log(props.match.params.fromType);
    console.log(props.match.params.destType);
    if (
      props.match.params &&
      (props.match.params.fromType == 'erc20' || props.match.params.destType == 'erc20') &&
      ethAccount &&
      ethAccount.address
    ) {
      dispatch(handleEthAccount(ethAccount.address));
      dispatch(getErc20Allowances());
      dispatch(getAssetBalanceAll());
      dispatch(eth_Monitoring_Method());
    }
    if (
      props.match.params &&
      (props.match.params.fromType == 'bep20' || props.match.params.destType == 'bep20') &&
      bscAccount &&
      bscAccount.address
    ) {
      dispatch(handleBscAccount(bscAccount.address));
      dispatch(getBep20Allowances());
      dispatch(getBep20AssetBalanceAll());
      dispatch(bsc_Monitoring_Method());
    }
  }, [
    reloadFlag,
    metaMaskNetworkId,
    props.match.params && props.match.params.fromType,
    props.match.params && props.match.params.destType,
    ethAccount && ethAccount.address,
    bscAccount && bscAccount.address,
  ]);

  useEffect(() => {
    if (props.location.state) {
      if (selectDataSource.length > 0) {
        const data = selectDataSource.find((item) => item.title == props.location.state.rSymbol);
        setTokenType({ ...data });
      }
    } else {
      setTokenType(selectDataSource[0]);
    }
  }, [props.location.state, selectDataSource]);

  useEffect(() => {
    selectDataSource[0].content = fis_balance;
    selectDataSource[1].content = rfis_balance;
    selectDataSource[2].content = rdot_balance;
    selectDataSource[3].content = rksm_balance;
    selectDataSource[4].content = ratom_balance;
    selectDataSource[5].content = rsol_balance;
    selectDataSource[6].content = rmatic_balance;
    setSelectDataSource([...selectDataSource]);

    if ((tokenType.title = 'FIS')) {
      tokenType.content = fis_balance;
    } else if ((tokenType.title = 'rFIS')) {
      tokenType.content = rfis_balance;
    } else if ((tokenType.title = 'rKSM')) {
      tokenType.content = rksm_balance;
    } else if ((tokenType.title = 'rDOT')) {
      tokenType.content = rdot_balance;
    } else if ((tokenType.title = 'rATOM')) {
      tokenType.content = ratom_balance;
    } else if ((tokenType.title = 'rSOL')) {
      tokenType.content = rsol_balance;
    } else if ((tokenType.title = 'rMATIC')) {
      tokenType.content = rmatic_balance;
    }
    setTokenType({ ...tokenType });
  }, [rksm_balance, rfis_balance, fis_balance, rdot_balance, ratom_balance]);

  useEffect(() => {
    if (fromTypeData) {
      if (props.match.params && props.match.params.fromType !== fromTypeData.type) {
        const destType = destTypeData ? destTypeData.type : 'default';
        props.history.push({
          pathname: `/rAsset/swap/${fromTypeData.type}/${destType}`,
          state: {
            rSymbol: tokenType && tokenType.title,
          },
        });
      }
      if (fromTypeData.type === 'native') {
        setFromTypeSelections([assetDatas[0]]);
      } else {
        setFromTypeSelections([assetDatas[1], assetDatas[2]]);
      }
    } else {
      setFromTypeSelections([assetDatas[1], assetDatas[2]]);
    }

    if (destTypeData) {
      if (props.match.params && props.match.params.destType !== destTypeData.type) {
        const fromType = fromTypeData ? fromTypeData.type : 'default';
        props.history.push({
          pathname: `/rAsset/swap/${fromType}/${destTypeData.type}`,
          state: {
            rSymbol: tokenType && tokenType.title,
          },
        });
      }
      if (destTypeData.type === 'native') {
        setDestTypeSelections([assetDatas[0]]);
      } else {
        setDestTypeSelections([assetDatas[1], assetDatas[2]]);
      }
    } else {
      setDestTypeSelections([assetDatas[1], assetDatas[2]]);
    }
  }, [fromTypeData && fromTypeData.type, destTypeData && destTypeData.type]);

  useEffect(() => {}, [destTypeData && destTypeData.type]);

  const reverseExchangeType = () => {
    const oldFromTypeData = fromTypeData;
    setFromTypeData(destTypeData);
    setDestTypeData(oldFromTypeData);
    setFormAmount('');
    setAddress('');
  };

  if (fromTypeData && fromTypeData.type == 'native' && (!fisAccount || !fisAccount.address)) {
    props.history.push('/rAsset/native');
    return null;
  }

  if (fromTypeData && fromTypeData.type == 'erc20' && (!ethAccount || !ethAccount.address)) {
    props.history.push('/rAsset/eth');
    return null;
  }

  if (fromTypeData && fromTypeData.type == 'bep20' && (!bscAccount || !bscAccount.address)) {
    props.history.push('/rAsset/bep');
    return null;
  }

  const checkAddress = (address: string) => {
    return fis_checkAddress(address);
  };

  const returnToAsset = () => {
    props.history.push('/rAsset/native');
  };

  return (
    <Content className='stafi_rasset_swap '>
      <Back
        top={'40px'}
        left={'50px'}
        onClick={() => {
          props.history && props.history.push('/rAsset/native');
        }}
      />
      <div className={'title_container'}>
        <Title label='rBridge Swap' padding={'30px 0'} />
      </div>

      <div>
        <div className='row' style={{ marginBottom: 0 }}>
          <div className={'asset_selector_container'}>
            <div className={'selector_container'}>
              <TypeSelector
                popTitle={'Select a Chain'}
                selectDataSource={fromTypeSelections}
                selectedData={fromTypeData}
                selectedTitle={fromTypeData ? fromTypeData.content : ''}
                selectedDescription={fromTypeData ? fromTypeData.title : 'Choose a token standard'}
                onSelectChange={(e: SelectorType) => {
                  setFormAmount('');
                  setAddress('');
                  setFromTypeData(e);
                }}
              />
            </div>

            <div>
              {/* <img className={"arrow_icon"} src={right_arrow_solid} /> */}
              <div>
                <a onClick={reverseExchangeType}>
                  <img className={'exchange_icon'} src={exchange_svg} />
                </a>
              </div>
            </div>

            <div className={'selector_container'}>
              <TypeSelector
                popTitle={'Select a Chain'}
                selectDataSource={destTypeSelections}
                selectedData={destTypeData}
                selectedTitle={destTypeData ? destTypeData.content : ''}
                selectedDescription={destTypeData ? destTypeData.title : 'Choose a token standard'}
                onSelectChange={(e: SelectorType) => {
                  setFormAmount('');
                  setAddress('');
                  setDestTypeData(e);
                }}
              />
            </div>
          </div>

          <div style={{ marginTop: '15px' }}>
            <TypeSelector
              popTitle={fromTypeData ? 'Select a ' + fromTypeData.type + ' rToken' : ''}
              selectDataSource={selectDataSource}
              selectedData={tokenType}
              selectedTitle={tokenType ? tokenType.title : ''}
              onSelectChange={(e: SelectorType) => {
                setFormAmount('');
                setAddress('');
                setTokenType({ ...e });
              }}
            />
          </div>

          <div className={'input_container'} style={{ marginTop: '20px' }}>
            <div className={'title'}>Swap Amount</div>
            <AmountInputEmbed
              maxInput={tokenType.content !== '--' ? tokenType.content : 0}
              placeholder='0.0'
              value={fromAoumt}
              onChange={(value: any) => {
                setFormAmount(value);
              }}
            />
          </div>

          <div className={'input_container'} style={{ marginTop: '20px' }}>
            <div className={'title'}>Received Address</div>
            <AddressInputEmbed
              placeholder='0x...'
              value={address}
              onChange={(e: any) => {
                setAddress(e.target.value);
              }}
            />
          </div>
        </div>

        <div
          className={`row last link_container ${address && 'show_tip'}`}
          style={{ marginBottom: '4px', marginTop: '4px' }}>
          {address && destTypeData && destTypeData.type == 'native' && (
            <div className='tip'>
              Click on this{' '}
              <a href={clickSwapToNativeLink(address)} target='_blank'>
                link
              </a>{' '}
              to check your swap status.
            </div>
          )}
          {address && destTypeData && destTypeData.type == 'erc20' && (
            <div className='tip'>
              Click on this{' '}
              <a href={clickSwapToErc20Link(tokenType.title, address)} target='_blank'>
                link
              </a>{' '}
              to check your swap status.
            </div>
          )}
          {address && destTypeData && destTypeData.type == 'bep20' && (
            <div className='tip'>
              Click on this{' '}
              <a href={clickSwapToBep20Link(tokenType.title, address)} target='_blank'>
                link
              </a>{' '}
              to check your swap status.
            </div>
          )}
        </div>

        <div className='fee'>
          {fromTypeData && fromTypeData.type === 'erc20' && `Estimate Fee: ${estimateEthFee} ETH`}

          {fromTypeData && fromTypeData.type === 'bep20' && `Estimate Fee: ${estimateBscFee} BNB`}

          {fromTypeData &&
            fromTypeData.type === 'native' &&
            destTypeData &&
            destTypeData.type === 'erc20' &&
            `Estimate Fee: ${erc20EstimateFee} FIS`}

          {fromTypeData &&
            fromTypeData.type === 'native' &&
            destTypeData &&
            destTypeData.type === 'bep20' &&
            `Estimate Fee: ${bep20EstimateFee} FIS`}
        </div>

        <div className='btns'>
          <Button
            disabled={
              !(
                fromAoumt &&
                address &&
                fromTypeData &&
                destTypeData &&
                (fromTypeData.type === 'native' ||
                  (fromTypeData.type === 'erc20' && config.metaMaskNetworkIsEth(metaMaskNetworkId)) ||
                  (fromTypeData.type === 'bep20' && config.metaMaskNetworkIsBsc(metaMaskNetworkId)))
              )
            }
            onClick={() => {
              if (fromTypeData && fromTypeData.type === 'erc20') {
                if (!ethAccount || Number(ethAccount.balance) <= Number(estimateEthFee)) {
                  message.error(`No enough ETH to pay for the fee`);
                  return;
                }
                if (!checkAddress(address)) {
                  message.error('Input address error');
                  return;
                }
              }
              if (fromTypeData && fromTypeData.type === 'bep20') {
                if (!bscAccount || Number(bscAccount.balance) <= Number(estimateBscFee)) {
                  message.error(`No enough BNB to pay for the fee`);
                  return;
                }
                if (!checkAddress(address)) {
                  message.error('Input address error');
                  return;
                }
              }
              if (fromTypeData && fromTypeData.type === 'native' && destTypeData && destTypeData.type === 'erc20') {
                if (Number(fis_balance) <= Number(erc20EstimateFee)) {
                  message.error(`No enough FIS to pay for the fee`);
                  return;
                }
                if (!checkEthAddress(address)) {
                  message.error('Input address error');
                  return;
                }
              }
              if (fromTypeData && fromTypeData.type === 'native' && destTypeData && destTypeData.type === 'bep20') {
                if (Number(fis_balance) <= Number(bep20EstimateFee)) {
                  message.error(`No enough FIS to pay for the fee`);
                  return;
                }
                if (!checkEthAddress(address)) {
                  message.error('Input address error');
                  return;
                }
              }

              if (fromTypeData && fromTypeData.type === 'native') {
                let chainId = ETH_CHAIN_ID;
                if (destTypeData && destTypeData.type === 'bep20') {
                  chainId = BSC_CHAIN_ID;
                }
                dispatch(
                  nativeToOtherSwap(chainId, tokenType.title, tokenType.type, fromAoumt, address, () => {
                    setTransferDetail(
                      `${fromAoumt} ${tokenType && tokenType.title} ${fromTypeData && fromTypeData.content}`,
                    );
                    if (destTypeData && destTypeData.type === 'erc20') {
                      setViewTxUrl(config.etherScanErc20TxInAddressUrl(address));
                    } else {
                      setViewTxUrl(config.bscScanBep20TxInAddressUrl(address));
                    }

                    setFormAmount('');
                    setAddress('');
                    setReloadFlag(reloadFlag + 1);
                    setTransferringModalVisible(true);
                  }),
                );
              } else {
                // bep20ToNativeSwap
                let swapFun;
                if (fromTypeData && fromTypeData.type === 'erc20') {
                  swapFun = erc20ToNativeSwap;
                } else if (fromTypeData && fromTypeData.type === 'bep20') {
                  swapFun = bep20ToNativeSwap;
                }
                if (swapFun) {
                  dispatch(
                    swapFun(tokenType.title, tokenType.type, fromAoumt, address, () => {
                      setTransferDetail(
                        `${fromAoumt} ${tokenType && tokenType.title} ${fromTypeData && fromTypeData.content}`,
                      );
                      setViewTxUrl(config.stafiScanUrl(address));
                      setFormAmount('');
                      setAddress('');
                      setReloadFlag(reloadFlag + 1);
                      setTransferringModalVisible(true);
                    }),
                  );
                }
              }
            }}>
            Swap
          </Button>
        </div>
      </div>

      <SwapLoading
        visible={transferringModalVisible}
        destChainName={destTypeData && destTypeData.title}
        transferDetail={transferDetail}
        viewTxUrl={viewTxUrl}
        onClose={() => setTransferringModalVisible(false)}
      />
    </Content>
  );
}
