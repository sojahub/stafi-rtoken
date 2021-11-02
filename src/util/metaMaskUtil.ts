import { message } from 'antd';
import config, { isdev } from 'src/config/index';
import { BSC_CHAIN_ID, ETH_CHAIN_ID } from 'src/features/bridgeClice';
import { metaMaskBEP20TokenParameters, metaMaskChainParameters, metaMaskERC20TokenParameters } from './constants';

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

export const requestAddTokenToMetaMask = async (tokenType: string, destChainId: number) => {
  let parameters: any;
  if (destChainId === ETH_CHAIN_ID) {
    if (tokenType === 'rfis') {
      parameters = metaMaskERC20TokenParameters.rFIS;
    } else if (tokenType === 'rdot') {
      parameters = metaMaskERC20TokenParameters.rDOT;
    } else if (tokenType === 'rksm') {
      parameters = metaMaskERC20TokenParameters.rKSM;
    } else if (tokenType === 'rmatic') {
      parameters = metaMaskERC20TokenParameters.rMATIC;
    } else if (tokenType === 'ratom') {
      parameters = metaMaskERC20TokenParameters.rATOM;
    }
  } else if (destChainId === BSC_CHAIN_ID) {
    if (tokenType === 'rfis') {
      parameters = metaMaskBEP20TokenParameters.rFIS;
    } else if (tokenType === 'rdot') {
      parameters = metaMaskBEP20TokenParameters.rDOT;
    } else if (tokenType === 'rksm') {
      parameters = metaMaskBEP20TokenParameters.rKSM;
    } else if (tokenType === 'rmatic') {
      parameters = metaMaskBEP20TokenParameters.rMATIC;
    } else if (tokenType === 'ratom') {
      parameters = metaMaskBEP20TokenParameters.rATOM;
    }else if (tokenType === 'rbnb') {
      parameters = metaMaskBEP20TokenParameters.rBNB;
    }
  }

  if (!parameters) {
    return;
  }

  if (typeof ethereum !== 'undefined' && ethereum.isMetaMask) {
    try {
      ethereum.request({ method: 'eth_chainId' }).then((chainId: any) => {
        if (destChainId === ETH_CHAIN_ID && chainId !== config.ethChainId()) {
          message.warn('Please switch MetaMask to Ethereum Mainnet first');
          requestSwitchMetaMaskNetwork('Ethereum');
          return;
        }
        if (destChainId === BSC_CHAIN_ID && chainId !== config.bscChainId()) {
          message.warn('Please switch MetaMask to BSC Mainnet first');
          requestSwitchMetaMaskNetwork('BSC');
          return;
        }

        // wasAdded is a boolean. Like any RPC method, an error may be thrown.
        ethereum
          .request({
            method: 'wallet_watchAsset',
            params: {
              type: 'ERC20', // Initially only supports ERC20, but eventually more!
              options: {
                address: parameters.tokenAddress, // The address that the token is at.
                symbol: parameters.tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
                decimals: parameters.tokenDecimals, // The number of decimals in the token
                image: parameters.tokenImage, // A string url of the token logo
              },
            },
          })
          .then((wasAdded: boolean) => {
            if (wasAdded) {
              console.log('Thanks for your interest!');
            } else {
              console.log('Your loss!');
            }
          });
      });
    } catch (error: any) {
      console.log(error);
    }
  }
};