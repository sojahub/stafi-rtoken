import config from '@config/index';

export const metaMaskChainParameters = {
  ethMainnet: {
    chainId: '0x1',
    chainName: 'Ethereum Mainnet',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
    blockExplorerUrls: ['https://etherscan.io'],
  },
  ethGoerliTestnet: {
    chainId: '0x5',
    chainName: 'Goerli Testnet',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
    blockExplorerUrls: ['https://goerli.etherscan.io'],
  },
  bscMainnet: {
    chainId: '0x38',
    chainName: 'BSC Mainnet',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
    blockExplorerUrls: ['https://bscscan.com'],
  },
  bscTestnet: {
    chainId: '0x61',
    chainName: 'BSC Testnet',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://data-seed-prebsc-2-s3.binance.org:8545/'],
    blockExplorerUrls: ['https://testnet.bscscan.com'],
  },
  polygonMainnet: {
    chainId: '0x89',
    chainName: 'Polygon Mainnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: ['https://rpc-mainnet.matic.network'],
    blockExplorerUrls: ['https://polygonscan.com/'],
  },
  polygonTestnet: {
    chainId: '0x13881',
    chainName: 'Polygon Testnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
    blockExplorerUrls: ['https://mumbai.polygonscan.com'],
  },
};

export const metaMaskERC20TokenParameters = {
  rFIS: {
    tokenAddress: config.rFISTokenAddress(),
    tokenSymbol: 'rFIS',
    tokenDecimals: 18,
    tokenImage: '',
  },
  rDOT: {
    tokenAddress: config.rDOTTokenAddress(),
    tokenSymbol: 'rDOT',
    tokenDecimals: 18,
    tokenImage: '',
  },
  rKSM: {
    tokenAddress: config.rKSMTokenAddress(),
    tokenSymbol: 'rKSM',
    tokenDecimals: 18,
    tokenImage: '',
  },
  rMATIC: {
    tokenAddress: config.rMATICTokenAddress(),
    tokenSymbol: 'rMATIC',
    tokenDecimals: 18,
    tokenImage: '',
  },
  rATOM: {
    tokenAddress: config.rATOMTokenAddress(),
    tokenSymbol: 'rATOM',
    tokenDecimals: 18,
    tokenImage: '',
  },
};

export const metaMaskBEP20TokenParameters = {
  rFIS: {
    tokenAddress: config.rFISBep20TokenAddress(),
    tokenSymbol: 'rFIS',
    tokenDecimals: 18,
    tokenImage: '',
  },
  rDOT: {
    tokenAddress: config.rDOTBep20TokenAddress(),
    tokenSymbol: 'rDOT',
    tokenDecimals: 18,
    tokenImage: '',
  },
  rKSM: {
    tokenAddress: config.rKSMBep20TokenAddress(),
    tokenSymbol: 'rKSM',
    tokenDecimals: 18,
    tokenImage: '',
  },
  rMATIC: {
    tokenAddress: config.rMATICBep20TokenAddress(),
    tokenSymbol: 'rMATIC',
    tokenDecimals: 18,
    tokenImage: '',
  },
  rATOM: {
    tokenAddress: config.rATOMBep20TokenAddress(),
    tokenSymbol: 'rATOM',
    tokenDecimals: 18,
    tokenImage: '',
  },
  rBNB: {
    tokenAddress: config.rBNBBep20TokenAddress(),
    tokenSymbol: 'rBNB',
    tokenDecimals: 18,
    tokenImage: '',
  },
};
