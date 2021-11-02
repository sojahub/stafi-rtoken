import Content from '@components/content/redeemContent';
import UnbondModal from '@components/modal/unbondModal';
import CommonClice from '@features/commonClice';
import { setLoading } from '@features/globalClice';
import { checkAddress, getUnbondCommission, query_rBalances_account, rTokenRate, unbond, unbondFees } from '@features/rKSMClice';
import NumberUtil from '@util/numberUtil';
import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const commonClice=new CommonClice();
export default function Index(props:any){ 
  const dispatch=useDispatch();
  const [recipient,setRecipient]=useState<string>();
  const [amount,setAmount]=useState<any>();
  const [visible,setVisible]=useState(false);
 
  const {tokenAmount,unbondCommission,ratio,fisFee,address,unBondFees,willAmount,estimateUnBondTxFees,fisBalance} = useSelector((state:any)=>{ 
    let unbondCommission:any=0; 
    let ratio=state.rKSMModule.ratio; 
    let tokenAmount=state.rKSMModule.tokenAmount; 
     
    if (state.rKSMModule.unbondCommission && amount) { 
      unbondCommission = amount*state.rKSMModule.unbondCommission; 
    } 
    return { 
      ratio:ratio,
      tokenAmount:tokenAmount, 
      unbondCommission:unbondCommission,
      fisFee:state.rKSMModule.unbondCommission,
      address:state.rKSMModule.ksmAccount.address,
      unBondFees:state.rKSMModule.unBondFees,  
      willAmount: commonClice.getWillAmount(ratio,state.rKSMModule.unbondCommission,amount),
      estimateUnBondTxFees: state.FISModule.estimateUnBondTxFees,
      fisBalance: state.FISModule.fisAccount.balance 
    }
  }) 
  useEffect(()=>{
    setRecipient(address)
  },[address])
  useEffect(()=>{
    dispatch(query_rBalances_account())
    dispatch(getUnbondCommission());
    dispatch(rTokenRate());
    dispatch(unbondFees())
    return ()=>{
      dispatch(setLoading(false))
    }
  },[])
  return   <><Content 
    history={props.history}
    amount={amount}
    tokenAmount={tokenAmount} 
    onAmountChange={(e:string)=>{
      setAmount(e)
    }}
    fisFee={fisFee}
    address={recipient} 
    onInputConfirm={(e:boolean)=>{
      if(!e){
        if(!checkAddress(recipient)){ 
          message.error("Address input error");
          return false;
        } 
      }
      return true;
    }}
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
    bondFees={NumberUtil.fisAmountToHuman(unBondFees) || "--"}
    onCancel={()=>{
      setVisible(false)
    }}
    onOk={() => {
      if(NumberUtil.fisAmountToChain(fisBalance) <= (unBondFees + estimateUnBondTxFees)){
        message.error("No enough FIS to pay for the fee");
        return;
      }
      dispatch(setLoading(true));
      setVisible(false)
      setAmount('');
      dispatch(unbond(amount,recipient,willAmount,()=>{ 
        dispatch(setLoading(false));
      })) 
    }}
    type="rKSM"
  />
  </>
}