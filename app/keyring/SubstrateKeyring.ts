
import { KeyringPair, KeyringStruct, KeyringJson } from './types';
import {
  naclKeypairFromSeed as naclFromSeed,
  schnorrkelKeypairFromSeed as schnorrkelFromSeed,
  checkAddress, encodeAddress, decodeAddress, mnemonicToMiniSecret, mnemonicValidate
} from '@polkadot/util-crypto';
import { stringToU8a, u8aToString, u8aToHex, hexToU8a } from '@polkadot/util';
import { KeypairType } from '@polkadot/util-crypto/types';
import Base from './Base';

const ENTROPY_SIZE = 128;
const MNEMONIC_TO_SEED_PASSWORD = '';

export class SubstrateKeyring extends Base implements KeyringStruct {

  private _type: KeypairType;

  protected _ss58_format = 42;

  constructor(keypairType: KeypairType = 'sr25519') {
    super();
    this._symbol = 'sub';
    this._type = keypairType;
  }

  public createAccount(): KeyringPair | undefined {
    const mnemonic = this.createMnemonic();
    return this.createAccountFromMnemonic(mnemonic);
  }

  public createMnemonic(): string {
    return super.createMnemonic(ENTROPY_SIZE);
  }

  public createAccountFromMnemonic(mnemonic: string, isValidate = false): KeyringPair | undefined {
    if (isValidate && !mnemonicValidate(mnemonic)) {
      return undefined;
    }
    const seed = mnemonicToMiniSecret(mnemonic, MNEMONIC_TO_SEED_PASSWORD);
    const keyringPair = this.createAccountFromSeed(seed);
    keyringPair.mnemonic = mnemonic;

    return keyringPair;
  }

  public createAccountFromSecretKey(secretKey: string): KeyringPair | undefined {
    if (!this.validateSecretKey(secretKey)) {
      return undefined;
    }

    const publicKey = hexToU8a(secretKey).slice(32);
    return {
      mnemonic: '',
      secretKey: secretKey,
      publicKey: u8aToHex(publicKey),
      address: this.encodeAddress(publicKey),
    };
  }

  public checkAddress(address: string): boolean {
    if (!address || address.length < 0) {
      return false;
    }
    try {
      const [isValid, _] = checkAddress(address, this._ss58_format);
      return isValid;
    } catch (e) {
      return false;
    }
  }

  public encodeAddress(publicKey: string | Uint8Array): string {
    return encodeAddress(publicKey, this._ss58_format);
  }

  public decodeAddress(key: string): Uint8Array {
    return decodeAddress(key);
  }

  public sign(secretKey: string, message: string): any {
    console.log(secretKey, message);
    return {}
  }

  private createAccountFromSeed(seed: Uint8Array): KeyringPair {
    const keypair = this._type === 'sr25519'
      ? schnorrkelFromSeed(seed)
      : naclFromSeed(seed);

    const secretKey = u8aToHex(keypair.secretKey);
    const publicKey = u8aToHex(keypair.publicKey);

    const address = this.encodeAddress(keypair.publicKey);

    return {
      secretKey: secretKey,
      publicKey: publicKey,
      address: address
    }
  }

  private validateSecretKey(secretKey: string): boolean {
    let len = 0;
    try {
      len = hexToU8a(secretKey).length;
    } catch (error) {
      return false;
    }
    
    return len == this._secLength;
  }
}
