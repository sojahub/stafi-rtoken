import React, { useEffect } from 'react';
import RewardContent from '@components/reward/index'
import DataItem from '@components/reward/dataItem';
import {getReward} from '@features/rETHClice';
import CommonClice from '@features/commonClice'
import { useDispatch, useSelector } from 'react-redux';
import NumberUtil from '@util/numberUtil'
import { RootState } from 'app/store'; 

const commonClice=new CommonClice()
export default function Index(){
    const dispatch=useDispatch();
 
    const {rewardList,rewardList_lastdata}=useSelector((state:RootState)=>{
        return {
            rewardList:state.rETHModule.rewardList, 
            rewardList_lastdata:state.rETHModule.rewardList_lastdata
        }
    }) 
    return <RewardContent hours={8} rewardList={rewardList} getReward={getReward} type="ETH">
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
                
                return <DataItem key={index} era={item.era} tokenAmount={NumberUtil.handleFisAmountToFixed(item.rbalance)} ratio={NumberUtil.handleFisAmountRateToFixed(item.rate)} redeemableToken={"0.000000"} reward={reward} />
            })
        } 
    </RewardContent>
}