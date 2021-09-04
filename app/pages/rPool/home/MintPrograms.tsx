import Card from '@components/card/index';
import { getRsymbolByTokenTitle } from '@config/index';
import { getRtokenPriceList } from '@features/bridgeClice';
import { getMintPrograms } from '@features/mintProgramsClice';
import no_data_png from '@images/nodata.png';
import ratom_icon from '@images/r_atom.svg';
import rdot_icon from '@images/r_dot.svg';
import reth_icon from '@images/r_eth.svg';
import rfis_icon from '@images/r_fis.svg';
import rksm_icon from '@images/r_ksm.svg';
import rmatic_icon from '@images/r_matic.svg';
import numberUtil from '@util/numberUtil';
import { useInterval } from '@util/utils';
import { Spin } from 'antd';
import { RootState } from 'app/store';
import { cloneDeep } from 'lodash';
import { multiply } from 'mathjs';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CardItem from './components/cardItem';
import MintTableHead from './components/MintTableHead';
import MintTableItem from './components/MintTableItem';
import './MintPrograms.scss';

const rTokenList: Array<any> = [
  {
    token: 'rETH',
    children: [],
  },
  {
    token: 'rFIS',
    children: [],
  },
  {
    token: 'rDOT',
    children: [],
  },
  {
    token: 'rATOM',
    children: [],
  },
  {
    token: 'rMATIC',
    children: [],
  },
  {
    token: 'rKSM',
    children: [],
  },
];

export default function MintPrograms(props: any) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMintPrograms(true));
  }, []);

  useInterval(() => {
    dispatch(getMintPrograms());
  }, 60000);

  const [sortField, setSortField] = useState('apy');
  const [sortWay, setSortWay] = useState<undefined | string>('asc');
  const [mintDataList, setMintDataList] = useState([]);

  const { unitPriceList, rDOTActs, rMaticActs, rFISActs, rKSMActs, rATOMActs, rETHActs, loading, loadComplete } =
    useSelector((state: RootState) => {
      return {
        unitPriceList: state.bridgeModule.priceList,
        rDOTActs: state.mintProgramsModule.rDOTActs,
        rMaticActs: state.mintProgramsModule.rMATICActs,
        rFISActs: state.mintProgramsModule.rFISActs,
        rKSMActs: state.mintProgramsModule.rKSMActs,
        rATOMActs: state.mintProgramsModule.rATOMActs,
        rETHActs: state.mintProgramsModule.rETHActs,
        loadComplete: state.mintProgramsModule.loadComplete,
        loading: state.globalModule.loading,
      };
    });

  const { totalMintedValue, totalFisAmount } = useMemo(() => {
    let total = 0;
    let fisAmount = 0;
    const response = { totalMintedValue: '--', totalFisAmount: '--' };

    mintDataList.forEach((tokenItem: any) => {
      let unitPrice = unitPriceList?.find((item: any) => {
        return item.symbol === tokenItem.token;
      });
      if (!unitPrice || !tokenItem.children || tokenItem.children.length === 0) {
        return true;
      }

      tokenItem.children.forEach((item: any) => {
        const formatTotalRTokenAmount = numberUtil.tokenAmountToHuman(
          item.total_rtoken_amount,
          getRsymbolByTokenTitle(tokenItem.token),
        );
        if (unitPrice) {
          total += multiply(unitPrice.price, formatTotalRTokenAmount);
        }
        fisAmount += numberUtil.fisAmountToHuman(item.total_reward);
      });
    });

    if (unitPriceList) {
      response.totalMintedValue = numberUtil.amount_format(total);
    }
    response.totalFisAmount = numberUtil.amount_format(fisAmount);
    return response;
  }, [unitPriceList, mintDataList]);

  const showNoData = useMemo(() => {
    let itemCount = 0;
    mintDataList?.forEach((item) => {
      itemCount += item.children && item.children.length;
    });
    return loadComplete && itemCount === 0;
  }, [loadComplete, mintDataList]);

  useEffect(() => {
    dispatch(getRtokenPriceList());
  }, []);

  useEffect(() => {
    rTokenList.forEach((item: any) => {
      if (item.token === 'rDOT') {
        item.children = cloneDeep(rDOTActs);
      }
      if (item.token === 'rMATIC') {
        item.children = cloneDeep(rMaticActs);
      }
      if (item.token === 'rFIS') {
        item.children = cloneDeep(rFISActs);
      }
      if (item.token === 'rKSM') {
        item.children = cloneDeep(rKSMActs);
      }
      if (item.token === 'rATOM') {
        item.children = cloneDeep(rATOMActs);
      }
      if (item.token === 'rETH') {
        item.children = cloneDeep(rETHActs);
      }
    });

    let list = [...rTokenList];

    list.sort((x: any, y: any) => {
      if (x.children.length === 0 || y.children.length === 0) {
        return 0;
      }
      if (x.children[0].nowBlock < x.children[0].end && y.children[0].nowBlock > y.children[0].end) {
        return -1;
      } else if (x.children[0].nowBlock < x.children[0].end && y.children[0].nowBlock < y.children[0].end) {
        if (x.children[0].end !== y.children[0].end) {
          return x.children[0].end - y.children[0].end;
        }
        let xTotal = 0;
        x.children.forEach((i: any) => {
          xTotal += i.total_reward;
        });
        let yTotal = 0;
        y.children.forEach((i: any) => {
          yTotal += i.total_reward;
        });
        return yTotal - xTotal;
      }
      return 0;
    });

    list.forEach((tokenItem: any) => {
      let unitPrice = unitPriceList?.find((item: any) => {
        return item.symbol === tokenItem.token;
      });
      if (!unitPrice || !tokenItem.children || tokenItem.children.length === 0) {
        return true;
      }

      tokenItem.children.forEach((item: any) => {
        const formatTotalRTokenAmount = numberUtil.tokenAmountToHuman(
          item.total_rtoken_amount,
          getRsymbolByTokenTitle(tokenItem.token),
        );
        if (unitPrice) {
          item.mintedValue = multiply(unitPrice.price, formatTotalRTokenAmount);
        }
      });
    });
    setMintDataList(list);
  }, [unitPriceList, rDOTActs, rMaticActs, rFISActs, rKSMActs, rATOMActs, rETHActs]);

  // useInterval(() => {
  //   setMintDataList([...mintDataList]);
  // }, 1000);

  return (
    <Card className='stafi_rpool_mint'>
      <div className='card_list'>
        <CardItem label='Total minted value' value={`$${totalMintedValue}`} />
        <CardItem label='Total reward FIS' value={`${totalFisAmount}`} />
      </div>

      <div className='table'>
        <MintTableHead
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

        <Spin spinning={loading} size='large' tip='loading'>
          <div className='table_body'>
            {showNoData && (
              <img src={no_data_png} style={{ width: '150px', marginTop: '100px', alignSelf: 'center' }} />
            )}

            {!showNoData &&
              mintDataList.map((data: any, i: any) => {
                return (
                  <div
                    key={`${data.token}${i}`}
                    className='rtoken_type'
                    style={{ marginBottom: data.children.length > 0 ? '30px' : 0 }}>
                    {data.children.map((item: any, index: number) => {
                      let type = '';
                      let icon = null;
                      let stakeUrl = '';
                      let liquidityUrl = '';
                      if (data.token === 'rETH') {
                        type = data.token;
                        icon = reth_icon;
                        stakeUrl = 'https://app.stafi.io/rETH';
                        liquidityUrl =
                          'https://app.uniswap.org/#/add/v2/0x9559aaa82d9649c7a7b220e7c461d2e74c9a3593/ETH';
                      } else if (data.token === 'rDOT') {
                        type = data.token;
                        icon = rdot_icon;
                        stakeUrl = 'https://app.stafi.io/rFIS';
                        liquidityUrl =
                          'https://app.uniswap.org/#/add/v2/ETH/0xc82eb6dea0c93edb8b697b89ad1b13d19469d635';
                      } else if (data.token === 'rKSM') {
                        type = data.token;
                        icon = rksm_icon;
                        stakeUrl = 'https://app.stafi.io/rATOM';
                        liquidityUrl =
                          'https://app.uniswap.org/#/add/v2/ETH/0xd01cb3d113a864763dd3977fe1e725860013b0ed';
                      } else if (data.token === 'rATOM') {
                        type = data.token;
                        icon = ratom_icon;
                        stakeUrl = 'https://app.stafi.io/rDOT';
                        liquidityUrl =
                          'https://app.uniswap.org/#/add/v2/ETH/0x505f5a4ff10985fe9f93f2ae3501da5fe665f08a';
                      } else if (data.token === 'rMATIC') {
                        type = data.token;
                        icon = rmatic_icon;
                        stakeUrl = 'https://app.stafi.io/rKSM';
                        liquidityUrl =
                          'https://app.uniswap.org/#/add/v2/ETH/0x3c3842c4d3037ae121d69ea1e7a0b61413be806c';
                      } else if (data.token === 'rFIS') {
                        type = data.token;
                        icon = rfis_icon;
                        stakeUrl = 'https://app.stafi.io/rKSM';
                        liquidityUrl =
                          'https://app.uniswap.org/#/add/v2/ETH/0x3c3842c4d3037ae121d69ea1e7a0b61413be806c';
                      }
                      if (type == '') {
                        return <></>;
                      }
                      return (
                        <MintTableItem
                          key={`child ${data.token}${index}`}
                          tokenType={type}
                          actData={item}
                          wrapFiUrl={'https://drop.wrapfi.io'}
                          liquidityUrl={liquidityUrl}
                          history={props.history}
                          stakeUrl={stakeUrl}
                          pairIcon={index == 0 ? icon : null}
                          pairValue={index == 0 ? type : null}
                          poolOn={item.platform}
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
