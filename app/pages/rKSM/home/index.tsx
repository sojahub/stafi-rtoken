import React from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {Redirect} from 'react-router'
import HomeCard from '@components/card/homeCard'; 
import rKSM_svg from '@images/rKSM.svg'  
import {Symbol,rSymbol} from '@keyring/defaults'
import {connectPolkadot,connectPolkadotjs} from '@features/globalClice'
import './index.scss';

export default function Inde(props:any){
  const dispatch = useDispatch();
  const hasAcount=useSelector((state:any)=>{
    if(state.rKSMModule.ksmAccount && state.FISModule.fisAccount){
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
      btnIcon={rKSM_svg} 
      onBtnClick={()=>{  
        dispatch(connectPolkadot(()=>{
          props.history.push("/rKSM/wallet")
        })) 
      }}
      onIntroClick={()=>{

      }}
  />
}