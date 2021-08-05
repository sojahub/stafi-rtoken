import { getSymbolRTitle, getSymbolTitle, isdev } from '@config/index';
import { rSymbol, Symbol } from '@keyring/defaults';
import { web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import { u8aToHex } from '@polkadot/util';
import { createSlice } from '@reduxjs/toolkit';
import keyring from '@servers/index';
import StafiServer from '@servers/stafi';
import { stafi_uuid } from '@util/common';
import numberUtil from '@util/numberUtil';
import { message } from 'antd';
import { AppThunk } from '../store';
import CommonClice from './commonClice';
import { add_Notice, noticeStatus, noticesubType, noticeType } from './noticeClice';

const commonClice = new CommonClice();
const stafiServer = new StafiServer();

const dexClice = createSlice({
  name: 'dexModule',
  initialState: {
    // 0-invisible, 1-start transferring, 2-start minting
    swapLoadingStatus: 0,
    swapWaitingTime: 150,
  },
  reducers: {
    setSwapLoadingStatus(state, { payload }) {
      state.swapLoadingStatus = payload;
    },
    setSwapWaitingTime(state, { payload }) {
      state.swapWaitingTime = payload;
    },
  },
});

export const { setSwapLoadingStatus, setSwapWaitingTime } = dexClice.actions;

export const swap =
  (tokenSymbol: rSymbol, tokenAmount: any, address: string, cb?: Function): AppThunk =>
  async (dispatch: any, getState: any) => {
    try {
      dispatch(setSwapLoadingStatus(1));
      if (isdev()) {
        dispatch(setSwapWaitingTime(30));
      } else {
        dispatch(setSwapWaitingTime(30));
      }
      web3Enable(stafiServer.getWeb3EnalbeName());
      const injector: any = await web3FromSource(stafiServer.getPolkadotJsSource());
      const api = await stafiServer.createStafiApi();
      const notice_uuid = stafi_uuid();
      let currentAccount = getState().FISModule.fisAccount.address;

      const fee = await api.query.rDexnSwap.swapFees(tokenSymbol);
      if (fee && fee.toJSON()) {
        console.log('swapFees: ', numberUtil.dexFisFeeToHuman(fee.toJSON()));
      }

      const keyringInstance = keyring.init(Symbol.Atom);
      const receiver = u8aToHex(keyringInstance.decodeAddress(address));

      const tokenAmount2 = numberUtil.tokenAmountToChain(tokenAmount, tokenSymbol);
      const ratio: any = await commonClice.rTokenRate(tokenSymbol);
      const liquidityRate: any = await commonClice.rLiquidityRate(tokenSymbol);
      const minReceived = tokenAmount2 * ratio * liquidityRate * 0.99;
      const shouldReceived = numberUtil.handleFisRoundToFixed(tokenAmount * ratio * liquidityRate);

      const grade = 0;

      dispatch(
        add_Swap_Notice(notice_uuid, getSymbolRTitle(tokenSymbol), tokenAmount, noticeStatus.Pending, {
          destTokenName: getSymbolTitle(tokenSymbol),
          receivedAmount: shouldReceived,
          address: address,
        }),
      );

      api.tx.rDexnSwap
        .swapRtokenForNativeToken(receiver, tokenSymbol, tokenAmount2.toString(), minReceived.toString(), grade)
        .signAndSend(currentAccount, { signer: injector.signer }, (result: any) => {
          console.log('xxxxxxxxxxxx', result);
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
                      // if (tokenType == 'rfis') {
                      //   message_str = 'Something is wrong, please make sure you have enough FIS and rFIS balance';
                      // } else if (tokenType == 'rdot') {
                      //   message_str = 'Something is wrong, please make sure you have enough FIS and rDOT balance';
                      // } else if (tokenType == 'rksm') {
                      //   message_str = 'Something is wrong, please make sure you have enough FIS and rKSM balance';
                      // } else if (tokenType == 'ratom') {
                      //   message_str = 'Something is wrong, please make sure you have enough FIS and rATOM balance';
                      // } else if (tokenType == 'rsol') {
                      //   message_str = 'Something is wrong, please make sure you have enough FIS and rSOL balance';
                      // } else if (tokenType == 'rmatic') {
                      //   message_str = 'Something is wrong, please make sure you have enough FIS and rMATIC balance';
                      // }
                      if (error.name == 'ServicePaused') {
                        message_str = 'Service is paused, please try again later!';
                      }
                      dispatch(setSwapLoadingStatus(0));
                      message.error(message_str);
                    } catch (error) {
                      console.log('dex swap error 1');
                      dispatch(setSwapLoadingStatus(0));
                      message.error(error.message);
                    }
                  }
                } else if (method === 'ExtrinsicSuccess') {
                  dispatch(setSwapLoadingStatus(2));
                  dispatch(
                    add_Swap_Notice(notice_uuid, getSymbolRTitle(tokenSymbol), tokenAmount, noticeStatus.Pending, {
                      destTokenName: getSymbolTitle(tokenSymbol),
                      receivedAmount: shouldReceived,
                      address: address,
                    }),
                  );
                  cb && cb();
                }
              });
          } else if (result.isError) {
            console.log('dex swap error 2');
            message.error(result.toHuman());
          }
        })
        .catch((err: any) => {
          dispatch(setSwapLoadingStatus(0));
          message.error(err.message);
        });

      return;
    } catch (error) {
      dispatch(setSwapLoadingStatus(0));
      message.error(error.message);
    }
  };

const add_Swap_Notice =
  (uuid: string, token: string, amount: string, status: string, subData: any): AppThunk =>
  async (dispatch, getState) => {
    dispatch(add_Notice(uuid, token, noticeType.Staker, noticesubType.DexSwap, amount, status, subData));
  };

export default dexClice.reducer;
