import React,{useState,useEffect} from 'react';
import {useSelector,useDispatch} from 'react-redux'
import WalletCard from '@components/card/walletCard'
import Item from '@components/card/walletCardItem';
import {setFisAccount} from '@features/FISClice';
import {connectPolkadotjs} from '@features/globalClice';
import {Symbol} from '@keyring/defaults'
import {message} from 'antd';
import './index.scss';

export default function Index(props:any){
    
    const dispatch=useDispatch(); 
    const {fisAccounts,fisAccount} = useSelector((state:any)=>{ 
        return {
            fisAccounts:state.FISModule.fisAccounts,
            fisAccount:state.FISModule.fisAccount || {}
        }
    })
   
    return <WalletCard 
        title="Select a FIS wallet"
        btnText="Confirm"
        onConfirm={()=>{
            if(fisAccount.address){
                props.history.push("/rDOT/type");
            }else{
                message.error("Please select the FIS wallet");
            }
        }}>

    {fisAccounts.map((item:any)=>{
        return <Item data={item} key={item.address} type="FIS" selected={item.address==fisAccount.address} onClick={()=>{
            dispatch(setFisAccount(item)) 
        }}/>
    })}  
    </WalletCard>
}