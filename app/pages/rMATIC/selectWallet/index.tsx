import React,{useState,useEffect, useMemo} from 'react';
import {useSelector,useDispatch} from 'react-redux'
import WalletCard from '@components/card/walletCard'
import Item from '@components/card/walletCardItem';
import {setAtomAccount} from '@features/rATOMClice'; 
import {getLocalStorageItem,Keys} from '@util/common';
import {connectPolkadotjs} from '@features/globalClice';  
import {continueProcess,getPools} from '@features/rATOMClice'
import {Symbol} from '@keyring/defaults'
import {message,Modal} from 'antd'
import './index.scss';

export default function Index(props:any){
    const dispatch=useDispatch(); 
    const {atomAccounts,atomAccount} = useSelector((state:any)=>{  
        return {
            atomAccounts:state.rATOMModule.atomAccounts,
            atomAccount:state.rATOMModule.atomAccount || {}
        }
    })
    const [account,setAccount]=useState<any>();

    useEffect(()=>{
        if(atomAccount && !atomAccount.address && atomAccounts.length>0){
        //    dispatch(setDotAccount(dotAccounts[0]));
           setAccount(atomAccounts[0])
        }else{
           setAccount(atomAccount)
        }
    },[atomAccounts]) 


    useEffect(()=>{
        if(getLocalStorageItem(Keys.AtomAccountKey)==null && getLocalStorageItem(Keys.FisAccountKey)){
            dispatch(connectPolkadotjs(Symbol.Atom));  
            // dispatch(getPools(()=>{
            //     setTimeout(()=>{
            //       dispatch(continueProcess());
            //     },20)
            //   }));
        }
    },[])

    return <WalletCard
    title="Select a ATOM wallet"
    btnText={(props.type=="header" || getLocalStorageItem(Keys.FisAccountKey))?"Confirm":"Next"}
    history={props.history}
    form={props.type}
    onCancel={()=>{
        props.onClose && props.onClose()
    }} 
    onConfirm={()=>{
        if(account.address){
            dispatch(setAtomAccount(account));
            if(props.onClose){
                props.onClose();
            }else{ 
                if(getLocalStorageItem(Keys.FisAccountKey)){
                    props.history.push("/rATOM/type");
                }else{
                    props.history.push({
                        pathname:"/rATOM/fiswallet",
                        state:{
                            showBackIcon:true, 
                        }
                    }); 
                }
            }
        }else{
            message.error("Please select the ATOM wallet");
        }
    }}>

    {atomAccounts.map((item:any)=>{
        return <Item data={item} type="ATOM" key={item.address} selected={account ? (item.address==account.address) : false} onClick={()=>{
            setAccount(item)
        }}/>
    })}  
    </WalletCard>
}