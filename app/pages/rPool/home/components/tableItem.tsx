import React from 'react';

import GhostButton from '@shared/components/button/ghostButton';
import poolUniswapIcon from '@images/poolUniswapIcon.png';
import poolCurveIcon from '@images/poolCurveIcon.svg';
import poolWrapFiIcon from '@images/poolWrapFiIcon.svg';
import BottonPopover from '@components/tradePopover/buttonPopover'; 

type Props={
  pairIcon:any,
  pairValue:string,
  apyList:any[],
  liquidity:any,
  slippage:any,
  poolOn:1|2|3,
  stakeUrl?:string,
  history:any,
  liquidityUrl:string,
  wrapFiUrl:string
}
export default function Index(props:Props){ 
    return <div className="row">
                <div className="col col1">
                  <img src={props.pairIcon} /> {props.pairValue}
                </div>
                <div className="col col2">
                  { 
                    props.apyList.map((item)=>{ 
                      return <div><div>+{item.apy}% </div><label>{item.symbol}</label></div>
                    })
                  } 
                </div>
                <div className="col  col3">
                ${props.liquidity}
                </div>
                <div className="col col4">
                ${props.slippage}
                </div>
                <div className="col col5">
                 {props.poolOn==1 && <><img src={poolUniswapIcon} /> Uniswap</>} 
                 {props.poolOn==2 && <><img src={poolCurveIcon} /> Curve</>} 
                 {props.poolOn==3 && <><img src={poolWrapFiIcon} /> WrapFi</>}  
                </div>
                <div className="col col6"> 
                    <GhostButton onClick={()=>{
                      window.open(props.liquidityUrl);
                    }}> Add liquidity</GhostButton> 
                    {props.poolOn==3?<BottonPopover data={[{label:"Stafi",url:props.stakeUrl},{label:"WrapFi",url:props.wrapFiUrl}]}>
                      Stake 
                    </BottonPopover>:<GhostButton onClick={()=>{
                      window.open(props.stakeUrl);
                    }}>Stake</GhostButton> }
                </div>
            </div>
}