import { createSlice } from '@reduxjs/toolkit';  
import {isdev} from '@config/index'
import { AppThunk, RootState } from '../store';
import { setLocalStorageItem, getLocalStorageItem, removeLocalStorageItem, Keys } from '@util/common';
import NumberUtil from '@util/numberUtil';
import Web3Utils from 'web3-utils';
import EthServer from '@servers/eth/index'; 
import { message } from 'antd';
import { keccakAsHex } from '@polkadot/util-crypto';  
import {getAssetBalanceAll} from './ETHClice'
import {setLoading} from './globalClice'

const ethServer=new EthServer();
const rETHClice = createSlice({
  name: 'rETHModule',
  initialState: {  
    ethAccount:getLocalStorageItem(Keys.MetamaskAccountKey),
    ratio:"--",
    balance:"--",
    minimumDeposit:"--",
    waitingStaked:"--",
    totalStakedAmount:"--",
    apr:"--",
    isPoolWaiting:true,
    poolCount:"--"
  },
  reducers: {  
     setEthAccount(state,{payload}){
       if(payload==null){
        state.ethAccount=payload;
        removeLocalStorageItem(Keys.MetamaskAccountKey);
       }else{
          if(state.ethAccount && state.ethAccount.address==payload.address){ 
              state.ethAccount={...state.ethAccount,...payload} 
              setLocalStorageItem(Keys.MetamaskAccountKey, {address:payload.address})
          }else{
              state.ethAccount=payload;
              setLocalStorageItem(Keys.MetamaskAccountKey, {address:payload.address})
          }
        }
     },
     setRatio(state,{payload}){
       state.ratio=payload;
     },
     setBalance(state,{payload}){
      state.balance=payload;
     },
     setMinimumDeposit(state,{payload}){
       state.minimumDeposit=payload
     },
     setWaitingStaked(state,{payload}){
       state.waitingStaked=payload
     },
     setTotalStakedAmount(state,{payload}){
       state.totalStakedAmount=payload
     },
     setApr(state,{payload}){
       state.apr=payload;
     },
     setIsPoolWaiting(state,{payload}){
      state.isPoolWaiting=payload;
     },
     setPoolCount(state,{payload}){
       state.poolCount=payload
     }
  },
});

export const {setEthAccount,
  setRatio,
  setBalance,
  setMinimumDeposit,
  setWaitingStaked,
  setTotalStakedAmount,
  setApr,
  setIsPoolWaiting,
  setPoolCount
}=rETHClice.actions

declare const window: any;
declare const ethereum: any;

export const connectMetamask=(chainId:string):AppThunk=>async (dispatch,getState)=> {
  if (typeof window.ethereum !== 'undefined' && ethereum.isMetaMask) {
    ethereum.autoRefreshOnNetworkChange = false;
    
    ethereum.request({ method: 'eth_chainId' }).then((chainId:any) => { 
      if (isdev()) {
        if (ethereum.chainId != chainId) { 
          if(chainId=="0x3"){
            message.warning('Please connect to Ropsten Test Network!') 
          }
          if(chainId=="0x5"){
            message.warning('Please connect to Goerli Test Network!') 
          }
          return;
        }
      } else if (ethereum.chainId != '0x1') { 
        message.warning('Please connect to Ethereum Main Network!') 
        return;
      }

      ethereum.request({ method: 'eth_requestAccounts' }).then((accounts:any) => { 
        dispatch(handleEthAccount(accounts[0])) 
      }).catch((error:any) => {
     
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
        dispatch(handleEthAccount(accounts[0]));
        setTimeout(()=>{
          dispatch(getAssetBalanceAll); 
        },20)
      } else {
   
        dispatch(handleEthAccount(null))
      }
    }); 

    ethereum.on('chainChanged', (chainId:any) => {
      if (isdev()) {
        if (ethereum.chainId != '0x3') {
          message.warning('Please connect to Ropsten Test Network!'); 
       
          dispatch(setEthAccount(null));
        }
      } else if (ethereum.chainId != '0x1') {
        message.warning('Please connect to Ethereum Main Network!');
        
        dispatch(setEthAccount(null));
      }
    }); 
  }
}

 
 

export const checkAddressChecksum=(address:string)=> {
  // Check each case
  address = address.replace(/^0x/i, '');
  var addressHash = keccakAsHex(address.toLowerCase()).substr(2);

  for (var i = 0; i < 40; i++) {
      // the nth letter should be uppercase if the nth digit of casemap is 1
    if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i])
      || (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
          return false;
      }
  }
  return true;
}

export const  checkEthAddress=(address:string)=> {
  // check if it has the basic requirements of an address
  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    return false;
    // If it's ALL lowercase or ALL upppercase
  } else if (/^(0x|0X)?[0-9a-f]{40}$/.test(address) || /^(0x|0X)?[0-9A-F]{40}$/.test(address)) {
    return true;
    // Otherwise check each case
  } else {
    return checkAddressChecksum(address);
  }
}


export const reloadData = ():AppThunk => async (dispatch,getState)=>{ 
  dispatch(rTokenRate());
  dispatch(get_eth_getBalance());
  dispatch(getMinimumDeposit());

  dispatch(getApr());
  dispatch(getNextCapacity());
}

export const rTokenRate=():AppThunk=>async (dispatch,getState)=>{
  let web3=ethServer.getWeb3(); 
  let contract = new web3.eth.Contract(ethServer.getRETHTokenAbi(),ethServer.getRETHTokenAddress());
  const amount = web3.utils.toWei('1');
  const result = await contract.methods.getEthValue(amount).call();
  let ratio = web3.utils.fromWei(result, 'ether');  
  dispatch(setRatio(NumberUtil.handleEthAmountRateToFixed(ratio)))
}

export const get_eth_getBalance=():AppThunk=>async  (dispatch,getState)=>{
  let web3=ethServer.getWeb3(); 
  const address=getState().rETHModule.ethAccount.address;
  const result = await ethereum.request({ method: 'eth_getBalance', params: [ address, 'latest'] })
  const balance = web3.utils.fromWei(result, 'ether'); 
  dispatch(setEthAccount({address:address,balance:'--'}))
  dispatch(setBalance(balance));
}
 

export const getMinimumDeposit=():AppThunk=>async (dispatch,getState)=>{
  let web3=ethServer.getWeb3(); 
  const address=getState().rETHModule.ethAccount.address; 
  let userDepositContract = new web3.eth.Contract(ethServer.getStafiUserDepositAbi(), ethServer.getStafiUserDepositAddress(), {
    from: address
  });
   const result=await userDepositContract.methods.getMinimumDeposit().call()
   const minimumDeposit=web3.utils.fromWei(result, 'ether'); 
   dispatch(setMinimumDeposit(minimumDeposit))
}


export const getNextCapacity=():AppThunk=>async (dispatch,getState)=>{
  let web3=ethServer.getWeb3(); 
  const address=getState().rETHModule.ethAccount.address;
  let poolQueueContract = new web3.eth.Contract(ethServer.getStafiStakingPoolQueueAbi(), ethServer.getStafiStakingPoolQueueAddress(), {
    from: address
  });
  let userDepositContract = new web3.eth.Contract(ethServer.getStafiUserDepositAbi(), ethServer.getStafiUserDepositAddress(), {
    from: address
  });
  const  nextCapacity =await poolQueueContract.methods.getNextCapacity().call();

   
  if (nextCapacity > 0) {
     const result=await  userDepositContract.methods.getBalance().call() 
     let balance = parseFloat(web3.utils.fromWei(result, 'ether'));
     const waitingStaked = NumberUtil.handleEthAmountToFixed(balance); 
     dispatch(setWaitingStaked(waitingStaked)); 
 
  } else { 
    dispatch(setIsPoolWaiting(false));
    const result =await ethServer.getStakingPoolStatus() 
      if (result.status == '80000') {
        if (result.data) {
          if (result.data.stakeAmount) {
            const totalStakedAmount = NumberUtil.handleEthAmountToFixed(result.data.stakeAmount); 
            dispatch(setTotalStakedAmount(totalStakedAmount));
          }
        }
      } 
 
  }
}

export const getApr=():AppThunk=>async (dispatch,getState)=>{
  const result =await ethServer.getArp() 
    if (result.status == '80000') {
      if (result.data && result.data.stakerApr) {
        const apr = result.data.stakerApr + '%'; 
        dispatch(setApr(apr));
      }
    } 
 
}

export const get=():AppThunk=>async (dispatch,getState)=>{
  let web3=ethServer.getWeb3(); 
  const address=getState().rETHModule.ethAccount.address;
  let managerContract = new web3.eth.Contract(ethServer.getStafiStakingPoolManagerAbi(), ethServer.getStafiStakingPoolManagerAddress(), {
    from: address
  });
  const poolCount=await managerContract.methods.getStakingPoolCount().call();
  dispatch(setPoolCount(poolCount));
}
export const send=(value:Number,cb?:Function):AppThunk=>async (dispatch,getState)=>{
  let web3=ethServer.getWeb3(); 
  const address=getState().rETHModule.ethAccount.address; 
  let contract = new web3.eth.Contract(ethServer.getStafiUserDepositAbi(), ethServer.getStafiUserDepositAddress(), {
    from: address
  });
  const amount = web3.utils.toWei(value.toString()); 
  setLoading(true)
  try { 
  const result =await contract.methods.deposit().send({value: amount}) 
    setLoading(false) 
    if (result && result.status) { 
      message.success("Deposit successfully");
      cb && cb();
    } else { 
      message.success("Error! Please try again");
    }
  } catch (error) {
    setLoading(true)
    message.success(error.message);
  } 
}
export default rETHClice.reducer;