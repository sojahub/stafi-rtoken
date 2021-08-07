import config from '@config/index';
import { api } from '@util/http';

declare const window: any;
declare const ethereum: any;
let web3Instance: any = null;

export default class Index {
  getPoolInfo() {
    const url = config.feeStationApp() + '/api/v1/station/poolInfo';
    return api.get(url);
  }
}
