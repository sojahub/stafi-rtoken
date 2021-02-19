import { Symbol } from './defaults'
import { KeyringStruct } from './types';
import { StafiKeyring } from './StafiKeyring';

export class Keyring {

  public init(symbol: string): KeyringStruct {
    switch (symbol) {
      case Symbol.Fis:
        return new StafiKeyring();
      default:
        return new StafiKeyring();
    }
  }

}

const keyringInstance = new Keyring();

export default keyringInstance;
