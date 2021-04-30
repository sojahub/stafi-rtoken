import React from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {Redirect} from 'react-router'
import HomeCard from '@components/card/homeCard';   
import rFIS_svg from '@images/rFIS.svg';   
import keplr from '@images/keplr.png';
import {connectPolkadot_atom,connectAtomjs} from '@features/globalClice';
import Button from '@shared/components/button/connect_button';
import './index.scss';


 
export default function Inde(props:any){
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
            {!!!atomAccount && atomAccounts.length<=0 && <Button icon={keplr} onClick={()=>{   
              dispatch(connectAtomjs(()=>{
                if(fisAccount){
                  props.history.push("/rATOM/type")
                }else if(fisAccounts && fisAccounts.length>0){
                  props.history.push({
                    pathname:"/rATOM/fiswallet",
                    state:{
                        showBackIcon:true, 
                    }
                }); 
                }
              }));
            }}>
               Connect to Keplr extension
            </Button>}
            {!!!fisAccount && fisAccounts.length<=0  && <Button icon={rFIS_svg} onClick={()=>{   
              dispatch(connectPolkadot_atom(()=>{
                if(atomAccount){
                  props.history.push({
                    pathname:"/rATOM/fiswallet",
                    state:{
                        showBackIcon:true, 
                    }
                  }); 
                }
                // props.history.push("/rATOM/wallet")
              })) 
            }}>
              Connect to FIS extension
            </Button>}
  </HomeCard>
}