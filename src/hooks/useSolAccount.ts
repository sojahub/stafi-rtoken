import { u8aToHex } from '@polkadot/util';
import { PublicKey } from '@solana/web3.js';
import { useSelector } from 'react-redux';

export function useSolAccount() {
  const { solAddress, solPubKey } = useSelector((state: any) => {
    // return '7rc4VzogeBV8Wyww1mMshELNDZFa6YtWYfEXaD6chphn';
    let solPubKey = '';
    try {
      solPubKey = state.rSOLModule.solAddress
        ? u8aToHex(new PublicKey(state.rSOLModule.solAddress || '').toBytes())
        : '';
    } catch (err: any) {}

    console.log('sdfsdf', solPubKey);

    return {
      solAddress: state.rSOLModule.solAddress,
      solPubKey,
    };
  });

  return { solAddress, solPubKey };
}
