import React from 'react';
import Button from '@components/button/connect_button';
import rDOT_svg from '@images/rDOT.svg'
import './index.scss';

export default function Index(props:any){
    return <div className="rDot_home">
            <div className="title">
              <label>Liquefy</label> Your Staking DOT
            </div>
            <div className="sub_title">
              Staking via StaFi Staking Contract and get rDOT in return
            </div>
            <Button icon={rDOT_svg} onClick={()=>{ 
              props.history.push("/rDOT/wallet")
            }}>Connect to Polkadotjs extension</Button>
            <a className="stafi_a">Get Intro</a>
    </div>
}