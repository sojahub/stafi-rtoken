import React, { useEffect, useState } from 'react'; 
import {useDispatch,useSelector} from 'react-redux'; 
import Button from '@shared/components/button/connect_button';
import DataList from './components/list';
import DataItem from './components/list/item'
import Tag from './components/carTag/index';
import CountAmount from './components/countAmount'
import rDOT_svg from '@images/rDOT.svg'
import Content from '@shared/components/content';
import Modal from '@shared/components/modal/connectModal';
import Page_FIS from '../../rDOT/selectWallet_rFIS/index';
import {connectPolkadotjs,reloadData} from '@features/globalClice';
import {rTokenRate as ksm_rTokenRate,query_rBalances_account,getUnbondCommission} from '@features/rKSMClice';
import {rTokenRate as fis_rTokenRate,query_rBalances_account as fis_query_rBalances_account,getUnbondCommission as fis_getUnbondCommission} from '@features/FISClice';
import CommonClice from '@features/commonClice'
import {Symbol,rSymbol} from '@keyring/defaults';
import NumberUtil from '@util/numberUtil'
import rasset_fis_svg from '@images/rFIS.svg';
import rasset_rfis_svg from '@images/rasset_rfis.svg';  
import rasset_rksm_svg from '@images/rasset_rksm.svg'; 

import './page.scss'

const commonClice=new CommonClice();
export default function Index(props:any){ 
  const dispatch=useDispatch();
  const {fisAccount,tokenAmount,ksmWillAmount,fis_tokenAmount,fisWillAmount}=useSelector((state:any)=>{ 
    
    return {
      fisAccount:state.FISModule.fisAccount,
      tokenAmount:state.rKSMModule.tokenAmount,
      ksmWillAmount:commonClice.getWillAmount(state.rKSMModule.ratio,state.rKSMModule.unbondCommission,state.rKSMModule.tokenAmount),
      fis_tokenAmount:state.FISModule.tokenAmount,
      fisWillAmount:commonClice.getWillAmount(state.FISModule.ratio,state.FISModule.unbondCommission,state.FISModule.tokenAmount)
    }
  }) 
  const [visible,setVisible]=useState(false);
  useEffect(()=>{
    if(fisAccount){
      dispatch(reloadData(Symbol.Fis)); 
    } 
  },[])
  useEffect(()=>{
    if(fisAccount){
      dispatch(query_rBalances_account());
      dispatch(fis_query_rBalances_account());
      dispatch(ksm_rTokenRate());
      dispatch(fis_rTokenRate() );
      dispatch(getUnbondCommission());
      dispatch(fis_getUnbondCommission());
    }
  },[fisAccount])
  return  <Content>
    <Tag type="native" onClick={()=>{
      props.history.push("/rAsset/erc")
    }}/>
 
    {fisAccount?<><DataList >
      <DataItem 
          rSymbol="FIS"
          icon={rasset_fis_svg}
          fullName="StaFi" 
          balance={fisAccount?fisAccount.balance:"--"}
          willGetBalance={fisWillAmount}
          unit="FIS"
          onSwapClick={()=>{
            props.history.push({
              pathname:"/rAsset/swap",
              state:{
                type:"native",
                rSymbol:"rFIS"
              }
            })
          }}
        />
        <DataItem 
          rSymbol="rFIS"
          icon={rasset_rfis_svg}
          fullName="StaFi" 
          balance={fis_tokenAmount=="--" ?"--":NumberUtil.handleFisAmountToFixed(fis_tokenAmount)}
          willGetBalance={fisWillAmount}
          unit="FIS"
          onSwapClick={()=>{
            props.history.push({
              pathname:"/rAsset/swap",
              state:{
                type:"native",
                rSymbol:"rFIS"
              }
            })
          }}
        />
        <DataItem 
          rSymbol="rKSM"
          icon={rasset_rksm_svg}
          fullName="Kusama"
          balance={tokenAmount=="--" ?"--":NumberUtil.handleFisAmountToFixed(tokenAmount)}
          willGetBalance={ksmWillAmount}
          unit="KSM"
          onSwapClick={()=>{
            props.history.push({
              pathname:"/rAsset/swap",
              state:{
                type:"native",
                rSymbol:"rFIS"
              }
            })
          }}
        />
        
      </DataList><CountAmount /> </>:<div className="rAsset_content">
      <Button icon={rDOT_svg} onClick={()=>{
           dispatch(connectPolkadotjs(Symbol.Fis)); 
          setVisible(true)
      }}>
        Connect to Polkadotjs extension
      </Button>
    </div>}
    
    <Modal visible={visible}>
          <Page_FIS location={{}} type="header"  onClose={()=>{
                setVisible(false);
            }}/>
    </Modal>
  </Content>
}