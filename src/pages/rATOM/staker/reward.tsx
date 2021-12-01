import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NewReward } from 'src/components/NewReward';
import { getRATOMAssetBalance as getBEP20RATOMAssetBalance } from 'src/features/BSCClice';
import { getRATOMAssetBalance as getERC20RATOMAssetBalance } from 'src/features/ETHClice';
import { query_rBalances_account } from 'src/features/rATOMClice';
import { useMetaMaskAccount } from 'src/hooks/useMetaMaskAccount';
import { usePlatform } from 'src/hooks/usePlatform';
import { useStafiAccount } from 'src/hooks/useStafiAccount';

export default function Index() {
  const dispatch = useDispatch();
  const { platform } = usePlatform('rATOM');
  const { metaMaskNetworkId, metaMaskAddress } = useMetaMaskAccount();
  const { stafiAddress } = useStafiAccount();

  useEffect(() => {
    if (platform === 'Native') {
      dispatch(query_rBalances_account());
    } else if (platform === 'ERC20') {
      dispatch(getERC20RATOMAssetBalance());
    } else if (platform === 'BEP20') {
      dispatch(getBEP20RATOMAssetBalance());
    }
  }, [platform, metaMaskNetworkId, stafiAddress, metaMaskAddress, dispatch]);

  return <NewReward type='rATOM' hours={24} />;
}
