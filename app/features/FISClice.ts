import { createSlice } from '@reduxjs/toolkit';
import { message as M } from 'antd';
import { AppThunk, RootState } from '../store';
import stafi from '@util/SubstrateApi';
import { processStatus, setProcessSlider, setProcessSending } from './globalClice';
import {
  web3Enable,
  web3FromSource,
} from '@polkadot/extension-dapp';

import NumberUtil from '@util/numberUtil';

import { setLocalStorageItem, getLocalStorageItem, Keys } from '@util/common'

const FISClice = createSlice({
  name: 'FISModule',
  initialState: {
    fisAccounts: [],
    fisAccount: getLocalStorageItem(Keys.FisAccountKey),     //选中的fis账号,
    validPools: [{
      address: "35YDFz3yasaShG3Jb6jVk6FgMqCrPVWk2iF3cHLFTzLPgDgF"

    }, {
      address: "32FDY8ksrm1ihB7NWJ5U5dojPiwoXJtLpajytb6GvkGKURXd"
    }],
    transferrableAmountShow: 0,
    ratio: 0
  },
  reducers: {
    setFisAccounts(state, { payload }) {
      const accounts = state.fisAccounts;
      const account = accounts.find((item: any) => {
        return item.address == payload.address;
      })
      if (account) {
        account.balance = payload.balance;
      } else {
        state.fisAccounts.push(payload)
      }
    },
    setFisAccount(state, { payload }) {
      setLocalStorageItem(Keys.FisAccountKey, payload)
      state.fisAccount = payload;
    },
    setTransferrableAmountShow(state, { payload }) {
      state.transferrableAmountShow = payload;
    },
    setRatio(state, { payload }) {
      state.ratio = payload;
    }
  },
});

export const { setFisAccounts, setFisAccount, setTransferrableAmountShow, setRatio } = FISClice.actions;

export const createSubstrate = (account: any): AppThunk => async (dispatch, getState) => {
  queryBalance(account, dispatch, getState)
}

const queryBalance = async (account: any, dispatch: any, getState: any) => {
  dispatch(setFisAccounts(account));
  let account2: any = { ...account }
  const api = await stafi.createStafiApi();
  const result = await api.query.system.account(account2.address);
  if (result) {
    let fisFreeBalance = NumberUtil.fisAmountToHuman(result.data.free);
    account2.balance = NumberUtil.handleEthAmountRound(fisFreeBalance);
  }
  const fisAccount = getState().FISModule.fisAccount;
  if (fisAccount && fisAccount.address == account2.address) {
    dispatch(setFisAccount(account2));
  }
  dispatch(setFisAccounts(account2));
}

export const transfer = (amount: string): AppThunk => async (dispatch, getState) => {
  dispatch(setProcessSlider(true));
  const validPools = getState().FISModule.validPools;
  const address = getState().FISModule.fisAccount.address;
  web3Enable(stafi.getWeb3EnalbeName());
  const injector = await web3FromSource(stafi.getPolkadotJsSource())
  const stafiApi = await stafi.createStafiApi(); 
  stafiApi.tx.balances.transfer(validPools[0].address, amount.toString()).signAndSend(address, { signer: injector.signer }, (result: any) => {
    try { 
      // console.log(result.status.asInBlock, result.status.asInBlock.toHex().toString(), stafiApi.hash, "==========exHash")
      dispatch(setProcessSending({
        brocasting: processStatus.success,
        packing: processStatus.default,
        finalizing: processStatus.default,
        checkTx: ''
      }));
      if (result.status.isInBlock) {
        const blockHash = result.status.asInBlock.toHex().toString();
        result.events
          .filter((e: any) => {
            return e.event.section == "system"
          }).forEach((data: any) => {
            if (data.event.method === 'ExtrinsicFailed') {
              const [dispatchError] = data.event.data;
              if (dispatchError.isModule) {
                try {
                  const mod = dispatchError.asModule;
                  const error = data.registry.findMetaError(new Uint8Array([mod.index.toNumber(), mod.error.toNumber()]));

                  let message: string = 'Something is wrong, please try again later!';
                  if (error.name == '') {
                    message = '';
                  }
                  message && M.info(message);
                } catch (error) {
                  M.error(error.message);
                }
              }
              dispatch(setProcessSending({
                brocasting: processStatus.success,
                packing: processStatus.failure,
                finalizing: processStatus.default,
                checkTx: blockHash
              }));
            } else if (data.event.method === 'ExtrinsicSuccess') {
              M.success('Successfully');
              dispatch(setProcessSending({
                brocasting: processStatus.success,
                packing: processStatus.success,
                finalizing: processStatus.default,
                checkTx: blockHash
              }));
            }
          })
      } else if (result.isError) {
        M.error(result.toHuman());
      }
      console.log(result.status)
      if (result.status.isFinalized) {
        const blockHash = result.status.asInBlock.toHex().toString();
        dispatch(setProcessSending({
          brocasting: processStatus.success,
          packing: processStatus.success,
          finalizing: processStatus.success,
          checkTx: blockHash
        }));
      }else if (result.status.isFinalized==false) {
        const blockHash = result.status.asInBlock.toHex().toString();
        dispatch(setProcessSending({
          brocasting: processStatus.success,
          packing: processStatus.success,
          finalizing: processStatus.failure,
          checkTx: blockHash
        }));
      }
    } catch (e: any) {
      M.error(e.message)
    }
  });


}

export const balancesAll = (): AppThunk => async (dispatch, getState) => {
  const api = await stafi.createStafiApi();
  const address = getState().FISModule.fisAccount.address;
  const result = await api.derive.balances.all(address);
  if (result) {
    const transferrableAmount = NumberUtil.fisAmountToHuman(result.availableBalance);
    const transferrableAmountShow = NumberUtil.handleFisAmountToFixed(transferrableAmount);
    dispatch(setTransferrableAmountShow(transferrableAmountShow));
  }
}


export const rTokenRate = (): AppThunk => async (dispatch, getState) => {
  const api = await stafi.createStafiApi();
  const result = await api.query.rTokenRate.rate(0);   //1代表DOT    0代表FIS
  const ratio = NumberUtil.fisAmountToHuman(result.toJSON());
  dispatch(setRatio(ratio))
}



export default FISClice.reducer;