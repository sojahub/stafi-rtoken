import React, { useMemo } from 'react';
import {useSelector} from 'react-redux';
import Input from '../input/amountInput';
import LeftContent from './leftContent'
import Button from '../button/button'
import A from '../button/a'
import rDOT from '@images/selected_rDOT.svg';
import add_svg from '@images/add.svg'

import './index.scss';
import { message } from 'antd';
type Props={
    onRecovery:Function,
    onStakeClick:Function,
    unit?:string, 
    transferrableAmount?:any
    amount?:number,
    onChange?:Function,
    willAmount?:string | 0,
    apr?:string,
    validPools?:any[]
}
export default function Index(props:Props){
    const {bondSwitch}=useSelector((state:any)=>{  
        return { 
          bondSwitch:state.FISModule.bondSwitch
        }
      })

      const haswarn=useMemo(()=>{
        return !bondSwitch && !(props.validPools && props.validPools.length>0)
      },[props.validPools,bondSwitch])
    return <LeftContent className="stafi_stake_context">
        <label className="title">Stake DOT</label>
        {haswarn && <div className="warn">Unable to stake, system is waiting for matching validators</div>}
        <div className={`input_panel dot_input_panel ${haswarn && 'showWarn'}`}>
            <div className="tip">
                Transferable {props.unit}:{props.transferrableAmount}
            </div>
            <Input placeholder="DOT AMOUNT" value={props.amount} onChange={(e:any)=>{
                if(parseFloat(e)>parseFloat(props.transferrableAmount)){
                    message.error("The input amount exceeds your transferrable balance.");
                    props.onChange && props.onChange(undefined);
                } else{
                    props.onChange && props.onChange(e);
                }
                
            }} unit={"Max"} icon={rDOT}/>
            <div  className="pool">
                234,234 DOT is staked via rDOT <A>stats</A>
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
                    {props.willAmount}
                </div>
            </div>
        </div>
        <div className="btns">
         <A bold={true} onClick={()=>{
            props.onRecovery && props.onRecovery()
         }}>Recovery</A><Button disabled={!props.amount} onClick={()=>{
             props.onStakeClick && props.onStakeClick()
         }}>Stake</Button>
        </div>
    </LeftContent>
}