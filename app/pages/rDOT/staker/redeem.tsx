import React, { useEffect, useState } from 'react'; 
import {useSelector} from 'react-redux';
import Content from '@components/content/redeemContent'; 
import { rTokenRate } from '@features/FISClice';
import {rSymbol} from '@keyring/defaults'
import {unbond,getUnbondCommission,query_rBalances_account,checkAddress,unbondFees} from '@features/rDOTClice';
import {setLoading} from '@features/globalClice'
import {useDispatch} from 'react-redux';
import UnbondModal from '@components/modal/unbondModal'
import NumberUtil from '@util/numberUtil'
import { message,Spin } from 'antd';

export default function Index(props:any){ 
  const dispatch=useDispatch();
  const [recipient,setRecipient]=useState<string>();
  const [amount,setAmount]=useState<any>();
  const [visible,setVisible]=useState(false);

  const {tokenAmount,unbondCommission,ratio,fisFee,address,unBondFees,willAmount,estimateUnBondTxFees} = useSelector((state:any)=>{ 
    let willAmount:any=0;
    let unbondCommission:any=0;
    let ratio=state.FISModule.ratio;
    let tokenAmount=state.rDOTModule.tokenAmount; 
    
    if (ratio && state.rDOTModule.unbondCommission && amount) {
      let returnValue = amount * (1 - state.rDOTModule.unbondCommission);
      unbondCommission = amount*state.rDOTModule.unbondCommission;
      willAmount = NumberUtil.handleFisAmountToFixed(returnValue * ratio);;
    } 
 
    return { 
      ratio:ratio,
      tokenAmount:tokenAmount, 
      unbondCommission:unbondCommission,
      fisFee:state.rDOTModule.unbondCommission,
      address:state.rDOTModule.dotAccount.address,
      unBondFees:state.rDOTModule.unBondFees,
      willAmount: willAmount,
      estimateUnBondTxFees: state.FISModule.estimateUnBondTxFees
    }
  }) 
  useEffect(()=>{
    setRecipient(address)
  },[address])
  useEffect(()=>{
    dispatch(query_rBalances_account())
    dispatch(getUnbondCommission());
    dispatch(rTokenRate(rSymbol.Dot));
    dispatch(unbondFees());

    return ()=>{
      dispatch(setLoading(false));
    }
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
    onInputConfirm={(e:boolean)=>{
      if(!e){
        if(!checkAddress(recipient)){ 
          message.error("address input error");
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
        message.error("address input error");
      } 
    }}
    type="rDOT"
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
      if(NumberUtil.fisAmountToChain(amount) <= (unBondFees + estimateUnBondTxFees)){
        message.error("No enough FIS to pay for the fee");
        return;
      }
      setAmount('');
      dispatch(setLoading(true));
      setVisible(false)
      dispatch(unbond(amount,recipient,willAmount,()=>{ 
        dispatch(setLoading(false));
      })) 
    }}
    type="rDOT"
  />
  </>
}