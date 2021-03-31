import React from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {Redirect} from 'react-router'
import HomeCard from '@components/card/homeCard';   
import rDOT_svg from '@images/rDOT.svg'  
import {Symbol,rSymbol} from '@keyring/defaults'
import {connectPolkadot_ksm} from '@features/globalClice'
import './index.scss';

export default function Inde(props:any){
  const dispatch = useDispatch();
  const hasAcount=useSelector((state:any)=>{
    if(state.FISModule.fisAccount){
      return true
    }else{
      return false
    }
  })
  if(hasAcount){
    return <Redirect to="/rKSM/type" />
  }
  return <HomeCard 
      title={<><label>Liquify</label> Your Staking KSM</>}
      subTitle={"Staking via StaFi Staking Contract and get rKSM in return"}
      btnText="Connect to Polkadotjs extension"
      btnIcon={rDOT_svg} 
      onBtnClick={()=>{  
        dispatch(connectPolkadot_ksm(()=>{
          props.history.push("/rKSM/wallet")
        })) 
      }}
      onIntroClick={()=>{

      }}
  />
}