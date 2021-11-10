import React from 'react';
import dow_svg from 'src/assets/images/dow_black.svg';
import metamask from 'src/assets/images/metamask.png';
import Popover from 'src/components/tradePopover/index';
import Button from 'src/shared/components/button/connect_button';
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