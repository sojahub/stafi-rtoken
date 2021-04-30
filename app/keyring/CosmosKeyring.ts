
import { KeyringPair, KeyringStruct, KeyringJson } from './types';
import { mnemonicValidate } from '@polkadot/util-crypto';

import Base from './Base';

import * as bip32 from 'bip32';
import * as crypto from 'crypto';
import * as bech32 from "bech32";

const ENTROPY_SIZE = 256;
const MNEMONIC_TO_SEED_PASSWORD = '';

const DECODED_ADDRESS_LEN = 20;

export class CosmosKeyring extends Base implements KeyringStruct {

  protected _acc_addr_prefix = 'cosmos';
  protected _derivation_path = "m/44'/118'/0'/0/0";

  constructor() {
    super();
    this._symbol = 'atom';
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
    const seed = this.mnemonicToSeed(mnemonic, MNEMONIC_TO_SEED_PASSWORD);
    const keyringPair = this.createAccountFromSeed(seed);
    keyringPair.mnemonic = mnemonic;

    return keyringPair;
  }

  public createAccountFromSecretKey(secretKey: string): KeyringPair | undefined {
    if (!this.validateSecretKey(secretKey)) {
      return undefined;
    }

    return {
      mnemonic: '',
      secretKey: secretKey,
      publicKey: '',
      address: '',
    };
  }

  public checkAddress(address: string): boolean {
    if (!address || address.length < 0) {
      return false;
    }
    try {
      this.decodeAddress(address);
      return true;
    } catch (e) {
      return false;
    }
  }

  public encodeAddress(pubKeyHash: any): string {
    const words = bech32.toWords(pubKeyHash);
    return bech32.encode(this._acc_addr_prefix, words);
  }

  public decodeAddress(accAddress: string): Buffer {
    const { prefix, words } = bech32.decode(accAddress);
    if (prefix !== this._acc_addr_prefix) {
      throw Error("Wrong prefix");
    }

    const buffer = Buffer.from(bech32.fromWords(words));
    if (buffer.length !== DECODED_ADDRESS_LEN) {
      throw Error("Wrong decoded address len");
    }

    return buffer;
  }

  public sign(secretKey: string, message: string): any {
    console.log(secretKey, message);
    return {}
  }

  private createAccountFromSeed(seed: Buffer): KeyringPair {
    const node = bip32.fromSeed(seed);
    const child = node.derivePath(this._derivation_path);

    const address = this.encodeAddress(this.hash160(child.publicKey));

    return {
      secretKey: '',
      publicKey: '',
      address: address
    }
  }

  private hash160(buffer: Buffer): Buffer {
    const sha256Hash: Buffer = crypto.createHash('sha256')
      .update(buffer)
      .digest();
    try {
      return crypto.createHash('rmd160')
        .update(sha256Hash)
        .digest();
    } catch (err) {
      return crypto.createHash('ripemd160')
        .update(sha256Hash)
        .digest();
    }
  }

  private validateSecretKey(secretKey: string): boolean {
    let len = 0;
    try {
      // len = hexToU8a(secretKey).length;
    } catch (error) {
      return false;
    }
    
    return len == this._secLength;
  }

}
