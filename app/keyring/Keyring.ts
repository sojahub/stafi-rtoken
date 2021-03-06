import { Symbol } from './defaults'
import { KeyringStruct } from './types';
import { StafiKeyring } from './StafiKeyring';
import { PolkadotKeyring } from './PolkadotKeyring';

export class Keyring {

  public init(symbol: string): KeyringStruct {
    switch (symbol) {
      case Symbol.Fis:
        return new StafiKeyring();
      case Symbol.Dot:
        return new PolkadotKeyring();
      default:
        return new StafiKeyring();
    }
  }

}

const keyringInstance = new Keyring();

export default keyringInstance;
