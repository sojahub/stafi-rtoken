import { useSelector } from 'react-redux';

export function useMetaMaskAccount() {
  const metaMaskAddress = useSelector((state: any) => {
    // return '0x811248025667d94D3D0A36e752D416949a29d93a'; // rETH
    // return '0x78A55B9b3BBEffB36A43D9905F654d2769dC55e8'; // rFIS
    // return '0x7bfFCd7D2C17D534EDf4d1535c8c44324eb13A36'; // rDOT
    // return '0xBABf7e6b5bcE0BD749FD3C527374bEf8919cC7A9'; // rDOT BSC

    return state.globalModule.metaMaskAccount;
  });

  return { metaMaskAddress };
}
