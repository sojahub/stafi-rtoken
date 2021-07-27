import React, { useEffect } from 'react';
import RewardContent from '@components/reward/index'
import DataItem from '@components/reward/dataItem';
import {getReward, getUnbondCommission} from '@features/rKSMClice';
import CommonClice from '@features/commonClice'
import { useDispatch, useSelector } from 'react-redux';
import NumberUtil from '@util/numberUtil'
import { RootState } from 'app/store';  

const commonClice=new CommonClice()
export default function Index(){
    const dispatch=useDispatch();
    useEffect(()=>{ 
        dispatch(getUnbondCommission());
    },[])
    const {rewardList,unbondCommission,rewardList_lastdata}=useSelector((state:RootState)=>{
        return {
            rewardList:state.rKSMModule.rewardList,
            unbondCommission:state.rKSMModule.unbondCommission,
            rewardList_lastdata:state.rKSMModule.rewardList_lastdata
        }
    }) 
    return <RewardContent  hours={6} rewardList={rewardList} getReward={getReward} type="KSM">
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
    </RewardContent>
}