import React,{useState,useEffect, useMemo} from 'react';
import {useSelector,useDispatch} from 'react-redux'
import WalletCard from '@components/card/walletCard'
import Item from '@components/card/walletCardItem';
import {setKsmAccount} from '@features/rKSMClice'; 
import {rSymbol} from '@keyring/defaults'
import {message,Modal} from 'antd'
import './index.scss';

export default function Index(props:any){
    const dispatch=useDispatch(); 
    const {ksmAccounts,ksmAccount} = useSelector((state:any)=>{ 
        return {
            ksmAccounts:state.rKSMModule.ksmAccounts,
            ksmAccount:state.rKSMModule.ksmAccount || {}
        }
    })
    const [account,setAccount]=useState<any>();

    useEffect(()=>{
        if(ksmAccount && !ksmAccount.address && ksmAccounts.length>0){
        //    dispatch(setDotAccount(dotAccounts[0]));
           setAccount(ksmAccounts[0])
        }else{
           setAccount(ksmAccount)
        }
    },[ksmAccounts]) 

    return <WalletCard
    title="Select a KSM wallet"
    btnText={props.type=="header"?"Confirm":"Next"}
    history={props.history}
    form={props.type}
    onCancel={()=>{
        props.onClose && props.onClose()
    }} 
    onConfirm={()=>{
        if(account.address){
            dispatch(setKsmAccount(account));
            props.onClose?props.onClose(): props.history.push({
                pathname:"/rKSM/fiswallet",
                state:{
                    showBackIcon:true, 
                }
            }); 
        }else{
            message.error("Please select the KSM wallet");
        }
    }}>

    {ksmAccounts.map((item:any)=>{
        return <Item data={item} type="KSM" key={item.address} selected={account ? (item.address==account.address) : false} onClick={()=>{
            setAccount(item)
        }}/>
    })}  
    </WalletCard>
}