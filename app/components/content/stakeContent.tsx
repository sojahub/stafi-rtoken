import React from 'react';
import Input from '@shared/components/input/amountInput';
import LeftContent from './leftContent'
import Button from '@shared/components/button/button'
import A from '@shared/components/button/a'
import rDOT from '@images/selected_rDOT.svg';

type Props={
    onRecovery:Function
}
export default function Index(props:Props){
    return <LeftContent className="stafi_stake_context">
        <label className="title">Stake DOT</label>
        <div className="input_panel">
            <Input placeholder="DOT AMOUNT" icon={rDOT}/>
        </div>
        <div  className="pool_panel">
        You staked DOT will be in this <A>pool</A>
        </div>
        <div className="money_panel">
            <div className="money_panel_item">
                <div>Estimated APR</div>
                <div>
                    18.23%
                </div>
            </div>
            <div className="money_panel_item">
                <div>You will get rDOT</div>
                <div>
                    23.45
                </div>
            </div>
        </div>
        <div className="btns">
         <A bold={true} onClick={()=>{
            props.onRecovery && props.onRecovery()
         }}>Recovery</A><Button disabled={true}>Stake</Button>
        </div>
    </LeftContent>
}