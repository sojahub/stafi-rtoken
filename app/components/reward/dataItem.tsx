import React from 'react'

type Props={
    era:Number,
    tokenAmount:Number,
    ratio:Number,
    redeemableToken:Number,
    reward:Number
}
export default function Index(props:Props){
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
        +{props.reward}
    </div> 
</div>
}