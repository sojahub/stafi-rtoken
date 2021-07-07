import React, { useEffect, useState } from 'react'; 
import {Modal} from 'antd';
import {useDispatch,useSelector} from 'react-redux';
import Content from '@components/content/stakeContent_DOT'; 
import {transfer,rTokenLedger,rTokenRate,getBlock} from '@features/rMaticClice';  
import {ratioToAmount} from '@util/common'
import { message } from 'antd';
import NumberUtil from '@util/numberUtil';
import {setSessionStorageItem,getSessionStorageItem} from '@util/common'
import { setProcessSlider } from '@features/globalClice'; 
import stake_tips from '@images/atom_stake_tips.png'
import Button from '@shared/components/button/button';
import './index.scss';
export default function Index(props:any){

 const dispatch=useDispatch();
 
  const [amount,setAmount]=useState<any>(); 
  const [visible,setVisible] =useState(false)
  useEffect(()=>{ 
    dispatch(rTokenRate());
    dispatch(rTokenLedger())
    // dispatch(getBlock("0xc7a4cb19b7271416c17406b2a653a6810146a5c771a1ab7f2e468a281bb9b648","0x5d4791186fd8868c7e5a199eb42b7148564f25b9913d3ffa9f923170de9f0e3f"))
  },[])
  const {transferrableAmount,ratio,stafiStakerApr,fisCompare,validPools,totalIssuance,bondFees}=useSelector((state:any)=>{ 
    const fisCompare = NumberUtil.fisAmountToChain(state.FISModule.fisAccount.balance) < (state.rMaticModule.bondFees + state.FISModule.estimateBondTxFees);
    return {
      transferrableAmount:state.rMaticModule.transferrableAmountShow,
      ratio:state.rMaticModule.ratio,
      stafiStakerApr:state.rMaticModule.stakerApr,
      fisCompare:fisCompare,
      validPools:state.rMaticModule.validPools,
      totalIssuance:state.rMaticModule.totalIssuance,
      bondFees:state.rMaticModule.bondFees
    }
  })


  return <> <Content
  amount={amount}
  willAmount={ratio=='--'?"--":ratioToAmount(amount,ratio)}
  unit={"Matic"}
  transferrableAmount={transferrableAmount}
  apr={stafiStakerApr} 
  onChange={(value:any)=>{   
      setAmount(value);   
  }}
  onRecovery={()=>{ 
     props.history.push("/rMatic/search")
  }}
  validPools={validPools}  
  bondFees={NumberUtil.fisAmountToHuman(bondFees) || "--"}
  totalStakedToken={NumberUtil.handleFisAmountToFixed(totalIssuance*ratio)} 
  onStakeClick={()=>{
    if (amount) { 
      if(fisCompare){
        message.error("No enough FIS to pay for the fee");
        return;
      }
      
      dispatch(transfer(amount,()=>{
        dispatch(setProcessSlider(false));
        props.history.push("/rMatic/staker/info")
      }));
      // if(getSessionStorageItem("atom_stake_tips_modal")){
      //     dispatch(transfer(amount,()=>{
      //       dispatch(setProcessSlider(false));
      //       props.history.push("/rMatic/staker/info")
      //     }));
      // }else{
      //   setVisible(true)
      // }
    
    
    }else{
      message.error("Please enter the amount")
    } 
  }}
  type="rMatic"></Content>
 
  </>
}