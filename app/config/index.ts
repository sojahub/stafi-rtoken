
export default {
  polkadotChain: ()=>{
    if(process.env.NODE_ENV=="production"){
      return 'wss://rpc.polkadot.io';
    }else{
      return 'wss://westend-rpc.polkadot.io'
    }
  }
} 
