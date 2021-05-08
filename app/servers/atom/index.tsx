import config,{isdev} from '@config/index'; 
import {CosmosKeyring} from '@keyring/CosmosKeyring';
import { SigningStargateClient } from '@cosmjs/stargate';
import { message } from 'antd';
declare const window: any;
let cosmosApi:any = null; 

export default class ExtensionDapp extends CosmosKeyring{
  constructor() {
    super(); 
    this._symbol = 'atom';
  }
  async connectAtomjs() {
    if (!window.getOfflineSigner || !window.keplr) { 
      message.error("Please install Keplr extension");
    } else {
      if (isdev()) {
        if (window.keplr.experimentalSuggestChain) {
          let parameter = {
              // Chain-id of the Cosmos SDK chain.
              chainId: config.rAtomChainId(),
              // The name of the chain to be displayed to the user.
              chainName: "Cosmos-stargate",
              // RPC endpoint of the chain.
              rpc: "https://testcosmosrpc.wetez.io",
              // REST endpoint of the chain.
              rest: "https://testcosmosrset.wetez.io",
              // Staking coin information
              stakeCurrency: {
                  // Coin denomination to be displayed to the user.
                  coinDenom: "MUON",
                  // Actual denom (i.e. uatom, uscrt) used by the blockchain.
                  coinMinimalDenom: "umuon",
                  // # of decimal points to convert minimal denomination to user-facing denomination.
                  coinDecimals: 6,
              },
              // (Optional) If you have a wallet webpage used to stake the coin then provide the url to the website in `walletUrlForStaking`.
              // The 'stake' button in Keplr extension will link to the webpage.
              // walletUrlForStaking: "",
              // The BIP44 path.
              bip44: {
                  // You can only set the coin type of BIP44.
                  // 'Purpose' is fixed to 44.
                  coinType: 118,
              },
              // Bech32 configuration to show the address to user.
              bech32Config: {
                  bech32PrefixAccAddr: "cosmos",
                  bech32PrefixAccPub: "cosmospub",
                  bech32PrefixValAddr: "cosmosvaloper",
                  bech32PrefixValPub: "cosmosvaloperpub",
                  bech32PrefixConsAddr: "cosmosvalcons",
                  bech32PrefixConsPub: "cosmosvalconspub"
              },
              // List of all coin/tokens used in this chain.
              currencies: [{
                  // Coin denomination to be displayed to the user.
                  coinDenom: "MUON",
                  // Actual denom (i.e. uatom, uscrt) used by the blockchain.
                  coinMinimalDenom: "umuon",
                  // # of decimal points to convert minimal denomination to user-facing denomination.
                  coinDecimals: 6,
              }],
              // List of coin/tokens used as a fee token in this chain.
              feeCurrencies: [{
                  // Coin denomination to be displayed to the user.
                  coinDenom: "MUON",
                  // Actual denom (i.e. uatom, uscrt) used by the blockchain.
                  coinMinimalDenom: "umuon",
                  // # of decimal points to convert minimal denomination to user-facing denomination.
                  coinDecimals: 6,
              }],
              // (Optional) The number of the coin type.
              // This field is only used to fetch the address from ENS.
              // Ideally, it is recommended to be the same with BIP44 path's coin type.
              // However, some early chains may choose to use the Cosmos Hub BIP44 path of '118'.
              // So, this is separated to support such chains.
              coinType: 118,
              // (Optional) This is used to set the fee of the transaction.
              // If this field is not provided, Keplr extension will set the default gas price as (low: 0.01, average: 0.025, high: 0.04).
              // Currently, Keplr doesn't support dynamic calculation of the gas prices based on on-chain data.
              // Make sure that the gas prices are higher than the minimum gas prices accepted by chain validators and RPC/REST endpoint.
              gasPriceStep: {
                  low: 0.01,
                  average: 0.025,
                  high: 0.04
              }
          }
          try {
              // Keplr v0.6.4 introduces an experimental feature that supports the feature to suggests the chain from a webpage.
              // cosmoshub-3 is integrated to Keplr so the code should return without errors.
              // The code below is not needed for cosmoshub-3, but may be helpful if you’re adding a custom chain.
              // If the user approves, the chain will be added to the user's Keplr extension.
              // If the user rejects it or the suggested chain information doesn't include the required fields, it will throw an error.
              // If the same chain id is already registered, it will resolve and not require the user interactions.
              await window.keplr.experimentalSuggestChain(parameter);
          } catch {
             message.error("Failed to suggest the chain");
          }
        } else {
          message.error("Please use the recent version of keplr extension");
        }
      }
    }  
    return await window.keplr.enable(config.rAtomChainId());
  } 
  async getAccounts(){ 
    return await window.keplr.getKey(config.rAtomChainId()); 
  }
  createApi() {
    if (cosmosApi) {
      return cosmosApi;
    }
    const offlineSigner = window.getOfflineSigner(config.rAtomChainId());
    cosmosApi = SigningStargateClient.connectWithSigner(config.rAtomCosmosChainRpc(), offlineSigner);
    return cosmosApi;
  }
  getRATOMTokenAddress() {
    return config.rATOMTokenAddress();
  }
  
  getTokenAbi(){ 
    const abi = '[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MINTER_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PAUSER_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burnFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getRoleMember","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleMemberCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"}]';
    return JSON.parse(abi);
  }
}


