import React from 'react';
import Input from '../input/amountInput';
import LeftContent from './leftContent'
import Button from '../button/button'
import A from '../button/a'
import rDOT from '@images/selected_rDOT.svg';
import add_svg from '@images/add.svg'

import './index.scss';
type Props={
    onRecovery:Function
}
export default function Index(props:Props){
    return <LeftContent className="stafi_stake_context">
        <label className="title">Stake DOT</label>
        <div className="input_panel dot_input_panel">
            <div className="tip">
                Transferable DOT: 123.342
            </div>
            <Input placeholder="DOT AMOUNT" unit={"Max"} icon={rDOT}/>
            <div  className="pool">
                234,234 DOT is staked via rDOT <A>stats</A>
            </div>
        </div>
       
        <div className="money_panel"> 
            <div className="money_panel_row">
            <div className="money_panel_item">
                <div>Estimated APR</div>
                <div>
                    18.23%
                </div>
            </div>
            <div className="add_icon">
                <img src={add_svg} />
            </div>
            <div className="money_panel_item">
                <div>Dropped FIS</div>
                <div>
                    3%
                </div>
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