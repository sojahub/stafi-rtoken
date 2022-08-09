import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { rTokenRate as rFisTokenRate } from 'src/features/FISClice';
import { rTokenRate as rDotTokenRate } from 'src/features/rDOTClice';
import { nativerTokenRate as rEthNativeTokenRate, rTokenRate as rEthTokenRate } from 'src/features/rETHClice';
import { rTokenRate as rKsmTokenRate } from 'src/features/rKSMClice';
import { rTokenRate as rAtomTokenRate } from 'src/features/rATOMClice';
import { rTokenRate as rSolTokenRate } from 'src/features/rSOLClice';
import { rTokenRate as rMaticTokenRate } from 'src/features/rMATICClice';
import { rTokenRate as rBnbTokenRate } from 'src/features/rBNBClice';
import { useStafiAccount } from './useStafiAccount';
import { Keys } from 'src/util/common';
import { connectStafiHubAtomjs } from 'src/features/globalClice';

export function useInit() {
  const dispatch = useDispatch();
  const { stafiAddress } = useStafiAccount();

  useEffect(() => {
    dispatch(rFisTokenRate());
    dispatch(rDotTokenRate());
    dispatch(rEthNativeTokenRate());
    dispatch(rEthTokenRate());
    dispatch(rEthTokenRate());
    dispatch(rKsmTokenRate());
    dispatch(rAtomTokenRate());
    dispatch(rSolTokenRate());
    dispatch(rMaticTokenRate());
    dispatch(rBnbTokenRate());
  }, [dispatch, stafiAddress]);

  useEffect(() => {
    if (localStorage.getItem(Keys.StafiHubWalletAllowed)) {
      dispatch(connectStafiHubAtomjs());
    }
  }, [dispatch]);
}
