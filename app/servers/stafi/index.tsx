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
          'RKSM',
          'RATOM'
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
      BondState: {
        _enum: [
          'Dealing',
          'Fail',
          'Success'
        ]
      },
      SigVerifyResult: {
        _enum: [
          'InvalidPubkey',
          'Fail',
          'Pass'
        ]
      },
      BondSnapshot: {
        symbol: 'RSymbol',
        era: 'u32',
        pool: 'Vec<u8>',
        bond: 'u128',
        unbond: 'u128',
        active: 'u128',
        last_voter: 'AccountId'
      },
      LinkChunk: {
        bond: 'u128',
        unbond: 'u128',
        active: 'u128'
      },
      OriginalTxType: {
        _enum: [
          'Transfer',
          'Bond',
          'Unbond',
          'WithdrawUnbond',
          'ClaimRewards'
        ]
      },
      Unbonding: {
        who: 'AccountId',
        value: 'u128',
        recipient: 'Vec<u8>'
      },
      UserUnlockChunk: {
        pool: 'Vec<u8>',
        unlock_era: 'u32',
        value: 'u128',
        recipient: 'Vec<u8>'
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
}