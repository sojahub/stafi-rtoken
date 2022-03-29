import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NewReward } from 'src/components/NewReward';
import { usePlatform } from 'src/hooks/usePlatform';
import { getRETHAssetBalance as getBEP20RETHAssetBalance } from 'src/features/BSCClice';
import { getETHAssetBalance } from 'src/features/ETHClice';
import { useMetaMaskAccount } from 'src/hooks/useMetaMaskAccount';
import { getNativeRethAmount } from 'src/features/rETHClice';

export default function Index() {
  const dispatch = useDispatch();
  const { platform } = usePlatform('rETH');
  const { metaMaskNetworkId, metaMaskAddress } = useMetaMaskAccount();

  useEffect(() => {
    if (platform === 'Native') {
      setTimeout(() => {
        dispatch(getNativeRethAmount());
      }, 500);
    } else if (platform === 'ERC20') {
      setTimeout(() => {
        dispatch(getETHAssetBalance());
      }, 500);
    } else if (platform === 'BEP20') {
      setTimeout(() => {
        dispatch(getBEP20RETHAssetBalance());
      }, 500);
    }
  }, [platform, metaMaskNetworkId, metaMaskAddress, dispatch]);

  return <NewReward type='rETH' hours={8} />;
}
