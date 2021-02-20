
export default {
  polkadotChain: ()=>{
    if(process.env.NODE_ENV=="production"){
      return 'wss://rpc.polkadot.io';
    }else{
      return 'wss://westend-rpc.polkadot.io'
    }
  },
  stafiChain: ()=>{
    if(process.env.NODE_ENV=="production"){
      return 'wss://mainnet-rpc.stafi.io';
    }else{
      return 'wss://stafi-seiya.stafi.io'
    } 
  }
} 
