import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NewReward } from 'src/components/NewReward';
import { getRDOTAssetBalance as getBEP20RDOTAssetBalance } from 'src/features/BSCClice';
import { getRDOTAssetBalance as getERC20RDOTAssetBalance } from 'src/features/ETHClice';
import { query_rBalances_account } from 'src/features/rDOTClice';
import { useMetaMaskAccount } from 'src/hooks/useMetaMaskAccount';
import { usePlatform } from 'src/hooks/usePlatform';
import { useStafiAccount } from 'src/hooks/useStafiAccount';

export default function Index() {
  const dispatch = useDispatch();
  const { platform } = usePlatform('rDOT');
  const { metaMaskNetworkId, metaMaskAddress } = useMetaMaskAccount();
  const { stafiAddress } = useStafiAccount();

  useEffect(() => {
    if (platform === 'Native') {
      dispatch(query_rBalances_account());
    } else if (platform === 'ERC20') {
      dispatch(getERC20RDOTAssetBalance());
    } else if (platform === 'BEP20') {
      dispatch(getBEP20RDOTAssetBalance());
    }
  }, [platform, metaMaskNetworkId, stafiAddress, metaMaskAddress, dispatch]);

  return <NewReward type='rDOT' hours={24} />;
}
