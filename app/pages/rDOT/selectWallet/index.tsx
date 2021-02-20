import React,{useState,useEffect} from 'react';
import {useSelector,useDispatch} from 'react-redux'
import WalletCard from '@components/card/walletCard'
import Item from '@components/card/walletCardItem';
import {setDotAccount} from '@features/rDOTClice';
import {connectPolkadotjs} from '@features/globalClice';
import {Symbol} from '@keyring/defaults'
import {message} from 'antd'
import './index.scss';

export default function Index(props:any){
    const dispatch=useDispatch(); 
    const {dotAccounts,dotAccount} = useSelector((state:any)=>{
        return {
            dotAccounts:state.rDOTModule.dotAccounts,
            dotAccount:state.rDOTModule.dotAccount || {}
        }
    })
    useEffect(()=>{
        dispatch(connectPolkadotjs(Symbol.Dot));  
    },[])
    return <WalletCard
    title="Select a DOT wallet"
    btnText="Next"
    onConfirm={()=>{
        if(dotAccount.address){
            props.history.push("/rDOT/fiswallet");
        }else{
            message.error("请选择DOT钱包");
        }
    }}>

    {dotAccounts.map((item:any)=>{
        return <Item data={item} key={item.address} selected={item.address==dotAccount.address} onClick={()=>{
            dispatch(setDotAccount(item)) 
        }}/>
    })}  
    </WalletCard>
}