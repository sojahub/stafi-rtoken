import React,{useState} from 'react';
import {useSelector} from 'react-redux'
import WalletCard from '@components/card/walletCard'
import Item from '@components/card/walletCardItem'
import './index.scss';

export default function Index(props:any){
    const [address,setAddress]=useState("");
    const accounts = useSelector((state:any)=>{
        return state.rDOTModule.accounts;
    })
    return <WalletCard onConfirm={()=>{
        props.history.push("/rDOT/type")
    }}>

    {accounts.map((item:any)=>{
        return <Item data={item} key={item.address} selected={item.address==address} onClick={()=>{
        setAddress(item.address);
        }}/>
    })}  
    </WalletCard>
}