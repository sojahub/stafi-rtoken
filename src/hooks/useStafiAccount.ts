import { useSelector } from 'react-redux';
import { Symbol } from 'src/keyring/defaults';
import { u8aToHex } from '@polkadot/util';
import keyring from 'src/servers/index';
import { useEffect, useState } from 'react';

export function useStafiAccount() {
  const [stafiAddress, setStafiAddress] = useState<string>();
  const [stafiPubKey, setStafiPubKey] = useState<string>();

  const fisAccount = useSelector((state: any) => {
    return state.FISModule.fisAccount;
  });

  useEffect(() => {
    setStafiAddress(fisAccount && fisAccount.address);
    const fiskeyringInstance = keyring.init(Symbol.Fis);
    if (fisAccount && fisAccount.address) {
      setStafiPubKey(u8aToHex(fiskeyringInstance.decodeAddress(fisAccount && fisAccount.address)));
    }
    // setStafiPubKey(u8aToHex(fiskeyringInstance.decodeAddress('33URnrxK5jBoPaZ1hMjj7yMG27aimxbSruYpBZsRFBkbsJne'))); // rSOL
    // setStafiPubKey(u8aToHex(fiskeyringInstance.decodeAddress('356g6BWEaaVBRuiR2zjvpr2gVUP8vPrB8onejKy6z1G62rhe')));
    // setStafiPubKey('0x9e67deed3fe9f65db718ee8eea83766824db1b9c2415ae7a605db10c5b58437a'); // Unbond rDOT
    // setStafiPubKey('0xdedcd54a866bddc6130a1f8634e3b2996f5d4e37cae227e309286154afcd6e38'); // Unbond rATOM
  }, [fisAccount]);

  return { fisAccount, stafiAddress, stafiPubKey };
}
