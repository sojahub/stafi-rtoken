import { web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import { u8aToHex } from '@polkadot/util';
import { createSlice } from '@reduxjs/toolkit';
import AtomServer from '@servers/atom';
import BridgeServer from '@servers/bridge';
import BscServer from '@servers/bsc';
import EthServer from '@servers/eth';
import keyring from '@servers/index';
import KsmServer from '@servers/ksm';
import MaticServer from '@servers/matic';
import DotServer from '@servers/polkadot';
import SolServer from '@servers/sol';
import StafiServer from '@servers/stafi';
import Stafi from '@servers/stafi/index';
import { stafi_uuid } from '@util/common';
import NumberUtil from '@util/numberUtil';
import rpc from '@util/rpc';
import { message } from 'antd';
import { AppThunk } from '../store';
import { setLoading } from './globalClice';
import { add_Notice, noticeStatus, noticesubType, noticeType, update_NoticeNew } from './noticeClice';

export const STAFI_CHAIN_ID = 1;
export const ETH_CHAIN_ID = 2;
export const BSC_CHAIN_ID = 3;

const bridgeServer = new BridgeServer();
const bscServer = new BscServer();
const stafiServer = new StafiServer();
const ethServer = new EthServer();
const ksmServer = new KsmServer();
const dotServer = new DotServer();
const atomServer = new AtomServer();
const solServer = new SolServer();
const maticServer = new MaticServer();
const bridgeClice = createSlice({
  name: 'bridgeModule',
  initialState: {
    erc20EstimateFee: '--',
    bep20EstimateFee: '--',
    estimateEthFee: '--',
    estimateBscFee: '--',
    priceList: [],
    // 0-invisible, 1-start transferring, 2-start minting
    swapLoadingStatus: 0,
  },
  reducers: {
    setErc20EstimateFee(state, { payload }) {
      state.erc20EstimateFee = payload;
    },
    setBep20EstimateFee(state, { payload }) {
      state.bep20EstimateFee = payload;
    },
    setEstimateEthFee(state, { payload }) {
      state.estimateEthFee = payload;
    },
    setEstimateBscFee(state, { payload }) {
      state.estimateBscFee = payload;
    },
    setPriceList(state, { payload }) {
      state.priceList = payload;
    },
    setSwapLoadingStatus(state, { payload }) {
      state.swapLoadingStatus = payload;
    },
  },
});

export const {
  setErc20EstimateFee,
  setBep20EstimateFee,
  setEstimateEthFee,
  setEstimateBscFee,
  setPriceList,
  setSwapLoadingStatus,
} = bridgeClice.actions;

//Native to ERC20
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
  } catch (e) {}
};

//ERC20 to Native
export const getBridgeEstimateEthFee = (): AppThunk => async (dispatch, getState) => {
  dispatch(setEstimateEthFee(bridgeServer.getBridgeEstimateEthFee()));
  dispatch(setEstimateBscFee(bridgeServer.getBridgeEstimateBscFee()));
};

export const nativeToOtherSwap =
  (chainId: any, tokenStr: string, tokenType: string, tokenAmount: any, ethAddress: string, cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setLoading(true));
      dispatch(setSwapLoadingStatus(1));
      web3Enable(stafiServer.getWeb3EnalbeName());
      const injector: any = await web3FromSource(stafiServer.getPolkadotJsSource());
      const api = await stafiServer.createStafiApi();
      const notice_uuid = stafi_uuid();
      let currentAccount = getState().FISModule.fisAccount.address;
      let tx: any = '';
      if (tokenType == 'fis') {
        const amount = NumberUtil.tokenAmountToChain(tokenAmount.toString());
        tx = await api.tx.bridgeSwap.transferNative(amount.toString(), ethAddress, chainId);
      } else {
        let rsymbol = bridgeServer.getRsymbolByTokenType(tokenType);
        const amount = NumberUtil.tokenAmountToChain(tokenAmount.toString(), rsymbol);
        tx = await api.tx.bridgeSwap.transferRtoken(rsymbol, amount.toString(), ethAddress, chainId);
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
                    let message_str = 'Something is wrong, please make sure you have enough FIS balance';
                    if (tokenType == 'rfis') {
                      message_str = 'Something is wrong, please make sure you have enough FIS and rFIS balance';
                    } else if (tokenType == 'rdot') {
                      message_str = 'Something is wrong, please make sure you have enough FIS and rDOT balance';
                    } else if (tokenType == 'rksm') {
                      message_str = 'Something is wrong, please make sure you have enough FIS and rKSM balance';
                    } else if (tokenType == 'ratom') {
                      message_str = 'Something is wrong, please make sure you have enough FIS and rATOM balance';
                    } else if (tokenType == 'rsol') {
                      message_str = 'Something is wrong, please make sure you have enough FIS and rSOL balance';
                    } else if(tokenType == 'rmatic') {
                      message_str = 'Something is wrong, please make sure you have enough FIS and rMATIC balance';
                    }
                    if (error.name == 'ServicePaused') {
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
                    destSwapType: chainId === BSC_CHAIN_ID ? 'bep20' : 'erc20',
                    address: ethAddress,
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
    let web3 = ethServer.getWeb3();

    let tokenContract: any = '';
    let allowance: any = 0;
    const ethAddress = getState().rETHModule.ethAccount.address;
    if (tokenType == 'fis') {
      tokenContract = new web3.eth.Contract(stafiServer.getFISTokenAbi(), stafiServer.getFISTokenAddress(), {
        from: ethAddress,
      });
      allowance = getState().ETHModule.FISErc20Allowance;
    } else if (tokenType == 'rfis') {
      tokenContract = new web3.eth.Contract(stafiServer.getRFISTokenAbi(), stafiServer.getRFISTokenAddress(), {
        from: ethAddress,
      });
      allowance = getState().ETHModule.RFISErc20Allowance;
    } else if (tokenType == 'rksm') {
      tokenContract = new web3.eth.Contract(ksmServer.getRKSMTokenAbi(), ksmServer.getRKSMTokenAddress(), {
        from: ethAddress,
      });
      allowance = getState().ETHModule.RKSMErc20Allowance;
    } else if (tokenType == 'rdot') {
      tokenContract = new web3.eth.Contract(dotServer.getRDOTTokenAbi(), dotServer.getRDOTTokenAddress(), {
        from: ethAddress,
      });
      allowance = getState().ETHModule.RDOTErc20Allowance;
    } else if (tokenType == 'ratom') {
      tokenContract = new web3.eth.Contract(atomServer.getTokenAbi(), atomServer.getRATOMTokenAddress(), {
        from: ethAddress,
      });
      allowance = getState().ETHModule.RATOMErc20Allowance;
    } else if (tokenType == 'rsol') {
      tokenContract = new web3.eth.Contract(solServer.getTokenAbi(), solServer.getRSOLTokenAddress(), {
        from: ethAddress,
      });
      allowance = getState().ETHModule.RSOLErc20Allowance;
    } else if (tokenType == 'rmatic') {
      tokenContract = new web3.eth.Contract(maticServer.getTokenAbi(), maticServer.getTokenAddress(), {
        from: ethAddress,
      });
      allowance = getState().ETHModule.RMaticErc20Allowance;
    } else if (tokenType == 'reth') {
      tokenContract = new web3.eth.Contract(ethServer.getRETHTokenAbi(), ethServer.getRETHTokenAddress(), {
        from: ethAddress,
      });
      allowance = getState().ETHModule.RETHErc20Allowance;
    }
    if (!tokenContract) {
      dispatch(setLoading(false));
      dispatch(setSwapLoadingStatus(0));
      return;
    }

    const notice_uuid = stafi_uuid();
    const amount = web3.utils.toWei(tokenAmount.toString());
    try {
      if (Number(allowance) < Number(amount)) {
        const approveResult = await tokenContract.methods
          .approve(bridgeServer.getBridgeErc20HandlerAddress(), web3.utils.toWei('10000000'))
          .send();
        if (approveResult && approveResult.status) {
          let bridgeContract = new web3.eth.Contract(bridgeServer.getBridgeAbi(), bridgeServer.getBridgeAddress(), {
            from: ethAddress,
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
          from: ethAddress,
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
    dispatch(setLoading(true));
    dispatch(setSwapLoadingStatus(1));
    let web3 = ethServer.getWeb3();

    let tokenContract: any = '';
    let allowance: any = 0;
    const bscAddress = getState().BSCModule.bscAccount.address;
    if (tokenType == 'fis') {
      tokenContract = new web3.eth.Contract(bscServer.getFISTokenAbi(), bscServer.getFISTokenAddress(), {
        from: bscAddress,
      });
      allowance = getState().BSCModule.FISBep20Allowance;
    } else if (tokenType == 'rfis') {
      tokenContract = new web3.eth.Contract(bscServer.getRFISTokenAbi(), bscServer.getRFISTokenAddress(), {
        from: bscAddress,
      });
      allowance = getState().BSCModule.RFISBep20Allowance;
    } else if (tokenType == 'rksm') {
      tokenContract = new web3.eth.Contract(bscServer.getRKSMTokenAbi(), bscServer.getRKSMTokenAddress(), {
        from: bscAddress,
      });
      allowance = getState().BSCModule.RKSMBep20Allowance;
    } else if (tokenType == 'rdot') {
      tokenContract = new web3.eth.Contract(bscServer.getRDOTTokenAbi(), bscServer.getRDOTTokenAddress(), {
        from: bscAddress,
      });
      allowance = getState().BSCModule.RDOTBep20Allowance;
    } else if (tokenType == 'ratom') {
      tokenContract = new web3.eth.Contract(bscServer.getRATOMTokenAbi(), bscServer.getRATOMTokenAddress(), {
        from: bscAddress,
      });
      allowance = getState().BSCModule.RATOMBep20Allowance;
    } else if (tokenType == 'rsol') {
      tokenContract = new web3.eth.Contract(bscServer.getRSOLTokenAbi(), bscServer.getRSOLTokenAddress(), {
        from: bscAddress,
      });
      allowance = getState().BSCModule.RSOLBep20Allowance;
    } else if (tokenType == 'rmatic') {
      tokenContract = new web3.eth.Contract(bscServer.getRMATICTokenAbi(), bscServer.getRMATICTokenAddress(), {
        from: bscAddress,
      });
      allowance = getState().BSCModule.RMATICBep20Allowance;
    } else if (tokenType == 'reth') {
      tokenContract = new web3.eth.Contract(bscServer.getRETHTokenAbi(), bscServer.getRETHTokenAddress(), {
        from: bscAddress,
      });
      allowance = getState().BSCModule.RETHBep20Allowance;
    }
    if (!tokenContract) {
      dispatch(setLoading(false));
      dispatch(setSwapLoadingStatus(0));
      return;
    }

    const notice_uuid = stafi_uuid();
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

const add_Swap_Notice =
  (uuid: string, token: string, amount: string, status: string, subData: any): AppThunk =>
  async (dispatch, getState) => {
    dispatch(add_Notice(uuid, token, noticeType.Staker, noticesubType.Swap, amount, status, subData));
  };

const update_Swap_Notice =
  (uuid: string, token: string, amount: string, status: string, subData: any): AppThunk =>
  async (dispatch, getState) => {
    dispatch(update_NoticeNew(uuid, token, noticeType.Staker, noticesubType.Swap, amount, status, subData));
  };

export const getRtokenPriceList = (): AppThunk => async (dispatch, getState) => {
  const result = await rpc.fetchRtokenPriceList();
  if (result && result.status == '80000') {
    dispatch(setPriceList(result.data));
  }
};

export default bridgeClice.reducer;
