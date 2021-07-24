import React from 'react';
import Button from '@shared/components/button/button';
import LeftContent from '@components/content/leftContent';
import '../index.scss'; 
import { message } from 'antd';

type Props={
    onBoard:Function
}
export default function Index(props:Props){
    return <LeftContent className="stafi_validator_context">
        <label className="title">Register as an OV<br/>
Original Validator on StaFi</label> 
        <div className="describe" style={{marginTop:50}}>
        OV is a block producer of StaFi chain which can receive delegated stake on chain and get incetive reward from joining consensus.
        </div>
        <div className="sub_title">
            Prerequisites
        </div>
        <div className="describe">
        1. You have registered as a validator on StaFi Chain (SV） <br/>
        2. You meet the current criteria for screening OV<br/>
        3. You know the penalty and risk of being an OV <br/>
        4. You know the nomination rules of an OV
        </div>
         
        <div className="btns" style={{marginTop:67}}>
            <Button  onClick={()=>{
                props.onBoard && props.onBoard();
            }}>Onboard</Button>
        </div>
    </LeftContent>
}