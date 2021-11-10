import React from 'react';
import config from 'src/config/index';
import NumberUtil from 'src/util/numberUtil';

type Props={
    era:Number,
    tokenAmount:string|Number,
    ratio:string | Number,
    redeemableToken:string | Number,
    reward:Number|string
}
export default function Index(props:Props){
    if(props.reward === '--') {
        return null;
    }
    return <div className="row body">
    <div className="col col1">
        {props.era}
    </div>
    <div className="col col2">
        {props.tokenAmount}
    </div>
    <div className="col col3">
        {props.ratio}
    </div>
    <div className="col col4">
        {props.redeemableToken}
    </div>
    <div className="col col5"> 
        {(props.reward!="--" && props.reward>0 && props.reward<config.minReward) && `<${config.minReward}`}
        {(props.reward!="--" && props.reward>=config.minReward) && `+${NumberUtil.fixedAmountLength(props.reward)}`}
        {props.reward=="--" && props.reward}
    </div> 
</div>
}