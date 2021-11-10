import { Symbol } from 'src/keyring/defaults';
import { KeyringStruct } from 'src/keyring/types';
// import { PolkadotKeyring } from './PolkadotKeyring';
import CosmosKeyring from './atom/index';
import KusamaKeyring from './ksm/index';
import PolkadotKeyring from './polkadot';
import SolKeyring from './sol/index';
// import { TezosKeyring } from './TezosKeyring';
import StafiKeyring from './stafi/index';
// import { KavaKeyring } from './KavaKeyring';
// import { HarmonyKeyring } from './HarmonyKeyring';

export class Keyring {
  public init(symbol: string): KeyringStruct {
    switch (symbol) {
      case Symbol.Xtz:
      //return new TezosKeyring();
      case Symbol.Fis:
        return new StafiKeyring();
      case Symbol.Ksm:
        return new KusamaKeyring();
      case Symbol.Sol:
        return new SolKeyring();
      case Symbol.Dot:
        return new PolkadotKeyring();
      case Symbol.Atom:
        return new CosmosKeyring();
      case Symbol.Kava:
      //return new KavaKeyring();
      case Symbol.One:
      //return new HarmonyKeyring();
      default:
        //return new PolkadotKeyring();
        return new StafiKeyring();
    }
  }
}

const keyringInstance = new Keyring();

export default keyringInstance;
