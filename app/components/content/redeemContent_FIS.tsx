import React, { useState } from 'react'; 
import {message} from 'antd'
import LeftContent from './leftContent'  
import Input from '@shared/components/input/amountInput'; 
import rFIS from '@images/selected_rFIS.svg';
import leftArrowSvg from '@images/left_arrow.svg'
import NumberUtil from '@util/numberUtil'
import Button from '@shared/components/button/button';
import numberUtil from '@util/numberUtil';
import config from '@config/index';
import {Symbol} from '@keyring/defaults'

type Props={
     onRdeemClick?:Function,
     amount?:string,
     onAmountChange?:Function,
     tokenAmount?:any, 
     history?:any,
     fisFee?:any,
     address?:string,
     onInputChange?:Function,
     onInputConfirm?:Function,
     leftDays?:any,
     unbondingToken?:any,
     withdrawToken?:any,
     validPools?:any,
     unbondWarn?:boolean,
     onWithdrawClick?:Function,
     willAmount:any
}
export default function Index(props:Props){ 

 
  
    return <LeftContent className="stafi_stake_redeem_context"> 
    <img className="back_icon" onClick={()=>{
      props.history.goBack();
    }} src={leftArrowSvg}/>
         <div className="title"> 
           Redeem FIS
         </div>
         <div className="subTitle">
               <div className="label"> 
               1. Unbond FIS
               </div> 
        </div>
        <div className="input_panel"> 
            <div className="balance">  
                rFIS balance: {(props.tokenAmount=="--")? "--": NumberUtil.handleFisAmountToFixed(props.tokenAmount)}
            </div>
            <Input disabled={props.unbondWarn} placeholder={"AMOUNT"} maxInput={props.tokenAmount} value={props.amount}  onChange={(e:string)=>{
                props.onAmountChange && props.onAmountChange(e)
            }}  icon={rFIS}/>
            <div className="balance"> 
                {props.willAmount!=0?`You will get ${props.willAmount} FIS `:''}
            </div>
        </div> 
        <div className="fis_unbond_info">
            <Button size="small" btnType="ellipse"
            disabled={!props.amount || props.amount == '0' || props.validPools.length<=0}
            onClick={() => {
                props.onRdeemClick && props.onRdeemClick();
              }}>Unbond</Button><label>Unbond will take {config.unboundAroundDays(Symbol.Fis)} days and {props.fisFee!="--"?`${numberUtil.fisFeeToFixed(props.fisFee)}%`:"--"} fee</label>
        </div> 
         <div className="subTitle">
               <div className="label"> 
                2. Withdraw unbonded FIS
               </div> 
        </div>
        <div className="fis_withdraw">
            <label className="value">{props.withdrawToken}</label><label className="info">Unbonding: <label className="withdraw_value">{props.unbondingToken} ( {props.leftDays} days left)</label></label>
        </div>
        <div className="fis_withdraw_info">
            <Button onClick={()=>{
                props.onWithdrawClick && props.onWithdrawClick();
            }} size="small" disabled={props.withdrawToken=="--"  || props.withdrawToken<=0} btnType="ellipse">Withdraw</Button>
        </div> 
    </LeftContent>
}