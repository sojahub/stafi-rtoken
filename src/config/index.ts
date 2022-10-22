import { clusterApiUrl } from '@solana/web3.js';
import { rSymbol, Symbol } from 'src/keyring/defaults';

export const isdev = () => {
  let host = window.location.host;
  var local = /192\.168\./.test(host) || /127\.0\./.test(host) || /localhost/.test(host);
  let demo = /test/.test(host);
  return local || demo;
};

export const getRsymbolByTokenType = (tokenType: string) => {
  switch (tokenType) {
    case 'reth':
      return rSymbol.Eth;
    case 'rfis':
      return rSymbol.Fis;
    case 'rdot':
      return rSymbol.Dot;
    case 'rksm':
      return rSymbol.Ksm;
    case 'ratom':
      return rSymbol.Atom;
    case 'rsol':
      return rSymbol.Sol;
    case 'rmatic':
      return rSymbol.Matic;
    case 'rbnb':
      return rSymbol.Bnb;
    default:
      return rSymbol.Fis;
  }
};

export const getRsymbolByTokenTitle = (tokenType: string) => {
  switch (tokenType) {
    case 'rETH':
      return rSymbol.Eth;
    case 'rFIS':
      return rSymbol.Fis;
    case 'rDOT':
      return rSymbol.Dot;
    case 'rKSM':
      return rSymbol.Ksm;
    case 'rATOM':
      return rSymbol.Atom;
    case 'rSOL':
      return rSymbol.Sol;
    case 'rMATIC':
      return rSymbol.Matic;
    case 'rBNB':
      return rSymbol.Bnb;
    default:
      return rSymbol.Fis;
  }
};

export const getSymbolByRSymbol = (symbol: rSymbol) => {
  switch (symbol) {
    case rSymbol.Eth:
      return Symbol.Eth;
    case rSymbol.Fis:
      return Symbol.Fis;
    case rSymbol.Dot:
      return Symbol.Dot;
    case rSymbol.Ksm:
      return Symbol.Ksm;
    case rSymbol.Atom:
      return Symbol.Atom;
    case rSymbol.Sol:
      return Symbol.Sol;
    case rSymbol.Matic:
      return Symbol.Matic;
    case rSymbol.Bnb:
      return Symbol.Bnb;
    default:
      return Symbol.Fis;
  }
};

export const getSymbolRTitle = (symbol: rSymbol) => {
  switch (symbol) {
    case rSymbol.Eth:
      return 'rETH';
    case rSymbol.Fis:
      return 'rFIS';
    case rSymbol.Dot:
      return 'rDOT';
    case rSymbol.Ksm:
      return 'rKSM';
    case rSymbol.Atom:
      return 'rATOM';
    case rSymbol.Sol:
      return 'rSOL';
    case rSymbol.Matic:
      return 'rMATIC';
    case rSymbol.Bnb:
      return 'rBNB';
    default:
      return 'rFIS';
  }
};

export const getSymbolTitle = (symbol: rSymbol) => {
  switch (symbol) {
    case rSymbol.Eth:
      return 'ETH';
    case rSymbol.Fis:
      return 'FIS';
    case rSymbol.Dot:
      return 'DOT';
    case rSymbol.Ksm:
      return 'KSM';
    case rSymbol.Atom:
      return 'ATOM';
    case rSymbol.Sol:
      return 'SOL';
    case rSymbol.Matic:
      return 'MATIC';
    case rSymbol.Bnb:
      return 'BNB';
    default:
      return 'FIS';
  }
};

const config = {
  polkadotChain: () => {
    if (!isdev()) {
      return 'wss://rpc.polkadot.io';
    } else {
      return 'wss://polkadot-test-rpc.stafi.io';
    }
  },
  stafiChain: () => {
    if (!isdev()) {
      return 'wss://mainnet-rpc.stafi.io';
    } else {
      return 'wss://stafi-seiya.stafi.io';
      // return 'wss://stafi-seiya-rewrite.stafi.io';
    }
  },
  kusamaChain: () => {
    if (!isdev()) {
      return 'wss://kusama-rpc.polkadot.io';
    } else {
      return 'wss://kusama-test-rpc.stafi.io';
    }
  },
  solRpcApi: () => {
    if (!isdev()) {
      // return clusterApiUrl('mainnet-beta');
      // return 'https://solana.public-rpc.com';
      return 'https://mainnet-rpc.wetez.io/solana/v1/c06bde6963933337ce7cf260c8aa16a5';
    } else {
      // return clusterApiUrl('devnet');

      return 'https://solana-dev-rpc.wetez.io';
    }
  },
  solRpcWs: () => {
    if (!isdev()) {
      // return clusterApiUrl('mainnet-beta');
      return 'wss://mainnet-rpc.wetez.io/ws/solana/v1/c06bde6963933337ce7cf260c8aa16a5';
    } else {
      // return '';
      // return clusterApiUrl('devnet');
      return 'wss://solana-dev-wss.wetez.io';
    }
  },
  ethProviderUrl: () => {
    if (!isdev()) {
      return 'wss://eth-mainnet.ws.alchemyapi.io/v2/bkdml_X06uuwFV4-KONSO3NoPHkIIv8Z';
    } else {
      return 'wss://eth-goerli.alchemyapi.io/v2/O4w9rgihCPcRvH1IDF2BHLt5YSzSI9oJ';
    }
  },
  bscProviderUrl: () => {
    if (!isdev()) {
      return 'wss://speedy-nodes-nyc.moralis.io/5a284cffde906505c6eb2af8/bsc/mainnet/ws';
    } else {
      return 'wss://speedy-nodes-nyc.moralis.io/5a284cffde906505c6eb2af8/bsc/testnet/ws';
    }
  },
  polygonProviderUrl: () => {
    if (!isdev()) {
      return 'wss://rpc-mainnet.matic.network';
    } else {
      return 'wss://matic-testnet-archive-ws.bwarelabs.com';
    }
  },
  solWalletProviderUrl: () => {
    return 'https://www.sollet.io';
  },
  api: () => {
    if (!isdev()) {
      return 'https://rtoken-api.stafi.io';
    } else {
      return 'https://rtoken-api.stafi.io';
    }
  },
  api2: () => {
    if (!isdev()) {
      return 'https://rtoken-api2.stafi.io';
    } else {
      return 'https://test-rtoken-api2.stafi.io';
    }
  },
  stafiApi: 'https://drop.stafi.io',
  rETHTokenAddress: () => {
    if (!isdev()) {
      return '0x9559aaa82d9649c7a7b220e7c461d2e74c9a3593';
    } else {
      // Goerli
      return '0x0ed54e1b7b3be1c02d91b4fa8bf5655f3fbe08b4';
    }
  },
  stafiUserDepositAddress: () => {
    if (!isdev()) {
      return '0x625b7fd68b35ee8dc2c9405a712fa450ccd357be';
    } else {
      return '0x6b3d7a220b96f3be9ff48e6be36a7e16f46b1393';
    }
  },
  stafiNodeDepositAddress: () => {
    if (!isdev()) {
      return '0x3ad9a923a56172ec6cac363b7a9487971b93353f';
    } else {
      return '0xf072c7e6e36639870c3986196237a97fcccb0331';
    }
  },
  stafiNodeManagerAddress: () => {
    if (!isdev()) {
      return '0xd8575c32bbc1ea9d33856a6de74be258712307a8';
    } else {
      return '0x68b749894c5484687916d57616b5214cf9fc63cb';
    }
  },
  stafiStakingPoolManagerAddress: () => {
    if (!isdev()) {
      return '0x7acd9bf3728f4223bf504b1a652cef5ad2e6420b';
    } else {
      return '0x3f1ea0333e9e1caba4ff3f4d44c0808a2eaa8468';
    }
  },
  stafiStakingPoolQueueAddress: () => {
    if (!isdev()) {
      return '0xeba81e821c8990e92f85d26aa428e45a8d26d1ab';
    } else {
      return '0x40a0f8f23dbc635b8e54c8b785c62269cad8ebf8';
    }
  },
  rBridgeApp: () => {
    if (!isdev()) {
      return 'https://rtoken.stafi.io/rbridge';
    } else {
      return 'https://test-rtoken.stafi.io/rbridge';
    }
  },
  feeStationApp: () => {
    if (!isdev()) {
      return 'https://drop-api.stafi.io/feeStation';
    } else {
      return 'https://test-drop-api.stafi.io/feeStation';
    }
  },
  dropApiHost: () => {
    if (!isdev()) {
      return 'https://drop-api.stafi.io';
    } else {
      return 'https://test-drop-api.stafi.io';
    }
  },
  rFISTokenAddress: () => {
    if (!isdev()) {
      return '0xc82eb6dea0c93edb8b697b89ad1b13d19469d635';
    } else {
      return '0x9bd574d12a86d648196159700f21e5734b7fb9cb';
    }
  },
  rFISBep20TokenAddress: () => {
    if (!isdev()) {
      return '0x8962a0f6c00ecad3b420ddeb03a6ef624d645fed';
    } else {
      return '0x40cc0f7a3600c31aab1970b9df7d96b0813ab136';
    }
  },
  FISTokenAddress: () => {
    if (!isdev()) {
      return '0xef3a930e1ffffacd2fc13434ac81bd278b0ecc8d';
    } else {
      return '0x5cb831aec601635190b987a816a7b2b4a0a58068';
    }
  },
  FISBep20TokenAddress: () => {
    if (!isdev()) {
      // return '0x91c48208a9a171eb26e6f2bd48f41b958e19ebab';
      return '';
    } else {
      return '0x3dabfb5b0ca8c416684e2a26c1ebc4039627c94a';
    }
  },
  rKSMTokenAddress: () => {
    if (!isdev()) {
      return '0x3c3842c4d3037ae121d69ea1e7a0b61413be806c';
    } else {
      return '0xc8acfdbe0634d041f529d130e7cd33a5be3f73d3';
    }
  },
  rKSMBep20TokenAddress: () => {
    if (!isdev()) {
      return '0xfa1df7c727d56d5fec8c79ef38a9c69aa9f784a3';
    } else {
      return '0xfc42de640aa9759d460e1a11416eca95d25c5908';
    }
  },
  rDOTTokenAddress: () => {
    if (!isdev()) {
      return '0x505f5a4ff10985fe9f93f2ae3501da5fe665f08a';
    } else {
      return '0x5561eecdabd404e36259a8b4edb198be838a1b02';
    }
  },
  rDOTBep20TokenAddress: () => {
    if (!isdev()) {
      return '0x1dab2a526c8ac1ddea86838a7b968626988d33de';
    } else {
      return '0x2ac784f009704a0e69a41abd43a6ec8e0e951979';
    }
  },
  rATOMTokenAddress: () => {
    if (!isdev()) {
      return '0xd01cb3d113a864763dd3977fe1e725860013b0ed';
    } else {
      return '0x36bff48eb520cee3ba51599d4ea99c7b5d3814c7';
    }
  },
  rATOMBep20TokenAddress: () => {
    if (!isdev()) {
      return '0x1e5f6d5355ae5f1c5c687d3041c55f0aeec57eab';
    } else {
      return '0x6ca61f2763b2dd1c846a87f7812bb5f702ae416c';
    }
  },
  rSOLTokenAddress: () => {
    if (!isdev()) {
      return '';
    } else {
      return '0xe21f7b58e4563c58d0f7932a04d62d00034e7437';
    }
  },
  rSOLBep20TokenAddress: () => {
    if (!isdev()) {
      return '';
    } else {
      return '0x22e7b055a0c756067e33c9acc1c3ca789dec6eba';
    }
  },
  rMATICTokenAddress: () => {
    if (!isdev()) {
      return '0x3dbb00c9be5a327e25caf4f650844c5dba81e34b';
    } else {
      return '0xcc75b43d3e43a7a26efd88c1c1e231fc42487bb8';
    }
  },
  rMATICBep20TokenAddress: () => {
    if (!isdev()) {
      return '0x117eefdde5e5aed6626ffedbb5d2ac955f64dbf3';
    } else {
      return '0x482030aac2d537d6e9a5805a66e3a4023a2e401f';
    }
  },
  rETHBep20TokenAddress: () => {
    if (!isdev()) {
      return '0xa7a0a9fda65cd786b3dc718616cee25afb110544';
    } else {
      return '0x3b507040b02c55aa3363baf7ed4f4a6439b98771';
    }
  },
  rBNBBep20TokenAddress: () => {
    if (!isdev()) {
      return '0xf027e525d491ef6ffcc478555fbb3cfabb3406a6';
    } else {
      return '0x03c73f69282e3a1b2a22948bd5a23ce7414490f2';
    }
  },
  MATICTokenAddress: () => {
    if (!isdev()) {
      return '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0';
    } else {
      return '0x499d11e0b6eac7c0593d8fb292dcbbf815fb29ae';
    }
  },
  erc20HandlerAddress: () => {
    if (!isdev()) {
      return '0x2b6b6fce3af32efe4430e446717bda72b95ebb9a';
    } else {
      return '0xc4e7ab051af21f1196b6a91a66802abafd8cd740';
    }
  },
  bep20HandlerAddress: () => {
    if (!isdev()) {
      return '0x13ef51f0525df6045267baed411f535d86586bc1';
    } else {
      return '0xa49f8f958f77b46fc8912d8218eeef8fabb26a85';
    }
  },
  bridgeAddress: () => {
    if (!isdev()) {
      return '0xc0609ea6e4345555276fac1636b5c27ebc17d817';
    } else {
      return '0x5ad90c4c30c7f9989e0748fce3da6aec1a612279';
    }
  },
  bep20BridgeAddress: () => {
    if (!isdev()) {
      return '0xef3a930e1ffffacd2fc13434ac81bd278b0ecc8d';
    } else {
      return '0x6921857409ea0970cbf0a6fa464ab805ce9715e0';
    }
  },
  txHashAndBlockhashURl: {
    dotURL:
      'https://docs.stafi.io/rtoken-app/rdot-solution/rdot-staker-guide/recovery-function#2-the-way-to-get-txhash-and-blockhash',
    ksmURL:
      'https://docs.stafi.io/rtoken-app/rksm-solution/staker-guide/recovery-function#2-the-way-to-get-txhash-and-blockhash',
    atomURL: 'https://docs.stafi.io/rtoken-app/ratom-solution/staker-guide/recovery-function#2-the-way-to-get-txhash',
    solURL: 'https://docs.stafi.io/rtoken-app/rsol-solution/staker-guide/recovery-function#2-how-to-get-txhash',
    maticURL: 'https://docs.stafi.io/rtoken-app/rmatic-solution/staker-guide/recovery-function#2-how-to-get-txhash',
    bnbURL: 'https://docs.stafi.io/rtoken-app/rbnb-solution/staker-guide/recovery-function#2-how-to-get-txhash',
  },
  rAtomChainId: () => {
    if (!isdev()) {
      return 'cosmoshub-4';
    } else {
      return 'cosmos-stafi-1';
    }
  },
  stafihubChainConfig: () => {
    if (!isdev()) {
      return {
        chainName: 'StaFi Hub',
        chainId: 'stafihub-1',
        displayHubName: 'StaFiHub',
        rpc: 'https://public-rpc1.stafihub.io',
        restEndpoint: 'https://public-rest-rpc1.stafihub.io',
        denom: 'ufis',
        coinDenom: 'FIS',
        decimals: 6,
        bech32Config: {
          bech32PrefixAccAddr: 'stafi',
          bech32PrefixAccPub: 'stafipub',
          bech32PrefixValAddr: 'stafivaloper',
          bech32PrefixValPub: 'stafivaloperpub',
          bech32PrefixConsAddr: 'stafivalcons',
          bech32PrefixConsPub: 'stafivalconspub',
        },
        explorerUrl: 'https://ping.pub/stafihub',
      };
    }
    return {
      chainName: 'StaFi-Hub-Testnet',
      chainId: 'stafihub-testnet-1',
      displayHubName: 'StaFiHub',
      rpc: 'https://test-rpc1.stafihub.io',
      restEndpoint: 'https://test-rest-rpc1.stafihub.io',
      denom: 'ufis',
      coinDenom: 'FIS',
      decimals: 6,
      bech32Config: {
        bech32PrefixAccAddr: 'stafi',
        bech32PrefixAccPub: 'stafipub',
        bech32PrefixValAddr: 'stafivaloper',
        bech32PrefixValPub: 'stafivaloperpub',
        bech32PrefixConsAddr: 'stafivalcons',
        bech32PrefixConsPub: 'stafivalconspub',
      },
      explorerUrl: 'https://testnet-explorer.stafihub.io/stafi-hub-testnet',
    };
  },
  stafiHubAtomUrl: () => {
    if (!isdev()) {
      return 'https://app.stafihub.io/rToken/rATOM/stake';
    } else {
      return 'https://test-app.stafihub.io/rToken/rATOM/stake';
    }
  },
  rAtomCosmosChainRpc: () => {
    if (!isdev()) {
      return 'https://cosmos-rpc1.stafi.io';
    } else {
      return 'https://test-cosmos-rpc1.stafihub.io';
    }
  },
  rAtomCosmosChainRest: () => {
    if (!isdev()) {
      return 'https://cosmos-rpc1.stafi.io';
    } else {
      return 'https://test-cosmos-rest1.stafihub.io';
    }
  },
  rAtomDenom: () => {
    return 'uatom';
  },
  rAtomCoinDenom: () => {
    return 'ATOM';
  },
  rAtomAignature: '0x00',
  txHashUrl: (type: rSymbol, txHash: string) => {
    if (type == rSymbol.Atom) {
      return `https://www.mintscan.io/cosmos/txs/${txHash}`;
    } else if (type == rSymbol.Dot) {
      return `https://polkadot.subscan.io/extrinsic/${txHash}`;
    } else if (type == rSymbol.Ksm) {
      return `https://kusama.subscan.io/extrinsic/${txHash}`;
    } else if (type == rSymbol.Sol) {
      return `https://solscan.io/tx/${txHash}`;
    } else if (type == rSymbol.Matic) {
      return `https://etherscan.io/tx/${txHash}`;
    } else if (type == rSymbol.Bnb) {
      return `https://bscscan.com/tx/${txHash}`;
    } else {
      return '';
    }
  },
  unboundAroundDays: (type: Symbol) => {
    if (type == Symbol.Dot) {
      return 29;
    } else if (type == Symbol.Ksm) {
      return 8;
    } else if (type == Symbol.Atom) {
      return 22;
    } else if (type == Symbol.Matic) {
      return 9;
    } else if (type == Symbol.Fis) {
      return 14;
    } else if (type == Symbol.Sol) {
      return 5;
    } else if (type == Symbol.Bnb) {
      return 14;
    } else {
      return 0;
    }
  },
  curve: {
    rethURL: 'https://curve.fi/reth',
  },
  sifchain: {
    ratomURL: 'https://dex.sifchain.finance/#/swap?from=cratom&to=rowan',
  },
  atrix: {
    rsolURL: 'https://app.atrix.finance/#/swap?from=7hUdUTkJLwdcmt3jSEeqx4ep91sm1XwBxMDaJae6bD5D',
  },
  uniswap: {
    rethURL:
      'https://app.uniswap.org/#/swap?inputCurrency=0x9559aaa82d9649c7a7b220e7c461d2e74c9a3593&outputCurrency=ETH',
    rethURL_pair: 'https://v2.info.uniswap.org/pair/0x5f49da032defe35489ddb205f3dc66d8a76318b3',
    rfisURL:
      'https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xc82eb6dea0c93edb8b697b89ad1b13d19469d635',
    fisURL:
      'https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xef3a930e1ffffacd2fc13434ac81bd278b0ecc8d',
    rdotURL:
      'https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x505f5a4ff10985fe9f93f2ae3501da5fe665f08a',
    rksmURL:
      'https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x3c3842c4d3037ae121d69ea1e7a0b61413be806c',
    ratomURL:
      'https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xd01cb3d113a864763dd3977fe1e725860013b0ed',
    rsolURL:
      'https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x08841b9cbA30e80A0E51df13b174F362F90E3dF1',
  },
  pancake: {
    rbnbURL:
      'https://pancakeswap.finance/swap?inputCurrency=0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c&outputCurrency=0xf027e525d491ef6ffcc478555fbb3cfabb3406a6',
    rdotURL:
      'https://pancakeswap.finance/swap?inputCurrency=0x1dab2a526c8ac1ddea86838a7b968626988d33de&outputCurrency=0x7083609fce4d1d8dc0c979aab8c869ea2c873402',
  },
  quickswap: {
    rmaticURL:
      'https://quickswap.exchange/#/swap?inputCurrency=0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270&outputCurrency=0x9f28e2455f9ffcfac9ebd6084853417362bc5dbb',
  },
  rDex: {
    fisURL: 'https://app.rdex.finance/swap?first=FIS',
    rethURL: 'https://app.rdex.finance/swap?first=rETH&second=FIS',
    rbnbURL: 'https://app.rdex.finance/swap?first=rBNB&second=FIS',
    rfisURL: 'https://app.rdex.finance/swap?first=rFIS&second=FIS',
    rdotURL: 'https://app.rdex.finance/swap?first=rDOT&second=FIS',
    rksmURL: 'https://app.rdex.finance/swap?first=rKSM&second=FIS',
    ratomURL: 'https://app.rdex.finance/swap?first=rATOM&second=FIS',
    rsolURL: 'https://app.rdex.finance/swap?first=rSOL&second=FIS',
    rmaticURL: 'https://app.rdex.finance/swap?first=rMATIC&second=FIS',
  },
  commonAbi: () => {
    const abi =
      '[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MINTER_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PAUSER_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burnFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getRoleMember","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleMemberCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"}]';
    return JSON.parse(abi);
  },

  uniswapUrl: (inputCurrency: string, outputCurrency: any) => {
    return `https://app.uniswap.org/#/swap?inputCurrency=${inputCurrency}&outputCurrency=${outputCurrency}`;
  },
  bscScannerUrl: () => {
    if (!isdev()) {
      return 'https://bscscan.com';
    }
    return 'https://testnet.bscscan.com';
  },
  etherScanErc20TxInAddressUrl: (address: any) => {
    if (!isdev()) {
      return `https://etherscan.io/address/${address}#tokentxns`;
    }
    return `https://goerli.etherscan.io/address/${address}#tokentxns`;
  },
  bscScanBep20TxInAddressUrl: (address: any) => {
    if (!isdev()) {
      return `https://bscscan.com/address/${address}#tokentxns`;
    }
    return `https://testnet.bscscan.com/address/${address}#tokentxns`;
  },
  solScanSlp20TxInAddressUrl: (address: any) => {
    if (!isdev()) {
      return `https://solscan.io/account/${address}#tokenAccounts`;
    }
    return `https://solscan.io/account/${address}#tokenAccounts`;
  },
  solScanAddressUrl: (address: any) => {
    if (!isdev()) {
      return `https://solscan.io/account/${address}`;
    }
    return `https://solscan.io/account/${address}`;
  },
  etherScanTokenUrl: (tokenAddress: any, userAddress: any) => {
    if (!isdev()) {
      return `https://etherscan.io/token/${tokenAddress}?a=${userAddress}`;
    }
    return `https://ropsten.etherscan.io/token/${tokenAddress}?a=${userAddress}`;
  },
  bscScanTokenUrl: (tokenAddress: any, userAddress: any) => {
    if (!isdev()) {
      return `https://bscscan.com/token/${tokenAddress}?a=${userAddress}`;
    }
    return `https://testnet.bscscan.com/token/${tokenAddress}?a=${userAddress}`;
  },
  atomScanAddressUrl: (address: any) => {
    return `https://www.mintscan.io/cosmos/account/${address}`;
  },
  dotScanAddressUrl: (address: any) => {
    return `https://polkadot.subscan.io/account/${address}?tab=transfer`;
  },
  bnbScanAddressUrl: (address: any) => {
    if (!isdev()) {
      return `https://bscscan.com/address/${address}#internaltx`;
    }
    return `https://testnet.bscscan.com/address/${address}#internaltx`;
  },
  stafiScanUrl: (address: any) => {
    return `https://stafi.subscan.io/account/${address}?tab=transfer`;
  },
  stafiScanTxUrl: (txHash: any) => {
    return `https://stafi.subscan.io/extrinsic/${txHash}`;
  },
  etherScanTxUrl: (txHash: any) => {
    if (!isdev()) {
      return `https://etherscan.io/tx/${txHash}`;
    }
    return `https://goerli.etherscan.io/tx/${txHash}`;
  },
  etherScanAddressUrl: (address: any) => {
    if (!isdev()) {
      return `https://etherscan.io/address/${address}`;
    }
    return `https://goerli.etherscan.io/address/${address}`;
  },
  bscScanTxUrl: (txHash: any) => {
    if (!isdev()) {
      return `https://bscscan.com/tx/${txHash}`;
    }
    return `https://testnet.bscscan.com/tx/${txHash}`;
  },
  polygonScanTxUrl: (txHash: any) => {
    if (!isdev()) {
      return `https://polygonscan.com/tx/${txHash}`;
    }
    return `https://mumbai.polygonscan.com/tx/${txHash}`;
  },
  bscChainId: () => {
    if (!isdev()) {
      return '0x38';
    }
    return '0x61';
  },
  ropstenChainId: () => {
    return '0x3';
  },
  goerliChainId: () => {
    return '0x5';
  },
  ethChainId: () => {
    if (!isdev()) {
      return '0x1';
    }
    return '0x5';
  },
  metaMaskEthNetworkId: () => {
    if (!isdev()) {
      return '0x1';
    }
    return '0x5';
  },
  metaMaskBscNetworkId: () => {
    if (!isdev()) {
      return '0x38';
    }
    return '0x61';
  },
  metaMaskPolygonNetworkId: () => {
    if (!isdev()) {
      return '0x89';
    }
    return '0x13881';
  },
  metaMaskNetworkIsEth: (networkChainId: any) => {
    if (!isdev()) {
      return networkChainId === '0x1';
    }
    return networkChainId === '0x3';
  },
  metaMaskNetworkIsGoerliEth: (networkChainId: any) => {
    if (!isdev()) {
      return networkChainId === '0x1';
    }
    return networkChainId === '0x5';
  },
  metaMaskNetworkIsBsc: (networkChainId: any) => {
    if (!isdev()) {
      return networkChainId === '0x38';
    }
    return networkChainId === '0x61';
  },
  metaMaskNetworkIsPolygon: (networkChainId: any) => {
    if (!isdev()) {
      return networkChainId === '0x89';
    }
    return networkChainId === '0x13881';
  },

  swapWaitingTime: () => {
    return 150;
  },
  minReward: 0.000001,
  slpFisTokenAddress: () => {
    if (!isdev()) {
      return 'FG7x94jPcVbtt4pLXWhyr6sU3iWim8JJ2y215X5yowN5';
    }
    return '7tFoMBHydGVDcgxUpkPiWca2x7hoy9s7oBAhmay8GQLL';
  },
  slpRSolTokenAddress: () => {
    if (!isdev()) {
      return '7hUdUTkJLwdcmt3jSEeqx4ep91sm1XwBxMDaJae6bD5D';
    }
    return '2FxyeVxhq3rzSPFEkFgmDYprPREwt4fKhqGX84q4m8us';
  },
  slpBridgeAccount: () => {
    if (!isdev()) {
      return 'Ev64NXXeKdtBgJbXyuJKEw77pxaw5q4BkUb2eKeV5xDy';
    }
    return '63ytYLeNDaaUx2u94KHJcoueaLzA7gryB26p2w8E53oh';
  },
  slpBridgeFeeReceiver: () => {
    if (!isdev()) {
      return 'GK4hMS4dBhQZfmo1MYKXKz76aXaKndQJ6YavzfEhc2w7';
    }
    return '9awVcBdEfGTGeKbvGQsrHNwXZ6KaRfXcKN9cpDM2kLn6';
  },
  slpTokenProgramId: () => {
    if (!isdev()) {
      return 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
    }
    return 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
  },
  slpBridgeProgramId: () => {
    if (!isdev()) {
      return 'H3mPx8i41Zn4dLC6ZQRBzNRe1cqYdbcDP1WpojnaiAVo';
    }
    return 'EPfxck35M3NJwsjreExLLyQAgAL3y5uWfzddY6cHBrGy';
  },
  solanaSystemProgramId: () => {
    if (!isdev()) {
      return '11111111111111111111111111111111';
    }
    return '11111111111111111111111111111111';
  },
  lockContractAddress: (platform: any) => {
    if (platform === 'Ethereum') {
      if (!isdev()) {
        return '0x630e78c7ac331d89e2fedbbaa93fecade842d460';
      } else {
        return '0xb22b8b5ed337006696d20b85f2050e456810cc2b';
      }
    }
    if (platform === 'BSC') {
      if (!isdev()) {
        return '0x54896f542f044709807f0d79033934d661d39fc1';
      } else {
        return '0xac5d3b8e3321f9129b8a7509068270ec660702dc';
      }
    }
    if (platform === 'Polygon') {
      if (!isdev()) {
        return '';
      } else {
        return '0x3ee0f8ac7f001bb6090c7c692003dd78dc3b3fc7';
      }
    }
    return '';
  },
  addLiquidityLink: (platform: any, rTokenName: string) => {
    if (platform === 'Ethereum') {
      return 'https://app.uniswap.org/#/add/v2/ETH/0x9559Aaa82d9649C7A7b220E7c461d2E74c9a3593?lng=en-US';
    }
    if (platform === 'BSC') {
      if (rTokenName === 'rDOT') {
        return 'https://pancakeswap.finance/add/0x1dab2a526c8ac1ddea86838a7b968626988d33de/0x7083609fce4d1d8dc0c979aab8c869ea2c873402';
      }
      if (rTokenName === 'rBNB') {
        return 'https://pancakeswap.finance/add/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c/0xf027e525d491ef6ffcc478555fbb3cfabb3406a6';
      }
      return '';
    }
    if (platform === 'Polygon') {
      return 'https://quickswap.exchange/#/add/ETH/0x9f28e2455f9FFcFac9EBD6084853417362bc5dBb';
    }
    return '';
  },
  rETHLpContract: () => {
    if (!isdev()) {
      return '0xF9440930043eb3997fc70e1339dBb11F341de7A8';
    } else {
      return '0xF9440930043eb3997fc70e1339dBb11F341de7A8';
    }
  },
};

export default config;
