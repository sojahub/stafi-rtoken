import {message} from 'antd'
import EthServer from '@servers/eth';
import NumberUtil from '@util/numberUtil';
import {rSymbol,Symbol} from '@keyring/defaults'
import StafiServer from '@servers/stafi';
import keyring from '@servers/index';
import BridgeServer from '@servers/bridge'
import { countBy } from 'lodash';
 
const ethServer=new EthServer();
const stafiServer=new StafiServer();
const bridgeServer=new BridgeServer();
export default class CommonClice{
    getAssetBalance=(ethAddress:string,getRKSMTokenAbi:string,getRKSMTokenAddress:string,cb?:Function)=>{
        let web3=ethServer.getWeb3(); 
        let contract = new web3.eth.Contract(getRKSMTokenAbi, getRKSMTokenAddress, {
          from: ethAddress
        }); 
        try{
          contract.methods.balanceOf(ethAddress).call().then((balance:any) => {
    
            let rbalance = web3.utils.fromWei(balance, 'ether');   
            cb && cb(rbalance);
          }).catch((e:any)=>{
            console.error(e)
          });
        }catch(e:any){
          console.error(e)
        }
    }
    async getErc20Allowance(ethAddress:string,getRKSMTokenAbi:string,getRKSMTokenAddress:string,cb?:Function){
      let web3=ethServer.getWeb3(); 
      let contract = new web3.eth.Contract(getRKSMTokenAbi, getRKSMTokenAddress, {
        from: ethAddress
      }); 
      try{
        const allowance = await contract.methods.allowance(ethAddress, bridgeServer.getBridgeErc20HandlerAddress()).call();
         // this.erc20RFisAllowance = allowance; 
         cb && cb(allowance);
      }catch(e:any){
        console.error(e) 
      }
    }
    getWillAmount(ratio:any,unbondCommission:any,amounts:any){ 
        let willAmount:any=0;
        // let ratio=state.FISModule.ratio; 
        // let unbondCommission = state.FISModule.unbondCommission;
        if(amounts=="--" || ratio=="--" || unbondCommission=="--"){
            return "--"
        }
        const amount:any = NumberUtil.handleFisAmountToFixed(amounts);
        if (ratio && amount) {
            let returnValue = amount * (1 - unbondCommission); 
            willAmount = NumberUtil.handleFisAmountToFixed(returnValue * ratio);;
        } 
        return willAmount;
    }
    async query_rBalances_account(fisAccount:any,rSymbol:rSymbol,cb?:Function){

      if(fisAccount && fisAccount.address){
        const address = fisAccount.address;
        const stafiApi = await stafiServer.createStafiApi();
        const accountData = await stafiApi.query.rBalances.account(rSymbol, address);
        let data = accountData.toJSON();
        cb && cb(data); 
      }
    }
    async getPools(type:rSymbol,symbol:Symbol,cb?:Function){
      const stafiApi = await stafiServer.createStafiApi();
      const poolsData = await stafiApi.query.rTokenLedger.bondedPools(type)
      let pools = poolsData.toJSON();
      if (pools && pools.length > 0) {
        pools.forEach((poolPubkey: any) => {
          stafiApi.query.rTokenLedger.bondPipelines(type, poolPubkey).then((bondedData: any) => {
            let active = 0;
            let bonded = bondedData.toJSON();
            if (bonded) {
              active = bonded.active;
            }
            const keyringInstance = keyring.init(symbol);
            let poolAddress = keyringInstance.encodeAddress(poolPubkey);
            // dispatch(setValidPools());
            cb && cb({
              address: poolAddress,
              active: active
            })
          }).catch((error: any) => { });
        })
      };
    }
    async poolBalanceLimit(type:rSymbol){
      const stafiApi = await stafiServer.createStafiApi();
      const result =await stafiApi.query.rTokenSeries.poolBalanceLimit(type)
      return result.toJSON()
    }
    async rTokenRate(type:rSymbol){
      const api = await stafiServer.createStafiApi();
      const result = await api.query.rTokenRate.rate(type);
      let ratio = NumberUtil.fisAmountToHuman(result.toJSON());
      if (!ratio) {
        ratio = 1;
      }
      return ratio
    }
    async getTotalIssuance(type:rSymbol){
      const stafiApi = await stafiServer.createStafiApi(); 
      const  result =await stafiApi.query.rBalances.totalIssuance(type) 
      let totalIssuance:any = NumberUtil.fisAmountToHuman(result.toJSON());
      totalIssuance = NumberUtil.handleFisAmountToFixed(totalIssuance); 
      return totalIssuance
    }
    async bondFees(type:rSymbol){
      const stafiApi = await stafiServer.createStafiApi();
      const result= await stafiApi.query.rTokenSeries.bondFees(type);
      return result.toJSON();
    }
    async unbondFees(type:rSymbol){
      const stafiApi = await stafiServer.createStafiApi();
      const result= await stafiApi.query.rTokenSeries.unbondFees(type) 
      return result.toJSON();
    }
    async getTotalUnbonding(fisAddress:string,rSymbol:any,cb?:Function){
      // let fisAddress = getState().FISModule.fisAccount.address;
      let totalUnbonding:any = 0;
      const stafiApi = await stafiServer.createStafiApi();
      const  eraResult = await stafiApi.query.rTokenLedger.chainEras(rSymbol);
      let currentEra = eraResult.toJSON(); 
      if (currentEra) {
        const result = await stafiApi.query.rTokenSeries.accountUnbonds(fisAddress, rSymbol) 
        let accountUnbonds = result.toJSON(); 
        if (accountUnbonds && accountUnbonds.length > 0) {
          accountUnbonds.forEach((accountUnbond:any) => {
            if (accountUnbond.unlock_era > currentEra) {
                totalUnbonding = totalUnbonding + accountUnbond.value;
            }
          });
    
          totalUnbonding = NumberUtil.handleFisAmountToFixed(NumberUtil.fisAmountToHuman(totalUnbonding));
          cb && cb(totalUnbonding)
        } 
      }else{
        cb && cb(0)
      }
    }
    async getUnbondCommission(){
      const stafiApi = await stafiServer.createStafiApi();
      const result=await stafiApi.query.rTokenSeries.unbondCommission();
      const unbondCommission = NumberUtil.fisFeeToHuman(result.toJSON());
      return unbondCommission;
    }
    getPool(tokenAmount: any, validPools: any, poolLimit: any) {
      const data = validPools.find((item: any) => {
        if (poolLimit == 0 || Number(item.active) + tokenAmount <= poolLimit) {
          return true;
        }
      });
      if (data) {
        return data.address
      } else {
        message.error("There is no matching pool, please try again later.");
        return null;
      }
    }
    getPoolForUnbond (tokenAmount: any, validPools: any) {
      const amount = NumberUtil.fisAmountToChain(tokenAmount.toString());
      const data = validPools.find((item: any) => {
        if (Number(item.active) >= amount) {
          return true;
        }
      });
      if (data) {
        return data.address
      } else {
        message.error("There is no matching pool, please try again later.");
        return null;
      }
    } 
}
