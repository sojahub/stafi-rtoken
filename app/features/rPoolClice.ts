import config from '@config/index';
import { createSlice } from '@reduxjs/toolkit';
import EthServer from '@servers/eth';
import RPoolServer from '@servers/rpool';
import { message } from 'antd';
import { AppThunk } from '../store';
import { setLoading } from './globalClice';

const rPoolServer = new RPoolServer();
const ethServer = new EthServer();

const rPoolClice = createSlice({
  name: 'rPoolModule',
  initialState: {
    rPoolList: [],
    lpList: [],
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
  (phase2Acts: any, showLoading: boolean): AppThunk =>
  async (dispatch, getState) => {
    try {
      if (showLoading) {
        dispatch(setLoadingLpList(true));
      }
      await rPoolServer.fillLpData(phase2Acts, '', () => {});
      dispatch(setLpList([...phase2Acts]));
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
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

export const stakeLp =
  (amount: any, platform: string, poolIndex: any, cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    if (!getState().rETHModule.ethAccount || !getState().rETHModule.ethAccount.address) {
      return;
    }
    dispatch(setLoading(true));
    const web3 = ethServer.getWeb3();
    const amountInWei = web3.utils.toWei(amount.toString());

    try {
      const lockDropContract = new web3.eth.Contract(
        rPoolServer.getStakingLockDropAbi(),
        config.lockContractAddress(platform),
        {
          from: getState().rETHModule.ethAccount.address,
        },
      );
      const result = await lockDropContract.methods.deposit(poolIndex, amountInWei).send();
      if (result && result.status) {
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
  (amount: any, platform: string, poolIndex: any, cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    if (!getState().rETHModule.ethAccount || !getState().rETHModule.ethAccount.address) {
      return;
    }
    dispatch(setLoading(true));
    const web3 = ethServer.getWeb3();
    const amountInWei = web3.utils.toWei(amount.toString());

    try {
      const lockDropContract = new web3.eth.Contract(
        rPoolServer.getStakingLockDropAbi(),
        config.lockContractAddress(platform),
        {
          from: getState().rETHModule.ethAccount.address,
        },
      );
      const result = await lockDropContract.methods.withdraw(poolIndex, amountInWei).send();
      if (result && result.status) {
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
  (platform: string, poolIndex: any, cb?: Function): AppThunk =>
  async (dispatch, getState) => {
    if (!getState().rETHModule.ethAccount || !getState().rETHModule.ethAccount.address) {
      return;
    }
    dispatch(setLoading(true));
    const web3 = ethServer.getWeb3();

    try {
      const lockDropContract = new web3.eth.Contract(
        rPoolServer.getStakingLockDropAbi(),
        config.lockContractAddress(platform),
        {
          from: getState().rETHModule.ethAccount.address,
        },
      );
      const result = await lockDropContract.methods.claimReward(poolIndex).send();
      if (result && result.status) {
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
