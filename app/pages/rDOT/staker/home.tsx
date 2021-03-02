import React, { useEffect, useState } from 'react'; 
import {useDispatch,useSelector} from 'react-redux';
import Content from '@components/content/stakeContent_DOT'; 
import {transfer,balancesAll} from '@features/rDOTClice'; 
import { rTokenRate } from '@features/FISClice';
import {ratioToAmount} from '@util/common'
import { message } from 'antd';

export default function Index(props:any){

 const dispatch=useDispatch();

  console.log(props)
  const [amount,setAmount]=useState(); 
  useEffect(()=>{
    dispatch(balancesAll());
    dispatch(rTokenRate(1))
  },[])
  const {transferrableAmountShow,ratio,stafiStakerApr}=useSelector((state:any)=>{
    return {
      transferrableAmountShow:"DOT: "+state.rDOTModule.transferrableAmountShow,
      ratio:state.FISModule.ratio,
      stafiStakerApr:state.globalModule.stafiStakerApr
    }
  })
  return  <Content
  amount={amount}
  willAmount={ratioToAmount(amount,ratio)}
  transferrableAmountShow={transferrableAmountShow}
  apr={stafiStakerApr}
  onChange={(value:any)=>{   
    setAmount(value); 
  }}
  onRecovery={()=>{ 
     props.history.push("/rDOT/search")
  }}
  onStakeClick={()=>{
    if(amount){
      dispatch(transfer(amount,()=>{
        props.history.push("/rDOT/staker/info")
      }));
    }else{
      message.error("请输入金额")
    }
  //  props.history.push("/rDOT/staker/info")
  }}></Content>
}