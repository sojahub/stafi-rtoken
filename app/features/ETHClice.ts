import { createSlice } from '@reduxjs/toolkit';  
import { AppThunk, RootState } from '../store'; 
import EthServer from '@servers/eth/index';
import FisServer from '@servers/stafi';
import KsmServer from '@servers/ksm';
import BridgeServer from '@servers/bridge'
import CommonClice from './commonClice';  

const ethServer =new EthServer();
const fisServer =new FisServer();
const ksmServer=new KsmServer();
const bridgeServer=new BridgeServer();
const ETHClice = createSlice({
  name: 'ETHModule',
  initialState: {   
    ercETHBalance:"--",
    ercFISBalance:"--",
    ercRFISBalance:"--",
    ercRKSMBalance:"--",
    FISErc20Allowance:"--",
    RFISErc20Allowance:"--",
    RKSMErc20Allowance:"--"
  },
  reducers: {   
    setErcETHBalance(state,{payload}){
        state.ercETHBalance=payload;
    },
    setErcFISBalance(state,{payload}){
        state.ercETHBalance=payload;
    },
    setErcRFISBalance(state,{payload}){
        state.ercRFISBalance=payload;
    },
    setErcRKSMBalance(state,{payload}){
        state.ercRKSMBalance=payload;
    },
    setFISErc20Allowance(state,{payload}){
        state.FISErc20Allowance=payload;
    },
    setRFISErc20Allowance(state,{payload}){
        state.RFISErc20Allowance=payload;
    },
    setRKSMErc20Allowance(state,{payload}){
        state.RKSMErc20Allowance=payload;
    }
  },
});

export const {
    setErcETHBalance,
    setErcFISBalance,
    setErcRFISBalance,
    setErcRKSMBalance,
    setFISErc20Allowance,
    setRFISErc20Allowance,
    setRKSMErc20Allowance
}=ETHClice.actions

export const getAssetBalanceAll=():AppThunk=>(dispatch,getState)=>{ 
    dispatch(getETHAssetBalance());
    dispatch(getFISAssetBalance());
    dispatch(getRFISAssetBalance());
    dispatch(getRKSMAssetBalance());
}
export const getErc20Allowances=():AppThunk=>(dispatch,getState)=>{ 
    dispatch(getFISErc20Allowance());
    dispatch(getRFISAssetBalance());
    dispatch(getRKSMAssetBalance()); 
}
export const getETHAssetBalance=():AppThunk=>(dispatch,getState)=>{  
  if(getState().rETHModule.ethAccount){ 
    const address=getState().rETHModule.ethAccount.address;  
    getAssetBalance(address,ethServer.getRETHTokenAbi(), ethServer.getRETHTokenAddress(),(v:any)=>{
      dispatch(setErcETHBalance(v))
    })
  }
}

export const getFISAssetBalance=():AppThunk=>(dispatch,getState)=>{  
    if(getState().rETHModule.ethAccount){ 
      const address=getState().rETHModule.ethAccount.address;  
      getAssetBalance(address,fisServer.getFISTokenAbi(), fisServer.getFISTokenAddress(),(v:any)=>{
        dispatch(setErcFISBalance(v))
      })
    }
  }
  export const getRFISAssetBalance=():AppThunk=>(dispatch,getState)=>{  
    if(getState().rETHModule.ethAccount){ 
      const address=getState().rETHModule.ethAccount.address;  
      getAssetBalance(address,fisServer.getRFISTokenAbi(), fisServer.getRFISTokenAddress(),(v:any)=>{
        dispatch(setErcRFISBalance(v))
      })
    }
  }
  export const getRKSMAssetBalance=():AppThunk=>(dispatch,getState)=>{  
    if(getState().rETHModule.ethAccount){ 
      const address=getState().rETHModule.ethAccount.address;  
      getAssetBalance(address,ksmServer.getRKSMTokenAbi(), ksmServer.getRKSMTokenAddress(),(v:any)=>{
        dispatch(setErcRKSMBalance(v))
      })
    }
  }
const getAssetBalance=(ethAddress:string,getTokenAbi:string,getTokenAddress:string,cb?:Function)=>{
    let web3=ethServer.getWeb3(); 
    let contract = new web3.eth.Contract(getTokenAbi, getTokenAddress, {
      from: ethAddress
    }); 
    try{
      contract.methods.balanceOf(ethAddress).call().then((balance:any) => {

        let rbalance = web3.utils.fromWei(balance, 'ether');   
        cb && cb(rbalance);
      }).catch((e:any)=>{
        console.error(e)
      });
    }catch(e:any){
      console.error(e)
    }
}


export const getFISErc20Allowance=():AppThunk=>(dispatch,getState)=>{
    if(getState().rETHModule.ethAccount){ 
      const address=getState().rETHModule.ethAccount.address;  
      getErc20Allowance(address,fisServer.getFISTokenAbi(), fisServer.getFISTokenAddress(),(v:any)=>{
        dispatch(setFISErc20Allowance(v))
      })
    }
  }
  export const getRFISErc20Allowance=():AppThunk=>(dispatch,getState)=>{
    if(getState().rETHModule.ethAccount){ 
      const address=getState().rETHModule.ethAccount.address;  
      getErc20Allowance(address,fisServer.getRFISTokenAbi(), fisServer.getRFISTokenAddress(),(v:any)=>{
        dispatch(setRFISErc20Allowance(v))
      })
    }
  }

  export const getRKSMErc20Allowance=():AppThunk=>(dispatch,getState)=>{
    if(getState().rETHModule.ethAccount){ 
      const address=getState().rETHModule.ethAccount.address;  
      getErc20Allowance(address,ksmServer.getRKSMTokenAbi(), ksmServer.getRKSMTokenAddress(),(v:any)=>{
        dispatch(setRKSMErc20Allowance(v))
      })
    }
  }
const getErc20Allowance=async (ethAddress:string,getTokenAbi:string,getTokenAddress:string,cb?:Function)=>{
    let web3=ethServer.getWeb3(); 
    let contract = new web3.eth.Contract(getTokenAbi, getTokenAddress, {
      from: ethAddress
    }); 
    try{
      const allowance = await contract.methods.allowance(ethAddress, bridgeServer.getBridgeErc20HandlerAddress()).call();
       cb && cb(allowance);
    }catch(e:any){
      console.error(e) 
    }
  }
export default ETHClice.reducer;