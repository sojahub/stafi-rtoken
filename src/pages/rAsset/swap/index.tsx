import { Connection } from '@solana/web3.js';
import { message } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useHistory, useLocation, useParams } from 'react-router-dom';
import bsc_white from 'src/assets/images/bsc_white.svg';
import eth_white from 'src/assets/images/eth_white.svg';
import exchange_svg from 'src/assets/images/exchange.svg';
import rasset_fis_svg from 'src/assets/images/rFIS.svg';
import rasset_rsol_svg from 'src/assets/images/rSOL.svg';
import rasset_ratom_svg from 'src/assets/images/r_atom.svg';
import rasset_rbnb_svg from 'src/assets/images/r_bnb.svg';
import rasset_rdot_svg from 'src/assets/images/r_dot.svg';
import rasset_reth_svg from 'src/assets/images/r_eth.svg';
import rasset_rfis_svg from 'src/assets/images/r_fis.svg';
import rasset_rksm_svg from 'src/assets/images/r_ksm.svg';
import rasset_rmatic_svg from 'src/assets/images/r_matic.svg';
import solana_white from 'src/assets/images/solana_white.svg';
import stafi_white from 'src/assets/images/stafi_white.svg';
import SwapLoading from 'src/components/modal/SwapLoading';
import config, { getRsymbolByTokenType } from 'src/config/index';
import {
  bep20ToOtherSwap,
  bridgeCommon_ChainFees,
  BSC_CHAIN_ID,
  erc20ToOtherSwap,
  ETH_CHAIN_ID,
  getBridgeEstimateEthFee,
  nativeToOtherSwap,
  slp20ToOtherSwap,
  SOL_CHAIN_ID,
  STAFI_CHAIN_ID,
} from 'src/features/bridgeClice';
import { getAssetBalanceAll as getBep20AssetBalanceAll, getBep20Allowances } from 'src/features/BSCClice';
import { getAssetBalanceAll, getErc20Allowances } from 'src/features/ETHClice';
import {
  checkAddress as fis_checkAddress,
  getUnbondCommission as fis_getUnbondCommission,
  query_rBalances_account as fis_query_rBalances_account,
  reloadData,
  rTokenRate as fis_rTokenRate,
} from 'src/features/FISClice';
import { setLoading } from 'src/features/globalClice';
import {
  getUnbondCommission as atom_getUnbondCommission,
  query_rBalances_account as atom_query_rBalances_account,
  rTokenRate as atom_rTokenRate,
} from 'src/features/rATOMClice';
import {
  getUnbondCommission as bnb_getUnbondCommission,
  query_rBalances_account as bnb_query_rBalances_account,
  rTokenRate as bnb_rTokenRate,
} from 'src/features/rBNBClice';
import {
  getUnbondCommission as dot_getUnbondCommission,
  query_rBalances_account as dot_query_rBalances_account,
  rTokenRate as dot_rTokenRate,
} from 'src/features/rDOTClice';
import {
  checkEthAddress,
  getNativeRethAmount,
  nativerTokenRate,
  getUnbondCommission as eth_getUnbondCommission,
} from 'src/features/rETHClice';
import { getUnbondCommission, query_rBalances_account, rTokenRate as ksm_rTokenRate } from 'src/features/rKSMClice';
import {
  getUnbondCommission as matic_getUnbondCommission,
  query_rBalances_account as matic_query_rBalances_account,
  rTokenRate as matic_rTokenRate,
} from 'src/features/rMATICClice';
import {
  checkAddress as checkSOLAddress,
  earglyConnectPhantom,
  getUnbondCommission as sol_getUnbondCommission,
  queryBalance as solQueryBalance,
  query_rBalances_account as sol_query_rBalances_account,
  rTokenRate as sol_rTokenRate,
} from 'src/features/rSOLClice';
import { getSlp20Allowances, getSlp20AssetBalanceAll } from 'src/features/SOLClice';
import { useMetaMaskAccount } from 'src/hooks/useMetaMaskAccount';
import { rSymbol } from 'src/keyring/defaults';
import SolServer from 'src/servers/sol';
import Back from 'src/shared/components/backIcon';
import Button from 'src/shared/components/button/button';
import Title from 'src/shared/components/cardTitle';
import Content from 'src/shared/components/content';
import AddressInputEmbed from 'src/shared/components/input/addressInputEmbed';
import AmountInputEmbed from 'src/shared/components/input/amountInputEmbed';
import TypeSelector from 'src/shared/components/input/typeSelector';
import numberUtil from 'src/util/numberUtil';
import NumberUtil from 'src/util/numberUtil';
import { useInterval } from 'src/util/utils';
import './index.scss';

const splToken = require('@solana/spl-token');

const solServer = new SolServer();

type SelectorType = {
  icon: any;
  title: string;
  content: string;
  type: string;
};

const chainSupportTokenMap = {
  'native-erc20': ['fis', 'rfis', 'reth', 'rdot', 'rksm', 'ratom', 'rmatic'],
  'erc20-native': ['fis', 'rfis', 'reth', 'rdot', 'rksm', 'ratom', 'rmatic'],
  'native-bep20': ['rfis', 'reth', 'rdot', 'rksm', 'ratom', 'rmatic', 'rbnb'],
  'bep20-native': ['rfis', 'reth', 'rdot', 'rksm', 'ratom', 'rmatic', 'rbnb'],
  'native-spl': ['fis', 'rsol'],
  'spl-native': ['fis', 'rsol'],
};

const tokenSupportChainMap = {
  fis: ['native', 'erc20', 'spl'],
  rfis: ['native', 'erc20', 'bep20'],
  reth: ['native', 'erc20', 'bep20'],
  rdot: ['native', 'erc20', 'bep20'],
  rksm: ['native', 'erc20', 'bep20'],
  ratom: ['native', 'erc20', 'bep20'],
  rmatic: ['native', 'erc20', 'bep20'],
  rbnb: ['native', 'bep20'],
  rsol: ['native', 'spl'],
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
  {
    icon: solana_white,
    title: 'Solana',
    content: 'SPL',
    type: 'spl',
  },
];

export default function Index(props: any) {
  let time: any;
  const dispatch = useDispatch();
  let { rToken: rTokenParam } = useParams<any>();
  const history = useHistory();
  const location = useLocation();
  const [fromAoumt, setFormAmount] = useState<any>();
  const [selectDataSource, setSelectDataSource] = useState(allTokenDatas);
  const [address, setAddress] = useState<any>();

  const [tokenRefState, setTokenRefState] = useState<SelectorType>(allTokenDatas[0]);
  const [fromChainRefState, setFromChainRefState] = useState<SelectorType | null>(null);
  const [destChainRefState, setDestChainRefState] = useState<SelectorType | null>(null);

  const tokenRef = useRef<SelectorType>(tokenRefState);
  const fromChainRef = useRef<SelectorType | null>(fromChainRefState);
  const destChainRef = useRef<SelectorType | null>(destChainRefState);

  useEffect(() => {
    tokenRef.current = tokenRefState;
    fromChainRef.current = fromChainRefState;
    destChainRef.current = destChainRefState;
  });

  const returnToAsset = useCallback(() => {
    history.push('/rAsset/home/native');
  }, [history]);

  useEffect(() => {
    console.log('rTokenParam', rTokenParam);
    const tokenData = allTokenDatas.find((item) => item.type === rTokenParam.toLowerCase());
    if (!tokenData) {
      returnToAsset();
    } else {
      setTokenRefState(tokenData);
    }
  }, [rTokenParam, returnToAsset]);

  // const [fromTypeData, setFromTypeData] = useState<null | SelectorType>(null);
  // const [destTypeData, setDestTypeData] = useState<null | SelectorType>(null);
  const [fromTypeSelections, setFromTypeSelections] = useState(assetDatas);
  const [destTypeSelections, setDestTypeSelections] = useState(assetDatas);

  const [transferDetail, setTransferDetail] = useState('');
  const [viewTxUrl, setViewTxUrl] = useState('');

  const [showAddSplTokenButton, setShowAddSplTokenButton] = useState(false);

  const { metaMaskAddress, metaMaskNetworkId, metaMaskBalance } = useMetaMaskAccount();

  const {
    erc20EstimateFee,
    bep20EstimateFee,
    slp20EstimateFee,
    estimateEthFee,
    estimateBscFee,
    estimateSolFee,
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
    if (fromChainRef.current && fromChainRef.current.type === 'erc20') {
      return {
        rksm_balance: NumberUtil.handleFisAmountToFixed(state.ETHModule.ercRKSMBalance),
        rfis_balance: NumberUtil.handleFisAmountToFixed(state.ETHModule.ercRFISBalance),
        fis_balance: NumberUtil.handleFisAmountToFixed(state.ETHModule.ercFISBalance),
        rdot_balance: NumberUtil.handleFisAmountToFixed(state.ETHModule.ercRDOTBalance),
        ratom_balance: NumberUtil.handleFisAmountToFixed(state.ETHModule.ercRATOMBalance),
        rsol_balance: NumberUtil.handleFisAmountToFixed(state.ETHModule.ercRSOLBalance),
        rmatic_balance: NumberUtil.handleFisAmountToFixed(state.ETHModule.ercRMaticBalance),
        reth_balance: NumberUtil.handleFisAmountToFixed(state.ETHModule.ercETHBalance),
        rbnb_balance: '--',
        estimateEthFee: state.bridgeModule.estimateEthFee,
      };
    } else if (fromChainRef.current && fromChainRef.current.type === 'bep20') {
      return {
        rksm_balance: NumberUtil.handleFisAmountToFixed(state.BSCModule.bepRKSMBalance),
        rfis_balance: NumberUtil.handleFisAmountToFixed(state.BSCModule.bepRFISBalance),
        fis_balance: NumberUtil.handleFisAmountToFixed(state.BSCModule.bepFISBalance),
        rdot_balance: NumberUtil.handleFisAmountToFixed(state.BSCModule.bepRDOTBalance),
        ratom_balance: NumberUtil.handleFisAmountToFixed(state.BSCModule.bepRATOMBalance),
        rsol_balance: NumberUtil.handleFisAmountToFixed(state.BSCModule.bepRSOLBalance),
        rmatic_balance: NumberUtil.handleFisAmountToFixed(state.BSCModule.bepRMATICBalance),
        reth_balance: NumberUtil.handleFisAmountToFixed(state.BSCModule.bepRETHBalance),
        rbnb_balance: NumberUtil.handleFisAmountToFixed(state.BSCModule.bepRBNBBalance),
        estimateBscFee: state.bridgeModule.estimateBscFee,
      };
    } else if (fromChainRef.current && fromChainRef.current.type === 'spl') {
      return {
        fis_balance: NumberUtil.handleFisAmountToFixed(state.SOLModule.fisBalance),
        rsol_balance: NumberUtil.handleFisAmountToFixed(state.SOLModule.rSOLBalance),
        estimateSolFee: state.bridgeModule.estimateSolFee,
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
        rbnb_balance: NumberUtil.handleFisAmountToFixed(state.rBNBModule.tokenAmount),
        reth_balance: NumberUtil.handleFisAmountToFixed(state.rETHModule.nativeTokenAmount),
        erc20EstimateFee: state.bridgeModule.erc20EstimateFee,
        bep20EstimateFee: state.bridgeModule.bep20EstimateFee,
        slp20EstimateFee: state.bridgeModule.slp20EstimateFee,
      };
    }
  });

  const { fisAccount, fisAddress, solAddress, solBalance, solTransferrableAmount } = useSelector((state: any) => {
    return {
      fisAccount: state.FISModule.fisAccount,
      fisAddress: state.FISModule.fisAccount && state.FISModule.fisAccount.address,
      solAddress: state.rSOLModule.solAddress,
      solBalance: state.rSOLModule.transferrableAmountShow,
      solTransferrableAmount: state.rSOLModule.transferrableAmountShow,
    };
  });

  const updateSplTokenStatus = useCallback(async () => {
    if (!destChainRef.current || destChainRef.current.type !== 'spl') {
      setShowAddSplTokenButton(false);
      return;
    }
    if (!address || !checkSOLAddress(address)) {
      setShowAddSplTokenButton(false);
      return;
    }
    setShowAddSplTokenButton(true);
    const splTokenAccountPubkey = await solServer.getTokenAccountPubkey(address, tokenRef.current.type);
    setShowAddSplTokenButton(!splTokenAccountPubkey);
  }, [address]);

  const update3rdPlatformData = useCallback(() => {
    if (!fromChainRef.current) {
      return;
    }
    if (fromChainRef.current.type === 'erc20' && metaMaskAddress) {
      dispatch(getErc20Allowances());
      dispatch(getAssetBalanceAll());
    }
    if (fromChainRef.current.type === 'bep20' && metaMaskAddress) {
      dispatch(getBep20Allowances());
      dispatch(getBep20AssetBalanceAll());
    }
    if (fromChainRef.current.type === 'spl') {
      if (solAddress) {
        dispatch(solQueryBalance());
        dispatch(getSlp20AssetBalanceAll());
        dispatch(getSlp20Allowances());
      } else {
        dispatch(earglyConnectPhantom());
      }
    }
  }, [dispatch, metaMaskAddress, solAddress]);

  const updateNativePlatformData = useCallback(() => {
    if (fisAddress) {
      dispatch(reloadData());
      dispatch(query_rBalances_account());
      dispatch(fis_query_rBalances_account());
      dispatch(dot_query_rBalances_account());
      dispatch(atom_query_rBalances_account());
      dispatch(sol_query_rBalances_account());
      dispatch(matic_query_rBalances_account());
      dispatch(bnb_query_rBalances_account());
      dispatch(getNativeRethAmount());
      dispatch(ksm_rTokenRate());
      dispatch(fis_rTokenRate());
      dispatch(dot_rTokenRate());
      dispatch(atom_rTokenRate());
      dispatch(sol_rTokenRate());
      dispatch(matic_rTokenRate());
      dispatch(bnb_rTokenRate());
      dispatch(nativerTokenRate);
      dispatch(getUnbondCommission());
      dispatch(fis_getUnbondCommission());
      dispatch(dot_getUnbondCommission());
      dispatch(atom_getUnbondCommission());
      dispatch(sol_getUnbondCommission());
      dispatch(matic_getUnbondCommission());
      dispatch(bnb_getUnbondCommission());
      dispatch(eth_getUnbondCommission());
    }
  }, [fisAddress, dispatch]);

  useEffect(() => {
    updateSplTokenStatus();
  }, [updateSplTokenStatus]);

  // useEffect(() => {
  //   if (fromType && destType) {
  //     if (
  //       fromType !== 'native' &&
  //       fromType !== 'erc20' &&
  //       fromType !== 'bep20' &&
  //       fromType !== 'spl' &&
  //       fromType !== 'default'
  //     ) {
  //       returnToAsset();
  //       return;
  //     }
  //     if (
  //       destType !== 'native' &&
  //       destType !== 'erc20' &&
  //       destType !== 'bep20' &&
  //       destType !== 'spl' &&
  //       destType !== 'default'
  //     ) {
  //       returnToAsset();
  //       return;
  //     }
  //     if (fromType === destType) {
  //       returnToAsset();
  //       return;
  //     }

  //     const fromData = assetDatas.find((item) => item.type == fromType);
  //     setFromTypeData(fromData);
  //     const destData = assetDatas.find((item) => item.type == destType);
  //     setDestTypeData(destData);
  //   } else {
  //     returnToAsset();
  //   }
  // }, [fromType, destType]);

  useEffect(() => {
    dispatch(bridgeCommon_ChainFees());
    dispatch(getBridgeEstimateEthFee());
  }, [dispatch]);

  useEffect(() => {
    updateNativePlatformData();
  }, [updateNativePlatformData]);

  useEffect(() => {
    update3rdPlatformData();
  }, [update3rdPlatformData]);

  // useEffect(() => {
  //   if (location.state) {
  //     const data = selectDataSource.find((item) => item.title == location.state.rSymbol);
  //     if (data) {
  //       setTokenType({ ...data });
  //     } else {
  //       setTokenType(null);
  //     }
  //   } else {
  //     setTokenType(null);
  //   }
  // }, [location.state && location.state.rSymbol, selectDataSource]);

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
    // let filterTokenDatas;
    // if (
    //   (fromType === 'erc20' && destType === 'spl') ||
    //   (fromType === 'spl' && destType === 'erc20') ||
    //   (fromType === 'bep20' && destType === 'spl') ||
    //   (fromType === 'spl' && destType === 'bep20')
    // ) {
    //   filterTokenDatas = allTokenDatas.filter((item: any) => {
    //     return false;
    //   });
    // } else if ((fromType === 'native' && destType === 'spl') || (fromType === 'spl' && destType === 'native')) {
    //   filterTokenDatas = allTokenDatas.filter((item: any) => {
    //     return item.type === 'fis' || item.type === 'rsol';
    //   });
    // } else if ((fromType === 'native' && destType === 'erc20') || (fromType === 'erc20' && destType === 'native')) {
    //   filterTokenDatas = allTokenDatas.filter((item: any) => {
    //     return item.type !== 'rbnb' && item.type !== 'rsol';
    //   });
    // } else if ((fromType === 'native' && destType === 'bep20') || (fromType === 'bep20' && destType === 'native')) {
    //   filterTokenDatas = allTokenDatas.filter((item: any) => {
    //     return item.type !== 'fis' && item.type !== 'rsol';
    //   });
    // } else if ((fromType === 'erc20' && destType === 'bep20') || (fromType === 'bep20' && destType === 'erc20')) {
    //   filterTokenDatas = allTokenDatas.filter((item: any) => {
    //     return item.type !== 'fis' && item.type !== 'rbnb' && item.type !== 'rsol';
    //   });
    // } else if (fromType === 'erc20' && destType === 'default') {
    //   filterTokenDatas = allTokenDatas.filter((item: any) => {
    //     return item.type !== 'rbnb' && item.type !== 'rsol';
    //   });
    // } else if (fromType === 'bep20' && destType === 'default') {
    //   filterTokenDatas = allTokenDatas.filter((item: any) => {
    //     return item.type !== 'fis' && item.type !== 'rsol';
    //   });
    // } else if (fromType === 'spl' && destType === 'default') {
    //   filterTokenDatas = allTokenDatas.filter((item: any) => {
    //     return item.type === 'fis' || item.type === 'rsol';
    //   });
    // } else if (fromType === 'native' && destType === 'default') {
    //   filterTokenDatas = allTokenDatas.filter((item: any) => {
    //     return item.type !== 'reth';
    //   });
    // } else {
    //   filterTokenDatas = allTokenDatas.filter((item: any) => {
    //     return item.type !== 'reth' && item.type !== 'fis' && item.type !== 'rsol';
    //   });
    // }

    setSelectDataSource([...allTokenDatas]);

    const targetToken = { ...tokenRef.current };
    if ((targetToken.title = 'FIS')) {
      targetToken.content = fis_balance;
    } else if ((targetToken.title = 'rFIS')) {
      targetToken.content = rfis_balance;
    } else if ((targetToken.title = 'rKSM')) {
      targetToken.content = rksm_balance;
    } else if ((targetToken.title = 'rDOT')) {
      targetToken.content = rdot_balance;
    } else if ((targetToken.title = 'rATOM')) {
      targetToken.content = ratom_balance;
    } else if ((targetToken.title = 'rSOL')) {
      targetToken.content = rsol_balance;
    } else if ((targetToken.title = 'rMATIC')) {
      targetToken.content = rmatic_balance;
    } else if ((targetToken.title = 'rETH')) {
      targetToken.content = reth_balance;
    }
    // tokenRef.current = { ...targetToken };
    // setTokenRefState({ ...targetToken });
  }, [
    rksm_balance,
    rfis_balance,
    fis_balance,
    reth_balance,
    rdot_balance,
    ratom_balance,
    rsol_balance,
    rmatic_balance,
    rbnb_balance,
  ]);

  useEffect(() => {
    const supportChainTypes = tokenSupportChainMap[tokenRefState.type];
    const supportChains = supportChainTypes.map((chainType) => {
      return assetDatas.find((asset) => asset.type === chainType);
    });

    setFromTypeSelections(supportChains);
    setDestTypeSelections(supportChains);

    if (fromChainRef.current && destChainRef.current) {
      if (
        chainSupportTokenMap[`${fromChainRef.current.type}-${destChainRef.current.type}`].indexOf(tokenRefState.type) <
        0
      ) {
        setFromChainRefState(null);
        setDestChainRefState(null);
        // fromChainRef.current = null;
        // destChainRef.current = null;
      }
    } else if (fromChainRef.current) {
      if (supportChainTypes.indexOf(fromChainRef.current.type) < 0) {
        // fromChainRef.current = null;
        setFromChainRefState(null);
      }
    } else if (destChainRef.current) {
      if (supportChainTypes.indexOf(destChainRef.current.type) < 0) {
        // destChainRef.current = null;
        setDestChainRefState(null);
      }
    }
  }, [tokenRefState]);

  // useEffect(() => {
  //   if (time) {
  //     clearInterval(time);
  //   }
  // }, [fromTypeData && fromTypeData.type, destTypeData && destTypeData.type]);

  useInterval(() => {
    updateData();
  }, 30000);

  const updateData = () => {
    if (fromChainRef.current && fromChainRef.current.type === 'native') {
      updateNativePlatformData();
    } else {
      update3rdPlatformData();
    }
  };

  const reverseExchangeType = () => {
    // history.replace(
    //   `/rAsset/swap/${destTypeData ? destTypeData.type : 'default'}/${fromTypeData ? fromTypeData.type : 'default'}`,
    //   {
    //     rSymbol: tokenType && tokenType.title,
    //   },
    // );

    const temp = { ...fromChainRef.current };

    // fromChainRef.current = destChainRef.current;
    // destChainRef.current = temp;

    setFromChainRefState(destChainRef.current);
    setDestChainRefState(temp);

    setFormAmount('');
    setAddress('');
  };

  // if (fromChainRef.current && fromChainRef.current.type === 'native' && (!fisAccount || !fisAccount.address)) {
  //   return <Redirect to='/rAsset/home/native' />;
  // }

  // if (fromTypeData && fromTypeData.type === 'erc20' && !metaMaskAddress) {
  //   return <Redirect to='/rAsset/home/erc' />;
  // }

  // if (fromTypeData && fromTypeData.type === 'bep20' && !metaMaskAddress) {
  //   return <Redirect to='/rAsset/home/bep' />;
  // }

  const checkAddress = (address: string) => {
    return fis_checkAddress(address);
  };

  const changeFromChain = (type: SelectorType) => {
    if (!type) {
      return;
    }
    if (destChainRef.current && type.type === destChainRef.current.type) {
      reverseExchangeType();
      return;
    }
    setFormAmount('');
    setAddress('');
    // history.replace(`/rAsset/swap/${type.type}/${destType}`, {
    //   rSymbol: tokenType && tokenType.title,
    // });
    // fromChainRef.current = type;
    setFromChainRefState(type);
  };

  const changeDestChain = (type: SelectorType) => {
    if (!type) {
      return;
    }
    if (fromChainRef.current && type.type === fromChainRef.current.type) {
      reverseExchangeType();
      return;
    }
    setFormAmount('');
    setAddress('');
    // history.replace(`/rAsset/swap/${fromType}/${type.type}`, {
    //   rSymbol: tokenType && tokenType.title,
    // });
    // destChainRef.current = type;
    setDestChainRefState(type);
  };

  return (
    <Content className='stafi_rasset_swap '>
      {/* <Back
        top={'40px'}
        left={'50px'}
        onClick={() => {
          history.go(-1);
        }}
      /> */}
      <div className={'title_container'}>
        <Title label='rBridge Swap' padding={'30px 0'} />
      </div>

      <div>
        <div className='row' style={{ marginBottom: 0 }}>
          <div>
            <TypeSelector
              popTitle={'Select a rToken'}
              selectDataSource={selectDataSource}
              selectedData={tokenRefState}
              selectedTitle={tokenRefState.title}
              selectedDescription={tokenRefState ? '' : 'Choose a token'}
              onSelectChange={(e: SelectorType) => {
                setFormAmount('');
                setAddress('');
                // tokenRef.current = { ...e };
                // setTokenRefState({ ...e });
                history.push(`/rAsset/swap/${e.title}`);
              }}
            />
          </div>

          <div className={'asset_selector_container'} style={{ marginTop: '15px' }}>
            <div className={'selector_container'}>
              <TypeSelector
                popTitle={'Select a Chain'}
                selectDataSource={fromTypeSelections}
                selectedData={fromChainRefState}
                selectedTitle={fromChainRefState ? fromChainRefState.content : ''}
                selectedDescription={fromChainRefState ? fromChainRefState.title : 'Choose a token standard'}
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
                selectedData={destChainRefState}
                selectedTitle={destChainRefState ? destChainRefState.content : ''}
                selectedDescription={destChainRefState ? destChainRefState.title : 'Choose a token standard'}
                onSelectChange={changeDestChain}
              />
            </div>
          </div>

          <div className={'input_container'} style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className={'title'}>Swap Amount</div>
              <div className={'balance_amount'}>
                Balance: {tokenRefState.content !== '--' ? tokenRefState.content : '--'}
              </div>
            </div>

            <AmountInputEmbed
              maxInput={tokenRefState.content !== '--' ? tokenRefState.content : 0}
              showMax={!isNaN(Number(tokenRefState.content))}
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
              placeholder={
                destChainRefState
                  ? destChainRefState.type === 'native' || destChainRefState.type === 'spl'
                    ? '...'
                    : '0x...'
                  : ''
              }
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
          {fromChainRefState && fromChainRefState.type === 'erc20' && `Estimate Fee: ${estimateEthFee} ETH`}

          {fromChainRefState && fromChainRefState.type === 'bep20' && `Estimate Fee: ${estimateBscFee} BNB`}

          {fromChainRefState && fromChainRefState.type === 'spl' && `Estimate Fee: ${estimateSolFee} SOL`}

          {fromChainRefState &&
            fromChainRefState.type === 'native' &&
            destChainRefState &&
            destChainRefState.type === 'erc20' &&
            `Estimate Fee: ${erc20EstimateFee} FIS`}

          {fromChainRefState &&
            fromChainRefState.type === 'native' &&
            destChainRefState &&
            destChainRefState.type === 'bep20' &&
            `Estimate Fee: ${bep20EstimateFee} FIS`}

          {fromChainRefState &&
            fromChainRefState.type === 'native' &&
            destChainRefState &&
            destChainRefState.type === 'spl' &&
            `Estimate Fee: ${slp20EstimateFee} FIS`}
        </div>

        <div className='btns'>
          <Button
            disabled={
              !(
                fromAoumt &&
                address &&
                fromChainRefState &&
                destChainRefState &&
                (fromChainRefState.type === 'native' ||
                  fromChainRefState.type === 'spl' ||
                  (fromChainRefState.type === 'erc20' && config.metaMaskNetworkIsGoerliEth(metaMaskNetworkId)) ||
                  (fromChainRefState.type === 'bep20' && config.metaMaskNetworkIsBsc(metaMaskNetworkId)))
              )
            }
            onClick={async () => {
              if (!fromChainRef.current || !destChainRef.current) {
                message.error(`Please select chain to transfer`);
                return;
              }
              if (fromChainRef.current && fromChainRef.current.type === 'erc20') {
                if (isNaN(Number(metaMaskBalance)) || Number(metaMaskBalance) <= Number(estimateEthFee)) {
                  message.error(`No enough ETH to pay for the fee`);
                  return;
                }
              }
              if (fromChainRef.current && fromChainRef.current.type === 'bep20') {
                if (isNaN(Number(metaMaskBalance)) || Number(metaMaskBalance) <= Number(estimateBscFee)) {
                  message.error(`No enough BNB to pay for the fee`);
                  return;
                }
              }
              if (fromChainRef.current && fromChainRef.current.type === 'spl') {
                if (isNaN(Number(solTransferrableAmount)) || Number(solTransferrableAmount) <= Number(estimateSolFee)) {
                  message.error(`No enough SOL to pay for the fee`);
                  return;
                }
              }
              if (
                fromChainRef.current.type === 'native' &&
                destChainRef.current &&
                destChainRef.current.type === 'erc20'
              ) {
                if (Number(fis_balance) <= Number(erc20EstimateFee)) {
                  message.error(`No enough FIS to pay for the fee`);
                  return;
                }
              }
              if (
                fromChainRef.current.type === 'native' &&
                destChainRef.current &&
                destChainRef.current.type === 'bep20'
              ) {
                if (Number(fis_balance) <= Number(bep20EstimateFee)) {
                  message.error(`No enough FIS to pay for the fee`);
                  return;
                }
              }
              if (
                fromChainRef.current.type === 'native' &&
                destChainRef.current &&
                destChainRef.current.type === 'spl'
              ) {
                if (Number(fis_balance) <= Number(slp20EstimateFee)) {
                  message.error(`No enough FIS to pay for the fee`);
                  return;
                }
              }
              if (destChainRef.current.type === 'erc20' || destChainRef.current.type === 'bep20') {
                if (!checkEthAddress(address)) {
                  message.error('Input address error');
                  return;
                }
              }
              if (destChainRef.current.type === 'native') {
                if (!checkAddress(address)) {
                  message.error('Input address error');
                  return;
                }
              }
              if (destChainRef.current.type === 'spl') {
                if (!checkSOLAddress(address)) {
                  message.error('Input address error');
                  return;
                }
                if (showAddSplTokenButton) {
                  dispatch(setLoading(true));

                  const connection = new Connection(config.solRpcApi(), { wsEndpoint: config.solRpcWs() });

                  const createTokenFeeRes = await splToken.Token.getMinBalanceRentForExemptAccount(connection);
                  const createTokenFee = numberUtil.tokenAmountToHuman(createTokenFeeRes, rSymbol.Sol);
                  if (Number(solBalance) < Number(createTokenFee)) {
                    message.error(`Insufficient available SOL balance, at least ${createTokenFee} SOL`);
                    dispatch(setLoading(false));
                    return;
                  }

                  const createSplTokenAccountResult = await solServer.createTokenAccount(
                    address,
                    tokenRef.current.type,
                  );
                  if (createSplTokenAccountResult) {
                    setShowAddSplTokenButton(false);
                  }
                  dispatch(solQueryBalance());
                  dispatch(setLoading(false));
                  return;
                }
              }

              if (destChainRef.current && destChainRef.current.type === 'erc20') {
                setViewTxUrl(config.etherScanErc20TxInAddressUrl(address));
              } else if (destChainRef.current && destChainRef.current.type === 'bep20') {
                setViewTxUrl(config.bscScanBep20TxInAddressUrl(address));
              } else if (destChainRef.current && destChainRef.current.type === 'spl') {
                setViewTxUrl(config.solScanSlp20TxInAddressUrl(address));
              } else {
                setViewTxUrl(config.stafiScanUrl(address));
              }
              setTransferDetail(
                `${fromAoumt} ${tokenRef.current.title} ${fromChainRef.current && fromChainRef.current.content}`,
              );

              if (fromChainRef.current && fromChainRef.current.type === 'native') {
                let chainId = ETH_CHAIN_ID;
                if (destChainRef.current && destChainRef.current.type === 'bep20') {
                  chainId = BSC_CHAIN_ID;
                } else if (destChainRef.current && destChainRef.current.type === 'spl') {
                  chainId = SOL_CHAIN_ID;
                }
                dispatch(
                  nativeToOtherSwap(chainId, tokenRef.current.title, tokenRef.current.type, fromAoumt, address, () => {
                    setFormAmount('');
                    setAddress('');
                    updateData();
                  }),
                );
              } else {
                let swapFun;
                let destChainId;
                if (fromChainRef.current && fromChainRef.current.type === 'erc20') {
                  swapFun = erc20ToOtherSwap;
                } else if (fromChainRef.current && fromChainRef.current.type === 'bep20') {
                  swapFun = bep20ToOtherSwap;
                } else if (
                  fromChainRef.current &&
                  fromChainRef.current.type === 'spl' &&
                  destChainRef.current &&
                  destChainRef.current.type === 'native'
                ) {
                  swapFun = slp20ToOtherSwap;
                }
                if (destChainRef.current.type === 'erc20') {
                  destChainId = ETH_CHAIN_ID;
                } else if (destChainRef.current.type === 'bep20') {
                  destChainId = BSC_CHAIN_ID;
                } else {
                  destChainId = STAFI_CHAIN_ID;
                }

                if (swapFun) {
                  dispatch(
                    swapFun(destChainId, tokenRef.current.title, tokenRef.current.type, fromAoumt, address, () => {
                      setFormAmount('');
                      setAddress('');
                      updateData();
                    }),
                  );
                }
              }
            }}>
            {showAddSplTokenButton ? 'Approve' : 'Swap'}
          </Button>
        </div>
      </div>

      <SwapLoading
        destChainName={destChainRefState && destChainRefState.title}
        destChainType={destChainRefState && destChainRefState.type}
        transferDetail={transferDetail}
        viewTxUrl={viewTxUrl}
      />
    </Content>
  );
}
