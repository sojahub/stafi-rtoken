import * as crypto from 'crypto';
import keyring from 'src/servers/index';
import { u8aToHex } from '@polkadot/util';

export function testBuffer() {
  const bf = crypto.createHash('sha256').update('global:transfer_out').digest();
  // const methodData = bf.subarray(0, 8);
  const methodData = bf.slice(0, 8);
  // amount, LittleEndian
  const num = BigInt(Number(0.01) * 1000000000);
  const ab = new ArrayBuffer(8);
  new DataView(ab).setBigInt64(0, num, true);
  // const amountBf = hexToU8a('0x' + num.toString(16));
  const amountData = Buffer.from(ab);
  // hex: 20 00 00 00
  const addressLengthData = Buffer.from([32, 0, 0, 0]).slice(0, 4);
  const keyringInstance = keyring.init('fis');
  const addressData = keyringInstance.decodeAddress('33NxiwQpqXKUMkcB4dsFUubJSHsyUn5o1xbC2bASSsV8v4TS');
  const chanIdData = Buffer.from([1]).slice(0, 1);
  const bufferAddressData = Buffer.from(addressData);
  const data = Buffer.concat([methodData, amountData, addressLengthData, bufferAddressData, chanIdData]);

  console.log('data', data);
}
