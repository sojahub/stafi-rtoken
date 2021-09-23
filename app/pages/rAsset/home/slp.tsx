import config from '@config/index';
import { getRtokenPriceList } from '@features/bridgeClice';
import { monitoring_Method } from '@features/BSCClice';
import CommonClice from '@features/commonClice';
import { getUnbondCommission as fis_getUnbondCommission, rTokenRate as fis_rTokenRate } from '@features/FISClice';
import { connectSoljs } from '@features/globalClice';
import {
  createSubstrate,
  getUnbondCommission as sol_getUnbondCommission,
  rTokenRate as sol_rTokenRate
} from '@features/rSOLClice';
import { getSlp20AssetBalanceAll } from '@features/SOLClice';
import rasset_fis_svg from '@images/rFIS.svg';
import rasset_rsol_svg from '@images/rSOL.svg';
// import {
//   getUnbondCommission as matic_getUnbondCommission,
//   rTokenRate as matic_rTokenRate
// } from '@features/rMATICClice';
import sollet from '@images/sollet.png';
import Button from '@shared/components/button/connect_button';
import NumberUtil from '@util/numberUtil';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import CountAmount from './components/countAmount';
import DataList from './components/list';
import DataItem from './components/list/item';
import './page.scss';

const commonClice = new CommonClice();
export default function Index(props: any) {
  const dispatch = useDispatch();
  const history = useHistory();

  const { solAccount, fis_slpBalance, rsol_slpBalance, fisWillAmount, solWillAmount, unitPriceList } = useSelector(
    (state: any) => {
      return {
        solAccount: state.rSOLModule.solAccount,
        unitPriceList: state.bridgeModule.priceList,
        fis_slpBalance: state.SOLModule.fisBalance,
        rsol_slpBalance: state.SOLModule.rSOLBalance,
        fisWillAmount: commonClice.getWillAmount(
          state.FISModule.ratio,
          state.FISModule.unbondCommission,
          state.SOLModule.fisBalance,
        ),
        solWillAmount: commonClice.getWillAmount(
          state.rSOLModule.ratio,
          state.rSOLModule.unbondCommission,
          state.SOLModule.rSOLBalance,
        ),
      };
    },
  );

  const totalPrice = useMemo(() => {
    let count: any = '--';
    unitPriceList.forEach((item: any) => {
      if (count == '--') {
        count = 0;
      }
      if (item.symbol == 'FIS' && fis_slpBalance && fis_slpBalance != '--') {
        count = count + item.price * fis_slpBalance;
      } else if (item.symbol == 'rSOL' && rsol_slpBalance && rsol_slpBalance != '--') {
        count = count + item.price * rsol_slpBalance;
      }
    });
    return count;
  }, [unitPriceList, fis_slpBalance, rsol_slpBalance]);

  let time: any;
  useEffect(() => {
    updateData();
    if (time) {
      clearInterval(time);
    }
    time = setInterval(updateData, 30000);
    return () => {
      if (time) {
        clearInterval(time);
      }
    };
  }, [solAccount && solAccount.address]);

  useEffect(() => {
    dispatch(getRtokenPriceList());
    dispatch(monitoring_Method());
  }, []);

  const updateData = () => {
    if (solAccount && solAccount.address) {
      dispatch(createSubstrate(solAccount));
      dispatch(getRtokenPriceList());
      dispatch(getSlp20AssetBalanceAll());
      dispatch(fis_rTokenRate());
      dispatch(sol_rTokenRate());
      dispatch(fis_getUnbondCommission());
      dispatch(sol_getUnbondCommission());
    }
  };

  const toSwap = (tokenSymbol: string) => {
    history.push('/rAsset/swap/slp20/native', {
      rSymbol: tokenSymbol,
    });
  };

  return (
    <div>
      {solAccount && solAccount.address ? (
        <>
          <DataList>
            <DataItem
              rSymbol='FIS'
              icon={rasset_fis_svg}
              fullName='StaFi'
              balance={fis_slpBalance == '--' ? '--' : NumberUtil.handleFisAmountToFixed(fis_slpBalance)}
              willGetBalance={0}
              unit='FIS'
              trade={config.uniswapUrl('0xB8c77482e45F1F44dE1745F52C74426C631bDD52', config.FISBep20TokenAddress())}
              operationType='slp20'
              onSwapClick={() => toSwap('FIS')}
            />

            <DataItem
              rSymbol='rSOL'
              icon={rasset_rsol_svg}
              fullName='Solana'
              balance={rsol_slpBalance == '--' ? '--' : NumberUtil.handleFisAmountToFixed(rsol_slpBalance)}
              willGetBalance={solWillAmount}
              unit='SOL'
              trade={config.uniswap.rsolURL}
              operationType='slp20'
              onSwapClick={() => toSwap('rSOL')}
            />
          </DataList>{' '}
          <CountAmount totalValue={totalPrice} />
        </>
      ) : (
        <div className='rAsset_content'>
          <Button
            icon={sollet}
            onClick={() => {
              dispatch(connectSoljs());
            }}>
            Connect to Solana extension
          </Button>
        </div>
      )}
    </div>
  );
}
