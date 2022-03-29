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
          { label: 'rDEX', url: config.rDex.rdotURL },
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
          { label: 'rDEX', url: config.rDex.rethURL },
        ]);
      } else {
        setTradeList([]);
      }
    } else if (tokenType === 'rFIS') {
      if (platform === 'native') {
        setTradeList([
          { label: 'Uniswap', url: config.uniswap.rfisURL },
          { label: 'rDEX', url: config.rDex.rfisURL },
        ]);
      } else if (platform === 'erc20') {
        setTradeList([{ label: 'Uniswap', url: config.uniswap.rfisURL }]);
      } else {
        setTradeList([]);
      }
    } else if (tokenType === 'FIS') {
      if (platform === 'native') {
        setTradeList([
          { label: 'Uniswap', url: config.uniswap.fisURL },
          { label: 'rDEX', url: config.rDex.fisURL },
        ]);
      } else if (platform === 'erc20') {
        setTradeList([{ label: 'Uniswap', url: config.uniswap.fisURL }]);
      } else {
        setTradeList([]);
      }
    } else if (tokenType === 'rKSM') {
      if (platform === 'native') {
        setTradeList([
          { label: 'Uniswap', url: config.uniswap.rksmURL },
          { label: 'rDEX', url: config.rDex.rksmURL },
        ]);
      } else if (platform === 'erc20') {
        setTradeList([{ label: 'Uniswap', url: config.uniswap.rksmURL }]);
      } else {
        setTradeList([]);
      }
    } else if (tokenType === 'rATOM') {
      if (platform === 'native') {
        setTradeList([
          { label: 'Uniswap', url: config.uniswap.ratomURL },
          { label: 'rDEX', url: config.rDex.ratomURL },
        ]);
      } else if (platform === 'erc20') {
        setTradeList([{ label: 'Uniswap', url: config.uniswap.ratomURL }]);
      } else {
        setTradeList([]);
      }
    } else if (tokenType === 'rSOL') {
      setTradeList([{ label: 'rDEX', url: config.rDex.rsolURL }]);
    } else if (tokenType === 'rMATIC') {
      if (platform === 'native') {
        setTradeList([
          { label: 'Quickswap', url: config.quickswap.rmaticURL },
          { label: 'rDEX', url: config.rDex.rmaticURL },
        ]);
      } else if (platform === 'erc20') {
        setTradeList([{ label: 'Quickswap', url: config.quickswap.rmaticURL }]);
      } else {
        setTradeList([]);
      }
    } else if (tokenType === 'rBNB') {
      if (platform === 'native') {
        setTradeList([
          { label: 'Pancake', url: config.pancake.rbnbURL },
          { label: 'rDEX', url: config.rDex.rbnbURL },
        ]);
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
