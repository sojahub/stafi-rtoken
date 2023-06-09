import { hexToU8a } from '@polkadot/util';
import { mnemonicValidate } from '@polkadot/util-crypto';
import { PublicKey } from '@solana/web3.js';
import * as bip32 from 'bip32';
import base58 from 'bs58';
import * as crypto from 'crypto';
import Base from './Base';
import { KeyringPair, KeyringStruct } from './types';

const ENTROPY_SIZE = 256;
const MNEMONIC_TO_SEED_PASSWORD = '';

const DECODED_ADDRESS_LEN = 20;

export class SolKeyring extends Base implements KeyringStruct {
  protected _derivation_path = "m/44'/118'/0'/0/0";

  constructor() {
    super();
    this._symbol = 'sol';
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
    if (!address) {
      return false;
    }
    try {
      const decoded = this.decodeAddress(address);
      if (decoded.length != 32) {
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  public encodeAddress(pubKeyHex: any): string {
    return new PublicKey(hexToU8a(pubKeyHex)).toBase58();
  }

  public decodeAddress(accAddress: string): Buffer {
    return base58.decode(accAddress);
  }

  public sign(secretKey: string, message: string): any {
    // console.log(secretKey, message);
    return {};
  }

  private createAccountFromSeed(seed: Buffer): KeyringPair {
    const node = bip32.fromSeed(seed);
    const child = node.derivePath(this._derivation_path);

    const address = this.encodeAddress(this.hash160(child.publicKey));

    return {
      secretKey: '',
      publicKey: '',
      address: address,
    };
  }

  private hash160(buffer: Buffer): Buffer {
    const sha256Hash: Buffer = crypto.createHash('sha256').update(buffer).digest();
    try {
      return crypto.createHash('rmd160').update(sha256Hash).digest();
    } catch (err) {
      return crypto.createHash('ripemd160').update(sha256Hash).digest();
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
