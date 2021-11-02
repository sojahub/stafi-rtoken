import React from 'react';
import DataItem from 'src/components/reward/dataItem';
import RewardContent from 'src/components/reward/index';
export default function Index(){
    return <RewardContent  getReward={()=>{}} type="DOT">
         <DataItem era={1} tokenAmount={2.234323} ratio={32.321232} redeemableToken={2.342345} reward={23.432345} />
         <DataItem era={2} tokenAmount={2.234323} ratio={32.321232} redeemableToken={2.342345} reward={23.432345} />
         <DataItem era={2} tokenAmount={2.234323} ratio={32.321232} redeemableToken={2.342345} reward={23.432345} />
         <DataItem era={4} tokenAmount={2.234323} ratio={32.321232} redeemableToken={2.342345} reward={23.432345} />
         
    </RewardContent>
}