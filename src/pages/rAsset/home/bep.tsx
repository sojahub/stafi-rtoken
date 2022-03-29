import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import metamask from 'src/assets/images/metamask.png';
import rasset_ratom_svg from 'src/assets/images/r_atom.svg';
import rasset_rbnb_svg from 'src/assets/images/r_bnb.svg';
import rasset_rdot_svg from 'src/assets/images/r_dot.svg';
import rasset_reth_svg from 'src/assets/images/r_eth.svg';
import rasset_rfis_svg from 'src/assets/images/r_fis.svg';
import rasset_rksm_svg from 'src/assets/images/r_ksm.svg';
import rasset_rmatic_svg from 'src/assets/images/r_matic.svg';
import config from 'src/config/index';
import { getRtokenPriceList } from 'src/features/bridgeClice';
import { getAssetBalanceAll } from 'src/features/BSCClice';
import CommonClice from 'src/features/commonClice';
import { getUnbondCommission as fis_getUnbondCommission, rTokenRate as fis_rTokenRate } from 'src/features/FISClice';
import { initMetaMaskAccount } from 'src/features/globalClice';
import {
  getUnbondCommission as atom_getUnbondCommission,
  rTokenRate as atom_rTokenRate,
} from 'src/features/rATOMClice';
import { getUnbondCommission as bnb_getUnbondCommission, rTokenRate as bnb_rTokenRate } from 'src/features/rBNBClice';
import { getUnbondCommission as dot_getUnbondCommission, rTokenRate as dot_rTokenRate } from 'src/features/rDOTClice';
import { getUnbondCommission as ksm_getUnbondCommission, rTokenRate as ksm_rTokenRate } from 'src/features/rKSMClice';
import {
  getUnbondCommission as matic_getUnbondCommission,
  rTokenRate as matic_rTokenRate,
} from 'src/features/rMATICClice';
import { getUnbondCommission as sol_getUnbondCommission } from 'src/features/rSOLClice';
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

  const [assetList, setAssetList] = useState(['rFIS', 'rETH', 'rDOT', 'rKSM', 'rATOM', 'rMATIC', 'rBNB']);
  const assetListRef = useRef(assetList);

  useEffect(() => {
    assetListRef.current = assetList;
  });

  const {
    ksm_bepBalance,
    rfis_bepBalance,
    dot_bepBalance,
    atom_bepBalance,
    rmatic_bepBalance,
    reth_bepBalance,
    rbnb_bepBalance,
    ksmWillAmount,
    fisWillAmount,
    dotWillAmount,
    maticWillAmount,
    atomWillAmount,
    bnbWillAmount,
    unitPriceList,
  } = useSelector((state: any) => {
    return {
      unitPriceList: state.bridgeModule.priceList,
      ksm_bepBalance: state.BSCModule.bepRKSMBalance,
      fis_bepBalance: state.BSCModule.bepFISBalance,
      rfis_bepBalance: state.BSCModule.bepRFISBalance,
      dot_bepBalance: state.BSCModule.bepRDOTBalance,
      atom_bepBalance: state.BSCModule.bepRATOMBalance,
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
    rBnbStakedAmount,
    rBnbStakedAmountShow,
  } = useRToken('bep');

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
      } else if (item.symbol === 'rATOM' && rAtomStakedAmount && rAtomStakedAmount !== '--') {
        count = count + item.price * Number(rAtomStakedAmount);
      } else if (item.symbol === 'rETH' && rEthStakedAmount && rEthStakedAmount !== '--') {
        count = count + item.price * Number(rEthStakedAmount);
      } else if (item.symbol === 'rBNB' && rBnbStakedAmount && rBnbStakedAmount !== '--') {
        count = count + item.price * Number(rBnbStakedAmount);
      } else if (item.symbol === 'rMATIC' && rMaticStakedAmount && rMaticStakedAmount !== '--') {
        count = count + item.price * Number(rMaticStakedAmount);
      }
    });
    return count;
  }, [
    unitPriceList,
    rFisStakedAmount,
    rDotStakedAmount,
    rEthStakedAmount,
    rKsmStakedAmount,
    rMaticStakedAmount,
    rAtomStakedAmount,
    rBnbStakedAmount,
  ]);

  const { ethApr, fisApr, bnbApr, dotApr, atomApr, maticApr, ksmApr } = useSelector((state: RootState) => {
    return {
      ethApr: state.rETHModule.stakerApr,
      fisApr: state.FISModule.stakerApr,
      bnbApr: state.rBNBModule.stakerApr,
      dotApr: state.rDOTModule.stakerApr,
      atomApr: state.rATOMModule.stakerApr,
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
    dispatch(getRtokenPriceList());
  }, []);

  useEffect(() => {
    if (metaMaskNetworkId !== config.bscChainId()) {
      requestSwitchMetaMaskNetwork('BSC');
    }
  }, [metaMaskNetworkId]);

  const updateData = () => {
    if (metaMaskAddress) {
      dispatch(getAssetBalanceAll());

      dispatch(ksm_rTokenRate());
      dispatch(fis_rTokenRate());
      dispatch(dot_rTokenRate());
      dispatch(atom_rTokenRate());
      dispatch(matic_rTokenRate());
      dispatch(bnb_rTokenRate());
      dispatch(ksm_getUnbondCommission());
      dispatch(fis_getUnbondCommission());
      dispatch(dot_getUnbondCommission());
      dispatch(atom_getUnbondCommission());
      dispatch(sol_getUnbondCommission());
      dispatch(matic_getUnbondCommission());
      dispatch(bnb_getUnbondCommission());
    }
  };

  const getIcon = (name) => {
    if (name === 'rFIS') {
      return rasset_rfis_svg;
    }
    if (name === 'rETH') {
      return rasset_reth_svg;
    }
    if (name === 'rDOT') {
      return rasset_rdot_svg;
    }
    if (name === 'rKSM') {
      return rasset_rksm_svg;
    }
    if (name === 'rATOM') {
      return rasset_ratom_svg;
    }
    if (name === 'rMATIC') {
      return rasset_rmatic_svg;
    }
    if (name === 'rBNB') {
      return rasset_rbnb_svg;
    }
  };

  const getrTokenAmount = useCallback(
    (name) => {
      let amount;
      if (name === 'rFIS') {
        amount = rfis_bepBalance;
      }
      if (name === 'rETH') {
        amount = reth_bepBalance;
      }
      if (name === 'rDOT') {
        amount = dot_bepBalance;
      }
      if (name === 'rKSM') {
        amount = ksm_bepBalance;
      }
      if (name === 'rATOM') {
        amount = atom_bepBalance;
      }
      if (name === 'rMATIC') {
        amount = rmatic_bepBalance;
      }
      if (name === 'rBNB') {
        amount = rbnb_bepBalance;
      }
      return amount === '--' ? '--' : NumberUtil.handleFisAmountToFixed(amount);
    },
    [
      rfis_bepBalance,
      reth_bepBalance,
      dot_bepBalance,
      ksm_bepBalance,
      atom_bepBalance,
      rmatic_bepBalance,
      rbnb_bepBalance,
    ],
  );

  const getMyStaked = (name) => {
    if (name === 'rFIS') {
      return rFisStakedAmountShow;
    }
    if (name === 'rETH') {
      return rEthStakedAmountShow;
    }
    if (name === 'rDOT') {
      return rDotStakedAmountShow;
    }
    if (name === 'rKSM') {
      return rKsmStakedAmountShow;
    }
    if (name === 'rATOM') {
      return rAtomStakedAmountShow;
    }
    if (name === 'rMATIC') {
      return rMaticStakedAmountShow;
    }
    if (name === 'rBNB') {
      return rBnbStakedAmountShow;
    }
  };

  const getApy = (name) => {
    if (name === 'rFIS') {
      return fisApr;
    }
    if (name === 'rETH') {
      return ethApr;
    }
    if (name === 'rDOT') {
      return dotApr;
    }
    if (name === 'rKSM') {
      return ksmApr;
    }
    if (name === 'rATOM') {
      return atomApr;
    }
    if (name === 'rMATIC') {
      return maticApr;
    }
    if (name === 'rBNB') {
      return bnbApr;
    }
  };

  useEffect(() => {
    if (
      !isNaN(Number(rfis_bepBalance)) &&
      !isNaN(Number(reth_bepBalance)) &&
      !isNaN(Number(dot_bepBalance)) &&
      !isNaN(Number(ksm_bepBalance)) &&
      !isNaN(Number(atom_bepBalance)) &&
      !isNaN(Number(rmatic_bepBalance)) &&
      !isNaN(Number(rbnb_bepBalance))
    ) {
      const temp = assetListRef.current;
      temp.sort((one, two) => {
        return Number(getrTokenAmount(two)) - Number(getrTokenAmount(one));
      });
      setAssetList([...temp]);
    }
  }, [
    getrTokenAmount,
    rfis_bepBalance,
    reth_bepBalance,
    dot_bepBalance,
    ksm_bepBalance,
    atom_bepBalance,
    rmatic_bepBalance,
    rbnb_bepBalance,
  ]);

  return (
    <div>
      {metaMaskAddress ? (
        <>
          <div>
            {assetList.map((name) => (
              <NewDataItem
                rTokenName={name}
                icon={getIcon(name)}
                rTokenAmount={getrTokenAmount(name)}
                source='ERC20'
                myStaked={getMyStaked(name)}
                apy={getApy(name)}
                onSwapClick={() => {
                  history.push(`/rAsset/swap/${name}?first=bep20`, {});
                }}
              />
            ))}
            {/* <NewDataItem
              rTokenName='rFIS'
              icon={rasset_rfis_svg}
              rTokenAmount={rfis_bepBalance === '--' ? '--' : NumberUtil.handleFisAmountToFixed(rfis_bepBalance)}
              source='BEP20'
              myStaked={rFisStakedAmountShow}
              apy={fisApr}
              onSwapClick={() => toSwap('rFIS')}
            />
            <NewDataItem
              rTokenName='rETH'
              icon={rasset_reth_svg}
              rTokenAmount={reth_bepBalance === '--' ? '--' : NumberUtil.handleFisAmountToFixed(reth_bepBalance)}
              source='BEP20'
              myStaked={rEthStakedAmountShow}
              apy={ethApr}
              onSwapClick={() => toSwapErc20('rFIS')}
            />
            <NewDataItem
              rTokenName='rDOT'
              icon={rasset_rdot_svg}
              rTokenAmount={dot_bepBalance === '--' ? '--' : NumberUtil.handleFisAmountToFixed(dot_bepBalance)}
              source='BEP20'
              myStaked={rDotStakedAmountShow}
              apy={dotApr}
              onSwapClick={() => toSwap('rDOT')}
            />
            <NewDataItem
              rTokenName='rKSM'
              icon={rasset_rksm_svg}
              rTokenAmount={ksm_bepBalance === '--' ? '--' : NumberUtil.handleFisAmountToFixed(ksm_bepBalance)}
              source='BEP20'
              myStaked={rKsmStakedAmountShow}
              apy={dotApr}
              onSwapClick={() => toSwap('rKSM')}
            />
            <NewDataItem
              rTokenName='rATOM'
              icon={rasset_ratom_svg}
              rTokenAmount={atom_bepBalance === '--' ? '--' : NumberUtil.handleFisAmountToFixed(atom_bepBalance)}
              source='BEP20'
              myStaked={rAtomStakedAmountShow}
              apy={atomApr}
              onSwapClick={() => toSwap('rATOM')}
            />
            <NewDataItem
              rTokenName='rMATIC'
              icon={rasset_rmatic_svg}
              rTokenAmount={rmatic_bepBalance == '--' ? '--' : NumberUtil.handleFisAmountToFixed(rmatic_bepBalance)}
              source='BEP20'
              myStaked={rMaticStakedAmountShow}
              apy={maticApr}
              onSwapClick={() => toSwap('rMATIC')}
            />
            <NewDataItem
              rTokenName='rBNB'
              icon={rasset_rmatic_svg}
              rTokenAmount={rbnb_bepBalance == '--' ? '--' : NumberUtil.handleFisAmountToFixed(rbnb_bepBalance)}
              source='BEP20'
              myStaked={rBnbStakedAmountShow}
              apy={bnbApr}
              onSwapClick={() => toSwap('rBNB')}
            /> */}
          </div>
          {/* <DataList>
            <DataItem
              disabled={!config.metaMaskNetworkIsBsc(metaMaskNetworkId)}
              rSymbol='rFIS'
              icon={rasset_rfis_svg}
              fullName='StaFi'
              balance={rfis_bepBalance == '--' ? '--' : NumberUtil.handleFisAmountToFixed(rfis_bepBalance)}
              willGetBalance={fisWillAmount}
              unit='FIS'
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
              operationType='bep20'
              tradeList={[{ label: 'Pancake', url: config.pancake.rdotURL }]}
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
              operationType='bep20'
              onSwapClick={() => toSwap('rATOM')}
            />

            <DataItem
              disabled={!config.metaMaskNetworkIsBsc(metaMaskNetworkId)}
              rSymbol='rMATIC'
              icon={rasset_rmatic_svg}
              fullName='Matic'
              balance={rmatic_bepBalance == '--' ? '--' : NumberUtil.handleFisAmountToFixed(rmatic_bepBalance)}
              willGetBalance={maticWillAmount}
              unit='MATIC'
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
              operationType='bep20'
              tradeList={[{ label: 'Pancake', url: config.pancake.rbnbURL }]}
              onSwapClick={() => toSwap('rBNB')}
            />
          </DataList> */}
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
