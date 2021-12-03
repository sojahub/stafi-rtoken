import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DataItem from 'src/components/reward/dataItem';
import RewardContent from 'src/components/reward/index';
import CommonClice from 'src/features/commonClice';
import { getReward, getUnbondCommission } from 'src/features/rMATICClice';
import { RootState } from 'src/store';
import NumberUtil from 'src/util/numberUtil';

const commonClice = new CommonClice();
export default function Index() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUnbondCommission());
  }, []);
  const { rewardList, unbondCommission, rewardList_lastdata } = useSelector((state: RootState) => {
    return {
      rewardList: state.rMATICModule.rewardList,
      unbondCommission: state.rMATICModule.unbondCommission,
      rewardList_lastdata: state.rMATICModule.rewardList_lastdata,
    };
  });
  return (
    <RewardContent hours={24} rewardList={rewardList} getReward={getReward} type='MATIC'>
      {rewardList.map((item, index) => {
        let reward: any = '--';

        if (index < rewardList.length - 1) {
          reward = (item.rate - rewardList[index + 1].rate) * rewardList[index + 1].rbalance;
        } else if (rewardList_lastdata) {
          reward = (item.rate - rewardList_lastdata.rate) * rewardList_lastdata.rbalance;
        }

        return (
          <DataItem
            key={item.era}
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
