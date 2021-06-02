import React, { useEffect, useState } from 'react'
import Input from '@shared/components/input/amountInput';
import rETH from '@images/selected_rETH.svg'; 
import Button from '@shared/components/button/button';
import A from '@shared/components/button/a'
import LeftContent from '@components/content/leftContent';
import './index.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'app/store';
import {getDepositBalance,handleDeposit,reloadData} from '@features/rETHClice';
import Modal from '@components/modal/ethDepositModal'
export default function Index(props:any){
    const dispatch=useDispatch();
    const [visible,setVisible]=useState(false);
    const [amount,setAmount]=useState(8);
    const { validatorApr,depositWaitingStaked,waitingPoolCount } = useSelector((state:RootState)=>{
        return {
            validatorApr:state.rETHModule.validatorApr,
            depositWaitingStaked:state.rETHModule.depositWaitingStaked,
            waitingPoolCount:state.rETHModule.waitingPoolCount
        }
    })
    useEffect(()=>{
        dispatch(getDepositBalance())
    },[])
    return <LeftContent className="stafi_validator_context stafi_reth_validator_context">
       <div className="reth_title"> Deposit </div>
       <div className="reth_sub_title">
            Deposit 8 ETH to be a delegated validator
       </div>
       <Input disabled={true} value={amount} placeholder="AMOUNT" icon={rETH}/>
       <div className="pool">
            {(Number(depositWaitingStaked)>0 || depositWaitingStaked=="--") && <>{depositWaitingStaked} ETH  is waiting to be staked，check <A onClick={()=>{ 
                    props.history &&  props.history.push("/rETH/poolStatus")
                }}>pool</A> status</>}
            {!(Number(depositWaitingStaked)>0 || depositWaitingStaked=="--") && <>
                { waitingPoolCount }
                {Number(waitingPoolCount)>1?"pools are":"pool is"} waiting to be matched in the queen 
            </>}
       </div>
       <div className="data_info">
            <div>
                <label className="data_title">Estimated APR</label>
                <label className="data_value">{validatorApr}</label>
            </div> 
       </div>
       <div className="btns reth_btns">
       <Button  onClick={()=>{ 
           dispatch(handleDeposit(amount,()=>{
                setVisible(true)
           }))
               
            }}>Deposit</Button>
       </div>
       <Modal 
        visible={visible}
        onClose={()=>{
            setVisible(false);
        }}
       ></Modal>
    </LeftContent>
}