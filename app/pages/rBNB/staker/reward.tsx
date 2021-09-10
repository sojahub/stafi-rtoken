import DataItem from '@components/reward/dataItem';
import RewardContent from '@components/reward/index';
import CommonClice from '@features/commonClice';
import { getReward, getUnbondCommission } from '@features/rBNBClice';
import NumberUtil from '@util/numberUtil';
import { RootState } from 'app/store';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const commonClice = new CommonClice();
export default function Index() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUnbondCommission());
  }, []);

  const { rewardList, unbondCommission, rewardList_lastdata, address } = useSelector((state: RootState) => {
    return {
      rewardList: state.rBNBModule.rewardList,
      unbondCommission: state.rBNBModule.unbondCommission,
      rewardList_lastdata: state.rBNBModule.rewardList_lastdata,
      address: state.rETHModule.ethAccount && state.rETHModule.ethAccount.address,
    };
  });

  return (
    <RewardContent address={address} hours={24} rewardList={rewardList} getReward={getReward} type='BNB'>
      {rewardList.map((item, index) => {
        let reward: any = '--';

        if (index < rewardList.length - 1) {
          reward = (item.rate - rewardList[index + 1].rate) * rewardList[index + 1].rbalance;
        } else if (rewardList_lastdata) {
          reward = (item.rate - rewardList_lastdata.rate) * rewardList_lastdata.rbalance;
        }

        return (
          <DataItem
            era={item.era}
            tokenAmount={NumberUtil.handleFisAmountToFixed(item.rbalance)}
            ratio={NumberUtil.handleFisAmountRateToFixed(item.rate)}
            redeemableToken={commonClice.getWillAmount(item.rate, unbondCommission, item.rbalance)}
            reward={reward}
          />
        );
      })}
    </RewardContent>
  );
}