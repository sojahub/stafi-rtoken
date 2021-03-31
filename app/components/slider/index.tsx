import React, { useState,useEffect } from 'react';
import Item from './item';
import rETH_svg from '@images/rETH.svg';
import selected_rETH_svg from '@images/selected_rETH.svg';
import rFIS_svg from '@images/rFIS.svg';
import selected_rFIS_svg from '@images/selected_rFIS.svg';
import rDOT_svg from '@images/rDOT.svg';
import selected_rDOT_svg from '@images/selected_rDOT.svg';
import logo from '@images/logo2.png';
import rAsset_svg from '@images/rAsset.svg';
import selected_rAsset_svg from '@images/selected_rAssets.svg';
import rKSM_svg from '@images/rKSM.svg';
import selected_rKSM_svg from '@images/selected_rKSM.svg'
import {isdev} from '../../config/index'

import './index.scss'

const siderData=[
    {
        icon:rAsset_svg,
        selectedIcon:selected_rAsset_svg,
        text:"rAsset", 
        urlKeywords:'/rAsset',
        url:"/rAsset/native"
    },
    {
        icon:rETH_svg,
        selectedIcon:selected_rETH_svg,
        text:"rETH", 
        urlKeywords:'/rETH',
        url:""
    },
    {
        icon:rFIS_svg,
        selectedIcon:selected_rFIS_svg,
        text:"rFIS", 
        urlKeywords:'/rFIS',
        url:""
    },
    {
        icon:rDOT_svg,
        selectedIcon:selected_rDOT_svg,
        text:"rDOT", 
        urlKeywords:'/rDOT',
        url:"/rDOT/home"
    },
    {
        icon:rKSM_svg,
        selectedIcon:selected_rKSM_svg,
        text:"rKSM", 
        urlKeywords:'/rKSM',
        url:"/rKSM/home"
    }
]
type Props={
    route:any,
    history:any
}
export default function Index(props:Props){
    // const [selectIndex,setSelectIndex]=useState(0);
    return <div className="stafi_left_master_sider">
         <div className="logo_panel">
             <img className="header_logo" src={logo} /> 
         </div>
        <div className="stafi_left_sider">
            {siderData.map((item,i)=>{
                return <Item key={item.text} icon={item.icon} 
                selectedIcon={item.selectedIcon} text={item.text} 
                selected={location.pathname.includes(item.urlKeywords)} onClick={()=>{
                    props.history.push(item.url)
                }}/>
            })} 
        </div>
        <div className="network">
           <div></div> {isdev()?"Testnet":"Mainnet"}
        </div>
</div>
}