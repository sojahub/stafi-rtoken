import HomeCard from '@components/card/homeCard';
import { connectPolkadot_atom } from '@features/globalClice';
import { connectMetamask, handleEthAccount, monitoring_Method } from '@features/rETHClice';
import metamask from '@images/metamask.png';
import rFIS_svg from '@images/rFIS.svg';
import Button from '@shared/components/button/connect_button';
import Modal from '@shared/components/modal/connectModal';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Page_FIS from '../../rATOM/selectWallet_rFIS/index';
import {Redirect} from 'react-router'
import './index.scss';


 
export default function Inde(props:any){
  const [visible,setVisible]=useState(false);
  const dispatch = useDispatch();
  const {fisAccount,ethAccount,fisAccounts}=useSelector((state:any)=>{
    return {
      fisAccount:state.FISModule.fisAccount,
      fisAccounts:state.FISModule.fisAccounts,
      ethAccount:state.rETHModule.ethAccount
    } 
  })
  if(fisAccount && ethAccount){
    return <Redirect to="/rMatic/type" />
  }
  return <HomeCard 
      title={<><label>Liquify</label> Your Staking Matic</>}
      subTitle={"Staking via StaFi Staking Contract and get rMatic in return"} 
     
      onIntroUrl=""
  >
            
            <Button disabled={!!ethAccount } icon={metamask} onClick={()=>{ 
                dispatch(connectMetamask('0x5'));
                dispatch(monitoring_Method());
                ethAccount && dispatch(handleEthAccount(ethAccount.address));
                if(fisAccount){
                  props.history.push("/rMatic/type")
                }else if(fisAccounts && fisAccounts.length>0){
                  props.history.push({
                    pathname:"/rMatic/fiswallet",
                    state:{
                        showBackIcon:false, 
                    }
                  }); 
                }
                // props.history.push("/rMatic/type")
              }}>
                Connect to Metamask
            </Button>
            <Button 
            disabled={!!fisAccount }
            icon={rFIS_svg} 
             onClick={()=>{   
              setVisible(true);
              dispatch(connectPolkadot_atom(()=>{
                setVisible(true);
               
              })) 
            }}>
              Connect to FIS extension
            </Button>

            <Modal visible={visible}>
                <Page_FIS location={{}} type="header"  onClose={()=>{
                      setVisible(false);
                  }}/>
          </Modal>
  </HomeCard>
}