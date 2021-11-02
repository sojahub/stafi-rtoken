import React from 'react';
import dow_svg from 'src/assets/images/dow_green.svg';
import GhostButton from 'src/shared/components/button/ghostButton';
import './buttonPopover.scss';
import Popover from './index';
type Props={
    data:any[],
    children:any, 
}
export default function Index(props:Props){
    return <Popover data={props.data}>
            <GhostButton className="popover_btn">
                {props.children}<img className="stafi_button_dow_svg" src={dow_svg}/>
            </GhostButton>
      </Popover>
}