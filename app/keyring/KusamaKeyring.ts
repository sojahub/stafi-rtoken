import { KeypairType } from '@polkadot/util-crypto/types';
import { SubstrateKeyring } from './SubstrateKeyring';

export class KusamaKeyring extends SubstrateKeyring {

  constructor(keypairType: KeypairType = 'sr25519') {
    super(keypairType);
    this._ss58_format = 2;
    this._symbol = 'ksm';
  }
}
