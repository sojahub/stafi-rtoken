import React from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {Redirect} from 'react-router'
import HomeCard from '@components/card/homeCard'; 
import rDOT_svg from '@images/rDOT.svg'  
import {Symbol} from '@keyring/defaults'
import {fetchStafiStakerApr,connectPolkadotjs} from '@features/globalClice'
import './index.scss';

export default function Inde(props:any){
  const dispatch = useDispatch();
  const hasAcount=useSelector((state:any)=>{
    if(state.rDOTModule.dotAccount && state.FISModule.fisAccount){
      return true
    }else{
      return false
    }
  })
  if(hasAcount){
    return <Redirect to="/rDOT/staker/index" />
  }
  return <HomeCard 
      title={<><label>Liquify</label> Your Staking DOT</>}
      subTitle={"Staking via StaFi Staking Contract and get rDOT in return"}
      btnText="Connect to Polkadotjs extension"
      btnIcon={rDOT_svg}
      onBtnClick={()=>{ 
        dispatch(fetchStafiStakerApr(()=>{
         
           props.history.push("/rDOT/wallet")
        }));   
      }}
      onIntroClick={()=>{

      }}
  />
}