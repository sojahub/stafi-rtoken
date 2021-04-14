import React from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {Redirect} from 'react-router'
import HomeCard from '@components/card/homeCard'; 
import rDOT_svg from '@images/rDOT.svg'  
import {Symbol} from '@keyring/defaults'
import {connectPolkadot} from '@features/globalClice'; 
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
  // if(hasAcount){
  //   return <Redirect to="/rDOT/type" />
  // }
  return <HomeCard 
      title={<><label>Liquify</label> Your Staking DOT</>}
      subTitle={"Staking via StaFi Staking Contract and get rDOT in return"}
      btnText="coming soon"
      btnIcon={rDOT_svg}
      onBtnClick={()=>{  
        // dispatch(connectPolkadot(()=>{
        //   props.history.push("/rDOT/wallet")
        // })) 
      }}
      onIntroUrl="https://docs.stafi.io/rproduct/rdot-solution"
  />
}