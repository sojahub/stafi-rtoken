

import { ApiPromise, WsProvider } from '@polkadot/api';
import config from '../config/env';

var stafiApi = null;

export default {

    getWeb3EnalbeName: function () {
        return 'stafi/rtoken';
    },

    getPolkadotJsSource: function () {
        return 'polkadot-js';
    },

    createStafiApi: function () {
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

        stafiApi = this.createSubstrateApi(config.apis.stafiChain, types);

        return stafiApi;
    },
    
    createSubstrateApi: function (provider, types) {
        const wsProvider = new WsProvider(provider);
        return ApiPromise.create({
            provider: wsProvider,
            types
        });
   }

}
