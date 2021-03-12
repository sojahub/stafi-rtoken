import React, { useEffect, useState } from 'react'; 
import {useDispatch,useSelector} from 'react-redux';
import Content from '@components/content/stakeContent_DOT'; 
import {transfer,balancesAll} from '@features/rDOTClice'; 
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
  const {transferrableAmount,ratio,stafiStakerApr,fisCompare,validPools}=useSelector((state:any)=>{ 
    const fisCompare= state.FISModule.fisAccount.balance<NumberUtil.fisAmountToHuman(state.rDOTModule.bondFees)+NumberUtil.fisAmountToHuman(state.rDOTModule.estimateTxFees);
    return {
      transferrableAmount:state.rDOTModule.transferrableAmountShow,
      ratio:state.FISModule.ratio,
      stafiStakerApr:state.globalModule.stafiStakerApr,
      fisCompare:fisCompare,
      validPools:state.rDOTModule.validPools
    }
  })


  return  <Content
  amount={amount}
  willAmount={ratioToAmount(amount,ratio)}
  unit={"DOT"}
  transferrableAmount={transferrableAmount}
  apr={stafiStakerApr} 
  onChange={(value:any)=>{   
      setAmount(value);   
  }}
  onRecovery={()=>{ 
     props.history.push("/rDOT/search")
  }}
  validPools={validPools}
  onStakeClick={()=>{
    if(fisCompare){
      message.error("Insufficient FIS balance.");
      return;
    }
    if(amount){
      dispatch(transfer(amount,()=>{
        props.history.push("/rDOT/staker/info")
      }));
    }else{
      message.error("Please enter the amount")
    } 
  }}></Content>
}