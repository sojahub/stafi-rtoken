// @ts-nocheck

import { web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import { bufferToU8a, u8aToHex } from '@polkadot/util';
import { createSlice } from '@reduxjs/toolkit';
import { Connection, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import { message } from 'antd';
import * as crypto from 'crypto';
import config from 'src/config/index';
import { rSymbol } from 'src/keyring/defaults';
import AtomServer from 'src/servers/atom';
import BridgeServer from 'src/servers/bridge';
import BscServer from 'src/servers/bsc';
import EthServer from 'src/servers/eth';
import { bech32 } from 'bech32';
import keyring from 'src/servers/index';
import KsmServer from 'src/servers/ksm';
import MaticServer from 'src/servers/matic';
import DotServer from 'src/servers/polkadot';
import SolServer from 'src/servers/sol';
import { default as FisServer, default as StafiServer } from 'src/servers/stafi';
import Stafi from 'src/servers/stafi/index';
import { stafi_uuid, timeout } from 'src/util/common';
import numberUtil, { default as NumberUtil } from 'src/util/numberUtil';
import rpc from 'src/util/rpc';
import { AppThunk } from '../store';
import { getAssetBalance as getBscAssetBalance } from './BSCClice';
import CommonClice from './commonClice';
import { getAssetBalance } from './ETHClice';
import { connectSoljs, setLoading, setStakeSwapLoadingParams } from './globalClice';
import { add_Notice, noticeStatus, noticesubType, noticeType } from './noticeClice';
import { getAssetBalance as getSlpAssetBalance } from './SOLClice';
import { getAssetBalance as getStafiHubAssetBalance } from './StafiHubClice';
import { sendBridgeDepositTx } from '@stafihub/apps-wallet';

export const STAFI_CHAIN_ID = 1;
export const ETH_CHAIN_ID = 2;
export const BSC_CHAIN_ID = 3;
export const SOL_CHAIN_ID = 4;
export const STAFIHUB_CHAIN_ID = 5;

const bridgeServer = new BridgeServer();
const bscServer = new BscServer();
const stafiServer = new StafiServer();
const ethServer = new EthServer();
const fisServer = new FisServer();
const ksmServer = new KsmServer();
const dotServer = new DotServer();
const atomServer = new AtomServer();
const solServer = new SolServer();
const maticServer = new MaticServer();
const commonClice = new CommonClice();

const bridgeClice = createSlice({
  name: 'bridgeModule',
  initialState: {
    erc20EstimateFee: '--',
    bep20EstimateFee: '--',
    slp20EstimateFee: '--',
    ics20EstimateFee: '--',
    estimateEthFee: '--',
    estimateBscFee: '--',
    estimateSolFee: '--',
    priceList: [],
    // 0-invisible, 1-start transferring, 2-start minting
    swapLoadingStatus: 0,
    swapWaitingTime: 150,
    swapLoadingParams: {
      destChainId: 0,
      tokenType: '',
      amount: '',
    },
  },
  reducers: {
    setErc20EstimateFee(state, { payload }) {
      state.erc20EstimateFee = payload;
    },
    setBep20EstimateFee(state, { payload }) {
      state.bep20EstimateFee = payload;
    },
    setSlp20EstimateFee(state, { payload }) {
      state.slp20EstimateFee = payload;
    },
    setIcs20EstimateFee(state, { payload }) {
      state.ics20EstimateFee = payload;
    },
    setEstimateEthFee(state, { payload }) {
      state.estimateEthFee = payload;
    },
    setEstimateBscFee(state, { payload }) {
      state.estimateBscFee = payload;
    },
    setEstimateSolFee(state, { payload }) {
      state.estimateSolFee = payload;
    },
    setPriceList(state, { payload }) {
      state.priceList = payload;
    },
    setSwapLoadingStatus(state, { payload }) {
      state.swapLoadingStatus = payload;
    },
    setSwapWaitingTime(state, { payload }) {
      state.swapWaitingTime = payload;
    },
    setSwapLoadingParams(state, { payload }) {
      state.swapLoadingParams = payload;
    },
  },
});

export const {
  setErc20EstimateFee,
  setBep20EstimateFee,
  setSlp20EstimateFee,
  setIcs20EstimateFee,
  setEstimateEthFee,
  setEstimateBscFee,
  setEstimateSolFee,
  setPriceList,
  setSwapLoadingStatus,
  setSwapWaitingTime,
  setSwapLoadingParams,
} = bridgeClice.actions;

export const bridgeCommon_ChainFees = (): AppThunk => async (dispatch, getState) => {
  try {
    const stafiServer = new Stafi();
    const api = await stafiServer.createStafiApi();
    const result = await api.query.bridgeCommon.chainFees(ETH_CHAIN_ID);
    if (result.toJSON()) {
      let estimateFee = NumberUtil.fisAmountToHuman(result.toJSON());
      dispatch(setErc20EstimateFee(NumberUtil.handleFisAmountToFixed(estimateFee)));
    }

    const resultBep = await api.query.bridgeCommon.chainFees(BSC_CHAIN_ID);
    if (resultBep.toJSON()) {
      let bepEstimateFee = NumberUtil.fisAmountToHuman(resultBep.toJSON());
      dispatch(setBep20EstimateFee(NumberUtil.handleFisAmountToFixed(bepEstimateFee)));
    }

    const resultSlp = await api.query.bridgeCommon.chainFees(SOL_CHAIN_ID);
    if (resultSlp.toJSON()) {
      let slpEstimateFee = NumberUtil.fisAmountToHuman(resultSlp.toJSON());
      dispatch(setSlp20EstimateFee(NumberUtil.handleFisAmountToFixed(slpEstimateFee)));
    }

    const resultIcs = await api.query.bridgeCommon.chainFees(STAFI_CHAIN_ID);
    if (resultSlp.toJSON()) {
      let icsEstimateFee = NumberUtil.fisAmountToHuman(resultIcs.toJSON());
      dispatch(setIcs20EstimateFee(NumberUtil.handleFisAmountToFixed(icsEstimateFee)));
    }
  } catch (e) {}
};

//ERC20 to Native
export const getBridgeEstimateEthFee = (): AppThunk => async (dispatch, getState) => {
  dispatch(setEstimateEthFee(bridgeServer.getBridgeEstimateEthFee()));
  dispatch(setEstimateBscFee(bridgeServer.getBridgeEstimateBscFee()));
  dispatch(setEstimateSolFee(bridgeServer.getBridgeEstimateSolFee()));
};

export const nativeToOtherSwap =
  (chainId: any, tokenStr: string, tokenType: string, tokenAmount: any, destAddress: string, cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setLoading(true));
      const notice_uuid = stafi_uuid();

      let txAddress = destAddress;
      if (chainId === SOL_CHAIN_ID) {
        txAddress = u8aToHex(new PublicKey(destAddress).toBytes());
        const tokenMintPublicKey = await solServer.getTokenAccountPubkey(destAddress, tokenType);
        if (!tokenMintPublicKey) {
          throw new Error('Please add the SPL token account first.');
        }
        txAddress = u8aToHex(tokenMintPublicKey.toBytes());
      } else if (chainId === STAFIHUB_CHAIN_ID) {
        const { words } = bech32.decode(destAddress);
        const buffer = Buffer.from(bech32.fromWords(words));
        const hex = u8aToHex(bufferToU8a(buffer));
        txAddress = '0x' + hex.substr(2).toUpperCase();
        // txAddress = hex;
      }

      dispatch(setSwapLoadingStatus(1));
      dispatch(setSwapWaitingTime(600));
      if (chainId === ETH_CHAIN_ID) {
        updateSwapParamsOfErc(dispatch, notice_uuid, tokenType, tokenAmount, destAddress);
      } else if (chainId === BSC_CHAIN_ID) {
        updateSwapParamsOfBep(dispatch, notice_uuid, tokenType, tokenAmount, destAddress);
      } else if (chainId === SOL_CHAIN_ID) {
        updateSwapParamsOfSlp(dispatch, notice_uuid, tokenType, tokenAmount, destAddress);
      } else if (chainId === STAFIHUB_CHAIN_ID) {
        updateSwapParamsOfStafiHub(dispatch, notice_uuid, tokenType, tokenAmount, destAddress);
      }

      web3Enable(stafiServer.getWeb3EnalbeName());
      const injector: any = await web3FromSource(stafiServer.getPolkadotJsSource());
      const api = await stafiServer.createStafiApi();
      let currentAccount = getState().FISModule.fisAccount.address;
      let tx: any = '';

      if (tokenType === 'fis') {
        const amount = NumberUtil.tokenAmountToChain(tokenAmount.toString());
        tx = await api.tx.bridgeSwap.transferNative(amount.toString(), txAddress, chainId);
        console.log('transferNative params', currentAccount, amount.toString(), chainId, txAddress);
      } else {
        let rsymbol = bridgeServer.getRsymbolByTokenType(tokenType);
        const amount = NumberUtil.tokenAmountToChain(tokenAmount.toString(), rsymbol);
        tx = await api.tx.bridgeSwap.transferRtoken(rsymbol, amount.toString(), txAddress, chainId);
      }
      if (!tx) {
        dispatch(setLoading(false));
        dispatch(setSwapLoadingStatus(0));
        return;
      }

      tx.signAndSend(currentAccount, { signer: injector.signer }, (result: any) => {
        if (result.status.isInBlock) {
          result.events
            .filter((obj: any) => obj.event.section === 'system')
            .forEach(({ event: { data, method } }: any) => {
              if (method === 'ExtrinsicFailed') {
                const [dispatchError] = data;
                if (dispatchError.isModule) {
                  try {
                    const mod = dispatchError.asModule;
                    const error = data.registry.findMetaError(
                      new Uint8Array([mod.index.toNumber(), mod.error.toNumber()]),
                    );
                    console.log('error', error);
                    console.log('c', chainId);
                    let message_str = 'Something is wrong, please make sure you have enough FIS balance';
                    if (tokenType === 'rfis') {
                      message_str = 'Something is wrong, please make sure you have enough FIS and rFIS balance';
                    } else if (tokenType === 'rdot') {
                      message_str = 'Something is wrong, please make sure you have enough FIS and rDOT balance';
                    } else if (tokenType === 'rksm') {
                      message_str = 'Something is wrong, please make sure you have enough FIS and rKSM balance';
                    } else if (tokenType === 'ratom') {
                      message_str = 'Something is wrong, please make sure you have enough FIS and rATOM balance';
                    } else if (tokenType === 'rsol') {
                      message_str = 'Something is wrong, please make sure you have enough FIS and rSOL balance';
                    } else if (tokenType === 'rmatic') {
                      message_str = 'Something is wrong, please make sure you have enough FIS and rMATIC balance';
                    } else if (tokenType === 'rbnb') {
                      message_str = 'Something is wrong, please make sure you have enough FIS and rBNB balance';
                    }
                    if (error.name === 'ServicePaused') {
                      message_str = 'Service is paused, please try again later!';
                    }
                    dispatch(setLoading(false));
                    dispatch(setSwapLoadingStatus(0));
                    message.error(message_str);
                  } catch (error) {
                    dispatch(setLoading(false));
                    dispatch(setSwapLoadingStatus(0));
                    message.error(error.message);
                  }
                }
              } else if (method === 'ExtrinsicSuccess') {
                dispatch(setLoading(false));
                dispatch(setSwapLoadingStatus(2));
                dispatch(
                  add_Swap_Notice(notice_uuid, tokenStr, tokenAmount, noticeStatus.Pending, {
                    swapType: 'native',
                    destSwapType:
                      chainId === BSC_CHAIN_ID
                        ? 'bep20'
                        : chainId === SOL_CHAIN_ID
                        ? 'spl'
                        : chainId === STAFIHUB_CHAIN_ID
                        ? 'ics20'
                        : 'erc20',
                    address: destAddress,
                  }),
                );
                cb && cb();
              }
            });
        } else if (result.isError) {
          dispatch(setLoading(false));
          dispatch(setSwapLoadingStatus(0));
          message.error(result.toHuman());
        }
      }).catch((error: any) => {
        dispatch(setLoading(false));
        dispatch(setSwapLoadingStatus(0));
        message.error(error.message);
      });
    } catch (error) {
      dispatch(setLoading(false));
      dispatch(setSwapLoadingStatus(0));
      message.error(error.message);
    }
  };

export const erc20ToOtherSwap =
  (
    destChainId: number,
    tokenStr: string,
    tokenType: string,
    tokenAmount: any,
    address: string,
    cb?: Function,
  ): AppThunk =>
  async (dispatch, getState) => {
    dispatch(setLoading(true));
    dispatch(setSwapLoadingStatus(1));
    dispatch(setSwapWaitingTime(600));
    const notice_uuid = stafi_uuid();

    if (destChainId === BSC_CHAIN_ID) {
      updateSwapParamsOfBep(dispatch, notice_uuid, tokenType, tokenAmount, address);
    } else {
      updateSwapParamsOfNative(dispatch, notice_uuid, tokenType, tokenAmount, address);
    }

    let web3 = ethServer.getWeb3();

    let tokenContract: any = '';
    let allowance: any = 0;

    const memtaMaskAddress = getState().globalModule.metaMaskAddress;
    if (!memtaMaskAddress) {
      dispatch(setLoading(false));
      dispatch(setSwapLoadingStatus(0));
      return;
    }

    if (tokenType === 'fis') {
      tokenContract = new web3.eth.Contract(stafiServer.getFISTokenAbi(), stafiServer.getFISTokenAddress(), {
        from: memtaMaskAddress,
      });
      allowance = getState().ETHModule.FISErc20Allowance;
    } else if (tokenType === 'rfis') {
      tokenContract = new web3.eth.Contract(stafiServer.getRFISTokenAbi(), stafiServer.getRFISTokenAddress(), {
        from: memtaMaskAddress,
      });
      allowance = getState().ETHModule.RFISErc20Allowance;
    } else if (tokenType === 'rksm') {
      tokenContract = new web3.eth.Contract(ksmServer.getRKSMTokenAbi(), ksmServer.getRKSMTokenAddress(), {
        from: memtaMaskAddress,
      });
      allowance = getState().ETHModule.RKSMErc20Allowance;
    } else if (tokenType === 'rdot') {
      tokenContract = new web3.eth.Contract(dotServer.getRDOTTokenAbi(), dotServer.getRDOTTokenAddress(), {
        from: memtaMaskAddress,
      });
      allowance = getState().ETHModule.RDOTErc20Allowance;
    } else if (tokenType === 'ratom') {
      tokenContract = new web3.eth.Contract(atomServer.getTokenAbi(), atomServer.getRATOMTokenAddress(), {
        from: memtaMaskAddress,
      });
      allowance = getState().ETHModule.RATOMErc20Allowance;
    } else if (tokenType === 'rsol') {
      tokenContract = new web3.eth.Contract(solServer.getTokenAbi(), solServer.getRSOLTokenAddress(), {
        from: memtaMaskAddress,
      });
      allowance = getState().ETHModule.RSOLErc20Allowance;
    } else if (tokenType === 'rmatic') {
      tokenContract = new web3.eth.Contract(maticServer.getTokenAbi(), maticServer.getTokenAddress(), {
        from: memtaMaskAddress,
      });
      allowance = getState().ETHModule.RMaticErc20Allowance;
    } else if (tokenType === 'reth') {
      tokenContract = new web3.eth.Contract(ethServer.getRETHTokenAbi(), ethServer.getRETHTokenAddress(), {
        from: memtaMaskAddress,
      });
      allowance = getState().ETHModule.RETHErc20Allowance;
    }
    if (!tokenContract) {
      dispatch(setLoading(false));
      dispatch(setSwapLoadingStatus(0));
      return;
    }

    const amount = web3.utils.toWei(tokenAmount.toString());
    try {
      if (Number(allowance) < Number(amount)) {
        const approveResult = await tokenContract.methods
          .approve(bridgeServer.getBridgeErc20HandlerAddress(), web3.utils.toWei('10000000'))
          .send();
        if (approveResult && approveResult.status) {
          let bridgeContract = new web3.eth.Contract(bridgeServer.getBridgeAbi(), bridgeServer.getBridgeAddress(), {
            from: memtaMaskAddress,
          });
          const sendAmount = web3.utils.toWei(getState().bridgeModule.estimateEthFee);

          let amountHex = web3.eth.abi.encodeParameter('uint256', amount);
          let len;
          let rAddressHex;
          if (destChainId === STAFI_CHAIN_ID) {
            len = '32';
            const keyringInstance = keyring.init('fis');
            rAddressHex = u8aToHex(keyringInstance.decodeAddress(address));
          } else {
            len = '20';
            rAddressHex = address;
          }
          let lenHex = web3.eth.abi.encodeParameter('uint256', len);

          let data = amountHex + lenHex.slice(2) + rAddressHex.slice(2);

          const result = await bridgeContract.methods
            .deposit(destChainId, bridgeServer.getResourceId(tokenType), data)
            .send({ value: sendAmount });

          if (result && result.status) {
            dispatch(
              add_Swap_Notice(notice_uuid, tokenStr, tokenAmount, noticeStatus.Pending, {
                swapType: 'erc20',
                destSwapType: destChainId === STAFI_CHAIN_ID ? 'native' : 'bep20',
                address: address,
              }),
            );
            dispatch(setSwapLoadingStatus(2));
            cb && cb({ txHash: result.transactionHash });
          } else {
            dispatch(setSwapLoadingStatus(0));
            message.error('Error! Please try again');
          }
        } else {
          dispatch(setSwapLoadingStatus(0));
          message.error('Error! Please try again');
        }
      } else {
        let bridgeContract = new web3.eth.Contract(bridgeServer.getBridgeAbi(), bridgeServer.getBridgeAddress(), {
          from: memtaMaskAddress,
        });
        const sendAmount = web3.utils.toWei(getState().bridgeModule.estimateEthFee);

        let amountHex = web3.eth.abi.encodeParameter('uint256', amount);
        let len;
        let rAddressHex;
        if (destChainId === STAFI_CHAIN_ID) {
          len = '32';
          const keyringInstance = keyring.init('fis');
          rAddressHex = u8aToHex(keyringInstance.decodeAddress(address));
        } else {
          len = '20';
          rAddressHex = address;
        }
        let lenHex = web3.eth.abi.encodeParameter('uint256', len);

        let data = amountHex + lenHex.slice(2) + rAddressHex.slice(2);

        const result = await bridgeContract.methods
          .deposit(destChainId, bridgeServer.getResourceId(tokenType), data)
          .send({ value: sendAmount });

        if (result && result.status && result.transactionHash) {
          dispatch(
            add_Swap_Notice(notice_uuid, tokenStr, tokenAmount, noticeStatus.Pending, {
              swapType: 'erc20',
              destSwapType: destChainId === STAFI_CHAIN_ID ? 'native' : 'bep20',
              address: address,
            }),
          );
          dispatch(setSwapLoadingStatus(2));
          cb && cb({ txHash: result.transactionHash });
        } else {
          dispatch(setSwapLoadingStatus(0));
          message.error('Error! Please try again');
        }
      }
    } catch (error) {
      dispatch(setSwapLoadingStatus(0));
      message.error(error.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const bep20ToOtherSwap =
  (
    destChainId: number,
    tokenStr: string,
    tokenType: string,
    tokenAmount: any,
    address: string,
    cb?: Function,
  ): AppThunk =>
  async (dispatch, getState) => {
    const bscAddress = getState().globalModule.metaMaskAddress;
    if (!bscAddress) {
      message.warn('Please connect MetaMask first');
      return;
    }

    const notice_uuid = stafi_uuid();
    dispatch(setLoading(true));
    dispatch(setSwapLoadingStatus(1));
    dispatch(setSwapWaitingTime(600));
    if (destChainId === ETH_CHAIN_ID) {
      updateSwapParamsOfErc(dispatch, notice_uuid, tokenType, tokenAmount, address);
    } else {
      updateSwapParamsOfNative(dispatch, notice_uuid, tokenType, tokenAmount, address);
    }

    let web3 = ethServer.getWeb3();

    let tokenContract: any = '';
    let allowance: any = 0;
    if (tokenType === 'fis') {
      tokenContract = new web3.eth.Contract(bscServer.getFISTokenAbi(), bscServer.getFISTokenAddress(), {
        from: bscAddress,
      });
      allowance = getState().BSCModule.FISBep20Allowance;
    } else if (tokenType === 'rfis') {
      tokenContract = new web3.eth.Contract(bscServer.getRFISTokenAbi(), bscServer.getRFISTokenAddress(), {
        from: bscAddress,
      });
      allowance = getState().BSCModule.RFISBep20Allowance;
    } else if (tokenType === 'rksm') {
      tokenContract = new web3.eth.Contract(bscServer.getRKSMTokenAbi(), bscServer.getRKSMTokenAddress(), {
        from: bscAddress,
      });
      allowance = getState().BSCModule.RKSMBep20Allowance;
    } else if (tokenType === 'rdot') {
      tokenContract = new web3.eth.Contract(bscServer.getRDOTTokenAbi(), bscServer.getRDOTTokenAddress(), {
        from: bscAddress,
      });
      allowance = getState().BSCModule.RDOTBep20Allowance;
    } else if (tokenType === 'ratom') {
      tokenContract = new web3.eth.Contract(bscServer.getRATOMTokenAbi(), bscServer.getRATOMTokenAddress(), {
        from: bscAddress,
      });
      allowance = getState().BSCModule.RATOMBep20Allowance;
    } else if (tokenType === 'rsol') {
      tokenContract = new web3.eth.Contract(bscServer.getRSOLTokenAbi(), bscServer.getRSOLTokenAddress(), {
        from: bscAddress,
      });
      allowance = getState().BSCModule.RSOLBep20Allowance;
    } else if (tokenType === 'rmatic') {
      tokenContract = new web3.eth.Contract(bscServer.getRMATICTokenAbi(), bscServer.getRMATICTokenAddress(), {
        from: bscAddress,
      });
      allowance = getState().BSCModule.RMATICBep20Allowance;
    } else if (tokenType === 'reth') {
      tokenContract = new web3.eth.Contract(bscServer.getRETHTokenAbi(), bscServer.getRETHTokenAddress(), {
        from: bscAddress,
      });
      allowance = getState().BSCModule.RETHBep20Allowance;
    } else if (tokenType === 'rbnb') {
      tokenContract = new web3.eth.Contract(bscServer.getRTokenAbi(), bscServer.getRBNBTokenAddress(), {
        from: bscAddress,
      });
      allowance = getState().BSCModule.RBNBBep20Allowance;
    }
    if (!tokenContract) {
      dispatch(setLoading(false));
      dispatch(setSwapLoadingStatus(0));
      return;
    }

    const amount = web3.utils.toWei(tokenAmount.toString());
    try {
      if (Number(allowance) < Number(amount)) {
        const approveResult = await tokenContract.methods
          .approve(bridgeServer.getBridgeBep20HandlerAddress(), web3.utils.toWei('10000000'))
          .send();
        if (approveResult && approveResult.status) {
          let bridgeContract = new web3.eth.Contract(
            bridgeServer.getBridgeAbi(),
            bridgeServer.getBep20BridgeAddress(),
            {
              from: bscAddress,
            },
          );
          const sendAmount = web3.utils.toWei(getState().bridgeModule.estimateBscFee);

          let amountHex = web3.eth.abi.encodeParameter('uint256', amount);
          let len;
          let rAddressHex;
          if (destChainId === STAFI_CHAIN_ID) {
            len = '32';
            const keyringInstance = keyring.init('fis');
            rAddressHex = u8aToHex(keyringInstance.decodeAddress(address));
          } else {
            len = '20';
            rAddressHex = address;
          }
          let lenHex = web3.eth.abi.encodeParameter('uint256', len);

          let data = amountHex + lenHex.slice(2) + rAddressHex.slice(2);

          const result = await bridgeContract.methods
            .deposit(destChainId, bridgeServer.getResourceId(tokenType), data)
            .send({ value: sendAmount });

          if (result && result.status && result.transactionHash) {
            dispatch(
              add_Swap_Notice(notice_uuid, tokenStr, tokenAmount, noticeStatus.Pending, {
                swapType: 'bep20',
                destSwapType: destChainId === STAFI_CHAIN_ID ? 'native' : 'erc20',
                address: address,
              }),
            );
            dispatch(setSwapLoadingStatus(2));
            cb && cb({ txHash: result.transactionHash });
          } else {
            dispatch(setSwapLoadingStatus(0));
            message.error('Error! Please try again');
          }
        } else {
          dispatch(setSwapLoadingStatus(0));
          message.error('Error! Please try again');
        }
      } else {
        let bridgeContract = new web3.eth.Contract(bridgeServer.getBridgeAbi(), bridgeServer.getBep20BridgeAddress(), {
          from: bscAddress,
        });
        const sendAmount = web3.utils.toWei(getState().bridgeModule.estimateBscFee);

        let amountHex = web3.eth.abi.encodeParameter('uint256', amount);
        let len;
        let rAddressHex;
        if (destChainId === STAFI_CHAIN_ID) {
          len = '32';
          const keyringInstance = keyring.init('fis');
          rAddressHex = u8aToHex(keyringInstance.decodeAddress(address));
        } else {
          len = '20';
          rAddressHex = address;
        }
        let lenHex = web3.eth.abi.encodeParameter('uint256', len);

        let data = amountHex + lenHex.slice(2) + rAddressHex.slice(2);

        const result = await bridgeContract.methods
          .deposit(destChainId, bridgeServer.getResourceId(tokenType), data)
          .send({ value: sendAmount });

        if (result && result.status && result.transactionHash) {
          dispatch(
            add_Swap_Notice(notice_uuid, tokenStr, tokenAmount, noticeStatus.Pending, {
              swapType: 'bep20',
              destSwapType: destChainId === STAFI_CHAIN_ID ? 'native' : 'erc20',
              address: address,
            }),
          );
          dispatch(setSwapLoadingStatus(2));
          cb && cb({ txHash: result.transactionHash });
        } else {
          dispatch(setSwapLoadingStatus(0));
          message.error('Error! Please try again');
        }
      }
    } catch (error) {
      dispatch(setSwapLoadingStatus(0));
      message.error(error.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const slp20ToOtherSwap =
  (
    destChainId: number,
    tokenStr: string,
    tokenType: string,
    tokenAmount: any,
    address: string,
    cb?: Function,
  ): AppThunk =>
  async (dispatch, getState) => {
    try {
      const solana = solServer.getProvider();
      if (!solana) {
        message.info('Please connect your Phantom wallet');
        return;
      }
      await solana.disconnect();
      await timeout(500);
      if (solana && !solana.isConnected) {
        solServer.connectSolJs();
        await timeout(500);
        if (!solana.isConnected) {
          message.info('Please connect Phantom extension first');
          return;
        }
      }

      const localSolAddress = getState().rSOLModule.solAddress;
      const solAddress = solana.publicKey.toString();
      if (localSolAddress !== solAddress) {
        message.info('Phantom wallet address switched, please try again');
        dispatch(connectSoljs());
        return;
      }

      const notice_uuid = stafi_uuid();
      dispatch(setLoading(true));

      // Check token account
      let slpTokenMintAddress;
      if (tokenType === 'fis') {
        slpTokenMintAddress = config.slpFisTokenAddress();
      } else if (tokenType === 'rsol') {
        slpTokenMintAddress = config.slpRSolTokenAddress();
      }
      const tokenMintPublicKey = await solServer.getTokenAccountPubkey(solAddress, tokenType);
      if (!tokenMintPublicKey) {
        throw new Error('Please add the SPL token account first.');
      }

      dispatch(setSwapLoadingStatus(1));
      dispatch(setSwapWaitingTime(600));
      if (destChainId === STAFI_CHAIN_ID) {
        updateSwapParamsOfNative(dispatch, notice_uuid, tokenType, tokenAmount, address);
      }

      const transaction = new Transaction();

      const bf = crypto.createHash('sha256').update('global:transfer_out').digest();
      const methodData = bf.slice(0, 8);
      // amount, LittleEndian
      const num = BigInt(Number(tokenAmount) * 1000000000);
      const ab = new ArrayBuffer(8);
      new DataView(ab).setBigInt64(0, num, true);
      // const amountBf = hexToU8a('0x' + num.toString(16));
      const amountData = Buffer.from(ab);
      // hex: 20 00 00 00
      const addressLengthData = Buffer.from([32, 0, 0, 0]).slice(0, 4);
      const keyringInstance = keyring.init('fis');
      const addressData = keyringInstance.decodeAddress(address);
      const bufferAddressData = Buffer.from(addressData);
      const chanIdData = Buffer.from([1]).slice(0, 1);

      const data = Buffer.concat([methodData, amountData, addressLengthData, bufferAddressData, chanIdData]);
      // console.log('sdfsdfsdf', u8aToHex(data));

      const connection = new Connection(config.solRpcApi(), {
        wsEndpoint: config.solRpcWs(),
        commitment: 'singleGossip',
      });

      const bridgeAccountPubKey = new PublicKey(config.slpBridgeAccount());
      // const bridgeAccountInfo = await connection.getParsedAccountInfo(bridgeAccountPubKey);

      const instruction = new TransactionInstruction({
        keys: [
          // bridge account
          { pubkey: bridgeAccountPubKey, isSigner: false, isWritable: true },
          // fee payer
          { pubkey: solana.publicKey, isSigner: true, isWritable: false },
          // token mint account
          { pubkey: new PublicKey(slpTokenMintAddress), isSigner: false, isWritable: true },
          // from account
          { pubkey: tokenMintPublicKey, isSigner: false, isWritable: true },
          // fee receiver
          { pubkey: new PublicKey(config.slpBridgeFeeReceiver()), isSigner: false, isWritable: true },
          // token program id
          { pubkey: new PublicKey(config.slpTokenProgramId()), isSigner: false, isWritable: false },
          // system program
          { pubkey: new PublicKey(config.solanaSystemProgramId()), isSigner: false, isWritable: false },
        ],
        programId: new PublicKey(config.slpBridgeProgramId()),
        data: data,
      });
      transaction.add(instruction);

      let { blockhash } = await connection.getRecentBlockhash();
      transaction.recentBlockhash = blockhash;

      transaction.feePayer = solana.publicKey;

      let signed = await solana.signTransaction(transaction);
      let txid = await connection.sendRawTransaction(signed.serialize(), { skipPreflight: true });
      const result = await connection.confirmTransaction(txid);

      // console.log('slp bridge swap result:', result);

      if (result.value && result.value.err === null) {
        dispatch(
          add_Swap_Notice(notice_uuid, tokenStr, tokenAmount, noticeStatus.Pending, {
            swapType: 'spl',
            destSwapType: 'native',
            address: address,
          }),
        );
        dispatch(setSwapLoadingStatus(2));
        cb && cb({});
      } else {
        throw new Error('failed');
      }
    } catch (error) {
      dispatch(setSwapLoadingStatus(0));
      message.error(error.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const ics20ToOtherSwap =
  (
    destChainId: number,
    tokenStr: string,
    tokenType: string,
    tokenAmount: any,
    address: string,
    cb?: Function,
  ): AppThunk =>
  async (dispatch, getState) => {
    try {
      const stafiHubAddress = getState().StafiHubModule.stafiHubAddress;
      if (!stafiHubAddress) {
        return;
      }

      const notice_uuid = stafi_uuid();
      dispatch(setLoading(true));

      dispatch(setSwapLoadingStatus(1));
      dispatch(setSwapWaitingTime(600));
      if (destChainId === STAFI_CHAIN_ID) {
        updateSwapParamsOfNative(dispatch, notice_uuid, tokenType, tokenAmount, address);
      }

      let denom;
      if (tokenType === 'fis') {
        denom = 'ufis';
      }

      const keyringInstance = keyring.init('fis');
      const addressHex = u8aToHex(keyringInstance.decodeAddress(address));

      const response = await sendBridgeDepositTx(
        config.stafihubChainConfig(),
        stafiHubAddress,
        STAFI_CHAIN_ID,
        denom,
        numberUtil.tokenAmountToChain(tokenAmount, rSymbol.StafiHub),
        addressHex.substr(2),
      );

      if (response?.code === 0) {
        dispatch(
          add_Swap_Notice(notice_uuid, tokenStr, tokenAmount, noticeStatus.Pending, {
            swapType: 'ics20',
            destSwapType: 'native',
            address: address,
          }),
        );
        dispatch(setSwapLoadingStatus(2));
        cb && cb({});
      } else {
        throw new Error(response.rawLog || 'Something went wrong, please try again later');
      }
    } catch (error) {
      dispatch(setSwapLoadingStatus(0));
      message.error(error.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

const add_Swap_Notice =
  (uuid: string, token: string, amount: string, status: string, subData: any): AppThunk =>
  async (dispatch, getState) => {
    dispatch(add_Notice(uuid, token, noticeType.Staker, noticesubType.Swap, amount, status, subData));
  };

export const getRtokenPriceList = (): AppThunk => async (dispatch, getState) => {
  const result = await rpc.fetchRtokenPriceList();
  if (result && result.status == '80000') {
    dispatch(setPriceList(result.data));
  }
};

export const updateSwapParamsOfErc = (
  dispatch: any,
  notice_uuid: string,
  tokenType: string,
  tokenAmount: any,
  ethAddress: string,
  isInStake?: boolean,
) => {
  let tokenAbi: any;
  let tokenAddress: any;
  if (tokenType === 'fis') {
    tokenAbi = fisServer.getFISTokenAbi();
    tokenAddress = fisServer.getFISTokenAddress();
  } else if (tokenType === 'rfis') {
    tokenAbi = fisServer.getRFISTokenAbi();
    tokenAddress = fisServer.getRFISTokenAddress();
  } else if (tokenType === 'rksm') {
    tokenAbi = ksmServer.getRKSMTokenAbi();
    tokenAddress = ksmServer.getRKSMTokenAddress();
  } else if (tokenType === 'rdot') {
    tokenAbi = dotServer.getRDOTTokenAbi();
    tokenAddress = dotServer.getRDOTTokenAddress();
  } else if (tokenType === 'ratom') {
    tokenAbi = atomServer.getTokenAbi();
    tokenAddress = atomServer.getRATOMTokenAddress();
  } else if (tokenType === 'rsol') {
    tokenAbi = solServer.getTokenAbi();
    tokenAddress = solServer.getRSOLTokenAddress();
  } else if (tokenType === 'reth') {
    tokenAbi = ethServer.getRETHTokenAbi();
    tokenAddress = ethServer.getRETHTokenAddress();
  } else if (tokenType === 'rmatic') {
    tokenAbi = maticServer.getTokenAbi();
    tokenAddress = maticServer.getTokenAddress();
  }

  if (tokenAbi && tokenAddress) {
    getAssetBalance(
      ethAddress,
      tokenAbi,
      tokenAddress,
      (v: any) => {
        if (isInStake) {
          dispatch(
            setStakeSwapLoadingParams({
              noticeUuid: notice_uuid,
              address: ethAddress,
              destChainId: ETH_CHAIN_ID,
              tokenType: tokenType,
              oldBalance: v,
              tokenAbi,
              tokenAddress,
            }),
          );
        } else {
          dispatch(
            setSwapLoadingParams({
              noticeUuid: notice_uuid,
              address: ethAddress,
              destChainId: ETH_CHAIN_ID,
              amount: tokenAmount,
              tokenType: tokenType,
              oldBalance: v,
              tokenAbi,
              tokenAddress,
            }),
          );
        }
      },
      true,
    );
  }
};

export const updateSwapParamsOfBep = (
  dispatch: any,
  notice_uuid: string,
  tokenType: string,
  tokenAmount: any,
  ethAddress: string,
  isInStake?: boolean,
) => {
  let tokenAbi: any;
  let tokenAddress: any;
  if (tokenType === 'fis') {
    tokenAbi = bscServer.getFISTokenAbi();
    tokenAddress = bscServer.getFISTokenAddress();
  } else if (tokenType === 'rfis') {
    tokenAbi = bscServer.getRFISTokenAbi();
    tokenAddress = bscServer.getRFISTokenAddress();
  } else if (tokenType === 'rksm') {
    tokenAbi = bscServer.getRKSMTokenAbi();
    tokenAddress = bscServer.getRKSMTokenAddress();
  } else if (tokenType === 'rdot') {
    tokenAbi = bscServer.getRDOTTokenAbi();
    tokenAddress = bscServer.getRDOTTokenAddress();
  } else if (tokenType === 'ratom') {
    tokenAbi = bscServer.getRATOMTokenAbi();
    tokenAddress = bscServer.getRATOMTokenAddress();
  } else if (tokenType === 'rsol') {
    tokenAbi = bscServer.getRSOLTokenAbi();
    tokenAddress = bscServer.getRSOLTokenAddress();
  } else if (tokenType === 'reth') {
    tokenAbi = bscServer.getRETHTokenAbi();
    tokenAddress = bscServer.getRETHTokenAddress();
  } else if (tokenType === 'rbnb') {
    tokenAbi = bscServer.getRTokenAbi();
    tokenAddress = bscServer.getRBNBTokenAddress();
  } else if (tokenType === 'rmatic') {
    tokenAbi = bscServer.getRMATICTokenAbi();
    tokenAddress = bscServer.getRMATICTokenAddress();
  }

  if (tokenAbi && tokenAddress) {
    getBscAssetBalance(
      ethAddress,
      tokenAbi,
      tokenAddress,
      (v: any) => {
        if (isInStake) {
          dispatch(
            setStakeSwapLoadingParams({
              noticeUuid: notice_uuid,
              address: ethAddress,
              destChainId: BSC_CHAIN_ID,
              tokenType: tokenType,
              oldBalance: v,
              tokenAbi,
              tokenAddress,
            }),
          );
        } else {
          dispatch(
            setSwapLoadingParams({
              noticeUuid: notice_uuid,
              address: ethAddress,
              destChainId: BSC_CHAIN_ID,
              amount: tokenAmount,
              tokenType: tokenType,
              oldBalance: v,
              tokenAbi,
              tokenAddress,
            }),
          );
        }
      },
      true,
    );
  }
};

export const updateSwapParamsOfSlp = (
  dispatch: any,
  notice_uuid: string,
  tokenType: string,
  tokenAmount: any,
  solAddress: string,
  isInStake?: boolean,
) => {
  getSlpAssetBalance(solAddress, tokenType, (v: any) => {
    if (isInStake) {
      dispatch(
        setStakeSwapLoadingParams({
          noticeUuid: notice_uuid,
          address: solAddress,
          destChainId: SOL_CHAIN_ID,
          tokenType: tokenType,
          oldBalance: v,
        }),
      );
    } else {
      dispatch(
        setSwapLoadingParams({
          noticeUuid: notice_uuid,
          address: solAddress,
          destChainId: SOL_CHAIN_ID,
          amount: tokenAmount,
          tokenType: tokenType,
          oldBalance: v,
        }),
      );
    }
  });
};

export const updateSwapParamsOfStafiHub = (
  dispatch: any,
  notice_uuid: string,
  tokenType: string,
  tokenAmount: any,
  stafiHubAddress: string,
  isInStake?: boolean,
) => {
  let denom = '';
  if (tokenType === 'fis') {
    denom = 'ufis';
  } else if (tokenType === 'ratom') {
    denom = 'uratom';
  }
  getStafiHubAssetBalance(stafiHubAddress, denom, (v: any) => {
    if (isInStake) {
      dispatch(
        setStakeSwapLoadingParams({
          noticeUuid: notice_uuid,
          address: stafiHubAddress,
          destChainId: STAFIHUB_CHAIN_ID,
          tokenType: tokenType,
          oldBalance: v,
        }),
      );
    } else {
      dispatch(
        setSwapLoadingParams({
          noticeUuid: notice_uuid,
          address: stafiHubAddress,
          destChainId: STAFIHUB_CHAIN_ID,
          amount: tokenAmount,
          tokenType: tokenType,
          oldBalance: v,
        }),
      );
    }
  });
};

const updateSwapParamsOfNative = async (
  dispatch: any,
  notice_uuid: string,
  tokenType: string,
  tokenAmount: any,
  address: string,
) => {
  let rType;
  if (tokenType === 'rfis') {
    rType = rSymbol.Fis;
  } else if (tokenType === 'rksm') {
    rType = rSymbol.Ksm;
  } else if (tokenType === 'rdot') {
    rType = rSymbol.Dot;
  } else if (tokenType === 'ratom') {
    rType = rSymbol.Atom;
  } else if (tokenType === 'rsol') {
    rType = rSymbol.Sol;
  } else if (tokenType === 'rmatic') {
    rType = rSymbol.Matic;
  } else if (tokenType === 'reth') {
    rType = rSymbol.Eth;
  } else if (tokenType === 'rbnb') {
    rType = rSymbol.Bnb;
  }

  let data;
  if (tokenType === 'fis') {
    const api = await stafiServer.createStafiApi();
    const result = await api.query.system.account(address);
    if (result) {
      data = result.data;
    }
  } else {
    data = await commonClice.query_rBalances_account({ address }, rType);
  }
  const oldBalance = data ? Number(data.free) : 0;

  dispatch(
    setSwapLoadingParams({
      noticeUuid: notice_uuid,
      address: address,
      destChainId: STAFI_CHAIN_ID,
      amount: tokenAmount,
      tokenType: tokenType,
      oldBalance,
    }),
  );
};

export default bridgeClice.reducer;
