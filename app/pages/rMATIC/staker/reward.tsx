import React, { useEffect } from 'react';
import RewardContent from '@components/reward/index'
import DataItem from '@components/reward/dataItem';
import {getReward, getUnbondCommission} from '@features/rMATICClice';
import CommonClice from '@features/commonClice'
import { useDispatch, useSelector } from 'react-redux';
import NumberUtil from '@util/numberUtil'
import { RootState } from 'app/store';
import { rSymbol } from '@keyring/defaults';

const commonClice=new CommonClice()
export default function Index(){
    const dispatch=useDispatch();
    useEffect(()=>{ 
        dispatch(getUnbondCommission());
    },[])
    const {rewardList,unbondCommission,rewardList_lastdata}=useSelector((state:RootState)=>{
        return {
            rewardList:state.rMATICModule.rewardList,
            unbondCommission:state.rMATICModule.unbondCommission,
            rewardList_lastdata:state.rMATICModule.rewardList_lastdata
        }
    }) 
    return <RewardContent  hours={24} rewardList={rewardList} getReward={getReward} type="MATIC">
        {
            rewardList.map((item,index)=>{
                let reward:any='--';
            
                if(index<(rewardList.length-1)){
                    reward=(item.rate-rewardList[index+1].rate)*rewardList[index+1].rbalance;
                    reward=(reward>0 ? "+":"") + NumberUtil.handleFisAmountRateToFixed(reward);
                }else if(rewardList_lastdata){
                    reward=(item.rate-rewardList_lastdata.rate)*rewardList_lastdata.rbalance;
                    reward=(reward>0 ? "+":"") + NumberUtil.handleFisAmountRateToFixed(reward);
                }
                
                return <DataItem era={item.era} tokenAmount={NumberUtil.handleFisAmountToFixed(item.rbalance)} ratio={NumberUtil.handleFisAmountRateToFixed(item.rate)} redeemableToken={commonClice.getWillAmount(item.rate,unbondCommission,item.rbalance)} reward={reward} />
            })
        } 
    </RewardContent>
}