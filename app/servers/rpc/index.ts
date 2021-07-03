// import rpc from '@util/rpc';
import config from '@config/index';
import {api} from '@util/http';
export const pageCount=20;
export default class Index{
    getReward(source:string,rSymbol:-1|0|1|2|3,pageIndex:Number){
        const url=config.api2()+"/stafi/webapi/rtoken/reward";
        return api.post(url,{source,rSymbol,pageIndex,pageCount:pageCount})
    }
}