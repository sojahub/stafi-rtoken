import React, { useState } from 'react';
import {useSelector,useDispatch, useStore} from 'react-redux';
import {Redirect} from 'react-router'
import HomeCard from '@components/card/homeCard';   
import rFIS_svg from '@images/rFIS.svg';   
import keplr from '@images/keplr.png';
import Modal from '@shared/components/modal/connectModal';
import Page_FIS from '../../rATOM/selectWallet_rFIS/index';
import {connectPolkadot_fis} from '@features/globalClice';
import Button from '@shared/components/button/connect_button';
import './index.scss';


 
export default function Inde(props:any){ 
  const dispatch = useDispatch();
  const {fisAccount}=useSelector((state:any)=>{
    return {
      fisAccount:state.FISModule.fisAccount, 
    } 
  })
  if(fisAccount){
    return <Redirect to="/rFIS/type" />
  }
  return <HomeCard 
      title={<><label>Liquify</label> Your Staking FIS</>}
      subTitle={"Staking via StaFi Staking Contract and get rFIS in return"} 
     
      onIntroUrl=""
  >
            
            <Button  
            icon={rFIS_svg} 
             onClick={()=>{   
              // setVisible(true);
             
              dispatch(connectPolkadot_fis(()=>{
                props.history.push("/rFIS/fiswallet")
              })) 
            }}>
              Connect to Polkadotjs extension
            </Button> 
  </HomeCard>
}