import qs from 'querystring';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import notice from 'src/assets/images/notice.svg';
import report_icon from 'src/assets/images/report_icon.svg';
import wrong_network from 'src/assets/images/wrong_network.svg';
import config from 'src/config/index';
import { balancesAll } from 'src/features/FISClice';
import {
  connectAtomjs,
  connectPolkadot,
  connectPolkadotjs,
  connectPolkadot_ksm,
  connectSoljs,
  initMetaMaskAccount,
} from 'src/features/globalClice';
import { noticeStatus } from 'src/features/noticeClice';
import {
  query_rBalances_account as dotquery_rBalances_account,
  reloadData as dotReloadData,
} from 'src/features/rDOTClice';
import { get_eth_getBalance } from 'src/features/rETHClice';
import {
  query_rBalances_account as ksmquery_rBalances_account,
  reloadData as ksmReloadData,
} from 'src/features/rKSMClice';
import { useMetaMaskAccount } from 'src/hooks/useMetaMaskAccount';
import { rSymbol, Symbol } from 'src/keyring/defaults';
import Modal from 'src/shared/components/modal/connectModal';
import { getLpPlatformFromUrl, getMetaMaskTokenSymbol, liquidityPlatformMatchMetaMask } from 'src/util/metaMaskUtil';
import StringUtil from 'src/util/stringUtil';
import Tool from 'src/util/toolUtil';
import Page from '../../pages/rDOT/selectWallet/index';
import PageFis from '../../pages/rDOT/selectWallet_rFIS/index';
import PageRFis from '../../pages/rFIS/selectWallet_rFIS/index';
import PageKsm from '../../pages/rKSM/selectWallet/index';
import './index.scss';
import Popover from './popover';

type Props = {
  route: any;
  history: any;
};

interface HeaderConfig {
  showFisAccount?: boolean;
  showMetaMaskAccount?: boolean;
  showMaticAccount?: boolean;
  showSolAccount?: boolean;
  showAtomAccount?: boolean;
  showKsmAccount?: boolean;
  showDotAccount?: boolean;
  type?: string;
  wrongNetwork?: boolean;
}

export default function Index(props: Props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { metaMaskAddress, metaMaskBalance, metaMaskNetworkId } = useMetaMaskAccount();
  const [visible, setVisible] = useState(false);
  const [modalType, setModalType] = useState<any>();
  const [noticePopoverVisible, setNoticePopoverVisible] = useState(false);

  const maticBalance = useSelector((state: any) => {
    return state.rMATICModule.transferrableAmountShow;
  });

  const { fisAccount, dotAccount, ksmAccount, atomAccount } = useSelector((state: any) => {
    return {
      fisAccount: state.FISModule.fisAccount,
      dotAccount: state.rDOTModule.dotAccount,
      ksmAccount: state.rKSMModule.ksmAccount,
      atomAccount: state.rATOMModule.atomAccount,
    };
  });

  const { solAddress, solTransferrableAmount } = useSelector((state: any) => {
    return {
      solAddress: state.rSOLModule.solAddress,
      solTransferrableAmount: state.rSOLModule.transferrableAmountShow,
    };
  });

  const metaMaskAccount = useMemo(() => {
    return {
      address: metaMaskAddress,
      balance: metaMaskBalance,
    };
  }, [metaMaskAddress, metaMaskBalance]);

  const maticAccount = useMemo(() => {
    return {
      address: metaMaskAddress,
      balance: maticBalance,
    };
  }, [metaMaskAddress, maticBalance]);

  const solAccount = useMemo(() => {
    return {
      address: solAddress,
      balance: solTransferrableAmount,
    };
  }, [solAddress, solTransferrableAmount]);

  let platform = 'Native';
  if (history.location.search) {
    platform = qs.parse(history.location.search.slice(1)).platform as string;
  }

  const account: HeaderConfig = useSelector((state: any) => {
    if (location.pathname.includes('/rAsset')) {
      if (location.pathname.includes('/rAsset/home/native')) {
        return {
          showFisAccount: true,
        };
      }

      if (location.pathname.includes('/rAsset/home/erc')) {
        return {
          showMetaMaskAccount: true,
          wrongNetwork: !config.metaMaskNetworkIsGoerliEth(metaMaskNetworkId),
        };
      }
      if (location.pathname.includes('/rAsset/home/bep')) {
        return {
          showMetaMaskAccount: true,
          wrongNetwork: !config.metaMaskNetworkIsBsc(metaMaskNetworkId),
        };
      }
      if (location.pathname.includes('/rAsset/home/spl')) {
        return {
          showSolAccount: true,
        };
      }

      if (location.pathname.includes('/rAsset/swap')) {
        if (location.pathname.includes('/rAsset/swap/native')) {
          return {
            showFisAccount: true,
          };
        }

        if (location.pathname.includes('/rAsset/swap/erc20')) {
          return {
            showMetaMaskAccount: true,
            wrongNetwork: !config.metaMaskNetworkIsGoerliEth(metaMaskNetworkId),
          };
        }

        if (location.pathname.includes('/rAsset/swap/bep20')) {
          return {
            showMetaMaskAccount: true,
            wrongNetwork: !config.metaMaskNetworkIsBsc(metaMaskNetworkId),
          };
        }

        if (location.pathname.includes('/rAsset/swap/spl')) {
          return {
            showSolAccount: true,
          };
        }

        return {};
      }
    }

    if (location.pathname.includes('/rSwap')) {
      return {
        showFisAccount: true,
      };
    }

    if (location.pathname.includes('/rPool/mint')) {
      return {
        showFisAccount: true,
      };
    }

    if (location.pathname.includes('/rPool/lp')) {
      return {
        showMetaMaskAccount: true,
        wrongNetwork: !liquidityPlatformMatchMetaMask(metaMaskNetworkId, getLpPlatformFromUrl(location.pathname)),
        type: 'rPool/lp',
      };
    }

    if (location.pathname.includes('/rETH')) {
      if (location.pathname.includes('/rETH/staker/info') || location.pathname.includes('/rETH/staker/reward')) {
        return {
          showMetaMaskAccount: true,
          wrongNetwork:
            (platform === 'ERC20' && !config.metaMaskNetworkIsGoerliEth(metaMaskNetworkId)) ||
            (platform === 'BEP20' && !config.metaMaskNetworkIsBsc(metaMaskNetworkId)),
        };
      }
      return {
        showMetaMaskAccount: true,
        wrongNetwork: !config.metaMaskNetworkIsGoerliEth(metaMaskNetworkId),
      };
    }

    if (location.pathname.includes('/rBNB')) {
      if (location.pathname.includes('rBNB/staker/info') || location.pathname.includes('rBNB/staker/reward')) {
        return {
          showFisAccount: true,
          showMetaMaskAccount: platform !== 'Native',
          wrongNetwork: platform === 'BEP20' && !config.metaMaskNetworkIsBsc(metaMaskNetworkId),
        };
      }
      return {
        showFisAccount: true,
        showMetaMaskAccount: true,
        wrongNetwork: !config.metaMaskNetworkIsBsc(metaMaskNetworkId),
      };
    }

    if (location.pathname.includes('/rFIS')) {
      if (location.pathname.includes('/rFIS/staker/info') || location.pathname.includes('/rFIS/staker/reward')) {
        return {
          showFisAccount: true,
          showMetaMaskAccount: platform !== 'Native',
          wrongNetwork:
            (platform === 'ERC20' && !config.metaMaskNetworkIsGoerliEth(metaMaskNetworkId)) ||
            (platform === 'BEP20' && !config.metaMaskNetworkIsBsc(metaMaskNetworkId)),
        };
      }

      if (location.pathname.includes('/rFIS/home') || location.pathname.includes('/rFIS/fiswallet')) {
        return {
          showFisAccount: !!fisAccount,
        };
      }

      return {
        showFisAccount: true,
      };
    }

    if (location.pathname.includes('/rDOT')) {
      if (location.pathname.includes('/rDOT/staker/info') || location.pathname.includes('/rDOT/staker/reward')) {
        return {
          showFisAccount: true,
          showMetaMaskAccount: platform !== 'Native',
          wrongNetwork:
            (platform === 'ERC20' && !config.metaMaskNetworkIsGoerliEth(metaMaskNetworkId)) ||
            (platform === 'BEP20' && !config.metaMaskNetworkIsBsc(metaMaskNetworkId)),
        };
      }

      if (
        location.pathname.includes('/rDOT/home') ||
        location.pathname.includes('/rDOT/wallet') ||
        location.pathname.includes('/rDOT/fiswallet')
      ) {
        return {
          showFisAccount: !!fisAccount,
          showDotAccount: !!dotAccount,
        };
      }

      return {
        showFisAccount: true,
        showDotAccount: true,
      };
    }

    if (location.pathname.includes('/rKSM')) {
      if (location.pathname.includes('/rKSM/staker/info') || location.pathname.includes('/rKSM/staker/reward')) {
        return {
          showFisAccount: true,
          showMetaMaskAccount: platform !== 'Native',
          wrongNetwork:
            (platform === 'ERC20' && !config.metaMaskNetworkIsGoerliEth(metaMaskNetworkId)) ||
            (platform === 'BEP20' && !config.metaMaskNetworkIsBsc(metaMaskNetworkId)),
        };
      }

      if (
        location.pathname.includes('/rKSM/home') ||
        location.pathname.includes('/rKSM/wallet') ||
        location.pathname.includes('/rKSM/fiswallet')
      ) {
        return {
          showFisAccount: !!fisAccount,
          showKsmAccount: !!ksmAccount,
        };
      }

      return {
        showFisAccount: true,
        showKsmAccount: true,
      };
    }

    if (location.pathname.includes('/rATOM')) {
      if (location.pathname.includes('/rATOM/staker/info') || location.pathname.includes('/rATOM/staker/reward')) {
        return {
          showFisAccount: true,
          showMetaMaskAccount: platform !== 'Native',
          wrongNetwork:
            (platform === 'ERC20' && !config.metaMaskNetworkIsGoerliEth(metaMaskNetworkId)) ||
            (platform === 'BEP20' && !config.metaMaskNetworkIsBsc(metaMaskNetworkId)),
        };
      }

      if (location.pathname.includes('/rATOM/home')) {
        return {
          showFisAccount: !!fisAccount,
          showAtomAccount: !!atomAccount,
        };
      }

      return {
        showFisAccount: true,
        showAtomAccount: true,
      };
    }

    if (location.pathname.includes('/rSOL')) {
      if (location.pathname.includes('rSOL/staker/info') || location.pathname.includes('rSOL/staker/reward')) {
        return {
          showFisAccount: true,
          showSolAccount: platform !== 'Native',
        };
      }

      if (location.pathname.includes('/rSOL/home')) {
        return {
          showFisAccount: !!fisAccount,
          showSolAccount: !!solAccount.address,
        };
      }

      return {
        showFisAccount: true,
        showSolAccount: true,
      };
    }

    if (location.pathname.includes('/rMATIC')) {
      if (location.pathname.includes('/rMATIC/staker/info') || location.pathname.includes('/rMATIC/staker/reward')) {
        return {
          showFisAccount: true,
          showMetaMaskAccount: platform !== 'Native',
          wrongNetwork:
            (platform === 'ERC20' && !config.metaMaskNetworkIsGoerliEth(metaMaskNetworkId)) ||
            (platform === 'BEP20' && !config.metaMaskNetworkIsBsc(metaMaskNetworkId)),
        };
      }

      if (location.pathname.includes('/rMATIC/home')) {
        return {
          showFisAccount: !!fisAccount,
          showMaticAccount: !!maticAccount.address,
          wrongNetwork: !config.metaMaskNetworkIsGoerliEth(metaMaskNetworkId),
        };
      }

      return {
        showFisAccount: true,
        showMaticAccount: true,
        wrongNetwork: !config.metaMaskNetworkIsGoerliEth(metaMaskNetworkId),
      };
    }

    if (location.pathname.includes('/feeStation')) {
      if (location.pathname.includes('/feeStation/eth')) {
        return {
          showFisAccount: true,
          showMetaMaskAccount: !!metaMaskAccount.address,
          wrongNetwork: !config.metaMaskNetworkIsGoerliEth(metaMaskNetworkId),
        };
      }
      if (location.pathname.includes('/feeStation/dot')) {
        return {
          showFisAccount: true,
          showDotAccount: !!dotAccount,
        };
      }
      if (location.pathname.includes('/feeStation/ksm')) {
        return {
          showFisAccount: true,
          showKsmAccount: !!ksmAccount,
        };
      }
      if (location.pathname.includes('/feeStation/atom')) {
        return {
          showFisAccount: true,
          showAtomAccount: !!atomAccount,
        };
      }
    }

    return null;
  });

  const { noticeData } = useSelector((state: any) => {
    return {
      noticeData: state.noticeModule.noticeData,
    };
  });

  const pendingCount = useMemo(() => {
    if (noticeData && noticeData.datas) {
      return noticeData.datas.reduce((total: number, item: any) => {
        return total + (item.status === noticeStatus.Pending || item.status === noticeStatus.Swapping ? 1 : 0);
      }, 0);
    }
    return 0;
  }, [noticeData]);

  useEffect(() => {
    dispatch(get_eth_getBalance());
  }, [metaMaskNetworkId, dispatch]);

  const connectDotWallet = () => {
    setModalType('dot');
    dispatch(connectPolkadotjs(Symbol.Dot));
    setVisible(true);
  };

  if (location.pathname.includes('/rPool/home')) {
    return <></>;
  }

  return (
    <div className='stafi_header'>
      <Modal visible={visible}>
        {modalType === 'dot' && (
          <Page
            location={{}}
            type='header'
            onClose={() => {
              setVisible(false);
              dispatch(dotReloadData());
            }}
          />
        )}

        {modalType === 'fis' && !location.pathname.includes('/rFIS') && (
          <PageFis
            location={{}}
            type='header'
            onClose={() => {
              setVisible(false);
              dispatch(dotquery_rBalances_account());
              dispatch(ksmquery_rBalances_account());
              dispatch(balancesAll());
            }}
          />
        )}

        {modalType === 'fis' && location.pathname.includes('/rFIS') && (
          <PageRFis
            location={{}}
            type='header'
            onClose={() => {
              setVisible(false);
            }}
          />
        )}

        {modalType === 'ksm' && (
          <PageKsm
            location={{}}
            type='header'
            onClose={() => {
              setVisible(false);
              dispatch(ksmReloadData());
            }}
          />
        )}
      </Modal>

      <div></div>

      <div className='info_span'>
        {account == null && (Tool.pageType() === rSymbol.Ksm || Tool.pageType() === rSymbol.Dot) && (
          <div
            className='header_tool'
            onClick={() => {
              if (Tool.pageType() === rSymbol.Dot) {
                dispatch(
                  connectPolkadot(() => {
                    props.history.push('/rDOT/wallet');
                  }),
                );
              }
              if (Tool.pageType() === rSymbol.Ksm) {
                dispatch(
                  connectPolkadot_ksm(() => {
                    props.history.push('/rKSM/wallet');
                  }),
                );
              }
            }}>
            Connect to Polkadotjs
          </div>
        )}

        {account && (
          <div className='header_tools'>
            <Popover history={props.history} visible={noticePopoverVisible} onVisibleChange={setNoticePopoverVisible}>
              <div className={`notice_container ${pendingCount > 0 && 'pending'}`}>
                <div className={`header_tool notice ${noticeData && noticeData.showNew && 'new'}`}>
                  <img src={notice} className='notice_icon' alt='notice' />
                </div>

                {pendingCount > 0 && <div className='notice_pending_text'>{pendingCount} Pending</div>}
              </div>
            </Popover>

            {account.showFisAccount && (
              <div
                onClick={() => {
                  setModalType('fis');
                  dispatch(connectPolkadotjs(Symbol.Fis));
                  setVisible(true);
                }}
                className={`header_tool account ${fisAccount && 'fis'}`}>
                {fisAccount && fisAccount.address ? (
                  <>
                    <div>{fisAccount.balance} FIS</div>
                    <div>{StringUtil.replacePkh(fisAccount.address, 6, 44)}</div>
                  </>
                ) : (
                  <>connect to Polkadotjs</>
                )}
              </div>
            )}

            {account.showDotAccount && (
              <div onClick={connectDotWallet} className='header_tool account'>
                {dotAccount ? (
                  <>
                    <div>{dotAccount.balance} DOT</div>

                    <div>{StringUtil.replacePkh(dotAccount.address, 6, 44)}</div>
                  </>
                ) : (
                  <>connect to Polkadotjs</>
                )}
              </div>
            )}

            {account.showKsmAccount && (
              <div
                onClick={() => {
                  setModalType('ksm');
                  dispatch(connectPolkadotjs(Symbol.Ksm));
                  setVisible(true);
                }}
                className='header_tool account'>
                {ksmAccount ? (
                  <>
                    <div>{ksmAccount.balance} KSM</div>
                    <div>{StringUtil.replacePkh(ksmAccount.address, 6, 44)}</div>
                  </>
                ) : (
                  <>connect to Polkadotjs</>
                )}
              </div>
            )}

            {account.showAtomAccount && (
              <div className='header_tool account'>
                {atomAccount ? (
                  <>
                    <div>{atomAccount.balance} ATOM</div>
                    <div>{StringUtil.replacePkh(atomAccount.address, 6, 38)}</div>
                  </>
                ) : (
                  <>
                    <div
                      onClick={() => {
                        dispatch(connectAtomjs());
                      }}
                      className='header_tool account'>
                      connect to Kepir
                    </div>
                  </>
                )}
              </div>
            )}

            {account.showSolAccount && (
              <div
                onClick={() => {
                  dispatch(connectSoljs());
                }}
                className={`header_tool account`}>
                {solAccount && solAccount.address ? (
                  <>
                    <div>{solAccount.balance} SOL</div>
                    <div>{StringUtil.replacePkh(solAccount.address, 6, 38)}</div>
                  </>
                ) : (
                  <>connect to Phantom</>
                )}
              </div>
            )}

            {account.showMaticAccount && (
              <>
                {maticAccount.address ? (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className='header_tool account'>
                      <div>{maticAccount.balance || '--'} MATIC</div>

                      <div>{StringUtil.replacePkh(maticAccount.address, 4, 38)}</div>
                    </div>

                    {account.wrongNetwork && (
                      <img src={wrong_network} className={'wrong_network'} alt='wrong network' />
                    )}
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      dispatch(initMetaMaskAccount());
                    }}
                    className='header_tool account'>
                    connect to MetaMask
                  </div>
                )}
              </>
            )}

            {account.showMetaMaskAccount && (
              <>
                {metaMaskAccount.address ? (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className='header_tool account'>
                      <div>
                        {metaMaskAccount.balance || '--'} {getMetaMaskTokenSymbol(metaMaskNetworkId)}
                      </div>

                      <div>{StringUtil.replacePkh(metaMaskAccount.address, 4, 38)}</div>
                    </div>

                    {account.wrongNetwork && (
                      <img src={wrong_network} className={'wrong_network'} alt='wrong network' />
                    )}
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      dispatch(initMetaMaskAccount());
                    }}
                    className='header_tool account'>
                    connect to MetaMask
                  </div>
                )}
              </>
            )}
          </div>
        )}
        <div className='report_icon'>
          <a target='_blank' href='https://info.stafi.io/' rel='noreferrer'>
            <img src={report_icon} alt='report' />
          </a>
        </div>
      </div>
    </div>
  );
}
