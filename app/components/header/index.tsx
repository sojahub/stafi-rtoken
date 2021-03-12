import React from 'react';
import {useSelector} from 'react-redux';
import logo from '@images/header_logo.png';
import notice from '@images/notice.svg';
import StringUtil from '@util/stringUtil'
import Popover from './popover';
import './index.scss';

type Props={
    route:any,
    history:any
}
export default function Index(props:Props){
    const account=useSelector((state:any)=>{  
        if(props.route.type=="rDOT"){
           
            if(state.rDOTModule.dotAccount && state.FISModule.fisAccount){
                return {
                    dotAccount:state.rDOTModule.dotAccount,
                    fisAccount:state.FISModule.fisAccount,
                }
            } 
        }
        return null
    })

    return <div className="stafi_header">
        <img className="header_logo" src={logo} />
        {account==null && <div className="header_tool">
            Connect to Polkadotjs
        </div>}
        {account && <div className="header_tools">
            <div className="header_tool notice new">
                
                <Popover>
                <img src={notice} />
                </Popover>
            </div> 
            {account.fisAccount && <div onClick={()=>{
               
                props.history.push( {
                    pathname:"/rDOT/fiswallet",
                    state:{
                        form:"header", 
                    }
                })
            }} className="header_tool account fis">
                <div>{account.fisAccount.balance} FIS</div>
                <div>{StringUtil.replacePkh(account.fisAccount.address,6,44)}</div>
            </div>}
            {account.dotAccount && <div onClick={()=>{
                 props.history.push({
                    pathname:"/rDOT/wallet",
                    state:{
                        form:"header", 
                    }
                })
            }} className="header_tool account">
                <div>{account.dotAccount.balance} DOT</div>
                <div>{StringUtil.replacePkh(account.dotAccount.address,6,44)}</div>
            </div>} 
            
        </div>}
    </div>
}