import React, { useEffect, useState } from 'react'; 
import {useDispatch,useSelector} from 'react-redux';
import Content from '@components/content/stakeContent_DOT'; 
import {transfer,balancesAll,rTokenLedger} from '@features/FISClice'; 
import { rTokenRate } from '@features/FISClice';
import {ratioToAmount} from '@util/common'
import { message } from 'antd';
import NumberUtil from '@util/numberUtil';
import { fetchStafiStakerApr } from '@features/globalClice'; 
import { RootState } from 'app/store';

export default function Index(props:any){

 const dispatch=useDispatch();
 
  const [amount,setAmount]=useState<any>(); 
  useEffect(()=>{
    dispatch(balancesAll());
    dispatch(rTokenRate());
    dispatch(fetchStafiStakerApr())
  },[])
 
  const {transferrableAmount,ratio,stafiStakerApr,fisCompare,validPools,totalIssuance,bondFees}=useSelector((state:RootState)=>{ 
    const fisCompare = Number(NumberUtil.fisAmountToChain(state.FISModule.fisAccount.balance)) < Number(state.FISModule.bondFees + state.FISModule.estimateBondTxFees);
    return {
      transferrableAmount:state.FISModule.transferrableAmountShow,
      ratio:state.FISModule.ratio,
      stafiStakerApr:state.globalModule.stafiStakerApr,
      fisCompare:fisCompare,
      validPools:state.FISModule.validPools,
      totalIssuance:state.FISModule.totalIssuance,
      bondFees:state.FISModule.bondFees
    }
  })
 
  return  <Content
  amount={amount}
  willAmount={ratio=='--'?"--":ratioToAmount(amount,Number(ratio))}
  unit={"FIS"}
  transferrableAmount={transferrableAmount}
  apr={stafiStakerApr} 
  onChange={(value:any)=>{   
      setAmount(value);   
  }}
  bondFees={NumberUtil.fisAmountToHuman(bondFees) || "--"}
  onRecovery={()=>{ 
     props.history.push("/rFIS/search")
  }}
  validPools={validPools} 
  totalStakedToken={ NumberUtil.handleFisAmountToFixed((Number(totalIssuance)*Number(ratio))) || "--"}
  onStakeClick={()=>{
    
    if (amount) {
      if(fisCompare){
        message.error("No enough FIS to pay for the fee");
        return;
      }
      dispatch(transfer(amount,()=>{ 
        props.history.push("/rFIS/staker/info")
      }));
    }else{
      message.error("Please enter the amount")
    } 
  }}
  type="rFIS"></Content>
}