import { useEffect, useState } from 'react';
import { getRsymbolByTokenType } from 'src/config';
import CommonClice from 'src/features/commonClice';
import { rSymbol } from 'src/keyring/defaults';

const commonClice = new CommonClice();

export function useSwapRates(selectedToken: any) {
  const [tokenRate, setTokenRate] = useState('--');
  const [liquidityRate, setLiquidityRate] = useState('--');
  const [swapFee, setSwapFee] = useState('--');

  useEffect(() => {
    if (!selectedToken) {
      setTokenRate('--');
      setLiquidityRate('--');
      setSwapFee('--');
      return;
    }
    const type = getRsymbolByTokenType(selectedToken.type);
    commonClice.rTokenRate(type).then((rate) => {
      setTokenRate(rate.toString());
    });
    commonClice.rLiquidityRate(type).then((rate) => {
      setLiquidityRate(rate.toString());
    });
    if (type === rSymbol.Fis) {
      setSwapFee('0');
    } else {
      commonClice.rSwapFee(type).then((fee) => {
        setSwapFee(fee);
      });
    }
  }, [selectedToken]);

  return { tokenRate, liquidityRate, swapFee };
}
