import { Symbol } from './defaults'
import { KeyringStruct } from './types';
import { StafiKeyring } from './StafiKeyring';
import { PolkadotKeyring } from './PolkadotKeyring';
import { KusamaKeyring } from './KusamaKeyring';

export class Keyring {

  public init(symbol: string): KeyringStruct {
    switch (symbol) {
      case Symbol.Fis:
        return new StafiKeyring();
      case Symbol.Dot:
        return new PolkadotKeyring();
      case Symbol.Ksm:
        return new KusamaKeyring();
      default:
        return new StafiKeyring();
    }
  }

}

const keyringInstance = new Keyring();

export default keyringInstance;
