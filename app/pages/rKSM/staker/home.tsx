import React, { useEffect, useState } from 'react'; 
import {useDispatch,useSelector} from 'react-redux';
import Content from '@components/content/stakeContent_DOT'; 
import {transfer,balancesAll} from '@features/rKSMClice'; 
import { rTokenRate } from '@features/FISClice';
import {ratioToAmount} from '@util/common'
import { message } from 'antd';
import NumberUtil from '@util/numberUtil'
import { parseNumber } from '@util/utils';

export default function Index(props:any){

 const dispatch=useDispatch();
 
  const [amount,setAmount]=useState(); 
  useEffect(()=>{
    dispatch(balancesAll());
    dispatch(rTokenRate(1))
  },[])
  const {transferrableAmount,ratio,stafiStakerApr,fisCompare,validPools,totalRDot,bondFees}=useSelector((state:any)=>{ 
    const fisCompare= state.FISModule.fisAccount.balance<NumberUtil.fisAmountToHuman(state.rKSMModule.bondFees)+NumberUtil.fisAmountToHuman(state.rKSMModule.estimateTxFees);
    return {
      transferrableAmount:state.rKSMModule.transferrableAmountShow,
      ratio:state.FISModule.ratio,
      stafiStakerApr:state.globalModule.stafiStakerApr,
      fisCompare:fisCompare,
      validPools:state.rKSMModule.validPools,
      totalRDot:state.rKSMModule.totalRDot,
      bondFees:state.rDOTModule.bondFees
    }
  })


  return  <Content
  amount={amount}
  willAmount={ratio=='--'?"--":ratioToAmount(amount,ratio)}
  unit={"DOT"}
  transferrableAmount={transferrableAmount}
  apr={stafiStakerApr} 
  onChange={(value:any)=>{   
      setAmount(value);   
  }}
  onRecovery={()=>{ 
     props.history.push("/rKSM/search")
  }}
  validPools={validPools} 
  bondFees={bondFees}
  totalStakedToken={ NumberUtil.handleFisAmountToFixed(totalRDot*ratio)}
  onStakeClick={()=>{
    if(fisCompare){
      message.error("Insufficient FIS balance.");
      return;
    }
    if(amount){
      dispatch(transfer(amount,()=>{
        props.history.push("/rKSM/staker/info")
      }));
    }else{
      message.error("Please enter the amount")
    } 
  }}
  type="rKSM"></Content>
}