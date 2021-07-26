import React, { useEffect } from 'react';
import RewardContent from '@components/reward/index'
import DataItem from '@components/reward/dataItem';
import {getReward, getUnbondCommission} from '@features/rDOTClice';
import CommonClice from '@features/commonClice'
import { useDispatch, useSelector } from 'react-redux';
import NumberUtil from '@util/numberUtil'
import { RootState } from 'app/store'; 
import config from '@config/index';

const commonClice=new CommonClice()
export default function Index(){
    const dispatch=useDispatch();
    useEffect(()=>{ 
        dispatch(getUnbondCommission());
    },[])
    const {rewardList,unbondCommission,rewardList_lastdata}=useSelector((state:RootState)=>{
        return {
            rewardList:state.rDOTModule.rewardList,
            unbondCommission:state.rDOTModule.unbondCommission,
            rewardList_lastdata:state.rDOTModule.rewardList_lastdata
        }
    }) 
    return <RewardContent hours={24} rewardList={rewardList} getReward={getReward} type="DOT">
        {
            rewardList.map((item,index)=>{
                let reward:any='--';
            
                if(index<(rewardList.length-1)){
                    reward=(item.rate-rewardList[index+1].rate)*rewardList[index+1].rbalance; 
                }else if(rewardList_lastdata){
                    reward=(item.rate-rewardList_lastdata.rate)*rewardList_lastdata.rbalance;  
                }
                
                return <DataItem era={item.era} tokenAmount={NumberUtil.handleFisAmountToFixed(item.rbalance)} ratio={NumberUtil.handleFisAmountRateToFixed(item.rate)} redeemableToken={commonClice.getWillAmount(item.rate,unbondCommission,item.rbalance)} reward={reward} />
            })
        }
         
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
}