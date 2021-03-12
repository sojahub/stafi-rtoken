import React, { useState,useEffect } from 'react';
import Item from './item';
import rETH_svg from '@images/rETH.svg';
import selected_rETH_svg from '@images/selected_rETH.svg';
import rFIS_svg from '@images/rFIS.svg';
import selected_rFIS_svg from '@images/selected_rFIS.svg';
import rDOT_svg from '@images/rDOT.svg';
import selected_rDOT_svg from '@images/selected_rDOT.svg';

import rAsset_svg from '@images/rAsset.svg';
import rKSM_svg from '@images/rKSM.svg';

import './index.scss'

const siderData=[
    {
        icon:rAsset_svg,
        selectedIcon:rAsset_svg,
        text:"rAsset", 
        url:""
    },
    {
        icon:rETH_svg,
        selectedIcon:selected_rETH_svg,
        text:"rETH", 
        url:""
    },
    {
        icon:rFIS_svg,
        selectedIcon:selected_rFIS_svg,
        text:"rFIS", 
        url:""
    },
    {
        icon:rDOT_svg,
        selectedIcon:selected_rDOT_svg,
        text:"rDOT", 
        url:"/rDOT/home"
    },
    {
        icon:rKSM_svg,
        selectedIcon:rKSM_svg,
        text:"rKSM", 
        url:""
    }
]
type Props={
    route:any,
    history:any
}
export default function Index(props:Props){
    // const [selectIndex,setSelectIndex]=useState(0);
    return <div className="stafi_left_sider">
        {siderData.map((item,i)=>{
            return <Item key={item.text} icon={item.icon} 
            selectedIcon={item.selectedIcon} text={item.text} 
            selected={props.route.type==item.text} onClick={()=>{
                props.history.push(item.url)
            }}/>
        })} 
</div>
}