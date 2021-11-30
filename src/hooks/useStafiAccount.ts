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
    // setStafiPubKey(u8aToHex(fiskeyringInstance.decodeAddress(fisAccount && fisAccount.address)));
    setStafiPubKey(u8aToHex(fiskeyringInstance.decodeAddress('356g6BWEaaVBRuiR2zjvpr2gVUP8vPrB8onejKy6z1G62rhe')));
  }, [fisAccount]);

  return { fisAccount, stafiAddress, stafiPubKey };
}
