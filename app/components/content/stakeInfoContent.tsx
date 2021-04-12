import React, { useState } from 'react'; 
import LeftContent from './leftContent'  
import rDOT_stafi_svg from '@images/rDOT_stafi.png';
import rKSM_stafi_svg from '@images/rKSM_stafi.png'
import rDOT_DOT_svg from '@images/rDOT_DOT.svg'
import Button from '@shared/components/button/button'
import NumberUtil from '@util/numberUtil';
import Modal from '../modal/swapModal' 
type Props={
     onRdeemClick?:Function,
     ratio?:any,
     tokenAmount?:any
     ratioShow?:any,
     onStakeClick?:any,
     type:"rDOT"|"rETH"|"rFIS"|"rKSM",
     totalUnbonding?:any
}
export default function Index(props:Props){
  const [visibleModal,setVisibleModal]=useState(false);
    return <LeftContent className="stafi_stake_info_context">
      <div className="item">
          <div className="title">
            {props.type=="rDOT" && <img src={rDOT_stafi_svg} style={{width:"40px"}}/>  }
            {props.type=="rKSM" && <img src={rKSM_stafi_svg} style={{width:"40px"}}/>  }
            {props.type}
          </div>
          <div className="content">
            <div>{(props.tokenAmount=="--")? "--": NumberUtil.handleFisAmountToFixed(props.tokenAmount)}</div>
            <div className="btns">
              <Button size="small" btnType="ellipse" onClick={()=>{
                  props.onRdeemClick && props.onRdeemClick();
              }}>Redeem</Button>
              <Button onClick={()=>{
                setVisibleModal(true);
              }} size="small" btnType="ellipse">Trade</Button>
            </div>
          </div>
          <div className="describe">
            {props.type=="rDOT" && ` Your current staked DOT  is ${(props.tokenAmount !="--" && props.ratio != "--") ? NumberUtil.handleFisAmountToFixed(props.tokenAmount * props.ratio) : "--"}`}
            {props.type=="rKSM" && `Your current staked KSM  is ${(props.tokenAmount !="--" && props.ratio != "--") ? NumberUtil.handleFisAmountToFixed(props.tokenAmount * props.ratio) : "--"}`}
            {props.type == "rDOT" && props.totalUnbonding > 0 && ` Unbonding DOT is ${props.totalUnbonding}`}
            {props.type=="rKSM" && props.totalUnbonding > 0 && ` Unbonding KSM is ${props.totalUnbonding}`}
          </div>
      </div>
      <div  className="item">
          <div className="title">
            <img src={rDOT_DOT_svg} />
            {props.type=="rDOT" && `rDOT / DOT`}
            {props.type=="rKSM" && `rKSM / KSM`}
          </div>
          <div className="content">
            <div>
              {props.ratioShow}
            </div>
            <div className="btns"> 
              <Button onClick={()=>{
                 props.onStakeClick && props.onStakeClick()
              }} size="small" btnType="ellipse">Stake</Button>
            </div>
          </div>
          <div className="describe">
             
            {props.type=="rDOT" && ` update every 24 hours`}
            {props.type=="rKSM" && ` update every 6 hours `}
          </div>
      </div>
      <Modal type={props.type} visible={visibleModal} onCancel={()=>{
        setVisibleModal(false)
      }}/>
    </LeftContent>
}