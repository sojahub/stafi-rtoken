import Card from '@components/card/index';
import { getRPoolList } from '@features/rPoolClice';
import rpool_ratom_Icon from '@images/rpool_ratom.svg';
import rpool_rdot_Icon from '@images/rpool_rdot.svg';
import rpool_reth_Icon from '@images/rpool_reth.svg';
import rpool_rfis_Icon from '@images/rpool_rfis.svg';
import rpool_rksm_Icon from '@images/rpool_rksm.svg';
import A from '@shared/components/button/a';
import { RootState } from 'app/store';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CardItem from './components/cardItem';
import TableHead from './components/tableHead';
import TableItem from './components/tableItem';
import numberUtil from '@util/numberUtil'
import './index.scss';

export default function Inde(props:any){ 
 
  const dispatch=useDispatch();
  useEffect(()=>{
    dispatch(getRPoolList())
  },[])
  const [sortField,setSortField]=useState('liquidity');
  const [sortWay,setSortWay]=useState<undefined|string>('asc');
  const {list,totalLiquidity,apyAvg,slippageAvg}=useSelector((state:RootState)=>{
     
    let rPoolList=[...state.rPoolModule.rPoolList]
    if(sortField || sortWay){
      rPoolList =rPoolList.sort((a:any,b:any)=>{ 
        if(sortField=="apy"){
            let apy_a:number=0;
            let apy_b:number=0;
            // a[sortField]
           a[sortField].forEach((item:any)=>{
            apy_a=apy_a + Number(item.apy?item.apy:0);
           })
           b[sortField].forEach((item:any)=>{
            apy_b=apy_b + Number(item.apy?item.apy:0);
           })
           if(apy_a>apy_b){
            return sortWay=="asc"?-1:1;
          }else if(apy_a<apy_b){
            return sortWay=="asc"? 1:-1;
          }else{
            return 0
          }
        }else{ 
          if(Number(a[sortField])>Number(b[sortField])){
            return sortWay=="asc"?-1:1;
          }else if(Number(a[sortField])<Number(b[sortField])){
            return sortWay=="asc"? 1:-1;
          }else{
            return 0
          }
        }
      })
    } 
    return {
      list:rPoolList,
      totalLiquidity:state.rPoolModule.totalLiquidity,
      apyAvg:state.rPoolModule.apyAvg,
      slippageAvg:state.rPoolModule.slippageAvg
    }
  })
  return <Card className="stafi_rpool_home_card">
      <div className="title">
        <label>Provide liquidity and earn reward</label><A>How to earn</A>
      </div>
      <div className="card_list">
        <CardItem label="Total Liquidity" value={`$${numberUtil.amount_format(totalLiquidity)}`}/>
        <CardItem label="Farming APY. avg" value={`${apyAvg}%`}/>
        <CardItem label="rToken Price Slippage. avg" value={`${slippageAvg}%`}/>
      </div>
      <div className="table">
            
            <TableHead sortField={sortField} sortWay={sortWay} onClick={(field:any)=>{
              if(field==sortField){
                if(sortWay=="asc"){
                  setSortWay("desc");
                }else if(sortWay=="desc"){
                  setSortField(undefined);
                  setSortWay(undefined);
                }
              }else{
                  setSortField(field);
                  setSortWay("asc");
              } 
            }}/>
            <div className="table_body">
              {
                list.map((item:any)=>{
                  let type="";
                  let icon=null; 
                  let stakeUrl="";
                  let liquidityUrl="";
                  let wrapFiUrl="";
                  if(item.platform==1 || item.platform==3){
                    if(item.contract=="0x5f49da032defe35489ddb205f3dc66d8a76318b3"){
                      type="rETH/ETH";
                      icon=rpool_reth_Icon;
                      stakeUrl="https://app.stafi.io/rETH";
                      liquidityUrl="https://app.uniswap.org/#/add/v2/0x9559aaa82d9649c7a7b220e7c461d2e74c9a3593/ETH";
                      wrapFiUrl="https://drop.wrapfi.io/phase2/staker?pid=2";
                    }else if(item.contract=="0xec736f21bea3d34f222ba101af231b57699760f3"){
                      type="rFIS/ETH";
                      icon=rpool_rfis_Icon;
                      stakeUrl="https://rtoken.stafi.io/rfis";
                      liquidityUrl="https://app.uniswap.org/#/add/v2/ETH/0xc82eb6dea0c93edb8b697b89ad1b13d19469d635";
                      wrapFiUrl="https://drop.wrapfi.io/phase2/staker?pid=1";
                    }else if(item.contract=="0x53e73e10b0315601c938e4d9454e8c7cf72e1236"){
                      type="rATOM/ETH";
                      icon=rpool_ratom_Icon;
                      stakeUrl="https://app.stafi.io/rATOM";
                      liquidityUrl="https://app.uniswap.org/#/add/v2/ETH/0xd01cb3d113a864763dd3977fe1e725860013b0ed";
                      wrapFiUrl="https://drop.wrapfi.io/phase2/staker?pid=5";
                    }else if(item.contract=="0xe5d71d5ea5729eceee5d246ced3cbecb2226a8ed"){
                      type="rDOT/ETH";
                      icon=rpool_rdot_Icon;
                      stakeUrl="https://app.stafi.io/rDOT";
                      liquidityUrl="https://app.uniswap.org/#/add/v2/ETH/0x505f5a4ff10985fe9f93f2ae3501da5fe665f08a";
                      wrapFiUrl="https://drop.wrapfi.io/phase2/staker?pid=3";
                    }else if(item.contract=="0x80693274615464086132e0751435e954a7dc687f"){
                      type="rKSM/ETH";
                      icon=rpool_rksm_Icon;
                      stakeUrl="https://app.stafi.io/rKSM";
                      liquidityUrl="https://app.uniswap.org/#/add/v2/ETH/0x3c3842c4d3037ae121d69ea1e7a0b61413be806c";
                      wrapFiUrl="https://drop.wrapfi.io/phase2/staker?pid=4";
                    }
                  }else if(item.platform==2){
                    if(item.contract=="0xF9440930043eb3997fc70e1339dBb11F341de7A8"){
                      type="rETH/ETH";
                      icon=rpool_reth_Icon;
                      stakeUrl="https://app.stafi.io/rETH";
                      liquidityUrl="https://curve.fi/reth";
                      wrapFiUrl="https://drop.wrapfi.io/phase2/staker?pid=2";
                    }
                  }
                  if(type==""){
                    return <></>
                  }
                  return <TableItem wrapFiUrl={wrapFiUrl} liquidityUrl={liquidityUrl} history={props.history} stakeUrl={stakeUrl} pairIcon={icon} pairValue={type} apyList={item.apy}  liquidity={item.liquidity} slippage={item.slippage} poolOn={item.platform}/>
                })
              } 
            </div>
      </div>
  </Card>
}