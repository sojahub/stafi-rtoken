enum Symbol {
  Fis = 'fis',
  Xtz = 'xtz',
  Atom = 'atom',
  Ksm = 'ksm',
  Dot = 'dot',
  Icx = 'icx',
  Kava = 'kava',
  One = 'one',
  Matic = 'matic',
  Eth="eth"
}

enum rSymbol {
  Asset=-1,
  Fis = 0, 
  Dot = 1, 
  Ksm = 2,
  Atom = 3,
  Eth = 4,
}



const ACCOUNT_PREFIX = 'account:';
const MAX_PASS_LEN = 32;

const NONCE_LENGTH = 24;
const PKCS8_DIVIDER = new Uint8Array([161, 35, 3, 33, 0]);
const PKCS8_HEADER = new Uint8Array([48, 83, 2, 1, 1, 48, 5, 6, 3, 43, 101, 112, 4, 34, 4, 32]);
const PUB_LENGTH = 32;

const accountKey = (address: string): string =>
  `${ACCOUNT_PREFIX}${address}`;

const addressesKey = (symbol: string): string =>
  `${symbol}:addresses`;

export {
  Symbol,
  rSymbol,
  accountKey,
  addressesKey,
  MAX_PASS_LEN,
  NONCE_LENGTH,
  PKCS8_DIVIDER,
  PKCS8_HEADER,
  PUB_LENGTH
};