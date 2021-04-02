import { createSlice } from '@reduxjs/toolkit';  
import {isdev} from '@config/index'
import { AppThunk, RootState } from '../store';
import { setLocalStorageItem, getLocalStorageItem, removeLocalStorageItem, Keys } from '@util/common';
import NumberUtil from '@util/numberUtil';
import Web3Utils from 'web3-utils';
import EthServer from '@servers/eth/index'
// import Web3 from 'web3';
import { message } from 'antd';


// const ethserver=new EthServer();
const rETHClice = createSlice({
  name: 'rETHModule',
  initialState: {  
    ethAccount:getLocalStorageItem(Keys.MetamaskAccountKey)
  },
  reducers: {  
     setEthAccount(state,{payload}){
       if(state.ethAccount && state.ethAccount.address==payload.address){ 
          state.ethAccount={...state.ethAccount,...payload} 
          setLocalStorageItem(Keys.MetamaskAccountKey, {address:payload.address})
       }else{
          state.ethAccount=payload;
          setLocalStorageItem(Keys.MetamaskAccountKey, {address:payload.address})
       }
     }
  },
});

export const {setEthAccount}=rETHClice.actions

declare const window: any;
declare const ethereum: any;

export const connectMetamask=():AppThunk=>async (dispatch,getState)=> {
  if (typeof window.ethereum !== 'undefined' && ethereum.isMetaMask) {
    ethereum.autoRefreshOnNetworkChange = false;
    
    ethereum.request({ method: 'eth_chainId' }).then((chainId:any) => {
      if (isdev()) {
        if (ethereum.chainId != '0x3') { 
          message.warning('Please connect to Ropsten Test Network!') 
          return;
        }
      } else if (ethereum.chainId != '0x1') { 
        message.warning('Please connect to Ethereum Main Network!') 
        return;
      }

      ethereum.request({ method: 'eth_requestAccounts' }).then((accounts:any) => { 
        dispatch(handleEthAccount(accounts[0]))
      }).catch((error:any) => {
        // 页面变成需要连接的状态 
        dispatch(setEthAccount(null))
        if (error.code === 4001) {
          message.error('Please connect to MetaMask.') 
        } else {
          message.error('error.message') 
        }
      }); 
    });
  } else { 
    message.warning('Please install MetaMask!');
  }
}


export const handleEthAccount=(address:string):AppThunk=>(dispatch,getState)=>{
    // 把当前账号保存至localstorage中
   
  dispatch(setEthAccount({address:address,balance:'--'}))
  ethereum.request({ method: 'eth_getBalance', params: [address, 'latest'] }).then((result:any) => {
    //const address = StringUtil.replacePkh(address, 4, 38);
    const balance = NumberUtil.handleEthAmountToFixed(Web3Utils.fromWei(result, 'ether'));
    dispatch(setEthAccount({address:address,balance:balance}))
  }).catch((error:any) => {
    dispatch(setEthAccount({address:address,balance:'--'}))
    message.error(error.message);
  });
}


export const monitoring_Method=():AppThunk=>(dispatch,getState)=> { 
  if (typeof window.ethereum !== 'undefined' && ethereum.isMetaMask) {
    ethereum.autoRefreshOnNetworkChange = false;

    ethereum.on('accountsChanged', (accounts:any) => {
      // this.ethAccount = accounts[0];
      if (accounts.length>0) { 
        dispatch(handleEthAccount(accounts[0]))
      } else {
        // 切换账号后，更新页面账号相关数据
        dispatch(handleEthAccount(null))
      }
    }); 

    ethereum.on('chainChanged', (chainId:any) => {
      if (isdev()) {
        if (ethereum.chainId != '0x3') {
          message.warning('Please connect to Ropsten Test Network!'); 
          // 页面变成需要连接的状态 
          dispatch(setEthAccount(null));
        }
      } else if (ethereum.chainId != '0x1') {
        message.warning('Please connect to Ethereum Main Network!');
        // 页面变成需要连接的状态
        dispatch(setEthAccount(null));
      }
    }); 
  }
}


 
// （4）查询rFIS余额
// let web3 = getWeb3();

// let rFISContract = new web3.eth.Contract(getRFISTokenAbi(), getRFISTokenAddress(), {
//     // 当前eth账号
// 	from: this.currentAddress
// });

// rFISContract.methods.balanceOf(this.currentAddress).call().then(balance => {
// 	let rFISBalance = web3.utils.fromWei(balance, 'ether');
// });

export const getAssetBalance=():AppThunk=>()=>{

}
export default rETHClice.reducer;