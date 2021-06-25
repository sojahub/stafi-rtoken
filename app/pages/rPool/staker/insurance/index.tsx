import LeftContent from '@components/content/leftContent';
import tidal from '@images/tidal.png';
import Button from '@shared/components/button/button';
import selected_rFIS_svg from '@images/selected_r_fis.svg';
import React from 'react';
import './index.scss';

export default function Index(){
    return <LeftContent className="rpool_content">
        <div className="top_panel">
            <div className="title">
                <img src={tidal} />  Buy insurance to cover loss
            </div>
            <p>StaFi is collaborate with Tidal.finance to provide an insurance to cover the POTENTIAL LOSS of your staking derivative</p>
            <p>Such as the designated smart contract was used in an unintended way, or </p>
            <p>The designated smart contract suffered hacks or exploitation of the protocol code for any bug that was not publicly disclosed before the coverage period began, etc. You can to the Tidal Finance to check the details, and here is an guide on how to buy cover on Tidal.</p>
            <div className="buttons">
                <Button>Buy Cover</Button>
            </div>
        </div>
        <div className="bottom_panel">
            <div><img src={selected_rFIS_svg} />Go to rToken Status </div>
            <div><Button>Go</Button> </div>
        </div>
    </LeftContent>
}