import {
  web3Accounts,
  web3Enable
} from '@polkadot/extension-dapp';
import { ApiPromise, WsProvider } from '@polkadot/api';
import config from '@config/index';
import Stafi from '../stafi'

import { KeypairType } from '@polkadot/util-crypto/types';
import { SubstrateKeyring } from '@keyring/SubstrateKeyring';

 
export default class ExtensionDapp extends SubstrateKeyring{
  constructor(keypairType: KeypairType = 'sr25519') {
    super(keypairType);
    this._ss58_format = 0;
    this._symbol = 'dot';
  }
  connectPolkadotjs() {
    const stafi=new Stafi();
    return web3Enable(stafi.getWeb3EnalbeName()).then(() => web3Accounts());
  } 
  createSubstrateApi(types?:any) {
    const wsProvider = new WsProvider(config.polkadotChain());
    return ApiPromise.create({
        provider: wsProvider,
        types
    });
  }
  transfer(){
    //const 
  }
  
}

