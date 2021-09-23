import config from '@config/index';
import { getRtokenPriceList } from '@features/bridgeClice';
import CommonClice from '@features/commonClice';
import { getAssetBalanceAll } from '@features/ETHClice';
import { getUnbondCommission as fis_getUnbondCommission, rTokenRate as fis_rTokenRate } from '@features/FISClice';
import { getUnbondCommission as atom_getUnbondCommission, rTokenRate as atom_rTokenRate } from '@features/rATOMClice';
import { getUnbondCommission as dot_getUnbondCommission, rTokenRate as dot_rTokenRate } from '@features/rDOTClice';
import { connectMetamask, handleEthAccount, monitoring_Method } from '@features/rETHClice';
import { getUnbondCommission as ksm_getUnbondCommission, rTokenRate as ksm_rTokenRate } from '@features/rKSMClice';
import {
  getUnbondCommission as matic_getUnbondCommission,
  rTokenRate as matic_rTokenRate
} from '@features/rMATICClice';
// import { getUnbondCommission as sol_getUnbondCommission, rTokenRate as sol_rTokenRate } from '@features/rSOLClice';
import metamask from '@images/metamask.png';
import rasset_fis_svg from '@images/rFIS.svg';
// import rasset_rsol_svg from '@images/rSOL.svg';
import rasset_ratom_svg from '@images/r_atom.svg';
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
    ethAccount,
    ksm_ercBalance,
    fis_ercBalance,
    eth_ercBalance,
    rfis_ercBalance,
    dot_ercBalance,
    atom_ercBalance,
    sol_ercBalance,
    ksmWillAmount,
    fisWillAmount,
    dotWillAmount,
    unitPriceList,
    atomWillAmount,
    solWillAmount,
    matic_ercBalance,
    maticWillAmount,
  } = useSelector((state: any) => {
    return {
      unitPriceList: state.bridgeModule.priceList,
      ethAccount: state.rETHModule.ethAccount,
      ksm_ercBalance: state.ETHModule.ercRKSMBalance,
      fis_ercBalance: state.ETHModule.ercFISBalance,
      rfis_ercBalance: state.ETHModule.ercRFISBalance,
      eth_ercBalance: state.ETHModule.ercETHBalance,
      dot_ercBalance: state.ETHModule.ercRDOTBalance,
      atom_ercBalance: state.ETHModule.ercRATOMBalance,
      sol_ercBalance: state.ETHModule.ercRSOLBalance,
      matic_ercBalance: state.ETHModule.ercRMaticBalance,
      ksmWillAmount: commonClice.getWillAmount(
        state.rKSMModule.ratio,
        state.rKSMModule.unbondCommission,
        state.ETHModule.ercRKSMBalance,
      ),
      fisWillAmount: commonClice.getWillAmount(
        state.FISModule.ratio,
        state.FISModule.unbondCommission,
        state.ETHModule.ercRFISBalance,
      ),
      dotWillAmount: commonClice.getWillAmount(
        state.rDOTModule.ratio,
        state.rDOTModule.unbondCommission,
        state.ETHModule.ercRDOTBalance,
      ),
      atomWillAmount: commonClice.getWillAmount(
        state.rATOMModule.ratio,
        state.rATOMModule.unbondCommission,
        state.ETHModule.ercRATOMBalance,
      ),
      solWillAmount: commonClice.getWillAmount(
        state.rSOLModule.ratio,
        state.rSOLModule.unbondCommission,
        state.ETHModule.ercRSOLBalance,
      ),
      maticWillAmount: commonClice.getWillAmount(
        state.rMATICModule.ratio,
        state.rMATICModule.unbondCommission,
        state.ETHModule.ercRMaticBalance,
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
      if (item.symbol == 'rFIS' && rfis_ercBalance && rfis_ercBalance != '--') {
        count = count + item.price * rfis_ercBalance;
      } else if (item.symbol == 'FIS' && fis_ercBalance && fis_ercBalance != '--') {
        count = count + item.price * fis_ercBalance;
      } else if (item.symbol == 'rKSM' && ksm_ercBalance && ksm_ercBalance != '--') {
        count = count + item.price * ksm_ercBalance;
      } else if (item.symbol == 'rDOT' && dot_ercBalance && dot_ercBalance != '--') {
        count = count + item.price * dot_ercBalance;
      } else if (item.symbol == 'rETH' && eth_ercBalance && eth_ercBalance != '--') {
        count = count + item.price * eth_ercBalance;
      } else if (item.symbol == 'rATOM' && atom_ercBalance && atom_ercBalance != '--') {
        count = count + item.price * atom_ercBalance;
      } else if (item.symbol == 'rSOL' && sol_ercBalance && sol_ercBalance != '--') {
        count = count + item.price * sol_ercBalance;
      } else if (item.symbol == 'rMATIC' && matic_ercBalance && matic_ercBalance != '--') {
        count = count + item.price * matic_ercBalance;
      }
    });
    return count;
  }, [
    unitPriceList,
    ksm_ercBalance,
    fis_ercBalance,
    rfis_ercBalance,
    eth_ercBalance,
    dot_ercBalance,
    atom_ercBalance,
    sol_ercBalance,
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
  }, [metaMaskNetworkId, ethAccount && ethAccount.address]);

  useEffect(() => {
    dispatch(getRtokenPriceList());
    dispatch(monitoring_Method());
  }, []);

  const updateData = () => {
    if (ethAccount && ethAccount.address) {
      dispatch(handleEthAccount(ethAccount.address, config.goerliChainId()));

      dispatch(getAssetBalanceAll());

      dispatch(ksm_rTokenRate());
      dispatch(fis_rTokenRate());
      dispatch(dot_rTokenRate());
      dispatch(atom_rTokenRate());
      // dispatch(sol_rTokenRate());
      dispatch(matic_rTokenRate());
      dispatch(ksm_getUnbondCommission());
      dispatch(fis_getUnbondCommission());
      dispatch(dot_getUnbondCommission());
      dispatch(atom_getUnbondCommission());
      // dispatch(sol_getUnbondCommission());
      dispatch(matic_getUnbondCommission());
    } else {
      dispatch(connectMetamask(config.ethChainId(), true));
    }
  };

  useEffect(() => {
    dispatch(getRtokenPriceList());
    dispatch(monitoring_Method());
  }, []);

  const toSwap = (tokenSymbol: string) => {
    history.push('/rAsset/swap/erc20/native', {
      rSymbol: tokenSymbol,
    });
  };

  const toSwapBep20 = (tokenSymbol: string) => {
    history.push('/rAsset/swap/erc20/bep20', {
      rSymbol: tokenSymbol,
    });
  };

  return (
    <div>
      {ethAccount && ethAccount.address ? (
        <>
          <DataList>
            <DataItem
              disabled={!config.metaMaskNetworkIsGoerliEth(metaMaskNetworkId)}
              rSymbol='FIS'
              icon={rasset_fis_svg}
              fullName='StaFi'
              balance={fis_ercBalance == '--' ? '--' : NumberUtil.handleFisAmountToFixed(fis_ercBalance)}
              willGetBalance={0}
              unit='FIS'
              trade={config.uniswap.fisURL}
              operationType='erc20'
              onSwapClick={() => toSwap('FIS')}
            />

            <DataItem
              disabled={!config.metaMaskNetworkIsGoerliEth(metaMaskNetworkId)}
              rSymbol='rFIS'
              icon={rasset_rfis_svg}
              fullName='StaFi'
              balance={rfis_ercBalance == '--' ? '--' : NumberUtil.handleFisAmountToFixed(rfis_ercBalance)}
              willGetBalance={fisWillAmount}
              unit='FIS'
              trade={config.uniswap.rfisURL}
              operationType='erc20'
              onSwapClick={() => toSwap('rFIS')}
            />
            <DataItem
              disabled={!config.metaMaskNetworkIsGoerliEth(metaMaskNetworkId)}
              rSymbol='rETH'
              icon={rasset_reth_svg}
              fullName='Ethereum'
              balance={eth_ercBalance == '--' ? '--' : NumberUtil.handleFisAmountToFixed(eth_ercBalance)}
              willGetBalance={'0.000000'}
              unit='ETH'
              operationType='erc20'
              trade={config.uniswap.rethURL}
              onSwapClick={() => toSwapBep20('rETH')}
            />
            <DataItem
              disabled={!config.metaMaskNetworkIsGoerliEth(metaMaskNetworkId)}
              rSymbol='rDOT'
              icon={rasset_rdot_svg}
              fullName='Polkadot'
              balance={dot_ercBalance == '--' ? '--' : NumberUtil.handleFisAmountToFixed(dot_ercBalance)}
              willGetBalance={dotWillAmount}
              unit='DOT'
              trade={config.uniswap.rdotURL}
              operationType='erc20'
              onSwapClick={() => toSwap('rDOT')}
            />

            <DataItem
              disabled={!config.metaMaskNetworkIsGoerliEth(metaMaskNetworkId)}
              rSymbol='rKSM'
              icon={rasset_rksm_svg}
              fullName='Kusama'
              balance={ksm_ercBalance == '--' ? '--' : NumberUtil.handleFisAmountToFixed(ksm_ercBalance)}
              willGetBalance={ksmWillAmount}
              unit='KSM'
              trade={config.uniswap.rksmURL}
              operationType='erc20'
              onSwapClick={() => toSwap('rKSM')}
            />

            <DataItem
              disabled={!config.metaMaskNetworkIsGoerliEth(metaMaskNetworkId)}
              rSymbol='rATOM'
              icon={rasset_ratom_svg}
              fullName='Cosmos'
              balance={atom_ercBalance == '--' ? '--' : NumberUtil.handleFisAmountToFixed(atom_ercBalance)}
              willGetBalance={atomWillAmount}
              unit='ATOM'
              trade={config.uniswap.ratomURL}
              operationType='erc20'
              onSwapClick={() => toSwap('rATOM')}
            />

            {/* <DataItem
              disabled={!config.metaMaskNetworkIsGoerliEth(metaMaskNetworkId)}
              rSymbol='rSOL'
              icon={rasset_rsol_svg}
              fullName='Solana'
              balance={sol_ercBalance == '--' ? '--' : NumberUtil.handleFisAmountToFixed(sol_ercBalance)}
              willGetBalance={solWillAmount}
              unit='SOL'
              trade={config.uniswap.rsolURL}
              operationType='erc20'
              onSwapClick={() => toSwap('rSOL')}
            />*/}

            <DataItem
              disabled={!config.metaMaskNetworkIsGoerliEth(metaMaskNetworkId)}
              rSymbol='rMATIC'
              icon={rasset_rmatic_svg}
              fullName='Matic'
              balance={matic_ercBalance == '--' ? '--' : NumberUtil.handleFisAmountToFixed(matic_ercBalance)}
              willGetBalance={maticWillAmount}
              unit='MATIC'
              trade={config.uniswap.ratomURL}
              operationType='erc20'
              onSwapClick={() => toSwap('rMATIC')}
            />
          </DataList>{' '}
          <CountAmount totalValue={totalPrice} />
        </>
      ) : (
        <div className='rAsset_content'>
          <Button
            icon={metamask}
            onClick={() => {
              dispatch(connectMetamask(config.ethChainId()));
              dispatch(monitoring_Method());
            }}>
            Connect to Metamask
          </Button>
        </div>
      )}
    </div>
  );
}
