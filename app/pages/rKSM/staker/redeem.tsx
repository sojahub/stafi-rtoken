import React, { useEffect, useState } from 'react'; 
import {useSelector} from 'react-redux';
import Content from '@components/content/redeemContent'; 
import { rTokenRate } from '@features/FISClice';
import {rSymbol} from '@keyring/defaults'
import {unbond,getUnbondCommission,query_rBalances_account} from '@features/rKSMClice';
import {useDispatch} from 'react-redux';
import UnbondModal from '@components/modal/unbondModal'
import NumberUtil from '@util/numberUtil'

export default function Index(props:any){ 
  const dispatch=useDispatch();
  const [recipient,setRecipient]=useState<string>();
  const [amount,setAmount]=useState<any>();
  const [visible,setVisible]=useState(false);

  const {tokenAmount,unbondCommission,ratio,fisFee,address,bondFees} = useSelector((state:any)=>{ 
    let unbondCommission=state.rKSMModule.unbondCommission;
    let ratio=state.FISModule.ratio;
    let tokenAmount=state.rKSMModule.tokenAmount; 
    
    if (ratio && unbondCommission && amount) {
      let returnValue = amount * (1 - unbondCommission);
      unbondCommission = NumberUtil.handleFisAmountToFixed(returnValue * ratio);;
    } 
 
    return { 
      ratio:ratio,
      tokenAmount:tokenAmount, 
      unbondCommission:unbondCommission,
      fisFee:state.rKSMModule.unbondCommission,
      address:state.rKSMModule.ksmAccount.address,
      bondFees:state.rKSMModule.bondFees
    }
  }) 
  useEffect(()=>{
    setRecipient(address)
  },[address])
  useEffect(()=>{
    dispatch(query_rBalances_account())
    dispatch(getUnbondCommission());
    dispatch(rTokenRate(rSymbol.Ksm));
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
      setVisible(true);
    }}
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
       
        props.history.push("/rKSM/staker/info");
       }))
       setVisible(false)
    }}
    type="rKSM"
  />
  </>
}