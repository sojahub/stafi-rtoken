import React from 'react';
import GhostButton from '@shared/components/button/ghostButton';
import poolUniswapIcon from '@images/poolUniswapIcon.png';
import poolCurveIcon from '@images/poolCurveIcon.svg';
import poolWrapFiIcon from '@images/poolWrapFiIcon.svg';
import BottonPopover from '@components/tradePopover/buttonPopover'; 
import numberUtil from '@util/numberUtil';

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
                  {props.pairIcon && <><img src={props.pairIcon} /> {props.pairValue}</>}
                </div>
                <div className="col col5">
                  {props.poolOn==1 && <><img src={poolUniswapIcon} /> Uniswap</>} 
                  {props.poolOn==2 && <><img src={poolCurveIcon} /> Curve</>} 
                  {props.poolOn==3 && <><img src={poolWrapFiIcon} /> WrapFi</>}  
                </div>
                <div className="col col2">
                  {
                    props.apyList.length==0 && "0.00%"
                  }
                  { 
                    props.apyList.map((item)=>{ 
                      return <div><div>+{item.apy}% </div><label>{item.symbol}</label></div>
                    })
                  } 
                </div>
                <div className="col  col3">
                  ${numberUtil.amount_format(props.liquidity)}
                </div>
                <div className="col col4">
                  {props.slippage?`${Number(props.slippage).toFixed(2)}%`:'//'}
                </div>
               
                <div className="col col6"> 
                    <GhostButton className="liquidity_btn" onClick={()=>{
                      window.open(props.liquidityUrl);
                    }}> Add liquidity</GhostButton> 
                    {/* {props.poolOn==3?<BottonPopover data={[{label:"StaFi",url:props.stakeUrl},{label:"WrapFi",url:props.wrapFiUrl}]}>
                      Stake 
                    </BottonPopover>:<GhostButton onClick={()=>{
                      window.open(props.stakeUrl);
                    }} className="stake_btn">Stake</GhostButton> } */}
                </div>
            </div>
}