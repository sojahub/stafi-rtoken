
export const isdev=()=>{
  let host = window.location.host;
  var local =
    /192\.168\./.test(host) || /127\.0\./.test(host) || /localhost/.test(host);
  let demo = /test/.test(host);
  return (local || demo)
}
export default {
  polkadotChain: ()=>{ 
    if(process.env.NODE_ENV=="production" &&  !isdev()){
      return 'wss://rpc.polkadot.io';
    }else{
      return 'wss://polkadot-test-rpc.stafi.io'
    }
  },
  stafiChain: ()=>{
    if(process.env.NODE_ENV=="production" &&  !isdev()){
      return 'wss://mainnet-rpc.stafi.io';
    }else{
      return 'wss://stafi-seiya.stafi.io'
    } 
  },
  api: ()=>{
    if(process.env.NODE_ENV=="production" &&  !isdev()){
      return 'https://rtoken-api.stafi.io';
    }else{
      return 'https://rtoken-api.stafi.io';
    }  
  },
} 
 