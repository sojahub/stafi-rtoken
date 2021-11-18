import { Spin } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import rpool_ratom_Icon from 'src/assets/images/rpool_ratom_atom.svg';
import rpool_rbnb_Icon from 'src/assets/images/rpool_rbnb_bnb.svg';
import rpool_rdot_Icon from 'src/assets/images/rpool_rdot_dot.svg';
import rpool_reth_Icon from 'src/assets/images/rpool_reth.svg';
import rpool_rfis_Icon from 'src/assets/images/rpool_rfis_fis.svg';
import rpool_rksm_Icon from 'src/assets/images/rpool_rksm_ksm.svg';
import rpool_rmatic_Icon from 'src/assets/images/rpool_rmatic_matic.svg';
import Card from 'src/components/card/index';
import config from 'src/config/index';
import { getLPList, getRPoolList } from 'src/features/rPoolClice';
import Doubt from 'src/shared/components/doubt';
import { RootState } from 'src/store';
import numberUtil from 'src/util/numberUtil';
import { useInterval } from 'src/util/utils';
import CardItem from './components/cardItem';
import OldTableItem from './components/OldTableItem';
import TableHead from './components/tableHead';
import TableItem from './components/tableItem';
import './index.scss';

export default function LiquidityPrograms(props: any) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getRPoolList());
  }, [dispatch]);

  useInterval(() => {
    if (rPoolList && rPoolList.length > 0) {
      dispatch(getLPList(rPoolList));
    }
  }, 60000);

  const [sortField, setSortField] = useState('liquidity');
  const [sortWay, setSortWay] = useState<undefined | string>('asc');

  const { rPoolList, lpList, loadingLpList } = useSelector((state: RootState) => {
    return {
      rPoolList: state.rPoolModule.rPoolList,
      lpList: state.rPoolModule.lpList,
      loadingLpList: state.rPoolModule.loadingLpList,
    };
  });

  useEffect(() => {
    if (rPoolList && rPoolList.length > 0) {
      dispatch(getLPList(rPoolList));
    }
  }, [rPoolList, dispatch]);

  const { ethCurveData, atomSifData } = useMemo(() => {
    const ethCurveData = rPoolList.find((item) => {
      return item.platform == 2 && item.contract == config.rETHLpContract();
    });
    const atomSifData = rPoolList.find((item) => {
      return false;
    });
    return {
      ethCurveData,
      atomSifData,
    };
  }, [rPoolList]);

  const { avgApy, avgSlippage, totalLiquidity } = useMemo(() => {
    let count = 0;
    let apySum = 0;
    let slippageSum = 0;
    let liquiditySum = 0;
    if (ethCurveData) {
      count++;
      ethCurveData?.apy?.forEach((apyitem: any) => {
        apySum += Number(apyitem.apy);
      });
      slippageSum += Number(ethCurveData.slippage);
      liquiditySum += Number(ethCurveData.liquidity);
    }
    if (atomSifData) {
      count++;
      atomSifData?.apy?.forEach((apyitem: any) => {
        apySum += Number(apyitem.apy);
      });
      slippageSum += Number(atomSifData.slippage);
      liquiditySum += Number(atomSifData.liquidity);
    }
    lpList?.forEach((data: any) => {
      data.children?.forEach((item: any) => {
        if (!isNaN(Number(item.apr))) {
          count++;
          apySum += Number(item.apr);
          slippageSum += Number(item.slippage);
          liquiditySum += Number(item.liquidity);
        }
      });
    });

    return {
      avgApy: count > 0 ? numberUtil.handleAmountRoundToFixed(apySum / count, 2) : '--',
      avgSlippage: count > 0 ? numberUtil.handleAmountRoundToFixed(slippageSum / count, 2) : '--',
      totalLiquidity: count > 0 ? numberUtil.handleAmountRoundToFixed(liquiditySum, 2) : '--',
    };
  }, [ethCurveData, atomSifData, lpList]);

  return (
    <Card className='stafi_rpool_home_card'>
      <div className='card_list'>
        <CardItem label='Total Liquidity' value={`$${numberUtil.amount_format(totalLiquidity)}`} />

        <CardItem label='Farming APY. avg' value={`${avgApy}%`} />

        <CardItem
          label='rToken Price Slippage. avg'
          doubt={<Doubt tip='This stats indicates average slippage of rTokens.'></Doubt>}
          value={`${avgSlippage}%`}
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
            <OldTableItem
              wrapFiUrl={'https://drop.wrapfi.io'}
              liquidityUrl='https://curve.fi/reth'
              history={props.history}
              pairIcon={rpool_reth_Icon}
              pairValue='rETH/ETH'
              apyList={ethCurveData ? ethCurveData.apy : []}
              liquidity={ethCurveData && ethCurveData.liquidity}
              slippage={ethCurveData && ethCurveData.slippage}
              poolOn={ethCurveData && ethCurveData.platform}
              platform='Ethereum'
            />

            {/* <OldTableItem
              wrapFiUrl={'https://drop.wrapfi.io'}
              liquidityUrl='https://dex.sifchain.finance/#/pool/add-liquidity/setup/cratom'
              history={props.history}
              pairIcon={rpool_ratom_rowan_Icon}
              pairValue='rATOM/ROWAN'
              apyList={atomSifData ? atomSifData.apy : []}
              liquidity={atomSifData && atomSifData.liquidity}
              slippage={atomSifData && atomSifData.slippage}
              poolOn={atomSifData && atomSifData.platform}
              platform='Cosmos'
            /> */}

            {lpList.map((data: any, i: number) => {
              return (
                <div key={`${data.name}${i}`} className='rtoken_type'>
                  {data.children.map((item: any, index: number) => {
                    let type = '';
                    let icon = null;
                    if (data.extraName === 'rETH') {
                      type = 'rETH/ETH';
                      icon = rpool_reth_Icon;
                    } else if (data.extraName === 'rFIS') {
                      type = 'rFIS/FIS';
                      icon = rpool_rfis_Icon;
                    } else if (data.extraName === 'rDOT') {
                      type = 'rDOT/DOT';
                      icon = rpool_rdot_Icon;
                    } else if (data.extraName === 'rKSM') {
                      type = 'rKSM/KSM';
                      icon = rpool_rksm_Icon;
                    } else if (data.extraName === 'rATOM') {
                      type = 'rATOM/ATOM';
                      icon = rpool_ratom_Icon;
                    } else if (data.extraName === 'rMATIC') {
                      type = 'rMATIC/MATIC';
                      icon = rpool_rmatic_Icon;
                    } else if (data.extraName === 'rBNB') {
                      type = 'rBNB/BNB';
                      icon = rpool_rbnb_Icon;
                    }
                    if (type === '') {
                      return <div key={`${data.name}${item.platform}${index}`}></div>;
                    }
                    return (
                      <TableItem
                        key={`${data.name}${item.platform}${index}`}
                        history={props.history}
                        pairIcon={index == 0 ? icon : null}
                        pairValue={index == 0 ? type : null}
                        apr={item.apr}
                        liquidity={item.liquidity}
                        slippage={item.slippage}
                        poolOn={1}
                        platform={item.platform}
                        poolIndex={item.poolIndex}
                        lpContract={item.lpContract}
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
