import React from 'react';
import WalletCard from '@components/card/walletCard'
import './index.scss';

export default function Index(props:any){
    console.log(props)
    return <WalletCard onConfirm={()=>{
        props.history.push("/rDOT/stake")
    }}/>
}