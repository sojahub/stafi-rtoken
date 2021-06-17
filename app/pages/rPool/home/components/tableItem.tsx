import React from 'react';
import rpool_Icon from '@images/rpool_rfis.svg'
import GhostButton from '@shared/components/button/ghostButton' 
export default function Index(){
    return <div className="row">
                <div className="col col1">
                  <img src={rpool_Icon} />   rFIS/ETH
                </div>
                <div className="col col2">
                   <div><div>+22.12% </div><label>fis</label></div>
                   <div><div>+22.12% </div><label>fis</label></div>
                </div>
                <div className="col  col3">
                $12328.12
                </div>
                <div className="col col4">
                $12328.12
                </div>
                <div className="col col5">
                Uniswap
                </div>
                <div className="col col6"> 
                    <GhostButton> Add liquidity</GhostButton>
                    <GhostButton> Stake</GhostButton>
                </div>
            </div>
}