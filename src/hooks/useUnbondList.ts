import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import config, { getRsymbolByTokenTitle, getSymbolByRSymbol } from 'src/config';
import { setLoading } from 'src/features/globalClice';
import { api } from 'src/util/http';
import keyring from 'src/servers/index';
import numberUtil from 'src/util/numberUtil';
import { useStafiAccount } from './useStafiAccount';
import { hexToU8a } from '@polkadot/util';
import localStorageUtil from 'src/util/localStorage';
import moment from 'moment';

interface UnbondModel {
  txHash?: string;
  receiveAddress?: string;
  tokenAmount?: string;
  // seconds
  lockTotalTime?: number;
  // seconds
  lockLeftTime?: number;
  hasReceived?: boolean;
  poolAddress?: string;
  rTokenType?: string;
  rTokenUnbondAmount?: string;

  formatTokenAmount?: string;
  formatReceiveAddress?: string;
  lockTotalTimeInDays?: number;
  lockLeftTimeInDays?: number;
}

const PAGE_COUNT = 10;

export function useUnbondList(type: 'rDOT' | 'rETH' | 'rFIS' | 'rKSM' | 'rATOM' | 'rSOL' | 'rMATIC' | 'rBNB') {
  const dispatch = useDispatch();
  const [pageIndex, setPageIndex] = useState(1);
  const [unbondList, setUnbondList] = useState<UnbondModel[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { stafiPubKey } = useStafiAccount();

  const fetchData = async () => {
    if (!stafiPubKey) {
      return;
    }

    try {
      const url = `${config.api2()}/stafi/webapi/rtoken/unbond`;
      const res = await api.post(url, {
        userAddress: stafiPubKey,
        rTokenType: type === 'rETH' ? -1 : getRsymbolByTokenTitle(type),
        pageIndex,
        pageCount: PAGE_COUNT,
      });

      setIsLoadingMore(false);

      const keyringInstance = keyring.initByRSymbol(getRsymbolByTokenTitle(type));

      if (res.status === '80000' && res.data) {
        const formatUnbondList = res.data.unbondList.map((element: UnbondModel) => {
          const formatTokenAmount = numberUtil.tokenAmountToHuman(element.tokenAmount, getRsymbolByTokenTitle(type));
          const lockTotalTimeInDays = numberUtil.handleAmountFloorToFixed(element.lockTotalTime / (60 * 60 * 24), 0);
          const lockLeftTimeInDays = numberUtil.handleAmountFloorToFixed(element.lockLeftTime / (60 * 60 * 24), 0);

          let formatReceiveAddress = '';
          if (type === 'rMATIC' || type === 'rBNB') {
            formatReceiveAddress = element.receiveAddress;
          } else if (type === 'rSOL') {
            formatReceiveAddress = keyringInstance.encodeAddress(element.receiveAddress);
          } else {
            formatReceiveAddress = keyringInstance.encodeAddress(hexToU8a(element.receiveAddress));
          }

          return {
            ...element,
            formatReceiveAddress,
            formatTokenAmount,
            lockTotalTimeInDays,
            lockLeftTimeInDays,
          };
        });

        const localItems = localStorageUtil.getRTokenUnbondRecords(type);
        const insertItems: UnbondModel[] = [];
        localItems.forEach((element) => {
          if (moment().valueOf() - element.timestamp < 1000 * 2 * 60) {
            const match = formatUnbondList.find((item) => {
              return item.txHash === element.txHash;
            });
            if (!match) {
              insertItems.push({
                lockTotalTimeInDays: config.unboundAroundDays(getSymbolByRSymbol(getRsymbolByTokenTitle(type))),
                lockLeftTimeInDays: config.unboundAroundDays(getSymbolByRSymbol(getRsymbolByTokenTitle(type))),
                formatReceiveAddress: element.recipient,
                formatTokenAmount: element.amount,
              });
            }
          }
        });

        setUnbondList([...insertItems, ...formatUnbondList].slice(0, 10));
        setIsLoading(false);
        // if (pageIndex > 1) {
        //   setUnbondList([...unbondList, ...formatUnbondList]);
        // } else {
        //   setUnbondList([...formatUnbondList]);
        // }
        setHasMore(res.data.unbondList.length === PAGE_COUNT);
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    setPageIndex(1);
    dispatch(setLoading(true));
  }, [type, stafiPubKey]);

  useEffect(() => {
    fetchData();
  }, [pageIndex, stafiPubKey]);

  const loadMore = () => {
    if (isLoadingMore) {
      return;
    }
    setIsLoadingMore(true);
    setPageIndex(pageIndex + 1);
  };

  return { loadMore, unbondList, hasMore, isLoading };
}
