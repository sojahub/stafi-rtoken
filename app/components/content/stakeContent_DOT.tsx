import React, { useMemo } from 'react';
import {useSelector} from 'react-redux';
import {Tooltip} from 'antd'
import Input from '@shared/components/input/amountInput';
import LeftContent from './leftContent'
import Button from '@shared/components/button/button'
import A from '@shared/components/button/a'
import rDOT from '@images/selected_rDOT.svg';
import rKSM from '@images/selected_rKSM.svg'
import doubt from "@images/doubt.svg";
import NumberUtil from '@util/numberUtil';
import add_svg from '@images/add.svg'

import './index.scss';
import { message } from 'antd';
import { rSymbol } from '@keyring/defaults';
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
    type:"rDOT"|"rETH"|"rFIS"|"rKSM",

}
export default function Index(props:Props){
    const {bondSwitch}=useSelector((state:any)=>{  
        return { 
          bondSwitch:state.FISModule.bondSwitch
        }
      })
 
      const haswarn=useMemo(()=>{
        return !bondSwitch || !(props.validPools && props.validPools.length>0)
      },[props.validPools,bondSwitch])   
    return <LeftContent className="stafi_stake_context">
        <label className="title"> 
            {props.type=="rKSM" && `Stake KSM`}
            {props.type=="rDOT" && `Stake DOT`}
        </label>
        {haswarn && <div className="warn">Unable to stake, system is waiting for matching validators</div>}
        <div className={`input_panel dot_input_panel ${haswarn && 'showWarn'}`}>
            <div className="tip">
            {props.type=="rDOT" ? `Stakable`:"Transferable"} {props.unit}: {props.transferrableAmount}
            </div>
            <Input placeholder="AMOUNT" value={props.amount} onChange={(e:any)=>{
                if(parseFloat(e)>parseFloat(props.transferrableAmount)){
                    message.error("The input amount exceeds your transferrable balance.");
                    props.onChange && props.onChange(null);
                } else{
                    props.onChange && props.onChange(e);
                }
                
            }}  icon={props.type=="rKSM"?rKSM:rDOT}/>

{/* selected_rKSM */}
            {/* unit={"Max"} */}
            <div  className="pool">
                
                {props.type=="rKSM" && `${isNaN(props.totalStakedToken)?"--":props.totalStakedToken} KSM is staked via rKSM `}
                {props.type=="rDOT" && `${isNaN(props.totalStakedToken)?"--":props.totalStakedToken} DOT is staked via rDOT `}
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
                {props.type=="rKSM" && `You will get rKSM`}
                {props.type=="rDOT" && `You will get rDOT`}
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
        <div className="btns"> <Button disabled={(!props.amount || props.amount==0 || haswarn)} onClick={()=>{
             props.onStakeClick && props.onStakeClick()
         }}>Stake</Button>
        </div>
    </LeftContent>
}