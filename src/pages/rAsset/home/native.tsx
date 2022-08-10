import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import rDOT_svg from 'src/assets/images/rDOT.svg';
import rasset_fis_svg from 'src/assets/images/rFIS.svg';
import rasset_rsol_svg from 'src/assets/images/rSOL.svg';
import rasset_ratom_svg from 'src/assets/images/r_atom.svg';
import rasset_rbnb_svg from 'src/assets/images/r_bnb.svg';
import rasset_rdot_svg from 'src/assets/images/r_dot.svg';
import rasset_reth_svg from 'src/assets/images/r_eth.svg';
import rasset_rfis_svg from 'src/assets/images/r_fis.svg';
import rasset_rksm_svg from 'src/assets/images/r_ksm.svg';
import rasset_rmatic_svg from 'src/assets/images/r_matic.svg';
import { getRtokenPriceList } from 'src/features/bridgeClice';
import CommonClice from 'src/features/commonClice';
import {
  getUnbondCommission as fis_getUnbondCommission,
  query_rBalances_account as fis_query_rBalances_account,
  rTokenRate as fis_rTokenRate,
} from 'src/features/FISClice';
import { connectPolkadotjs, reloadData } from 'src/features/globalClice';
import {
  getUnbondCommission as atom_getUnbondCommission,
  query_rBalances_account as atom_query_rBalances_account,
  rTokenRate as atom_rTokenRate,
} from 'src/features/rATOMClice';
import {
  getUnbondCommission as bnb_getUnbondCommission,
  query_rBalances_account as bnb_query_rBalances_account,
  rTokenRate as bnb_rTokenRate,
} from 'src/features/rBNBClice';
import {
  getUnbondCommission as dot_getUnbondCommission,
  query_rBalances_account as dot_query_rBalances_account,
  rTokenRate as dot_rTokenRate,
} from 'src/features/rDOTClice';
import {
  getNativeRethAmount,
  getUnbondCommission as eth_getUnbondCommission,
  nativerTokenRate,
} from 'src/features/rETHClice';
import { getUnbondCommission, query_rBalances_account, rTokenRate as ksm_rTokenRate } from 'src/features/rKSMClice';
import {
  getUnbondCommission as matic_getUnbondCommission,
  query_rBalances_account as matic_query_rBalances_account,
  rTokenRate as matic_rTokenRate,
} from 'src/features/rMATICClice';
import {
  getUnbondCommission as sol_getUnbondCommission,
  query_rBalances_account as sol_query_rBalances_account,
  rTokenRate as sol_rTokenRate,
} from 'src/features/rSOLClice';
import { useRToken } from 'src/hooks/rToken';
import { Symbol } from 'src/keyring/defaults';
import Button from 'src/shared/components/button/connect_button';
import Modal from 'src/shared/components/modal/connectModal';
import { RootState } from 'src/store';
import NumberUtil from 'src/util/numberUtil';
import styled from 'styled-components';
import Page_FIS from '../../rDOT/selectWallet_rFIS/index';
import CountAmount from './components/countAmount';
import { NewDataItem } from './components/NewDataItem';
import './page.scss';

const commonClice = new CommonClice();

export default function Index(props: any) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { rTokenPlatform } = useParams<any>();
  const [visible, setVisible] = useState(false);

  const [assetList, setAssetList] = useState(['rFIS', 'rETH', 'rDOT', 'rKSM', 'rATOM', 'rSOL', 'rMATIC', 'rBNB']);
  const assetListRef = useRef(assetList);

  useEffect(() => {
    assetListRef.current = assetList;
  });

  const {
    fisAccount,
    fisAddress,
    tokenAmount,
    ksmWillAmount,
    fis_tokenAmount,
    fisWillAmount,
    dot_tokenAmount,
    reth_tokenAmount,
    dotWillAmount,
    unitPriceList,
    atom_tokenAmount,
    atomWillAmount,
    sol_tokenAmount,
    solWillAmount,
    matic_tokenAmount,
    maticWillAmount,
    bnb_tokenAmount,
    bnbWillAmount,
    ethWillAmount,
  } = useSelector((state: any) => {
    return {
      unitPriceList: state.bridgeModule.priceList,
      fisAccount: state.FISModule.fisAccount,
      fisAddress: state.FISModule.fisAccount && state.FISModule.fisAccount.address,
      tokenAmount: state.rKSMModule.tokenAmount,
      ksmWillAmount: commonClice.getWillAmount(
        state.rKSMModule.ratio,
        state.rKSMModule.unbondCommission,
        state.rKSMModule.tokenAmount,
      ),
      fis_tokenAmount: state.FISModule.tokenAmount,
      fisWillAmount: commonClice.getWillAmount(
        state.FISModule.ratio,
        state.FISModule.unbondCommission,
        state.FISModule.tokenAmount,
      ),
      dot_tokenAmount: state.rDOTModule.tokenAmount,
      dotWillAmount: commonClice.getWillAmount(
        state.rDOTModule.ratio,
        state.rDOTModule.unbondCommission,
        state.rDOTModule.tokenAmount,
      ),
      atom_tokenAmount: state.rATOMModule.tokenAmount,
      atomWillAmount: commonClice.getWillAmount(
        state.rATOMModule.ratio,
        state.rATOMModule.unbondCommission,
        state.rATOMModule.tokenAmount,
      ),
      sol_tokenAmount: state.rSOLModule.tokenAmount,
      solWillAmount: commonClice.getWillAmount(
        state.rSOLModule.ratio,
        state.rSOLModule.unbondCommission,
        state.rSOLModule.tokenAmount,
      ),
      matic_tokenAmount: state.rMATICModule.tokenAmount,
      maticWillAmount: commonClice.getWillAmount(
        state.rMATICModule.ratio,
        state.rMATICModule.unbondCommission,
        state.rMATICModule.tokenAmount,
      ),
      bnb_tokenAmount: state.rBNBModule.tokenAmount,
      bnbWillAmount: commonClice.getWillAmount(
        state.rBNBModule.ratio,
        state.rBNBModule.unbondCommission,
        state.rBNBModule.tokenAmount,
      ),
      reth_tokenAmount: state.rETHModule.nativeTokenAmount,
      ethWillAmount: commonClice.getWillAmount(
        state.rETHModule.nativerTokenRate,
        state.rETHModule.unbondCommission,
        state.rETHModule.nativeTokenAmount,
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
    rSolStakedAmount,
    rSolStakedAmountShow,
    rMaticStakedAmount,
    rMaticStakedAmountShow,
    rBnbStakedAmount,
    rBnbStakedAmountShow,
  } = useRToken('native');

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
      } else if (item.symbol === 'rSOL' && rSolStakedAmount && rSolStakedAmount !== '--') {
        count = count + item.price * Number(rSolStakedAmount);
      } else if (item.symbol === 'rMATIC' && rMaticStakedAmount && rMaticStakedAmount !== '--') {
        count = count + item.price * Number(rMaticStakedAmount);
      } else if (item.symbol === 'rBNB' && rBnbStakedAmount && rBnbStakedAmount !== '--') {
        count = count + item.price * Number(rBnbStakedAmount);
      } else if (item.symbol === 'rETH' && rEthStakedAmount && rEthStakedAmount !== '--') {
        count = count + item.price * Number(rEthStakedAmount);
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
    rSolStakedAmount,
    rMaticStakedAmount,
    rBnbStakedAmount,
  ]);

  useEffect(() => {
    if (fisAddress) {
      dispatch(getRtokenPriceList());
      dispatch(reloadData(Symbol.Fis));
    }
  }, [dispatch, fisAddress]);

  useEffect(() => {
    if (fisAccount) {
      dispatch(reloadData(Symbol.Fis));
      dispatch(fis_query_rBalances_account());
      dispatch(dot_query_rBalances_account());
      dispatch(query_rBalances_account());
      dispatch(atom_query_rBalances_account());
      dispatch(sol_query_rBalances_account());
      dispatch(matic_query_rBalances_account());
      dispatch(bnb_query_rBalances_account());
      dispatch(getNativeRethAmount());
      dispatch(ksm_rTokenRate());
      dispatch(fis_rTokenRate());
      dispatch(dot_rTokenRate());
      dispatch(atom_rTokenRate());
      dispatch(sol_rTokenRate());
      dispatch(matic_rTokenRate());
      dispatch(bnb_rTokenRate());
      dispatch(nativerTokenRate());
      dispatch(getUnbondCommission());
      dispatch(fis_getUnbondCommission());
      dispatch(dot_getUnbondCommission());
      dispatch(atom_getUnbondCommission());
      dispatch(sol_getUnbondCommission());
      dispatch(matic_getUnbondCommission());
      dispatch(bnb_getUnbondCommission());
      dispatch(eth_getUnbondCommission());
    }
  }, [fisAccount && fisAccount.address, dispatch]);

  // <NewDataItem
  //               rTokenName={name}
  //               icon={rasset_rfis_svg}
  //               rTokenAmount={fis_tokenAmount === '--' ? '--' : NumberUtil.handleFisAmountToFixed(fis_tokenAmount)}
  //               source='Native'
  //               myStaked={rFisStakedAmountShow}
  //               apy={fisApr}
  //               onSwapClick={() => {
  //                 history.push(`/rAsset/swap/rFIS`, {});
  //               }}
  //             />

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
    if (name === 'rSOL') {
      return rasset_rsol_svg;
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
        amount = fis_tokenAmount;
      }
      if (name === 'rETH') {
        amount = reth_tokenAmount;
      }
      if (name === 'rDOT') {
        amount = dot_tokenAmount;
      }
      if (name === 'rKSM') {
        amount = tokenAmount;
      }
      if (name === 'rATOM') {
        amount = atom_tokenAmount;
      }
      if (name === 'rSOL') {
        amount = sol_tokenAmount;
      }
      if (name === 'rMATIC') {
        amount = matic_tokenAmount;
      }
      if (name === 'rBNB') {
        amount = bnb_tokenAmount;
      }
      return amount === '--' ? '--' : NumberUtil.handleFisAmountToFixed(amount);
    },
    [
      fis_tokenAmount,
      reth_tokenAmount,
      dot_tokenAmount,
      tokenAmount,
      atom_tokenAmount,
      sol_tokenAmount,
      matic_tokenAmount,
      bnb_tokenAmount,
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
    if (name === 'rSOL') {
      return rSolStakedAmountShow;
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
    if (name === 'rSOL') {
      return solApr;
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
      !isNaN(Number(fis_tokenAmount)) &&
      !isNaN(Number(reth_tokenAmount)) &&
      !isNaN(Number(dot_tokenAmount)) &&
      !isNaN(Number(tokenAmount)) &&
      !isNaN(Number(atom_tokenAmount)) &&
      !isNaN(Number(sol_tokenAmount)) &&
      !isNaN(Number(matic_tokenAmount)) &&
      !isNaN(Number(bnb_tokenAmount))
    ) {
      const temp = assetListRef.current;
      temp.sort((one, two) => {
        return Number(getrTokenAmount(two)) - Number(getrTokenAmount(one));
      });
      setAssetList([...temp]);
    }
  }, [
    getrTokenAmount,
    fis_tokenAmount,
    reth_tokenAmount,
    dot_tokenAmount,
    tokenAmount,
    atom_tokenAmount,
    sol_tokenAmount,
    matic_tokenAmount,
    bnb_tokenAmount,
  ]);

  return (
    <div>
      {fisAccount ? (
        <>
          <ListContainer>
            {/* <NewDataItem
              rTokenName='FIS'
              icon={rasset_fis_svg}
              rTokenAmount='--'
              source='Native'
              myStaked='--'
              apy={fisApr}
              onSwapClick={() => {
                history.push(`/rAsset/swap/native/default`, {
                  rSymbol: 'FIS',
                });
              }}
            /> */}

            {assetList.map((name) => (
              <NewDataItem
                key={name}
                rTokenName={name}
                icon={getIcon(name)}
                rTokenAmount={getrTokenAmount(name)}
                source='Native'
                myStaked={getMyStaked(name)}
                apy={getApy(name)}
                onSwapClick={() => {
                  history.push(`/rAsset/swap/${name}?first=native`, {});
                }}
              />
            ))}

            {/* <NewDataItem
              rTokenName='rFIS'
              icon={rasset_rfis_svg}
              rTokenAmount={fis_tokenAmount === '--' ? '--' : NumberUtil.handleFisAmountToFixed(fis_tokenAmount)}
              source='Native'
              myStaked={rFisStakedAmountShow}
              apy={fisApr}
              onSwapClick={() => {
                history.push(`/rAsset/swap/rFIS`, {});
              }}
            />
            <NewDataItem
              rTokenName='rETH'
              icon={rasset_reth_svg}
              rTokenAmount={reth_tokenAmount === '--' ? '--' : NumberUtil.handleFisAmountToFixed(reth_tokenAmount)}
              source='Native'
              myStaked={rEthStakedAmountShow}
              apy={ethApr}
              onSwapClick={() => {
                history.push(`/rAsset/swap/rETH`, {});
              }}
            />
            <NewDataItem
              rTokenName='rDOT'
              icon={rasset_rdot_svg}
              rTokenAmount={dot_tokenAmount === '--' ? '--' : NumberUtil.handleFisAmountToFixed(dot_tokenAmount)}
              source='Native'
              myStaked={rDotStakedAmountShow}
              apy={dotApr}
              onSwapClick={() => {
                history.push(`/rAsset/swap/rDOT`, {});
              }}
            />
            <NewDataItem
              rTokenName='rKSM'
              icon={rasset_rksm_svg}
              rTokenAmount={tokenAmount === '--' ? '--' : NumberUtil.handleFisAmountToFixed(tokenAmount)}
              source='Native'
              myStaked={rKsmStakedAmountShow}
              apy={ksmApr}
              onSwapClick={() => {
                history.push(`/rAsset/swap/rKSM`, {});
              }}
            />
            <NewDataItem
              rTokenName='rATOM'
              icon={rasset_ratom_svg}
              rTokenAmount={atom_tokenAmount === '--' ? '--' : NumberUtil.handleFisAmountToFixed(atom_tokenAmount)}
              source='Native'
              myStaked={rAtomStakedAmountShow}
              apy={atomApr}
              onSwapClick={() => {
                history.push(`/rAsset/swap/rATOM`, {});
              }}
            />
            <NewDataItem
              rTokenName='rSOL'
              icon={rasset_rsol_svg}
              rTokenAmount={sol_tokenAmount === '--' ? '--' : NumberUtil.handleFisAmountToFixed(sol_tokenAmount)}
              source='Native'
              myStaked={rSolStakedAmountShow}
              apy={solApr}
              onSwapClick={() => {
                history.push(`/rAsset/swap/rSOL`, {});
              }}
            />
            <NewDataItem
              rTokenName='rMATIC'
              icon={rasset_rmatic_svg}
              rTokenAmount={matic_tokenAmount === '--' ? '--' : NumberUtil.handleFisAmountToFixed(matic_tokenAmount)}
              source='Native'
              myStaked={rMaticStakedAmountShow}
              apy={maticApr}
              onSwapClick={() => {
                history.push(`/rAsset/swap/rMATIC`, {});
              }}
            />
            <NewDataItem
              rTokenName='rBNB'
              icon={rasset_rbnb_svg}
              rTokenAmount={bnb_tokenAmount === '--' ? '--' : NumberUtil.handleFisAmountToFixed(bnb_tokenAmount)}
              source='Native'
              myStaked={rBnbStakedAmountShow}
              apy={bnbApr}
              onSwapClick={() => {
                history.push(`/rAsset/swap/rBNB`, {});
              }}
            /> */}
          </ListContainer>
          {/* <DataList>
            <DataItem
              rSymbol='FIS'
              icon={rasset_fis_svg}
              fullName='StaFi'
              balance={
                fisAccount && fisAccount.balance != '--' ? NumberUtil.handleFisAmountToFixed(fisAccount.balance) : '--'
              }
              willGetBalance={fisWillAmount}
              unit='FIS'
              operationType='native'
              tradeList={[{ label: 'Uniswap', url: config.uniswap.fisURL }]}
              onSwapClick={() => {
                history.push(`/rAsset/swap/native/default`, {
                  rSymbol: 'FIS',
                });
              }}
            />

            <DataItem
              rSymbol='rFIS'
              icon={rasset_rfis_svg}
              fullName='StaFi'
              balance={fis_tokenAmount == '--' ? '--' : NumberUtil.handleFisAmountToFixed(fis_tokenAmount)}
              willGetBalance={fisWillAmount}
              unit='FIS'
              operationType='native'
              tradeList={[{ label: 'Uniswap', url: config.uniswap.rfisURL }]}
              onSwapClick={() => {
                history.push(`/rAsset/swap/native/default`, {
                  rSymbol: 'rFIS',
                });
              }}
            />

            <DataItem
              rSymbol='rETH'
              icon={rasset_reth_svg}
              fullName='Ethereum'
              balance={reth_tokenAmount === '--' ? '--' : NumberUtil.handleFisAmountToFixed(reth_tokenAmount)}
              willGetBalance={'0.000000'}
              unit='ETH'
              operationType='native'
              onSwapClick={() => {
                history.push(`/rAsset/swap/native/erc20`, {
                  rSymbol: 'rETH',
                });
              }}
            />

            <DataItem
              rSymbol='rDOT'
              icon={rasset_rdot_svg}
              fullName='Polkadot'
              balance={dot_tokenAmount == '--' ? '--' : NumberUtil.handleFisAmountToFixed(dot_tokenAmount)}
              willGetBalance={dotWillAmount}
              unit='DOT'
              operationType='native'
              tradeList={[
                { label: 'Uniswap', url: config.uniswap.rdotURL },
                { label: 'Pancake', url: config.pancake.rdotURL },
              ]}
              onSwapClick={() => {
                history.push(`/rAsset/swap/native/default`, {
                  rSymbol: 'rDOT',
                });
              }}
            />

            <DataItem
              rSymbol='rKSM'
              icon={rasset_rksm_svg}
              fullName='Kusama'
              balance={tokenAmount == '--' ? '--' : NumberUtil.handleFisAmountToFixed(tokenAmount)}
              willGetBalance={ksmWillAmount}
              unit='KSM'
              operationType='native'
              tradeList={[{ label: 'Uniswap', url: config.uniswap.rksmURL }]}
              onSwapClick={() => {
                history.push(`/rAsset/swap/native/default`, {
                  rSymbol: 'rKSM',
                });
              }}
            />

            <DataItem
              rSymbol='rATOM'
              icon={rasset_ratom_svg}
              fullName='Cosmos'
              balance={atom_tokenAmount == '--' ? '--' : NumberUtil.handleFisAmountToFixed(atom_tokenAmount)}
              willGetBalance={atomWillAmount}
              unit='ATOM'
              operationType='native'
              tradeList={[{ label: 'Uniswap', url: config.uniswap.ratomURL }]}
              onSwapClick={() => {
                history.push(`/rAsset/swap/native/default`, {
                  rSymbol: 'rATOM',
                });
              }}
            />
            <DataItem
              rSymbol='rSOL'
              icon={rasset_rsol_svg}
              fullName='Solana'
              balance={sol_tokenAmount == '--' ? '--' : NumberUtil.handleFisAmountToFixed(sol_tokenAmount)}
              willGetBalance={solWillAmount}
              unit='SOL'
              operationType='native'
              // tradeList={[{ label: 'Uniswap', url: config.uniswap.rsolURL }]}
              onSwapClick={() => {
                history.push(`/rAsset/swap/native/default`, {
                  rSymbol: 'rSOL',
                });
              }}
            />

            <DataItem
              rSymbol='rMATIC'
              icon={rasset_rmatic_svg}
              fullName='Matic'
              balance={matic_tokenAmount == '--' ? '--' : NumberUtil.handleFisAmountToFixed(matic_tokenAmount)}
              willGetBalance={maticWillAmount}
              unit='MATIC'
              operationType='native'
              tradeList={[{ label: 'Quickswap', url: config.quickswap.rmaticURL }]}
              onSwapClick={() => {
                history.push(`/rAsset/swap/native/default`, {
                  rSymbol: 'rMATIC',
                });
              }}
            />

            <DataItem
              rSymbol='rBNB'
              icon={rasset_rbnb_svg}
              fullName='BSC'
              balance={bnb_tokenAmount == '--' ? '--' : NumberUtil.handleFisAmountToFixed(bnb_tokenAmount)}
              willGetBalance={bnbWillAmount}
              unit='BNB'
              operationType='native'
              tradeList={[{ label: 'Pancake', url: config.pancake.rbnbURL }]}
              onSwapClick={() => {
                history.push('/rAsset/swap/native/default', {
                  rSymbol: 'rBNB',
                });
              }}
            />
          </DataList> */}
          <CountAmount totalValue={totalPrice} />{' '}
        </>
      ) : (
        <div className='rAsset_content' style={{ flexDirection: 'column' }}>
          <Button
            icon={rDOT_svg}
            onClick={() => {
              dispatch(connectPolkadotjs(Symbol.Fis));
              setVisible(true);
            }}>
            Connect to Polkadotjs extension
          </Button>

          <div
            style={{
              color: '#b0b0b0',
              fontSize: '10px',
              lineHeight: '14px',
              marginTop: '10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <div>PolkadotJS extention DOES NOT support Ledger. </div>
            <div>DO NOT use ledger when you are signing</div>
          </div>
        </div>
      )}

      <Modal visible={visible}>
        <Page_FIS
          location={{}}
          type='header'
          onClose={() => {
            setVisible(false);
          }}
        />
      </Modal>
    </div>
  );
}

const ListContainer = styled.div`
  /* height: 420px;
  overflow: auto; */
`;
