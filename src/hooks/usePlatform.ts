import { useHistory } from 'react-router';
import qs from 'querystring';
import { useEffect, useMemo, useState } from 'react';
import { requestSwitchMetaMaskNetwork } from 'src/util/metaMaskUtil';

export function usePlatform(type: 'rDOT' | 'rETH' | 'rFIS' | 'rKSM' | 'rATOM' | 'rSOL' | 'rMATIC' | 'rBNB') {
  const history = useHistory();
  // const [platform, setPlatform] = useState(type === 'rETH' ? 'ERC20' : 'Native');
  const [platform, setPlatform] = useState('Native');

  const platformArr = useMemo(() => {
    const res = [];
    // const showNative = type !== 'rETH';
    const showNative = true;
    const showErc20 =
      type === 'rETH' || type === 'rFIS' || type === 'rKSM' || type === 'rDOT' || type === 'rATOM' || type === 'rMATIC';
    const showBep20 =
      type === 'rETH' ||
      type === 'rFIS' ||
      type === 'rKSM' ||
      type === 'rDOT' ||
      type === 'rATOM' ||
      type === 'rMATIC' ||
      type === 'rBNB';
    const showSpl = type === 'rSOL';

    if (showNative) {
      res.push('Native');
    }
    if (showErc20) {
      res.push('ERC20');
    }
    if (showBep20) {
      res.push('BEP20');
    }
    if (showSpl) {
      res.push('SPL');
    }
    return res;
  }, [type]);

  useEffect(() => {
    if (
      !history.location.search ||
      history.location.search.length < 1 ||
      !qs.parse(history.location.search.slice(1)).platform
    ) {
      history.replace(`${history.location.pathname}?platform=${'Native'}`);
    } else {
      setPlatform(qs.parse(history.location.search.slice(1)).platform as string);
    }
  }, [history, history.location.search, type]);

  useEffect(() => {
    if (platformArr.indexOf(platform) < 0) {
      history.replace(`${history.location.pathname}?platform=${'Native'}`);
    }
  }, [platformArr, platform, history, type]);

  return { platform, platformArr };
}
