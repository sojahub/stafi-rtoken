import React, { useEffect, useState } from 'react';
import LeftContent from '@components/content/leftContent';
import selected_rETH_svg from '@images/selected_rETH.svg';
import pool_eth_svg from '@images/pool_eth.svg';
import Button from '@shared/components/button/button';
import AddressCard from './components/addressCard';
import AddressItem from './components/addressCard/item';
import down_arrow from '@images/selectedIcon2.svg'
import NoDetails from '@shared/components/noDetails'
import './index.scss'
import { message } from 'antd';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { RootState } from 'app/store';
import NumberUtil from '@util/numberUtil';
import {getSelfDeposited,setTotalStakedETHShow,setRunCount} from '@features/rETHClice'; 

const getStatus=(status:any)=>{
  switch(status){
    case -1:
      return '--'; 
    case 2:
      return 'Pending';
    case 3:
      return 'Active';
    case 4:
      return 'Exited';
    case 5:
      return 'Exiting';
    case 6:
      return 'Slashing';
    case 7:
      return 'Waiting';
    case 8:
      return 'Dissolved';
    default:
      return '--'; 
  }
}


export default function Index(props:any){

  const dispatch =useDispatch();  
  const {selfDeposited,apr,totalStakedETH,totalStakedETHShow,addressItems,runCount} =useSelector((state:RootState)=>{
    return  {
      selfDeposited:state.rETHModule.selfDeposited,
      apr:state.rETHModule.status_Apr,
      totalStakedETH:state.rETHModule.totalStakedETH,
      totalStakedETHShow:state.rETHModule.totalStakedETHShow,
      addressItems:state.rETHModule.addressItems,
      runCount:state.rETHModule.runCount
    }
  })
  useEffect(()=>{
    dispatch(setRunCount(0));
    dispatch(getSelfDeposited())
  },[])

  
  useEffect(()=>{ 
    if(runCount==0 && totalStakedETH !="--"){
      dispatch(setRunCount(1)); 
      let count = 0;
      let totalCount = 10;
      let totalStakedETHAmount = 0;
      let piece = Number(totalStakedETH) / totalCount; 
        let interval = setInterval(() => {
          count++;
          totalStakedETHAmount += piece;
          if (count == totalCount || Number(totalStakedETH)==0) {
            totalStakedETHAmount = Number(totalStakedETH);
            window.clearInterval(interval);
          }
          dispatch(setTotalStakedETHShow(NumberUtil.handleFisAmountRateToFixed(totalStakedETHAmount)))
        }, 100); 
    } 
  },[totalStakedETH,runCount])
  // if(totalStakedETH=="--"){
  // return <LeftContent className="stafi_status_validator_context">
  //     <NoDetails type="max"/> 
  // </LeftContent>
  // }

  return <LeftContent className="stafi_status_validator_context">
        <div className="staked_eth">
            <div className="title">
                <img src={selected_rETH_svg} /> Staked ETH
            </div>
            <div className="liquefy_panel">
                <label>
                    {totalStakedETHShow}
                </label>
                <Button disabled={true} size="small" btnType="ellipse" onClick={()=>{
                  //  props.history.push("/rETH/liquefy"); 
                   message.info('This feature is not yet open.');
              }}>Liquify</Button>
            </div>
            <div className="apr_panel">
                <div>
                  Self-deposited: {NumberUtil.handleEthRoundToFixed(selfDeposited)}
                </div>
                <div>
                  Current APR: {apr}
                </div>
            </div>
        </div>
        
        <div className="pool_contracts">
            <div className="title">
                <img src={pool_eth_svg} />Pool Contracts ({addressItems.length})  <img className="icon" src={down_arrow} />
            </div>
            {addressItems.length == 0 ? <NoDetails type="small"/>: <div className="Row">
              <AddressCard >
                {addressItems.map((item)=>{ 
                  return  <AddressItem onClick={()=>{ 
                   
                    props.history.push("/rETH/validator/poolContract/"+item.address)
                  }} address={item.shortAddress} status={getStatus(item.status)}/>
                })} 
                 
              </AddressCard>

              <div className="btns">
              <Button size="small" btnType="ellipse" onClick={()=>{
                  props.history.push("/rETH/validator/deposit")
                }}>New Deposit</Button>
              </div>
            </div>} 
        </div>
    </LeftContent>
}