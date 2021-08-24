import config, { getRsymbolByTokenTitle } from '@config/index';
import { rSymbol } from '@keyring/defaults';
import StafiServer from '@servers/stafi';
import { formatDuration } from '@util/dateUtil';
import numberUtil from '@util/numberUtil';
import rpc from '@util/rpc';
import { divide, max, min, multiply } from 'mathjs';

const stafiServer = new StafiServer();

export default class Index {
  getRPoolList() {
    const url = config.api() + '/stafi/v1/webapi/rpool/rpoollist';
    return rpc.post(url);
  }

  async getRTokenMintRewardActs(symbol: rSymbol) {
    const stafiApi = await stafiServer.createStafiApi();
    const actLatestCycle = await stafiApi.query.rClaim.actLatestCycle(symbol);
    const acts = [];
    if (actLatestCycle == 0) {
      console.log('empty mint info');
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
            let days = divide(actJson.end - actJson.begin, 14400);
            actJson.durationInDays = Math.round(days * 10) / 10;
            actJson.remainingTime = formatDuration(max(0, actJson.end - nowBlock) * 6);
            actJson.endTimeStamp = Date.now() + (actJson.end - nowBlock) * 6000;
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

  async getCurrentActiveAct(rTokenTitle: string) {
    const acts = await this.getRTokenMintRewardActs(getRsymbolByTokenTitle(rTokenTitle));
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
            response.myMintRatio = min(
              100,
              Math.round(
                ((response.myMint * 100) /
                  numberUtil.tokenAmountToHuman(actJson.total_rtoken_amount, Number(tokenSymbol))) *
                  10,
              ) / 10,
            );
          }

          if (fisPrice && fisPrice !== '--' && !isNaN(fisPrice)) {
            const mintValue = multiply(formatTotalReward, fisPrice);
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
            response.myMintRatio = min(
              100,
              Math.round(
                ((formatTotalReward * 100) /
                  numberUtil.tokenAmountToHuman(actJson.total_rtoken_amount, rSymbol.Eth)) *
                  10,
              ) / 10,
            );
          }

          if (fisPrice && fisPrice !== '--' && !isNaN(fisPrice)) {
            const mintValue = multiply(formatTotalReward, fisPrice);
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
}
