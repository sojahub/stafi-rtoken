import React, { useEffect, useState } from 'react'; 
import {useDispatch,useSelector} from 'react-redux';
import Content from '@components/content/stakeContent_DOT'; 
import {transfer,rTokenLedger} from '@features/rATOMClice'; 
import { rTokenRate } from '@features/rATOMClice';
import {ratioToAmount} from '@util/common'
import { message } from 'antd';
import NumberUtil from '@util/numberUtil';
import { setProcessSlider } from '@features/globalClice'; 
import { rSymbol } from '@keyring/defaults';

export default function Index(props:any){

 const dispatch=useDispatch();
 
  const [amount,setAmount]=useState<any>(); 
  useEffect(()=>{ 
    dispatch(rTokenRate());
    dispatch(rTokenLedger())
  },[])
  const {transferrableAmount,ratio,stafiStakerApr,fisCompare,validPools,totalIssuance,bondFees}=useSelector((state:any)=>{ 
    const fisCompare = NumberUtil.fisAmountToChain(state.FISModule.fisAccount.balance) < state.rATOMModule.bondFees + state.FISModule.estimateBondTxFees;
    return {
      transferrableAmount:state.rATOMModule.transferrableAmountShow,
      ratio:state.rATOMModule.ratio,
      stafiStakerApr:state.rATOMModule.stakerApr,
      fisCompare:fisCompare,
      validPools:state.rATOMModule.validPools,
      totalIssuance:state.rATOMModule.totalIssuance,
      bondFees:state.rATOMModule.bondFees
    }
  })


  return  <Content
  amount={amount}
  willAmount={ratio=='--'?"--":ratioToAmount(amount,ratio)}
  unit={"ATOM"}
  transferrableAmount={transferrableAmount}
  apr={stafiStakerApr} 
  onChange={(value:any)=>{   
      setAmount(value);   
  }}
  onRecovery={()=>{ 
     props.history.push("/rATOM/search")
  }}
  validPools={validPools}  
  bondFees={NumberUtil.fisAmountToHuman(bondFees) || "--"}
  totalStakedToken={NumberUtil.handleFisAmountToFixed(totalIssuance*ratio)} 
  onStakeClick={()=>{
    if (amount) { 
      if(fisCompare){
        message.error("No enough FIS to pay for the fee");
        return;
      }
      dispatch(transfer(amount,()=>{
        dispatch(setProcessSlider(false));
        props.history.push("/rATOM/staker/info")
      }));
    }else{
      message.error("Please enter the amount")
    } 
  }}
  type="rATOM"></Content>
}