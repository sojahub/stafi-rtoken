import React,{useState,useEffect, useMemo} from 'react';
import {useSelector,useDispatch} from 'react-redux'
import WalletCard from '@components/card/walletCard'
import Item from '@components/card/walletCardItem';
import {setDotAccount} from '@features/rDOTClice'; 
import {message,Modal} from 'antd'
import './index.scss';

export default function Index(props:any){
    const dispatch=useDispatch(); 
    const {dotAccounts,dotAccount} = useSelector((state:any)=>{ 
        return {
            dotAccounts:state.rDOTModule.dotAccounts,
            dotAccount:state.rDOTModule.dotAccount || {}
        }
    })
    const [account,setAccount]=useState<any>();

    useEffect(()=>{
        if(dotAccount && !dotAccount.address && dotAccounts.length>0){
        //    dispatch(setDotAccount(dotAccounts[0]));
           setAccount(dotAccounts[0])
        }else{
           setAccount(dotAccount)
        }
    },[dotAccounts]) 

    const {showBackIcon,form}=useMemo(()=>{
        props.location.state && props.location.state.showBackIcon
        return {
            showBackIcon:props.location.state ?props.location.state.showBackIcon:false,
            form:props.location.state && props.location.state.form
        }
    },[props.location.state])
    return <WalletCard
    title="Select a DOT wallet"
    btnText={props.type=="header"?"Confirm":"Next"}
    history={props.history}
    form={props.type}
    onCancel={()=>{
        props.onClose && props.onClose()
    }}
    onConfirm={()=>{
        if(account.address){
            dispatch(setDotAccount(account));
            props.onClose?props.onClose(): props.history.push({
                pathname:"/rDOT/fiswallet",
                state:{
                    showBackIcon:true, 
                }
            }); 
        }else{
            message.error("Please select the DOT wallet");
        }
    }}>

    {dotAccounts.map((item:any)=>{
        return <Item data={item} type="DOT" key={item.address} selected={account ? (item.address==account.address) : false} onClick={()=>{
            setAccount(item)
        }}/>
    })}  
    </WalletCard>
}