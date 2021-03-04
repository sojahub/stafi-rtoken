import {
  web3Accounts,
  web3Enable
} from '@polkadot/extension-dapp';
import { ApiPromise, WsProvider } from '@polkadot/api';
import config from '@config/index';
import { KeypairType } from '@polkadot/util-crypto/types';
import { SubstrateKeyring } from '@keyring/SubstrateKeyring';

let stafiApi:any = null
export default class Index extends SubstrateKeyring{
  constructor(keypairType: KeypairType = 'sr25519') {
    super(keypairType);
    this._ss58_format = 20;
    this._symbol = 'fis';
  }
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
              'RFIS',
              'RDOT',
              'RKSM'
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
      },
      BondKey: {
          symbol: 'RSymbol',
          bond_id: 'H256'
      },
      BondRecord: {
          bonder: 'AccountId',
          symbol: 'RSymbol',
          era: 'u32',
          pubkey: 'Vec<u8>',
          pool: 'Vec<u8>',
          blockhash: 'Vec<u8>',
          txhash: 'Vec<u8>',
          amount: 'u128'
      },
      BondReason: {
          _enum: [
              'Pass',
              'BlockhashUnmatch',
              'TxhashUnmatch',
              'PubkeyUnmatch',
              'PoolUnmatch',
              'AmountUnmatch'
          ]
      },
      LinkChunk: {
          pool: 'Vec<u8>',
          bond_value: 'u128',
          unbond_value: 'u128'
      },
      BondUnlockChunk: {
          value: 'u128',
          era: 'u32'
      },
      WithdrawChunk: {
          who: 'AccountId',
          recipient: 'Vec<u8>',
          value: 'u128',
          pool: 'Vec<u8>'
      },
      RproposalStatus: {
          _enum: [
              'Initiated',
              'Approved',
              'Rejected',
              'Expired'
          ]
      },
      RproposalVotes: {
          votes_for: 'Vec<AccountId>',
          votes_against: 'Vec<AccountId>',
          status: 'RproposalStatus',
          expiry: 'BlockNumber'
      }
    };
    if (stafiApi) {
        return stafiApi;
    }

    stafiApi = this.createSubstrateApi(config.stafiChain(), types); 
    return stafiApi;
  }

  createSubstrateApi(provider:string, types:any) {
  const wsProvider = new WsProvider(provider);
    return ApiPromise.create({
        provider: wsProvider,
        types
    });
  }
  async transfer(poolAddress:string,amount:string){
    //const 
    const polkadotApi=await this.createStafiApi();
    polkadotApi.tx.balances.transfer(poolAddress, amount.toString()); 
  } 
}