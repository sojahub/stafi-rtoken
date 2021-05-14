import React from 'react'
import Input from '@shared/components/input/amountInput';
import rETH from '@images/selected_rETH.svg';
import add_svg from '@images/add.svg'
import Button from '@shared/components/button/button';
import LeftContent from '@components/content/leftContent';
import './index.scss';
export default function Index(){
    return     <LeftContent className="stafi_validator_context stafi_reth_validator_context">
        
       <div className="reth_title"> Deposit </div>
       <div className="reth_sub_title">
        Deposit 8 ETH to be a delegated validator
       </div>
       <Input  placeholder="AMOUNT" icon={rETH}/>
       <div className="pool">
            23.344 ETH  is waiting to be staked，check pool status
       </div>
       <div className="data_info">
            <div>
                <label className="data_title">Estimated APR</label>
                <label className="data_value">18.23%</label>
            </div>
            <div className="data_add">
                <img src={add_svg} />
            </div>
            <div>
                <label className="data_title">Dropped FIS</label>
                <label className="data_value">18.23%</label>
            </div>
       </div>
       <div className="btns reth_btns">
       <Button  onClick={()=>{ 
            }}>Deposit</Button>
       </div>
    </LeftContent>
}