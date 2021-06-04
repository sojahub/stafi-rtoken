import React from 'react';
import Button from '@shared/components/button/button';
import LeftContent from '@components/content/leftContent';
import './index.scss'; 

import { message } from 'antd';

 
export default function Index(props:any){
    return <LeftContent className="stafi_validator_context stafi_reth_validator_context">
        <label className="title">Validator Process</label> 
        <div className="sub_title">
        1.Deposit
        </div>
        <div className="describe">
        Deposit 8 ETH to register as a delegated validator on StaFi, StaFi Staking Contract will match 24 ETH to your node so that it can meet the validator requirements of ETH2.0.
        </div>
        <div className="sub_title">
        2.Stake
        </div>
        <div className="describe"> 
        Once 32ETH is matched to your node, you can deploy a pool contract to deposit 32ETH to the Deposit contract on ETH1.0, and then wait for validation progress on ETH2.0.
        </div>
        <div className="sub_title">
        3.Status
        </div>
        <div className="describe"> 
        There is nothing we can do in this step, once you stake, we should wait for the queen, check the status on the dashboard.
        </div>
        <div className="btns">
            <Button  onClick={()=>{
                props.history && props.history.push("/rETH/validator/deposit")
            }}>Start</Button>
        </div>
    </LeftContent>
}