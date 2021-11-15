// @ts-nocheck

import { encodeAddress } from '@polkadot/keyring';
import { hexToU8a } from '@polkadot/util';
import { message } from 'antd';
import config, { getSymbolTitle } from 'src/config';
import { rSymbol, Symbol } from 'src/keyring/defaults';
import keyring, { Keyring } from 'src/servers/index';
import RpcServer from 'src/servers/rpc';
import StafiServer from 'src/servers/stafi';
import numberUtil from 'src/util/numberUtil';
import NumberUtil from 'src/util/numberUtil';

const stafiServer = new StafiServer();
const rpcServer = new RpcServer();

export default class CommonClice {
  getWillAmount(ratio: any, unbondCommission: any, amounts: any) {
    let willAmount: any = 0;
    // let ratio=state.FISModule.ratio;
    // let unbondCommission = state.FISModule.unbondCommission;
    if (amounts == '--' || ratio == '--' || unbondCommission == '--') {
      return '--';
    }
    const amount: any = NumberUtil.handleFisAmountToFixed(amounts);
    if (ratio && amount) {
      let returnValue = amount * (1 - unbondCommission);
      willAmount = NumberUtil.handleFisAmountToFixed(returnValue * ratio);
    }
    return willAmount;
  }
  async query_rBalances_account(fisAccount: any, rSymbol: rSymbol, cb?: Function) {
    if (fisAccount && fisAccount.address) {
      const address = fisAccount.address;
      const stafiApi = await stafiServer.createStafiApi();
      const accountData = await stafiApi.query.rBalances.account(rSymbol, address);
      let data = accountData.toJSON();
      cb && cb(data);
      return data;
    }
  }
  async getPools(type: rSymbol, symbol: Symbol, cb?: Function) {
    const stafiApi = await stafiServer.createStafiApi();
    const poolsData = await stafiApi.query.rTokenLedger.bondedPools(type);
    let pools = poolsData.toJSON();

    if (pools && pools.length > 0) {
      pools.forEach((poolPubkey: any) => {
        stafiApi.query.rTokenLedger
          .bondPipelines(type, poolPubkey)
          .then((bondedData: any) => {
            let active = 0;
            let bonded = bondedData.toJSON();
            if (bonded) {
              active = bonded.active;
            }
            const keyringInstance = keyring.init(symbol);

            let poolAddress;
            if (symbol == Symbol.Matic) {
              poolAddress = poolPubkey;
            } else if (symbol == Symbol.Bnb) {
              poolAddress = poolPubkey;
            } else if (symbol == Symbol.Atom) {
              poolAddress = keyringInstance.encodeAddress(hexToU8a(poolPubkey));
            } else {
              poolAddress = keyringInstance.encodeAddress(poolPubkey);
            }
            cb &&
              cb({
                address: poolAddress,
                poolPubkey: poolPubkey,
                active: active,
              });
          })
          .catch((error: any) => {
            console.log('getPools error: ', error);
            cb && cb(null);
          });
      });
    } else {
      cb && cb(null);
    }
  }
  async getFisPools(cb?: Function) {
    const stafiApi = await stafiServer.createStafiApi();
    const poolsData = await stafiApi.query.rFis.pools();
    let pools = poolsData.toJSON();
    if (pools && pools.length > 0) {
      pools.forEach((pool: any) => {
        stafiApi.query.staking
          .ledger(pool)
          .then((ledgerData: any) => {
            let ledger = ledgerData.toJSON();
            if (ledger) {
              cb &&
                cb({
                  address: pool,
                  active: ledger.active,
                });
            }
          })
          .catch((error: any) => {
            console.log('getPools error: ', error);
          });
      });
    }
  }
  async poolBalanceLimit(type: rSymbol) {
    const stafiApi = await stafiServer.createStafiApi();
    const result = await stafiApi.query.rTokenSeries.poolBalanceLimit(type);
    return result.toJSON();
  }
  async fis_poolBalanceLimit() {
    const stafiApi = await stafiServer.createStafiApi();
    const result = await stafiApi.query.rFis.poolBalanceLimit();
    return result.toJSON();
  }
  async rTokenRate(type: rSymbol) {
    const api = await stafiServer.createStafiApi();
    const result = await api.query.rTokenRate.rate(type);
    let ratio: any = NumberUtil.rTokenRateToHuman(result.toJSON());
    if (!ratio) {
      ratio = 1;
    }
    return ratio;
  }

  async rTokenStatDetail(tokenType: string, cycle: number) {
    const result = await rpcServer.getRTokenStatDetail(tokenType, cycle);
    if (result.status === '80000') {
      return result.data;
    }
    return null;
  }

  async rLiquidityRate(type: rSymbol) {
    const api = await stafiServer.createStafiApi();
    let arr = [];
    const grade = 0;
    arr.push(type);
    arr.push(grade);
    const liquidityRate = await api.query.rDexnSwap.swapRates(arr);

    let ratio = 1;
    if (liquidityRate && liquidityRate.toJSON() && liquidityRate.toJSON().rate) {
      ratio = NumberUtil.rLiquidityRateToHuman(liquidityRate.toJSON().rate);
    }
    return ratio;
  }

  async rSwapFee(type: rSymbol) {
    const api = await stafiServer.createStafiApi();

    const fee = await api.query.rDexnSwap.swapFees(type);
    let result: any = '--';
    if (fee && fee.toJSON()) {
      result = NumberUtil.dexFisFeeToHuman(fee.toJSON());
    }
    return result;
  }

  async getTotalIssuance(type: rSymbol) {
    const stafiApi = await stafiServer.createStafiApi();
    const result = await stafiApi.query.rBalances.totalIssuance(type);
    let totalIssuance: any = NumberUtil.tokenAmountToHuman(result.toJSON(), type);
    totalIssuance = NumberUtil.handleFisAmountToFixed(totalIssuance);
    return totalIssuance;
  }
  async bondFees(type: rSymbol) {
    const stafiApi = await stafiServer.createStafiApi();
    const result = await stafiApi.query.rTokenSeries.bondFees(type);
    return result.toJSON();
  }
  async unbondFees(type: rSymbol) {
    const stafiApi = await stafiServer.createStafiApi();
    const result = await stafiApi.query.rTokenSeries.unbondFees(type);
    return result.toJSON();
  }
  async getTotalUnbonding(fisAddress: string, rSymbol: any, cb?: Function) {
    // let fisAddress = getState().FISModule.fisAccount.address;
    let totalUnbonding: any = BigInt(0);
    const stafiApi = await stafiServer.createStafiApi();
    const eraResult = await stafiApi.query.rTokenLedger.chainEras(rSymbol);
    let currentEra = eraResult.toJSON();
    if (currentEra) {
      const result = await stafiApi.query.rTokenSeries.accountUnbonds(fisAddress, rSymbol);
      let accountUnbonds = result.toJSON();
      if (accountUnbonds && accountUnbonds.length > 0) {
        accountUnbonds.forEach((accountUnbond: any) => {
          if (Number(accountUnbond.unlock_era) > Number(currentEra)) {
            totalUnbonding += BigInt(BigInt(accountUnbond.value).toString(10));
          }
        });

        totalUnbonding = NumberUtil.handleFisAmountToFixed(NumberUtil.tokenAmountToHuman(totalUnbonding, rSymbol));
        cb && cb(totalUnbonding);
      } else {
        cb && cb(0);
      }
    } else {
      cb && cb(0);
    }
  }

  async getUnbondRecords(fisAddress: string, symbol: any, cb?: Function) {
    const stafiApi = await stafiServer.createStafiApi();
    const eraResult = await stafiApi.query.rTokenLedger.chainEras(symbol);
    let currentEra = eraResult.toJSON();
    if (currentEra) {
      const result = await stafiApi.query.rTokenSeries.accountUnbonds(fisAddress, symbol);
      let accountUnbonds = result.toJSON();

      if (accountUnbonds && accountUnbonds.length > 0) {
        accountUnbonds.sort((a: any, b: any) => {
          return b.unlock_era * 1 - a.unlock_era * 1;
        });
        const keyringInstance = keyring.initByRSymbol(symbol);
        accountUnbonds.forEach((element: any) => {
          if (symbol === rSymbol.Ksm) {
            element.remainingDays = Math.ceil(Math.max(0, element.unlock_era * 1 + 1 - currentEra * 1) / 4);
          } else if (symbol === rSymbol.Bnb) {
            element.remainingDays = Math.max(0, element.unlock_era * 1 - currentEra * 1);
          } else {
            element.remainingDays = Math.max(0, element.unlock_era * 1 + 1 - currentEra * 1);
          }
          element.periodInDays = config.unboundAroundDays(getSymbolTitle(symbol).toLowerCase());
          element.amount = numberUtil.handleAmountRoundToFixed(numberUtil.tokenAmountToHuman(element.value, symbol), 6);
          if (symbol === rSymbol.Matic || symbol === rSymbol.Bnb) {
            element.receiver = element.recipient;
          } else if (symbol === rSymbol.Sol) {
            element.receiver = keyringInstance.encodeAddress(element.recipient);
          } else {
            element.receiver = keyringInstance.encodeAddress(hexToU8a(element.recipient));
          }
        });
        if (accountUnbonds.length > 10) {
          return accountUnbonds.slice(0, 10);
        }
        return accountUnbonds;
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  async getUnbondCommission() {
    const stafiApi = await stafiServer.createStafiApi();
    const result = await stafiApi.query.rTokenSeries.unbondCommission();
    const unbondCommission = NumberUtil.fisFeeToHuman(result.toJSON());
    return unbondCommission;
  }
  getPool(tokenAmount: any, validPools: any, poolLimit: any, errorMessage?: string) {
    const data = validPools.find((item: any) => {
      if (poolLimit == 0 || Number(item.active) + Number(tokenAmount) <= Number(poolLimit)) {
        return true;
      }
    });
    if (data) {
      return data;
    } else {
      message.error(errorMessage ? errorMessage : 'There is no matching pool, please try again later');
      return null;
    }
  }
  getFisPool(tokenAmount: any, validPools: any, poolLimit: any, errorMessage?: string) {
    const data = validPools.find((item: any) => {
      if (Number(item.active) + Number(tokenAmount) <= Number(poolLimit)) {
        return true;
      }
    });
    if (data) {
      return data;
    } else {
      message.error(errorMessage ? errorMessage : 'There is no matching pool, please try again later');
      return null;
    }
  }
  getPoolForUnbond(tokenAmount: any, validPools: any, type: rSymbol, messageStr?: string) {
    const amount = NumberUtil.tokenAmountToChain(tokenAmount.toString(), type);
    const data = validPools.find((item: any) => {
      if (Number(item.active) >= Number(amount)) {
        return true;
      }
    });
    if (data) {
      return data;
    } else {
      message.error(messageStr || 'There is no matching pool, please try again later');
      return null;
    }
  }
}
