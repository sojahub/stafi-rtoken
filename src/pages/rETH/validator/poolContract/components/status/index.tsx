import React from 'react';
import zs_svg from '@images/zs.svg'
import './index.scss';
type Props={
    status:Number,
    currentBalance:any
}
export default function Index(props:Props){
    if(props.status==-2){
        return <div>--</div>
    }
    if(props.status==-1){
        return <div>Another 24 ETH from Staker need to be deposited</div>
    }
    if(props.status==0){
        if(props.currentBalance>8){
            return <div>Matched</div>
        }else{
            return <div>Matching</div>
        }
    }
    if(props.status==1){
        return <div>Deposited</div>
    }
    if(props.status==2){
        return  <div>Pending Validator to go live</div>
    }
    if(props.status==4 || props.status==5 ){
        return <div>Exit</div>
    }
   
    if(props.status==3){
        return <div className="stafi_pool_status">
        <div className="icon"><img src={zs_svg} /></div>  
        Active
        
        </div>
    }
    return <div>--</div>
}