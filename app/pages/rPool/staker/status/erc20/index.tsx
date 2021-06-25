import React from 'react';
import Popover from '@components/tradePopover/index';
import dow_svg from '@images/dow_black.svg'; 
import Button from '@shared/components/button/connect_button'
import metamask from '@images/metamask.png'
export default function Index(){
    return <>
        <div className="type_panel">
            <Popover data={[{label:"native",url:""},{label:"erc20",url:""}]}><div className="type_select">
            erc20 <img src={dow_svg} />
            </div></Popover>
        </div> 
        <div className="connect_btns">
        <Button icon={metamask} onClick={()=>{
          
        }}>
            Connect to Metamask
        </Button>
        </div>
    </>
}