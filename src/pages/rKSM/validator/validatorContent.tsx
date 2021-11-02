import { message } from 'antd';
import React from 'react';
import LeftContent from 'src/components/content/leftContent';
import Button from 'src/shared/components/button/button';
import './index.scss';

type Props={
    onRecovery:Function,

}
export default function Index(props:Props){
    return <LeftContent className="stafi_validator_context">
        <label className="title">Register as a OV on Kusama</label>
        <div className="describe">
        OV(Original Validator) is a block producer of Kusama chain which can receive delegated KSM on chain and get incentive reward from joining consensus.
        </div>
        <div className="sub_title">
            Prerequisites
        </div>
        <div className="describe">
        1. You have registered as a validator on Kusama Chain <br/>
        2. You meet the current criteria for screening OV<br/>
        3. You know the penalty and risk of being a OV <br/>
        4. You know the nominate rules of a OV
        </div>
        <div className="sub_title">
            Apply
        </div>
        <div className="describe">
        In the start-up phase, in order to maximize revenue, StaFi chain will automatically nominate the elected validators on Kusama. As the number of rKSM increases, validator will be open to the community
        </div>
        <div className="btns">
            <Button  onClick={()=>{
                message.warning("OV Registration is not open yet.")
            }}>Apply</Button>
        </div>
    </LeftContent>
}