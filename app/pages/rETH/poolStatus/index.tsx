import { getPoolCount, getStakingPoolStatus, getTotalRETH, getUnmatchedETH, getUnmatchedValidators } from '@features/rETHClice';
import leftArrowSvg from '@images/left_arrow.svg';
import A from '@shared/components/button/a';
import StringUtil from '@util/stringUtil';
import { RootState } from 'app/store';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DataItem from './components/dataItem';
import './index.scss';
export default function Index(props:any){
   
  const dispatch=useDispatch();
  useEffect(()=>{
    dispatch(getStakingPoolStatus())
    dispatch(getUnmatchedValidators());
    dispatch(getPoolCount());
    dispatch(getUnmatchedETH());
    dispatch(getTotalRETH(true));
  },[])
 
  const {poolStakerApr,poolValidatorApr,totalStakedAmount,unmatchedValidators,poolCount,poolStatusUnmatchedETH,poolStatusTotalRETH} = useSelector((state:RootState)=>{
    return {
      poolStakerApr:state.rETHModule.poolStakerApr,
      poolValidatorApr:state.rETHModule.poolValidatorApr,
      totalStakedAmount:state.rETHModule.totalStakedAmount,
      unmatchedValidators:state.rETHModule.unmatchedValidators,
      poolCount:state.rETHModule.poolCount,
      poolStatusTotalRETH:state.rETHModule.poolStatusTotalRETH,
      poolStatusUnmatchedETH:state.rETHModule.poolStatusUnmatchedETH
    }
  })
  return <div className="stafi_poolStatus_container">
    <img className="back_icon" onClick={()=>{
      props.history.goBack();
    }} src={leftArrowSvg}/>
    <div className="title">
        Pool Status
    </div> 

    <div className="container">
      {/* <DataItem label="Deposited ETH" value={23.23}/> */}
      {/* <DataItem label="Minted rETH" value={poolStatusTotalRETH} other={<>
        Contracts address: <A underline={true}> 0x23…HNe8</A>
      </>}/> */}
      <DataItem label="Minted rETH" value={poolStatusTotalRETH}  other={
        props.location.state && <>
        Contracts address: <A onClick={()=>{
          props.history.push("/rETH/validator/poolContract/"+props.location.state)
        }} underline={true}>{StringUtil.replacePkh(props.location.state,4,38)}</A>
      </>
      }/>
      <DataItem label="Staked ETH" value={totalStakedAmount} other={`Pool Contracts: ${poolCount}`}/> 
      {/* <DataItem label="Pool ETH " value={0} other="Pool Contracts: 23"/> */}
      <DataItem label="Unmatched ETH" value={poolStatusUnmatchedETH}/>
      <DataItem label="Unmatched Validators" value={unmatchedValidators}  />
      <DataItem label="Staker APR" value={poolStakerApr}  other="Estimated"/>
      <DataItem label="Validator APR" value={poolValidatorApr} other="Estimated"/> 
    </div>
  </div>
}