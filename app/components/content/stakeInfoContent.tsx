import React from 'react'; 
import LeftContent from './leftContent'  
import rDOT_stafi_svg from '@images/rDOT_stafi.svg'
import selected_rDOT_svg from '@images/selected_rDOT.svg'
import Button from '../button/button'
import NumberUtil from '@util/numberUtil'
type Props={
     onRdeemClick?:Function,
     ratio?:any,
     tokenAmount?:any
     ratioShow?:any
}
export default function Index(props:Props){
    return <LeftContent className="stafi_stake_info_context">
      <div className="item">
          <div className="title">
            <img src={rDOT_stafi_svg} /> rDOT
          </div>
          <div className="content">
            <div>{(props.tokenAmount=="--")? "--": NumberUtil.handleFisAmountToFixed(props.tokenAmount)}</div>
            <div className="btns">
              <Button size="small" btnType="ellipse" onClick={()=>{
                  props.onRdeemClick && props.onRdeemClick();
              }}>redeem</Button>
              <Button size="small" btnType="ellipse">Stake</Button>
            </div>
          </div>
          <div className="describe">
           Your current staked DOT  is {(props.tokenAmount !="--" && props.ratio != "--") ? NumberUtil.handleFisAmountToFixed(props.tokenAmount * props.ratio) : "--"}. Unbonding DOT is 9.9800000
          </div>
      </div>
      <div  className="item">
          <div className="title">
            <img src={selected_rDOT_svg} />rDOT / DOT
          </div>
          <div className="content">
            <div>
              {props.ratioShow}
            </div>
            <div className="btns"> 
              <Button size="small" btnType="ellipse">Stake</Button>
            </div>
          </div>
          <div className="describe">
              update every 8 hours
          </div>
      </div>
    </LeftContent>
}