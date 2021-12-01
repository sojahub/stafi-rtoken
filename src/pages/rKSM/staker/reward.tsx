import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NewReward } from 'src/components/NewReward';
import { getRKSMAssetBalance as getBEP20RKSMAssetBalance } from 'src/features/BSCClice';
import { getRKSMAssetBalance as getERC20RKSMAssetBalance } from 'src/features/ETHClice';
import { query_rBalances_account } from 'src/features/rKSMClice';
import { useMetaMaskAccount } from 'src/hooks/useMetaMaskAccount';
import { usePlatform } from 'src/hooks/usePlatform';
import { useStafiAccount } from 'src/hooks/useStafiAccount';

export default function Index() {
  const dispatch = useDispatch();
  const { platform } = usePlatform('rKSM');
  const { metaMaskNetworkId, metaMaskAddress } = useMetaMaskAccount();
  const { stafiAddress } = useStafiAccount();

  useEffect(() => {
    if (platform === 'Native') {
      dispatch(query_rBalances_account());
    } else if (platform === 'ERC20') {
      dispatch(getERC20RKSMAssetBalance());
    } else if (platform === 'BEP20') {
      dispatch(getBEP20RKSMAssetBalance());
    }
  }, [platform, metaMaskNetworkId, stafiAddress, metaMaskAddress, dispatch]);
  return <NewReward type='rKSM' hours={6} />;
}
