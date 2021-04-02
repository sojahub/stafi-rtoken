import React, { useState } from 'react';
import {useSelector,useDispatch} from 'react-redux';
import Modal from '@shared/components/modal/connectModal';
import notice from '@images/notice.svg';
import StringUtil from '@util/stringUtil';
import Popover from './popover';
import {connectPolkadot,connectPolkadot_ksm} from '@features/globalClice';
import Page from '../../pages/rDOT/selectWallet/index';
import Page_FIS from '../../pages/rDOT/selectWallet_rFIS/index'
import Page_Ksm from '../../pages/rKSM/selectWallet/index';
import {rSymbol} from '@keyring/defaults'
import Tool from '@util/toolUtil'
import './index.scss';

type Props={
    route:any,
    history:any
}
export default function Index(props:Props){
    const dispatch =useDispatch()
    const [visible,setVisible]=useState(false);
    const [modalType,setModalType]=useState<any>();
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
        if(location.pathname.includes("/rKSM")){ 
            if(state.rKSMModule.ksmAccount && state.FISModule.fisAccount){
                return {
                    ksmAccount:state.rKSMModule.ksmAccount,
                    fisAccount:state.FISModule.fisAccount,
                    noticeData:state.noticeModule.noticeData,
                }
            } 
        }
        if(location.pathname.includes("/rAsset")){
            if(location.pathname.includes("/rAsset/native")){
                if(state.FISModule.fisAccount){
                    return { 
                        fisAccount:state.FISModule.fisAccount,
                    }
                }
            }
            if(location.pathname.includes("/rAsset/erc")){
                if(state.rETHModule.ethAccount){
                    return { 
                        ethAccount:state.rETHModule.ethAccount,
                    }
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
        <Modal visible={visible}>
            {(modalType=="dot") && <Page location={{}} type="header"  onClose={()=>{
                setVisible(false);
            }}/>}
            {(modalType=="fis") && <Page_FIS location={{}} type="header"  onClose={()=>{
                setVisible(false);
            }}/>}
            {(modalType=="ksm") && <Page_Ksm location={{}} type="header"  onClose={()=>{
                setVisible(false);
            }}/>}
        </Modal>
       <div></div>
        {account==null && <div className="header_tool" onClick={()=>{
            if(Tool.pageType()==rSymbol.Dot){
                dispatch(connectPolkadot(()=>{
                props.history.push("/rDOT/wallet")
              })) 
            }
            if(Tool.pageType()==rSymbol.Ksm){
                dispatch(connectPolkadot_ksm(()=>{
                props.history.push("/rKSM/wallet")
              })) 
            }
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
                setModalType("fis");
               setVisible(true) 
            }} className="header_tool account fis">
                <div>{account.fisAccount.balance} FIS</div>
                <div>{StringUtil.replacePkh(account.fisAccount.address,6,44)}</div>
            </div>}
            {account.dotAccount && <div onClick={()=>{
                setModalType("dot");
                setVisible(true) 
            }} className="header_tool account">
                <div>{account.dotAccount.balance} DOT</div>
                <div>{StringUtil.replacePkh(account.dotAccount.address,6,44)}</div>
            </div>} 
            {account.ksmAccount && <div onClick={()=>{
                setModalType("ksm");
                setVisible(true) 
            }} className="header_tool account">
                <div>{account.ksmAccount.balance} KSM</div>
                <div>{StringUtil.replacePkh(account.ksmAccount.address,6,44)}</div>
            </div>} 
            {account.ethAccount && <div  className="header_tool account">
                <div>{account.ethAccount.balance} ETH</div>
                <div>{StringUtil.replacePkh(account.ethAccount.address,4,38)}</div>
            </div>}
            
        </div>}
    </div>
}