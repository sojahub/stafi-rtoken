import { createSlice } from '@reduxjs/toolkit';  
import {isdev} from '@config/index'
import { AppThunk, RootState } from '../store';
import { setLocalStorageItem, getLocalStorageItem, removeLocalStorageItem, Keys,localStorage_poolPubKey,localStorage_currentEthPool } from '@util/common';
import NumberUtil from '@util/numberUtil';
import Web3Utils from 'web3-utils';
import EthServer from '@servers/eth/index'; 
import { message } from 'antd';
import { keccakAsHex } from '@polkadot/util-crypto';  
import {getAssetBalanceAll,getAssetBalance} from './ETHClice';
import {setLoading} from './globalClice'; 
import StringUtil from '@util/stringUtil' 

const ethServer=new EthServer();
const rETHClice = createSlice({
  name: 'rETHModule',
  initialState: {  
    chainId:'',
    ethAccount:getLocalStorageItem(Keys.MetamaskAccountKey),
    ratio:"--", 
    ratioShow:"--",
    balance:"--",
    minimumDeposit:"--",
    waitingStaked:"--",
    totalStakedAmount:"--",
    stakerApr:"--",
    validatorApr:"--",
    poolStakerApr:"--",
    poolValidatorApr:"--",
    isPoolWaiting:true,
    poolCount:"--",
    rethAmount:"--",
    depositWaitingStaked:"--",
    waitingPoolCount:"--",
    poolAddress:null,
    poolAddressItems:[],
    currentPoolStatus:null,
    currentTotalDeposit:0,
    selfDeposited:"--", 
    isload_monitoring:false,
    status_Apr:'--',
    totalStakedETH:'--',
    addressItems:[],
    unmatchedValidators:'--',
    poolStatusTotalRETH:'--',
    poolStatusUnmatchedETH:'--'
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
     setStakerApr(state,{payload}){
       state.stakerApr=payload;
     },
     setIsPoolWaiting(state,{payload}){
      state.isPoolWaiting=payload;
     },
     setPoolCount(state,{payload}){
       state.poolCount=payload
     },
     setRethAmount(state,{payload}){
       state.rethAmount=payload
     },
     setRatioShow(state,{payload}){
      state.ratioShow=payload
     },
     setValidatorApr(state,{payload}){
       state.validatorApr=payload
     },
     setDepositWaitingStaked(state,{payload}){
       state.depositWaitingStaked=payload;
     },
     setWaitingPoolCount(state,{payload}){
       state.waitingPoolCount=payload;
     },
     setPoolAddress(state,{payload}){ 
       state.poolAddress=payload
     },
     setPoolAddressItems(state,{payload}){
      state.poolAddressItems=payload
     },
     setCurrentPoolStatus(state,{payload}){
       state.currentPoolStatus=payload
     },
     setCurrentTotalDeposit(state,{payload}){
       state.currentTotalDeposit=payload
     },
     setSelfDeposited(state,{payload}){
       state.selfDeposited=payload
     },
     setIsloadMonitoring(state,{payload}){
       state.isload_monitoring=payload
     },
     setStatus_Apr(state,{payload}){
       state.status_Apr=payload;
     },
     setTotalStakedETH(state,{payload}){
       state.totalStakedETH=payload;
     },
     setAddressItems(state,{payload}){
       state.addressItems=payload
     },
     setPoolStakerApr(state,{payload}){
      state.poolStakerApr=payload
     },
     setPoolValidatorApr(state,{payload}){
       state.poolValidatorApr=payload
     },
     setUnmatchedValidators(state,{payload}){
       state.unmatchedValidators=payload
     },
     setPoolStatusTotalRETH(state,{payload}){
       state.poolStatusTotalRETH=payload
     },
     setPoolStatusUnmatchedETH(state,{payload}){
       state.poolStatusUnmatchedETH=payload;
     }
  },
});

export const {setEthAccount,
  setRatio,
  setBalance,
  setMinimumDeposit,
  setWaitingStaked,
  setTotalStakedAmount,
  setStakerApr,
  setIsPoolWaiting,
  setPoolCount,
  setRethAmount,
  setRatioShow,
  setValidatorApr,
  setDepositWaitingStaked,
  setWaitingPoolCount,
  setPoolAddress,
  setPoolAddressItems,
  setCurrentPoolStatus,
  setCurrentTotalDeposit,
  setSelfDeposited,
  setIsloadMonitoring,
  setStatus_Apr,
  setTotalStakedETH,
  setAddressItems,
  setPoolStakerApr,
  setPoolValidatorApr,
  setUnmatchedValidators,
  setPoolStatusTotalRETH,
  setPoolStatusUnmatchedETH
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
  const isload_monitoring =getState().rETHModule.isload_monitoring;

  if(isload_monitoring){
    return;
  } 
  if (typeof window.ethereum !== 'undefined' && ethereum.isMetaMask) {
    dispatch(setIsloadMonitoring(true));
    ethereum.autoRefreshOnNetworkChange = false; 
    ethereum.on('accountsChanged', (accounts:any) => { 
      if (accounts.length>0) { 
        dispatch(handleEthAccount(accounts[0])); 
        // setTimeout(()=>{
        //   dispatch(getAssetBalanceAll()); 
        // },20)
      } else { 
        dispatch(handleEthAccount(null))
      }
    }); 

    ethereum.on('chainChanged', (chainId:any) => {
      if (isdev()) {
        if (ethereum.chainId != "0x3" && location.pathname.includes("/rAsset/erc")) {
          message.warning('Please connect to Ropsten Test Network!');  
          dispatch(setEthAccount(null));
        } 
        if (ethereum.chainId != "0x5" && location.pathname.includes("/rETH")) {
          message.warning('Please connect to Goerli Test Network!');  
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

  dispatch(getStakerApr());
  dispatch(getValidatorApr());
  dispatch(getNextCapacity());
  dispatch(getPoolCount());
}

export const rTokenRate=():AppThunk=>async (dispatch,getState)=>{
  let web3=ethServer.getWeb3(); 
  let contract = new web3.eth.Contract(ethServer.getRETHTokenAbi(),ethServer.getRETHTokenAddress());
  const amount = web3.utils.toWei('1');
  const result = await contract.methods.getEthValue(amount).call();
  let ratio = web3.utils.fromWei(result, 'ether');  
  dispatch(setRatio(ratio))
}

export const get_eth_getBalance=():AppThunk=>async  (dispatch,getState)=>{
  let web3=ethServer.getWeb3(); 
  const address=getState().rETHModule.ethAccount.address;
  const result = await ethereum.request({ method: 'eth_getBalance', params: [ address, 'latest'] })
  const balance = web3.utils.fromWei(result, 'ether');  
  dispatch(setEthAccount({address:address,balance:NumberUtil.handleEthAmountToFixed(balance)}))
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

export const getStakerApr=():AppThunk=>async (dispatch,getState)=>{
  const result =await ethServer.getArp(1) 
    if (result.status == '80000') {
      if (result.data && result.data.stakerApr) {
        const apr = result.data.stakerApr + '%'; 
        dispatch(setStakerApr(apr));
      }
    } 
 
}

export const getValidatorApr=():AppThunk=>async (dispatch,getState)=>{
  const result =await ethServer.getArp(2) 
    if (result.status == '80000') {
      if (result.data && result.data.validatorApr) {
        const apr = result.data.validatorApr + '%'; 
        dispatch(setValidatorApr(apr));
      }
    }  
}

export const getPoolCount=():AppThunk=>async (dispatch,getState)=>{
  let web3=ethServer.getWeb3(); 
  const address=getState().rETHModule.ethAccount.address;
  let managerContract = new web3.eth.Contract(ethServer.getStafiStakingPoolManagerAbi(), ethServer.getStafiStakingPoolManagerAddress(), {
    from: address
  });
  const poolCount=await managerContract.methods.getStakingPoolCount().call();
  dispatch(setPoolCount(poolCount));
}
export const send=(value:Number,cb?:Function):AppThunk=>async (dispatch,getState)=>{
  dispatch(setLoading(true));
  let web3=ethServer.getWeb3(); 
  const address=getState().rETHModule.ethAccount.address; 
  let contract = new web3.eth.Contract(ethServer.getStafiUserDepositAbi(), ethServer.getStafiUserDepositAddress(), {
    from: address
  });
  const amount = web3.utils.toWei(value.toString()); 
 
  try { 
  const result =await contract.methods.deposit().send({value: amount}) 
  dispatch(setLoading(false))
    if (result && result.status) { 
      message.success("Deposit successfully");
      cb && cb();
    } else { 
      message.success("Error! Please try again");
    }
  } catch (error) {
    dispatch(setLoading(false))
    message.success(error.message);
  } 
}

export const getRethAmount=():AppThunk=>async (dispatch,getState)=>{
  const address=getState().rETHModule.ethAccount.address;
  getAssetBalance(address,ethServer.getRETHTokenAbi(), ethServer.getRETHTokenAddress(),(v:any)=>{
    dispatch(setRethAmount(v))
  })
}


export const getDepositBalance=():AppThunk=>async (dispatch,getState)=>{
  const address=getState().rETHModule.ethAccount.address;
  let web3=ethServer.getWeb3(); 
  let userDepositContract = new web3.eth.Contract(ethServer.getStafiUserDepositAbi(), ethServer.getStafiUserDepositAddress(), {
    from: address
  });

const result =await userDepositContract.methods.getBalance().call() 
  let balance = parseFloat(web3.utils.fromWei(result, 'ether'));
  const waitingStaked = NumberUtil.handleEthAmountToFixed(balance);
  dispatch(setDepositWaitingStaked(waitingStaked));
  if (Number(waitingStaked) <= 0) {
    let poolQueueContract = new web3.eth.Contract(ethServer.getStafiStakingPoolQueueAbi(), ethServer.getStafiStakingPoolQueueAddress(), {
      from: address
    });

    const waitingPoolCount =await poolQueueContract.methods.getLength(2).call() 
      if (waitingPoolCount > 0) {
        dispatch(setWaitingPoolCount(waitingPoolCount)); 
      } else{
        dispatch(setWaitingPoolCount(0)); 
      }

  }
 
}

export const handleDeposit=(ethAmount:Number,cb?:Function):AppThunk=>async (dispatch,getState)=>{
  let web3 = ethServer.getWeb3();
  let contract = new web3.eth.Contract(ethServer.getStafiNodeDepositAbi(), ethServer.getStafiNodeDepositAddress(), {
    from: ethereum.selectedAddress
  });
  const amount = web3.utils.toWei(ethAmount.toString());

  setLoading(true);
 try { 
    const result=await contract.methods.deposit().send({value: amount}) 
    setLoading(false); 
    if (result && result.status) {
      message.success("Deposit successfully");
      cb && cb();
    } else {
      message.error("Error! Please try again"); 
    }
  } catch (error) {
    setLoading(false);
    message.error(error.message); 
  } 
}

// export const setCurrentEthPool=(validatorAddress:string, poolAddress:string)=>{ 
//     setLocalStorageItem(Keys.rEthCurrentPoolPrefix+validatorAddress,poolAddress);
// }
// export const getCurrentEthPool=(validatorAddress:string)=>{ 
//     return getLocalStorageItem(Keys.rEthCurrentPoolPrefix+validatorAddress );
// }


export const getNodeStakingPoolCount=():AppThunk=>async (dispatch,getState)=>{
  let web3 = ethServer.getWeb3();
  const currentAddress=getState().rETHModule.ethAccount.address;
  const poolAddressItems=[];
  let contract = new web3.eth.Contract(ethServer.getStafiStakingPoolManagerAbi(), ethServer.getStafiStakingPoolManagerAddress(), {
    from: currentAddress
  });
 


  const poolCount =await contract.methods.getNodeStakingPoolCount(currentAddress).call() 
  if (poolCount > 0) {
    let currentPool = localStorage_currentEthPool.getCurrentEthPool(currentAddress);
    for (let index = 0; index < poolCount; index++) {
      const poolAddress= await contract.methods.getNodeStakingPoolAt(currentAddress, index).call()
      poolAddressItems.push(poolAddress); 
        if (currentPool) {
          if (currentPool == poolAddress) {  
            dispatch( handleCurrentPool(poolAddress))
            dispatch(setPoolAddress(poolAddress))
          }
        } else if (index == poolCount - 1) {
          dispatch(setPoolAddress(poolAddress)) 
          dispatch(handleCurrentPool(poolAddress))
          localStorage_currentEthPool.setCurrentEthPool(currentAddress, poolAddress);
        }
   
    }  
    dispatch(setPoolAddressItems(poolAddressItems));
  } 
}

 

export const handleCurrentPool=(currentPoolAddress:string):AppThunk=> async (dispatch,getState)=>{
  let web3 = ethServer.getWeb3();
  const currentAddress=getState().rETHModule.ethAccount.address;
  let poolContract = new web3.eth.Contract(ethServer.getStafiStakingPoolAbi(), currentPoolAddress, {
    from: currentAddress
  }); 
  const status=await poolContract.methods.getStatus().call();
  dispatch(setCurrentPoolStatus(status));
 
  let currentTotalDeposit = 0;

  const nodeDepositBalance=await poolContract.methods.getNodeDepositBalance().call() 
  currentTotalDeposit += parseFloat(web3.utils.fromWei(nodeDepositBalance, 'ether'));
    // this.currentTotalDepositShow = NumberUtil.handleEthRoundToFixed(this.currentTotalDeposit);
 

  const userDepositBalance = await poolContract.methods.getUserDepositBalance().call();
  currentTotalDeposit += parseFloat(web3.utils.fromWei(userDepositBalance, 'ether'));
    // this.currentTotalDepositShow = NumberUtil.handleEthRoundToFixed(this.currentTotalDeposit);
 

  const nodeRefundBalance=await poolContract.methods.getNodeRefundBalance().call();
  currentTotalDeposit += parseFloat(web3.utils.fromWei(nodeRefundBalance, 'ether'));
    // this.currentTotalDepositShow = NumberUtil.handleEthRoundToFixed(this.currentTotalDeposit);
  dispatch(setCurrentTotalDeposit(NumberUtil.handleEthRoundToFixed(currentTotalDeposit)))
 
}

export const handleOffboard=(cb?:Function):AppThunk=>async (dispatch,getState)=>{
  let web3 = ethServer.getWeb3();
  const currentPoolAddress=getState().rETHModule.poolAddress;
  const currentAddress=getState().rETHModule.ethAccount.address;
  const currentPoolStatus=getState().rETHModule.currentPoolStatus;
  let poolContract = new web3.eth.Contract(ethServer.getStafiStakingPoolAbi(), currentPoolAddress, {
    from: currentAddress
  }); 
  dispatch(setLoading(true));
  if (currentPoolStatus == 4) {
    try {
      const result = await  poolContract.methods.close().send() 
        dispatch(setLoading(false)); 
        if (result && result.status) { 
          message.success('Offboard successfully')
          cb && cb()
          dispatch(reloadData())
        } else { 
          message.error('Error! Please try again')
        } 
    } catch (error) {
      dispatch(setLoading(false));
      message.error(error.message)
    } 
  } else { 
    try { 
      const result=await poolContract.methods.dissolve().send() 
      if (result && result.status) {
        try{
        const closeResult=await poolContract.methods.close().send() 

          dispatch(setLoading(false))
          if (closeResult && closeResult.status) {
          
            message.error('Offboard successfully');
            cb && cb()
            dispatch(reloadData())
          } else {
            message.error('Error! Please try again');
          }
          
        }catch(error){
          dispatch(setLoading(false))
          message.error(error.message);
        };
      } else { 
        dispatch(setLoading(false))
        message.error('Error! Please try again'); 
      } 
    } catch (error) {
      dispatch(setLoading(false))
      message.error(error.message);
    }
  }
}



export const handleStake=(validatorKeys:any[],cb?:Function):AppThunk=>async (dispatch,getState)=>{
 

  let web3 = ethServer.getWeb3();
  const currentAddress=getState().rETHModule.ethAccount.address;
  const currentPoolAddress=getState().rETHModule.poolAddress;
  console.log(validatorKeys,currentPoolAddress,currentAddress,"============currentAddress")
  let poolContract = new web3.eth.Contract(ethServer.getStafiStakingPoolAbi(), currentPoolAddress, {
    from: currentAddress
  });
  
  dispatch(setLoading(true))
  try {
 
  let pubkey = '0x' + validatorKeys[0].pubkey;
  const result =await poolContract.methods.stake(
    pubkey, 
    '0x' + validatorKeys[0].signature, 
    '0x' + validatorKeys[0].deposit_data_root
  ).send();
    dispatch(setLoading(false)) 
    if (result && result.status) { 
      localStorage_poolPubKey.setPoolPubKey(currentPoolAddress, pubkey);
      message.error('Stake successfully');
      cb && cb();
    } else {
      message.error('Error! Please try again');
    }
     
  } catch (error) {
    dispatch(setLoading(false)) 
    message.error(error.message);
  }

}


export const getSelfDeposited=():AppThunk=>async (dispatch,getState)=>{
  let web3 = ethServer.getWeb3();
  const currentAddress=getState().rETHModule.ethAccount.address;
  let contract = new web3.eth.Contract(ethServer.getStafiStakingPoolManagerAbi(), ethServer.getStafiStakingPoolManagerAddress(), {
    from: currentAddress
  });
  let addressItems:any[]=[];
  let pubKeys = [];;
  let pubKeyMap=new Map();
  let selfDeposited=0;

 const poolCount = await contract.methods.getNodeStakingPoolCount(currentAddress).call();
  if (poolCount > 0) {
   // this.poolCount = poolCount;
  
    for (let index = 0; index < poolCount; index++) {
    const poolAddress=await  contract.methods.getNodeStakingPoolAt(currentAddress, index).call(); 
        let item = {
          address: poolAddress,
          shortAddress: StringUtil.replacePkh(poolAddress, 4, 38),
          status: -1
        }
        addressItems.push(item);

        let pubKey = localStorage_poolPubKey.getPoolPubKey(poolAddress);
        if (pubKey) { 
          pubKeys.push(pubKey);
          pubKeyMap.set(pubKey, poolAddress.toLowerCase());
          dispatch(updateStatus(pubKeys,pubKeyMap,poolCount,addressItems));
        } else {
          const pubkey =await contract.methods.getStakingPoolPubkey(poolAddress).call() 
          if (pubkey) { 
            pubKeys.push(pubKey);
            pubKeyMap.set(pubKey, poolAddress.toLowerCase());
            localStorage_poolPubKey.setPoolPubKey(poolAddress, pubkey);
          } else {
            pubKeys.push('');
          }
          dispatch(updateStatus(pubKeys,pubKeyMap,poolCount,addressItems));
          
        }

        let poolContract = new web3.eth.Contract(ethServer.getStafiStakingPoolAbi(), poolAddress, {
          from: currentAddress
        });

        const status=await poolContract.methods.getStatus().call() 
        if (status == 4) {
          addressItems.some((item) => {
            if (item.address.toLowerCase() == poolAddress.toLowerCase()) {
              item.status = 8; 
              return true;
            }
          });
          
        }
    

        const  depositBalance= await poolContract.methods.getNodeDepositBalance().call() 
        let parsedDepositBalance = parseFloat(web3.utils.fromWei(depositBalance, 'ether'));
        selfDeposited += parsedDepositBalance;
         // this.selfDepositedShow = NumberUtil.handleEthRoundToFixed(this.selfDeposited);
    }
  }
  dispatch(setAddressItems(addressItems))
  dispatch(setSelfDeposited(selfDeposited))
 
}

export const  updateStatus=(pubKeys:any[],pubKeyMap:any,poolCount:Number,addressItems:any[]):AppThunk=>async (dispatch,getState)=>{
  console.log(pubKeys,poolCount,"===poolCountpoolCount")
  if (pubKeys.length == poolCount) {
    let validPubKeys:any[] = [];
   
    pubKeys.forEach((pubkey) => {
      if (pubkey) {
        validPubKeys.push(pubkey);
      }
    });

    console.log(pubKeys,validPubKeys,validPubKeys.length,"======validPubKeys")
    if (validPubKeys.length == 0) {
      addressItems.forEach((item) => {
        item.status = 7;
      });
      return;
    }
    const result=await ethServer.getPoolist({pubkeyList: JSON.stringify(validPubKeys)}) ;
      if (result.status == '80000') {
        if (result.data) {
          let totalStakeAmount = 0;
          if (result.data.allStakeAmount) {
            totalStakeAmount = result.data.allStakeAmount;
          }
          if (result.data.apr) {
            // this.currentApr = result.data.apr + '%';
            dispatch(setStatus_Apr(result.data.apr + '%'))
          }
          if (result.data.list) {

            let remoteDataItems = result.data.list;

            let map = new Map();
            remoteDataItems.forEach((remoteItem:any) => {
              if (remoteItem.pubkey) {
                map.set(pubKeyMap.get(remoteItem.pubkey), remoteItem);
                if (remoteItem.status == 7) {
                  totalStakeAmount = Number(totalStakeAmount) + 32;
                }
              }
            });

            addressItems.forEach((item) => {
              let key = item.address.toLowerCase();
              if (map.has(key)) {
                item.status = map.get(key).status == 7 ? 2 : map.get(key).status; 
              } else {
                item.status = 7;
              }
            });
          }

          dispatch(setTotalStakedETH(totalStakeAmount));
          // if (totalStakeAmount > 0) {
          //   let count = 0;
          //   let totalCount = 10;
          //   let ratioAmount = 0;
          //   let piece = totalStakeAmount / totalCount;
          //   let interval = setInterval(() => {
          //     count++;
          //     ratioAmount += piece;
          //     if (count == totalCount) {
          //       ratioAmount = totalStakeAmount;
          //       window.clearInterval(interval);
          //     }
          //     // this.totalStakedETHShow = NumberUtil.handleEthGweiToFixed(ratioAmount);
          //     dispatch(setTotalStakedETH(NumberUtil.handleEthGweiToFixed(ratioAmount)));
          //   }, 100);
          // }
          
        }
      }

  }
}

export const getStakingPoolStatus=():AppThunk=>async (dispatch,getState)=>{
  const result =await ethServer.getStakingPoolStatus() 
  if (result.status == '80000') {
    if (result.data) {
      if (result.data.stakeAmount) {
        const totalStakedAmount = NumberUtil.handleEthAmountToFixed(result.data.stakeAmount); 
        dispatch(setTotalStakedAmount(totalStakedAmount));
      }
      if (result.data.validatorApr) { 
        dispatch(setPoolValidatorApr(result.data.validatorApr + '%'))
      }
      if (result.data.stakerApr) { 
        dispatch(setPoolStakerApr(result.data.stakerApr + '%'))

      }
    }
  } 

} 

export const getUnmatchedValidators=():AppThunk=>async (dispatch,getState)=>{
  const web3=ethServer.getWeb3();
  const address=getState().rETHModule.ethAccount.address; 
  let poolQueueContract = new web3.eth.Contract(ethServer.getStafiStakingPoolQueueAbi(), ethServer.getStafiStakingPoolQueueAddress(), {
    from: address
  });

  const result =await poolQueueContract.methods.getLength('2').call()
//  this.unmatchedValidators = result;
  dispatch(setUnmatchedValidators(result))
 
}

export const getTotalRETH=():AppThunk=>async (dispatch,getState)=>{
  const address=getState().rETHModule.ethAccount.address; 
  let web3 = ethServer.getWeb3();
  let contract = new web3.eth.Contract(ethServer.getRETHTokenAbi(), ethServer.getRETHTokenAddress(), {
    from: address
  });
  const result=await contract.methods.totalSupply().call() 
  let totalRETH = parseFloat(web3.utils.fromWei(result, 'ether')); 
  dispatch(setPoolStatusTotalRETH(NumberUtil.handleEthAmountToFixed(totalRETH)))
  
}
export const getUnmatchedETH=():AppThunk=>async (dispatch,getState)=>{
  const address=getState().rETHModule.ethAccount.address; 
  let web3 = ethServer.getWeb3();
  let userContract = new web3.eth.Contract(ethServer.getStafiUserDepositAbi(), ethServer.getStafiUserDepositAddress(), {
    from: address
  });
  
  const result=await userContract.methods.getBalance().call() 
  let unmatchedETH = parseFloat(web3.utils.fromWei(result, 'ether'));
  dispatch(setPoolStatusUnmatchedETH(NumberUtil.handleEthAmountToFixed(unmatchedETH)));
 
}
export default rETHClice.reducer;