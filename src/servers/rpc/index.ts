// import rpc from 'src/util/rpc';
import moment from 'moment';
import config from 'src/config/index';
import { rSymbol } from 'src/keyring/defaults';
import { api } from 'src/util/http';

export const pageCount = 20;

export default class Index {
  getReward(
    stafiSource: string,
    ethSource: string,
    rSymbol: rSymbol,
    pageIndex: Number,
    bscSource?: string,
    solSource?: string,
  ) {
    const url = config.api2() + '/stafi/webapi/rtoken/reward';
    return api.post(url, {
      stafiSource,
      ethSource,
      rSymbol,
      pageIndex,
      pageCount: pageCount,
      bscSource: bscSource || '',
      solSource: solSource || '',
    });
  }

  getRTokenStatDetail(rsymbol: string, cycle: number) {
    const url = 'v1/webapi/rtoken/statdetail';
    return api.post(url, {
      timestamp: moment().valueOf(),
      rsymbol,
      cycle,
    });
  }
}
