import { KeypairType } from '@polkadot/util-crypto/types';
import { SubstrateKeyring } from './SubstrateKeyring';

export class PolkadotKeyring extends SubstrateKeyring {

  constructor(keypairType: KeypairType = 'sr25519') {
    super(keypairType);
    this._ss58_format = 0;
    this._symbol = 'dot';
  }
}
