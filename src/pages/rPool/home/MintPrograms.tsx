import { Spin } from 'antd';
import { cloneDeep } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import no_data_png from 'src/assets/images/nodata.png';
import rsol_icon from 'src/assets/images/rSOL.svg';
import ratom_icon from 'src/assets/images/r_atom.svg';
import rbnb_icon from 'src/assets/images/r_bnb.svg';
import rdot_icon from 'src/assets/images/r_dot.svg';
import reth_icon from 'src/assets/images/r_eth.svg';
import rfis_icon from 'src/assets/images/r_fis.svg';
import rksm_icon from 'src/assets/images/r_ksm.svg';
import rmatic_icon from 'src/assets/images/r_matic.svg';
import Card from 'src/components/card/index';
import { Text } from 'src/components/commonComponents';
import { getRsymbolByTokenTitle } from 'src/config/index';
import { getRtokenPriceList } from 'src/features/bridgeClice';
import { getMintPrograms } from 'src/features/mintProgramsClice';
import { RootState } from 'src/store';
import numberUtil from 'src/util/numberUtil';
import { useInterval } from 'src/util/utils';
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
  {
    token: 'rBNB',
    children: [],
  },
  {
    token: 'rSOL',
    children: [],
  },
];

export default function MintPrograms(props: any) {
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState<'In Progress' | 'Completed'>('In Progress');

  useEffect(() => {
    dispatch(getMintPrograms(true));
  }, []);

  useInterval(() => {
    dispatch(getMintPrograms());
  }, 60000);

  const [sortField, setSortField] = useState('apy');
  const [sortWay, setSortWay] = useState<undefined | string>('asc');
  const [mintDataList, setMintDataList] = useState([]);

  const {
    unitPriceList,
    rDOTActs,
    rMaticActs,
    rFISActs,
    rKSMActs,
    rATOMActs,
    rETHActs,
    rBNBActs,
    rSOLActs,
    loading,
    loadComplete,
  } = useSelector((state: RootState) => {
    return {
      unitPriceList: state.bridgeModule.priceList,
      rDOTActs: state.mintProgramsModule.rDOTActs,
      rMaticActs: state.mintProgramsModule.rMATICActs,
      rFISActs: state.mintProgramsModule.rFISActs,
      rKSMActs: state.mintProgramsModule.rKSMActs,
      rATOMActs: state.mintProgramsModule.rATOMActs,
      rBNBActs: state.mintProgramsModule.rBNBActs,
      rSOLActs: state.mintProgramsModule.rSOLActs,
      rETHActs: state.mintProgramsModule.rETHActs,
      loadComplete: state.mintProgramsModule.loadComplete,
      loading: state.globalModule.loading,
    };
  });

  const { inProgressList, completedList } = useMemo(() => {
    const inProgress = [];
    const completed = [];
    mintDataList.forEach((data) => {
      const name = data.name;
      const token = data.token;
      const extraName = data.extraName;
      const inProgressChildren = data.children?.filter((item) => {
        return item.nowBlock < item.end;
      });
      const completedChildren = data.children?.filter((item) => {
        return item.nowBlock >= item.end;
      });

      inProgress.push({
        token,
        name,
        extraName,
        children: cloneDeep(inProgressChildren),
      });

      completed.push({
        token,
        name,
        extraName,
        children: cloneDeep(completedChildren),
      });
    });
    return {
      inProgressList: inProgress,
      completedList: completed,
    };
  }, [mintDataList]);

  const displayList = useMemo(() => {
    if (selectedTab === 'In Progress') {
      return inProgressList;
    }
    return completedList;
  }, [selectedTab, inProgressList, completedList]);

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
          total += numberUtil.mul(unitPrice.price, formatTotalRTokenAmount);
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
    displayList?.forEach((item) => {
      itemCount += item.children && item.children.length;
    });
    return loadComplete && itemCount === 0;
  }, [loadComplete, displayList]);

  useEffect(() => {
    dispatch(getRtokenPriceList());
  }, [dispatch]);

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
      if (item.token === 'rBNB') {
        item.children = cloneDeep(rBNBActs);
      }
      if (item.token === 'rETH') {
        item.children = cloneDeep(rETHActs);
      }
      if (item.token === 'rSOL') {
        item.children = cloneDeep(rSOLActs);
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
          item.mintedValue = numberUtil.mul(unitPrice.price, formatTotalRTokenAmount);
        }
      });
    });
    setMintDataList(list);
  }, [unitPriceList, rDOTActs, rMaticActs, rFISActs, rKSMActs, rATOMActs, rBNBActs, rETHActs, rSOLActs]);

  useInterval(() => {
    setMintDataList([...mintDataList]);
  }, 1000);

  return (
    <Card className='stafi_rpool_mint'>
      <div className='card_list'>
        <CardItem label='Total minted value' value={`$${totalMintedValue}`} />
        <CardItem label='Total reward FIS' value={`${totalFisAmount}`} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px', marginBottom: '30px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '17px',
            height: '34px',
            width: '100px',
            backgroundColor: '#293038',
            marginRight: '20px',
            cursor: 'pointer',
          }}
          onClick={() => setSelectedTab('In Progress')}>
          <Text bold sameLineHeight clickable size='12px' color={selectedTab === 'In Progress' ? '#00F3AB' : '#7c7c7c'}>
            In Progress
          </Text>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '17px',
            height: '34px',
            width: '100px',
            backgroundColor: '#293038',
            cursor: 'pointer',
          }}
          onClick={() => setSelectedTab('Completed')}>
          <Text bold sameLineHeight clickable size='12px' color={selectedTab === 'Completed' ? '#00F3AB' : '#7c7c7c'}>
            Completed
          </Text>
        </div>
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
              displayList.map((data: any, i: any) => {
                return (
                  <div
                    key={`${data.token}${i}`}
                    className='rtoken_type'
                    style={{ marginBottom: data.children.length > 0 ? '30px' : 0 }}>
                    {data.children.map((item: any, index: number) => {
                      let type = '';
                      let icon = null;
                      let stakeUrl = '';
                      if (data.token === 'rETH') {
                        type = data.token;
                        icon = reth_icon;
                        stakeUrl = 'https://app.stafi.io/rETH';
                      } else if (data.token === 'rDOT') {
                        type = data.token;
                        icon = rdot_icon;
                        stakeUrl = 'https://app.stafi.io/rFIS';
                      } else if (data.token === 'rKSM') {
                        type = data.token;
                        icon = rksm_icon;
                        stakeUrl = 'https://app.stafi.io/rATOM';
                      } else if (data.token === 'rATOM') {
                        type = data.token;
                        icon = ratom_icon;
                        stakeUrl = 'https://app.stafi.io/rDOT';
                      } else if (data.token === 'rMATIC') {
                        type = data.token;
                        icon = rmatic_icon;
                        stakeUrl = 'https://app.stafi.io/rKSM';
                      } else if (data.token === 'rFIS') {
                        type = data.token;
                        icon = rfis_icon;
                        stakeUrl = 'https://app.stafi.io/rFIS';
                      } else if (data.token === 'rBNB') {
                        type = data.token;
                        icon = rbnb_icon;
                        stakeUrl = 'https://app.stafi.io/rBNB';
                      } else if (data.token === 'rSOL') {
                        type = data.token;
                        icon = rsol_icon;
                        stakeUrl = 'https://app.stafi.io/rSOL';
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
