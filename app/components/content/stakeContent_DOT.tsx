import doubt from "@images/doubt.svg";
import rATOM from '@images/selected_rATOM.svg';
import rDOT from '@images/selected_rDOT.svg';
import rFIS from '@images/selected_rFIS.svg';
import rKSM from '@images/selected_rKSM.svg';
import rMATIC from '@images/selected_rMatic.svg';
import rSOL from '@images/solana.svg';
import Button from '@shared/components/button/button';
import Input from '@shared/components/input/amountInput';
import { Tooltip } from 'antd';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import './index.scss';
import LeftContent from './leftContent';

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
    type:"rDOT"|"rFIS"|"rKSM"|"rATOM"| 'rSOL' | "rMATIC", 
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
          } else if (props.type == 'rSOL') {
            return rSOL;
          }else if(props.type=="rMATIC"){
            return rMATIC;
        }else if(props.type=="rFIS"){
            return rFIS;
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
            {props.type=="rFIS" && `Stake FIS`} 
            {props.type=="rATOM" && `Stake ATOM`} 
            {props.type == 'rSOL' && `Stake SOL`} 
            {props.type=="rMATIC" && `Stake MATIC`} 
            {props.type=="rFIS" && `Stake FIS`} 
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
                {props.type=="rFIS" && `${isNaN(props.totalStakedToken)?"--":props.totalStakedToken} FIS is staked via rFIS `}
                {props.type == 'rSOL' && `${isNaN(props.totalStakedToken) ? '--' : props.totalStakedToken} SOL is staked via rSOL `}
                {props.type=="rMATIC" && `${isNaN(props.totalStakedToken)?"--":props.totalStakedToken} MATIC is staked via rMATIC `} 
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
            {props.type!="rFIS" && <div className="money_panel_item">
                <div className="relay_fee">Relay Fee: {props.bondFees} FIS</div> 
                <div></div>

                <div className="money_panel_item_doubt">
                  
                    <Tooltip overlayClassName="doubt_overlay" placement="topLeft" title={"Fee charged by the relayers to pay for the cross-chain contract interaction service fee between StaFi chain and designated chain."}>
                        <img src={doubt} />
                    </Tooltip>
                </div>
            </div>}
        </div> 
        <div className="btns"> <Button disabled={(!props.amount || props.amount==0 || haswarn || processSlider)} onClick={()=>{
             props.onStakeClick && props.onStakeClick()
         }}>Stake</Button>
        </div>
    </LeftContent>
}