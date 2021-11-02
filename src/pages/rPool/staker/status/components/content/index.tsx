import React from 'react';
import Popover from '@components/tradePopover/index';
import dow_svg from '@images/dow_black.svg';
import Button from '@shared/components/button/button';
import selected_rETH_svg from '@images/selected_r_eth.svg';
import rDOT_DOT_svg from '@images/rDOT_DOT.svg'

export default function Index(){
    return <>
         <div className="top_panel"> 
            <div className="token_row">
                <div className="left">
                    <img src={selected_rETH_svg} /> rETH
                </div>
                <div className="right">
                    <div className="data">
                        33.90
                    </div>
                    <div className="redeemable">
                        Redeemable ETH : 11.12
                    </div>
                </div> 
            </div>
            <div className="car_list">
                <div className="car_item">
                    <div className="title">
                       <label>Staked ETH</label>  
                    </div>
                    <div className="data">
                    11.12 ETH
                    </div>
                </div>
                <div className="car_item">
                    <div className="title">
                       <label>Staked ETH</label> 
                       <a>detail </a>
                    </div>
                    <div className="data">
                    11.12 ETH
                    </div>
                </div>
                <div className="car_item">
                    <div className="title">
                       <label>Staked ETH</label> 
                       <a>detail </a>
                    </div>
                    <div className="data">
                    + 0.2320000 ETH
                    </div>
                </div>
            </div>
            <div className="btns">

            </div>
            <div className="btns">
              <Button size="small" btnType="ellipse" onClick={()=>{
                  
              }}>Redeem</Button>
              
              <Popover data={[{label:"Curve",url:""},{label:"Uniswap",url:""}]}> 
                <Button size="small" btnType="ellipse">Trade <img className="dow_svg" width={13} src={dow_svg}/> </Button> 
              </Popover>
            </div>
         </div>
         <div className="bottom_panel">
            <div className="token_row">
                <div className="left">
                    <img src={rDOT_DOT_svg} /> rETH / ETH
                </div>
                <div className="right">
                    1.0323
                </div> 
            </div>
            <div className="hours">
            Updated every 8 hours
            </div>
         </div>
    </>
}