import React, { useEffect, useState } from 'react'; 
import {useSelector} from 'react-redux';
import Content from '@components/content/redeemContent'; 
import { rTokenRate } from '@features/FISClice';
import {rSymbol} from '@keyring/defaults'
import {unbond,getUnbondCommission,query_rBalances_account} from '@features/rDOTClice';
import {useDispatch} from 'react-redux';
import NumberUtil from '@util/numberUtil'

export default function Index(props:any){ 
  const dispatch=useDispatch();

  const [amount,setAmount]=useState<any>();

  const {tokenAmount,unbondCommission,ratio} = useSelector((state:any)=>{
    let unbondCommission=state.rDOTModule.unbondCommission;
    let ratio=state.FISModule.ratio;
    let tokenAmount=state.rDOTModule.tokenAmount; 
    if (ratio && unbondCommission && amount) {
      let returnValue = amount * (1 - unbondCommission);
      unbondCommission = NumberUtil.handleFisAmountToFixed(returnValue * ratio);;
    } 
    return { 
      ratio:ratio,
      tokenAmount:tokenAmount, 
      unbondCommission:unbondCommission
    }
  })
  

  useEffect(()=>{
    dispatch(query_rBalances_account())
    dispatch(getUnbondCommission());
    dispatch(rTokenRate(rSymbol.Dot));
  },[])
  return  <Content 
    history={props.history}
    amount={amount}
    tokenAmount={tokenAmount}
    unbondCommission={unbondCommission}
    onAmountChange={(e:string)=>{
      setAmount(e)
    }}
    onRdeemClick={()=>{
      console.log('++++++onRdeemClick')
     dispatch(unbond(amount,()=>{
      setAmount('');
     }))
    }}
  />
}