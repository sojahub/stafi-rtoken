import React from 'react';
import GhostButton from '@shared/components/button/ghostButton'
import rETH_svg from '@images/rETH.svg'; 
import rFIS_svg from '@images/rFIS.svg'; 
import rDOT_svg from '@images/rDOT.svg'; 
import rKSM_svg from '@images/rKSM.svg';
import { message } from 'antd';

type Props={
  rSymbol:string
  icon:any
  fullName:string,
  balance:any
  willGetBalance:any,
  unit:string,
  onSwapClick?:Function,
  trade?:string,
  operationType?:'erc20' |"native"
}
export default function Index(props:Props){
  return <div className="list_item">
    <div className="col_type">
        <img src={props.icon} /> {props.rSymbol} <label>{props.fullName}</label>
    </div>
    <div className="col_amount"> 
        <div>
          {props.balance}
        </div>
        <div>
         {props.rSymbol=="FIS"?"": `Redeemable:${props.willGetBalance} ${props.unit}`}
        </div>
    </div>
    <div className="col_btns">
      {props.operationType=="erc20" && <GhostButton onClick={()=>{
          if(props.trade){
            window.open(props.trade);
          }else{
            message.info("Pool is not open yet.");
          }
        }}>
            Trade
        </GhostButton>}
        <GhostButton onClick={()=>{
          props.onSwapClick && props.onSwapClick();
        }}>
            Swap
        </GhostButton>
    </div>
  </div>  
}
