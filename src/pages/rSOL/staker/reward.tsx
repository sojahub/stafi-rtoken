import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NewReward } from 'src/components/NewReward';
import { query_rBalances_account } from 'src/features/rSOLClice';
import { getRSOLAssetBalance } from 'src/features/SOLClice';
import { useMetaMaskAccount } from 'src/hooks/useMetaMaskAccount';
import { usePlatform } from 'src/hooks/usePlatform';
import { useStafiAccount } from 'src/hooks/useStafiAccount';

export default function Index() {
  const dispatch = useDispatch();
  const { platform } = usePlatform('rSOL');
  const { metaMaskNetworkId, metaMaskAddress } = useMetaMaskAccount();
  const { stafiAddress } = useStafiAccount();

  useEffect(() => {
    if (platform === 'Native') {
      dispatch(query_rBalances_account());
    } else if (platform === 'SPL') {
      dispatch(getRSOLAssetBalance());
    }
  }, [platform, metaMaskNetworkId, stafiAddress, metaMaskAddress, dispatch]);

  return <NewReward type='rSOL' hours={66} />;
}
