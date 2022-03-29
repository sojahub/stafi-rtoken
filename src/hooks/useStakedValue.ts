import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import numberUtil from 'src/util/numberUtil';
import rpc from 'src/util/rpc';

export function useStakedValue(
  platform: string,
  type: 'rDOT' | 'rETH' | 'rFIS' | 'rKSM' | 'rATOM' | 'rSOL' | 'rMATIC' | 'rBNB',
) {
  const [tokenPrice, setTokenPrice] = useState('--');
  const [stakedValue, setStakedValue] = useState('--');

  const rTokenAmount = useSelector((state: any) => {
    if (type === 'rETH') {
      if (platform === 'Native') {
        return state.rETHModule.nativeTokenAmount;
      } else if (platform === 'ERC20') {
        return state.ETHModule.ercETHBalance;
      } else if (platform === 'BEP20') {
        return state.BSCModule.bepRETHBalance;
      }
    } else if (type === 'rBNB') {
      if (platform === 'Native') {
        return state.rBNBModule.tokenAmount;
      } else if (platform === 'BEP20') {
        return state.BSCModule.bepRBNBBalance;
      }
    } else if (type === 'rFIS') {
      if (platform === 'Native') {
        return state.FISModule.tokenAmount * state.FISModule.ratio;
      } else if (platform === 'ERC20') {
        return state.ETHModule.ercRFISBalance * state.FISModule.ratio;
      } else if (platform === 'BEP20') {
        return state.BSCModule.bepRFISBalance * state.FISModule.ratio;
      }
    } else if (type === 'rDOT') {
      if (platform === 'Native') {
        return state.rDOTModule.tokenAmount * state.rDOTModule.ratio;
      } else if (platform === 'ERC20') {
        return state.ETHModule.ercRDOTBalance * state.rDOTModule.ratio;
      } else if (platform === 'BEP20') {
        return state.BSCModule.bepRDOTBalance * state.rDOTModule.ratio;
      }
    } else if (type === 'rKSM') {
      if (platform === 'Native') {
        return state.rKSMModule.tokenAmount * state.rKSMModule.ratio;
      } else if (platform === 'ERC20') {
        return state.ETHModule.ercRKSMBalance * state.rKSMModule.ratio;
      } else if (platform === 'BEP20') {
        return state.BSCModule.bepRKSMBalance * state.rKSMModule.ratio;
      }
    } else if (type === 'rATOM') {
      if (platform === 'Native') {
        return state.rATOMModule.tokenAmount * state.rATOMModule.ratio;
      } else if (platform === 'ERC20') {
        return state.ETHModule.ercRATOMBalance * state.rATOMModule.ratio;
      } else if (platform === 'BEP20') {
        return state.BSCModule.bepRATOMBalance * state.rATOMModule.ratio;
      }
    } else if (type === 'rSOL') {
      if (platform === 'Native') {
        return state.rSOLModule.tokenAmount * state.rSOLModule.ratio;
      } else if (platform === 'SPL') {
        return state.SOLModule.rSOLBalance * state.rSOLModule.ratio;
      }
    } else if (type === 'rMATIC') {
      if (platform === 'Native') {
        return state.rMATICModule.tokenAmount * state.rATOMModule.ratio;
      } else if (platform === 'ERC20') {
        return state.ETHModule.ercRMaticBalance * state.rATOMModule.ratio;
      } else if (platform === 'BEP20') {
        return state.BSCModule.bepRMATICBalance * state.rATOMModule.ratio;
      }
    }

    return '--';
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
    setStakedValue(
      numberUtil.amount_format(numberUtil.handleFisAmountToFixed(Number(rTokenAmount) * Number(tokenPrice)), 2),
    );
  }, [tokenPrice, rTokenAmount]);

  return { stakedValue };
}
