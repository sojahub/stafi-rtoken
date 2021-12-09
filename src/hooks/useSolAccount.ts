import { u8aToHex } from '@polkadot/util';
import { PublicKey } from '@solana/web3.js';
import { useSelector } from 'react-redux';

export function useSolAccount() {
  const { solAddress, solPubKey } = useSelector((state: any) => {
    // const solAddress = '7rc4VzogeBV8Wyww1mMshELNDZFa6YtWYfEXaD6chphn';
    const solAddress = state.rSOLModule.solAddress;

    let solPubKey = '';
    try {
      solPubKey = solAddress ? u8aToHex(new PublicKey(solAddress).toBytes()) : '';
    } catch (err: any) {}

    return {
      solAddress,
      solPubKey,
    };
  });

  return { solAddress, solPubKey };
}
