import { getRtokenPriceList } from '@features/bridgeClice';
import CommonClice from '@features/commonClice';
import { getUnbondCommission as fis_getUnbondCommission, query_rBalances_account as fis_query_rBalances_account, rTokenRate as fis_rTokenRate } from '@features/FISClice';
import { connectPolkadotjs, reloadData } from '@features/globalClice';
import { getUnbondCommission as atom_getUnbondCommission, query_rBalances_account as atom_query_rBalances_account, rTokenRate as atom_rTokenRate } from '@features/rATOMClice';
import { getUnbondCommission as dot_getUnbondCommission, query_rBalances_account as dot_query_rBalances_account, rTokenRate as dot_rTokenRate } from '@features/rDOTClice';
import { getUnbondCommission, query_rBalances_account, rTokenRate as ksm_rTokenRate } from '@features/rKSMClice';
import rDOT_svg from '@images/rDOT.svg';
import rasset_fis_svg from '@images/rFIS.svg';
import rasset_ratom_svg from '@images/r_atom.svg';
import rasset_rdot_svg from '@images/r_dot.svg';
import rasset_rfis_svg from '@images/r_fis.svg';
import rasset_rksm_svg from '@images/r_ksm.svg';
import { Symbol } from '@keyring/defaults';
import Button from '@shared/components/button/connect_button';
import Content from '@shared/components/content';
import Modal from '@shared/components/modal/connectModal';
import NumberUtil from '@util/numberUtil';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Page_FIS from '../../rDOT/selectWallet_rFIS/index';
import Tag from './components/carTag/index';
import CountAmount from './components/countAmount';
import DataList from './components/list';
import DataItem from './components/list/item';
import './page.scss';


const commonClice=new CommonClice();
export default function Index(props:any){ 
  const dispatch=useDispatch();
  const {fisAccount,tokenAmount,ksmWillAmount,fis_tokenAmount,fisWillAmount,dot_tokenAmount,
    dotWillAmount,unitPriceList,atom_tokenAmount,atomWillAmount}=useSelector((state:any)=>{ 
 
    return {
      unitPriceList:state.bridgeModule.priceList,
      fisAccount:state.FISModule.fisAccount, 
      tokenAmount:state.rKSMModule.tokenAmount,
      ksmWillAmount:commonClice.getWillAmount(state.rKSMModule.ratio,state.rKSMModule.unbondCommission,state.rKSMModule.tokenAmount),
      fis_tokenAmount:state.FISModule.tokenAmount,
      fisWillAmount:commonClice.getWillAmount(state.FISModule.ratio,state.FISModule.unbondCommission,state.FISModule.tokenAmount),
      dot_tokenAmount:state.rDOTModule.tokenAmount,
      dotWillAmount:commonClice.getWillAmount(state.rDOTModule.ratio,state.rDOTModule.unbondCommission,state.rDOTModule.tokenAmount),
      atom_tokenAmount:state.rATOMModule.tokenAmount,
      atomWillAmount:commonClice.getWillAmount(state.rATOMModule.ratio,state.rATOMModule.unbondCommission,state.rATOMModule.tokenAmount),
    }
  });

  const totalPrice=useMemo(()=>{
    let count:any="--";
    unitPriceList.forEach((item:any) => {
      if(count=="--"){
        count=0;
      }
      if(item.symbol=="rFIS" && fis_tokenAmount && fis_tokenAmount!="--"){
        count=count+(item.price*fis_tokenAmount);
      }else if(item.symbol=="FIS" && fisAccount && fisAccount.balance){
        count=count+(item.price*fisAccount.balance);
      }else if(item.symbol=="rKSM" && tokenAmount && tokenAmount!="--"){
        count=count+(item.price*tokenAmount);
      }else if(item.symbol=="rDOT" && dot_tokenAmount && dot_tokenAmount!="--"){
        count=count+(item.price*dot_tokenAmount);
      }else if(item.symbol=="rATOM" && atom_tokenAmount && atom_tokenAmount!="--"){
        count=count+(item.price*atom_tokenAmount);
      }
    });
    return count
  },[unitPriceList,tokenAmount,fisAccount,fis_tokenAmount,dot_tokenAmount]);

  const [visible,setVisible]=useState(false);
  useEffect(()=>{
    if(fisAccount){
      dispatch(getRtokenPriceList());
      dispatch(reloadData(Symbol.Fis)); 
    } 
  },[])
  useEffect(()=>{
    if(fisAccount){
      dispatch(query_rBalances_account());
      dispatch(fis_query_rBalances_account());
      dispatch(dot_query_rBalances_account()); 
      dispatch(atom_query_rBalances_account())
      dispatch(ksm_rTokenRate());
      dispatch(fis_rTokenRate() );
      dispatch(dot_rTokenRate() );
      dispatch(atom_rTokenRate() );
      dispatch(getUnbondCommission());
      dispatch(fis_getUnbondCommission());
      dispatch(dot_getUnbondCommission());
      dispatch(atom_getUnbondCommission());
    }
  },[fisAccount])
  return  <Content>
    <Tag type="native" onClick={(type:string)=>{
      props.history.push(`/rAsset/${type}`)
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
        <DataItem 
          rSymbol="rATOM"
          icon={rasset_ratom_svg}
          fullName="Cosmos"
          balance={atom_tokenAmount=="--" ?"--":NumberUtil.handleFisAmountToFixed(atom_tokenAmount)}
          willGetBalance={atomWillAmount}
          unit="ATOM"
          operationType="native"
          onSwapClick={()=>{
            props.history.push({
              pathname:"/rAsset/swap/native",
              state:{ 
                rSymbol:"rATOM"
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