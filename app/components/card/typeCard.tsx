import React from 'react';
import apr_svg from '@images/apr.svg';

import rDOT_svg from '@images/rDOT_black.svg'
import rFIS_svg from '@images/rFIS_black.svg'
import validator_svg from '@images/validator_2.svg'
import './index.scss';

type Props={
  type:"rDOT"|"rETH"|"rFIS",
  onClick:Function,
  stafiStakerApr?:any
}
export default function Index(props:Props){
  return <div className="stafi_type_card"> 
      <div className="type_card_item" onClick={()=>{
        props.onClick && props.onClick("Staker");
      }}>
          <div className="title">
              Staker
          </div>
          <div className="sub_title">
            {props.type=="rDOT" && "Delegate your DOT, get rDOT"}
            {props.type=="rETH" && "Delegate your ETH"}
            {props.type=="rFIS" && "Delegate your FIS, get rFIS"}
          </div>
          <div className="apr_panel">
              <img src={apr_svg} /> 
              <label>{props.stafiStakerApr}</label>
          </div>
          <div className="r_panel">
            {props.type=="rDOT" && <img src={rDOT_svg} />}
            {props.type=="rFIS" && <img src={rFIS_svg} />}
            <div>
                {props.type} 
              </div>
            <label>
              23528.34
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
              Run a delegated node
          </div>
          <div className="apr_panel">
              <img src={apr_svg} />
              <label>12.89%</label>
          </div>
          <div className="r_panel">
              <img src={validator_svg} />
              <div>
                OVS
              </div>
              <label>
                231
              </label>
          </div>
      </div>
  </div>
}