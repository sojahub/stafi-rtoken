import Card from '@components/card/index';
import { getLPList, getRPoolList } from '@features/rPoolClice';
import rpool_ratom_Icon from '@images/rpool_ratom_atom.svg';
import rpool_rdot_Icon from '@images/rpool_rdot_dot.svg';
import rpool_reth_Icon from '@images/rpool_reth.svg';
import rpool_rfis_Icon from '@images/rpool_rfis_fis.svg';
import rpool_rksm_Icon from '@images/rpool_rksm_ksm.svg';
import rpool_rmatic_Icon from '@images/rpool_rmatic_matic.svg';
import Doubt from '@shared/components/doubt';
import numberUtil from '@util/numberUtil';
import { useInterval } from '@util/utils';
import { Spin } from 'antd';
import { RootState } from 'app/store';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CardItem from './components/cardItem';
import TableHead from './components/tableHead';
import TableItem from './components/tableItem';
import './index.scss';

export default function LiquidityPrograms(props: any) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getRPoolList());
    dispatch(getLPList(true));
  }, []);

  useInterval(() => {
    dispatch(getLPList(false));
  }, 60000);

  const [sortField, setSortField] = useState('liquidity');
  const [sortWay, setSortWay] = useState<undefined | string>('asc');

  const { rPoolList, lpList, loadingLpList, totalLiquidity, slippageAvg } = useSelector((state: RootState) => {
    // let rPoolList = [...state.rPoolModule.rPoolList];
    // if (sortField || sortWay) {
    //   rPoolList = rPoolList.sort((a: any, b: any) => {
    //     if (sortField == 'apy') {
    //       let apy_a: number = 0;
    //       let apy_b: number = 0;
    //       // a[sortField]
    //       a[sortField].forEach((item: any) => {
    //         apy_a = apy_a + Number(item.apy ? item.apy : 0);
    //       });
    //       b[sortField].forEach((item: any) => {
    //         apy_b = apy_b + Number(item.apy ? item.apy : 0);
    //       });
    //       if (apy_a > apy_b) {
    //         return sortWay == 'asc' ? -1 : 1;
    //       } else if (apy_a < apy_b) {
    //         return sortWay == 'asc' ? 1 : -1;
    //       } else {
    //         return 0;
    //       }
    //     } else {
    //       if (Number(a[sortField]) > Number(b[sortField])) {
    //         return sortWay == 'asc' ? -1 : 1;
    //       } else if (Number(a[sortField]) < Number(b[sortField])) {
    //         return sortWay == 'asc' ? 1 : -1;
    //       } else {
    //         return 0;
    //       }
    //     }
    //   });
    // }

    // let rTokenDatas = [...rTokenList];
    // rTokenDatas[0].children = rPoolList.filter((item) => {
    //   if ((item.platform == 1 || item.platform == 3) && item.contract == '0x5f49da032defe35489ddb205f3dc66d8a76318b3') {
    //     return true;
    //   } else if (item.platform == 2 && item.contract == '0xF9440930043eb3997fc70e1339dBb11F341de7A8') {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // });
    // rTokenDatas[1].children = rPoolList.filter((item) => {
    //   if ((item.platform == 1 || item.platform == 3) && item.contract == '0xec736f21bea3d34f222ba101af231b57699760f3') {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // });
    // rTokenDatas[2].children = rPoolList.filter((item) => {
    //   if ((item.platform == 1 || item.platform == 3) && item.contract == '0x53e73e10b0315601c938e4d9454e8c7cf72e1236') {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // });
    // rTokenDatas[3].children = rPoolList.filter((item) => {
    //   if ((item.platform == 1 || item.platform == 3) && item.contract == '0xe5d71d5ea5729eceee5d246ced3cbecb2226a8ed') {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // });
    // rTokenDatas[4].children = rPoolList.filter((item) => {
    //   if ((item.platform == 1 || item.platform == 3) && item.contract == '0x80693274615464086132e0751435e954a7dc687f') {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // });

    return {
      rPoolList: state.rPoolModule.rPoolList,
      lpList: state.rPoolModule.lpList,
      loadingLpList: state.rPoolModule.loadingLpList,
      totalLiquidity: state.rPoolModule.totalLiquidity,
      slippageAvg: state.rPoolModule.slippageAvg,
    };
  });

  const totalApy = useMemo(() => {
    let count = 0;
    let total = 0;
    lpList?.forEach((item: any) => {
      item.children?.forEach((poolItem: any) => {
        if (!isNaN(Number(poolItem.apr))) {
          count++;
          total += Number(poolItem.apr);
        }
      });
    });
    if (count > 0) {
      return numberUtil.handleAmountRoundToFixed(Number(total) / Number(count), 2);
    }
    return '--';
  }, [lpList]);

  return (
    <Card className='stafi_rpool_home_card'>
      {/* <div className="title">
        <label>Provide liquidity and earn reward</label><A onClick={()=>{
          window.open("https://docs.stafi.io/rproduct/rpool/the-guide-for-rpool")
        }}>How to earn</A>
      </div> */}
      <div className='card_list'>
        <CardItem label='Total Liquidity' value={`$${numberUtil.amount_format(totalLiquidity)}`} />
        <CardItem label='Farming APY. avg' value={`${totalApy}%`} />
        <CardItem
          label='rToken Price Slippage. avg'
          doubt={<Doubt tip='This stats indicates average slippage of rTokens.'></Doubt>}
          value={`${slippageAvg}%`}
        />
      </div>
      <div className='table'>
        <TableHead
          sortField={sortField}
          sortWay={sortWay}
          onClick={(field: any) => {
            if (field == sortField) {
              if (sortWay == 'asc') {
                setSortWay('desc');
              } else if (sortWay == 'desc') {
                setSortField(undefined);
                setSortWay(undefined);
              }
            } else {
              setSortField(field);
              setSortWay('asc');
            }
          }}
        />

        <Spin spinning={loadingLpList} size='large' tip='loading'>
          <div className='table_body' style={{ minHeight: '300px' }}>
            {lpList.map((data: any, i: number) => {
              return (
                <div key={`${data.name}${i}`} className='rtoken_type'>
                  {data.children.map((item: any, index: number) => {
                    let type = '';
                    let icon = null;
                    let stakeUrl = '';
                    let liquidityUrl = '';
                    // let wrapFiUrl="";
                    if (data.extraName === 'rETH') {
                      type = 'rETH/ETH';
                      icon = rpool_reth_Icon;
                      stakeUrl = 'https://app.stafi.io/rETH';
                      liquidityUrl = 'https://app.uniswap.org/#/add/v2/0x9559aaa82d9649c7a7b220e7c461d2e74c9a3593/ETH';
                      // wrapFiUrl="https://drop.wrapfi.io/phase2/staker?pid=2";
                    } else if (data.extraName === 'rFIS') {
                      type = 'rFIS/FIS';
                      icon = rpool_rfis_Icon;
                      stakeUrl = 'https://app.stafi.io/rFIS';
                      liquidityUrl = 'https://app.uniswap.org/#/add/v2/ETH/0xc82eb6dea0c93edb8b697b89ad1b13d19469d635';
                      // wrapFiUrl="https://drop.wrapfi.io/phase2/staker?pid=1";
                    } else if (data.extraName === 'rDOT') {
                      type = 'rDOT/DOT';
                      icon = rpool_rdot_Icon;
                      stakeUrl = 'https://app.stafi.io/rATOM';
                      liquidityUrl = 'https://app.uniswap.org/#/add/v2/ETH/0xd01cb3d113a864763dd3977fe1e725860013b0ed';
                      // wrapFiUrl="https://drop.wrapfi.io/phase2/staker?pid=5";
                    } else if (data.extraName === 'rKSM') {
                      type = 'rKSM/KSM';
                      icon = rpool_rksm_Icon;
                      stakeUrl = 'https://app.stafi.io/rDOT';
                      liquidityUrl = 'https://app.uniswap.org/#/add/v2/ETH/0x505f5a4ff10985fe9f93f2ae3501da5fe665f08a';
                      // wrapFiUrl="https://drop.wrapfi.io/phase2/staker?pid=3";
                    } else if (data.extraName === 'rATOM') {
                      type = 'rATOM/ATOM';
                      icon = rpool_ratom_Icon;
                      stakeUrl = 'https://app.stafi.io/rKSM';
                      liquidityUrl = 'https://app.uniswap.org/#/add/v2/ETH/0x3c3842c4d3037ae121d69ea1e7a0b61413be806c';
                      // wrapFiUrl="https://drop.wrapfi.io/phase2/staker?pid=4";
                    } else if (data.extraName === 'rMATIC') {
                      type = 'rMATIC/MATIC';
                      icon = rpool_rmatic_Icon;
                      stakeUrl = 'https://app.stafi.io/rKSM';
                      liquidityUrl = 'https://app.uniswap.org/#/add/v2/ETH/0x3c3842c4d3037ae121d69ea1e7a0b61413be806c';
                      // wrapFiUrl="https://drop.wrapfi.io/phase2/staker?pid=4";
                    }
                    if (type === '') {
                      return <div key={`${data.name}${item.platform}${index}`}></div>;
                    }
                    return (
                      <TableItem
                        key={`${data.name}${item.platform}${index}`}
                        wrapFiUrl={'https://drop.wrapfi.io'}
                        liquidityUrl={liquidityUrl}
                        history={props.history}
                        stakeUrl={stakeUrl}
                        pairIcon={index == 0 ? icon : null}
                        pairValue={index == 0 ? type : null}
                        apr={item.apr}
                        liquidity={item.liquidity}
                        slippage={item.slippage}
                        lpName={data.name}
                        poolOn={1}
                        platform={item.platform}
                        poolIndex={item.poolIndex}
                        rTokenName={data.extraName}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </Spin>
      </div>
    </Card>
  );
}
