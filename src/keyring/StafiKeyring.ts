import { KeypairType } from '@polkadot/util-crypto/types';
import { SubstrateKeyring } from './SubstrateKeyring';

export class StafiKeyring extends SubstrateKeyring {

  constructor(keypairType: KeypairType = 'sr25519') {
    super(keypairType);
    this._ss58_format = 20;
    this._symbol = 'fis';
  }
}
