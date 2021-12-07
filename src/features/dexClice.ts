// @ts-nocheck

import { web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import { u8aToHex } from '@polkadot/util';
import { createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';
import { getSymbolByRSymbol, getSymbolRTitle, getSymbolTitle } from 'src/config/index';
import { rSymbol } from 'src/keyring/defaults';
import keyring from 'src/servers/index';
import StafiServer from 'src/servers/stafi';
import { stafi_uuid } from 'src/util/common';
import numberUtil from 'src/util/numberUtil';
import { AppThunk } from '../store';
import { setLoading } from './globalClice';
import { add_Notice, noticeStatus, noticesubType, noticeType } from './noticeClice';

const stafiServer = new StafiServer();

const dexClice = createSlice({
  name: 'dexModule',
  initialState: {
    // 0-invisible, 1-start transferring, 2-start minting
    swapLoadingStatus: 0,
    swapWaitingTime: 150,
    swapLoadingParams: null,
  },
  reducers: {
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

export const { setSwapLoadingStatus, setSwapWaitingTime, setSwapLoadingParams } = dexClice.actions;

export const swap =
  (
    tokenSymbol: rSymbol,
    tokenAmount: any,
    address: string,
    minReceived: any,
    shouldReceived: any,
    cb?: Function,
  ): AppThunk =>
  async (dispatch: any, getState: any) => {
    try {
      if (tokenSymbol === rSymbol.Fis) {
        dispatch(setLoading(true));
      } else {
        dispatch(setSwapLoadingStatus(1));
        dispatch(setSwapWaitingTime(300));
      }
      web3Enable(stafiServer.getWeb3EnalbeName());
      const injector: any = await web3FromSource(stafiServer.getPolkadotJsSource());
      const api = await stafiServer.createStafiApi();
      const notice_uuid = stafi_uuid();
      let currentAccount = getState().FISModule.fisAccount.address;

      const keyringInstance = keyring.init(getSymbolByRSymbol(tokenSymbol));
      const receiver = u8aToHex(keyringInstance.decodeAddress(address));

      const tokenAmountChain = numberUtil.tokenAmountToChain(tokenAmount, tokenSymbol);
      const minReceivedChain = numberUtil.tokenAmountToChain(minReceived, tokenSymbol);

      const grade = 0;

      const swapFunc =
        tokenSymbol === rSymbol.Fis
          ? api.tx.rDexnSwap.swapRfisForFisToken(
              receiver,
              tokenAmountChain.toString(),
              minReceivedChain.toString(),
              grade,
            )
          : api.tx.rDexnSwap.swapRtokenForNativeToken(
              receiver,
              tokenSymbol,
              tokenAmountChain.toString(),
              minReceivedChain.toString(),
              grade,
            );

      swapFunc
        .signAndSend(currentAccount, { signer: injector.signer }, (result: any) => {
          if (result.status.isInBlock) {
            result.events
              .filter((obj: any) => obj.event.section === 'system')
              .forEach(({ event: { data, method } }: any) => {
                if (method === 'ExtrinsicFailed') {
                  const [dispatchError] = data;
                  if (dispatchError.isModule) {
                    try {
                      const mod = dispatchError.asModule;
                      let message_str = 'Something is wrong, please make sure you have enough FIS balance';
                      try {
                        const error = data.registry.findMetaError(
                          new Uint8Array([mod.index.toNumber(), mod.error.toNumber()]),
                        );

                        if (error && error.name === 'ServicePaused') {
                          message_str = 'Service is paused, please try again later!';
                        }
                      } catch (err: any) {
                        if (mod.index.toNumber() === 45 && mod.error.toNumber() === 11) {
                          message_str = 'The price is fluctuating, please refresh the page and try again';
                        } else {
                          throw err;
                        }
                      }

                      dispatch(setSwapLoadingStatus(0));
                      dispatch(setLoading(false));
                      message.error(message_str);
                    } catch (error) {
                      console.log('dex swap error 1');
                      dispatch(setSwapLoadingStatus(0));
                      dispatch(setLoading(false));
                      message.error(error.message);
                    }
                  }
                } else if (method === 'ExtrinsicSuccess') {
                  if (tokenSymbol !== rSymbol.Fis) {
                    api.rpc.chain.getBlock(result.status.asInBlock.toString()).then((res: any) => {
                      dispatch(
                        setSwapLoadingParams({
                          noticeUuid: notice_uuid,
                          blockHeight: res.block.header.number.toString(),
                          tokenSymbol: tokenSymbol,
                        }),
                      );
                    });

                    dispatch(setSwapLoadingStatus(2));
                  } else {
                    dispatch(setLoading(false));
                  }

                  dispatch(
                    add_Swap_Notice(
                      notice_uuid,
                      getSymbolRTitle(tokenSymbol),
                      tokenAmount,
                      tokenSymbol !== rSymbol.Fis ? noticeStatus.Pending : noticeStatus.Confirmed,
                      {
                        destTokenName: getSymbolTitle(tokenSymbol),
                        receivedAmount: shouldReceived,
                        address: address,
                        block: result.status.asInBlock.toString(),
                        tokenSymbol: tokenSymbol,
                      },
                    ),
                  );
                  cb && cb();
                }
              });
          } else if (result.isError) {
            console.log('dex swap error 2');
            dispatch(setSwapLoadingStatus(0));
            dispatch(setLoading(false));
            message.error(result.toHuman());
          }
        })
        .catch((err: any) => {
          dispatch(setSwapLoadingStatus(0));
          dispatch(setLoading(false));
          message.error(err.message);
        });

      return;
    } catch (error) {
      dispatch(setSwapLoadingStatus(0));
      dispatch(setLoading(false));
      message.error(error.message);
    }
  };

const add_Swap_Notice =
  (uuid: string, token: string, amount: string, status: string, subData: any): AppThunk =>
  async (dispatch, getState) => {
    dispatch(add_Notice(uuid, token, noticeType.Staker, noticesubType.DexSwap, amount, status, subData));
  };

export default dexClice.reducer;
