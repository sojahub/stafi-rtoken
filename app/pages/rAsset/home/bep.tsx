import config from '@config/index';
import { getRtokenPriceList } from '@features/bridgeClice';
import { connectMetamask, getAssetBalanceAll, handleBscAccount, monitoring_Method } from '@features/BSCClice';
import CommonClice from '@features/commonClice';
import { getUnbondCommission as fis_getUnbondCommission, rTokenRate as fis_rTokenRate } from '@features/FISClice';
import { getUnbondCommission as atom_getUnbondCommission, rTokenRate as atom_rTokenRate } from '@features/rATOMClice';
import { getUnbondCommission as bnb_getUnbondCommission, rTokenRate as bnb_rTokenRate } from '@features/rBNBClice';
import { getUnbondCommission as dot_getUnbondCommission, rTokenRate as dot_rTokenRate } from '@features/rDOTClice';
import { getUnbondCommission as ksm_getUnbondCommission, rTokenRate as ksm_rTokenRate } from '@features/rKSMClice';
import {
  getUnbondCommission as matic_getUnbondCommission,
  rTokenRate as matic_rTokenRate
} from '@features/rMATICClice';
// import {
//   getUnbondCommission as matic_getUnbondCommission,
//   rTokenRate as matic_rTokenRate
// } from '@features/rMATICClice';
import { getUnbondCommission as sol_getUnbondCommission, rTokenRate as sol_rTokenRate } from '@features/rSOLClice';
import metamask from '@images/metamask.png';
import rasset_rsol_svg from '@images/rSOL.svg';
import rasset_ratom_svg from '@images/r_atom.svg';
import rasset_rbnb_svg from '@images/r_bnb.svg';
import rasset_rdot_svg from '@images/r_dot.svg';
import rasset_reth_svg from '@images/r_eth.svg';
import rasset_rfis_svg from '@images/r_fis.svg';
import rasset_rksm_svg from '@images/r_ksm.svg';
import rasset_rmatic_svg from '@images/r_matic.svg';
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

  const {
    bscAccount,
    ksm_bepBalance,
    fis_bepBalance,
    rfis_bepBalance,
    dot_bepBalance,
    atom_bepBalance,
    rsol_bepBalance,
    rmatic_bepBalance,
    reth_bepBalance,
    rbnb_bepBalance,
    ksmWillAmount,
    fisWillAmount,
    dotWillAmount,
    solWillAmount,
    maticWillAmount,
    atomWillAmount,
    bnbWillAmount,
    unitPriceList,
  } = useSelector((state: any) => {
    return {
      bscAccount: state.BSCModule.bscAccount,
      unitPriceList: state.bridgeModule.priceList,
      ksm_bepBalance: state.BSCModule.bepRKSMBalance,
      fis_bepBalance: state.BSCModule.bepFISBalance,
      rfis_bepBalance: state.BSCModule.bepRFISBalance,
      dot_bepBalance: state.BSCModule.bepRDOTBalance,
      atom_bepBalance: state.BSCModule.bepRATOMBalance,
      rsol_bepBalance: state.BSCModule.bepRSOLBalance,
      rmatic_bepBalance: state.BSCModule.bepRMATICBalance,
      reth_bepBalance: state.BSCModule.bepRETHBalance,
      rbnb_bepBalance: state.BSCModule.bepRBNBBalance,
      ksmWillAmount: commonClice.getWillAmount(
        state.rKSMModule.ratio,
        state.rKSMModule.unbondCommission,
        state.BSCModule.bepRKSMBalance,
      ),
      fisWillAmount: commonClice.getWillAmount(
        state.FISModule.ratio,
        state.FISModule.unbondCommission,
        state.BSCModule.bepRFISBalance,
      ),
      dotWillAmount: commonClice.getWillAmount(
        state.rDOTModule.ratio,
        state.rDOTModule.unbondCommission,
        state.BSCModule.bepRDOTBalance,
      ),
      atomWillAmount: commonClice.getWillAmount(
        state.rATOMModule.ratio,
        state.rATOMModule.unbondCommission,
        state.BSCModule.bepRATOMBalance,
      ),
      solWillAmount: commonClice.getWillAmount(
        state.rSOLModule.ratio,
        state.rSOLModule.unbondCommission,
        state.BSCModule.bepRSOLBalance,
      ),
      maticWillAmount: commonClice.getWillAmount(
        state.rMATICModule.ratio,
        state.rMATICModule.unbondCommission,
        state.BSCModule.bepRMATICBalance,
      ),
      bnbWillAmount: commonClice.getWillAmount(
        state.rBNBModule.ratio,
        state.rBNBModule.unbondCommission,
        state.BSCModule.bepRBNBBalance,
      ),
    };
  });

  const { metaMaskNetworkId } = useSelector((state: any) => {
    return {
      metaMaskNetworkId: state.globalModule.metaMaskNetworkId,
    };
  });

  const totalPrice = useMemo(() => {
    let count: any = '--';
    unitPriceList.forEach((item: any) => {
      if (count == '--') {
        count = 0;
      }
      if (item.symbol == 'rFIS' && rfis_bepBalance && rfis_bepBalance != '--') {
        count = count + item.price * rfis_bepBalance;
      } else if (item.symbol == 'FIS' && fis_bepBalance && fis_bepBalance != '--') {
        count = count + item.price * fis_bepBalance;
      } else if (item.symbol == 'rKSM' && ksm_bepBalance && ksm_bepBalance != '--') {
        count = count + item.price * ksm_bepBalance;
      } else if (item.symbol == 'rDOT' && dot_bepBalance && dot_bepBalance != '--') {
        count = count + item.price * dot_bepBalance;
      } else if (item.symbol == 'rATOM' && atom_bepBalance && atom_bepBalance != '--') {
        count = count + item.price * atom_bepBalance;
      } else if (item.symbol == 'rETH' && reth_bepBalance && reth_bepBalance != '--') {
        count = count + item.price * reth_bepBalance;
      } else if (item.symbol == 'rSOL' && rsol_bepBalance && rsol_bepBalance != '--') {
        count = count + item.price * rsol_bepBalance;
      } else if (item.symbol == 'rBNB' && rbnb_bepBalance && rbnb_bepBalance != '--') {
        count = count + item.price * rbnb_bepBalance;
      }
    });
    return count;
  }, [
    unitPriceList,
    ksm_bepBalance,
    fis_bepBalance,
    rfis_bepBalance,
    dot_bepBalance,
    atom_bepBalance,
    reth_bepBalance,
    rsol_bepBalance,
  ]);

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
  }, [metaMaskNetworkId, bscAccount && bscAccount.address]);

  useEffect(() => {
    dispatch(getRtokenPriceList());
    dispatch(monitoring_Method());
  }, []);

  const updateData = () => {
    if (bscAccount && bscAccount.address) {
      dispatch(handleBscAccount(bscAccount.address));

      dispatch(getAssetBalanceAll());

      dispatch(ksm_rTokenRate());
      dispatch(fis_rTokenRate());
      dispatch(dot_rTokenRate());
      dispatch(atom_rTokenRate());
      dispatch(sol_rTokenRate());
      dispatch(matic_rTokenRate());
      dispatch(bnb_rTokenRate());
      dispatch(ksm_getUnbondCommission());
      dispatch(fis_getUnbondCommission());
      dispatch(dot_getUnbondCommission());
      dispatch(atom_getUnbondCommission());
      dispatch(sol_getUnbondCommission());
      dispatch(matic_getUnbondCommission());
      dispatch(bnb_getUnbondCommission());
    } else {
      dispatch(connectMetamask(config.bscChainId(), true));
    }
  };

  const toSwap = (tokenSymbol: string) => {
    history.push('/rAsset/swap/bep20/native', {
      rSymbol: tokenSymbol,
    });
  };

  const toSwapErc20 = (tokenSymbol: string) => {
    history.push('/rAsset/swap/bep20/erc20', {
      rSymbol: tokenSymbol,
    });
  };

  return (
    <div>
      {bscAccount && bscAccount.address ? (
        <>
          <DataList>
            {/* <DataItem
              disabled={!config.metaMaskNetworkIsBsc(metaMaskNetworkId)}
              rSymbol='FIS'
              icon={rasset_fis_svg}
              fullName='StaFi'
              balance={fis_bepBalance == '--' ? '--' : NumberUtil.handleFisAmountToFixed(fis_bepBalance)}
              willGetBalance={0}
              unit='FIS'
              trade={config.uniswapUrl('0xB8c77482e45F1F44dE1745F52C74426C631bDD52', config.FISBep20TokenAddress())}
              operationType='bep20'
              onSwapClick={() => toSwap('FIS')}
            /> */}

            <DataItem
              disabled={!config.metaMaskNetworkIsBsc(metaMaskNetworkId)}
              rSymbol='rFIS'
              icon={rasset_rfis_svg}
              fullName='StaFi'
              balance={rfis_bepBalance == '--' ? '--' : NumberUtil.handleFisAmountToFixed(rfis_bepBalance)}
              willGetBalance={fisWillAmount}
              unit='FIS'
              trade={config.uniswapUrl('0xB8c77482e45F1F44dE1745F52C74426C631bDD52', config.rFISBep20TokenAddress())}
              operationType='bep20'
              onSwapClick={() => toSwap('rFIS')}
            />

            <DataItem
              disabled={!config.metaMaskNetworkIsBsc(metaMaskNetworkId)}
              rSymbol='rETH'
              icon={rasset_reth_svg}
              fullName='Ethereum'
              balance={reth_bepBalance == '--' ? '--' : NumberUtil.handleFisAmountToFixed(reth_bepBalance)}
              willGetBalance={'0.000000'}
              unit='ETH'
              operationType='bep20'
              trade={config.uniswap.rethURL}
              onSwapClick={() => {
                toSwapErc20('rETH');
              }}
            />

            <DataItem
              disabled={!config.metaMaskNetworkIsBsc(metaMaskNetworkId)}
              rSymbol='rDOT'
              icon={rasset_rdot_svg}
              fullName='Polkadot'
              balance={dot_bepBalance == '--' ? '--' : NumberUtil.handleFisAmountToFixed(dot_bepBalance)}
              willGetBalance={dotWillAmount}
              unit='DOT'
              trade={config.uniswapUrl('0xB8c77482e45F1F44dE1745F52C74426C631bDD52', config.rDOTBep20TokenAddress())}
              operationType='bep20'
              onSwapClick={() => toSwap('rDOT')}
            />

            <DataItem
              disabled={!config.metaMaskNetworkIsBsc(metaMaskNetworkId)}
              rSymbol='rKSM'
              icon={rasset_rksm_svg}
              fullName='Kusama'
              balance={ksm_bepBalance == '--' ? '--' : NumberUtil.handleFisAmountToFixed(ksm_bepBalance)}
              willGetBalance={ksmWillAmount}
              unit='KSM'
              trade={config.uniswapUrl('0xB8c77482e45F1F44dE1745F52C74426C631bDD52', config.rKSMBep20TokenAddress())}
              operationType='bep20'
              onSwapClick={() => toSwap('rKSM')}
            />
            <DataItem
              disabled={!config.metaMaskNetworkIsBsc(metaMaskNetworkId)}
              rSymbol='rATOM'
              icon={rasset_ratom_svg}
              fullName='Cosmos'
              balance={atom_bepBalance == '--' ? '--' : NumberUtil.handleFisAmountToFixed(atom_bepBalance)}
              willGetBalance={atomWillAmount}
              unit='ATOM'
              trade={config.uniswapUrl('0xB8c77482e45F1F44dE1745F52C74426C631bDD52', config.rATOMBep20TokenAddress())}
              operationType='bep20'
              onSwapClick={() => toSwap('rATOM')}
            />

            <DataItem
              disabled={!config.metaMaskNetworkIsBsc(metaMaskNetworkId)}
              rSymbol='rSOL'
              icon={rasset_rsol_svg}
              fullName='Solana'
              balance={rsol_bepBalance == '--' ? '--' : NumberUtil.handleFisAmountToFixed(rsol_bepBalance)}
              willGetBalance={solWillAmount}
              unit='SOL'
              trade={config.uniswap.rsolURL}
              operationType='bep20'
              onSwapClick={() => toSwap('rSOL')}
            />

            <DataItem
              disabled={!config.metaMaskNetworkIsBsc(metaMaskNetworkId)}
              rSymbol='rMATIC'
              icon={rasset_rmatic_svg}
              fullName='Matic'
              balance={rmatic_bepBalance == '--' ? '--' : NumberUtil.handleFisAmountToFixed(rmatic_bepBalance)}
              willGetBalance={maticWillAmount}
              unit='MATIC'
              trade={config.uniswap.ratomURL}
              operationType='bep20'
              onSwapClick={() => toSwap('rMATIC')}
            />

            <DataItem
              disabled={!config.metaMaskNetworkIsBsc(metaMaskNetworkId)}
              rSymbol='rBNB'
              icon={rasset_rbnb_svg}
              fullName='BSC'
              balance={rbnb_bepBalance == '--' ? '--' : NumberUtil.handleFisAmountToFixed(rbnb_bepBalance)}
              willGetBalance={bnbWillAmount}
              unit='BNB'
              trade={config.uniswap.ratomURL}
              operationType='bep20'
              onSwapClick={() => toSwap('rBNB')}
            />
          </DataList>{' '}
          <CountAmount totalValue={totalPrice} />
        </>
      ) : (
        <div className='rAsset_content'>
          <Button
            icon={metamask}
            onClick={() => {
              dispatch(connectMetamask(config.bscChainId()));
              dispatch(monitoring_Method());
            }}>
            Connect to Metamask
          </Button>
        </div>
      )}
    </div>
  );
}
