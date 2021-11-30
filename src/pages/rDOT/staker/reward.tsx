import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NewReward } from 'src/components/NewReward';
import DataItem from 'src/components/reward/dataItem';
import RewardContent from 'src/components/reward/index';
import CommonClice from 'src/features/commonClice';
import { getReward, getUnbondCommission } from 'src/features/rDOTClice';
import { RootState } from 'src/store';
import NumberUtil from 'src/util/numberUtil';

const commonClice = new CommonClice();
export default function Index() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUnbondCommission());
  }, []);
  const { rewardList, unbondCommission, rewardList_lastdata, address } = useSelector((state: RootState) => {
    return {
      rewardList: state.rDOTModule.rewardList,
      unbondCommission: state.rDOTModule.unbondCommission,
      rewardList_lastdata: state.rDOTModule.rewardList_lastdata,
      address: state.rDOTModule.dotAccount ? state.rDOTModule.dotAccount.address : '',
    };
  });

  return <NewReward type='rDOT' hours={24} />;

  return (
    <RewardContent address={address} hours={24} rewardList={rewardList} getReward={getReward} type='DOT'>
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

      {/* <DataItem era={2} tokenAmount={2.234323} ratio={32.321232} redeemableToken={2.342345} reward={23.432345} />
         <DataItem era={2} tokenAmount={2.234323} ratio={32.321232} redeemableToken={2.342345} reward={23.432345} />
         <DataItem era={4} tokenAmount={2.234323} ratio={32.321232} redeemableToken={2.342345} reward={23.432345} />
         <DataItem era={1} tokenAmount={2.234323} ratio={32.321232} redeemableToken={2.342345} reward={23.432345} />
         <DataItem era={2} tokenAmount={2.234323} ratio={32.321232} redeemableToken={2.342345} reward={23.432345} />
         <DataItem era={2} tokenAmount={2.234323} ratio={32.321232} redeemableToken={2.342345} reward={23.432345} />
         <DataItem era={4} tokenAmount={2.234323} ratio={32.321232} redeemableToken={2.342345} reward={23.432345} />
         <DataItem era={1} tokenAmount={2.234323} ratio={32.321232} redeemableToken={2.342345} reward={23.432345} />
         <DataItem era={2} tokenAmount={2.234323} ratio={32.321232} redeemableToken={2.342345} reward={23.432345} />
         <DataItem era={2} tokenAmount={2.234323} ratio={32.321232} redeemableToken={2.342345} reward={23.432345} />
         <DataItem era={4} tokenAmount={2.234323} ratio={32.321232} redeemableToken={2.342345} reward={23.432345} />
         <DataItem era={1} tokenAmount={2.234323} ratio={32.321232} redeemableToken={2.342345} reward={23.432345} />
         <DataItem era={2} tokenAmount={2.234323} ratio={32.321232} redeemableToken={2.342345} reward={23.432345} />
         <DataItem era={2} tokenAmount={2.234323} ratio={32.321232} redeemableToken={2.342345} reward={23.432345} />
         <DataItem era={4} tokenAmount={2.234323} ratio={32.321232} redeemableToken={2.342345} reward={23.432345} /> */}
    </RewardContent>
  );
}
