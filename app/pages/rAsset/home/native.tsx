import React, { useEffect, useState,useMemo } from 'react'; 
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
import {rTokenRate as dot_rTokenRate,query_rBalances_account as dot_query_rBalances_account,getUnbondCommission as dot_getUnbondCommission} from '@features/rDOTClice';
import {rTokenRate as fis_rTokenRate,query_rBalances_account as fis_query_rBalances_account,getUnbondCommission as fis_getUnbondCommission} from '@features/FISClice';
import CommonClice from '@features/commonClice';
import {Symbol,rSymbol} from '@keyring/defaults';
import NumberUtil from '@util/numberUtil'
import rasset_fis_svg from '@images/rFIS.svg';
import rasset_rfis_svg from '@images/rasset_rfis.svg';  
import rasset_rksm_svg from '@images/rasset_rksm.svg'; 
import rasset_rdot_svg from '@images/rasset_rdot.svg'; 
import {getStakingPoolinfo} from '@features/bridgeClice'

import './page.scss'

const commonClice=new CommonClice();
export default function Index(props:any){ 
  const dispatch=useDispatch();
  const {fisAccount,tokenAmount,ksmWillAmount,fis_tokenAmount,fisWillAmount,dot_tokenAmount,dotWillAmount,unitPriceList}=useSelector((state:any)=>{ 
 
    return {
      unitPriceList:state.bridgeModule.priceList,
      fisAccount:state.FISModule.fisAccount, 
      tokenAmount:state.rKSMModule.tokenAmount,
      ksmWillAmount:commonClice.getWillAmount(state.rKSMModule.ratio,state.rKSMModule.unbondCommission,state.rKSMModule.tokenAmount),
      fis_tokenAmount:state.FISModule.tokenAmount,
      fisWillAmount:commonClice.getWillAmount(state.FISModule.ratio,state.FISModule.unbondCommission,state.FISModule.tokenAmount),
      dot_tokenAmount:state.rDOTModule.tokenAmount,
      dotWillAmount:commonClice.getWillAmount(state.rDOTModule.ratio,state.rDOTModule.unbondCommission,state.rDOTModule.tokenAmount),
    }
  });

  const totalPrice=useMemo(()=>{
    let count=0;
    unitPriceList.forEach((item:any) => {
      if(item.symbol=="rFIS" && fis_tokenAmount && fis_tokenAmount!="--"){
        count=count+(item.price*fis_tokenAmount);
      }else if(item.symbol=="FIS" && fisAccount && fisAccount.balance){
        count=count+(item.price*fisAccount.balance);
      }else if(item.symbol=="rKSM" && tokenAmount && tokenAmount!="--"){
        count=count+(item.price*tokenAmount);
      }else if(item.symbol=="rDOT" && tokenAmount && tokenAmount!="--"){
        count=count+(item.price*dot_tokenAmount);
      }
    });
    return count
  },[tokenAmount,fisAccount,fis_tokenAmount,dot_tokenAmount]);

  const [visible,setVisible]=useState(false);
  useEffect(()=>{
    if(fisAccount){
      dispatch(getStakingPoolinfo());
      dispatch(reloadData(Symbol.Fis)); 
    } 
  },[])
  useEffect(()=>{
    if(fisAccount){
      dispatch(query_rBalances_account());
      dispatch(fis_query_rBalances_account());
      dispatch(dot_query_rBalances_account());
      dispatch(ksm_rTokenRate());
      dispatch(fis_rTokenRate() );
      dispatch(dot_rTokenRate() );
      dispatch(getUnbondCommission());
      dispatch(fis_getUnbondCommission());
      dispatch(dot_getUnbondCommission());
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
          balance={(fisAccount && fisAccount.balance!="--")?NumberUtil.handleFisAmountToFixed(fisAccount.balance):"--"}
          willGetBalance={fisWillAmount}
          unit="FIS"
          operationType="native"
          onSwapClick={()=>{
            props.history.push({
              pathname:"/rAsset/swap/native",
              state:{ 
                rSymbol:"FIS"
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
          operationType="native"
          onSwapClick={()=>{
            props.history.push({
              pathname:"/rAsset/swap/native",
              state:{ 
                rSymbol:"rFIS", 
              }
            })
          }}
        />
             <DataItem 
          rSymbol="rDOT"
          icon={rasset_rdot_svg}
          fullName="Polkadot"
          balance={dot_tokenAmount=="--" ?"--":NumberUtil.handleFisAmountToFixed(dot_tokenAmount)}
          willGetBalance={dotWillAmount}
          unit="DOT"
          operationType="native"
          onSwapClick={()=>{
            props.history.push({
              pathname:"/rAsset/swap/native",
              state:{ 
                rSymbol:"rDOT"
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
          operationType="native"
          onSwapClick={()=>{
            props.history.push({
              pathname:"/rAsset/swap/native",
              state:{ 
                rSymbol:"rKSM"
              }
            })
          }}
        />
        
      </DataList><CountAmount totalValue={totalPrice} /> </>:<div className="rAsset_content">
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