import React, { useMemo } from 'react';
import {useSelector} from 'react-redux';
import {Tooltip} from 'antd'
import Input from '@shared/components/input/amountInput';
import LeftContent from './leftContent'
import Button from '@shared/components/button/button'
import A from '@shared/components/button/a' 
import rETH from '@images/selected_rETH.svg' 

import './index.scss'; 
type Props={ 
    onStakeClick:Function, 
    transferrableAmount?:any
    amount?:number,
    onChange?:Function,
    willAmount?:string | 0,
    apr?:string,  
    type:"rETH",
    history?:any,  
    totalStakedAmount?:any, 
    waitingStaked:any,
    isPoolWaiting:boolean
}
export default function Index(props:Props){
    const { }=useSelector((state:any)=>{  
        return { 
          
        }
      })
 
      const getIcon=()=>{ 
        return rETH;
      }  
    return <LeftContent className="stafi_stake_context stafi_stake_context_eth">
        <div className="stafi_Staker_tip">Be aware of rETH can not be redeemed until Phase 1.5 of ETH2 !</div>
        <label className="title"> 
            Stake ETH
        </label>
         
        <div className={`input_panel dot_input_panel`}>

            <Input placeholder="AMOUNT" value={props.amount} maxInput={props.transferrableAmount} onChange={(e:any)=>{
                props.onChange && props.onChange(e); 
            }}  icon={getIcon()}/>

 
            <div  className="pool">  
                {
                    props.isPoolWaiting?<>{props.waitingStaked} ETH is waiting to be staked in the <A onClick={()=>{
                        props.history &&  props.history.push("/rETH/poolStatus")
                     }}>pool</A> contracts</>:<>
                            {Number(props.totalStakedAmount)<=0?<>
                               {props.totalStakedAmount} ETH is staked in pool contracts
                            </>:<>
                               {props.totalStakedAmount} ETH is staked in <A onClick={()=>{
                        props.history &&  props.history.push("/rETH/poolStatus")
                     }}>pool</A> contracts
                            </>}
                     </>
                }
                
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
            </div>
            <div className="money_panel_item">
                <div> 
                   You will get {props.type}
                </div>
                <div>
                    {props.willAmount}
                </div>
            </div>
            
        </div> 
        <div className="btns"> <Button disabled={(!props.amount || props.amount==0)} onClick={()=>{
             props.onStakeClick && props.onStakeClick()
         }}>Stake</Button>
        </div>
    </LeftContent>
}