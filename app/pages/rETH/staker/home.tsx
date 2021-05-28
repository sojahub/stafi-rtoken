import React, { useEffect, useState } from 'react'; 
import {useDispatch,useSelector} from 'react-redux';
import Content from '@components/content/stakeContent_ETH';  
import {ratioToAmount} from '@util/common'
import { message } from 'antd';
import EthNoteModal from '@components/modal/ethNoteModal';
import {send,reloadData} from '@features/rETHClice'

export default function Index(props:any){

  const [ethNoteModalVisible,setEthNoteModalVisible]=useState(false);
 const dispatch=useDispatch();
 
  const [amount,setAmount]=useState<any>(); 
  useEffect(()=>{
   
  },[])
 
  const {balance,ratio,stafiStakerApr,minimumDeposit,totalStakedAmount,waitingStaked,isPoolWaiting}=useSelector((state:any)=>{ 
     
    console.log(state,"=====minimumDeposit")
    return {
      balance:state.rETHModule.balance,
      ratio:state.rETHModule.ratio,
      stafiStakerApr:state.rETHModule.apr,
      minimumDeposit:state.rETHModule.minimumDeposit,

      isPoolWaiting:state.rETHModule.isPoolWaiting,
      waitingStaked:state.rETHModule.waitingStaked,
      totalStakedAmount:state.rETHModule.totalStakedAmount,
      
    }
  })
 console.log(balance,"===minimumDeposit")
  return  <><Content
  histroy={props.history}
  amount={amount}
  willAmount={ratio=='--'?"--":ratioToAmount(amount,ratio)} 
  transferrableAmount={balance}
  apr={stafiStakerApr} 
  onChange={(value:any)=>{   
    if(Number(value)>0 &&  Number(value)> Number(minimumDeposit)){
      message.error(`The deposited amount is less than the minimum deposit size:${minimumDeposit}`);
      setAmount(0);   
      return ;
    } 
    setAmount(value);   
  }}   
 
  totalStakedAmount={totalStakedAmount}
  waitingStaked={waitingStaked}
  isPoolWaiting={isPoolWaiting}
  onStakeClick={()=>{ 
    setEthNoteModalVisible(true);
  }}
  type="rETH"></Content>
  <EthNoteModal 
    visible={ethNoteModalVisible}
    onCancel={()=>{
      setEthNoteModalVisible(false);
    }}
    onNext={()=>{
      setEthNoteModalVisible(false);
      dispatch(send(amount,()=>{ 
        dispatch(reloadData())
      }))
    }}
  /> 
  </>
}