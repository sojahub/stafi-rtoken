import React from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {Redirect} from 'react-router'
import HomeCard from '@components/card/homeCard'; 
import rDOT_svg from '@images/rDOT.svg'  
import {Symbol} from '@keyring/defaults'
import {connectPolkadot} from '@features/globalClice'; 
import Button from '@shared/components/button/connect_button';
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
    return <Redirect to="/rDOT/type" />
  }
  return <HomeCard 
      title={<><label>Liquify</label> Your Staking DOT</>}
      subTitle={"Staking via StaFi Staking Contract and get rDOT in return"}
  
      // onIntroUrl="https://docs.stafi.io/rproduct/rdot-solution"
  >
     <Button icon={rDOT_svg} onClick={()=>{   
              dispatch(connectPolkadot(()=>{
                props.history.push("/rDOT/wallet")
              })) 
            }}>
              Connect to Polkadotjs extension
            </Button>
  </HomeCard>
}