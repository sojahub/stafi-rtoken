import React from 'react';

import GhostButton from '@shared/components/button/ghostButton';
import poolUniswapIcon from '@images/poolUniswapIcon.png';
import poolCurveIcon from '@images/poolCurveIcon.svg';
import poolWrapFiIcon from '@images/poolWrapFiIcon.svg';

type Props={
  pairIcon:any,
  pairValue:string,
  apyList:any[],
  liquidity:any,
  slippage:any,
  poolOn:"Uniswap"|"Curve"|"WrapFi"
}
export default function Index(props:Props){
    return <div className="row">
                <div className="col col1">
                  <img src={props.pairIcon} /> {props.pairValue}
                </div>
                <div className="col col2">
                  {
                    props.apyList.map((item)=>{
                      return <div><div>{item.value} </div><label>{item.unit}</label></div>
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
                 {props.poolOn=="Uniswap" && <img src={poolUniswapIcon} />} 
                 {props.poolOn=="Curve" && <img src={poolCurveIcon} />} 
                 {props.poolOn=="WrapFi" && <img src={poolWrapFiIcon} />} 
                  {props.poolOn}
                </div>
                <div className="col col6"> 
                    <GhostButton> Add liquidity</GhostButton>
                    <GhostButton> Stake</GhostButton>
                    {/* <TradePopover data={[{label:"Curve",url:"https://curve.fi/reth"},{label:"Uniswap",url:props.trade}]}>
        <GhostButton>
        Stake<img className="dow_svg" src={dow_svg}/>
        </GhostButton>
          </TradePopover> */}
                </div>
            </div>
}