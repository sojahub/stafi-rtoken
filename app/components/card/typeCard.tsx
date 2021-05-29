import React from 'react';
import apr_svg from '@images/apr.svg';
import rate_eleted_svg from '@images/rate_eleted.svg';
import rDOT_svg from '@images/rDOT_black2.svg'
import rKSM_svg from '@images/rKSM_black2.svg'
import rFIS_svg from '@images/rFIS_black.svg'
import rATOM_svg from '@images/selected_rATOM.svg'
import reth_staker from '@images/reth_staker.svg'
import validator_svg from '@images/validator_2.svg';
import reth_validator from '@images/reth_validator.svg'
import './index.scss';
import { useSelector } from 'react-redux';

type Props={
  type:"rDOT"|"rETH"|"rFIS"|"rKSM"|"rATOM",
  onClick:Function,
  stafiStakerApr?:any,
  total?:any,
  apr?:any
}
export default function Index(props:Props){
  const {poolCount}=useSelector((state:any)=>{ 
    if(props.type=="rETH"){
      return {
        poolCount:state.rETHModule.poolCount
      }
    }else{
      return {
        poolCount:"--"
      }
    }
  })


  return <div className="stafi_type_card"> 
      <div className="type_card_item" onClick={()=>{
        props.onClick && props.onClick("Staker");
      }}>
          <div className="title">
              Staker
          </div>
          <div className="sub_title">
            {props.type=="rDOT" && "Delegate your DOT, get rDOT"}
            {props.type=="rKSM" && "Delegate your KSM, get rKSM"}
            {props.type=="rATOM" && "Delegate your ATOM, get rATOM"}
            {props.type=="rETH" && "Delegate your ETH"}
            {props.type=="rFIS" && "Delegate your FIS, get rFIS"}
          </div>
          <div className="apr_panel">
              <img src={apr_svg} /> 
              <label>{props.apr}</label>
          </div>
          <div className="r_panel">
            {props.type=="rDOT" && <img src={rDOT_svg} />}
            {props.type=="rKSM" && <img src={rKSM_svg} />}
            {props.type=="rFIS" && <img src={rFIS_svg} />}
            {props.type=="rATOM" && <img src={rATOM_svg} />}
            {props.type=="rETH" && <img src={reth_staker} />}
            <div>
                {props.type=="rETH"?"Staked":props.type} 
              </div>
            <label>
              {props.total}
            </label>
          </div>
      </div>
      <div className="type_card_item" onClick={()=>{
        props.onClick && props.onClick("Validator");
      }}>
          <div className="title">
            Validator
          </div>
          <div className="sub_title">
              Apply to be delegated
          </div>
          <div className="apr_panel">
              <img src={rate_eleted_svg} />
              <label>12.89%</label>
          </div>
          <div className="r_panel">
            {props.type=="rETH"?<img src={reth_validator} />:<img src={validator_svg} />}
  
              <div>
              
              {props.type=="rETH"?'Pools':'All OVs'}
              </div>
              <label> 
                 {props.type=="rETH"?poolCount:16} 
              </label>
          </div>
      </div>
  </div>
}