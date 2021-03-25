import React from 'react'; 
import LeftContent from './leftContent'  
import Input from '@shared/components/input/amountInput';
import rDOT from '@images/selected_rDOT.svg' 
import leftArrowSvg from '@images/left_arrow.svg'
import NumberUtil from '@util/numberUtil'
import Button from '@shared/components/button/button'
import numberUtil from '@util/numberUtil';
type Props={
     onRdeemClick?:Function,
     amount?:string,
     onAmountChange?:Function,
     tokenAmount?:any,
     unbondCommission?:any,
     history?:any,
     fisFee?:any
}
export default function Index(props:Props){
    return <LeftContent className="stafi_stake_redeem_context"> 
    <img className="back_icon" onClick={()=>{
      props.history.goBack();
    }} src={leftArrowSvg}/>
         <div className="title">
            Redeem DOT
         </div>
         <div className="subTitle">
               <div className="label"> 1. Unbond DOT</div>
                <div className="balance">
                rDOT balance {(props.tokenAmount=="--")? "--": NumberUtil.handleFisAmountToFixed(props.tokenAmount)}
             </div>
        </div>
         <div className="input_panel"> 
            <Input placeholder="DOT AMOUNT" value={props.amount}  onChange={(e:string)=>{
                props.onAmountChange && props.onAmountChange(e);
            }}  icon={rDOT}/>
            <div className="balance">
                You will get {(props.unbondCommission=="--" || !!!props.amount)? "--": `${NumberUtil.handleFisAmountToFixed(props.unbondCommission)}`} DOT
             </div>
         </div>
         <div className="btns">
           <Button disabled={!props.amount} size="small" btnType="ellipse" onClick={()=>{
               props.onRdeemClick && props.onRdeemClick();
           }}>Unbond</Button> Unbond will take 28 days and {(props.fisFee != "--") && numberUtil.fisFeeToFixed(props.fisFee)}% fee
         </div>
         <div className="subTitle">
         2. Withdraw unbonded DOT
             </div>
             <div className="unbonding">
             <label>1.0323</label> Unbonding: 12.34 ( 23 days left)
             </div>
             <Button size="small" btnType="ellipse">Withdraw</Button>
    </LeftContent>
}