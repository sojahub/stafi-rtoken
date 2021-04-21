import { createSlice } from '@reduxjs/toolkit';  
import BridgeServer from '@servers/bridge';
import Stafi from '@servers/stafi/index'
import { AppThunk, RootState } from '../store';
import NumberUtil from '@util/numberUtil';
import StafiServer from '@servers/stafi';
import EthServer from '@servers/eth'; 
import KsmServer from '@servers/ksm'
import toolUtil from '@util/toolUtil'
import keyring from '@servers/index';
import CommonClice from './commonClice'
import {  u8aToHex } from '@polkadot/util';
import { message } from 'antd';
import {
    web3Enable,
    web3FromSource,
  } from '@polkadot/extension-dapp';
import { countBy } from 'lodash';

const bridgeServer=new BridgeServer(); 
const stafiServer = new StafiServer();
const ethServer=new EthServer();
const ksmServer=new KsmServer();
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
        const STAFI_CHAIN_ID = 1;
        const ETH_CHAIN_ID = 2;
        const stafiServer = new Stafi();
        const api =await  stafiServer.createStafiApi() 
        const result = await  api.query.bridgeCommon.chainFees(ETH_CHAIN_ID);
        if (result.toJSON()) {
            let estimateFee = NumberUtil.fisAmountToHuman(result.toJSON()); 
            dispatch(setErc20EstimateFee(NumberUtil.handleFisAmountToFixed(estimateFee)))
        }
    }catch(e:any){
            
    }   
}
//ERC20 to Native
export const getBridgeEstimateEthFee=():AppThunk=>async (dispatch,getState)=>{
    dispatch(setEstimateEthFee(bridgeServer.getBridgeEstimateEthFee())) 
}
 
export const nativeToErc20Swap=(tokenType:string,amount:any,ethAddress:string,cb?:Function):AppThunk=>async (dispatch,getState)=>{
    try {
        const STAFI_CHAIN_ID = 1;
        const ETH_CHAIN_ID = 2;
        
        web3Enable(stafiServer.getWeb3EnalbeName());
        const injector:any=web3FromSource(stafiServer.getPolkadotJsSource())
        const api=stafiServer.createStafiApi();
        let currentAccount = getState().FISModule.fisAccount.address;
        let tx:any = '';
        let symbolName:string = '';
        if (tokenType == 'FIS'){
            symbolName="FIS";
            tx = api.tx.bridgeSwap.transferNative(amount.toString(), ethAddress, ETH_CHAIN_ID);
            // toolUtil
        }else {
            symbolName = tokenType;
            tx = api.tx.bridgeSwap.transferRtoken(tokenType, amount.toString(), ethAddress, ETH_CHAIN_ID);
        } 
        if (!tx) {
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
                        if (tokenType == 'rFIS') {
                            message_str = 'Something is wrong, please make sure you have enough FIS and rFIS balance';
                        }
                        if (error.name == 'ServicePaused') {
                            message_str = 'Service is paused, please try again later!'; 
                        }
                        
                        message.error(message);
                        } catch (error) {
                            message.error(error.message); 
                        }
                    }
                    } else if (method === 'ExtrinsicSuccess') {

                    cb && cb() 
                    }
                });
            } else if (result.isError) {
                message.error(result.toHuman()) 
            }

        }).catch((error:any) => {
            message.error(error.message)  
        });
    } catch (error) {
        message.error(error.message)  
    }

}

export const erc20ToNativeSwap=(tokenType:string,symbol:string,tokenAmount:any,stafiAddress:string,cb?:Function):AppThunk=>async (dispatch,getState)=>{
  let web3 = ethServer.getWeb3();
  const STAFI_CHAIN_ID = 1;
  const ETH_CHAIN_ID = 2;
  let tokenContract:any = '';
  let symbolName = tokenType;
  let allowance:any = 0;
  const ethAddress=getState().rETHModule.ethAccount.address
  if (tokenType == 'FIS') { 
    tokenContract = new web3.eth.Contract(stafiServer.getFISTokenAbi(), stafiServer.getFISTokenAddress(), {
      from: ethAddress
    });
    allowance = getState().FISModule.erc20Allowance
  } else if (tokenType == 'rFIS') { 
    tokenContract = new web3.eth.Contract(stafiServer.getRFISTokenAbi(), stafiServer.getRFISTokenAddress(), {
      from: ethAddress
    });
    allowance = getState().FISModule.rFISErc20Allowance
  } else if (tokenType == 'rKSM') { 
    tokenContract = new web3.eth.Contract(ksmServer.getRKSMTokenAbi(), ksmServer.getRKSMTokenAddress(), {
      from: ethAddress
    });
    allowance = getState().rKSMModule.erc20Allowance
  }
  if (!tokenContract) {
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
        
        const result=await  bridgeContract.methods.deposit(STAFI_CHAIN_ID, bridgeServer.getResourceId(symbol), data).send({value: sendAmount})


            if (result && result.status) {
                cb && cb();
            //   this.dialogData2 = {
            //     icon: require('../assets/broadcast.png'),
            //     lTitle: 'Tx Broadcasting',
            //     content: 'Tx is broadcasting, please check your ' + symbolName + ' balance later. It may take 2~10 minutes',
            //     type: 2,
            //     rightBtnText: 'Understood'
            //   };
            //   this.dialogVisible2 = true;

            } else {
                message.error('Error! Please try again'); 
            } 
        } else {
            message.error('Error! Please try again'); 
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
        
        const result=await bridgeContract.methods.deposit(STAFI_CHAIN_ID, bridgeServer.getResourceId(symbol), data).send({value: sendAmount}) 

            if (result && result.status) {
                cb && cb();
            //   this.dialogData2 = {
            //     icon: require('../assets/broadcast.png'),
            //     lTitle: 'Tx Broadcasting',
            //     content: 'Tx is broadcasting, please check your ' + symbolName + ' balance later. It may take 2~10 minutes',
            //     type: 2,
            //     rightBtnText: 'Understood'
            //   };
            //   this.dialogVisible2 = true;

            } else {
                message.error('Error! Please try again') 
            } 
    }
    } catch (error) {
        message.error(error.message)  
    }
}


export default bridgeClice.reducer;