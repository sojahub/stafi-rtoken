import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import selected_rETH from 'src/assets/images/selected_rETH.svg';
import LeftContent from 'src/components/content/leftContent';
import { getPoolInfo, rewardDetails } from "src/features/rETHClice";
import BackIcon from 'src/shared/components/backIcon/index';
import A from 'src/shared/components/button/a';
import PoolItem from './components/poolItem';
import Process from './components/process';
import Status from './components/status';
import './index.scss';
export default function Index(props:any){
  const dispatch=useDispatch();
  useEffect(()=>{  
    dispatch(getPoolInfo(props.match.params.poolAddress));
  },[])
  const {stakingPoolDetail}=useSelector((state:any)=>{
    return { 
      stakingPoolDetail:state.rETHModule.stakingPoolDetail
    }
  }) 
    return <LeftContent className="stafi_validator_context stafi_reth_poolConract_context">
        <BackIcon  onClick={()=>{
      props.history.goBack();
    }}/>
        <div className="title">
          <img src={selected_rETH}/>  Pool Contract
        </div>
        <div className="pool_info">
        <PoolItem>
           Address: <A onClick={()=>{
             window.open('https://etherscan.io/address/' + props.match.params.poolAddress);
           }} underline={true}>{props.match.params.poolAddress}</A>
        </PoolItem>
        <PoolItem label="Process"> 
           <Process currentBalance={stakingPoolDetail?stakingPoolDetail.currentBalance:"--"} status={stakingPoolDetail ? stakingPoolDetail.status : 0}/>
        </PoolItem>
        <PoolItem label="Status">
         <Status currentBalance={stakingPoolDetail?stakingPoolDetail.currentBalance:"--"}  status={stakingPoolDetail ? stakingPoolDetail.status : 0}/>
        </PoolItem>
        <PoolItem label="Current Balance">
          {stakingPoolDetail?stakingPoolDetail.currentBalance:"--"} ETH
        </PoolItem>
        <PoolItem label="Effective Balance">
          {stakingPoolDetail?stakingPoolDetail.effectiveBalance:"--"} ETH
        </PoolItem>
       <PoolItem label="Income">
         {(stakingPoolDetail && stakingPoolDetail.rewardDetails)?stakingPoolDetail.rewardDetails.map((item:any)=>{
           return <p>{item.cycle}  <label>{item.reward} ETH</label> </p>
         }):rewardDetails.map((item:any)=>{
          return <p>{item.cycle}  <label>{item.reward} ETH</label> </p>
        })} 
        <p>APR   {(stakingPoolDetail && stakingPoolDetail.apr)?stakingPoolDetail.apr:"--"} (estimated based on the last 7 days) </p>
        </PoolItem>
        <PoolItem label="Eligible for Activation">
          Epoch {(stakingPoolDetail && stakingPoolDetail.activationEligibilityEpoch)?stakingPoolDetail.activationEligibilityEpoch:"--"}
        </PoolItem>
        <PoolItem label="Active since">
          Epoch {(stakingPoolDetail && stakingPoolDetail.activationEpoch)?stakingPoolDetail.activationEpoch:"--"}
        </PoolItem> 
        </div>
    </LeftContent>
}