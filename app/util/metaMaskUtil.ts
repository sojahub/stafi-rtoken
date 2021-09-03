import config from '@config/index';

export const getMetaMaskTokenSymbol = (networkChainId: any) => {
  if (config.metaMaskNetworkIsGoerliEth(networkChainId)) {
    return 'ETH';
  }
  if (config.metaMaskNetworkIsBsc(networkChainId)) {
    return 'BSC';
  }
  if (config.metaMaskNetworkIsPolygon(networkChainId)) {
    return 'MATIC';
  }
  return 'ETH';
};

export const liquidityPlatformMatchMetaMask = (networkChainId: any, platform: string) => {
  if (platform === 'Ethereum') {
    return config.metaMaskNetworkIsGoerliEth(networkChainId);
  }
  if (platform === 'BSC') {
    return config.metaMaskNetworkIsBsc(networkChainId);
  }
  if (platform === 'Polygon') {
    return config.metaMaskNetworkIsPolygon(networkChainId);
  }
  return false;
};
