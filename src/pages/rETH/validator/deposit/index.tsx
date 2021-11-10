import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import rETH from 'src/assets/images/selected_rETH.svg';
import LeftContent from 'src/components/content/leftContent';
import { getDepositAmount, getDepositBalance, handleDeposit } from 'src/features/rETHClice';
import A from 'src/shared/components/button/a';
import Button from 'src/shared/components/button/button';
import Input from 'src/shared/components/input/amountInput';
import { RootState } from 'src/store';
import './index.scss';
export default function Index(props:any){
    const dispatch=useDispatch(); 
    // const [amount,setAmount]=useState(8);
    const { validatorApr,depositWaitingStaked,waitingPoolCount,ethAmount } = useSelector((state:RootState)=>{
        return {
            validatorApr:state.rETHModule.validatorApr,
            depositWaitingStaked:state.rETHModule.depositWaitingStaked,
            waitingPoolCount:state.rETHModule.waitingPoolCount,
            ethAmount:state.rETHModule.ethAmount
        }
    })
    useEffect(()=>{
        dispatch(getDepositBalance())
        dispatch(getDepositAmount())
    },[]) 
    return <LeftContent className="stafi_validator_context stafi_reth_validator_context">
       <div className="reth_title"> Deposit </div>
       <div className="reth_sub_title">
            Deposit {ethAmount} ETH to be a delegated validator
       </div>
       <Input disabled={true} value={ethAmount} placeholder="AMOUNT" icon={rETH}/>
       <div className="pool">
            {(Number(depositWaitingStaked)>0 || depositWaitingStaked=="--") && <>{depositWaitingStaked} ETH  is waiting to be staked，check <A underline={true} onClick={()=>{ 
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
           dispatch(handleDeposit(ethAmount,(e:string)=>{  
                if(e=="ok"){
                    props.history.push("/rETH/validator/stake")
                }
           }))  
        }}>Deposit</Button>
       </div>
      
    </LeftContent>
}