import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
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

const PAGE_COUNT = 50;

export function useEraReward(
  platform: string,
  type: 'rDOT' | 'rETH' | 'rFIS' | 'rKSM' | 'rATOM' | 'rSOL' | 'rMATIC' | 'rBNB',
) {
  const dispatch = useDispatch();
  const [lastEraReward, setLastEraReward] = useState('--');
  const [chartData, setChartData] = useState<ChartData>();
  const [pageIndex, setPageIndex] = useState(1);
  const [chainType, setChainType] = useState(STAFI_CHAIN_ID);
  const [rewardList, setRewardList] = useState<EraRewardModel[]>();
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
            return numberUtil.handleAmountRoundToFixed(numberUtil.tokenAmountToHuman(element, rSymbol.Eth), 6);
          } else {
            return numberUtil.handleAmountRoundToFixed(
              numberUtil.tokenAmountToHuman(element, getRsymbolByTokenTitle(type)),
              6,
            );
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
          let newReward: number | string = '--';
          if (platform === 'ERC20' || platform === 'BEP20') {
            newStakeValue = numberUtil.handleAmountRoundToFixed(
              numberUtil.tokenAmountToHuman(element.stakeValue, rSymbol.Eth),
              6,
            );
            newRTokenBalance = numberUtil.handleAmountRoundToFixed(
              numberUtil.tokenAmountToHuman(element.rTokenBalance, rSymbol.Eth),
              6,
            );
            if (!isEmpty(element.reward)) {
              newReward = numberUtil.tokenAmountToHuman(element.reward, rSymbol.Eth);
            }
          } else if (platform === 'Native') {
            newStakeValue = numberUtil.handleAmountRoundToFixed(
              numberUtil.tokenAmountToHuman(element.stakeValue, getRsymbolByTokenTitle(type)),
              6,
            );
            newRTokenBalance = numberUtil.handleAmountRoundToFixed(
              numberUtil.tokenAmountToHuman(element.rTokenBalance, getRsymbolByTokenTitle(type)),
              6,
            );
            if (!isEmpty(element.reward)) {
              newReward = numberUtil.tokenAmountToHuman(element.reward, getRsymbolByTokenTitle(type));
            }
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
    if (userAddress) {
      dispatch(setLoading(true));
    }
  }, [dispatch, platform, type, userAddress]);

  useEffect(() => {
    fetchData();
  }, [pageIndex, userAddress, chainType]);

  const loadMore = () => {
    if (isLoadingMore) {
      return;
    }
    dispatch(setLoading(true));
    setIsLoadingMore(true);
    setPageIndex(pageIndex + 1);
  };

  return { lastEraReward, chartData, loadMore, rewardList, hasMore };
}

export function useLastEraReward(
  platform: string,
  type: 'rDOT' | 'rETH' | 'rFIS' | 'rKSM' | 'rATOM' | 'rSOL' | 'rMATIC' | 'rBNB',
) {
  const [lastEraReward, setLastEraReward] = useState('--');
  const [chainType, setChainType] = useState(STAFI_CHAIN_ID);
  const [userAddress, setUserAddress] = useState<string>();
  const { metaMaskAddress } = useMetaMaskAccount();
  const { stafiPubKey } = useStafiAccount();
  const { solAddress } = useSolAccount();

  const fetchData = async () => {
    if (!userAddress || chainType === -1) {
      return;
    }

    try {
      const url = `${config.api2()}/stafi/webapi/rtoken/lastEraReward`;
      const res = await api.post(url, {
        userAddress,
        chainType,
        rTokenType: type === 'rETH' ? -1 : getRsymbolByTokenTitle(type),
      });

      if (res.status === '80000' && res.data) {
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
      }
    } finally {
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
  }, [platform, type, userAddress]);

  useEffect(() => {
    fetchData();
  }, [userAddress, chainType]);

  return { lastEraReward };
}
