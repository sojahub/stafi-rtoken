import React, { useMemo } from 'react';
import {useSelector} from 'react-redux';
import {Tooltip} from 'antd'
import Input from '@shared/components/input/amountInput';
import LeftContent from './leftContent'
import Button from '@shared/components/button/button'
import A from '@shared/components/button/a'
import rDOT from '@images/selected_rDOT.svg';
import rKSM from '@images/selected_rKSM.svg';
import rATOM from '@images/selected_rATOM.svg'
import doubt from "@images/doubt.svg"; 

import './index.scss'; 
type Props={
    onRecovery:Function,
    onStakeClick:Function,
    unit?:string, 
    transferrableAmount?:any
    amount?:number,
    onChange?:Function,
    willAmount?:string | 0,
    apr?:string,
    validPools?:any[],
    totalStakedToken?:any,
    bondFees?:any
    type:"rDOT"|"rFIS"|"rKSM"|"rATOM",
    histroy?:any, 
}
export default function Index(props:Props){
    const {bondSwitch,processSlider}=useSelector((state:any)=>{  
        return { 
          bondSwitch:state.FISModule.bondSwitch,
          processSlider:state.globalModule.processSlider
        }
      })
 
      const getIcon=()=>{
          if( props.type=="rKSM"){
              return rKSM;
          }else if( props.type=="rDOT"){
              return rDOT;
          }else if(props.type=="rATOM"){
              return rATOM;
          }
      }
      const haswarn=useMemo(()=>{
        return !bondSwitch || !(props.validPools && props.validPools.length>0)
      },[props.validPools,bondSwitch])   
    return <LeftContent className="stafi_stake_context">
        <label className="title"> 
            {props.type=="rKSM" && `Stake KSM`}
            {props.type=="rDOT" && `Stake DOT`}
            {props.type=="rATOM" && `Stake ATOM`}
        </label>
        {haswarn && <div className="warn">Unable to stake, system is waiting for matching validators</div>}
        <div className={`input_panel dot_input_panel ${haswarn && 'showWarn'}`}>
            <div className="tip"> 
                {props.type=="rDOT" ? `Stakable`:"Transferable"} {props.unit}: {props.transferrableAmount} 
            </div>
            <Input  placeholder="AMOUNT" value={props.amount} maxInput={props.transferrableAmount} onChange={(e:any)=>{
                props.onChange && props.onChange(e); 
            }}  icon={getIcon()}/>

{/* selected_rKSM */}
            {/* unit={"Max"} */}
            <div  className="pool">  
                {props.type=="rKSM" && `${isNaN(props.totalStakedToken)?"--":props.totalStakedToken} KSM is staked via rKSM `}
                {props.type=="rDOT" && `${isNaN(props.totalStakedToken)?"--":props.totalStakedToken} DOT is staked via rDOT `}
                {props.type=="rATOM" && `${isNaN(props.totalStakedToken)?"--":props.totalStakedToken} ATOM is staked via rATOM `}
                
                {/* <A>stats</A> */}
            </div>
        </div>
       
        <div className="money_panel"> 
            <div className="money_panel_row">
                <div className="money_panel_item">
                    <div>Estimated APR</div>
                    <div>
                        {props.apr}
                    </div>
                </div>
            {/* <div className="add_icon">
                <img src={add_svg} />
            </div>
            <div className="money_panel_item">
                <div>Dropped FIS</div>
                <div>
                    3%
                </div>
            </div> */}
            </div>
            <div className="money_panel_item">
                <div> 
                   You will get {props.type}
                </div>
                <div>
                    {props.willAmount}
                </div>
            </div>
            <div className="money_panel_item">
                <div className="relay_fee">Relay Fee: {props.bondFees} FIS</div> 
                <div></div>

                <div className="money_panel_item_doubt">
                  
                    <Tooltip overlayClassName="doubt_overlay" placement="topLeft" title={"Fee charged by the relayers to pay for the cross-chain contract interaction service fee between StaFi chain and designated chain."}>
                        <img src={doubt} />
                    </Tooltip>
                </div>
            </div>
        </div> 
        <div className="btns"> <Button disabled={(!props.amount || props.amount==0 || haswarn || processSlider)} onClick={()=>{
             props.onStakeClick && props.onStakeClick()
         }}>Stake</Button>
        </div>
    </LeftContent>
}