import config from 'src/config/index';
import { api } from 'src/util/http';
import Web3 from 'web3';

declare const window: any;
declare const ethereum: any;

let web3Instance: any = null;
let ethWeb3Instance: any = null;
let bscWeb3Instance: any = null;
let polygonWeb3Instance: any = null;

export default class Index {
  getWeb3() {
    if (web3Instance) {
      return web3Instance;
    }

    let provider;
    if (window.ethereum) {
      provider = window.ethereum;
    } else if (window.web3) {
      provider = window.web3.currentProvider;
    } else {
      return null;
    }

    web3Instance = new Web3(provider);

    return web3Instance;
  }

  getWeb3FromPlatform(platform: any) {
    let web3;
    if (platform === 'Ethereum') {
      web3 = this.getETHWeb3();
    } else if (platform === 'BSC') {
      web3 = this.getBSCWeb3();
    } else if (platform === 'Polygon') {
      web3 = this.getPolygonWeb3();
    }
    return web3;
  }

  getETHWeb3() {
    if (ethWeb3Instance) {
      return ethWeb3Instance;
    }

    let provider = new Web3.providers.WebsocketProvider(config.ethProviderUrl());
    ethWeb3Instance = new Web3(provider);
    return ethWeb3Instance;
  }

  getBSCWeb3() {
    if (bscWeb3Instance) {
      return bscWeb3Instance;
    }

    let provider = new Web3.providers.WebsocketProvider(config.bscProviderUrl());
    bscWeb3Instance = new Web3(provider);
    return bscWeb3Instance;
  }

  getPolygonWeb3() {
    if (polygonWeb3Instance) {
      return polygonWeb3Instance;
    }

    let provider = new Web3.providers.WebsocketProvider(config.polygonProviderUrl());
    polygonWeb3Instance = new Web3(provider);
    return polygonWeb3Instance;
  }

  getRETHTokenAddress() {
    return config.rETHTokenAddress();
  }

  getRETHGoerliTokenAddress() {
    return config.rETHTokenAddress();
  }

  getRETHTokenAbi() {
    const abi =
      '[{"inputs":[{"internalType":"address","name":"_stafiStorageAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"time","type":"uint256"}],"name":"EtherDeposited","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"ethAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"time","type":"uint256"}],"name":"TokensBurned","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"ethAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"time","type":"uint256"}],"name":"TokensMinted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MINTER_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PAUSER_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burnFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"depositExcess","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"depositRewards","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"getBurnEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCollateralRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_rethAmount","type":"uint256"}],"name":"getEthValue","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getExchangeRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_ethAmount","type":"uint256"}],"name":"getRethValue","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getRoleMember","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleMemberCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTotalCollateral","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_value","type":"bool"}],"name":"setBurnEnabled","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_rethAmount","type":"uint256"}],"name":"userBurn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_ethAmount","type":"uint256"},{"internalType":"address","name":"_to","type":"address"}],"name":"userMint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"}]';
    return JSON.parse(abi);
  }
  getStafiUserDepositAbi() {
    const abi =
      '[{"inputs":[{"internalType":"address","name":"_stafiStorageAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"stakingPool","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"time","type":"uint256"}],"name":"DepositAssigned","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"time","type":"uint256"}],"name":"DepositReceived","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"time","type":"uint256"}],"name":"DepositRecycled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"time","type":"uint256"}],"name":"ExcessWithdrawn","type":"event"},{"inputs":[],"name":"assignDeposits","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"getAssignDepositsEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getDepositEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getExcessBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getMaximumDepositAssignments","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getMinimumDeposit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"receiveEtherWithdrawal","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"recycleDissolvedDeposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"recycleWithdrawnDeposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"bool","name":"_value","type":"bool"}],"name":"setAssignDepositsEnabled","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_value","type":"bool"}],"name":"setDepositEnabled","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_value","type":"uint256"}],"name":"setMaximumDepositAssignments","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_value","type":"uint256"}],"name":"setMinimumDeposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdrawExcessBalance","outputs":[],"stateMutability":"nonpayable","type":"function"}]';
    return JSON.parse(abi);
  }
  getStafiUserDepositAddress() {
    return config.stafiUserDepositAddress();
  }

  getStafiNodeDepositAbi() {
    const abi =
      '[{"inputs":[{"internalType":"address","name":"_stafiStorageAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"time","type":"uint256"}],"name":"DepositReceived","type":"event"},{"inputs":[],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"getCurrentNodeDepositAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getDepositEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_value","type":"uint256"}],"name":"setCurrentNodeDepositAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_value","type":"bool"}],"name":"setDepositEnabled","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"}]';
    return JSON.parse(abi);
  }
  getStafiNodeDepositAddress() {
    return config.stafiNodeDepositAddress();
  }

  getStafiNodeManagerAbi() {
    const abi =
      '[{"inputs":[{"internalType":"address","name":"_stafiStorageAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"node","type":"address"},{"indexed":false,"internalType":"uint256","name":"time","type":"uint256"}],"name":"NodeRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"node","type":"address"},{"indexed":false,"internalType":"bool","name":"trusted","type":"bool"},{"indexed":false,"internalType":"uint256","name":"time","type":"uint256"}],"name":"NodeTrustedSet","type":"event"},{"inputs":[{"internalType":"address","name":"_nodeAddress","type":"address"}],"name":"registerNode","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_nodeAddress","type":"address"},{"internalType":"bool","name":"_trusted","type":"bool"}],"name":"setNodeTrusted","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getNodeAt","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getNodeCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_nodeAddress","type":"address"}],"name":"getNodeExists","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_nodeAddress","type":"address"}],"name":"getNodeTrusted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getTrustedNodeAt","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTrustedNodeCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"}]';
    return JSON.parse(abi);
  }
  getStafiNodeManagerAddress() {
    return config.stafiNodeManagerAddress();
  }

  getStafiStakingPoolManagerAbi() {
    const abi =
      '[{"inputs":[{"internalType":"address","name":"_stafiStorageAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"stakingPool","type":"address"},{"indexed":true,"internalType":"address","name":"node","type":"address"},{"indexed":false,"internalType":"uint256","name":"time","type":"uint256"}],"name":"StakingPoolCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"stakingPool","type":"address"},{"indexed":true,"internalType":"address","name":"node","type":"address"},{"indexed":false,"internalType":"uint256","name":"time","type":"uint256"}],"name":"StakingPoolDestroyed","type":"event"},{"inputs":[{"internalType":"address","name":"_nodeAddress","type":"address"},{"internalType":"enum DepositType","name":"_depositType","type":"uint8"}],"name":"createStakingPool","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"destroyStakingPool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_nodeAddress","type":"address"},{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getNodeStakingPoolAt","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_nodeAddress","type":"address"}],"name":"getNodeStakingPoolCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_nodeAddress","type":"address"},{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getNodeValidatingStakingPoolAt","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_nodeAddress","type":"address"}],"name":"getNodeValidatingStakingPoolCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getStakingPoolAt","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes","name":"_pubkey","type":"bytes"}],"name":"getStakingPoolByPubkey","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getStakingPoolCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_stakingPoolAddress","type":"address"}],"name":"getStakingPoolExists","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_stakingPoolAddress","type":"address"}],"name":"getStakingPoolPubkey","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_stakingPoolAddress","type":"address"}],"name":"getStakingPoolWithdrawalProcessed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes","name":"_pubkey","type":"bytes"}],"name":"setStakingPoolPubkey","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_stakingPoolAddress","type":"address"},{"internalType":"bool","name":"_processed","type":"bool"}],"name":"setStakingPoolWithdrawalProcessed","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"}]';
    return JSON.parse(abi);
  }
  getStafiStakingPoolManagerAddress() {
    return config.stafiStakingPoolManagerAddress();
  }

  getStafiStakingPoolQueueAbi() {
    const abi =
      '[{"inputs":[{"internalType":"address","name":"_stafiStorageAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"stakingPool","type":"address"},{"indexed":true,"internalType":"bytes32","name":"queueId","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"time","type":"uint256"}],"name":"StakingPoolDequeued","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"stakingPool","type":"address"},{"indexed":true,"internalType":"bytes32","name":"queueId","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"time","type":"uint256"}],"name":"StakingPoolEnqueued","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"stakingPool","type":"address"},{"indexed":true,"internalType":"bytes32","name":"queueId","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"time","type":"uint256"}],"name":"StakingPoolRemoved","type":"event"},{"inputs":[],"name":"dequeueStakingPool","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"enum DepositType","name":"_depositType","type":"uint8"},{"internalType":"address","name":"_stakingPool","type":"address"}],"name":"enqueueStakingPool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getEffectiveCapacity","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"enum DepositType","name":"_depositType","type":"uint8"}],"name":"getLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getNextCapacity","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTotalCapacity","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTotalLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"removeStakingPool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"}]';
    return JSON.parse(abi);
  }
  getStafiStakingPoolQueueAddress() {
    return config.stafiStakingPoolQueueAddress();
  }

  getStafiStakingPoolAbi() {
    const abi =
      '[{"inputs":[{"internalType":"address","name":"_stafiStorageAddress","type":"address"},{"internalType":"address","name":"_nodeAddress","type":"address"},{"internalType":"enum DepositType","name":"_depositType","type":"uint8"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"time","type":"uint256"}],"name":"EtherDeposited","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"node","type":"address"},{"indexed":true,"internalType":"address","name":"stakingPool","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"time","type":"uint256"}],"name":"EtherRefunded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"time","type":"uint256"}],"name":"EtherWithdrawn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint8","name":"status","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"time","type":"uint256"}],"name":"StatusUpdated","type":"event"},{"inputs":[],"name":"close","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"dissolve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getDepositType","outputs":[{"internalType":"enum DepositType","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getNodeAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getNodeCommonlyRefunded","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getNodeDepositAssigned","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getNodeDepositBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getNodeFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getNodeRefundBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getNodeTrustedRefunded","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getPlatformDepositBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getStatus","outputs":[{"internalType":"enum StakingPoolStatus","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getStatusBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getStatusTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getUserDepositAssigned","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getUserDepositAssignedTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getUserDepositBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nodeDeposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"refund","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes","name":"_validatorPubkey","type":"bytes"},{"internalType":"bytes","name":"_validatorSignature","type":"bytes"},{"internalType":"bytes32","name":"_depositDataRoot","type":"bytes32"}],"name":"stake","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"userDeposit","outputs":[],"stateMutability":"payable","type":"function"}]';
    return JSON.parse(abi);
  }

  userDepositContract(address: string) {
    let web3 = this.getWeb3();
    let userDepositContract = new web3.eth.Contract(this.getStafiUserDepositAbi(), this.getStafiUserDepositAddress(), {
      from: address,
    });
    return userDepositContract;
  }
  getStakingPoolStatus() {
    const url = 'v1/webapi/reth/poolstatus';
    return api.post(url);
  }

  getArp(arpType: number) {
    const url = 'v1/webapi/reth/arp';
    return api.post(url, { arpType });
  }

  getPoolist(pam: any) {
    const url = 'v1/webapi/reth/poolist';
    return api.post(url, pam);
  }

  getPoolInfo(poolAddress: string, pubkey: string) {
    const url = 'v1/webapi/reth/poolinfo';
    return api.post(url, { contract: poolAddress, pubkey: pubkey });
  }

  getEthRate() {
    const url = config.api() + '/stafi/v1/webapi/rtoken/getrethlist';
    return api.post(url);
  }
}

// export default{
//   getWeb3,
//   getRETHTokenAddress,
//   getRETHTokenAbi
// }
