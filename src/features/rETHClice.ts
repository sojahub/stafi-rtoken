// @ts-nocheck

import { stringToHex, u8aToHex } from '@polkadot/util';
import { keccakAsHex } from '@polkadot/util-crypto';
import { createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';
import config, { isdev } from 'src/config/index';
import { rSymbol, Symbol } from 'src/keyring/defaults';
import EthServer from 'src/servers/eth/index';
import FeeStationServer from 'src/servers/feeStation';
import keyring from 'src/servers/index';
import RpcServer, { pageCount } from 'src/servers/rpc/index';
import { localStorage_currentEthPool, localStorage_poolPubKey, stafi_uuid } from 'src/util/common';
import numberUtil from 'src/util/numberUtil';
import NumberUtil from 'src/util/numberUtil';
import StringUtil from 'src/util/stringUtil';
import Web3 from 'web3';
import { AppThunk } from '../store';
import CommonClice from './commonClice';
import { getAssetBalance } from './ETHClice';
import { setSwapLoadingStatus, uploadSwapInfo } from './feeStationClice';
import { setLoading, trackEvent } from './globalClice';
import { add_Notice, noticeStatus, noticesubType, noticeType } from './noticeClice';

const ethServer = new EthServer();
const rpcServer = new RpcServer();
const feeStationServer = new FeeStationServer();
const commonClice = new CommonClice();

const rETHClice = createSlice({
  name: 'rETHModule',
  initialState: {
    chainId: '',
    ratio: '--',
    ratioShow: '--',
    balance: '--',
    minimumDeposit: '--',
    waitingStaked: '--',
    totalStakedAmount: '--',
    stakerApr: '--',
    validatorApr: '--',
    poolStakerApr: '--',
    poolValidatorApr: '--',
    isPoolWaiting: true,
    poolCount: '--',
    rethAmount: '--',
    depositWaitingStaked: '--',
    waitingPoolCount: '--',
    poolAddress: null,
    poolAddressItems: [],
    currentPoolStatus: null,
    currentTotalDeposit: 0,
    selfDeposited: '--',
    status_Apr: '--',
    totalStakedETH: '--',
    totalStakedETHShow: '--',
    addressItems: [],
    matchedValidators: '--',
    unmatchedValidators: '--',
    poolStatusTotalRETH: '--',
    poolStatusUnmatchedETH: '--',
    stakingPoolDetail: null,
    runCount: 0,
    ethAmount: 4,
    rewardList: [],
    rewardList_lastdata: null,
    lastEraRate: '--',
    nativeTokenAmount: '--',
    unbondCommission: '--',
    nativerTokenRate: '--',
  },
  reducers: {
    setRatio(state, { payload }) {
      state.ratio = payload;
    },
    setBalance(state, { payload }) {
      state.balance = payload;
    },
    setMinimumDeposit(state, { payload }) {
      state.minimumDeposit = payload;
    },
    setWaitingStaked(state, { payload }) {
      state.waitingStaked = payload;
    },
    setTotalStakedAmount(state, { payload }) {
      state.totalStakedAmount = payload;
    },
    setStakerApr(state, { payload }) {
      state.stakerApr = payload;
    },
    setIsPoolWaiting(state, { payload }) {
      state.isPoolWaiting = payload;
    },
    setPoolCount(state, { payload }) {
      state.poolCount = payload;
    },
    setRethAmount(state, { payload }) {
      state.rethAmount = payload;
    },
    setRatioShow(state, { payload }) {
      state.ratioShow = payload;
    },
    setValidatorApr(state, { payload }) {
      state.validatorApr = payload;
    },
    setDepositWaitingStaked(state, { payload }) {
      state.depositWaitingStaked = payload;
    },
    setWaitingPoolCount(state, { payload }) {
      state.waitingPoolCount = payload;
    },
    setPoolAddress(state, { payload }) {
      state.poolAddress = payload;
    },
    setPoolAddressItems(state, { payload }) {
      state.poolAddressItems = payload;
    },
    setCurrentPoolStatus(state, { payload }) {
      state.currentPoolStatus = payload;
    },
    setCurrentTotalDeposit(state, { payload }) {
      state.currentTotalDeposit = payload;
    },
    setSelfDeposited(state, { payload }) {
      state.selfDeposited = payload;
    },
    setStatus_Apr(state, { payload }) {
      state.status_Apr = payload;
    },
    setTotalStakedETH(state, { payload }) {
      state.totalStakedETH = payload;
    },
    setTotalStakedETHShow(state, { payload }) {
      state.totalStakedETHShow = payload;
    },
    setAddressItems(state, { payload }) {
      state.addressItems = payload;
    },
    setPoolStakerApr(state, { payload }) {
      state.poolStakerApr = payload;
    },
    setPoolMatchedValidators(state, { payload }) {
      state.matchedValidators = payload;
    },
    setPoolValidatorApr(state, { payload }) {
      state.poolValidatorApr = payload;
    },
    setUnmatchedValidators(state, { payload }) {
      state.unmatchedValidators = payload;
    },
    setPoolStatusTotalRETH(state, { payload }) {
      state.poolStatusTotalRETH = payload;
    },
    setPoolStatusUnmatchedETH(state, { payload }) {
      state.poolStatusUnmatchedETH = payload;
    },
    setStakingPoolDetail(state, { payload }) {
      state.stakingPoolDetail = payload;
    },
    setRunCount(state, { payload }) {
      state.runCount = payload;
    },
    setEthAmount(state, { payload }) {
      state.ethAmount = payload;
    },
    setRewardList(state, { payload }) {
      state.rewardList = payload;
    },
    setRewardList_lastdata(state, { payload }) {
      state.rewardList_lastdata = payload;
    },
    setLastEraRate(state, { payload }) {
      state.lastEraRate = payload;
    },
    setNativeTokenAmount(state, { payload }) {
      state.nativeTokenAmount = payload;
    },
    setUnbondCommission(state, { payload }) {
      state.unbondCommission = payload;
    },
    setNativerTokenRate(state, { payload }) {
      state.nativerTokenRate = payload;
    },
  },
});

export const {
  setRatio,
  setBalance,
  setMinimumDeposit,
  setWaitingStaked,
  setTotalStakedAmount,
  setStakerApr,
  setIsPoolWaiting,
  setPoolCount,
  setRethAmount,
  setRatioShow,
  setValidatorApr,
  setDepositWaitingStaked,
  setWaitingPoolCount,
  setPoolAddress,
  setPoolAddressItems,
  setCurrentPoolStatus,
  setCurrentTotalDeposit,
  setSelfDeposited,
  setStatus_Apr,
  setTotalStakedETH,
  setTotalStakedETHShow,
  setAddressItems,
  setPoolStakerApr,
  setPoolMatchedValidators,
  setPoolValidatorApr,
  setUnmatchedValidators,
  setPoolStatusTotalRETH,
  setPoolStatusUnmatchedETH,
  setStakingPoolDetail,
  setRunCount,
  setEthAmount,
  setRewardList,
  setRewardList_lastdata,
  setLastEraRate,
  setNativeTokenAmount,
  setUnbondCommission,
  setNativerTokenRate,
} = rETHClice.actions;

declare const window: any;
declare const ethereum: any;

export const checkAddressChecksum = (address: string) => {
  // Check each case
  address = address.replace(/^0x/i, '');
  var addressHash = keccakAsHex(address.toLowerCase()).substr(2);

  for (var i = 0; i < 40; i++) {
    // the nth letter should be uppercase if the nth digit of casemap is 1
    if (
      (parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) ||
      (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])
    ) {
      return false;
    }
  }
  return true;
};

export const checkEthAddress = (address: string) => {
  // check if it has the basic requirements of an address
  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    return false;
    // If it's ALL lowercase or ALL upppercase
  } else if (/^(0x|0X)?[0-9a-f]{40}$/.test(address) || /^(0x|0X)?[0-9A-F]{40}$/.test(address)) {
    return true;
    // Otherwise check each case
  } else {
    return checkAddressChecksum(address);
  }
};

export const reloadData = (): AppThunk => async (dispatch, getState) => {
  dispatch(rTokenRate());
  dispatch(get_eth_getBalance());
  dispatch(getMinimumDeposit());

  dispatch(getStakerApr());
  dispatch(getValidatorApr());
  dispatch(getNextCapacity());
  dispatch(getPoolCount());
  dispatch(getRethAmount());
  dispatch(getNodeStakingPoolCount());
  dispatch(getDepositBalance());
  dispatch(getSelfDeposited());
  dispatch(setRunCount(0));
};

export const rTokenRate = (): AppThunk => async (dispatch, getState) => {
  let web3 = ethServer.getWeb3FromPlatform('Ethereum');
  if (!web3) {
    return;
  }
  let contract = new web3.eth.Contract(ethServer.getRETHTokenAbi(), ethServer.getRETHTokenAddress());
  const amount = web3.utils.toWei('1');
  const result = await contract.methods.getEthValue(amount).call();
  let ratio = web3.utils.fromWei(result, 'ether');
  dispatch(setRatio(ratio));
};

export const get_eth_getBalance = (): AppThunk => async (dispatch, getState) => {
  if (isdev() && !config.metaMaskNetworkIsGoerliEth(getState().globalModule.metaMaskNetworkId)) {
    // console.log('current metaMaskNetwork:', getState().globalModule.metaMaskNetworkId);
    // return;
  }

  let web3 = ethServer.getWeb3();
  if (!getState().globalModule.metaMaskAddress) {
    return;
  }
  const address = getState().globalModule.metaMaskAddress;
  const result = await ethereum.request({ method: 'eth_getBalance', params: [address, 'latest'] });
  const balance = web3.utils.fromWei(result, 'ether');
  dispatch(setBalance(balance));
};

export const getMinimumDeposit = (): AppThunk => async (dispatch, getState) => {
  let web3 = ethServer.getWeb3();
  const address = getState().globalModule.metaMaskAddress;
  let userDepositContract = new web3.eth.Contract(
    ethServer.getStafiUserDepositAbi(),
    ethServer.getStafiUserDepositAddress(),
    {
      from: address,
    },
  );
  const result = await userDepositContract.methods.getMinimumDeposit().call();
  const minimumDeposit = web3.utils.fromWei(result, 'ether');
  dispatch(setMinimumDeposit(minimumDeposit));
};

export const getNextCapacity = (): AppThunk => async (dispatch, getState) => {
  let web3 = ethServer.getWeb3();
  const address = getState().globalModule.metaMaskAddress;
  let poolQueueContract = new web3.eth.Contract(
    ethServer.getStafiStakingPoolQueueAbi(),
    ethServer.getStafiStakingPoolQueueAddress(),
    {
      from: address,
    },
  );
  let userDepositContract = new web3.eth.Contract(
    ethServer.getStafiUserDepositAbi(),
    ethServer.getStafiUserDepositAddress(),
    {
      from: address,
    },
  );
  const nextCapacity = await poolQueueContract.methods.getNextCapacity().call();

  if (nextCapacity > 0) {
    const result = await userDepositContract.methods.getBalance().call();
    let balance = parseFloat(web3.utils.fromWei(result, 'ether'));
    const waitingStaked = NumberUtil.handleEthAmountToFixed(balance);
    dispatch(setWaitingStaked(waitingStaked));
  } else {
    dispatch(setIsPoolWaiting(false));
    // const result = await ethServer.getStakingPoolStatus();
    const result = await ethServer.getEthPoolData();
    if (result.status === '80000') {
      if (result.data) {
        if (result.data.allEth) {
          const totalStakedAmount = NumberUtil.handleEthAmountToFixed(Web3.utils.fromWei(result.data.allEth));
          dispatch(setTotalStakedAmount(totalStakedAmount));
        }
      }
    }
  }
};

export const getStakerApr = (): AppThunk => async (dispatch, getState) => {
  const result = await ethServer.getEthPoolData();
  if (result.status == '80000') {
    if (result.data && result.data.stakeApr) {
      const apr = numberUtil.amount_format(result.data.stakeApr, 1) + '%';
      dispatch(setStakerApr(apr));
    }
  }
};

export const getValidatorApr = (): AppThunk => async (dispatch, getState) => {
  const result = await ethServer.getArp(2);
  if (result.status == '80000') {
    if (result.data && result.data.validatorApr) {
      const apr = result.data.validatorApr + '%';
      dispatch(setValidatorApr(apr));
    }
  }
};

export const getPoolCount = (): AppThunk => async (dispatch, getState) => {
  let web3 = ethServer.getWeb3();
  const address = getState().globalModule.metaMaskAddress;
  let managerContract = new web3.eth.Contract(
    ethServer.getStafiStakingPoolManagerAbi(),
    ethServer.getStafiStakingPoolManagerAddress(),
    {
      from: address,
    },
  );
  const poolCount = await managerContract.methods.getStakingPoolCount().call();
  dispatch(setPoolCount(poolCount));
};

export const send =
  (value: Number, cb?: Function): AppThunk =>
    async (dispatch, getState) => {
      dispatch(setLoading(true));
      let web3 = ethServer.getWeb3();
      const address = getState().globalModule.metaMaskAddress;
      let contract = new web3.eth.Contract(ethServer.getStafiUserDepositAbi(), ethServer.getStafiUserDepositAddress(), {
        from: address,
      });
      const amount = web3.utils.toWei(value.toString());
      try {
        let timeout = setTimeout(() => {
          message.warning('Tx is pending to be finalized, please check it later');
          dispatch(setLoading(false));
        }, 5 * 60 * 1000);
        const result = await contract.methods.deposit().send({ value: amount });
        clearTimeout(timeout);
        dispatch(setLoading(false));
        if (result && result.status) {
          message.success('Deposit successfully');
          const txHash = result.transactionHash;
          dispatch(
            add_ETH_Staker_stake_Notice(stafi_uuid(), value.toString(), noticeStatus.Confirmed, { address, txHash }),
          );
          cb && cb();
        } else {
          dispatch(add_ETH_Staker_stake_Notice(stafi_uuid(), value.toString(), noticeStatus.Error));
          message.error('Error! Please try again');
        }
      } catch (error) {
        dispatch(setLoading(false));
        message.error(error.message);
      }
    };

export const swapEthForFis =
  (
    poolAddress: string,
    amountparam: string,
    receiveFisAmountParam: any,
    minOutFisAmountParam: any,
    cb?: Function,
  ): AppThunk =>
    async (dispatch, getState) => {
      try {
        dispatch(setLoading(true));
        dispatch(setSwapLoadingStatus(1));
        const notice_uuid = stafi_uuid();
        let web3 = ethServer.getWeb3();
        const address = getState().globalModule.metaMaskAddress;
        if (!address) {
          dispatch(setSwapLoadingStatus(0));
          return;
        }

        const fiskeyringInstance = keyring.init(Symbol.Fis);
        const stafiAddress = u8aToHex(fiskeyringInstance.decodeAddress(getState().FISModule.fisAccount.address));
        const data = stringToHex(getState().FISModule.fisAccount.address);

        dispatch(setSwapLoadingStatus(3));
        const signature = await ethereum
          .request({
            method: 'personal_sign',
            params: [address, data],
          })
          .catch((err: any) => {
            message.error(err.message);
          });

        if (!signature) {
          dispatch(setSwapLoadingStatus(0));
          return;
        }

        dispatch(setSwapLoadingStatus(1));
        message.info('Signature completed, proceeding to transfer');
        dispatch(
          trackEvent('fee_station_signature_success', {
            tokenType: 'eth',
          }),
        );

        let bundleAddressId: string;
        try {
          const res = await feeStationServer.postBundleAddress({
            stafiAddress,
            symbol: 'ETH',
            poolAddress,
            signature,
            pubKey: address,
          });
          if (res.status === '80000' && res.data) {
            bundleAddressId = res.data.bundleAddressId;
          }
        } catch (err: any) { }

        if (!bundleAddressId) {
          dispatch(setLoading(false));
          dispatch(setSwapLoadingStatus(0));
          message.error('The service is temporarily unavailable, please try again later');
          return;
        } else {
          dispatch(
            trackEvent('fee_station_get_bundleAddressId_success', {
              tokenType: 'eth',
            }),
          );
        }

        const amount = web3.utils.toWei(amountparam.toString(), 'ether');
        const amountHex = web3.utils.toHex(amount);
        const minOutFisAmount = NumberUtil.tokenAmountToChain(minOutFisAmountParam, rSymbol.Fis);
        const transactionParameters = {
          value: amountHex,
          gas: '0x54647',
          to: poolAddress,
          from: address,
          chainId: config.ethChainId(),
        };
        const txHash = await ethereum
          .request({
            method: 'eth_sendTransaction',
            params: [transactionParameters],
          })
          .catch((err: any) => {
            message.error(err.message);
          });

        if (!txHash) {
          message.error('send transaction failed');
          dispatch(setSwapLoadingStatus(0));
          return;
        }

        dispatch(
          trackEvent('fee_station_transfer_success', {
            tokenType: 'eth',
          }),
        );

        dispatch(
          add_ETH_Staker_feeStation_Notice(notice_uuid, amountparam, noticeStatus.Pending, {
            receiveFisAmount: receiveFisAmountParam,
            fisAddress: getState().FISModule.fisAccount && getState().FISModule.fisAccount.address,
            symbol: 'ETH',
            txHash: txHash,
            signature,
            pubKey: address,
            inAmount: amount.toString(),
            minOutAmount: minOutFisAmount.toString(),
            stafiAddress,
            poolAddress,
            bundleAddressId,
          }),
        );

        let txDetail;
        while (true) {
          await sleep(3000);
          txDetail = await ethereum
            .request({
              method: 'eth_getTransactionByHash',
              params: [txHash],
            })
            .catch((err: any) => {
              message.error(err.message);
            });

          if (txDetail.blockHash || !txDetail) {
            break;
          }
        }

        const blockHash = txDetail && txDetail.blockHash;

        if (!blockHash) {
          dispatch(setSwapLoadingStatus(0));
          return;
        }

        dispatch(get_eth_getBalance());
        dispatch(
          add_ETH_Staker_feeStation_Notice(notice_uuid, amountparam, noticeStatus.Pending, {
            receiveFisAmount: receiveFisAmountParam,
            fisAddress: getState().FISModule.fisAccount && getState().FISModule.fisAccount.address,
            symbol: 'ETH',
            txHash: txHash,
            blockHash: blockHash,
            signature,
            pubKey: address,
            inAmount: amount.toString(),
            minOutAmount: minOutFisAmount.toString(),
            stafiAddress,
            poolAddress,
            bundleAddressId,
          }),
        );

        dispatch(setSwapLoadingStatus(2));
        const params = {
          stafiAddress,
          symbol: 'ETH',
          blockHash,
          txHash: txHash,
          poolAddress,
          signature,
          pubKey: address,
          inAmount: amount.toString(),
          minOutAmount: minOutFisAmount.toString(),
          bundleAddressId,
        };
        dispatch(uploadSwapInfo(params));
        blockHash && cb && cb({ ...params, noticeUuid: notice_uuid });
      } finally {
        dispatch(setLoading(false));
      }
    };

function sleep(ms: any) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const getRethAmount = (): AppThunk => async (dispatch, getState) => {
  const address = getState().globalModule.metaMaskAddress;
  getAssetBalance(address, ethServer.getRETHTokenAbi(), ethServer.getRETHTokenAddress(), (v: any) => {
    dispatch(setRethAmount(v));
  });
};

export const getNativeRethAmount = (): AppThunk => async (dispatch, getState) => {
  commonClice.query_rBalances_account(getState().FISModule.fisAccount, rSymbol.Eth, (data: any) => {
    if (data == null) {
      dispatch(setNativeTokenAmount(NumberUtil.handleFisAmountToFixed(0)));
    } else {
      dispatch(setNativeTokenAmount(NumberUtil.tokenAmountToHuman(data.free, rSymbol.Eth)));
    }
  });
};

export const nativerTokenRate = (): AppThunk => async (dispatch, getState) => {
  const ratio = await commonClice.rTokenRate(rSymbol.Eth);
  dispatch(setNativerTokenRate(ratio));
};

export const getUnbondCommission = (): AppThunk => async (dispatch, getState) => {
  const unbondCommission = await commonClice.getUnbondCommission();
  dispatch(setUnbondCommission(unbondCommission));
};

export const getDepositBalance = (): AppThunk => async (dispatch, getState) => {
  const address = getState().globalModule.metaMaskAddress;
  let web3 = ethServer.getWeb3();
  let userDepositContract = new web3.eth.Contract(
    ethServer.getStafiUserDepositAbi(),
    ethServer.getStafiUserDepositAddress(),
    {
      from: address,
    },
  );

  const result = await userDepositContract.methods.getBalance().call();
  let balance = parseFloat(web3.utils.fromWei(result, 'ether'));
  const waitingStaked = NumberUtil.handleEthAmountToFixed(balance);
  dispatch(setDepositWaitingStaked(waitingStaked));
  if (Number(waitingStaked) <= 0) {
    let poolQueueContract = new web3.eth.Contract(
      ethServer.getStafiStakingPoolQueueAbi(),
      ethServer.getStafiStakingPoolQueueAddress(),
      {
        from: address,
      },
    );

    const waitingPoolCount = await poolQueueContract.methods.getLength(2).call();
    if (waitingPoolCount > 0) {
      dispatch(setWaitingPoolCount(waitingPoolCount));
    } else {
      dispatch(setWaitingPoolCount(0));
    }
  }
};

export const handleDeposit =
  (ethAmount: Number, cb?: Function): AppThunk =>
    async (dispatch, getState) => {
      let web3 = ethServer.getWeb3();
      let contract = new web3.eth.Contract(ethServer.getStafiNodeDepositAbi(), ethServer.getStafiNodeDepositAddress(), {
        from: ethereum.selectedAddress,
      });
      const amount = web3.utils.toWei(ethAmount.toString());

      dispatch(setLoading(true));
      let timeout = setTimeout(() => {
        message.warning('Tx is pending to be finalized, please check it later');
        dispatch(setLoading(false));
      }, 5 * 60 * 1000);
      try {
        const result = await contract.methods.deposit().send({ value: amount });
        dispatch(setLoading(false));
        clearTimeout(timeout);
        if (result && result.status) {
          message.success('Deposit successfully');
          dispatch(add_ETH_validator_deposit_Notice(stafi_uuid(), ethAmount.toString(), noticeStatus.Confirmed));
          cb && cb('ok');
        } else {
          message.error('Error! Please try again');
          dispatch(add_ETH_validator_deposit_Notice(stafi_uuid(), ethAmount.toString(), noticeStatus.Error));
          cb && cb('error');
        }
      } catch (error) {
        dispatch(setLoading(false));
        clearTimeout(timeout);
        message.error(error.message);
      }
    };

// export const setCurrentEthPool=(validatorAddress:string, poolAddress:string)=>{
//     setLocalStorageItem(Keys.rEthCurrentPoolPrefix+validatorAddress,poolAddress);
// }
// export const getCurrentEthPool=(validatorAddress:string)=>{
//     return getLocalStorageItem(Keys.rEthCurrentPoolPrefix+validatorAddress );
// }

export const getNodeStakingPoolCount = (): AppThunk => async (dispatch, getState) => {
  let web3 = ethServer.getWeb3();
  const currentAddress = getState().globalModule.metaMaskAddress;
  const poolAddressItems = [];
  let contract = new web3.eth.Contract(
    ethServer.getStafiStakingPoolManagerAbi(),
    ethServer.getStafiStakingPoolManagerAddress(),
    {
      from: currentAddress,
    },
  );

  const poolCount = await contract.methods.getNodeStakingPoolCount(currentAddress).call();
  if (poolCount > 0) {
    let currentPool = localStorage_currentEthPool.getCurrentEthPool(currentAddress);
    for (let index = 0; index < poolCount; index++) {
      const poolAddress = await contract.methods.getNodeStakingPoolAt(currentAddress, index).call();
      poolAddressItems.push(poolAddress);
      if (currentPool) {
        if (currentPool == poolAddress) {
          dispatch(handleCurrentPool(poolAddress));
          dispatch(setPoolAddress(poolAddress));
        }
      } else if (index == poolCount - 1) {
        dispatch(setPoolAddress(poolAddress));
        dispatch(handleCurrentPool(poolAddress));
        localStorage_currentEthPool.setCurrentEthPool(currentAddress, poolAddress);
      }
    }
    dispatch(setPoolAddressItems(poolAddressItems));
  } else {
    dispatch(setPoolAddressItems([]));
    dispatch(setCurrentTotalDeposit(0));
    dispatch(setCurrentPoolStatus(0));

    dispatch(setPoolAddress(null));
  }
};

export const handleCurrentPool =
  (currentPoolAddress: string): AppThunk =>
    async (dispatch, getState) => {
      let web3 = ethServer.getWeb3();
      const currentAddress = getState().globalModule.metaMaskAddress;
      let poolContract = new web3.eth.Contract(ethServer.getStafiStakingPoolAbi(), currentPoolAddress, {
        from: currentAddress,
      });
      const status = await poolContract.methods.getStatus().call();
      dispatch(setCurrentPoolStatus(status));

      dispatch(setPoolAddress(currentPoolAddress));
      let currentTotalDeposit = 0;

      const nodeDepositBalance = await poolContract.methods.getNodeDepositBalance().call();
      currentTotalDeposit += parseFloat(web3.utils.fromWei(nodeDepositBalance, 'ether'));
      // this.currentTotalDepositShow = NumberUtil.handleEthRoundToFixed(this.currentTotalDeposit);

      const userDepositBalance = await poolContract.methods.getUserDepositBalance().call();
      currentTotalDeposit += parseFloat(web3.utils.fromWei(userDepositBalance, 'ether'));
      // this.currentTotalDepositShow = NumberUtil.handleEthRoundToFixed(this.currentTotalDeposit);

      const nodeRefundBalance = await poolContract.methods.getNodeRefundBalance().call();
      currentTotalDeposit += parseFloat(web3.utils.fromWei(nodeRefundBalance, 'ether'));
      // this.currentTotalDepositShow = NumberUtil.handleEthRoundToFixed(this.currentTotalDeposit);
      dispatch(setCurrentTotalDeposit(NumberUtil.handleEthRoundToFixed(currentTotalDeposit)));
    };

export const handleOffboard =
  (cb?: Function): AppThunk =>
    async (dispatch, getState) => {
      let web3 = ethServer.getWeb3();
      const currentPoolAddress = getState().rETHModule.poolAddress;

      const currentAddress = getState().globalModule.metaMaskAddress;
      const currentPoolStatus = getState().rETHModule.currentPoolStatus;
      let poolContract = new web3.eth.Contract(ethServer.getStafiStakingPoolAbi(), currentPoolAddress, {
        from: currentAddress,
      });
      dispatch(setLoading(true));
      let timeout = setTimeout(() => {
        message.warning('Tx is pending to be finalized, please check it later');
        dispatch(setLoading(false));
      }, 5 * 60 * 1000);
      if (currentPoolStatus == 4) {
        try {
          const result = await poolContract.methods.close().send();
          dispatch(setLoading(false));
          clearTimeout(timeout);
          if (result && result.status) {
            message.success('Offboard successfully');
            dispatch(add_ETH_validator_offboard_Notice(stafi_uuid(), noticeStatus.Confirmed));
            cb && cb();
            dispatch(reloadData());
          } else {
            dispatch(add_ETH_validator_offboard_Notice(stafi_uuid(), noticeStatus.Error));
            message.error('Error! Please try again');
          }
        } catch (error) {
          dispatch(setLoading(false));
          clearTimeout(timeout);
          message.error(error.message);
        }
      } else {
        try {
          const result = await poolContract.methods.dissolve().send();

          if (result && result.status) {
            dispatch(setCurrentPoolStatus(4));
            try {
              const closeResult = await poolContract.methods.close().send();
              dispatch(setLoading(false));
              clearTimeout(timeout);
              if (closeResult && closeResult.status) {
                dispatch(setCurrentPoolStatus(0));
                message.success('Offboard successfully');
                dispatch(reloadData());
                cb && cb();
              } else {
                message.error('Error! Please try again');
              }
            } catch (error) {
              dispatch(setLoading(false));
              clearTimeout(timeout);
              message.error(error.message);
            }
          } else {
            dispatch(setLoading(false));
            clearTimeout(timeout);
            message.error('Error! Please try again');
          }
        } catch (error) {
          clearTimeout(timeout);
          dispatch(setLoading(false));
          message.error(error.message);
        }
      }
    };

export const handleStake =
  (validatorKeys: any[], cb?: Function): AppThunk =>
    async (dispatch, getState) => {
      let web3 = ethServer.getWeb3();
      const currentAddress = getState().globalModule.metaMaskAddress;
      const currentPoolAddress = getState().rETHModule.poolAddress;

      let poolContract = new web3.eth.Contract(ethServer.getStafiStakingPoolAbi(), currentPoolAddress, {
        from: currentAddress,
      });

      dispatch(setLoading(true));
      try {
        let timeout = setTimeout(() => {
          message.warning('Tx is pending to be finalized, please check it later');
          dispatch(setLoading(false));
        }, 5 * 60 * 1000);
        let pubkey = '0x' + validatorKeys[0].pubkey;
        const result = await poolContract.methods
          .stake(pubkey, '0x' + validatorKeys[0].signature, '0x' + validatorKeys[0].deposit_data_root)
          .send();
        dispatch(setLoading(false));
        clearTimeout(timeout);
        if (result && result.status) {
          localStorage_poolPubKey.setPoolPubKey(currentPoolAddress, pubkey);
          message.success('Stake successfully');
          dispatch(add_ETH_validator_stake_Notice(stafi_uuid(), noticeStatus.Confirmed));
          cb && cb('ok');
        } else {
          message.error('Error! Please try again');
          dispatch(add_ETH_validator_stake_Notice(stafi_uuid(), noticeStatus.Error));
          cb && cb('error');
        }
      } catch (error) {
        dispatch(setLoading(false));
        message.error(error.message);
      }
    };

export const getSelfDeposited = (): AppThunk => async (dispatch, getState) => {
  let web3 = ethServer.getWeb3();
  const currentAddress = getState().globalModule.metaMaskAddress;
  let contract = new web3.eth.Contract(
    ethServer.getStafiStakingPoolManagerAbi(),
    ethServer.getStafiStakingPoolManagerAddress(),
    {
      from: currentAddress,
    },
  );
  dispatch(setTotalStakedETH('--'));
  dispatch(setAddressItems([]));
  dispatch(setSelfDeposited('--'));
  let addressItems: any[] = [];
  let pubKeys = [];
  let pubKeyMap = new Map();
  let selfDeposited = 0;

  dispatch(setLoading(true));
  try {
    const poolCount = await contract.methods.getNodeStakingPoolCount(currentAddress).call();
    if (poolCount > 0) {
      for (let index = 0; index < poolCount; index++) {
        const poolAddress = await contract.methods.getNodeStakingPoolAt(currentAddress, index).call();
        let data = {
          address: poolAddress,
          shortAddress: StringUtil.replacePkh(poolAddress, 4, 38),
          status: -1,
        };
        addressItems.push(data);

        let pubKey = localStorage_poolPubKey.getPoolPubKey(poolAddress);
        if (pubKey) {
          pubKeys.push(pubKey);
          pubKeyMap.set(pubKey, poolAddress.toLowerCase());
          dispatch(
            updateStatus(pubKeys, pubKeyMap, poolCount, addressItems, (e: any[]) => {
              addressItems = e;
              dispatch(setAddressItems(addressItems));
            }),
          );
        } else {
          const poolPubkey = await contract.methods.getStakingPoolPubkey(poolAddress).call();
          if (poolPubkey) {
            pubKeys.push(poolPubkey);
            pubKeyMap.set(poolPubkey, poolAddress.toLowerCase());
            localStorage_poolPubKey.setPoolPubKey(poolAddress, poolPubkey);
          } else {
            pubKeys.push('');
          }
          dispatch(
            updateStatus(pubKeys, pubKeyMap, poolCount, addressItems, (e: any[]) => {
              addressItems = e;
              dispatch(setAddressItems(addressItems));
            }),
          );
        }

        let poolContract = new web3.eth.Contract(ethServer.getStafiStakingPoolAbi(), poolAddress, {
          from: currentAddress,
        });

        const status = await poolContract.methods.getStatus().call();
        if (status == 4) {
          addressItems.some((item) => {
            if (item.address.toLowerCase() == poolAddress.toLowerCase()) {
              item.status = 8;
              return true;
            }
          });
        }

        const depositBalance = await poolContract.methods.getNodeDepositBalance().call();
        let parsedDepositBalance = parseFloat(web3.utils.fromWei(depositBalance, 'ether'));
        selfDeposited += parsedDepositBalance;
        // this.selfDepositedShow = NumberUtil.handleEthRoundToFixed(this.selfDeposited);
      }
    } else {
      dispatch(setTotalStakedETH(0));
      dispatch(setStatus_Apr('--%'));
    }
    // dispatch(setAddressItems(addressItems))
    dispatch(setLoading(false));
    dispatch(setSelfDeposited(selfDeposited));
  } catch (error) {
    dispatch(setLoading(false));
  }
};

export const updateStatus =
  (pubKeys: any[], pubKeyMap: any, poolCount: Number, addressItems: any[], cb: Function): AppThunk =>
    async (dispatch, getState) => {
      if (pubKeys.length == poolCount) {
        let validPubKeys: any[] = [];

        pubKeys.forEach((pubkey) => {
          if (pubkey) {
            validPubKeys.push(pubkey);
          }
        });

        if (validPubKeys.length == 0) {
          addressItems.forEach((item) => {
            item.status = 7;
          });
          dispatch(setTotalStakedETH(0));
          cb && cb(addressItems);
          return;
        }
        const result = await ethServer.getPoolist({ pubkeyList: JSON.stringify(validPubKeys) });

        if (result && result.status == '80000') {
          if (result.data) {
            let totalStakeAmount = 0;
            if (result.data.allStakeAmount) {
              totalStakeAmount = result.data.allStakeAmount;
            }
            if (result.data.apr) {
              dispatch(setStatus_Apr(result.data.apr + '%'));
            }
            if (result.data.list) {
              let remoteDataItems = result.data.list;
              let map = new Map();
              remoteDataItems.forEach((remoteItem: any) => {
                if (remoteItem.pubkey) {
                  map.set(pubKeyMap.get(remoteItem.pubkey), remoteItem);
                  if (remoteItem.status == 7) {
                    totalStakeAmount = Number(totalStakeAmount) + 32;
                  }
                }
              });
              let newAddressItems = addressItems.map((item) => {
                let key = item.address.toLowerCase();

                if (map.has(key)) {
                  return { ...item, status: map.get(key).status == 7 ? 2 : map.get(key).status };
                } else {
                  return { ...item, status: 7 };
                }
              });
              cb && cb(newAddressItems);
            }
            dispatch(setTotalStakedETH(totalStakeAmount));
          }
        }
      }
    };

export const getStakingPoolStatus = (): AppThunk => async (dispatch, getState) => {
  const result = await ethServer.getEthPoolData();
  if (result.status == '80000') {
    if (result.data) {
      if (result.data.stakedEth) {
        const totalStakedAmount = NumberUtil.handleEthAmountToFixed(Web3.utils.fromWei(result.data.stakedEth));
        dispatch(setTotalStakedAmount(totalStakedAmount));
      }
      if (result.data.validatorApr) {
        dispatch(setPoolValidatorApr(numberUtil.amount_format(result.data.validatorApr, 1) + '%'));
      }
      if (result.data.stakeApr) {
        dispatch(setPoolStakerApr(numberUtil.amount_format(result.data.stakeApr, 1) + '%'));
      }
      if (result.data.matchedValidators) {
        dispatch(setPoolMatchedValidators(result.data.matchedValidators));

      }
    }
  }
};

export const getUnmatchedValidators = (): AppThunk => async (dispatch, getState) => {
  const web3 = ethServer.getWeb3();
  const address = getState().globalModule.metaMaskAddress;
  let poolQueueContract = new web3.eth.Contract(
    ethServer.getStafiStakingPoolQueueAbi(),
    ethServer.getStafiStakingPoolQueueAddress(),
    {
      from: address,
    },
  );

  const result = await poolQueueContract.methods.getLength('2').call();
  //  this.unmatchedValidators = result;
  dispatch(setUnmatchedValidators(result));
};

export const getTotalRETH = (): AppThunk => async (dispatch, getState) => {
  const address = getState().globalModule.metaMaskAddress;
  let web3 = ethServer.getWeb3();
  let contract = new web3.eth.Contract(ethServer.getRETHTokenAbi(), ethServer.getRETHTokenAddress(), {
    from: address,
  });
  const result = await contract.methods.totalSupply().call();
  let totalRETH = parseFloat(web3.utils.fromWei(result, 'ether'));
  dispatch(setPoolStatusTotalRETH(NumberUtil.handleEthAmountToFixed(totalRETH)));
};
export const getUnmatchedETH = (): AppThunk => async (dispatch, getState) => {
  const address = getState().globalModule.metaMaskAddress;
  let web3 = ethServer.getWeb3();
  let userContract = new web3.eth.Contract(ethServer.getStafiUserDepositAbi(), ethServer.getStafiUserDepositAddress(), {
    from: address,
  });

  const result = await userContract.methods.getBalance().call();
  let unmatchedETH = parseFloat(web3.utils.fromWei(result, 'ether'));
  dispatch(setPoolStatusUnmatchedETH(NumberUtil.handleEthAmountToFixed(unmatchedETH)));
};

export const getPoolInfo =
  (poolAddress: string): AppThunk =>
    async (dispatch, getState) => {
      dispatch(setStakingPoolDetail(null));
      const currentAddress = getState().globalModule.metaMaskAddress;

      let poolPubkey = localStorage_poolPubKey.getPoolPubKey(poolAddress);
      if (poolPubkey) {
        dispatch(getStakingPoolDetail(poolAddress, poolPubkey));
        return;
      }

      let web3 = ethServer.getWeb3();
      let contract = new web3.eth.Contract(
        ethServer.getStafiStakingPoolManagerAbi(),
        ethServer.getStafiStakingPoolManagerAddress(),
        {
          from: currentAddress,
        },
      );
      const pubkey = await contract.methods.getStakingPoolPubkey(poolAddress).call();
      if (pubkey) {
        localStorage_poolPubKey.setPoolPubKey(poolAddress, pubkey);
        dispatch(getStakingPoolDetail(poolAddress, pubkey));
      } else {
        let poolContract = new web3.eth.Contract(ethServer.getStafiStakingPoolAbi(), poolAddress, {
          from: currentAddress,
        });

        const depositBalance = await poolContract.methods.getUserDepositBalance().call();
        if (depositBalance == 0) {
          dispatch(setStakingPoolDetail({ status: 0, currentBalance: '8.00', effectiveBalance: '8.00' }));
        } else {
          dispatch(setStakingPoolDetail({ status: 0, currentBalance: '32.00', effectiveBalance: '32.00' }));
        }
      }
    };

export const getStakingPoolDetail =
  (poolAddress: string, pubkey: any): AppThunk =>
    async (dispatch, getState) => {
      ethServer.getPoolInfo(poolAddress, pubkey).then((result) => {
        if (result.status == '80000' && result.data) {
          if (result.data.status != 7) {
            let detail: any = {};
            detail.status = result.data.status;
            detail.currentBalance = result.data.currentBalance;
            detail.effectiveBalance = NumberUtil.handleEthGweiToFixed(parseFloat(result.data.effectiveBalance));
            detail.activationEligibilityEpoch = result.data.activationeligibilityepoch;
            detail.activationEpoch = result.data.activeSince;
            detail.apr = result.data.apr + '%';

            let income = result.data.income;
            if (income && Array.isArray(income) && income.length > 0) {
              detail.rewardDetails = income;
            }
            dispatch(setStakingPoolDetail(detail));
          } else {
            dispatch(setStakingPoolDetail({ status: 1, currentBalance: '32.00', effectiveBalance: '32.00' }));
          }
        }
      });
    };

export const getDepositAmount = (): AppThunk => async (dispatch, getState) => {
  const web3 = ethServer.getWeb3();
  const currentAddress = getState().globalModule.metaMaskAddress;
  let nodeDepositContract = new web3.eth.Contract(
    ethServer.getStafiNodeDepositAbi(),
    ethServer.getStafiNodeDepositAddress(),
    {
      from: currentAddress,
    },
  );

  const depositAmount = await nodeDepositContract.methods.getCurrentNodeDepositAmount().call();
  dispatch(setEthAmount(web3.utils.fromWei(depositAmount, 'ether')));
  let nodeManagerContract = new web3.eth.Contract(
    ethServer.getStafiNodeManagerAbi(),
    ethServer.getStafiNodeManagerAddress(),
    {
      from: currentAddress,
    },
  );
  const trusted = await nodeManagerContract.methods.getNodeTrusted(currentAddress).call();
  if (trusted) {
    dispatch(setEthAmount('0'));
  }
};

export const rewardDetails = [
  {
    cycle: '1 day',
    reward: '--',
  },
  {
    cycle: '3 day',
    reward: '--',
  },
  {
    cycle: '7 day',
    reward: '--',
  },
];

export const getReward =
  (pageIndex: Number, cb: Function): AppThunk =>
    async (dispatch, getState) => {
      dispatch(setLoading(true));
      try {
        if (pageIndex === 0) {
          dispatch(setRewardList([]));
          dispatch(setRewardList_lastdata(null));
        }
        const result = await rpcServer.getReward('', getState().globalModule.metaMaskAddress, -1, pageIndex);
        if (result.status === 80000) {
          const rewardList = getState().rETHModule.rewardList;
          if (result.data.rewardList.length > 0) {
            const list = result.data.rewardList.map((item: any) => {
              const rate = NumberUtil.tokenAmountToHuman(item.rate, rSymbol.Eth);
              const rbalance = NumberUtil.tokenAmountToHuman(item.rbalance, rSymbol.Eth);
              return {
                ...item,
                rbalance: rbalance,
                rate: rate,
              };
            });
            if (result.data.rewardList.length <= pageCount) {
              dispatch(setRewardList_lastdata(null));
            } else {
              dispatch(setRewardList_lastdata(list[list.length - 1]));
              list.pop();
            }
            dispatch(setRewardList([...rewardList, ...list]));
            dispatch(setLoading(false));
            if (result.data.rewardList.length <= pageCount) {
              cb && cb(false);
            } else {
              cb && cb(true);
            }
          } else {
            dispatch(setLoading(false));
            cb && cb(false);
          }
        } else {
          dispatch(setLoading(false));
        }
      } catch (error) {
        dispatch(setLoading(false));
      }
    };

export const getLastEraRate = (): AppThunk => async (dispatch, getState) => {
  const ethAddress = getState().globalModule.metaMaskAddress;
  const result = await rpcServer.getReward('', ethAddress, -1, 0);
  if (result.status === 80000) {
    if (result.data.rewardList.length > 1) {
      const list = result.data.rewardList.map((item: any) => {
        const rate = NumberUtil.tokenAmountToHuman(item.rate, rSymbol.Eth);
        const rbalance = NumberUtil.tokenAmountToHuman(item.rbalance, rSymbol.Eth);
        return {
          ...item,
          rbalance: rbalance,
          rate: rate,
        };
      });
      dispatch(setLastEraRate((list[0].rate - list[1].rate) * list[1].rbalance));
    } else {
      dispatch(setLastEraRate(0));
    }
  } else if (result.status === 301) {
    dispatch(setLastEraRate(0));
  } else {
    dispatch(setLastEraRate('--'));
  }
};

//validator-Deposit

const add_ETH_Staker_stake_Notice =
  (uuid: string, amount: string, status: string, subData?: any): AppThunk =>
    async (dispatch, getState) => {
      dispatch(add_ETH_Notice(uuid, noticeType.Staker, noticesubType.Stake, amount, status, subData));
    };

const add_ETH_Staker_feeStation_Notice =
  (uuid: string, amount: string, status: string, subData?: any): AppThunk =>
    async (dispatch, getState) => {
      dispatch(add_ETH_Notice(uuid, noticeType.Staker, noticesubType.FeeStation, amount, status, subData));
    };

const add_ETH_validator_deposit_Notice =
  (uuid: string, amount: string, status: string, subData?: any): AppThunk =>
    async (dispatch, getState) => {
      dispatch(add_ETH_Notice(uuid, noticeType.Validator, noticesubType.Deposit, amount, status, subData));
    };
const add_ETH_validator_stake_Notice =
  (uuid: string, status: string, subData?: any): AppThunk =>
    async (dispatch, getState) => {
      dispatch(add_ETH_Notice(uuid, noticeType.Validator, noticesubType.Stake, '', status, subData));
    };
const add_ETH_validator_offboard_Notice =
  (uuid: string, status: string, subData?: any): AppThunk =>
    async (dispatch, getState) => {
      dispatch(add_ETH_Notice(uuid, noticeType.Validator, noticesubType.Offboard, '', status, subData));
    };

const add_ETH_Notice =
  (uuid: string, type: string, subType: string, content: string, status: string, subData?: any): AppThunk =>
    async (dispatch, getState) => {
      dispatch(add_Notice(uuid, Symbol.Eth, type, subType, content, status, subData));
    };
export default rETHClice.reducer;
