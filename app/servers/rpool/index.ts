import rpc from '@util/rpc';
import config from '@config/index';
export default class Index{
    getRPoolList(){
        const url=config.api()+"/stafi/v1/webapi/rpool/rpoollist";
        return rpc.post(url)
    }
}