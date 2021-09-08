import SwapLoading from '@components/modal/SwapLoading';
import config from '@config/index';
import {
  bep20ToOtherSwap,
  bridgeCommon_ChainFees,
  BSC_CHAIN_ID,
  erc20ToOtherSwap,
  ETH_CHAIN_ID,
  getBridgeEstimateEthFee,
  nativeToOtherSwap,
  STAFI_CHAIN_ID
} from '@features/bridgeClice';
import {
  getAssetBalanceAll as getBep20AssetBalanceAll,
  getBep20Allowances,
  handleBscAccount,
  monitoring_Method as bsc_Monitoring_Method
} from '@features/BSCClice';
import { getAssetBalanceAll, getErc20Allowances } from '@features/ETHClice';
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
import { checkEthAddress, get_eth_getBalance, monitoring_Method as eth_Monitoring_Method } from '@features/rETHClice';
import { getUnbondCommission, query_rBalances_account, rTokenRate as ksm_rTokenRate } from '@features/rKSMClice';
import {
  getUnbondCommission as matic_getUnbondCommission,
  query_rBalances_account as matic_query_rBalances_account,
  rTokenRate as matic_rTokenRate
} from '@features/rMATICClice';
// import {
//   getUnbondCommission as sol_getUnbondCommission,
//   query_rBalances_account as sol_query_rBalances_account,
//   rTokenRate as sol_rTokenRate
// } from '@features/rSOLClice';
import bsc_white from '@images/bsc_white.svg';
import eth_white from '@images/eth_white.svg';
import exchange_svg from '@images/exchange.svg';
import rasset_fis_svg from '@images/rFIS.svg';
// import rasset_rsol_svg from '@images/rSOL.svg';
import rasset_ratom_svg from '@images/r_atom.svg';
import rasset_rbnb_svg from '@images/r_bnb.svg';
import rasset_rdot_svg from '@images/r_dot.svg';
import rasset_reth_svg from '@images/r_eth.svg';
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
import { useInterval } from '@util/utils';
import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import './index.scss';

type SelectorType = {
  icon: any;
  title: string;
  content: string;
  type: string;
};

const allTokenDatas = [
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
    icon: rasset_reth_svg,
    title: 'rETH',
    content: '--',
    type: 'reth',
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
  // {
  //   icon: rasset_rsol_svg,
  //   title: 'rSOL',
  //   content: '--',
  //   type: 'rsol',
  // },
  {
    icon: rasset_rmatic_svg,
    title: 'rMATIC',
    content: '--',
    type: 'rmatic',
  },
  {
    icon: rasset_rbnb_svg,
    title: 'rBNB',
    content: '--',
    type: 'rbnb',
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
  let time: any;
  const dispatch = useDispatch();
  let { fromType, destType } = useParams<any>();
  const history = useHistory();
  const location = useLocation();
  const [fromAoumt, setFormAmount] = useState<any>();
  const [selectDataSource, setSelectDataSource] = useState(allTokenDatas);
  const [tokenType, setTokenType] = useState(allTokenDatas[0]);
  const [address, setAddress] = useState<any>();

  const [fromTypeData, setFromTypeData] = useState<undefined | SelectorType>();
  const [fromTypeSelections, setFromTypeSelections] = useState(assetDatas);
  const [destTypeData, setDestTypeData] = useState<undefined | SelectorType>();
  const [destTypeSelections, setDestTypeSelections] = useState(assetDatas);

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
    reth_balance,
    rbnb_balance,
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
        reth_balance: NumberUtil.handleFisAmountToFixed(state.ETHModule.ercETHBalance),
        rbnb_balance: NumberUtil.handleFisAmountToFixed(0),
        estimateEthFee: state.bridgeModule.estimateEthFee,
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
        reth_balance: NumberUtil.handleFisAmountToFixed(state.BSCModule.bepRETHBalance),
        rbnb_balance: NumberUtil.handleFisAmountToFixed(0),
        estimateBscFee: state.bridgeModule.estimateBscFee,
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
        rbnb_balance: NumberUtil.handleFisAmountToFixed(0),
        erc20EstimateFee: state.bridgeModule.erc20EstimateFee,
        bep20EstimateFee: state.bridgeModule.bep20EstimateFee,
      };
    }
  });

  const { fisAccount, ethAccount, bscAccount } = useSelector((state: any) => {
    return {
      fisAccount: state.FISModule.fisAccount,
      ethAccount: state.rETHModule.ethAccount,
      bscAccount: state.BSCModule.bscAccount,
    };
  });

  const { metaMaskNetworkId } = useSelector((state: any) => {
    return {
      metaMaskNetworkId: state.globalModule.metaMaskNetworkId,
    };
  });

  useEffect(() => {
    if (fromType && destType) {
      if (fromType !== 'native' && fromType !== 'erc20' && fromType !== 'bep20' && fromType !== 'default') {
        returnToAsset();
        return;
      }
      if (destType !== 'native' && destType !== 'erc20' && destType !== 'bep20' && destType !== 'default') {
        returnToAsset();
        return;
      }
      if (fromType === destType) {
        returnToAsset();
        return;
      }

      const fromData = assetDatas.find((item) => item.type == fromType);
      setFromTypeData(fromData);
      const destData = assetDatas.find((item) => item.type == destType);
      setDestTypeData(destData);
    } else {
      returnToAsset();
    }
  }, [fromType, destType]);

  useEffect(() => {
    dispatch(bridgeCommon_ChainFees());
    dispatch(getBridgeEstimateEthFee());
  }, []);

  useEffect(() => {
    updateFisData();
  }, [fisAccount && fisAccount.address]);

  useEffect(() => {
    updateErcBepData();
  }, [metaMaskNetworkId, fromType, destType, ethAccount && ethAccount.address, bscAccount && bscAccount.address]);

  useEffect(() => {
    if (location.state) {
      if (selectDataSource.length > 0) {
        const data = selectDataSource.find((item) => item.title == location.state.rSymbol);
        if (data) {
          setTokenType({ ...data });
        } else {
          setTokenType(null);
        }
      }
    } else {
      setTokenType(null);
    }
  }, [location.state && location.state.rSymbol, selectDataSource]);

  useEffect(() => {
    allTokenDatas.forEach((item: any) => {
      if (item.type === 'fis') {
        item.content = fis_balance;
      }
      if (item.type === 'rfis') {
        item.content = rfis_balance;
      }
      if (item.type === 'reth') {
        item.content = reth_balance;
      }
      if (item.type === 'rdot') {
        item.content = rdot_balance;
      }
      if (item.type === 'rksm') {
        item.content = rksm_balance;
      }
      if (item.type === 'ratom') {
        item.content = ratom_balance;
      }
      if (item.type === 'rsol') {
        item.content = rsol_balance;
      }
      if (item.type === 'rmatic') {
        item.content = rmatic_balance;
      }
      if (item.type === 'rbnb') {
        item.content = rbnb_balance;
      }
    });
    let filterTokenDatas;
    if ((fromType === 'native' && destType === 'erc20') || (fromType === 'erc20' && destType === 'native')) {
      filterTokenDatas = allTokenDatas.filter((item: any) => {
        return item.type !== 'reth' && item.type !== 'rbnb';
      });
    } else if ((fromType === 'erc20' && destType === 'bep20') || (fromType === 'bep20' && destType === 'erc20')) {
      filterTokenDatas = allTokenDatas.filter((item: any) => {
        return item.type !== 'fis';
      });
    } else {
      filterTokenDatas = allTokenDatas.filter((item: any) => {
        return item.type !== 'reth' && item.type !== 'fis';
      });
    }

    setSelectDataSource([...filterTokenDatas]);

    if (tokenType) {
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
      } else if ((tokenType.title = 'rETH')) {
        tokenType.content = reth_balance;
      }
      setTokenType({ ...tokenType });
    }
  }, [
    fromType,
    destType,
    rksm_balance,
    rfis_balance,
    fis_balance,
    reth_balance,
    rdot_balance,
    ratom_balance,
    rsol_balance,
    rmatic_balance,
  ]);

  useEffect(() => {
    if (time) {
      clearInterval(time);
    }
  }, [fromTypeData && fromTypeData.type, destTypeData && destTypeData.type]);

  useInterval(() => {
    updateData();
  }, 30000);

  const updateData = () => {
    if (fromTypeData && fromTypeData.type === 'native') {
      updateFisData();
    } else {
      updateErcBepData();
    }
  };

  const updateFisData = () => {
    if (fisAccount && fisAccount.address) {
      dispatch(reloadData());
      dispatch(query_rBalances_account());
      dispatch(fis_query_rBalances_account());
      dispatch(dot_query_rBalances_account());
      dispatch(atom_query_rBalances_account());
      // dispatch(sol_query_rBalances_account());
      dispatch(matic_query_rBalances_account());
      dispatch(ksm_rTokenRate());
      dispatch(fis_rTokenRate());
      dispatch(dot_rTokenRate());
      dispatch(atom_rTokenRate());
      // dispatch(sol_rTokenRate());
      dispatch(matic_rTokenRate());
      dispatch(getUnbondCommission());
      dispatch(fis_getUnbondCommission());
      dispatch(dot_getUnbondCommission());
      dispatch(atom_getUnbondCommission());
      // dispatch(sol_getUnbondCommission());
      dispatch(matic_getUnbondCommission());
    }
  };

  const updateErcBepData = () => {
    if (fromType == 'erc20' && ethAccount && ethAccount.address) {
      dispatch(get_eth_getBalance());
      dispatch(getErc20Allowances());
      dispatch(getAssetBalanceAll());
      dispatch(eth_Monitoring_Method());
    }
    if (fromType == 'bep20' && bscAccount && bscAccount.address) {
      dispatch(handleBscAccount(bscAccount.address));
      dispatch(getBep20Allowances());
      dispatch(getBep20AssetBalanceAll());
      dispatch(bsc_Monitoring_Method());
    }
  };

  const reverseExchangeType = () => {
    history.push(
      `/rAsset/swap/${destTypeData ? destTypeData.type : 'default'}/${fromTypeData ? fromTypeData.type : 'default'}`,
      {
        rSymbol: tokenType && tokenType.title,
      },
    );

    setFormAmount('');
    setAddress('');
  };

  if (fromTypeData && fromTypeData.type == 'native' && (!fisAccount || !fisAccount.address)) {
    history.push('/rAsset/native');
    return null;
  }

  if (fromTypeData && fromTypeData.type == 'erc20' && (!ethAccount || !ethAccount.address)) {
    history.push('/rAsset/eth');
    return null;
  }

  if (fromTypeData && fromTypeData.type == 'bep20' && (!bscAccount || !bscAccount.address)) {
    history.push('/rAsset/bep');
    return null;
  }

  const checkAddress = (address: string) => {
    return fis_checkAddress(address);
  };

  const returnToAsset = () => {
    history.push('/rAsset/native');
  };

  const changeFromChain = (type: SelectorType) => {
    if (!type) {
      return;
    }
    if (destTypeData && type.type === destTypeData.type) {
      reverseExchangeType();
      return;
    }
    setFormAmount('');
    setAddress('');
    history.push(`/rAsset/swap/${type.type}/${destType}`, {
      rSymbol: tokenType && tokenType.title,
    });
  };

  const changeDestChain = (type: SelectorType) => {
    if (!type) {
      return;
    }
    if (fromTypeData && type.type === fromTypeData.type) {
      reverseExchangeType();
      return;
    }
    setFormAmount('');
    setAddress('');
    history.push(`/rAsset/swap/${fromType}/${type.type}`, {
      rSymbol: tokenType && tokenType.title,
    });
  };

  return (
    <Content className='stafi_rasset_swap '>
      <Back
        top={'40px'}
        left={'50px'}
        onClick={() => {
          history.push('/rAsset/native');
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
                onSelectChange={changeFromChain}
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
                onSelectChange={changeDestChain}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className={'title'}>Swap Amount</div>
              <div className={'balance_amount'}>
                Balance: {tokenType && tokenType.content !== '--' ? tokenType.content : '--'}
              </div>
            </div>

            <AmountInputEmbed
              maxInput={tokenType && tokenType.content !== '--' ? tokenType.content : 0}
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
              placeholder={destType === 'native' ? '...' : '0x...'}
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
          {/* {address && destTypeData && destTypeData.type == 'native' && tokenType && (
            <div className='tip'>
              Click on this{' '}
              <a href={clickSwapToNativeLink(address)} target='_blank'>
                link
              </a>{' '}
              to check your swap status.
            </div>
          )}
          {address && destTypeData && destTypeData.type == 'erc20' && tokenType && (
            <div className='tip'>
              Click on this{' '}
              <a href={clickSwapToErc20Link(tokenType.title, address)} target='_blank'>
                link
              </a>{' '}
              to check your swap status.
            </div>
          )}
          {address && destTypeData && destTypeData.type == 'bep20' && tokenType && (
            <div className='tip'>
              Click on this{' '}
              <a href={clickSwapToBep20Link(tokenType.title, address)} target='_blank'>
                link
              </a>{' '}
              to check your swap status.
            </div>
          )} */}
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
                  (fromTypeData.type === 'erc20' && config.metaMaskNetworkIsGoerliEth(metaMaskNetworkId)) ||
                  (fromTypeData.type === 'bep20' && config.metaMaskNetworkIsBsc(metaMaskNetworkId)))
              )
            }
            onClick={() => {
              if (!tokenType) {
                return;
              }
              if (!fromTypeData || !destTypeData) {
                message.error(`Please select chain to transfer`);
                return;
              }
              if (fromTypeData && fromTypeData.type === 'erc20') {
                if (!ethAccount || Number(ethAccount.balance) <= Number(estimateEthFee)) {
                  message.error(`No enough ETH to pay for the fee`);
                  return;
                }
              }
              if (fromTypeData && fromTypeData.type === 'bep20') {
                if (!bscAccount || Number(bscAccount.balance) <= Number(estimateBscFee)) {
                  message.error(`No enough BNB to pay for the fee`);
                  return;
                }
              }
              if (fromTypeData.type === 'native' && destTypeData && destTypeData.type === 'erc20') {
                if (Number(fis_balance) <= Number(erc20EstimateFee)) {
                  message.error(`No enough FIS to pay for the fee`);
                  return;
                }
              }
              if (fromTypeData.type === 'native' && destTypeData && destTypeData.type === 'bep20') {
                if (Number(fis_balance) <= Number(bep20EstimateFee)) {
                  message.error(`No enough FIS to pay for the fee`);
                  return;
                }
              }
              if (destTypeData.type === 'erc20' || destTypeData.type === 'bep20') {
                if (!checkEthAddress(address)) {
                  message.error('Input address error');
                  return;
                }
              }
              if (destTypeData.type === 'native') {
                if (!checkAddress(address)) {
                  message.error('Input address error');
                  return;
                }
              }

              if (destTypeData && destTypeData.type === 'erc20') {
                setViewTxUrl(config.etherScanErc20TxInAddressUrl(address));
              } else if (destTypeData && destTypeData.type === 'bep20') {
                setViewTxUrl(config.bscScanBep20TxInAddressUrl(address));
              } else {
                setViewTxUrl(config.stafiScanUrl(address));
              }
              setTransferDetail(`${fromAoumt} ${tokenType && tokenType.title} ${fromTypeData && fromTypeData.content}`);

              if (fromTypeData && fromTypeData.type === 'native') {
                let chainId = ETH_CHAIN_ID;
                if (destTypeData && destTypeData.type === 'bep20') {
                  chainId = BSC_CHAIN_ID;
                }
                dispatch(
                  nativeToOtherSwap(chainId, tokenType.title, tokenType.type, fromAoumt, address, () => {
                    setFormAmount('');
                    setAddress('');
                    updateData();
                  }),
                );
              } else {
                let swapFun;
                let destChainId;
                if (fromTypeData && fromTypeData.type === 'erc20') {
                  swapFun = erc20ToOtherSwap;
                } else if (fromTypeData && fromTypeData.type === 'bep20') {
                  swapFun = bep20ToOtherSwap;
                }
                if (destTypeData.type === 'erc20') {
                  destChainId = ETH_CHAIN_ID;
                } else if (destTypeData.type === 'bep20') {
                  destChainId = BSC_CHAIN_ID;
                } else {
                  destChainId = STAFI_CHAIN_ID;
                }

                if (swapFun) {
                  dispatch(
                    swapFun(destChainId, tokenType.title, tokenType.type, fromAoumt, address, () => {
                      setFormAmount('');
                      setAddress('');
                      updateData();
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
        destChainName={destTypeData && destTypeData.title}
        destChainType={destTypeData && destTypeData.type}
        transferDetail={transferDetail}
        viewTxUrl={viewTxUrl}
      />
    </Content>
  );
}
