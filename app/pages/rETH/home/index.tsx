import React from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {Redirect} from 'react-router'
import HomeCard from '@components/card/homeCard'; 
import rDOT_svg from '@images/rDOT.svg'  
import metamask_png from '@images/metamask.png'
import {connectMetamask,monitoring_Method} from '@features/rETHClice'; 
import Button from '@shared/components/button/connect_button';
import './index.scss';
 
export default function Inde(props:any){
  const dispatch = useDispatch();
  // const hasAcount=useSelector((state:any)=>{
  //   if(state.FISModule.fisAccount){
  //     return true
  //   }else{
  //     return false
  //   }
  // })
  // if(hasAcount){
  //   return <Redirect to="/rETH/type" />
  // }
  return <HomeCard 
      title={<><label>Liquify</label> Your Staking ETH 2.0</>}
      subTitle={"Staking via StaFi Staking Contract and get rETH in return."}
  
      // onIntroUrl="https://docs.stafi.io/rproduct/rdot-solution"
  >
     <Button icon={metamask_png} onClick={()=>{
        // dispatch(connectMetamask());
        // dispatch(monitoring_Method());
        props.history.push("/rETH/type")
      }}>
                Connect to Metamask
            </Button>
  </HomeCard>
}