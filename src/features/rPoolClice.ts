// @ts-nocheck

import { createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';
import { cloneDeep } from 'lodash';
import config from 'src/config/index';
import { Symbol } from 'src/keyring/defaults';
import EthServer from 'src/servers/eth';
import RPoolServer from 'src/servers/rpool';
import rpc from 'src/util/rpc';
import { stafi_uuid } from 'src/util/common';
import { AppThunk } from '../store';
import { setLoading } from './globalClice';
import { add_Notice, noticeStatus, noticesubType, noticeType } from './noticeClice';

const lpActs: Array<any> = [
  // {
  //   name: 'rETH/ETH LP',
  //   extraName: 'rETH',
  //   children: [
  //     {
  //       platform: 'Ethereum',
  //       poolIndex: 0,
  //       stakeTokenAddress: '',
  //       apr: '--',
  //       toDate: '--',
  //       totalReward: '--',
  //       tvl: '--',
  //       rewardPerBlockValue: '',
  //       totalRewardValue: '',
  //       startBlock: '',
  //       endBlock: '',
  //       stakeTokenSupply: '',
  //       stakeTokenPrice: '',
  //       lpPrice: '--',
  //       liquidity: '--',
  //       slippage: '--',
  //     },
  //     {
  //       platform: 'BSC',
  //       poolIndex: 0,
  //       stakeTokenAddress: '',
  //       apr: '--',
  //       toDate: '--',
  //       totalReward: '--',
  //       tvl: '--',
  //       rewardPerBlockValue: '',
  //       totalRewardValue: '',
  //       startBlock: '',
  //       endBlock: '',
  //       stakeTokenSupply: '',
  //       stakeTokenPrice: '',
  //       lpPrice: '--',
  //       liquidity: '--',
  //       slippage: '--',
  //     },
  //   ],
  // },
  // {
  //   name: 'rFIS/FIS LP',
  //   extraName: 'rFIS',
  //   children: [
  //     {
  //       platform: 'Ethereum',
  //       poolIndex: 1,
  //       stakeTokenAddress: '',
  //       apr: '--',
  //       toDate: '--',
  //       totalReward: '--',
  //       tvl: '--',
  //       rewardPerBlockValue: '',
  //       totalRewardValue: '',
  //       startBlock: '',
  //       endBlock: '',
  //       stakeTokenSupply: '',
  //       stakeTokenPrice: '',
  //       lpPrice: '--',
  //       liquidity: '--',
  //       slippage: '--',
  //     },
  //     {
  //       platform: 'BSC',
  //       poolIndex: 1,
  //       stakeTokenAddress: '',
  //       apr: '--',
  //       toDate: '--',
  //       totalReward: '--',
  //       tvl: '--',
  //       rewardPerBlockValue: '',
  //       totalRewardValue: '',
  //       startBlock: '',
  //       endBlock: '',
  //       stakeTokenSupply: '',
  //       stakeTokenPrice: '',
  //       lpPrice: '--',
  //       liquidity: '--',
  //       slippage: '--',
  //     },
  //   ],
  // },
  {
    name: 'rBNB/BNB LP',
    extraName: 'rBNB',
    children: [
      {
        platform: 'BSC',
        poolIndex: 0,
        lpContract: config.rBNBBSCLpContract(),
        stakeTokenAddress: '',
        apr: '--',
        toDate: '--',
        totalReward: '--',
        tvl: '--',
        rewardPerBlockValue: '',
        totalRewardValue: '',
        startBlock: '',
        endBlock: '',
        stakeTokenSupply: '',
        stakeTokenPrice: '',
        lpPrice: '--',
        liquidity: '--',
        slippage: '--',
      },
    ],
  },
  {
    name: 'rDOT/DOT LP',
    extraName: 'rDOT',
    children: [
      {
        platform: 'BSC',
        poolIndex: 1,
        lpContract: config.rDOTBSCLpContract(),
        stakeTokenAddress: '',
        apr: '--',
        toDate: '--',
        totalReward: '--',
        tvl: '--',
        rewardPerBlockValue: '',
        totalRewardValue: '',
        startBlock: '',
        endBlock: '',
        stakeTokenSupply: '',
        stakeTokenPrice: '',
        lpPrice: '--',
        liquidity: '--',
        slippage: '--',
      },
    ],
  },
  // {
  //   name: 'rKSM/KSM LP',
  //   extraName: 'rKSM',
  //   children: [
  //     {
  //       platform: 'BSC',
  //       poolIndex: 3,
  //       stakeTokenAddress: '',
  //       apr: '--',
  //       toDate: '--',
  //       totalReward: '--',
  //       tvl: '--',
  //       rewardPerBlockValue: '',
  //       totalRewardValue: '',
  //       startBlock: '',
  //       endBlock: '',
  //       stakeTokenSupply: '',
  //       stakeTokenPrice: '',
  //       lpPrice: '--',
  //       liquidity: '--',
  //       slippage: '--',
  //     },
  //   ],
  // },
  // {
  //   name: 'rATOM/ATOM LP',
  //   extraName: 'rATOM',
  //   children: [
  //     {
  //       platform: 'BSC',
  //       poolIndex: 4,
  //       stakeTokenAddress: '',
  //       apr: '--',
  //       toDate: '--',
  //       totalReward: '--',
  //       tvl: '--',
  //       rewardPerBlockValue: '',
  //       totalRewardValue: '',
  //       startBlock: '',
  //       endBlock: '',
  //       stakeTokenSupply: '',
  //       stakeTokenPrice: '',
  //       lpPrice: '--',
  //       liquidity: '--',
  //       slippage: '--',
  //     },
  //   ],
  // },
  // {
  //   name: 'rMATIC/MATIC LP',
  //   extraName: 'rMATIC',
  //   children: [
  //     {
  //       platform: 'Polygon',
  //       lpContract: '0x336B812479ae126E2a3FbBd296dc0a465C092B96',
  //       poolIndex: 0,
  //       stakeTokenAddress: '',
  //       apr: '--',
  //       toDate: '--',
  //       totalReward: '--',
  //       tvl: '--',
  //       rewardPerBlockValue: '',
  //       totalRewardValue: '',
  //       startBlock: '',
  //       endBlock: '',
  //       stakeTokenSupply: '',
  //       stakeTokenPrice: '',
  //       lpPrice: '--',
  //       liquidity: '--',
  //       slippage: '--',
  //     },
  //   ],
  // },
];

const rPoolServer = new RPoolServer();
const ethServer = new EthServer();

const rPoolClice = createSlice({
  name: 'rPoolModule',
  initialState: {
    rPoolList: [],
    lpList: lpActs,
    loadingLpList: false,
    totalLiquidity: '--',
    apyAvg: '--',
    slippageAvg: '-',
  },
  reducers: {
    setRPoolList(state, { payload }) {
      state.rPoolList = payload;
    },
    setLpList(state, { payload }) {
      state.lpList = payload;
    },
    setLoadingLpList(state, { payload }) {
      state.loadingLpList = payload;
    },
    setTotalLiquidity(state, { payload }) {
      state.totalLiquidity = payload;
    },
    setApyAvg(state, { payload }) {
      state.apyAvg = payload;
    },
    setSlippageAvg(state, { payload }) {
      state.slippageAvg = payload;
    },
  },
});

export const { setRPoolList, setLpList, setLoadingLpList, setTotalLiquidity, setApyAvg, setSlippageAvg } =
  rPoolClice.actions;

export const getRPoolList = (): AppThunk => async (dispatch, getState) => {
  const result = await rPoolServer.getRPoolList();
  if (result.status == '80000') {
    const list = result.data.list;
    let totalLiquidity = 0;
    let apyCount = 0;
    let apySum = 0;
    let slippageSum = 0;
    let slippageCount = 0;
    dispatch(setRPoolList(list));
    list.forEach((item: any) => {
      totalLiquidity = totalLiquidity + Number(item.liquidity);
      if (item.slippage) {
        slippageCount = slippageCount + 1;
        slippageSum = slippageSum + Number(item.slippage);
      }
      if (item.apy && item.apy.length > 0) {
        apyCount = apyCount + 1;
        item.apy.forEach((apyitem: any) => {
          apySum = apySum + Number(apyitem.apy);
        });
      }
    });
    dispatch(setTotalLiquidity(totalLiquidity.toFixed(2)));
    dispatch(setApyAvg((apySum / apyCount).toFixed(2)));
    dispatch(setSlippageAvg((slippageSum / slippageCount).toFixed(2)));
  }
};

export const getLPList =
  (showLoading: boolean): AppThunk =>
  async (dispatch, getState) => {
    try {
      const [rPoolListRes, tokenPriceListRes] = await Promise.all([
        rPoolServer.getRPoolList(),
        rpc.fetchRtokenPriceList(),
      ]);

      let rPoolList = [];
      if (rPoolListRes.status === '80000' && rPoolListRes.data) {
        rPoolList = rPoolListRes.data.list;
      }

      let fisPrice = '';
      if (tokenPriceListRes && tokenPriceListRes.status === '80000') {
        const fisObj = tokenPriceListRes.data?.find((item: any) => {
          return item.symbol === 'FIS';
        });
        if (fisObj) {
          fisPrice = fisObj.price;
        }
      }

      const lpList = cloneDeep(getState().rPoolModule.lpList);
      const promiseList = [];
      for (let index = 0; index < lpList.length; index++) {
        promiseList.push(rPoolServer.fillLpData(lpList[index], rPoolList, fisPrice));
      }

      const resultList = await Promise.all(promiseList);
      lpList.forEach((item: any) => {
        const newItem = resultList.find((data: any) => {
          return data.name === item.name;
        });
        item.children = newItem?.children;
      });
      dispatch(setLpList(cloneDeep(lpList)));
    } finally {
      dispatch(setLoadingLpList(false));
    }
  };

export const approveLpAllowance =
  (ethAddress: any, stakeTokenAddress: any, platform: any, cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
      const web3 = ethServer.getWeb3();
      let tokenContract = new web3.eth.Contract(rPoolServer.getStakeTokenAbi(), stakeTokenAddress, {
        from: ethAddress,
      });
      let allowance = web3.utils.toWei('10000000');
      let contractAddress = config.lockContractAddress(platform);
      if (!contractAddress) {
        throw new Error('contract address not found');
      }
      const result = await tokenContract.methods.approve(contractAddress, allowance).send();
      if (result && result.status) {
        cb && cb(true);
      } else {
        dispatch(setLoading(false));
      }
    } catch (err) {
      dispatch(setLoading(false));
    } finally {
    }
  };

export const stakeLp =
  (amount: any, platform: string, poolIndex: any, lpNameWithPrefix: string, cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    if (!getState().rETHModule.ethAccount || !getState().rETHModule.ethAccount.address) {
      return;
    }
    dispatch(setLoading(true));
    const web3 = ethServer.getWeb3();
    const amountInWei = web3.utils.toWei(amount.toString());

    try {
      const lockDropContract = new web3.eth.Contract(
        rPoolServer.getStakingLockDropAbi(platform),
        config.lockContractAddress(platform),
        {
          from: getState().rETHModule.ethAccount.address,
        },
      );
      const result = await lockDropContract.methods.deposit(poolIndex, amountInWei).send();
      console.log('result: ', result);
      if (result && result.status) {
        dispatch(
          add_Notice(stafi_uuid(), '', noticeType.Lp, noticesubType.Stake, amount.toString(), noticeStatus.Confirmed, {
            platform,
            lpNameWithPrefix,
            txHash: result.transactionHash,
          }),
        );
        message.success('LP is staked');
        cb && cb();
      }
    } catch (err) {
      message.error(err.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const unstakeLp =
  (amount: any, platform: string, poolIndex: any, lpNameWithPrefix: string, cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    if (!getState().rETHModule.ethAccount || !getState().rETHModule.ethAccount.address) {
      return;
    }
    dispatch(setLoading(true));
    const web3 = ethServer.getWeb3();
    const amountInWei = web3.utils.toWei(amount.toString());

    try {
      const lockDropContract = new web3.eth.Contract(
        rPoolServer.getStakingLockDropAbi(platform),
        config.lockContractAddress(platform),
        {
          from: getState().rETHModule.ethAccount.address,
        },
      );
      const result = await lockDropContract.methods.withdraw(poolIndex, amountInWei).send();
      if (result && result.status) {
        dispatch(
          add_Notice(
            stafi_uuid(),
            '',
            noticeType.Lp,
            noticesubType.Unstake,
            amount.toString(),
            noticeStatus.Confirmed,
            {
              platform,
              lpNameWithPrefix,
              txHash: result.transactionHash,
            },
          ),
        );
        message.success('LP is unstaked');
        cb && cb();
      }
    } catch (err) {
      message.error(err.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const claimLpReward =
  (platform: string, poolIndex: any, lpNameWithPrefix: string, claimableAmount: any, cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    if (!getState().rETHModule.ethAccount || !getState().rETHModule.ethAccount.address) {
      return;
    }
    dispatch(setLoading(true));
    const web3 = ethServer.getWeb3();

    try {
      const lockDropContract = new web3.eth.Contract(
        rPoolServer.getStakingLockDropAbi(platform),
        config.lockContractAddress(platform),
        {
          from: getState().rETHModule.ethAccount.address,
        },
      );
      const result = await lockDropContract.methods.claimReward(poolIndex).send();
      if (result && result.status) {
        dispatch(
          add_Notice(
            stafi_uuid(),
            Symbol.Fis,
            noticeType.Lp,
            noticesubType.Claim,
            claimableAmount,
            noticeStatus.Confirmed,
            {
              platform,
              lpNameWithPrefix,
              txHash: result.transactionHash,
            },
          ),
        );
        message.success('Claim reward success');
        cb && cb();
      }
    } catch (err) {
      message.error(err.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

export default rPoolClice.reducer;
