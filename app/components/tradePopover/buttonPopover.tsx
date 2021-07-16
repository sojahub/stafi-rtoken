import React from 'react';
import GhostButton from '@shared/components/button/ghostButton';
import dow_svg from '@images/dow_green.svg'
import Popover from './index'
import './buttonPopover.scss'
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