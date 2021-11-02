import React from 'react';
import Popover from '@components/tradePopover/index';
import dow_svg from '@images/dow_black.svg'; 
import Content from '../components/content'

export default function Index(){
    return <>
        <div className="type_panel">
            <Popover data={[{label:"native",url:""},{label:"erc20",url:""}]}><div className="type_select">
                native <img src={dow_svg} />
            </div></Popover> 
        </div>
        <Content />
    </>
}