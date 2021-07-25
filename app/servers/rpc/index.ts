// import rpc from '@util/rpc';
import config from '@config/index';
import {api} from '@util/http';
import {rSymbol} from '@keyring/defaults'
export const pageCount=20;
export default class Index{
    getReward(stafiSource:string,ethSource:string,rSymbol:rSymbol,pageIndex:Number){
        const url=config.api2()+"/stafi/webapi/rtoken/reward";
        return api.post(url,{stafiSource,ethSource,rSymbol,pageIndex,pageCount:pageCount})
    }
}