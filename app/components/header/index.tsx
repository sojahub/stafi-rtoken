import React from 'react';
import {useSelector,useDispatch} from 'react-redux';

import notice from '@images/notice.svg';
import StringUtil from '@util/stringUtil';
import Popover from './popover';
import {connectPolkadot} from '@features/globalClice'
import './index.scss';

type Props={
    route:any,
    history:any
}
export default function Index(props:Props){
    const dispatch =useDispatch()
    const account=useSelector((state:any)=>{  
        if(location.pathname.includes("/rDOT")){
           
            if(state.rDOTModule.dotAccount && state.FISModule.fisAccount){
                return {
                    dotAccount:state.rDOTModule.dotAccount,
                    fisAccount:state.FISModule.fisAccount,
                    noticeData:state.noticeModule.noticeData,
                }
            } 
        }
        return null
    })
    const {noticeData}=useSelector((state:any)=>{  
        return { 
            noticeData:state.noticeModule.noticeData,
        }
    })
    return <div className="stafi_header">
       <div></div>
        {account==null && <div className="header_tool" onClick={()=>{
            dispatch(connectPolkadot(()=>{
                props.history.push("/rDOT/wallet")
              })) 
        }}>
            Connect to Polkadotjs
        </div>}
        {account && <div className="header_tools">
            <div className={`header_tool notice ${(noticeData && noticeData.showNew) && "new"}`}>
                <Popover history={props.history}>
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