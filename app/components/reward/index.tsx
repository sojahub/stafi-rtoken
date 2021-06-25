import React from 'react';
import LeftContent from '../content/leftContent'
import Doubt from '@shared/components/doubt'
import './index.scss'

type Props={
    children:any,
    type:"DOT" | "KSM" | "ATOM" | "ETH"
}
export default function Index(props:Props){
    return <LeftContent className="stafi_reward_card">
        <div className="title">
                 Reward Details <Doubt tip={"This reward is nominal, the actual reward will be reflected when you redeem, or in the secondary market. Reward is calculation is based on your account balance of last era, balance transfer will impact the accuracy of reward calculation."}/>
        </div>
        <div className="data_table">
            <div className="row heard">
                <div className="col col1">
                    Era
                </div>
                <div className="col col2">
                    r{props.type}
                </div>
                <div className="col col3">
                    r{props.type}:{props.type}
                </div>
                <div className="col col4">
                    Redeemable {props.type}
                </div>
                <div className="col col5">
                    Reward
                </div> 
            </div>
            <div className="tbody">
                {props.children}
            </div>
            <div>
                Era is updated every 8 hours
            </div>
        </div>
    </LeftContent>
}