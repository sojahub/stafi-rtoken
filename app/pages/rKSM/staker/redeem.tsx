import React, { useEffect, useState } from 'react'; 
import {message} from 'antd';
import {useSelector} from 'react-redux';
import Content from '@components/content/redeemContent'; 
import { rTokenRate } from '@features/FISClice';
import {rSymbol} from '@keyring/defaults'
import {unbond,getUnbondCommission,query_rBalances_account,checkAddress,unbondFees} from '@features/rKSMClice';
import {useDispatch} from 'react-redux';
import UnbondModal from '@components/modal/unbondModal'
import NumberUtil from '@util/numberUtil'

export default function Index(props:any){ 
  const dispatch=useDispatch();
  const [recipient,setRecipient]=useState<string>();
  const [amount,setAmount]=useState<any>();
  const [visible,setVisible]=useState(false);

  const {tokenAmount,unbondCommission,ratio,fisFee,address,unBondFees,willAmount} = useSelector((state:any)=>{ 
    let unbondCommission:any=0;
    let willAmount:any=0;
    let ratio=state.FISModule.ratio;
    let tokenAmount=state.rKSMModule.tokenAmount; 
     
    if (ratio && state.rKSMModule.unbondCommission && amount) {
      let returnValue = amount * (1 - state.rKSMModule.unbondCommission);
      unbondCommission = amount*state.rKSMModule.unbondCommission;
      willAmount = NumberUtil.handleFisAmountToFixed(returnValue * ratio);;
    } 
    return { 
      ratio:ratio,
      tokenAmount:tokenAmount, 
      unbondCommission:unbondCommission,
      fisFee:state.rKSMModule.unbondCommission,
      address:state.rKSMModule.ksmAccount.address,
      unBondFees:state.rKSMModule.unBondFees, 
      willAmount:willAmount
    }
  }) 
  useEffect(()=>{
    setRecipient(address)
  },[address])
  useEffect(()=>{
    dispatch(query_rBalances_account())
    dispatch(getUnbondCommission());
    dispatch(rTokenRate(rSymbol.Ksm));
    dispatch(unbondFees())
  },[])
  return  <><Content 
    history={props.history}
    amount={amount}
    tokenAmount={tokenAmount} 
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
    type="rKSM"
  />
  <UnbondModal visible={visible} 
    unbondAmount={amount}
    commission={unbondCommission}
    getAmount={willAmount}
    bondFees={unBondFees}
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