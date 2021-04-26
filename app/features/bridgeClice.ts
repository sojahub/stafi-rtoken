import { createSlice } from '@reduxjs/toolkit';  
import BridgeServer from '@servers/bridge';
import Stafi from '@servers/stafi/index'
import { AppThunk } from '../store';
import NumberUtil from '@util/numberUtil';
import StafiServer from '@servers/stafi';
import EthServer from '@servers/eth'; 
import KsmServer from '@servers/ksm'
import DotServer from '@servers/polkadot'
import keyring from '@servers/index';
import CommonClice from './commonClice'
import {  u8aToHex } from '@polkadot/util';
import {setLoading} from './globalClice'
import { message } from 'antd';
import {
    web3Enable,
    web3FromSource,
  } from '@polkadot/extension-dapp'; 
  import {stafi_uuid} from '@util/common'
  import {findUuid,noticesubType,noticeStatus,add_Notice,noticeType} from './noticeClice';

const STAFI_CHAIN_ID = 1;
const ETH_CHAIN_ID = 2;
const bridgeServer=new BridgeServer(); 
const stafiServer = new StafiServer();
const ethServer=new EthServer();
const ksmServer=new KsmServer();
const dotServer=new DotServer();
const bridgeClice = createSlice({
  name: 'bridgeModule',
  initialState: {  
    erc20EstimateFee:"--",
    estimateEthFee:"--"
  },
  reducers: {  
    setErc20EstimateFee(state,{payload}){
        state.erc20EstimateFee=payload;
    },
    setEstimateEthFee(state,{payload}){
        state.estimateEthFee=payload;
    }
  },
});

 
export const {
    setErc20EstimateFee,
    setEstimateEthFee
}=bridgeClice.actions


//Native to ERC20
export const bridgeCommon_ChainFees=():AppThunk=>async (dispatch,getState)=>{
    try{  
        const stafiServer = new Stafi();
        const api =await  stafiServer.createStafiApi() 
        const result = await  api.query.bridgeCommon.chainFees(ETH_CHAIN_ID);
        if (result.toJSON()) {
            let estimateFee = NumberUtil.fisAmountToHuman(result.toJSON()); 
            dispatch(setErc20EstimateFee(NumberUtil.handleFisAmountToFixed(estimateFee)))
        }
    }catch(e){
            
    }   
}
//ERC20 to Native
export const getBridgeEstimateEthFee=():AppThunk=>async (dispatch,getState)=>{
    dispatch(setEstimateEthFee(bridgeServer.getBridgeEstimateEthFee())) 
}
 
export const nativeToErc20Swap=(tokenStr:string,tokenType:string, tokenAmount:any, ethAddress:string, cb?:Function):AppThunk=>async (dispatch,getState)=>{
    try {
        dispatch(setLoading(true));
        web3Enable(stafiServer.getWeb3EnalbeName());
        const injector:any=await web3FromSource(stafiServer.getPolkadotJsSource())
        const api=await stafiServer.createStafiApi();
        let currentAccount = getState().FISModule.fisAccount.address;
        let tx:any = '';
        if (tokenType == 'fis') {
            const amount = NumberUtil.tokenAmountToChain(tokenAmount.toString());
            tx = await api.tx.bridgeSwap.transferNative(amount.toString(), ethAddress, ETH_CHAIN_ID);
        } else {
            let rsymbol = bridgeServer.getRsymbolByTokenType(tokenType);
            const amount = NumberUtil.tokenAmountToChain(tokenAmount.toString(), rsymbol);
            tx = await api.tx.bridgeSwap.transferRtoken(rsymbol, amount.toString(), ethAddress, ETH_CHAIN_ID);
        } 
        if (!tx) {
            dispatch(setLoading(false));
            return;
        } 
        
        tx.signAndSend(currentAccount, { signer: injector.signer }, (result:any) => {
        
            if (result.status.isInBlock) {

                result.events
                .filter((obj:any) => obj.event.section === 'system')
                .forEach(({ event: { data, method } }:any) => {
                    if (method === 'ExtrinsicFailed') {
                        const [dispatchError] = data
                        if (dispatchError.isModule) {
                            try {
                                const mod = dispatchError.asModule;
                                const error = data.registry.findMetaError(new Uint8Array([mod.index.toNumber(), mod.error.toNumber()]));
                                let message_str = 'Something is wrong, please make sure you have enough FIS balance';
                                if (tokenType == 'rfis') {
                                    message_str = 'Something is wrong, please make sure you have enough FIS and rFIS balance';
                                } else if (tokenType == 'rdot') {
                                    message_str = 'Something is wrong, please make sure you have enough FIS and rDOT balance';
                                } else if (tokenType == 'rksm') {
                                    message_str = 'Something is wrong, please make sure you have enough FIS and rKSM balance';
                                } else if (tokenType == 'ratom') {
                                    message_str = 'Something is wrong, please make sure you have enough FIS and rATOM balance';
                                }
                                if (error.name == 'ServicePaused') {
                                    message_str = 'Service is paused, please try again later!'; 
                                }
                                dispatch(setLoading(false));
                                message.error(message_str); 
                                dispatch(add_Swap_Notice(tokenStr,tokenAmount,noticeStatus.Error,{swapType:"native"}))
                            } catch (error) {
                                dispatch(setLoading(false));
                                message.error(error.message);  
                                dispatch(add_Swap_Notice(tokenStr,tokenAmount,noticeStatus.Error,{swapType:"native"}))
                            }
                        }
                    } else if (method === 'ExtrinsicSuccess') {
                        dispatch(setLoading(false));
                        console.log("=======asdfasdfasdfa")
                        dispatch(add_Swap_Notice(tokenStr,tokenAmount,noticeStatus.Confirmed,{swapType:"native"}))
                        cb && cb() 
                    }
                });
            } else if (result.isError) {
                dispatch(setLoading(false));
                message.error(result.toHuman()); 
                dispatch(add_Swap_Notice(tokenStr,tokenAmount,noticeStatus.Error,{swapType:"native"}));
            } 
        }).catch((error:any) => {
            dispatch(setLoading(false));
            message.error(error.message); 
            dispatch(add_Swap_Notice(tokenStr,tokenAmount,noticeStatus.Error,{swapType:"native"}))
        });
    } catch (error) {
        dispatch(setLoading(false));
        message.error(error.message); 
        dispatch(add_Swap_Notice(tokenStr,tokenAmount,noticeStatus.Error,{swapType:"native"}))
    }

}

export const erc20ToNativeSwap=(tokenStr:string,tokenType:string, tokenAmount:any, stafiAddress:string, cb?:Function):AppThunk=>async (dispatch,getState)=>{
  dispatch(setLoading(true));
  let web3 = ethServer.getWeb3();
  
  let tokenContract:any = ''; 
  let allowance:any = 0;
  const ethAddress=getState().rETHModule.ethAccount.address
  if (tokenType == 'fis') { 
    tokenContract = new web3.eth.Contract(stafiServer.getFISTokenAbi(), stafiServer.getFISTokenAddress(), {
      from: ethAddress
    });
    allowance = getState().ETHModule.FISErc20Allowance
  } else if (tokenType == 'rfis') { 
    tokenContract = new web3.eth.Contract(stafiServer.getRFISTokenAbi(), stafiServer.getRFISTokenAddress(), {
      from: ethAddress
    });
    allowance = getState().ETHModule.RFISErc20Allowance
  } else if (tokenType == 'rksm') { 
    tokenContract = new web3.eth.Contract(ksmServer.getRKSMTokenAbi(), ksmServer.getRKSMTokenAddress(), {
      from: ethAddress
    });
    allowance = getState().ETHModule.RKSMErc20Allowance
  } else if (tokenType == 'rdot') { 
    tokenContract = new web3.eth.Contract(dotServer.getRDOTTokenAbi(), dotServer.getRDOTTokenAddress(), {
      from: ethAddress
    });
    allowance = getState().ETHModule.RDOTErc20Allowance
  }
  if (!tokenContract) {
    dispatch(setLoading(false));
    return;
  }

  const amount = web3.utils.toWei(tokenAmount.toString());
  try { 
    if (allowance < amount) { 
        const approveResult = await tokenContract.methods.approve(bridgeServer.getBridgeErc20HandlerAddress(), web3.utils.toWei('10000000')).send();
        if (approveResult && approveResult.status) {
            let bridgeContract = new web3.eth.Contract(bridgeServer.getBridgeAbi(), bridgeServer.getBridgeAddress(), {
                from: ethAddress
            });
            const sendAmount = web3.utils.toWei(getState().bridgeModule.estimateEthFee);

            let amountHex = web3.eth.abi.encodeParameter('uint256', amount);
            let lenHex = web3.eth.abi.encodeParameter('uint256', '32');
            const keyringInstance = keyring.init('fis');
            let rAddressHex = u8aToHex(keyringInstance.decodeAddress(stafiAddress));

            let data = amountHex + lenHex.slice(2) + rAddressHex.slice(2);
            
            const result=await  bridgeContract.methods.deposit(STAFI_CHAIN_ID, bridgeServer.getResourceId(tokenType), data).send({value: sendAmount})


            if (result && result.status) {
                dispatch(add_Swap_Notice(tokenStr,tokenAmount,noticeStatus.Confirmed,{swapType:"erc20"}))
                cb && cb(); 
            } else {
                message.error('Error! Please try again'); 
                dispatch(add_Swap_Notice(tokenStr,tokenAmount,noticeStatus.Error,{swapType:"erc20"}))
            } 
        } else {
            message.error('Error! Please try again'); 
            dispatch(add_Swap_Notice(tokenStr,tokenAmount,noticeStatus.Error,{swapType:"erc20"}))
        }   
    } else {
        let bridgeContract = new web3.eth.Contract(bridgeServer.getBridgeAbi(), bridgeServer.getBridgeAddress(), {
            from: ethAddress
        });
        const sendAmount = web3.utils.toWei(getState().bridgeModule.estimateEthFee);

        let amountHex = web3.eth.abi.encodeParameter('uint256', amount);
        let lenHex = web3.eth.abi.encodeParameter('uint256', '32');
        const keyringInstance = keyring.init('fis');
        let rAddressHex = u8aToHex(keyringInstance.decodeAddress(stafiAddress));

        let data = amountHex + lenHex.slice(2) + rAddressHex.slice(2);
        
        const result=await bridgeContract.methods.deposit(STAFI_CHAIN_ID, bridgeServer.getResourceId(tokenType), data).send({value: sendAmount}) 

            if (result && result.status) {
                dispatch(add_Swap_Notice(tokenStr,tokenAmount,noticeStatus.Confirmed,{swapType:"erc20"}))
                cb && cb();  
            } else {
                message.error('Error! Please try again') 
                dispatch(add_Swap_Notice(tokenStr,tokenAmount,noticeStatus.Error,{swapType:"erc20"}))
            } 
    }
    } catch (error) {
        message.error(error.message)  
        dispatch(add_Swap_Notice(tokenStr,tokenAmount,noticeStatus.Error,{swapType:"erc20"}))
    }
    dispatch(setLoading(false));
}
const add_Swap_Notice=(token:string,amount:string,status:string,subData:any):AppThunk=>async (dispatch,getState)=>{
 // dispatch(add_KSM_Notice(uuid,noticeType.Staker,noticesubType.Swap,amount,status,subData))
    console.log("======asdf")
    dispatch(add_Notice(stafi_uuid(),token,noticeType.Staker,noticesubType.Swap,amount,status,subData))
  } 

export default bridgeClice.reducer;