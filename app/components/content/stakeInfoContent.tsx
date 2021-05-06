import React, { useState } from 'react'; 
import {message} from 'antd';
import LeftContent from './leftContent'  
import rDOT_stafi_svg from '@images/selected_r_dot.svg';
import rKSM_stafi_svg from '@images/selected_r_ksm.svg';
import rATOM_stafi_svg from '@images/selected_r_atom.svg'
import rDOT_DOT_svg from '@images/rDOT_DOT.svg'
import Button from '@shared/components/button/button'
import NumberUtil from '@util/numberUtil';
import Modal from '../modal/swapModal' 
import config from '@config/index';

type Props={
     onRdeemClick?:Function,
     ratio?:any,
     tokenAmount?:any
     ratioShow?:any,
     onStakeClick?:any,
     type:"rDOT"|"rETH"|"rFIS"|"rKSM"|"rATOM",
     totalUnbonding?:any,
     onSwapClick?:Function,
     onUniswapClick?:Function
}
export default function Index(props:Props){
  const [visibleModal, setVisibleModal] = useState(false);
    return <LeftContent className="stafi_stake_info_context">
      <div className="item">
          <div className="title">
            {props.type=="rDOT" && <img src={rDOT_stafi_svg} style={{width:"40px"}}/>  }
            {props.type=="rKSM" && <img src={rKSM_stafi_svg} style={{width:"40px"}}/>  }
            {props.type=="rATOM" && <img src={rATOM_stafi_svg} style={{width:"40px"}}/>  }
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
            {props.type=="rDOT" && ` Your current staked DOT  is ${(props.tokenAmount !="--" && props.ratio != "--") ? NumberUtil.handleFisRoundToFixed(props.tokenAmount * props.ratio) : "--"}`}
            {props.type=="rKSM" && `Your current staked KSM  is ${(props.tokenAmount !="--" && props.ratio != "--") ? NumberUtil.handleFisRoundToFixed(props.tokenAmount * props.ratio) : "--"}`}
            {props.type=="rATOM" && `Your current staked ATOM  is ${(props.tokenAmount !="--" && props.ratio != "--") ? NumberUtil.handleFisRoundToFixed(props.tokenAmount * props.ratio) : "--"}`}
            {props.type == "rDOT" && props.totalUnbonding > 0 && `. Unbonding DOT is ${props.totalUnbonding}`}
            {props.type=="rKSM" && props.totalUnbonding > 0 && `. Unbonding KSM is ${props.totalUnbonding}`}
            {props.type=="rATOM" && props.totalUnbonding > 0 && `. Unbonding ATOM is ${props.totalUnbonding}`}
          </div>
      </div>
      <div  className="item">
          <div className="title">
            <img src={rDOT_DOT_svg} />
            {props.type=="rDOT" && `rDOT / DOT`}
            {props.type=="rKSM" && `rKSM / KSM`}
            {props.type=="rATOM" && `rATOM / ATOM`} 
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
             
            {props.type=="rDOT" && ` Updated every 24 hours`}
            {props.type=="rKSM" && ` Updated every 6 hours `}
            {props.type=="rATOM" && ` Updated every 24 hours `}
          </div>
      </div>
      <Modal type={props.type} visible={visibleModal} onCancel={() => {
        setVisibleModal(false) 
      }} onOk={()=>{
        // message.info("Swap will be available soon");
        props.onSwapClick && props.onSwapClick();
      }}
      onUniswapClick={()=>{
        props.onUniswapClick && props.onUniswapClick();
      }}/>
 
    </LeftContent>
}