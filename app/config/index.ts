
import {rSymbol,Symbol} from '@keyring/defaults'
export const isdev=()=>{
  let host = window.location.host;
  var local =
    /192\.168\./.test(host) || /127\.0\./.test(host) || /localhost/.test(host);
  let demo = /test/.test(host);
  return (local || demo)
}
export default {
  polkadotChain: ()=>{ 
    if(!isdev()){
      return 'wss://rpc.polkadot.io';
    }else{
      return 'wss://polkadot-test-rpc.stafi.io'
    }
  },
  stafiChain: ()=>{
    if(!isdev()){
      return 'wss://mainnet-rpc.stafi.io';
    }else{
      return 'wss://stafi-seiya.stafi.io'
    } 
  },
  kusamaChain: ()=>{ 
    if(!isdev()){
      return 'wss://kusama-rpc.polkadot.io';
    }else{
      return 'wss://kusama-test-rpc.stafi.io'
    }
  },
  api: ()=>{
    if(!isdev()){
      return 'https://rtoken-api.stafi.io';
    }else{
      return 'https://rtoken-api.stafi.io';
    }  
  },
  stafiApi:"https://drop.stafi.io",
  rETHTokenAddress: ()=>{ 
    if(!isdev()){
      return '0x9559aaa82d9649c7a7b220e7c461d2e74c9a3593';
    }else{
      return '0x680ab46340aa2189515b49fd35ac8a5bd66e78de';
    }  
  },
  stafiUserDepositAddress:()=> {
    if(!isdev()){
      return '0x430cf6dd3e289adae63b50ff661d6bba2dbb3f28';
    }else{
      return '0x310b80843c56591bd3c403f877ab665f68530cef';
    }   
  },
  stafiNodeDepositAddress:() => { 
    if(!isdev()){
      return '0x50db2ce93c8b1f6771c985b6b840b587349496a0';
    }else{
      return '0x0313d2b2e9ef926012881a7e33482a957bed265c';
    }   
  },
  stafiStakingPoolManagerAddress:()=> {
    if(!isdev()){
      return '0x1c9890c9cb9925a8651c10b5f557d744bafbed5a';
    }else{
      return '0xa84ec99b9c9d16f769d9909a2466923f4dddd282';
    }  
  },
  stafiStakingPoolQueueAddress:()=> { 
    if(!isdev()){
      return '0xc59ea6cebb8089a0330800f50946610977c4fc96';
    }else{
      return '0xc8985dd9da3c9d35eaac6b29b5f6b7ecc3f765ca';
    }  
  },
  rBridgeApp: ()=>{ 
    if(!isdev()){
      return 'https://rtoken.stafi.io/rbridge';
    }else{
      return 'https://test-rtoken.stafi.io/rbridge';
    } 
  },
  rFISTokenAddress: ()=>{
    if(!isdev()){
      return '0xc82eb6dea0c93edb8b697b89ad1b13d19469d635';
    }else{
      return '0xc372e985fda306cfe0e903657de808cf757f536f';
    }  
  },
  FISTokenAddress: ()=>{
    if(!isdev()){
      return '0xef3a930e1ffffacd2fc13434ac81bd278b0ecc8d';
    }else{
      return '0x64591e3f2dbf46cdfb398a0d9ba81f41b7cbd449';
    }  
  },
  rKSMTokenAddress:()=>{
    if(!isdev()){
      return '0x3c3842c4d3037ae121d69ea1e7a0b61413be806c';
    }else{
      return '0xd1d458c1c3579033a65db4ca2f06c12573aa5e27';
    }  
  },
  rDOTTokenAddress:()=>{
    if(!isdev()){
      return '0x505f5a4ff10985fe9f93f2ae3501da5fe665f08a';
    }else{
      return '0x6aef17cea6e6841f1957f9fde6538ac391d55636';
    }  
  },
  rATOMTokenAddress:()=>{
    if(!isdev()){
      return '0xd01cb3d113a864763dd3977fe1e725860013b0ed';
    }else{
      return '0xd363ed9ee73c8b6bd048ae188000be454f7b7925';
    }  
  },
  erc20HandlerAddress:()=>{ 
    if(!isdev()){
      return '0x2b6b6fce3af32efe4430e446717bda72b95ebb9a'; 
    }else{
      return '0x05da428a68da64a2b085a4d2d4279d952d7b647a';
    }  
  },
  bridgeAddress:()=>{ 
    if(!isdev()){
      return '0xc0609ea6e4345555276fac1636b5c27ebc17d817'; 
    }else{
      return '0xc3ce28a291def0f5762c545431036a6819b8d6d2';
    } 
  },
  txHashAndBlockhashURl:{
    dotURL: "https://docs.stafi.io/rproduct/rdot-solution/rdot-staker-guide/recovery-function#2-the-way-to-get-txhash-and-blockhash",
    ksmURL: "https://docs.stafi.io/rproduct/rksm-solution/staker-guide/recovery-function#2-the-way-to-get-txhash-and-blockhash",
    atomURL: "https://docs.stafi.io/rproduct/ratom-solution/staker-guide/recovery-function#2-the-way-to-get-txhash"
  },
  rAtomChainId:()=>{
    if(!isdev()){
      return "cosmoshub-4";
    }else{
      return "stargate-final";
    } 
  },
  rAtomCosmosChainRpc:()=>{
    if(!isdev()){
      return  "https://cosmos-rpc1.stafi.io";
    }else{
      return  "https://testcosmosrpc.wetez.io";
    } 
  },
  rAtomDenom:()=>{
    if(!isdev()){
      return  "uatom";
    }else{
      return  "umuon";
    } 
  },
  rAtomAignature:"0x00",
  txHashUrl:(type:rSymbol,txHash:string)=>{
    if(type==rSymbol.Atom){
      return `https://www.mintscan.io/cosmos/txs/${txHash}`;
    }else if(type==rSymbol.Dot){
      return `https://polkadot.subscan.io/extrinsic/${txHash}`
    }else if(type==rSymbol.Ksm){
      return `https://kusama.subscan.io/extrinsic/${txHash}`
    }else{
      return ""
    }
  },
  unboundAroundDays:(type:Symbol)=>{
    if(type==Symbol.Dot){
      return 29;
    }else if(type==Symbol.Ksm){
      return 8;
    }else if(type==Symbol.Atom){
      return 22;
    }else if(type==Symbol.Fis){
      return 29;
    }else{
      return 0
    }
  },
  curve:{
    rethURL:"https://curve.fi/reth"
  },
  uniswap:{
    rethURL:"https://app.uniswap.org/#/swap?inputCurrency=0x9559aaa82d9649c7a7b220e7c461d2e74c9a3593&outputCurrency=ETH",
    rfisURL:"https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xc82eb6dea0c93edb8b697b89ad1b13d19469d635",
    fisURL:"https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xef3a930e1ffffacd2fc13434ac81bd278b0ecc8d",
    rdotURL:"https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x505f5a4ff10985fe9f93f2ae3501da5fe665f08a",
    rksmURL:"https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x3c3842c4d3037ae121d69ea1e7a0b61413be806c",
    ratomURL:"https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xd01cb3d113a864763dd3977fe1e725860013b0ed",

  }
  
} 
 