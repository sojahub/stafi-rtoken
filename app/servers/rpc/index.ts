// import rpc from '@util/rpc';
import config from '@config/index';
import { rSymbol } from '@keyring/defaults';
import { api } from '@util/http';
import moment from 'moment';

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
