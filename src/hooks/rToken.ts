import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getRATOMAssetBalance as getBEP20RATOMAssetBalance,
  getRBNBAssetBalance,
  getRDOTAssetBalance as getBEP20RDOTAssetBalance,
  getRETHAssetBalance as getBEP20RETHAssetBalance,
  getRFISAssetBalance as getBEP20RFISAssetBalance,
  getRKSMAssetBalance as getBEP20RKSMAssetBalance,
  getRMATICAssetBalance as getBEP20RMATICAssetBalance,
} from 'src/features/BSCClice';
import {
  getETHAssetBalance,
  getRATOMAssetBalance as getERC20RATOMAssetBalance,
  getRDOTAssetBalance as getERC20RDOTAssetBalance,
  getRFISAssetBalance as getERC20RFISAssetBalance,
  getRKSMAssetBalance as getERC20RKSMAssetBalance,
  getRMaticAssetBalance as getERC20RMATICAssetBalance,
} from 'src/features/ETHClice';
import { query_rBalances_account as query_rFis_balance } from 'src/features/FISClice';
import { query_rBalances_account as query_rAtom_balance } from 'src/features/rATOMClice';
import { query_rBalances_account as query_rBnb_balance } from 'src/features/rBNBClice';
import { query_rBalances_account as query_rDot_balance } from 'src/features/rDOTClice';
import { getNativeRethAmount } from 'src/features/rETHClice';
import { query_rBalances_account as query_rKsm_balance } from 'src/features/rKSMClice';
import { query_rBalances_account as query_rMatic_balance } from 'src/features/rMATICClice';
import { query_rBalances_account as query_rSol_balance } from 'src/features/rSOLClice';
import { getRSOLAssetBalance } from 'src/features/SOLClice';
import { RootState } from 'src/store';
import numberUtil from 'src/util/numberUtil';
import { useMetaMaskAccount } from './useMetaMaskAccount';

export function useRToken(platform: 'native' | 'erc' | 'bep' | 'spl') {
  const dispatch = useDispatch();
  const { metaMaskAddress, metaMaskNetworkId } = useMetaMaskAccount();

  const { fisAddress } = useSelector((state: any) => {
    return {
      fisAddress: state.FISModule.fisAccount && state.FISModule.fisAccount.address,
    };
  });

  useEffect(() => {
    if (platform === 'native') {
      dispatch(query_rFis_balance());
      dispatch(getNativeRethAmount());
      dispatch(query_rDot_balance());
      dispatch(query_rKsm_balance());
      dispatch(query_rAtom_balance());
      dispatch(query_rSol_balance());
      dispatch(query_rMatic_balance());
      dispatch(query_rBnb_balance());
    } else if (platform === 'erc') {
      setTimeout(() => {
        dispatch(getERC20RFISAssetBalance());
        dispatch(getETHAssetBalance());
        dispatch(getERC20RDOTAssetBalance());
        dispatch(getERC20RKSMAssetBalance());
        dispatch(getERC20RATOMAssetBalance());
        dispatch(getERC20RMATICAssetBalance());
      }, 500);
    } else if (platform === 'bep') {
      setTimeout(() => {
        dispatch(getBEP20RFISAssetBalance());
        dispatch(getBEP20RETHAssetBalance());
        dispatch(getBEP20RDOTAssetBalance());
        dispatch(getBEP20RKSMAssetBalance());
        dispatch(getBEP20RATOMAssetBalance());
        dispatch(getBEP20RMATICAssetBalance());
        dispatch(getRBNBAssetBalance());
      }, 500);
    } else if (platform === 'spl') {
      dispatch(getRSOLAssetBalance());
    }
  }, [platform, metaMaskNetworkId, fisAddress, metaMaskAddress, dispatch]);

  const { rFisRatio, rEthRatio, rDotRatio, rKsmRatio, rAtomRatio, rSolRatio, rMaticRatio, rBnbRatio } = useSelector(
    (state: RootState) => {
      return {
        rFisRatio: state.FISModule.ratio,
        rEthRatio: platform === 'native' ? state.rETHModule.nativerTokenRate : state.rETHModule.ratio,
        rDotRatio: state.rDOTModule.ratio,
        rKsmRatio: state.rKSMModule.ratio,
        rAtomRatio: state.rATOMModule.ratio,
        rSolRatio: state.rSOLModule.ratio,
        rMaticRatio: state.rMATICModule.ratio,
        rBnbRatio: state.rBNBModule.ratio,
      };
    },
  );

  const { rFisAmount, rEthAmount, rDotAmount, rKsmAmount, rAtomAmount, rSolAmount, rMaticAmount, rBnbAmount } =
    useSelector((state: RootState) => {
      const rFisAmount =
        platform === 'native'
          ? state.FISModule.tokenAmount
          : platform === 'erc'
          ? state.ETHModule.ercRFISBalance
          : platform === 'bep'
          ? state.BSCModule.bepRFISBalance
          : '--';

      const rEthAmount =
        platform === 'native'
          ? state.rETHModule.nativeTokenAmount
          : platform === 'erc'
          ? state.ETHModule.ercETHBalance
          : platform === 'bep'
          ? state.BSCModule.bepRETHBalance
          : '--';

      const rDotAmount =
        platform === 'native'
          ? state.rDOTModule.tokenAmount
          : platform === 'erc'
          ? state.ETHModule.ercRDOTBalance
          : platform === 'bep'
          ? state.BSCModule.bepRDOTBalance
          : '--';

      const rKsmAmount =
        platform === 'native'
          ? state.rKSMModule.tokenAmount
          : platform === 'erc'
          ? state.ETHModule.ercRKSMBalance
          : platform === 'bep'
          ? state.BSCModule.bepRKSMBalance
          : '--';

      const rAtomAmount =
        platform === 'native'
          ? state.rATOMModule.tokenAmount
          : platform === 'erc'
          ? state.ETHModule.ercRATOMBalance
          : platform === 'bep'
          ? state.BSCModule.bepRATOMBalance
          : '--';

      const rSolAmount =
        platform === 'native' ? state.rSOLModule.tokenAmount : platform === 'spl' ? state.SOLModule.rSOLBalance : '--';

      const rMaticAmount =
        platform === 'native'
          ? state.rMATICModule.tokenAmount
          : platform === 'erc'
          ? state.ETHModule.ercRMaticBalance
          : platform === 'bep'
          ? state.BSCModule.bepRMATICBalance
          : '--';

      const rBnbAmount =
        platform === 'native'
          ? state.rBNBModule.tokenAmount
          : platform === 'bep'
          ? state.BSCModule.bepRBNBBalance
          : '--';

      return { rFisAmount, rEthAmount, rDotAmount, rKsmAmount, rAtomAmount, rSolAmount, rMaticAmount, rBnbAmount };
    });

  const {
    rFisStakedAmount,
    rFisStakedAmountShow,
    rEthStakedAmount,
    rEthStakedAmountShow,
    rDotStakedAmount,
    rDotStakedAmountShow,
    rKsmStakedAmount,
    rKsmStakedAmountShow,
    rAtomStakedAmount,
    rAtomStakedAmountShow,
    rSolStakedAmount,
    rSolStakedAmountShow,
    rMaticStakedAmount,
    rMaticStakedAmountShow,
    rBnbStakedAmount,
    rBnbStakedAmountShow,
  } = useMemo(() => {
    const rFisStakedAmount =
      rFisAmount !== '--' && rFisRatio !== '--'
        ? numberUtil.handleAmountFloorToFixed(Number(rFisAmount) * Number(rFisRatio), 3)
        : '--';
    const rFisStakedAmountShow =
      rFisAmount !== '--' && rFisRatio !== '--'
        ? Number(rFisAmount) * Number(rFisRatio) > 0 && Number(rFisAmount) * Number(rFisRatio) < 0.0001
          ? '<0.0001'
          : numberUtil.handleAmountFloorToFixed(Number(rFisAmount) * Number(rFisRatio), 3)
        : '--';

    const rEthStakedAmount =
      rEthAmount !== '--' && rEthRatio !== '--'
        ? numberUtil.handleAmountFloorToFixed(Number(rEthAmount) * Number(rEthRatio), 3)
        : '--';
    const rEthStakedAmountShow =
      rEthAmount !== '--' && rEthRatio !== '--'
        ? Number(rEthAmount) * Number(rEthRatio) > 0 && Number(rEthAmount) * Number(rEthRatio) < 0.0001
          ? '<0.0001'
          : numberUtil.handleAmountFloorToFixed(Number(rEthAmount) * Number(rEthRatio), 3)
        : '--';

    const rDotStakedAmount =
      rDotAmount !== '--' && rDotRatio !== '--'
        ? numberUtil.handleAmountFloorToFixed(Number(rDotAmount) * Number(rDotRatio), 3)
        : '--';
    const rDotStakedAmountShow =
      rDotAmount !== '--' && rDotRatio !== '--'
        ? Number(rDotAmount) * Number(rDotRatio) > 0 && Number(rDotAmount) * Number(rDotRatio) < 0.0001
          ? '<0.0001'
          : numberUtil.handleAmountFloorToFixed(Number(rDotAmount) * Number(rDotRatio), 3)
        : '--';

    const rKsmStakedAmount =
      rKsmAmount !== '--' && rKsmRatio !== '--'
        ? numberUtil.handleAmountFloorToFixed(Number(rKsmAmount) * Number(rKsmRatio), 3)
        : '--';
    const rKsmStakedAmountShow =
      rKsmAmount !== '--' && rKsmRatio !== '--'
        ? Number(rKsmAmount) * Number(rKsmRatio) > 0 && Number(rKsmAmount) * Number(rKsmRatio) < 0.0001
          ? '<0.0001'
          : numberUtil.handleAmountFloorToFixed(Number(rKsmAmount) * Number(rKsmRatio), 3)
        : '--';

    const rAtomStakedAmount =
      rAtomAmount !== '--' && rAtomRatio !== '--'
        ? numberUtil.handleAmountFloorToFixed(Number(rAtomAmount) * Number(rAtomRatio), 3)
        : '--';
    const rAtomStakedAmountShow =
      rAtomAmount !== '--' && rAtomRatio !== '--'
        ? Number(rAtomAmount) * Number(rAtomRatio) > 0 && Number(rAtomAmount) * Number(rAtomRatio) < 0.0001
          ? '<0.0001'
          : numberUtil.handleAmountFloorToFixed(Number(rAtomAmount) * Number(rAtomRatio), 3)
        : '--';

    const rSolStakedAmount =
      rSolAmount !== '--' && rSolRatio !== '--'
        ? numberUtil.handleAmountFloorToFixed(Number(rSolAmount) * Number(rSolRatio), 3)
        : '--';
    const rSolStakedAmountShow =
      rSolAmount !== '--' && rSolRatio !== '--'
        ? Number(rSolAmount) * Number(rSolRatio) > 0 && Number(rSolAmount) * Number(rSolRatio) < 0.0001
          ? '<0.0001'
          : numberUtil.handleAmountFloorToFixed(Number(rSolAmount) * Number(rSolRatio), 3)
        : '--';

    const rMaticStakedAmount =
      rMaticAmount !== '--' && rMaticRatio !== '--'
        ? numberUtil.handleAmountFloorToFixed(Number(rMaticAmount) * Number(rMaticRatio), 3)
        : '--';
    const rMaticStakedAmountShow =
      rMaticAmount !== '--' && rMaticRatio !== '--'
        ? Number(rMaticAmount) * Number(rMaticRatio) > 0 && Number(rMaticAmount) * Number(rMaticRatio) < 0.0001
          ? '<0.0001'
          : numberUtil.handleAmountFloorToFixed(Number(rMaticAmount) * Number(rMaticRatio), 3)
        : '--';

    const rBnbStakedAmount =
      rBnbAmount !== '--' && rFisRatio !== '--'
        ? numberUtil.handleAmountFloorToFixed(Number(rBnbAmount) * Number(rBnbRatio), 3)
        : '--';
    const rBnbStakedAmountShow =
      rBnbAmount !== '--' && rFisRatio !== '--'
        ? Number(rBnbAmount) * Number(rBnbRatio) > 0 && Number(rBnbAmount) * Number(rBnbRatio) < 0.0001
          ? '<0.0001'
          : numberUtil.handleAmountFloorToFixed(Number(rBnbAmount) * Number(rBnbRatio), 3)
        : '--';

    return {
      rFisStakedAmount,
      rFisStakedAmountShow,
      rEthStakedAmount,
      rEthStakedAmountShow,
      rDotStakedAmount,
      rDotStakedAmountShow,
      rKsmStakedAmount,
      rKsmStakedAmountShow,
      rAtomStakedAmount,
      rAtomStakedAmountShow,
      rSolStakedAmount,
      rSolStakedAmountShow,
      rMaticStakedAmount,
      rMaticStakedAmountShow,
      rBnbStakedAmount,
      rBnbStakedAmountShow,
    };
  }, [
    rFisRatio,
    rEthRatio,
    rDotRatio,
    rKsmRatio,
    rAtomRatio,
    rSolRatio,
    rMaticRatio,
    rBnbRatio,
    rFisAmount,
    rEthAmount,
    rDotAmount,
    rKsmAmount,
    rAtomAmount,
    rSolAmount,
    rMaticAmount,
    rBnbAmount,
  ]);

  return {
    rFisStakedAmount,
    rFisStakedAmountShow,
    rEthStakedAmount,
    rEthStakedAmountShow,
    rDotStakedAmount,
    rDotStakedAmountShow,
    rKsmStakedAmount,
    rKsmStakedAmountShow,
    rAtomStakedAmount,
    rAtomStakedAmountShow,
    rSolStakedAmount,
    rSolStakedAmountShow,
    rMaticStakedAmount,
    rMaticStakedAmountShow,
    rBnbStakedAmount,
    rBnbStakedAmountShow,
  };
}
