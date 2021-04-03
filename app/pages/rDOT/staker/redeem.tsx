import React, { useEffect, useState } from 'react'; 
import {useSelector} from 'react-redux';
import Content from '@components/content/redeemContent'; 
import { rTokenRate } from '@features/FISClice';
import {rSymbol} from '@keyring/defaults'
import {unbond,getUnbondCommission,query_rBalances_account,checkAddress,accountUnbonds} from '@features/rDOTClice';
import {useDispatch} from 'react-redux';
import UnbondModal from '@components/modal/unbondModal'
import NumberUtil from '@util/numberUtil'
import { message } from 'antd';

export default function Index(props:any){ 
  const dispatch=useDispatch();
  const [recipient,setRecipient]=useState<string>();
  const [amount,setAmount]=useState<any>();
  const [visible,setVisible]=useState(false);

  const {tokenAmount,unbondCommission,ratio,fisFee,address,bondFees} = useSelector((state:any)=>{ 
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
      unbondCommission:unbondCommission,
      fisFee:state.rDOTModule.unbondCommission,
      address:state.rDOTModule.dotAccount.address,
      bondFees:state.rDOTModule.bondFees
    }
  }) 
  useEffect(()=>{
    setRecipient(address)
  },[address])
  useEffect(()=>{
    dispatch(query_rBalances_account())
    dispatch(getUnbondCommission());
    dispatch(rTokenRate(rSymbol.Dot));
    
  },[])
  return  <><Content 
    history={props.history}
    amount={amount}
    tokenAmount={tokenAmount}
    unbondCommission={unbondCommission} 
    onAmountChange={(e:string)=>{
      setAmount(e)
    }}
    fisFee={fisFee}
    address={recipient}
    onInputChange={(e:string)=>{ 
      setRecipient(e)
    }}
    onRdeemClick={()=>{ 
      if(checkAddress(recipient)){
        setVisible(true);
      }else{
        message.error("Address input error");
      } 
    }}
    type="rDOT"
  />
  <UnbondModal visible={visible} 
    unbondAmount={amount}
    commission={unbondCommission}
    getAmount={NumberUtil.handleFisAmountToFixed(amount*ratio)}
    bondFees={bondFees}
    onCancel={()=>{
      setVisible(false)
    }}
    onOk={()=>{
      dispatch(unbond(amount,recipient,()=>{
        
        setAmount('');
       
        props.history.push("/rDOT/staker/info");
       }))
       setVisible(false)
    }}
    type="rDOT"
  />
  </>
}