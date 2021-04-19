import React, { useEffect, useState } from 'react'; 
import {message,Spin} from 'antd';
import {useSelector} from 'react-redux';
import Content from '@components/content/redeemContent'; 
import { rTokenRate } from '@features/FISClice';
import {rSymbol} from '@keyring/defaults'
import {unbond,getUnbondCommission,query_rBalances_account,checkAddress,unbondFees} from '@features/rKSMClice';
import {useDispatch} from 'react-redux';
import UnbondModal from '@components/modal/unbondModal'
import NumberUtil from '@util/numberUtil'
import {setLoading} from '@features/globalClice'

export default function Index(props:any){ 
  const dispatch=useDispatch();
  const [recipient,setRecipient]=useState<string>();
  const [amount,setAmount]=useState<any>();
  const [visible,setVisible]=useState(false);

  const {tokenAmount,unbondCommission,ratio,fisFee,address,unBondFees,willAmount,estimateUnBondTxFees, fisBalance} = useSelector((state:any)=>{ 
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
      willAmount: willAmount,
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
    dispatch(rTokenRate(rSymbol.Ksm));
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