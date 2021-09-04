import config, { isdev } from '@config/index';
import { metaMaskChainParameters } from './constants';

declare const ethereum: any;

export const getMetaMaskTokenSymbol = (networkChainId: any) => {
  if (config.metaMaskNetworkIsGoerliEth(networkChainId)) {
    return 'ETH';
  }
  if (config.metaMaskNetworkIsBsc(networkChainId)) {
    return 'BNB';
  }
  if (config.metaMaskNetworkIsPolygon(networkChainId)) {
    return 'MATIC';
  }
  return 'ETH';
};

export const getLpPlatformFromUrl = (url: any) => {
  if (url.includes('rPool/lp/Ethereum')) {
    return 'Ethereum';
  }
  if (url.includes('rPool/lp/BSC')) {
    return 'BSC';
  }
  if (url.includes('rPool/lp/Polygon')) {
    return 'Polygon';
  }
  return '';
};

export const getLpMetaMaskNetworkName = (url: string) => {
  if (url.includes('rPool/lp/Ethereum')) {
    if (!isdev()) {
      return 'Ethereum Mainnet';
    } else {
      return 'Ethereum Testnet';
    }
  }
  if (url.includes('rPool/lp/BSC')) {
    if (!isdev()) {
      return 'BSC Mainnet';
    } else {
      return 'BSC Testnet';
    }
  }
  if (url.includes('rPool/lp/Polygon')) {
    if (!isdev()) {
      return 'Polygon Mainnet';
    } else {
      return 'Polygon Testnet';
    }
  }
  return '';
};

export const getLpPrefix = (url: string) => {
  if (url.includes('rPool/lp/Ethereum')) {
    return 'UNI-V2 ';
  }
  if (url.includes('rPool/lp/BSC')) {
    return 'PANCAKE ';
  }
  if (url.includes('rPool/lp/Polygon')) {
    return 'QUICKSWAP ';
  }
  return '';
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

export const requestSwitchMetaMaskNetwork = async (platform: any) => {
  if (typeof ethereum !== 'undefined' && ethereum.isMetaMask) {
    let targetChainId = '';
    let targetChainParameter = null;
    if (platform === 'Ethereum') {
      targetChainId = config.metaMaskEthNetworkId();
      if (!isdev()) {
        targetChainParameter = metaMaskChainParameters.ethMainnet;
      } else {
        targetChainParameter = metaMaskChainParameters.ethGoerliTestnet;
      }
    }

    if (platform === 'BSC') {
      targetChainId = config.metaMaskBscNetworkId();
      if (!isdev()) {
        targetChainParameter = metaMaskChainParameters.bscMainnet;
      } else {
        targetChainParameter = metaMaskChainParameters.bscTestnet;
      }
    }

    if (platform === 'Polygon') {
      targetChainId = config.metaMaskPolygonNetworkId();
      if (!isdev()) {
        targetChainParameter = metaMaskChainParameters.polygonMainnet;
      } else {
        targetChainParameter = metaMaskChainParameters.polygonTestnet;
      }
    }

    if (!targetChainId || !targetChainParameter) {
      return;
    }

    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: targetChainId }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [targetChainParameter],
          });
        } catch (addError) {
          console.error('addError: ', addError.message);
        }
      } else {
        console.error('switchError:', switchError.message);
      }
    }
  }
};
