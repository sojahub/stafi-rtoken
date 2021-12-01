import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NewReward } from 'src/components/NewReward';
import { getRFISAssetBalance as getBEP20RFISAssetBalance } from 'src/features/BSCClice';
import { getRFISAssetBalance as getERC20RFISAssetBalance } from 'src/features/ETHClice';
import { query_rBalances_account } from 'src/features/FISClice';
import { useMetaMaskAccount } from 'src/hooks/useMetaMaskAccount';
import { usePlatform } from 'src/hooks/usePlatform';

export default function Index() {
  const dispatch = useDispatch();
  const { platform } = usePlatform('rFIS');
  const { metaMaskNetworkId, metaMaskAddress } = useMetaMaskAccount();

  const { fisAddress } = useSelector((state: any) => {
    return {
      fisAddress: state.FISModule.fisAccount && state.FISModule.fisAccount.address,
    };
  });

  useEffect(() => {
    if (platform === 'Native') {
      dispatch(query_rBalances_account());
    } else if (platform === 'ERC20') {
      dispatch(getERC20RFISAssetBalance());
    } else if (platform === 'BEP20') {
      dispatch(getBEP20RFISAssetBalance());
    }
  }, [platform, metaMaskNetworkId, fisAddress, metaMaskAddress, dispatch]);

  return <NewReward type='rFIS' hours={6} />;
}
