
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
  kusamaChain: ()=>{ 
    if(process.env.NODE_ENV=="production" &&  !isdev()){
      return 'wss://kusama-rpc.polkadot.io';
    }else{
      return 'wss://kusama-test-rpc.stafi.io'
    }
  },
  api: ()=>{
    if(process.env.NODE_ENV=="production" &&  !isdev()){
      return 'https://rtoken-api.stafi.io';
    }else{
      return 'https://rtoken-api.stafi.io';
    }  
  },
  rFISTokenAddress: ()=>{
    if(process.env.NODE_ENV=="production" &&  !isdev()){
      return '0xc82eb6dea0c93edb8b697b89ad1b13d19469d635';
    }else{
      return '0xc372e985fda306cfe0e903657de808cf757f536f';
    }  
  },
  rKSMTokenAddress:()=>{
    if(process.env.NODE_ENV=="production" &&  !isdev()){
      return '0xd1d458c1c3579033a65db4ca2f06c12573aa5e27';
    }else{
      return '0xd1d458c1c3579033a65db4ca2f06c12573aa5e27';
    }  
  }
} 
 