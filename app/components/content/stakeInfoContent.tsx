import React, { useState } from 'react'; 
import LeftContent from './leftContent'  
import rDOT_stafi_svg from '@images/rDOT_stafi.png'
import rDOT_DOT_svg from '@images/rDOT_DOT.svg'
import Button from '@shared/components/button/button'
import NumberUtil from '@util/numberUtil';
import Modal from '../modal/swapModal' 
type Props={
     onRdeemClick?:Function,
     ratio?:any,
     tokenAmount?:any
     ratioShow?:any,
     onStakeClick?:any
}
export default function Index(props:Props){
  const [visibleModal,setVisibleModal]=useState(false);
    return <LeftContent className="stafi_stake_info_context">
      <div className="item">
          <div className="title">
            <img src={rDOT_stafi_svg} style={{width:"40px"}}/> rDOT
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
           Your current staked DOT  is {(props.tokenAmount !="--" && props.ratio != "--") ? NumberUtil.handleFisAmountToFixed(props.tokenAmount * props.ratio) : "--"}. Unbonding DOT is 9.9800000
          </div>
      </div>
      <div  className="item">
          <div className="title">
            <img src={rDOT_DOT_svg} />rDOT / DOT
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
              update every 8 hours
          </div>
      </div>
      <Modal visible={visibleModal} onCancel={()=>{
        setVisibleModal(false)
      }}/>
    </LeftContent>
}