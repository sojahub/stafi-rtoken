import Understood from '@components/modal/understood';
import { bridgeCommon_ChainFees, erc20ToNativeSwap, getBridgeEstimateEthFee, nativeToErc20Swap } from '@features/bridgeClice';
import { clickSwapToErc20Link, clickSwapToNativeLink, getAssetBalanceAll, getErc20Allowances } from '@features/ETHClice';
import { checkAddress as fis_checkAddress, getUnbondCommission as fis_getUnbondCommission, query_rBalances_account as fis_query_rBalances_account, reloadData as fisReloadData, rTokenRate as fis_rTokenRate } from '@features/FISClice';
import {
  getUnbondCommission as atom_getUnbondCommission,
  query_rBalances_account as atom_query_rBalances_account, reloadData as atomReloadData,
  rTokenRate as atom_rTokenRate
} from '@features/rATOMClice';
import {
  getUnbondCommission as dot_getUnbondCommission,
  query_rBalances_account as dot_query_rBalances_account, reloadData as dotReloadData,
  rTokenRate as dot_rTokenRate
} from '@features/rDOTClice';
import { checkEthAddress } from '@features/rETHClice';
import { getUnbondCommission, query_rBalances_account, reloadData as ksmReloadData, rTokenRate as ksm_rTokenRate } from '@features/rKSMClice';
import {
  getUnbondCommission as sol_getUnbondCommission,
  query_rBalances_account as sol_query_rBalances_account,
  reloadData as solReloadData,
  rTokenRate as sol_rTokenRate
} from '@features/rSOLClice';
import down_arrow_svg from "@images/down_arrow.svg";
import rasset_fis_svg from '@images/rFIS.svg';
import rasset_rsol_svg from '@images/rSOL.svg';
import rasset_ratom_svg from '@images/r_atom.svg';
import rasset_rdot_svg from '@images/r_dot.svg';
import rasset_rfis_svg from '@images/r_fis.svg';
import rasset_rksm_svg from '@images/r_ksm.svg';
import selected_rETH from '@images/selected_rETH.svg';
import selected_rFIS from '@images/selected_rFIS.svg';
import Back from '@shared/components/backIcon';
import Button from '@shared/components/button/button';
import Title from '@shared/components/cardTitle';
import Content from '@shared/components/content';
import Input from '@shared/components/input/addressInput';
import TypeInput from '@shared/components/input/typeInput';
import NumberUtil from '@util/numberUtil';
import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './index.scss';

const datas = [
  {
    icon: rasset_fis_svg,
    title: 'FIS',
    amount: '--',
    type: 'fis',
  },
  {
    icon: rasset_rfis_svg,
    title: 'rFIS',
    amount: '--',
    type: 'rfis',
  },
  {
    icon: rasset_rdot_svg,
    title: 'rDOT',
    amount: '--',
    type: 'rdot',
  },
  {
    icon: rasset_rksm_svg,
    title: 'rKSM',
    amount: '--',
    type: 'rksm',
  },
  {
    icon: rasset_ratom_svg,
    title: 'rATOM',
    amount: '--',
    type: 'ratom',
  },
  {
    icon: rasset_rsol_svg,
    title: 'rSOL',
    amount: '--',
    type: 'rsol',
  },
];

export default function Index(props:any){  
  const dispatch =useDispatch();
  const [fromAoumt,setFormAmount]=useState<any>();
  const [selectDataSource,setSelectDataSource]=useState(datas);
  const [fromType,setFormType]=useState(datas[0]); 
  const [address,setAddress]=useState<any>(); 

  const [visible,setVisible]=useState(false); 
  const [operationType,setOperationType]=useState<undefined | 'erc20' |'native'>();
  // state: {type: "native", rSymbol: "rFIS"}
  useEffect(()=>{  
    if(props.location.state){  
      if(selectDataSource.length>0){
        const data=selectDataSource.find(item=>item.title==props.location.state.rSymbol); 
        setFormType({...data});
      }
    }else{
      setFormType(selectDataSource[0]);
    }
    setOperationType(props.match.params.type);
  },[props.location.state,selectDataSource])


  useEffect(()=>{
      dispatch(bridgeCommon_ChainFees());
      dispatch(getBridgeEstimateEthFee());
  },[])
 
  const {
    fisAccount,
    ethAccount,
    erc20EstimateFee,
    estimateEthFee,
    rksm_balance,
    rfis_balance,
    fis_balance,
    rdot_balance,
    ratom_balance,
    rsol_balance,
  } = useSelector((state: any) => {
    if (operationType == 'erc20') {
      return {
        fis_balance: NumberUtil.handleFisAmountToFixed(state.ETHModule.ercFISBalance),
        rfis_balance: NumberUtil.handleFisAmountToFixed(state.ETHModule.ercRFISBalance),
        rksm_balance: NumberUtil.handleFisAmountToFixed(state.ETHModule.ercRKSMBalance),
        rdot_balance: NumberUtil.handleFisAmountToFixed(state.ETHModule.ercRDOTBalance),
        ratom_balance: NumberUtil.handleFisAmountToFixed(state.ETHModule.ercRATOMBalance),
        rsol_balance: NumberUtil.handleFisAmountToFixed(state.ETHModule.ercRSOLBalance),
        erc20EstimateFee: state.bridgeModule.erc20EstimateFee,
        estimateEthFee: state.bridgeModule.estimateEthFee,
        fisAccount: state.FISModule.fisAccount,
        ethAccount: state.rETHModule.ethAccount,
      };
    } else {
      return {
        fis_balance: state.FISModule.fisAccount ? state.FISModule.fisAccount.balance : '--',
        rfis_balance: NumberUtil.handleFisAmountToFixed(state.FISModule.tokenAmount),
        rksm_balance: NumberUtil.handleFisAmountToFixed(state.rKSMModule.tokenAmount),
        rdot_balance: NumberUtil.handleFisAmountToFixed(state.rDOTModule.tokenAmount),
        ratom_balance: NumberUtil.handleFisAmountToFixed(state.rATOMModule.tokenAmount),
        rsol_balance: NumberUtil.handleFisAmountToFixed(state.rSOLModule.tokenAmount),
        erc20EstimateFee: state.bridgeModule.erc20EstimateFee,
        estimateEthFee: state.bridgeModule.estimateEthFee,
        fisAccount: state.FISModule.fisAccount,
        ethAccount: state.rETHModule.ethAccount,
      };
    }
  });


  useEffect(()=>{
    if(fisAccount && operationType=="native"){
      dispatch(query_rBalances_account());
      dispatch(fis_query_rBalances_account());
      dispatch(dot_query_rBalances_account());
      dispatch(atom_query_rBalances_account())
      dispatch(sol_query_rBalances_account())
      dispatch(ksm_rTokenRate());
      dispatch(fis_rTokenRate() );
      dispatch(dot_rTokenRate());
      dispatch(atom_rTokenRate());
      dispatch(sol_rTokenRate());
      dispatch(getUnbondCommission());
      dispatch(fis_getUnbondCommission());
      dispatch(dot_getUnbondCommission());
      dispatch(atom_getUnbondCommission());
      dispatch(sol_getUnbondCommission());
    }
  },[fisAccount,operationType])
  useEffect(()=>{ 
    if(operationType=="erc20" && ethAccount && ethAccount.address){
      // dispatch(handleEthAccount(ethAccount.address));
      dispatch(getErc20Allowances());
      dispatch(getAssetBalanceAll()); 
    }

  },[(ethAccount && ethAccount.address),operationType])
  useEffect(()=>{
    selectDataSource[0].amount=fis_balance
    selectDataSource[1].amount=rfis_balance
    selectDataSource[2].amount=rdot_balance
    selectDataSource[3].amount=rksm_balance
    selectDataSource[4].amount=ratom_balance
    selectDataSource[5].amount=rsol_balance
    setSelectDataSource([...selectDataSource]);
   
      if(fromType.title="FIS"){
        fromType.amount=fis_balance;
      }else  if(fromType.title="rFIS"){
        fromType.amount=rfis_balance;
      }else if(fromType.title="rKSM"){
        fromType.amount=rksm_balance;
      }else if(fromType.title="rDOT"){
        fromType.amount=rdot_balance;
      }else if(fromType.title="rATOM"){
        fromType.amount=ratom_balance;
      }else if(fromType.title="rSOL"){
        fromType.amount=rsol_balance;
      }
      setFormType({...fromType}); 
  },[rksm_balance,rfis_balance,fis_balance,rdot_balance,ratom_balance,rsol_balance])
  

  const checkAddress=(address:string)=>{
    return fis_checkAddress(address);
  }
  return  <Content className="stafi_rasset_swap">
      <Back onClick={()=>{
          props.history &&  props.history.goBack(); 
      }}/>
      <Title label="rBridge Swap"/>
      <div>
        <div className="row fromrow">
          <div className="label">
              <label>From</label>
              <label className="balance">{fromType.title} balance: {fromType.amount}</label>
          </div>
          <div>
            <TypeInput 
            placeholder="0.0" 
            value={fromAoumt} 
            maxInput={fromType.amount}
            onChange={(value:any)=>{ 
              setFormAmount(value) 
            }} 
            selectDataSource={selectDataSource} 
            token={fromType} 
            token_icon={operationType=="erc20" ? selected_rETH : selected_rFIS}
            token_title={fromType.title}
            selectTitle={operationType=="native"?"Select a native rToken":"Select an erc20 rToken"}
            onSelectChange={(e:any)=>{ 
              setFormAmount("") 
              setFormType(e);
            }}/> 
          </div>
        </div>
        <div className="down_arrow">
          <img src={down_arrow_svg} />
        </div>
        <div className="row">
          <div className="label">
              <label>To</label> 
          </div>
          <div>
            <TypeInput disabled={true}  
            placeholder="0.0" 
            value={fromAoumt}  
            selectDataSource={datas} 
            token={fromType}
            token_icon={operationType=="native" ? selected_rETH :selected_rFIS}
            token_title={fromType.title}
            
            /> 
          </div>
        </div>

        <div className={`row last ${(address) && "show_tip"}`}> 
          <div>
            <Input placeholder={operationType=="erc20"?"To StaFi Address":"To Ethereum Address"} value={address} onChange={(e:any)=>{
              setAddress(e.target.value)
            }}/> 
          </div>
          {(address && operationType=="erc20") && <div className="tip">
            Click on this <a href={clickSwapToNativeLink(address)} target="_blank">link</a> to check your swap status.
          </div>}
          {(address && operationType=="native") && <div className="tip">
            Click on this <a href={clickSwapToErc20Link(fromType.title,address)} target="_blank">link</a> to check your swap status.
          </div>}
        </div>
        <div className="fee"> 
            {operationType=="erc20" && `Estimate Fee: ${estimateEthFee} ETH`}
            {operationType=="native" && `Estimate Fee: ${erc20EstimateFee} FIS`}
        </div>
        <div className="btns">
        <Button disabled={!(fromAoumt && address)}  onClick={()=>{ 
          if (operationType == "erc20") {
            if(Number(ethAccount.balance) <= Number(estimateEthFee)){
              message.error(`No enough ETH to pay for the fee`) 
              return;
            }
            if(!checkAddress(address)){
              message.error('Input address error') 
              return;
            }
          }
          if (operationType == "native") {
            if(Number(fis_balance) <= Number(erc20EstimateFee)){
              message.error(`No enough FIS to pay for the fee`);
              return;
            }
            if(!checkEthAddress(address)){
              message.error('Input address error') 
              return;
            }
          } 

          if(operationType=="native"){
            dispatch(nativeToErc20Swap(fromType.title,fromType.type,fromAoumt,address,()=>{
              setVisible(true);
            }))
          }else{
            dispatch(erc20ToNativeSwap(fromType.title,fromType.type,fromAoumt,address,()=>{
              setVisible(true);
            }))
          } 
         }}>Swap</Button>
        </div>
      </div>
      <Understood 
      visible={visible}  
      context={operationType=="native"?`Tx is broadcasting, please check your ${fromType.title} balance on your Metamask later. It may take 2~10 minutes`:`Tx is broadcasting, please check your ${fromType.title} balance later. It may take 2~10 minutes`}
        onOk={()=>{
        if(operationType=="native"){
          if(fromType.title=="FIS" || fromType.title=="rFIS"){
            dispatch(fisReloadData());
          }
          if(fromType.title=="rKSM"){
            dispatch(ksmReloadData());
          }
          if(fromType.title=="rDOT"){
            dispatch(dotReloadData());
          }
          if(fromType.title=="rATOM"){
            dispatch(atomReloadData());
          }
          if(fromType.title=="rSOL"){
            dispatch(solReloadData());
          }
        }else{
          dispatch(getAssetBalanceAll()); 
          dispatch(getErc20Allowances());
        }
        setFormAmount(undefined);
        setAddress(undefined);
         setVisible(false);
      }}/>
  </Content>
}