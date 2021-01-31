import React, { useState } from 'react';
import Item from './item';
import rETH_svg from '@images/rETH.svg';
import selected_rETH_svg from '@images/selected_rETH.svg';
import rFIS_svg from '@images/rFIS.svg';
import selected_rFIS_svg from '@images/selected_rFIS.svg';
import rDOT_svg from '@images/rDOT.svg';
import selected_rDOT_svg from '@images/selected_rDOT.svg';
import './index.scss'

const siderData=[
    {
        icon:rETH_svg,
        selectedIcon:selected_rETH_svg,
        text:"rETH", 
    },
    {
        icon:rFIS_svg,
        selectedIcon:selected_rFIS_svg,
        text:"rFIS", 
    },
    {
        icon:rDOT_svg,
        selectedIcon:selected_rDOT_svg,
        text:"rDOT", 
    }
]

export default function Index(){
    const [selectIndex,setSelectIndex]=useState(0);
    return <div className="stafi_left_sider">
        {siderData.map((item,i)=>{
            return <Item key={item.text} icon={item.icon} selectedIcon={item.selectedIcon} text={item.text} selected={selectIndex==i} onClick={()=>{
                setSelectIndex(i)
            }}/>
        })} 
</div>
}