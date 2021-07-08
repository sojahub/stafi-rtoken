import React, { useState,useEffect } from 'react';
import Item from './item';
import rETH_svg from '@images/r_eth.svg';
import selected_rETH_svg from '@images/selected_r_eth.svg';
import rFIS_svg from '@images/r_fis.svg';
import selected_rFIS_svg from '@images/selected_r_fis.svg';
import rDOT_svg from '@images/r_dot.svg';
import selected_rDOT_svg from '@images/selected_r_dot.svg';
import logo from '@images/logo2.png';
import rAsset_svg from '@images/rAsset.svg';
import selected_rAsset_svg from '@images/selected_rAssets.svg';
import rKSM_svg from '@images/r_ksm.svg';
import selected_rKSM_svg from '@images/selected_r_ksm.svg'
import rATOM_svg from '@images/r_atom.svg';
import selected_rATOM_svg from '@images/selected_r_atom.svg'
import rMatic_svg from '@images/r_matic.svg';
import selected_rMatic_svg from '@images/selected_r_matic.svg'
import rPool_svg from '@images/r_pool.svg';
import selected_rPool_svg from '@images/selected_r_pool.svg'
import {isdev} from '../../config/index'

import './index.scss'

const siderData=[
    {
        icon:rAsset_svg,
        selectedIcon:selected_rAsset_svg,
        text:"rAsset", 
        urlKeywords:'/rAsset',
        url:"/rAsset/native"
    },{
        icon:rPool_svg,
        selectedIcon:selected_rPool_svg,
        text:"rPool", 
        urlKeywords:'/rPool',
        url:"/rPool/home"
    },
    {
        icon:rETH_svg,
        selectedIcon:selected_rETH_svg,
        text:"rETH", 
        urlKeywords:'/rETH',
        // url:"https://rtoken.stafi.io/reth"
        url:"/rETH/home"
    },
    {
        icon:rFIS_svg,
        selectedIcon:selected_rFIS_svg,
        text:"rFIS", 
        urlKeywords:'/rFIS',
        url:"https://rtoken.stafi.io/rfis"
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
    },
    {
        icon:rATOM_svg,
        selectedIcon:selected_rATOM_svg,
        text:"rATOM", 
        urlKeywords:'/rATOM',
        url:"/rATOM/home"
    },
    {
        icon:rMatic_svg,
        selectedIcon:selected_rMatic_svg,
        text:"rMATIC", 
        urlKeywords:'/rMATIC',
        url:"/rMATIC/home"
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
                selectedIcon={item.selectedIcon} 
                text={item.text} 
                url={item.url}
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