import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import metamask from 'src/assets/images/metamask.png';
import rasset_fis_svg from 'src/assets/images/rFIS.svg';
import rasset_ratom_svg from 'src/assets/images/r_atom.svg';
import rasset_rdot_svg from 'src/assets/images/r_dot.svg';
import rasset_reth_svg from 'src/assets/images/r_eth.svg';
import rasset_rfis_svg from 'src/assets/images/r_fis.svg';
import rasset_rksm_svg from 'src/assets/images/r_ksm.svg';
import rasset_rmatic_svg from 'src/assets/images/r_matic.svg';
import config from 'src/config/index';
import { getRtokenPriceList } from 'src/features/bridgeClice';
import CommonClice from 'src/features/commonClice';
import { getAssetBalanceAll } from 'src/features/ETHClice';
import { getUnbondCommission as fis_getUnbondCommission, rTokenRate as fis_rTokenRate } from 'src/features/FISClice';
import { initMetaMaskAccount } from 'src/features/globalClice';
import {
  getUnbondCommission as atom_getUnbondCommission,
  rTokenRate as atom_rTokenRate,
} from 'src/features/rATOMClice';
import { getUnbondCommission as dot_getUnbondCommission, rTokenRate as dot_rTokenRate } from 'src/features/rDOTClice';
import { getUnbondCommission as ksm_getUnbondCommission, rTokenRate as ksm_rTokenRate } from 'src/features/rKSMClice';
import {
  getUnbondCommission as matic_getUnbondCommission,
  rTokenRate as matic_rTokenRate,
} from 'src/features/rMATICClice';
import { getUnbondCommission as sol_getUnbondCommission, rTokenRate as sol_rTokenRate } from 'src/features/rSOLClice';
import { useRToken } from 'src/hooks/rToken';
import { useMetaMaskAccount } from 'src/hooks/useMetaMaskAccount';
import Button from 'src/shared/components/button/connect_button';
import { RootState } from 'src/store';
import { requestSwitchMetaMaskNetwork } from 'src/util/metaMaskUtil';
import NumberUtil from 'src/util/numberUtil';
import CountAmount from './components/countAmount';
import DataList from './components/list';
import DataItem from './components/list/item';
import { NewDataItem } from './components/NewDataItem';
import './page.scss';

const commonClice = new CommonClice();
export default function Index(props: any) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { metaMaskAddress, metaMaskNetworkId } = useMetaMaskAccount();

  const {
    ksm_ercBalance,
    fis_ercBalance,
    eth_ercBalance,
    rfis_ercBalance,
    dot_ercBalance,
    atom_ercBalance,
    ksmWillAmount,
    fisWillAmount,
    dotWillAmount,
    unitPriceList,
    atomWillAmount,
    matic_ercBalance,
    maticWillAmount,
  } = useSelector((state: any) => {
    return {
      unitPriceList: state.bridgeModule.priceList,
      ksm_ercBalance: state.ETHModule.ercRKSMBalance,
      fis_ercBalance: state.ETHModule.ercFISBalance,
      rfis_ercBalance: state.ETHModule.ercRFISBalance,
      eth_ercBalance: state.ETHModule.ercETHBalance,
      dot_ercBalance: state.ETHModule.ercRDOTBalance,
      atom_ercBalance: state.ETHModule.ercRATOMBalance,
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
      maticWillAmount: commonClice.getWillAmount(
        state.rMATICModule.ratio,
        state.rMATICModule.unbondCommission,
        state.ETHModule.ercRMaticBalance,
      ),
    };
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
    rMaticStakedAmount,
    rMaticStakedAmountShow,
  } = useRToken('erc');

  const totalPrice = useMemo(() => {
    let count: any = '--';
    unitPriceList.forEach((item: any) => {
      if (count === '--') {
        count = 0;
      }
      if (item.symbol === 'rFIS' && rFisStakedAmount && rFisStakedAmount !== '--') {
        count = count + item.price * Number(rFisStakedAmount);
      } else if (item.symbol === 'rKSM' && rKsmStakedAmount && rKsmStakedAmount !== '--') {
        count = count + item.price * Number(rKsmStakedAmount);
      } else if (item.symbol === 'rDOT' && rDotStakedAmount && rDotStakedAmount !== '--') {
        count = count + item.price * Number(rDotStakedAmount);
      } else if (item.symbol === 'rETH' && rEthStakedAmount && rEthStakedAmount !== '--') {
        count = count + item.price * Number(rEthStakedAmount);
      } else if (item.symbol === 'rATOM' && rAtomStakedAmount && rAtomStakedAmount !== '--') {
        count = count + item.price * Number(rAtomStakedAmount);
      } else if (item.symbol === 'rMATIC' && rMaticStakedAmount && rMaticStakedAmount !== '--') {
        count = count + item.price * Number(rMaticStakedAmount);
      }
    });
    return count;
  }, [
    unitPriceList,
    rFisStakedAmount,
    rEthStakedAmount,
    rDotStakedAmount,
    rKsmStakedAmount,
    rAtomStakedAmount,
    rMaticStakedAmount,
  ]);

  const { ethApr, fisApr, bnbApr, dotApr, atomApr, solApr, maticApr, ksmApr } = useSelector((state: RootState) => {
    return {
      ethApr: state.rETHModule.stakerApr,
      fisApr: state.FISModule.stakerApr,
      bnbApr: state.rBNBModule.stakerApr,
      dotApr: state.rDOTModule.stakerApr,
      atomApr: state.rATOMModule.stakerApr,
      solApr: state.rSOLModule.stakerApr,
      maticApr: state.rMATICModule.stakerApr,
      ksmApr: state.rKSMModule.stakerApr,
    };
  });

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
  }, [metaMaskNetworkId, metaMaskAddress]);

  useEffect(() => {
    if (metaMaskNetworkId !== config.ethChainId()) {
      requestSwitchMetaMaskNetwork('Ethereum');
    }
  }, [metaMaskNetworkId]);

  const updateData = () => {
    if (metaMaskAddress) {
      dispatch(getAssetBalanceAll());

      dispatch(ksm_rTokenRate());
      dispatch(fis_rTokenRate());
      dispatch(dot_rTokenRate());
      dispatch(atom_rTokenRate());
      dispatch(sol_rTokenRate());
      dispatch(matic_rTokenRate());
      dispatch(ksm_getUnbondCommission());
      dispatch(fis_getUnbondCommission());
      dispatch(dot_getUnbondCommission());
      dispatch(atom_getUnbondCommission());
      dispatch(sol_getUnbondCommission());
      dispatch(matic_getUnbondCommission());
    }
  };

  useEffect(() => {
    dispatch(getRtokenPriceList());
  }, [dispatch]);

  const toSwap = (tokenSymbol: string) => {
    history.push('/rAsset/swap/erc20/default', {
      rSymbol: tokenSymbol,
    });
  };

  const toSwapBep20 = (tokenSymbol: string) => {
    history.push('/rAsset/swap/erc20/default', {
      rSymbol: tokenSymbol,
    });
  };

  return (
    <div>
      {metaMaskAddress ? (
        <>
          <div>
            <NewDataItem
              rTokenName='FIS'
              icon={rasset_fis_svg}
              rTokenAmount='--'
              source='ERC20'
              myStaked='--'
              apy={fisApr}
              onSwapClick={() => toSwap('FIS')}
            />
            <NewDataItem
              rTokenName='rFIS'
              icon={rasset_rfis_svg}
              rTokenAmount={rfis_ercBalance === '--' ? '--' : NumberUtil.handleFisAmountToFixed(rfis_ercBalance)}
              source='ERC20'
              myStaked={rFisStakedAmountShow}
              apy={fisApr}
              onSwapClick={() => toSwap('rFIS')}
            />
            <NewDataItem
              rTokenName='rETH'
              icon={rasset_reth_svg}
              rTokenAmount={eth_ercBalance === '--' ? '--' : NumberUtil.handleFisAmountToFixed(eth_ercBalance)}
              source='ERC20'
              myStaked={rEthStakedAmountShow}
              apy={ethApr}
              onSwapClick={() => toSwapBep20('rETH')}
            />
            <NewDataItem
              rTokenName='rDOT'
              icon={rasset_rdot_svg}
              rTokenAmount={dot_ercBalance === '--' ? '--' : NumberUtil.handleFisAmountToFixed(dot_ercBalance)}
              source='ERC20'
              myStaked={rDotStakedAmountShow}
              apy={dotApr}
              onSwapClick={() => toSwap('rDOT')}
            />
            <NewDataItem
              rTokenName='rKSM'
              icon={rasset_rksm_svg}
              rTokenAmount={ksm_ercBalance === '--' ? '--' : NumberUtil.handleFisAmountToFixed(ksm_ercBalance)}
              source='ERC20'
              myStaked={rKsmStakedAmountShow}
              apy={dotApr}
              onSwapClick={() => toSwap('rKSM')}
            />
            <NewDataItem
              rTokenName='rATOM'
              icon={rasset_ratom_svg}
              rTokenAmount={atom_ercBalance === '--' ? '--' : NumberUtil.handleFisAmountToFixed(atom_ercBalance)}
              source='ERC20'
              myStaked={rAtomStakedAmountShow}
              apy={atomApr}
              onSwapClick={() => toSwap('rATOM')}
            />
            <NewDataItem
              rTokenName='rMATIC'
              icon={rasset_rmatic_svg}
              rTokenAmount={matic_ercBalance === '--' ? '--' : NumberUtil.handleFisAmountToFixed(matic_ercBalance)}
              source='ERC20'
              myStaked={rMaticStakedAmountShow}
              apy={maticApr}
              onSwapClick={() => toSwap('rMATIC')}
            />
          </div>
          {/* <DataList>
            <DataItem
              disabled={!config.metaMaskNetworkIsGoerliEth(metaMaskNetworkId)}
              rSymbol='FIS'
              icon={rasset_fis_svg}
              fullName='StaFi'
              balance={fis_ercBalance == '--' ? '--' : NumberUtil.handleFisAmountToFixed(fis_ercBalance)}
              willGetBalance={0}
              unit='FIS'
              operationType='erc20'
              tradeList={[{ label: 'Uniswap', url: config.uniswap.fisURL }]}
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
              tradeList={[{ label: 'Uniswap', url: config.uniswap.rfisURL }]}
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
              tradeList={[
                { label: 'Curve', url: config.curve.rethURL },
                { label: 'Uniswap', url: config.uniswap.rethURL },
              ]}
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
              tradeList={[{ label: 'Uniswap', url: config.uniswap.rdotURL }]}
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
              tradeList={[{ label: 'Uniswap', url: config.uniswap.rksmURL }]}
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
              tradeList={[{ label: 'Uniswap', url: config.uniswap.ratomURL }]}
              operationType='erc20'
              onSwapClick={() => toSwap('rATOM')}
            />

            <DataItem
              disabled={!config.metaMaskNetworkIsGoerliEth(metaMaskNetworkId)}
              rSymbol='rMATIC'
              icon={rasset_rmatic_svg}
              fullName='Matic'
              balance={matic_ercBalance == '--' ? '--' : NumberUtil.handleFisAmountToFixed(matic_ercBalance)}
              willGetBalance={maticWillAmount}
              unit='MATIC'
              tradeList={[{ label: 'Quickswap', url: config.quickswap.rmaticURL }]}
              operationType='erc20'
              onSwapClick={() => toSwap('rMATIC')}
            />
          </DataList>{' '} */}
          <CountAmount totalValue={totalPrice} />
        </>
      ) : (
        <div className='rAsset_content'>
          <Button
            icon={metamask}
            onClick={() => {
              dispatch(initMetaMaskAccount());
            }}>
            Connect to Metamask
          </Button>
        </div>
      )}
    </div>
  );
}
