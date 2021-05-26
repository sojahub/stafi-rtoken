import React from 'react';
import GhostButton from '@shared/components/button/ghostButton'  
import { message } from 'antd';
import TradePopover from '@components/tradePopover';
import dow_svg from '@images/dow_green.svg' 

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
         {props.rSymbol=="FIS"?"": `Redeemable: ${props.willGetBalance} ${props.unit}`}
        </div>
    </div>
    <div className="col_btns"> 
    {props.operationType=="erc20" && props.rSymbol!="rETH" && <GhostButton onClick={()=>{ 
          if(props.trade){
            window.open(props.trade);
          }else{
            message.info("Pool is not open yet.");
          }
        }}>
            Trade
        </GhostButton>}  
          {props.operationType=="erc20" && props.rSymbol=="rETH" && <TradePopover data={[{label:"Curve",url:"https://curve.fi/reth"},{label:"Uniswap",url:props.trade}]}>
        <GhostButton>
            Trade<img className="dow_svg" src={dow_svg}/> 
        </GhostButton>
          </TradePopover>}
        {!(props.operationType=="erc20" && props.rSymbol=="rETH") && <GhostButton onClick={()=>{
          props.onSwapClick && props.onSwapClick();
        }}>
            Swap
        </GhostButton>}
    </div>
  </div>  
}
