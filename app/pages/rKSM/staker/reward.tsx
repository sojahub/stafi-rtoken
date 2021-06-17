import React from 'react';
import RewardContent from '@components/reward/index'
import DataItem from '@components/reward/dataItem'
export default function Index(){
    return <RewardContent type="KSM">
         <DataItem era={1} tokenAmount={2.234323} ratio={32.321232} redeemableToken={2.342345} reward={23.432345} />
         <DataItem era={2} tokenAmount={2.234323} ratio={32.321232} redeemableToken={2.342345} reward={23.432345} />
         <DataItem era={2} tokenAmount={2.234323} ratio={32.321232} redeemableToken={2.342345} reward={23.432345} />
         <DataItem era={4} tokenAmount={2.234323} ratio={32.321232} redeemableToken={2.342345} reward={23.432345} />
    </RewardContent>
}