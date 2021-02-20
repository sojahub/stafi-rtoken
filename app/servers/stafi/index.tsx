import {
  web3Accounts,
  web3Enable
} from '@polkadot/extension-dapp';
import { ApiPromise, WsProvider } from '@polkadot/api';
import config from '@config/index';

let stafiApi:any = null
export default class Index {

  getWeb3EnalbeName () {
    return 'stafi/rtoken';
  }

  getPolkadotJsSource () {
    return 'polkadot-js';
  }

  createStafiApi() {
    const types = {
        RefCount: 'u32',
        ChainId: 'u8',
        ResourceId: '[u8; 32]',
        DepositNonce: 'u64',
        RateType: 'u64',
        AccountRData: {
            free: 'u128'
        },
        RSymbol: {
            _enum: [
                'RFIS'
            ]
        },
        ProposalStatus: {
            _enum: [
              'Active',
              'Passed',
              'Expired',
              'Executed'
            ]
        },
        ProposalVotes: {
            voted: 'Vec<AccountId>',
            status: 'ProposalStatus',
            expiry: 'BlockNumber'
        }
    };
    if (stafiApi) {
        return stafiApi;
    }

    stafiApi = this.createSubstrateApi(config.stafiChain(), types);
    console.log(stafiApi,"=======stafiApistafiApistafiApistafiApistafiApi")
    return stafiApi;
}

createSubstrateApi(provider:string, types:any) {
  const wsProvider = new WsProvider(provider);
    return ApiPromise.create({
        provider: wsProvider,
        types
    });
  }
}