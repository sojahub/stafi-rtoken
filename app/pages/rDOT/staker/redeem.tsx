import React, { useState } from 'react'; 
import Content from '@components/content/redeemContent'; 
import {unbond} from '@features/rDOTClice';
import {useDispatch} from 'react-redux'

export default function Index(props:any){ 
  const dispatch=useDispatch();

  const [amount,setAmount]=useState<any>();
  return  <Content 
    amount={amount}
    onAmountChange={(e:string)=>{
      setAmount(e)
    }}
    onRdeemClick={()=>{
     dispatch(unbond(amount,()=>{
      setAmount('');
     }))
    }}
  />
}