import { useEffect, useState } from 'react';
import config from 'src/config';

type TradeItem = {
  label: string;
  url: string;
};

export function useTradeList(
  platform: 'native' | 'erc20' | 'bep20' | 'spl',
  tokenType: 'rDOT' | 'rETH' | 'rFIS' | 'FIS' | 'rKSM' | 'rATOM' | 'rSOL' | 'rMATIC' | 'rBNB',
): TradeItem[] {
  const [tradeList, setTradeList] = useState<TradeItem[]>([]);

  useEffect(() => {
    if (tokenType === 'rDOT') {
      if (platform === 'native') {
        setTradeList([
          { label: 'Uniswap', url: config.uniswap.rdotURL },
          { label: 'Pancake', url: config.pancake.rdotURL },
        ]);
      } else if (platform === 'erc20') {
        setTradeList([{ label: 'Uniswap', url: config.uniswap.rdotURL }]);
      } else if (platform === 'bep20') {
        setTradeList([{ label: 'Pancake', url: config.pancake.rdotURL }]);
      } else {
        setTradeList([]);
      }
    } else if (tokenType === 'rETH') {
      if (platform === 'erc20') {
        setTradeList([
          { label: 'Curve', url: config.curve.rethURL },
          { label: 'Uniswap', url: config.uniswap.rethURL },
        ]);
      } else {
        setTradeList([]);
      }
    } else if (tokenType === 'rFIS') {
      if (platform === 'native') {
        setTradeList([{ label: 'Uniswap', url: config.uniswap.rfisURL }]);
      } else if (platform === 'erc20') {
        setTradeList([{ label: 'Uniswap', url: config.uniswap.rfisURL }]);
      } else {
        setTradeList([]);
      }
    } else if (tokenType === 'FIS') {
      if (platform === 'native') {
        setTradeList([{ label: 'Uniswap', url: config.uniswap.fisURL }]);
      } else if (platform === 'erc20') {
        setTradeList([{ label: 'Uniswap', url: config.uniswap.fisURL }]);
      } else {
        setTradeList([]);
      }
    } else if (tokenType === 'rKSM') {
      if (platform === 'native') {
        setTradeList([{ label: 'Uniswap', url: config.uniswap.rksmURL }]);
      } else if (platform === 'erc20') {
        setTradeList([{ label: 'Uniswap', url: config.uniswap.rksmURL }]);
      } else {
        setTradeList([]);
      }
    } else if (tokenType === 'rATOM') {
      if (platform === 'native') {
        setTradeList([{ label: 'Uniswap', url: config.uniswap.ratomURL }]);
      } else if (platform === 'erc20') {
        setTradeList([{ label: 'Uniswap', url: config.uniswap.ratomURL }]);
      } else {
        setTradeList([]);
      }
    } else if (tokenType === 'rSOL') {
      setTradeList([]);
    } else if (tokenType === 'rMATIC') {
      if (platform === 'native') {
        setTradeList([{ label: 'Quickswap', url: config.quickswap.rmaticURL }]);
      } else if (platform === 'erc20') {
        setTradeList([{ label: 'Quickswap', url: config.quickswap.rmaticURL }]);
      } else {
        setTradeList([]);
      }
    } else if (tokenType === 'rBNB') {
      if (platform === 'native') {
        setTradeList([{ label: 'Pancake', url: config.pancake.rbnbURL }]);
      } else if (platform === 'bep20') {
        setTradeList([{ label: 'Pancake', url: config.pancake.rbnbURL }]);
      } else {
        setTradeList([]);
      }
    } else {
      setTradeList([]);
    }
  }, [platform, tokenType]);

  return tradeList;
}
