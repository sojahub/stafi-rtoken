import React from 'react';
import GhostButton from '@shared/components/button/ghostButton'
import rETH_svg from '@images/rETH.svg'; 
import rFIS_svg from '@images/rFIS.svg'; 
import rDOT_svg from '@images/rDOT.svg'; 
import rKSM_svg from '@images/rKSM.svg';
export default function Index(){
  return <div className="list_item">
    <div className="col_type">
        <img src={rKSM_svg} /> rKSM <label>Ethereum</label>
    </div>
    <div className="col_amount"> 
        <div>
          29.345
        </div>
        <div>
          Redeemable:30.214ETH
        </div>
    </div>
    <div className="col_btns">
        <GhostButton>
            Swap
        </GhostButton>
    </div>
  </div>  
}
