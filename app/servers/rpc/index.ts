// import rpc from '@util/rpc';
import config from '@config/index';
import {api} from '@util/http';
export const pageCount=2;
export default class Index{
    getReward(source:string,rSymbol:-1|0|1|2|3,pageIndex:Number){
        const url="webapi/rtoken/reward";
        return api.post(url,{source,rSymbol,pageIndex,pageCount:pageCount})
    }
}