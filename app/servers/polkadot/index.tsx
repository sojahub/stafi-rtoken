import {
  web3Accounts,
  web3Enable
} from '@polkadot/extension-dapp';
import { ApiPromise, WsProvider } from '@polkadot/api';
import config from '@config/index';
import Stafi from '../stafi'


export default class ExtensionDapp{
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
}