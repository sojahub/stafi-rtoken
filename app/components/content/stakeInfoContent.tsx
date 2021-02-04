import React from 'react'; 
import LeftContent from './leftContent'  
import rDOT_stafi_svg from '@images/rDOT_stafi.svg'
import selected_rDOT_svg from '@images/selected_rDOT.svg'
type Props={
     
}
export default function Index(props:Props){
    return <LeftContent className="stafi_stake_info_context">
      <div className="item">
          <div>
            <img src={rDOT_stafi_svg} />
          </div>
      </div>
      <div  className="item">
          <div>
            <img src={selected_rDOT_svg} />
          </div>
      </div>
    </LeftContent>
}