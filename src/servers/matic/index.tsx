import { SigningStargateClient } from '@cosmjs/stargate';
import { message } from 'antd';
import config, { isdev } from 'src/config/index';
import { CosmosKeyring } from 'src/keyring/CosmosKeyring';
import { timeout } from 'src/util/common';
declare const window: any;
let cosmosApi: any = null;

export default class ExtensionDapp extends CosmosKeyring {
  constructor() {
    super();
    this._symbol = 'atom';
  }
  async connectAtomjs() {
    await timeout(500);

    if (!window.getOfflineSigner || !window.keplr) {
      message.error('Please install Keplr extension');
    } else {
      if (isdev()) {
        if (window.keplr.experimentalSuggestChain) {
          let parameter = {
            // Chain-id of the Cosmos SDK chain.
            chainId: config.rAtomChainId(),
            // The name of the chain to be displayed to the user.
            chainName: 'Cosmos-stargate',
            // RPC endpoint of the chain.
            rpc: 'https://testcosmosrpc.wetez.io',
            // REST endpoint of the chain.
            rest: 'https://testcosmosrset.wetez.io',
            // Staking coin information
            stakeCurrency: {
              // Coin denomination to be displayed to the user.
              coinDenom: 'MUON',
              // Actual denom (i.e. uatom, uscrt) used by the blockchain.
              coinMinimalDenom: 'umuon',
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
              bech32PrefixAccAddr: 'cosmos',
              bech32PrefixAccPub: 'cosmospub',
              bech32PrefixValAddr: 'cosmosvaloper',
              bech32PrefixValPub: 'cosmosvaloperpub',
              bech32PrefixConsAddr: 'cosmosvalcons',
              bech32PrefixConsPub: 'cosmosvalconspub',
            },
            // List of all coin/tokens used in this chain.
            currencies: [
              {
                // Coin denomination to be displayed to the user.
                coinDenom: 'MUON',
                // Actual denom (i.e. uatom, uscrt) used by the blockchain.
                coinMinimalDenom: 'umuon',
                // # of decimal points to convert minimal denomination to user-facing denomination.
                coinDecimals: 6,
              },
            ],
            // List of coin/tokens used as a fee token in this chain.
            feeCurrencies: [
              {
                // Coin denomination to be displayed to the user.
                coinDenom: 'MUON',
                // Actual denom (i.e. uatom, uscrt) used by the blockchain.
                coinMinimalDenom: 'umuon',
                // # of decimal points to convert minimal denomination to user-facing denomination.
                coinDecimals: 6,
              },
            ],
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
              high: 0.04,
            },
          };
          try {
            // Keplr v0.6.4 introduces an experimental feature that supports the feature to suggests the chain from a webpage.
            // cosmoshub-3 is integrated to Keplr so the code should return without errors.
            // The code below is not needed for cosmoshub-3, but may be helpful if you’re adding a custom chain.
            // If the user approves, the chain will be added to the user's Keplr extension.
            // If the user rejects it or the suggested chain information doesn't include the required fields, it will throw an error.
            // If the same chain id is already registered, it will resolve and not require the user interactions.
            await window.keplr.experimentalSuggestChain(parameter);
          } catch {
            message.error('Failed to suggest the chain');
          }
        } else {
          message.error('Please use the recent version of keplr extension');
        }
      }
    }
    return await window.keplr.enable(config.rAtomChainId());
  }
  async getAccounts() {
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
  getTokenAddress() {
    return config.rMATICTokenAddress();
  }
  getMaticTokenAddress() {
    return config.MATICTokenAddress();
  }

  getTokenAbi() {
    const abi =
      '[{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"mint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"addMinter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"renounceMinter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"isMinter","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_symbol","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"}],"name":"MinterAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"}],"name":"MinterRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"}]';
    return JSON.parse(abi);
  }
}
