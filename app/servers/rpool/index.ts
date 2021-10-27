import config, { getRsymbolByTokenTitle } from '@config/index';
import { rSymbol } from '@keyring/defaults';
import EthServer from '@servers/eth';
import StafiServer from '@servers/stafi';
import { formatDuration } from '@util/dateUtil';
import numberUtil from '@util/numberUtil';
import rpc from '@util/rpc';
import web3Util from '@util/web3Util';
import { cloneDeep } from 'lodash';

const stafiServer = new StafiServer();
const ethServer = new EthServer();

export default class Index {
  getStakingLockDropAbi(platform: string) {
    let abi: string;
    if (platform === 'BSC') {
      abi =
        '[{"inputs":[{"internalType":"address","name":"_dropToken","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"ClaimReward","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"EmergencyWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[{"internalType":"contract IBEP20","name":"_stakeToken","type":"address"},{"internalType":"uint256","name":"_startBlock","type":"uint256"},{"internalType":"uint256","name":"_rewardPerBlock","type":"uint256"},{"internalType":"uint256","name":"_totalReward","type":"uint256"},{"internalType":"uint256","name":"_claimableStartBlock","type":"uint256"},{"internalType":"uint256","name":"_lockedEndBlock","type":"uint256"}],"name":"add","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"}],"name":"claimReward","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"dropToken","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"}],"name":"emergencyWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_from","type":"uint256"},{"internalType":"uint256","name":"_to","type":"uint256"},{"internalType":"uint256","name":"_rewardPerBlock","type":"uint256"},{"internalType":"uint256","name":"_leftReward","type":"uint256"}],"name":"getPoolReward","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"address","name":"_user","type":"address"}],"name":"getUserClaimableReward","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"address","name":"_user","type":"address"}],"name":"pendingReward","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"poolInfo","outputs":[{"internalType":"bool","name":"emergencySwitch","type":"bool"},{"internalType":"contract IBEP20","name":"stakeToken","type":"address"},{"internalType":"uint256","name":"startBlock","type":"uint256"},{"internalType":"uint256","name":"rewardPerBlock","type":"uint256"},{"internalType":"uint256","name":"totalReward","type":"uint256"},{"internalType":"uint256","name":"leftReward","type":"uint256"},{"internalType":"uint256","name":"claimableStartBlock","type":"uint256"},{"internalType":"uint256","name":"lockedEndBlock","type":"uint256"},{"internalType":"uint256","name":"lastRewardBlock","type":"uint256"},{"internalType":"uint256","name":"rewardPerShare","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"poolLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"bool","name":"_emergencySwitch","type":"bool"}],"name":"set","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"}],"name":"updatePool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"}],"name":"userInfo","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"rewardDebt","type":"uint256"},{"internalType":"uint256","name":"claimedReward","type":"uint256"},{"internalType":"uint256","name":"currentTotalReward","type":"uint256"},{"internalType":"uint256","name":"lastClaimedRewardBlock","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}]';
    } else {
      abi =
        '[{"inputs":[{"internalType":"address","name":"_dropToken","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"ClaimReward","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"EmergencyWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[{"internalType":"contract IERC20","name":"_stakeToken","type":"address"},{"internalType":"uint256","name":"_startBlock","type":"uint256"},{"internalType":"uint256","name":"_rewardPerBlock","type":"uint256"},{"internalType":"uint256","name":"_totalReward","type":"uint256"},{"internalType":"uint256","name":"_claimableStartBlock","type":"uint256"},{"internalType":"uint256","name":"_lockedEndBlock","type":"uint256"}],"name":"add","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"}],"name":"claimReward","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"dropToken","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"}],"name":"emergencyWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_from","type":"uint256"},{"internalType":"uint256","name":"_to","type":"uint256"},{"internalType":"uint256","name":"_rewardPerBlock","type":"uint256"},{"internalType":"uint256","name":"_leftReward","type":"uint256"}],"name":"getPoolReward","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"address","name":"_user","type":"address"}],"name":"getUserClaimableReward","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"address","name":"_user","type":"address"}],"name":"pendingReward","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"poolInfo","outputs":[{"internalType":"bool","name":"emergencySwitch","type":"bool"},{"internalType":"contractIERC20","name":"stakeToken","type":"address"},{"internalType":"uint256","name":"startBlock","type":"uint256"},{"internalType":"uint256","name":"rewardPerBlock","type":"uint256"},{"internalType":"uint256","name":"totalReward","type":"uint256"},{"internalType":"uint256","name":"leftReward","type":"uint256"},{"internalType":"uint256","name":"claimableStartBlock","type":"uint256"},{"internalType":"uint256","name":"lockedEndBlock","type":"uint256"},{"internalType":"uint256","name":"lastRewardBlock","type":"uint256"},{"internalType":"uint256","name":"rewardPerShare","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"poolLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"bool","name":"_emergencySwitch","type":"bool"}],"name":"set","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"}],"name":"updatePool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"}],"name":"userInfo","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"rewardDebt","type":"uint256"},{"internalType":"uint256","name":"claimedReward","type":"uint256"},{"internalType":"uint256","name":"currentTotalReward","type":"uint256"},{"internalType":"uint256","name":"lastClaimedRewardBlock","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}]';
    }
    return JSON.parse(abi);
  }

  getStakeTokenAbi() {
    const abi =
      '[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MINTER_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PAUSER_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burnFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getRoleMember","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleMemberCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"}]';
    return JSON.parse(abi);
  }

  getRPoolList() {
    const url = config.api() + '/stafi/v1/webapi/rpool/rpoollist';
    return rpc.post(url);
  }

  getLpPriceList(contractList: any) {
    const url = config.api() + '/stafi/v1/webapi/drop/getlppricelist';
    return rpc.post(url, { contract: JSON.stringify(contractList) });
  }

  async fillLpData(sourceActs: Array<any>, ethAddress: any) {
    const lpActs = cloneDeep(sourceActs);
    let rPoolList = [];
    const rPoolListRes = await this.getRPoolList();
    if (rPoolListRes.status === '80000' && rPoolListRes.data) {
      rPoolList = rPoolListRes.data.list;
    }

    let wraPrice = '';
    const lpPriceRes = await this.getLpPriceList(web3Util.getLpContractList());
    if (lpPriceRes.status === '80000' && lpPriceRes.data) {
      wraPrice = lpPriceRes.data.wraPrice;
    }

    try {
      for (let item of lpActs) {
        for (let poolItem of item.children) {
          const web3 = ethServer.getWeb3FromPlatform(poolItem.platform);
          if (!web3) {
            continue;
          }
          let contractAddress = config.lockContractAddress(poolItem.platform);
          if (!contractAddress) {
            continue;
          }

          try {
            // console.log('address:', contractAddress);
            let lockContract = new web3.eth.Contract(this.getStakingLockDropAbi(poolItem.platform), contractAddress, {
              from: ethAddress,
            });

            const poolLength = await lockContract.methods.poolLength().call();
            // console.log('poolLength: ', poolLength);
            // console.log('poolIndex: ', poolItem.poolIndex);
            const poolInfo = await lockContract.methods.poolInfo(poolItem.poolIndex).call();
            // console.log('poolInfo: ', poolInfo);
            poolItem.stakeTokenAddress = poolInfo.stakeToken;

            let totalReward = web3.utils.fromWei(poolInfo.totalReward, 'ether');
            poolItem.totalReward = totalReward.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
            poolItem.totalRewardValue = totalReward;

            let rewardPerBlock = web3.utils.fromWei(poolInfo.rewardPerBlock, 'ether');
            poolItem.rewardPerBlockValue = rewardPerBlock;

            poolItem.startBlock = poolInfo.startBlock;

            if (!poolItem.stakeTokenAddress) {
              continue;
            }
            let tokenContract = new web3.eth.Contract(this.getStakeTokenAbi(), poolItem.stakeTokenAddress, {
              from: ethAddress,
            });

            const poolStakeTokenSupply = await tokenContract.methods.balanceOf(contractAddress).call();
            let stakeTokenSupply = web3.utils.fromWei(poolStakeTokenSupply, 'ether');
            poolItem.stakeTokenSupply = stakeTokenSupply;

            if (poolItem.lpContract) {
              const lpPool = rPoolList.find((item: any) => {
                return item.contract === poolItem.lpContract;
              });
              if (lpPool) {
                poolItem.liquidity = lpPool.liquidity;
                poolItem.slippage = lpPool.slippage;
                poolItem.lpPrice = lpPool.lpPrice;
              } else {
                poolItem.lpPrice = 1;
              }
            } else {
              poolItem.lpPrice = 1;
            }
            poolItem.apr = await this.getLpApr(
              poolItem.platform,
              ethAddress,
              poolItem.stakeTokenAddress,
              poolItem.rewardPerBlockValue,
              poolItem.lpPrice,
              wraPrice,
            );
          } catch (err) {
            console.error(err.message);
          }
        }
      }

      return lpActs;
    } catch (err) {
      console.error(err.message);
    }
  }

  async getLpApr(
    platform: any,
    ethAddress: any,
    stakeTokenAddress: any,
    rewardPerBlock: any,
    stakeTokenPrice: any,
    wraPrice: any,
  ) {
    let apr = '--';

    if (isNaN(wraPrice)) {
      return apr;
    }
    const totalBlocks = 2254114;

    try {
      const web3 = ethServer.getWeb3FromPlatform(platform);
      if (!web3) {
        return apr;
      }
      let tokenContract = new web3.eth.Contract(this.getStakeTokenAbi(), stakeTokenAddress, {
        from: ethAddress,
      });

      let contractAddress = config.lockContractAddress(platform);
      if (!contractAddress) {
        return apr;
      }
      const poolStakeTokenSupply = await tokenContract.methods.balanceOf(contractAddress).call();
      let stakeTokenSupply = web3.utils.fromWei(poolStakeTokenSupply, 'ether');
      // console.log('sdfsdfsd', rewardPerBlock, totalBlocks, wraPrice, stakeTokenPrice, stakeTokenSupply);
      // Temp fix backend missing lpPrice
      if (Number(stakeTokenPrice) === 0) {
        stakeTokenPrice = 1;
      }
      let ratio: number;
      if (stakeTokenSupply > 0) {
        ratio = (rewardPerBlock * totalBlocks * wraPrice * 100) / (stakeTokenPrice * stakeTokenSupply);
      } else {
        ratio = (rewardPerBlock * totalBlocks * wraPrice * 100) / stakeTokenPrice;
      }
      apr = numberUtil.handleAmountRoundToFixed(ratio, 2);
    } catch (err) {
      // console.log('sdfsd error', err.message);
    }
    return apr;
  }

  async getRTokenMintRewardActs(symbol: rSymbol) {
    const stafiApi = await stafiServer.createStafiApi();
    const actLatestCycle = await stafiApi.query.rClaim.actLatestCycle(symbol);
    const acts = [];
    if (actLatestCycle == 0) {
      // console.log('empty mint info');
    } else {
      const lastHeader = await stafiApi.rpc.chain.getHeader();
      const nowBlock = lastHeader && lastHeader.toJSON() && lastHeader.toJSON().number;
      for (let i = 1; i <= actLatestCycle; i++) {
        let arr = [];
        arr.push(symbol);
        arr.push(i);
        try {
          const act = await stafiApi.query.rClaim.acts(arr);
          if (act.toJSON()) {
            const actJson = act.toJSON();
            actJson.nowBlock = nowBlock;
            let days: any = numberUtil.divide(actJson.end - actJson.begin, 14400);
            actJson.durationInDays = Math.round(days * 10) / 10;
            actJson.remainingTime = formatDuration(numberUtil.max(0, actJson.end - nowBlock) * 6);
            actJson.endTimeStamp = Date.now() + (actJson.end - nowBlock) * 6000;
            actJson.mintedValue = '--';
            acts.push(actJson);
          }
        } catch (err) {
          continue;
        }
      }
      acts.sort((x: any, y: any) => {
        if (x.nowBlock < x.end && y.nowBlock > y.end) {
          return -1;
        } else if (x.end <= nowBlock && y.end <= nowBlock) {
          return y.total_reward - x.total_reward;
        } else if (x.end > nowBlock && y.end > nowBlock) {
          return x.end - y.end;
        }
        return 0;
      });
    }
    return acts;
  }

  async getEthMintRewardActs() {
    const acts: any = [];
    const stafiApi = await stafiServer.createStafiApi();
    const rethActLatestCycle = await stafiApi.query.rClaim.rEthActLatestCycle();
    if (rethActLatestCycle == 0) {
      console.log('empty reth mint info');
    } else {
      const lastHeader = await stafiApi.rpc.chain.getHeader();
      const nowBlock = lastHeader && lastHeader.toJSON() && lastHeader.toJSON().number;
      for (let i = 1; i <= rethActLatestCycle; i++) {
        try {
          const act = await stafiApi.query.rClaim.rEthActs(i);
          if (act.toJSON()) {
            const actJson = act.toJSON();
            actJson.nowBlock = nowBlock;
            let days: any = numberUtil.divide(actJson.end - actJson.begin, 14400);
            actJson.durationInDays = Math.round(days * 10) / 10;
            actJson.remainingTime = formatDuration(numberUtil.max(0, actJson.end - nowBlock) * 6);
            actJson.endTimeStamp = Date.now() + (actJson.end - nowBlock) * 6000;
            actJson.mintedValue = '--';
            acts.push(actJson);
          }
        } catch (error) {
          continue;
        }
      }
      acts.sort((x: any, y: any) => {
        if (x.nowBlock < x.end && y.nowBlock > y.end) {
          return -1;
        }
        return 0;
      });
    }
    return acts;
  }

  async getCurrentActiveAct(rTokenTitle: string) {
    const acts = await this.getRTokenMintRewardActs(getRsymbolByTokenTitle(rTokenTitle));
    const activeAct = acts.find((item: any) => {
      return item.nowBlock >= item.begin && item.nowBlock <= item.end - 10;
    });
    return activeAct;
  }

  async getCurrentActiveEthAct() {
    const acts = await this.getEthMintRewardActs();
    const activeAct = acts.find((item: any) => {
      return item.nowBlock >= item.begin && item.nowBlock <= item.end - 10;
    });
    return activeAct;
  }

  async getMintOverview(tokenSymbol: any, cycle: any, fisAddress: string, fisPrice: any) {
    // fisAddress = '33URnrxK5jBoPaZ1hMjj7yMG27aimxbSruYpBZsRFBkbsJne';
    const response: any = {
      actData: null,
      myMint: '--',
      myMintRatio: '--',
      myReward: '--',
      fisTotalReward: '--',
      fisClaimableReward: '--',
      fisLockedReward: '--',
      claimIndexs: [],
      vesting: '--',
    };
    try {
      const stafiApi = await stafiServer.createStafiApi();
      let arr = [];
      arr.push(Number(tokenSymbol));
      arr.push(Number(cycle));
      const act = await stafiApi.query.rClaim.acts(arr);
      if (act.toJSON()) {
        response.actData = act.toJSON();
      } else {
        return response;
      }

      const actJson = act.toJSON();

      response.vesting = (actJson.locked_blocks * 6) / 60 / 60 / 24;

      let arr2 = [];
      arr2.push(fisAddress);
      arr2.push(Number(tokenSymbol));
      arr2.push(Number(cycle));
      const userMintsCount = await stafiApi.query.rClaim.userMintsCount(arr2);
      if (userMintsCount) {
        let totalReward = 0;
        let fisClaimableReward = 0;
        let fisClaimedReward = 0;
        let userMint = BigInt(0);
        const claimIndexs = [];
        if (userMintsCount.toJSON() > 0) {
          for (let i = 0; i < userMintsCount.toJSON(); i++) {
            let claimInfoArr = [];
            claimInfoArr.push(fisAddress);
            claimInfoArr.push(Number(tokenSymbol));
            claimInfoArr.push(Number(cycle));
            claimInfoArr.push(i);
            try {
              const claimInfo = await stafiApi.query.rClaim.claimInfos(claimInfoArr);
              if (claimInfo.toJSON()) {
                const claimInfoJson = claimInfo.toJSON();
                // console.log('claimInfo: ', claimInfoJson);
                totalReward += claimInfoJson.total_reward;

                let finalBlock = claimInfoJson.mint_block + actJson.locked_blocks;
                const lastHeader = await stafiApi.rpc.chain.getHeader();
                const nowBlock = lastHeader && lastHeader.toJSON() && lastHeader.toJSON().number;

                let shouldClaimAmount = claimInfoJson.total_reward - claimInfoJson.total_claimed;
                if (nowBlock < finalBlock) {
                  let duBlocks = nowBlock - claimInfoJson.latest_claimed_block;
                  shouldClaimAmount = (claimInfoJson.total_reward * duBlocks) / actJson.locked_blocks;
                }

                if (Number(shouldClaimAmount) > Number(0)) {
                  claimIndexs.push(i);
                  fisClaimableReward += shouldClaimAmount;
                }
                fisClaimedReward += claimInfoJson.total_claimed;
                userMint += BigInt(BigInt(claimInfoJson.mint_amount).toString(10));
              }
            } catch (err) {
              console.log('get claimInfo error');
              continue;
            }
          }

          const formatTotalReward = numberUtil.fisAmountToHuman(totalReward);
          response.myMint =
            Math.round(numberUtil.tokenAmountToHuman(userMint, Number(tokenSymbol)) * 1000000) / 1000000;

          if (Number(actJson.total_rtoken_amount) === Number(0)) {
            if (Number(response.myMint) > 0) {
              response.myMintRatio = 100;
            } else {
              response.myMintRatio = 0;
            }
          } else {
            response.myMintRatio = numberUtil.min(
              100,
              Math.round(
                ((response.myMint * 100) /
                  numberUtil.tokenAmountToHuman(actJson.total_rtoken_amount, Number(tokenSymbol))) *
                  10,
              ) / 10,
            );
          }

          if (fisPrice && fisPrice !== '--' && !isNaN(fisPrice)) {
            const mintValue = numberUtil.mul(formatTotalReward, fisPrice);
            response.myReward = Math.round(mintValue * 1000000) / 1000000;
          } else {
            response.myReward = '--';
          }

          response.fisTotalReward = formatTotalReward.toFixed(4);
          response.fisClaimableReward = numberUtil.fisAmountToHuman(fisClaimableReward).toFixed(4);
          response.fisLockedReward = numberUtil
            .fisAmountToHuman(totalReward - fisClaimableReward - fisClaimedReward)
            .toFixed(4);
        } else {
          response.myMint = 0;
          response.myMintRatio = 0;
          response.myReward = 0;
          response.fisTotalReward = 0;
          response.fisClaimableReward = 0;
          response.fisLockedReward = 0;
        }
        response.claimIndexs = claimIndexs;
      }
    } finally {
      return response;
    }
  }

  async getREthMintOverview(cycle: any, ethAddress: string, fisPrice: any) {
    // ethAddress = '0x1bfCC34DadaA1154bB5f6dC2b7923f3b5cC256f7';
    const response: any = {
      actData: null,
      myMint: '--',
      myMintRatio: '--',
      myReward: '--',
      fisTotalReward: '--',
      fisClaimableReward: '--',
      fisLockedReward: '--',
      claimIndexs: [],
    };
    try {
      const stafiApi = await stafiServer.createStafiApi();
      const act = await stafiApi.query.rClaim.rEthActs(Number(cycle));
      if (act.toJSON()) {
        response.actData = act.toJSON();
      } else {
        return response;
      }

      const actJson = act.toJSON();
      let arr2 = [];
      arr2.push(ethAddress);
      arr2.push(Number(cycle));
      const userMintsCount = await stafiApi.query.rClaim.userREthMintsCount(arr2);
      if (userMintsCount) {
        let totalReward = 0;
        let fisClaimableReward = 0;
        let fisClaimedReward = 0;
        let userMint = 0;
        const claimIndexs = [];
        if (userMintsCount.toJSON() > 0) {
          for (let i = 0; i < userMintsCount.toJSON(); i++) {
            try {
              let claimInfoArr = [];
              claimInfoArr.push(ethAddress);
              claimInfoArr.push(Number(cycle));
              claimInfoArr.push(i);
              const claimInfo = await stafiApi.query.rClaim.rEthClaimInfos(claimInfoArr);
              if (claimInfo.toJSON()) {
                const claimInfoJson = claimInfo.toJSON();
                // console.log('claimInfo: ', claimInfoJson);
                totalReward += claimInfoJson.total_reward;

                let finalBlock = claimInfoJson.mint_block + actJson.locked_blocks;
                const lastHeader = await stafiApi.rpc.chain.getHeader();
                const nowBlock = lastHeader && lastHeader.toJSON() && lastHeader.toJSON().number;

                let shouldClaimAmount = claimInfoJson.total_reward - claimInfoJson.total_claimed;
                if (nowBlock < finalBlock) {
                  let duBlocks = nowBlock - claimInfoJson.latest_claimed_block;
                  shouldClaimAmount = (claimInfoJson.total_reward * duBlocks) / actJson.locked_blocks;
                }

                if (Number(shouldClaimAmount) > Number(0)) {
                  claimIndexs.push(i);
                  fisClaimableReward += shouldClaimAmount;
                }
                fisClaimedReward += claimInfoJson.total_claimed;
                userMint += parseInt(claimInfoJson.mint_amount, 16);
              }
            } catch (error) {
              continue;
            }
          }
          const formatTotalReward = numberUtil.fisAmountToHuman(totalReward);
          response.myMint = Math.round(numberUtil.tokenAmountToHuman(userMint, rSymbol.Eth) * 1000000) / 1000000;

          if (Number(actJson.total_rtoken_amount) === Number(0)) {
            if (Number(formatTotalReward) > 0) {
              response.myMintRatio = 100;
            } else {
              response.myMintRatio = 0;
            }
          } else {
            response.myMintRatio = numberUtil.min(
              100,
              Math.round(
                ((formatTotalReward * 100) / numberUtil.tokenAmountToHuman(actJson.total_rtoken_amount, rSymbol.Eth)) *
                  10,
              ) / 10,
            );
          }

          if (fisPrice && fisPrice !== '--' && !isNaN(fisPrice)) {
            const mintValue = numberUtil.mul(formatTotalReward, fisPrice);
            response.myReward = Math.round(mintValue * 1000000) / 1000000;
          } else {
            response.myReward = '--';
          }

          response.fisTotalReward = numberUtil.fisAmountToHuman(totalReward).toFixed(4);
          response.fisClaimableReward = numberUtil.fisAmountToHuman(fisClaimableReward).toFixed(4);
          response.fisLockedReward = numberUtil
            .fisAmountToHuman(totalReward - fisClaimableReward - fisClaimedReward)
            .toFixed(4);
        } else {
          response.myMint = 0;
          response.myMintRatio = 0;
          response.myReward = 0;
          response.fisTotalReward = 0;
          response.fisClaimableReward = 0;
          response.fisLockedReward = 0;
        }
        response.claimIndexs = claimIndexs;
      }
    } finally {
      return response;
    }
  }

  async getLiquidityOverview(ethAddress: any, platform: any, poolIndex: any, lpContract: string, fisPrice: any) {
    const response: any = {
      apr: '--',
      totalMintedValue: '--',
      myMint: '--',
      myMintRatio: '--',
      myReward: '--',
      fisTotalReward: '--',
      fisClaimableReward: '--',
      fisLockedReward: '--',
      claimIndexs: [],
      stakeTokenAddress: '',
      lpBalance: '--',
      lpAllowance: '--',
      userStakedAmount: '--',
      vesting: '--',
    };
    try {
      const web3 = ethServer.getWeb3FromPlatform(platform);
      if (!web3) {
        throw new Error('unknown platform');
      }

      let contractAddress = config.lockContractAddress(platform);
      if (!contractAddress) {
        throw new Error('contract address not found');
      }
      let lockContract = new web3.eth.Contract(this.getStakingLockDropAbi(platform), contractAddress, {
        from: ethAddress,
      });
      const poolInfo = await lockContract.methods.poolInfo(poolIndex).call();
      // console.log('poolInfo: ', poolInfo);
      if (!poolInfo) {
        return;
      }

      const stakeTokenAddress = poolInfo.stakeToken;
      if (!stakeTokenAddress) {
        return;
      }

      let wraPrice = '';
      let lpPrice: number;
      const lpPriceRes = await this.getLpPriceList([lpContract]);
      if (lpPriceRes.status === '80000' && lpPriceRes.data) {
        wraPrice = lpPriceRes.data.wraPrice;
        const item = lpPriceRes.data.list.find((priceObj: any) => {
          return priceObj.contract === lpContract;
        });
        lpPrice = item ? Number(item.price) : 1;
      }
      // const totalReward = web3.utils.fromWei(poolInfo.totalReward, 'ether');

      response.vesting = ((poolInfo.lockedEndBlock - poolInfo.claimableStartBlock) * 3) / 60 / 60 / 24;

      response.stakeTokenAddress = stakeTokenAddress;
      let stakeTokenContract = new web3.eth.Contract(this.getStakeTokenAbi(), stakeTokenAddress, {
        from: ethAddress,
      });

      const poolStakeTokenSupply = await stakeTokenContract.methods.balanceOf(contractAddress).call();
      const stakeTokenSupply = web3.utils.fromWei(poolStakeTokenSupply, 'ether');

      const balance = await stakeTokenContract.methods.balanceOf(ethAddress).call();
      response.lpBalance = web3.utils.fromWei(balance, 'ether');
      const allowance = await stakeTokenContract.methods.allowance(ethAddress, contractAddress).call();
      response.lpAllowance = allowance;

      const rewardPerBlock = web3.utils.fromWei(poolInfo.rewardPerBlock, 'ether');
      response.apr = await this.getLpApr(platform, ethAddress, stakeTokenAddress, rewardPerBlock, lpPrice, wraPrice);

      const userInfo = await lockContract.methods.userInfo(poolIndex, ethAddress).call();
      // console.log('userInfo: ', userInfo);
      if (!userInfo) {
        return;
      }
      response.userStakedAmount = web3.utils.fromWei(userInfo.amount, 'ether');

      if (!isNaN(Number(lpPrice))) {
        response.totalMintedValue = numberUtil.handleAmountRoundToFixed(Number(lpPrice) * stakeTokenSupply, 2);
        response.myMint = numberUtil.handleAmountRoundToFixed(Number(lpPrice) * response.userStakedAmount, 2);
      }

      if (Number(stakeTokenSupply) === Number(0)) {
        if (Number(response.userStakedAmount) > 0) {
          response.myMintRatio = 100;
        } else {
          response.myMintRatio = 0;
        }
      } else {
        response.myMintRatio = numberUtil.min(
          100,
          Math.round(((response.userStakedAmount * 100) / stakeTokenSupply) * 10) / 10,
        );
      }

      const userClaimableReward = await lockContract.methods.getUserClaimableReward(poolIndex, ethAddress).call();
      const userPendingReward = await lockContract.methods.pendingReward(poolIndex, ethAddress).call();
      if (isNaN(userClaimableReward) || isNaN(userPendingReward)) {
        return;
      }
      response.fisClaimableReward = web3.utils.fromWei(userClaimableReward, 'ether');
      response.fisTotalReward =
        Number(web3.utils.fromWei(userInfo.currentTotalReward, 'ether')) +
        Number(web3.utils.fromWei(userPendingReward, 'ether')) +
        Number(web3.utils.fromWei(userInfo.claimedReward, 'ether'));

      // console.log('sdfsdf', web3.utils.fromWei(userInfo.claimedReward, 'ether'));
      response.fisLockedReward = numberUtil.max(
        0,
        Number(response.fisTotalReward) -
          Number(response.fisClaimableReward) -
          Number(web3.utils.fromWei(userInfo.claimedReward, 'ether')),
      );

      if (!isNaN(Number(fisPrice))) {
        response.myReward = numberUtil.handleAmountRoundToFixed(fisPrice * response.fisTotalReward, 2);
      }
    } finally {
      return response;
    }
  }
}
