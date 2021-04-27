import config, { isdev } from '@config/index'
import {rSymbol} from '@keyring/defaults'

export default class Index{
    getBridgeErc20HandlerAddress(){
        return config.erc20HandlerAddress();
    }
    getResourceId(tokenType: string){
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
        default:
          return rSymbol.Fis;
      }
    }
    getBridgeEstimateEthFee(){
      if (isdev()) {
        return '0.001000';
      } else {
        return '0.000020';
      }
    }
    getBridgeAbi(){
        const abi = '[{"inputs":[{"internalType":"address","name":"relayerAddress","type":"address"}],"name":"adminAddRelayer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newExpiry","type":"uint256"}],"name":"adminChangeExpiry","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newFee","type":"uint256"}],"name":"adminChangeFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newThreshold","type":"uint256"}],"name":"adminChangeRelayerThreshold","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"adminPauseTransfers","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"relayerAddress","type":"address"}],"name":"adminRemoveRelayer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"handlerAddress","type":"address"},{"internalType":"address","name":"tokenAddress","type":"address"}],"name":"adminSetBurnable","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"handlerAddress","type":"address"},{"internalType":"bytes32","name":"resourceID","type":"bytes32"},{"internalType":"address","name":"contractAddress","type":"address"},{"internalType":"bytes4","name":"depositFunctionSig","type":"bytes4"},{"internalType":"uint256","name":"depositFunctionDepositerOffset","type":"uint256"},{"internalType":"bytes4","name":"executeFunctionSig","type":"bytes4"}],"name":"adminSetGenericResource","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"handlerAddress","type":"address"},{"internalType":"bytes32","name":"resourceID","type":"bytes32"},{"internalType":"address","name":"tokenAddress","type":"address"}],"name":"adminSetResource","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"adminUnpauseTransfers","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"handlerAddress","type":"address"},{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amountOrTokenID","type":"uint256"}],"name":"adminWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint8","name":"chainID","type":"uint8"},{"internalType":"uint64","name":"depositNonce","type":"uint64"},{"internalType":"bytes32","name":"dataHash","type":"bytes32"}],"name":"cancelProposal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint8","name":"destinationChainID","type":"uint8"},{"internalType":"bytes32","name":"resourceID","type":"bytes32"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint8","name":"chainID","type":"uint8"},{"internalType":"address[]","name":"initialRelayers","type":"address[]"},{"internalType":"uint256","name":"initialRelayerThreshold","type":"uint256"},{"internalType":"uint256","name":"fee","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint8","name":"destinationChainID","type":"uint8"},{"indexed":true,"internalType":"bytes32","name":"resourceID","type":"bytes32"},{"indexed":true,"internalType":"uint64","name":"depositNonce","type":"uint64"}],"name":"Deposit","type":"event"},{"inputs":[{"internalType":"uint8","name":"chainID","type":"uint8"},{"internalType":"uint64","name":"depositNonce","type":"uint64"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"bytes32","name":"resourceID","type":"bytes32"}],"name":"executeProposal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint8","name":"originChainID","type":"uint8"},{"indexed":true,"internalType":"uint64","name":"depositNonce","type":"uint64"},{"indexed":true,"internalType":"enum Bridge.ProposalStatus","name":"status","type":"uint8"},{"indexed":false,"internalType":"bytes32","name":"resourceID","type":"bytes32"},{"indexed":false,"internalType":"bytes32","name":"dataHash","type":"bytes32"}],"name":"ProposalEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint8","name":"originChainID","type":"uint8"},{"indexed":true,"internalType":"uint64","name":"depositNonce","type":"uint64"},{"indexed":true,"internalType":"enum Bridge.ProposalStatus","name":"status","type":"uint8"},{"indexed":false,"internalType":"bytes32","name":"resourceID","type":"bytes32"}],"name":"ProposalVote","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"relayer","type":"address"}],"name":"RelayerAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"relayer","type":"address"}],"name":"RelayerRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"newThreshold","type":"uint256"}],"name":"RelayerThresholdChanged","type":"event"},{"inputs":[{"internalType":"address","name":"newAdmin","type":"address"}],"name":"renounceAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"inputs":[{"internalType":"address payable[]","name":"addrs","type":"address[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"name":"transferFunds","outputs":[],"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"inputs":[{"internalType":"uint8","name":"chainID","type":"uint8"},{"internalType":"uint64","name":"depositNonce","type":"uint64"},{"internalType":"bytes32","name":"resourceID","type":"bytes32"},{"internalType":"bytes32","name":"dataHash","type":"bytes32"}],"name":"voteProposal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"_chainID","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint8","name":"","type":"uint8"}],"name":"_depositCounts","outputs":[{"internalType":"uint64","name":"","type":"uint64"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_expiry","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_fee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint72","name":"","type":"uint72"},{"internalType":"bytes32","name":"","type":"bytes32"},{"internalType":"address","name":"","type":"address"}],"name":"_hasVotedOnProposal","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint72","name":"","type":"uint72"},{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"_proposals","outputs":[{"internalType":"bytes32","name":"_resourceID","type":"bytes32"},{"internalType":"bytes32","name":"_dataHash","type":"bytes32"},{"internalType":"enum Bridge.ProposalStatus","name":"_status","type":"uint8"},{"internalType":"uint256","name":"_proposedBlock","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_relayerThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"_resourceIDToHandlerAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_totalProposals","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_totalRelayers","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint8","name":"originChainID","type":"uint8"},{"internalType":"uint64","name":"depositNonce","type":"uint64"},{"internalType":"bytes32","name":"dataHash","type":"bytes32"}],"name":"getProposal","outputs":[{"components":[{"internalType":"bytes32","name":"_resourceID","type":"bytes32"},{"internalType":"bytes32","name":"_dataHash","type":"bytes32"},{"internalType":"address[]","name":"_yesVotes","type":"address[]"},{"internalType":"address[]","name":"_noVotes","type":"address[]"},{"internalType":"enum Bridge.ProposalStatus","name":"_status","type":"uint8"},{"internalType":"uint256","name":"_proposedBlock","type":"uint256"}],"internalType":"struct Bridge.Proposal","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getRoleMember","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleMemberCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"relayer","type":"address"}],"name":"isRelayer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"RELAYER_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"}]';
        return JSON.parse(abi);
    }
    getBridgeAddress () {
        return config.bridgeAddress();
    }
}