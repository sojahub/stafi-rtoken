var localStorage = window.localStorage;

var poolPubKeyPrefix = 'poolpubkey:';
var currentFisAccountPrefix = 'current:fis:account';
var currentPolkadotExtensionPrefix = 'polkadot:extension:enabled';
var rEthCurrentPoolPrefix = 'current:pool:';

export default {

  /**
   * set pool pubkey
   */
  setPoolPubKey: function(poolAddress, pubkey) {
    localStorage.setItem(poolPubKeyPrefix + poolAddress, pubkey);
  },

  /**
   * get pool pubkey
   */
  getPoolPubKey: function(poolAddress) {
    return localStorage.getItem(poolPubKeyPrefix + poolAddress);
  },

  /**
   * set current pool
   */
  setCurrentEthPool: function(validatorAddress, poolAddress) {
    localStorage.setItem(rEthCurrentPoolPrefix + validatorAddress, poolAddress);
  },

  /**
   * get current pool
   */
  getCurrentEthPool: function(validatorAddress) {
    return localStorage.getItem(rEthCurrentPoolPrefix + validatorAddress);
  },


  setPolkadotExtensionEnabled: function() {
    localStorage.setItem(currentPolkadotExtensionPrefix, true);
  },

  getPolkadotExtensionEnabled: function() {
    return localStorage.getItem(currentPolkadotExtensionPrefix);
  },

  setCurrentFisAccount: function(currentAddress) {
    localStorage.setItem(currentFisAccountPrefix, currentAddress);
  },

  getCurrentFisAccount: function() {
    return localStorage.getItem(currentFisAccountPrefix);
  },

};
