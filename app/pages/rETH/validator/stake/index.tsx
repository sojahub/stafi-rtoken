import React from 'react';
import A from '@shared/components/button/a';
import ProgressBar from '@shared/components/progressBar';
import eth_svg from '@images/eth.svg'
import Upload from '@shared/components/upload';
import Button from '@shared/components/button/button';
import LeftContent from '@components/content/leftContent';
import './index.scss'
export default function Index(props:any){
    return <LeftContent className="stafi_validator_context stafi_reth_validator_context">
        <div className="reth_title"> Stake </div>
       <div className="reth_sub_title">
        Pool contract can be staked once 32ETH is matched to your node, 
        Check <A underline={true} onClick={()=>{
            props.history.push("/rETH/poolStatus")
        }}>pool status</A>
       </div>

        <div className="address">
            Contract Address: <A underline={true}>0x23…HNe8</A>
        </div>
        <ProgressBar icon={eth_svg} text="55.23" progress={55.34}/>
        <div className="reth_title upload_title"> Upload </div>
       <div className="reth_sub_title upload_sub_title">
            Follow the <A underline={true}>instruction</A> and upload your file
       </div>
        <Upload/>
        <div className="btns stake_btns">
          <A isGrey={true}>Offboard</A>
           <Button>
               Stake
           </Button>
        </div>
    </LeftContent>
}