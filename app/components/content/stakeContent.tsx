import React from 'react';
import Input from '../input/amountInput';
import Button from '../button/button'
import rDOT from '@images/selected_rDOT.svg'

export default function Index(){
    return <div className="stafi_stake_context">
        <label className="title">Stake DOT</label>
        <div className="input_panel">
            <Input placeholder="DOT AMOUNT" icon={rDOT}/>
        </div>
        <div  className="pool_panel">
        You staked DOT will be in this <a>pool</a>
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
         <Button disabled={true}>Stake</Button>
        </div>
    </div>
}