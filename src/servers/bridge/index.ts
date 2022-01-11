import config, { isdev } from 'src/config/index';
import { rSymbol } from 'src/keyring/defaults';

export default class Index {
  getBridgeErc20HandlerAddress() {
    return config.erc20HandlerAddress();
  }
  getBridgeBep20HandlerAddress() {
    return config.bep20HandlerAddress();
  }
  getResourceId(tokenType: string) {
    if (tokenType == 'fis') {
      return '0x000000000000000000000000000000a9e0095b8965c01e6a09c97938f3860901';
    } else if (tokenType == 'rfis') {
      if (isdev()) {
        return '0x000000000000000000000000000000b9e0095b8965c01e6a09c97938f3860901';
      } else {
        return '0x000000000000000000000000000000df7e6fee39d3ace035c108833854667701';
      }
    } else if (tokenType == 'rksm') {
      return '0x00000000000000000000000000000004130f9412e9ecd9d97cf280361d2cbd01';
    } else if (tokenType == 'rdot') {
      return '0x000000000000000000000000000000bada4d69537ffd62dbcde10ddda21b2001';
    } else if (tokenType == 'ratom') {
      return '0x0000000000000000000000000000006e15faef60f5e197166fe64110456a8601';
    } else if (tokenType == 'rsol') {
      return '0x000000000000000000000000000000659b930f8568952cb7b0c8b7eda3060b01';
    } else if (tokenType == 'reth') {
      return '0x000000000000000000000000000000b2c61e66d44fd65f6070c628e20b44dd01';
    } else if (tokenType == 'rmatic') {
      return '0x00000000000000000000000000000014c28bae959bb2de5085d17682eca7b001';
    } else if (tokenType == 'rbnb') {
      return '0x000000000000000000000000000000ab226cdfdcd7e0d15fa85810f500d8e601';
    }
  }
  getRsymbolByTokenType(tokenType: string) {
    switch (tokenType) {
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
      case 'reth':
        return rSymbol.Eth;
      default:
        return rSymbol.Fis;
    }
  }
  getBridgeEstimateEthFee() {
    if (isdev()) {
      return '0.001000';
    } else {
      return '0.000020';
    }
  }
  getBridgeEstimateBscFee() {
    if (isdev()) {
      return '0.001000';
    } else {
      return '0.000200';
    }
  }
  getBridgeEstimateSolFee() {
    if (isdev()) {
      return '0.000200';
    } else {
      return '0.000200';
    }
  }
  getBridgeAbi() {
    const abi =
      '[{"inputs":[{"internalType":"uint8","name":"chainID","type":"uint8"},{"internalType":"address[]","name":"initialRelayers","type":"address[]"},{"internalType":"uint256","name":"initialRelayerThreshold","type":"uint256"},{"internalType":"uint256","name":"fee","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint8","name":"destinationChainID","type":"uint8"},{"indexed":true,"internalType":"bytes32","name":"resourceID","type":"bytes32"},{"indexed":true,"internalType":"uint64","name":"depositNonce","type":"uint64"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint8","name":"originChainID","type":"uint8"},{"indexed":true,"internalType":"uint64","name":"depositNonce","type":"uint64"},{"indexed":true,"internalType":"enum Bridge.ProposalStatus","name":"status","type":"uint8"},{"indexed":false,"internalType":"bytes32","name":"dataHash","type":"bytes32"}],"name":"ProposalEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint8","name":"originChainID","type":"uint8"},{"indexed":true,"internalType":"uint64","name":"depositNonce","type":"uint64"},{"indexed":true,"internalType":"enum Bridge.ProposalStatus","name":"status","type":"uint8"},{"indexed":false,"internalType":"bytes32","name":"dataHash","type":"bytes32"}],"name":"ProposalVote","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"relayer","type":"address"}],"name":"RelayerAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"relayer","type":"address"}],"name":"RelayerRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"newThreshold","type":"uint256"}],"name":"RelayerThresholdChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_RELAYERS","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"RELAYER_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_chainID","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint8","name":"","type":"uint8"}],"name":"_depositCounts","outputs":[{"internalType":"uint64","name":"","type":"uint64"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_expiry","outputs":[{"internalType":"uint40","name":"","type":"uint40"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_fee","outputs":[{"internalType":"uint128","name":"","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint72","name":"destNonce","type":"uint72"},{"internalType":"bytes32","name":"dataHash","type":"bytes32"},{"internalType":"address","name":"relayer","type":"address"}],"name":"_hasVotedOnProposal","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint8","name":"","type":"uint8"}],"name":"_oldDepositNonce","outputs":[{"internalType":"uint64","name":"","type":"uint64"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint72","name":"","type":"uint72"},{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"_proposals","outputs":[{"internalType":"enum Bridge.ProposalStatus","name":"_status","type":"uint8"},{"internalType":"uint200","name":"_yesVotes","type":"uint200"},{"internalType":"uint8","name":"_yesVotesTotal","type":"uint8"},{"internalType":"uint40","name":"_proposedBlock","type":"uint40"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_relayerThreshold","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"_resourceIDToHandlerAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_totalRelayers","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"relayerAddress","type":"address"}],"name":"adminAddRelayer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newFee","type":"uint256"}],"name":"adminChangeFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newThreshold","type":"uint256"}],"name":"adminChangeRelayerThreshold","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"adminPauseTransfers","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"relayerAddress","type":"address"}],"name":"adminRemoveRelayer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint8","name":"chainId","type":"uint8"},{"internalType":"uint64","name":"depositCount","type":"uint64"}],"name":"adminSetDepositCount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"handlerAddress","type":"address"},{"internalType":"bytes32","name":"resourceID","type":"bytes32"},{"internalType":"address","name":"contractAddress","type":"address"},{"internalType":"bytes4","name":"depositFunctionSig","type":"bytes4"},{"internalType":"uint256","name":"depositFunctionDepositerOffset","type":"uint256"},{"internalType":"bytes4","name":"executeFunctionSig","type":"bytes4"}],"name":"adminSetGenericResource","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint8","name":"chainId","type":"uint8"},{"internalType":"uint64","name":"oldDepositNonce","type":"uint64"}],"name":"adminSetOldDepositNonce","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"handlerAddress","type":"address"},{"internalType":"bytes32[]","name":"resourceIDs","type":"bytes32[]"},{"internalType":"address[]","name":"tokenContractAddresses","type":"address[]"},{"internalType":"address[]","name":"burnablTokenContractAddresses","type":"address[]"}],"name":"adminSetResourceAndBurnable","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"adminUnpauseTransfers","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"handlerAddress","type":"address"},{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amountOrTokenID","type":"uint256"}],"name":"adminWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint8","name":"chainID","type":"uint8"},{"internalType":"uint64","name":"depositNonce","type":"uint64"},{"internalType":"bytes32","name":"dataHash","type":"bytes32"}],"name":"cancelProposal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint8","name":"destinationChainID","type":"uint8"},{"internalType":"bytes32","name":"resourceID","type":"bytes32"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint8","name":"originChainID","type":"uint8"},{"internalType":"uint64","name":"depositNonce","type":"uint64"},{"internalType":"bytes32","name":"dataHash","type":"bytes32"}],"name":"getProposal","outputs":[{"components":[{"internalType":"enum Bridge.ProposalStatus","name":"_status","type":"uint8"},{"internalType":"uint200","name":"_yesVotes","type":"uint200"},{"internalType":"uint8","name":"_yesVotesTotal","type":"uint8"},{"internalType":"uint40","name":"_proposedBlock","type":"uint40"}],"internalType":"struct Bridge.Proposal","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getRoleMember","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleMemberCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"getRoleMemberIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"relayer","type":"address"}],"name":"isRelayer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newAdmin","type":"address"}],"name":"renounceAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address payable[]","name":"addrs","type":"address[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"name":"transferFunds","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint8","name":"chainID","type":"uint8"},{"internalType":"uint64","name":"depositNonce","type":"uint64"},{"internalType":"bytes32","name":"resourceID","type":"bytes32"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"voteProposal","outputs":[],"stateMutability":"nonpayable","type":"function"}]';
    return JSON.parse(abi);
  }
  getBridgeAddress() {
    return config.bridgeAddress();
  }
  getBep20BridgeAddress() {
    return config.bep20BridgeAddress();
  }
}
