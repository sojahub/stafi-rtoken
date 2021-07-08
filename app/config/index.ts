
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
  api2: ()=>{
    if(!isdev()){
      return 'https://rtoken-api2.stafi.io'; 
    }else{
      return 'https://test-rtoken-api2.stafi.io';
    }  
  },
  stafiApi:"https://drop.stafi.io",
  rETHTokenAddress: ()=>{ 
    if(!isdev()){
      return '0x9559aaa82d9649c7a7b220e7c461d2e74c9a3593';
    }else{
      return '0x0ed54e1b7b3be1c02d91b4fa8bf5655f3fbe08b4';
    }  
  },
  stafiUserDepositAddress:()=> {
    if(!isdev()){
      return '0x430cf6dd3e289adae63b50ff661d6bba2dbb3f28';
    }else{
      return '0x6b3d7a220b96f3be9ff48e6be36a7e16f46b1393';
    }   
  },
  stafiNodeDepositAddress:() => { 
    if(!isdev()){
      return '0xafcf0e333614286d8e20000781121adb28cef33d';
    }else{
      return '0xf072c7e6e36639870c3986196237a97fcccb0331';
    }   
  },
  stafiNodeManagerAddress:() => { 
    if(!isdev()){
      return '0x4fd35afa32310eaa1354768be6ad2c5c6a62d572';
    }else{
      return '0x68b749894c5484687916d57616b5214cf9fc63cb';
    }   
  },
  stafiStakingPoolManagerAddress:()=> {
    if(!isdev()){
      return '0x7acd9bf3728f4223bf504b1a652cef5ad2e6420b';
    }else{
      return '0x3f1ea0333e9e1caba4ff3f4d44c0808a2eaa8468';
    }  
  },
  stafiStakingPoolQueueAddress:()=> { 
    if(!isdev()){
      return '0xeba81e821c8990e92f85d26aa428e45a8d26d1ab';
    }else{
      return '0x40a0f8f23dbc635b8e54c8b785c62269cad8ebf8';
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
  rMATICTokenAddress:()=>{
    if(!isdev()){
      return '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0';
    }else{
      return '0x499d11e0b6eac7c0593d8fb292dcbbf815fb29ae';
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
    }else if(type==Symbol.Matic){
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
    rethURL_pair:"https://v2.info.uniswap.org/pair/0x5f49da032defe35489ddb205f3dc66d8a76318b3",
    rfisURL:"https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xc82eb6dea0c93edb8b697b89ad1b13d19469d635",
    fisURL:"https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xef3a930e1ffffacd2fc13434ac81bd278b0ecc8d",
    rdotURL:"https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x505f5a4ff10985fe9f93f2ae3501da5fe665f08a",
    rksmURL:"https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x3c3842c4d3037ae121d69ea1e7a0b61413be806c",
    ratomURL:"https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xd01cb3d113a864763dd3977fe1e725860013b0ed",

  }
} 
 