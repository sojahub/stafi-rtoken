import React, { useEffect, useState } from 'react'; 
import {message,Spin} from 'antd';
import {useSelector} from 'react-redux';
import Content from '@components/content/redeemContent';  
import {rSymbol} from '@keyring/defaults'
import {rTokenRate,unbond,getUnbondCommission,query_rBalances_account,unbondFees} from '@features/rMaticClice';
import {checkEthAddress} from '@features/rETHClice'
import {useDispatch} from 'react-redux';
import UnbondModal from '@components/modal/unbondModal'
import NumberUtil from '@util/numberUtil'
import {setLoading} from '@features/globalClice';
import CommonClice from '@features/commonClice'

const commonClice=new CommonClice();
export default function Index(props:any){ 
  const dispatch=useDispatch();
  const [recipient,setRecipient]=useState<string>();
  const [amount,setAmount]=useState<any>();
  const [visible,setVisible]=useState(false);
 
  const {tokenAmount,unbondCommission,ratio,fisFee,address,unBondFees,willAmount,estimateUnBondTxFees,fisBalance} = useSelector((state:any)=>{ 
    let unbondCommission:any=0; 
    let ratio=state.rMaticModule.ratio; 
    let tokenAmount=state.rMaticModule.tokenAmount; 
     
    if (state.rMaticModule.unbondCommission && amount) { 
      unbondCommission = amount*state.rMaticModule.unbondCommission; 
    } 
    return { 
      ratio:ratio,
      tokenAmount:tokenAmount, 
      unbondCommission:unbondCommission,
      fisFee:state.rMaticModule.unbondCommission,
      address:state.rETHModule.ethAccount.address,
      unBondFees:state.rMaticModule.unBondFees,  
      willAmount: commonClice.getWillAmount(ratio,state.rMaticModule.unbondCommission,amount),
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
        if(!checkEthAddress(recipient)){ 
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
      if(checkEthAddress(recipient)){
        
        setVisible(true);
      }else{
        message.error("address input error");
      } 
    }}
    type="rMatic"
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
    type="rMatic"
  />
  </>
}