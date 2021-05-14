import React from 'react';
import LeftContent from '@components/content/leftContent';
import selected_rETH from '@images/selected_rETH.svg';
import BackIcon from '@shared/components/backIcon/index';
import PoolItem from './components/poolItem';
import A from '@shared/components/button/a'
import Status from './components/status'
import Process from './components/process'
import './index.scss';
export default function Index(porps:any){
    return <LeftContent className="stafi_validator_context stafi_reth_poolConract_context">
        <BackIcon />
        <div className="title">
          <img src={selected_rETH}/>  Pool Contract
        </div>
        <div className="pool_info">
        <PoolItem>
           Address: <A underline={true}>0x514910771af9ca656af840dff83e8264ecf986ca</A>
        </PoolItem>
        <PoolItem label="Process">
           <Process status={3}/>
        </PoolItem>
        <PoolItem label="Statuts">
         <Status status="Active"/>
        </PoolItem>
        <PoolItem label="Current Balance">
        32.022423 ETH
        </PoolItem>
        <PoolItem label="Effective Balance">
        32.00 ETH
        </PoolItem>
        <PoolItem label="Income">
        <p>1 day  <label>+0.0034 ETH</label> </p>
        <p>3 day  <label>+0.0034 ETH </label></p>
        <p>7 day  <label>+0.0034 ETH</label></p>
        <p>APR  23% (estimated based on the last 7 days) </p>
        </PoolItem>
        <PoolItem label="Eligible for Activation">
        6d days ago (Epoch 363)
        </PoolItem>
        <PoolItem label="Active since">
        5d days ago (Epoch 689)
        </PoolItem> 
        </div>
    </LeftContent>
}