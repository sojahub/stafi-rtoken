import React, { useState } from 'react';
import {useSelector,useDispatch, useStore} from 'react-redux';
import {Redirect} from 'react-router'
import HomeCard from '@components/card/homeCard';   
import rFIS_svg from '@images/rFIS.svg';   
import keplr from '@images/keplr.png';
import Modal from '@shared/components/modal/connectModal';
import Page_FIS from '../../rATOM/selectWallet_rFIS/index';
import {connectPolkadot_atom,connectAtomjs} from '@features/globalClice';
import Button from '@shared/components/button/connect_button';
import './index.scss';


 
export default function Inde(props:any){
  const [visible,setVisible]=useState(false);
  const dispatch = useDispatch();
  const {fisAccount,atomAccount,fisAccounts,atomAccounts}=useSelector((state:any)=>{
    return {
      fisAccount:state.FISModule.fisAccount,
      fisAccounts:state.FISModule.fisAccounts,
      atomAccount:state.rATOMModule.atomAccount,
      atomAccounts:state.rATOMModule.atomAccounts,
    } 
  })
  if(fisAccount && atomAccount){
    return <Redirect to="/rATOM/type" />
  }
  console.log(atomAccounts,fisAccounts,"=====fisAccounts")
  return <HomeCard 
      title={<><label>Liquify</label> Your Staking ATOM</>}
      subTitle={"Staking via StaFi Staking Contract and get rATOM in return"} 
     
      onIntroUrl=""
  >
            <Button
             disabled={!!atomAccount}
             icon={keplr}
              onClick={()=>{   
              dispatch(connectAtomjs(()=>{
                if(fisAccount){
                  props.history.push("/rATOM/type")
                }else if(fisAccounts && fisAccounts.length>0){
                  props.history.push({
                    pathname:"/rATOM/fiswallet",
                    state:{
                        showBackIcon:false, 
                    }
                }); 
                }
              }));
            }}>
               Connect to Keplr extension
            </Button>
            {<Button 
            disabled={!!fisAccount }
            icon={rFIS_svg} 
             onClick={()=>{   
              setVisible(true);
              dispatch(connectPolkadot_atom(()=>{
                setVisible(true);
                // if(atomAccount){
                //   props.history.push({
                //     pathname:"/rATOM/fiswallet",
                //     state:{
                //         showBackIcon:false, 
                //     }
                //   }); 
                // } 
              })) 
            }}>
              Connect to FIS extension
            </Button>}

            <Modal visible={visible}>
                <Page_FIS location={{}} type="header"  onClose={()=>{
                      setVisible(false);
                  }}/>
          </Modal>
  </HomeCard>
}