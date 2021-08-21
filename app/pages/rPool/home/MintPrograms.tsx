import Card from '@components/card/index';
import { getRsymbolByTokenTitle } from '@config/index';
import { getRtokenPriceList } from '@features/bridgeClice';
import { getMintPrograms } from '@features/mintProgramsClice';
import ratom_icon from '@images/r_atom.svg';
import rdot_icon from '@images/r_dot.svg';
import reth_icon from '@images/r_eth.svg';
import rfis_icon from '@images/r_fis.svg';
import rksm_icon from '@images/r_ksm.svg';
import rmatic_icon from '@images/r_matic.svg';
import numberUtil from '@util/numberUtil';
import { RootState } from 'app/store';
import { divide, multiply } from 'mathjs';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CardItem from './components/cardItem';
import MintTableHead from './components/MintTableHead';
import MintTableItem from './components/MintTableItem';
import './MintPrograms.scss';

const rTokenList: any = [
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
    dispatch(getMintPrograms());
  }, []);

  const [sortField, setSortField] = useState('apy');
  const [sortWay, setSortWay] = useState<undefined | string>('asc');
  const [mintDataList, setMintDataList] = useState([]);

  const { unitPriceList, rDOTActs, rMaticActs, rFISActs, rKSMActs, rATOMActs, rETHActs } = useSelector(
    (state: RootState) => {
      return {
        unitPriceList: state.bridgeModule.priceList,
        rDOTActs: state.mintProgramsModule.rDOTActs,
        rMaticActs: state.mintProgramsModule.rMATICActs,
        rFISActs: state.mintProgramsModule.rFISActs,
        rKSMActs: state.mintProgramsModule.rKSMActs,
        rATOMActs: state.mintProgramsModule.rATOMActs,
        rETHActs: state.mintProgramsModule.rETHActs,
      };
    },
  );

  const { totalMintedValue, totalFisAmount } = useMemo(() => {
    let total = 0;
    let fisAmount = 0;
    const response = { totalMintedValue: '--', totalFisAmount: '--' };
    const map: any = {
      rDOT: rDOTActs,
      rMATIC: rMaticActs,
      rFIS: rFISActs,
      rKSM: rKSMActs,
      rATOM: rATOMActs,
      rETH: rETHActs,
    };

    for (var tokenTitle in map) {
      let unitPrice = unitPriceList?.find((item: any) => {
        return item.symbol === tokenTitle;
      });
      if (!unitPrice || !map[tokenTitle] || map[tokenTitle].length === 0) {
        continue;
      }
      map[tokenTitle].forEach((item: any) => {
        const formatTotalReward = numberUtil.fisAmountToHuman(item.total_reward);
        const formatRewardRate = numberUtil.tokenMintRewardRateToHuman(
          item.reward_rate,
          getRsymbolByTokenTitle(tokenTitle),
        );
        total += multiply(unitPrice.price, divide(formatTotalReward, formatRewardRate));
        fisAmount += formatTotalReward;
      });
    }

    if (unitPriceList) {
      response.totalMintedValue = numberUtil.amount_format(total);
    }
    response.totalFisAmount = numberUtil.amount_format(fisAmount);

    return response;
  }, [unitPriceList, rDOTActs, rMaticActs, rFISActs, rKSMActs, rATOMActs, rETHActs]);

  useEffect(() => {
    dispatch(getRtokenPriceList());
  }, []);

  useEffect(() => {
    rTokenList.forEach((item: any) => {
      if (item.token === 'rDOT') {
        item.children = rDOTActs;
      }
      if (item.token === 'rMATIC') {
        item.children = rMaticActs;
      }
      if (item.token === 'rFIS') {
        item.children = rFISActs;
      }
      if (item.token === 'rKSM') {
        item.children = rKSMActs;
      }
      if (item.token === 'rATOM') {
        item.children = rATOMActs;
      }
      if (item.token === 'rETH') {
        item.children = rETHActs;
      }
    });

    let list = [...rTokenList];
    if (sortField && sortWay) {
      list = list.sort((a: any, b: any) => {
        if (sortField == 'apy') {
          let apy_a: number = 0;
          let apy_b: number = 0;
          // a[sortField]
          a.children.forEach((item: any) => {
            apy_a = apy_a + Number(item.reward_rate ? item.reward_rate : 0);
          });
          b.children.forEach((item: any) => {
            apy_b = apy_b + Number(item.reward_rate ? item.reward_rate : 0);
          });
          if (apy_a > apy_b) {
            return sortWay == 'asc' ? -1 : 1;
          } else if (apy_a < apy_b) {
            return sortWay == 'asc' ? 1 : -1;
          } else {
            return 0;
          }
        } else {
          return 0;
        }
      });
    }

    setMintDataList(list);
  }, [rDOTActs, rMaticActs, rFISActs, rKSMActs, rATOMActs, rETHActs]);

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

        <div className='table_body'>
          {mintDataList.map((data: any, i: any) => {
            return (
              <div key={`${data.token}${i}`} className='rtoken_type'>
                {data.children.map((item: any, index: number) => {
                  let type = '';
                  let icon = null;
                  let stakeUrl = '';
                  let liquidityUrl = '';
                  if (data.token === 'rETH') {
                    type = data.token;
                    icon = reth_icon;
                    stakeUrl = 'https://app.stafi.io/rETH';
                    liquidityUrl = 'https://app.uniswap.org/#/add/v2/0x9559aaa82d9649c7a7b220e7c461d2e74c9a3593/ETH';
                  } else if (data.token === 'rDOT') {
                    type = data.token;
                    icon = rdot_icon;
                    stakeUrl = 'https://app.stafi.io/rFIS';
                    liquidityUrl = 'https://app.uniswap.org/#/add/v2/ETH/0xc82eb6dea0c93edb8b697b89ad1b13d19469d635';
                  } else if (data.token === 'rKSM') {
                    type = data.token;
                    icon = rksm_icon;
                    stakeUrl = 'https://app.stafi.io/rATOM';
                    liquidityUrl = 'https://app.uniswap.org/#/add/v2/ETH/0xd01cb3d113a864763dd3977fe1e725860013b0ed';
                  } else if (data.token === 'rATOM') {
                    type = data.token;
                    icon = ratom_icon;
                    stakeUrl = 'https://app.stafi.io/rDOT';
                    liquidityUrl = 'https://app.uniswap.org/#/add/v2/ETH/0x505f5a4ff10985fe9f93f2ae3501da5fe665f08a';
                  } else if (data.token === 'rMATIC') {
                    type = data.token;
                    icon = rmatic_icon;
                    stakeUrl = 'https://app.stafi.io/rKSM';
                    liquidityUrl = 'https://app.uniswap.org/#/add/v2/ETH/0x3c3842c4d3037ae121d69ea1e7a0b61413be806c';
                  } else if (data.token === 'rFIS') {
                    type = data.token;
                    icon = rfis_icon;
                    stakeUrl = 'https://app.stafi.io/rKSM';
                    liquidityUrl = 'https://app.uniswap.org/#/add/v2/ETH/0x3c3842c4d3037ae121d69ea1e7a0b61413be806c';
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
      </div>
    </Card>
  );
}
