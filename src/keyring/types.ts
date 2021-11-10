
export interface EncryptInfo {
  mnemonic: Uint8Array;
  secretKey: Uint8Array;
}

export interface KeyringPair {
  mnemonic?: string | null;
  secretKey: string;
  publicKey: string;
  address: string;
}

export interface KeyringJson$Meta {
  hardwareType?: 'ledger';
  isHardware?: boolean;
  isInjected?: boolean;
  isRecent?: boolean;
  isTesting?: boolean;
  name?: string;
  whenCreated?: number;
  whenEdited?: number;
  [index: string]: any;
}

export interface KeyringJson {
  publicKey: string;
  encoded: string;
  meta: KeyringJson$Meta;
}

export interface KeyringAddresses {
  currentIndex: number;
  addresses: string[];
}

export interface KeyringStruct {

  createAccount: () => KeyringPair | undefined;
  createMnemonic: () => string;
  createAccountFromMnemonic: (mnemonic: string, isValidate?: boolean) => KeyringPair | undefined;
  createAccountFromSecretKey: (secretKey: string) => KeyringPair | undefined;
  decodeAddress: (key: string) => Uint8Array;
  encodeAddress: (key: string | Uint8Array | Buffer) => string;
  checkAddress: (address: string) => boolean;
  sign: (secretKey: string, message: string) => any;

  // forgetAccount: (address: string) => void;
  // restoreAccountFromSecretKey: (secretKey: string) => KeyringPair;
  // restoreAccountFromMnemonic: (mnemonic: string) => KeyringPair;
}
