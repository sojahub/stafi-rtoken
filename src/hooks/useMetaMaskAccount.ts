import { useSelector } from 'react-redux';

export function useMetaMaskAccount() {
  const { metaMaskAddress, metaMaskBalance, metaMaskNetworkId } = useSelector((state: any) => {
    // return '0x811248025667d94D3D0A36e752D416949a29d93a'; // rETH
    // return '0x78A55B9b3BBEffB36A43D9905F654d2769dC55e8'; // rFIS
    // return '0x7bfFCd7D2C17D534EDf4d1535c8c44324eb13A36'; // rDOT
    // return '0xBABf7e6b5bcE0BD749FD3C527374bEf8919cC7A9'; // rDOT BSC
    // return '0x1bfCC34DadaA1154bB5f6dC2b7923f3b5cC256f7'; // rATOM BSC

    return {
      metaMaskAddress: state.globalModule.metaMaskAddress,
      // metaMaskAddress: '0x1bfCC34DadaA1154bB5f6dC2b7923f3b5cC256f7',
      metaMaskBalance: state.globalModule.metaMaskBalance,
      metaMaskNetworkId: state.globalModule.metaMaskNetworkId,
    };
  });

  return { metaMaskAddress, metaMaskBalance, metaMaskNetworkId };
}
