import config from '@config/index';
import { api } from '@util/http';

export default class Index {
  getPoolInfo() {
    const url = config.feeStationApp() + '/api/v1/station/poolInfo';
    return api.get(url);
  }

  postSwapInfo(params: any) {
    const url = config.feeStationApp() + '/api/v1/station/swapInfo';
    return api.post(url, params);
  }

  getSwapInfo(params: any) {
    const url = config.feeStationApp() + '/api/v1/station/swapInfo';
    return api.get(url, { symbol: params.symbol, blockHash: params.blockHash, txHash: params.txHash });
  }
}
