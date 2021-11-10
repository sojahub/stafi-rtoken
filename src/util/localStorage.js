import { cloneDeep } from 'lodash';
import { getRsymbolByTokenTitle } from 'src/config';
import { noticeStatus } from 'src/features/noticeClice';
import { getLocalStorageItem, Keys, setLocalStorageItem } from './common';

var localStorage = window.localStorage;

var poolPubKeyPrefix = 'poolpubkey:';
var currentFisAccountPrefix = 'current:fis:account';
var currentPolkadotExtensionPrefix = 'polkadot:extension:enabled';
var rEthCurrentPoolPrefix = 'current:pool:';

const localStorageUtil = {
  /**
   * set pool pubkey
   */
  setPoolPubKey: function (poolAddress, pubkey) {
    localStorage.setItem(poolPubKeyPrefix + poolAddress, pubkey);
  },

  /**
   * get pool pubkey
   */
  getPoolPubKey: function (poolAddress) {
    return localStorage.getItem(poolPubKeyPrefix + poolAddress);
  },

  /**
   * set current pool
   */
  setCurrentEthPool: function (validatorAddress, poolAddress) {
    localStorage.setItem(rEthCurrentPoolPrefix + validatorAddress, poolAddress);
  },

  /**
   * get current pool
   */
  getCurrentEthPool: function (validatorAddress) {
    return localStorage.getItem(rEthCurrentPoolPrefix + validatorAddress);
  },

  setPolkadotExtensionEnabled: function () {
    localStorage.setItem(currentPolkadotExtensionPrefix, true);
  },

  getPolkadotExtensionEnabled: function () {
    return localStorage.getItem(currentPolkadotExtensionPrefix);
  },

  setCurrentFisAccount: function (currentAddress) {
    localStorage.setItem(currentFisAccountPrefix, currentAddress);
  },

  getCurrentFisAccount: function () {
    return localStorage.getItem(currentFisAccountPrefix);
  },

  getRTokenUnbondRecords: function (type) {
    const unbondRecords = getLocalStorageItem(Keys.UnbondRecordsKey);
    if (unbondRecords && unbondRecords[type]) {
      return unbondRecords[type];
    }
    return [];
  },

  addRTokenUnbondRecords: async function (type, stafiServer, itemObj) {
    const unbondRecords = getLocalStorageItem(Keys.UnbondRecordsKey);
    let arr;
    if (unbondRecords && unbondRecords[type]) {
      arr = unbondRecords[type];
    } else {
      arr = [];
    }

    const stafiApi = await stafiServer.createStafiApi();
    const eraResult = await stafiApi.query.rTokenLedger.chainEras(getRsymbolByTokenTitle(type));
    const bondingDurationResult = await stafiApi.query.rTokenLedger.chainBondingDuration(getRsymbolByTokenTitle(type));
    let currentEra = eraResult.toJSON();
    let unlockEra = currentEra + bondingDurationResult.toJSON();

    const newLength = arr.unshift({ ...itemObj, currentEra, unlockEra });
    if (newLength > 10) {
      arr.pop();
    }
    const newUnbondRecords = {
      ...unbondRecords,
      [type]: arr,
    };
    setLocalStorageItem(Keys.UnbondRecordsKey, newUnbondRecords);
  },

  updateRTokenUnbondRecordStatus: async function (type, uuid, newStatus) {
    const unbondRecords = getLocalStorageItem(Keys.UnbondRecordsKey);
    let arr;
    if (unbondRecords && unbondRecords[type]) {
      arr = unbondRecords[type];
    } else {
      arr = [];
    }
    arr.forEach((item) => {
      if (item.id === uuid) {
        item.status = noticeStatus.Confirmed;
      }
    });
    const newUnbondRecords = cloneDeep(unbondRecords);
    setLocalStorageItem(Keys.UnbondRecordsKey, newUnbondRecords);
  },
};

export default localStorageUtil;