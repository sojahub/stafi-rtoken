import config from '@config/index';
import StafiServer from '@servers/stafi';
import numberUtil from '@util/numberUtil';
import rpc from '@util/rpc';
import { divide, multiply } from 'mathjs';

const stafiServer = new StafiServer();

export default class Index {
  getRPoolList() {
    const url = config.api() + '/stafi/v1/webapi/rpool/rpoollist';
    return rpc.post(url);
  }

  async getMintOverview(tokenSymbol: any, cycle: any, fisAddress: string, tokenPrice: any) {
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
        const claimIndexs = [];
        if (userMintsCount.toJSON() > 0) {
          for (let i = 0; i < userMintsCount.toJSON(); i++) {
            let claimInfoArr = [];
            claimInfoArr.push(fisAddress);
            claimInfoArr.push(Number(tokenSymbol));
            claimInfoArr.push(Number(cycle));
            claimInfoArr.push(i);
            const claimInfo = await stafiApi.query.rClaim.claimInfos(claimInfoArr);
            if (claimInfo.toJSON()) {
              const claimInfoJson = claimInfo.toJSON();
              totalReward += claimInfoJson.total_reward;
              
              let finalBlock = claimInfoJson.mint_block + actJson.locked_blocks;
              const lastHeader = await stafiApi.rpc.chain.getHeader();
              const nowBlock = lastHeader && lastHeader.toJSON() && lastHeader.toJSON().number;
              
              let shouldClaimAmount = claimInfoJson.total_reward - claimInfoJson.total_claimed;
              console.log('claimInfo: ', claimInfoJson);
              console.log('nowBlock, finalBlock', nowBlock, finalBlock);
              if (nowBlock < finalBlock) {
                let duBlocks = nowBlock - claimInfoJson.latest_claimed_block;
                shouldClaimAmount = (claimInfoJson.total_reward * duBlocks) / actJson.locked_blocks;
              }

              if (Number(shouldClaimAmount) > Number(0)) {
                claimIndexs.push(i);
                fisClaimableReward += shouldClaimAmount;
              }
            }
          }

          const userMintTokenCount = divide(totalReward, actJson.reward_rate);
          response.myMint = numberUtil.handleFisAmountToFixed(userMintTokenCount);
          response.myMintRatio = ((totalReward * 100) / (actJson.total_reward - actJson.left_amount)).toFixed(0);
          const mintValue = multiply(userMintTokenCount, tokenPrice);
          response.myReward = numberUtil.handleFisAmountToFixed(mintValue);

          response.fisTotalReward = numberUtil.fisAmountToHuman(totalReward).toFixed(4);
          response.fisClaimableReward = numberUtil.fisAmountToHuman(fisClaimableReward).toFixed(4);
          response.fisLockedReward = numberUtil.fisAmountToHuman(totalReward - fisClaimableReward).toFixed(4);
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
