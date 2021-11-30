import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import numberUtil from 'src/util/numberUtil';
import rpc from 'src/util/rpc';

export function useStakedValue(type: 'rDOT' | 'rETH' | 'rFIS' | 'rKSM' | 'rATOM' | 'rSOL' | 'rMATIC' | 'rBNB') {
  const [tokenPrice, setTokenPrice] = useState('--');
  const [stakedValue, setStakedValue] = useState('--');

  const rTokenAmount = useSelector((state: any) => {
    console.log('sdfsdf', state.rBNBModule.totalIssuance, state.rBNBModule.ratio);
    if (type === 'rETH') {
      return state.rETHModule.totalStakedAmount;
    } else if (type === 'rBNB') {
      return numberUtil.handleFisAmountToFixed(state.rBNBModule.totalIssuance * state.rBNBModule.ratio);
    } else if (type === 'rFIS') {
      return numberUtil.handleFisAmountToFixed(state.FISModule.totalIssuance * state.FISModule.ratio);
    } else if (type === 'rDOT') {
      return numberUtil.handleFisAmountToFixed(state.rDOTModule.totalIssuance * state.rDOTModule.ratio);
    } else if (type === 'rKSM') {
      return numberUtil.handleFisAmountToFixed(state.rKSMModule.totalIssuance * state.rKSMModule.ratio);
    } else if (type === 'rATOM') {
      return numberUtil.handleFisAmountToFixed(state.rATOMModule.totalIssuance * state.rATOMModule.ratio);
    } else if (type === 'rSOL') {
      return numberUtil.handleFisAmountToFixed(state.rSOLModule.totalIssuance * state.rSOLModule.ratio);
    } else if (type === 'rMATIC') {
      return numberUtil.handleFisAmountToFixed(state.rMATICModule.totalIssuance * state.rMATICModule.ratio);
    }
  });

  useEffect(() => {
    rpc.fetchRtokenPriceList().then((res) => {
      if (res.status === '80000') {
        const tokenItem = res.data.find((item) => {
          return item.symbol === type;
        });
        setTokenPrice(tokenItem ? tokenItem.price : '--');
      }
    });
  }, [type]);

  useEffect(() => {
    if (isNaN(Number(tokenPrice)) || isNaN(Number(rTokenAmount))) {
      setStakedValue('--');
      return;
    }
    setStakedValue(numberUtil.amount_format(Number(rTokenAmount) * Number(tokenPrice), 2));
  }, [tokenPrice, rTokenAmount]);

  return { stakedValue };
}
