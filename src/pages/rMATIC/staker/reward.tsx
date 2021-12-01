import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NewReward } from 'src/components/NewReward';
import { getRMATICAssetBalance as getBEP20RMATICAssetBalance } from 'src/features/BSCClice';
import { getRMaticAssetBalance as getERC20RMATICAssetBalance } from 'src/features/ETHClice';
import { query_rBalances_account } from 'src/features/rMATICClice';
import { useMetaMaskAccount } from 'src/hooks/useMetaMaskAccount';
import { usePlatform } from 'src/hooks/usePlatform';
import { useStafiAccount } from 'src/hooks/useStafiAccount';

export default function Index() {
  const dispatch = useDispatch();
  const { platform } = usePlatform('rMATIC');
  const { metaMaskNetworkId, metaMaskAddress } = useMetaMaskAccount();
  const { stafiAddress } = useStafiAccount();

  useEffect(() => {
    if (platform === 'Native') {
      dispatch(query_rBalances_account());
    } else if (platform === 'ERC20') {
      dispatch(getERC20RMATICAssetBalance());
    } else if (platform === 'BEP20') {
      dispatch(getBEP20RMATICAssetBalance());
    }
  }, [platform, metaMaskNetworkId, stafiAddress, metaMaskAddress, dispatch]);

  return <NewReward type='rMATIC' hours={24} />;
}
