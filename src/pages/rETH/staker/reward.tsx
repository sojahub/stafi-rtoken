import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DataItem from 'src/components/reward/dataItem';
import RewardContent from 'src/components/reward/index';
import { getReward } from 'src/features/rETHClice';
import { RootState } from 'src/store';
import NumberUtil from 'src/util/numberUtil';
 
export default function Index(){
    const dispatch=useDispatch();
 
    const {rewardList,rewardList_lastdata,address}=useSelector((state:RootState)=>{
        return {
            rewardList:state.rETHModule.rewardList, 
            rewardList_lastdata:state.rETHModule.rewardList_lastdata,
            address:state.rETHModule.ethAccount?state.rETHModule.ethAccount.address:''
        }
    }) 
    return <RewardContent address={address} hours={8} rewardList={rewardList} getReward={getReward} type="ETH">
        {
            rewardList.map((item,index)=>{
                let reward:any='--';
            
                if(index<(rewardList.length-1)){
                    reward=(item.rate-rewardList[index+1].rate)*rewardList[index+1].rbalance;
                }else if(rewardList_lastdata){
                    reward=(item.rate-rewardList_lastdata.rate)*rewardList_lastdata.rbalance;
                }
                
                return <DataItem key={index} era={item.era} tokenAmount={NumberUtil.handleFisAmountToFixed(item.rbalance)} ratio={NumberUtil.handleFisAmountRateToFixed(item.rate)} redeemableToken={"0.000000"} reward={reward} />
            })
        } 
    </RewardContent>
}