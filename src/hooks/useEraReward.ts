import { UserDeleteOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import config, { getRsymbolByTokenTitle } from 'src/config';
import { BSC_CHAIN_ID, ETH_CHAIN_ID, SOL_CHAIN_ID, STAFI_CHAIN_ID } from 'src/features/bridgeClice';
import { setLoading } from 'src/features/globalClice';
import { rSymbol } from 'src/keyring/defaults';
import { api } from 'src/util/http';
import numberUtil from 'src/util/numberUtil';
import { useMetaMaskAccount } from './useMetaMaskAccount';
import { useSolAccount } from './useSolAccount';
import { useStafiAccount } from './useStafiAccount';

interface ChartData {
  chartXData: number[];
  chartYData: string[];
}

interface EraRewardModel {
  era: number;
  rate: string;
  stakeValue: string;
  rTokenBalance: string;
  reward: string;
}

const PAGE_COUNT = 20;

export function useEraReward(
  platform: string,
  type: 'rDOT' | 'rETH' | 'rFIS' | 'rKSM' | 'rATOM' | 'rSOL' | 'rMATIC' | 'rBNB',
) {
  const dispatch = useDispatch();
  const [lastEraReward, setLastEraReward] = useState('--');
  const [chartData, setChartData] = useState<ChartData>();
  const [pageIndex, setPageIndex] = useState(1);
  const [chainType, setChainType] = useState(STAFI_CHAIN_ID);
  const [rewardList, setRewardList] = useState<EraRewardModel[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [userAddress, setUserAddress] = useState<string>();
  const { metaMaskAddress } = useMetaMaskAccount();
  const { stafiPubKey } = useStafiAccount();
  const { solAddress } = useSolAccount();

  const fetchData = async () => {
    if (!userAddress || chainType === -1) {
      return;
    }

    try {
      const url = `${config.api2()}/stafi/webapi/rtoken/reward`;
      const res = await api.post(url, {
        userAddress,
        chainType,
        rTokenType: type === 'rETH' ? -1 : getRsymbolByTokenTitle(type),
        pageIndex,
        pageCount: PAGE_COUNT,
      });

      setIsLoadingMore(false);

      if (res.status === '80000' && res.data) {
        const formatYData = res.data.chartYData.map((element: string) => {
          if (platform === 'ERC20' || platform === 'BEP20') {
            return numberUtil.tokenAmountToHuman(element, rSymbol.Eth).toFixed(6);
          } else {
            return numberUtil.tokenAmountToHuman(element, getRsymbolByTokenTitle(type)).toFixed(6);
          }
        });

        setChartData({
          chartXData: res.data.chartXData.reverse(),
          chartYData: formatYData.reverse(),
        });

        if (platform === 'ERC20' || platform === 'BEP20') {
          setLastEraReward(
            numberUtil.handleAmountFloorToFixed(numberUtil.tokenAmountToHuman(res.data.lastEraReward, rSymbol.Eth), 6),
          );
        } else if (platform === 'Native') {
          setLastEraReward(
            numberUtil.handleAmountFloorToFixed(
              numberUtil.tokenAmountToHuman(res.data.lastEraReward, getRsymbolByTokenTitle(type)),
              6,
            ),
          );
        }

        const formatRewardList = res.data.eraRewardList.map((element: EraRewardModel) => {
          const newRate = numberUtil.rTokenRateToHuman(element.rate).toFixed(6);
          let newStakeValue = '--';
          let newRTokenBalance = '--';
          let newReward = '--';
          if (platform === 'ERC20' || platform === 'BEP20') {
            newStakeValue = numberUtil.tokenAmountToHuman(element.stakeValue, rSymbol.Eth).toFixed(6);
            newRTokenBalance = numberUtil.tokenAmountToHuman(element.rTokenBalance, rSymbol.Eth).toFixed(6);
            newReward = numberUtil.tokenAmountToHuman(element.reward, rSymbol.Eth).toFixed(6);
          } else if (platform === 'Native') {
            newStakeValue = numberUtil.tokenAmountToHuman(element.stakeValue, getRsymbolByTokenTitle(type)).toFixed(6);
            newRTokenBalance = numberUtil
              .tokenAmountToHuman(element.rTokenBalance, getRsymbolByTokenTitle(type))
              .toFixed(6);
            newReward = numberUtil.tokenAmountToHuman(element.reward, getRsymbolByTokenTitle(type)).toFixed(6);
          }

          return {
            era: element.era,
            rate: newRate,
            stakeValue: newStakeValue,
            rTokenBalance: newRTokenBalance,
            reward: newReward,
          };
        });
        if (pageIndex > 1) {
          setRewardList([...rewardList, ...formatRewardList]);
        } else {
          setRewardList([...formatRewardList]);
        }
        setHasMore(res.data.eraRewardList.length === PAGE_COUNT);
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (platform === 'Native') {
      setUserAddress(stafiPubKey);
    } else if (platform === 'SPL') {
      setUserAddress(solAddress);
    } else {
      setUserAddress(metaMaskAddress);
    }
  }, [platform, stafiPubKey, metaMaskAddress, solAddress]);

  useEffect(() => {
    setPageIndex(1);
    setChainType(
      platform === 'Native'
        ? STAFI_CHAIN_ID
        : platform === 'ERC20'
        ? ETH_CHAIN_ID
        : platform === 'BEP20'
        ? BSC_CHAIN_ID
        : platform === 'SPL'
        ? SOL_CHAIN_ID
        : -1,
    );
    dispatch(setLoading(true));
  }, [platform, type, userAddress]);

  useEffect(() => {
    fetchData();
  }, [pageIndex, userAddress, chainType]);

  const loadMore = () => {
    if (isLoadingMore) {
      return;
    }
    setIsLoadingMore(true);
    setPageIndex(pageIndex + 1);
  };

  return { lastEraReward, chartData, loadMore, rewardList, hasMore };
}
