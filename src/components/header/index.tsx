import qs from 'querystring';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
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
import { connectMetamask, get_eth_getBalance, monitoring_Method } from 'src/features/rETHClice';
import {
  query_rBalances_account as ksmquery_rBalances_account,
  reloadData as ksmReloadData,
} from 'src/features/rKSMClice';
import { useMetaMaskAccount } from 'src/hooks/useMetaMaskAccount';
import { rSymbol, Symbol } from 'src/keyring/defaults';
import Modal from 'src/shared/components/modal/connectModal';
import { getLpPlatformFromUrl, getMetaMaskTokenSymbol, liquidityPlatformMatchMetaMask } from 'src/util/metaMaskUtil';
import NumberUtil from 'src/util/numberUtil';
import StringUtil from 'src/util/stringUtil';
import Tool from 'src/util/toolUtil';
import Page from '../../pages/rDOT/selectWallet/index';
import PageFis from '../../pages/rDOT/selectWallet_rFIS/index';
import PageRFis from '../../pages/rFIS/selectWallet_rFIS/index';
import PageKsm from '../../pages/rKSM/selectWallet/index';
import './index.scss';
import Popover from './popover';

declare const location: any;

type Props = {
  route: any;
  history: any;
};

export default function Index(props: Props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { metaMaskAddress, metaMaskBalance, metaMaskNetworkId } = useMetaMaskAccount();

  let platform = 'Native';
  if (history.location.search) {
    platform = qs.parse(history.location.search.slice(1)).platform as string;
  }

  const [visible, setVisible] = useState(false);
  const [modalType, setModalType] = useState<any>();
  const [noticePopoverVisible, setNoticePopoverVisible] = useState(false);

  const account = useSelector((state: any) => {
    if (location.pathname.includes('/rDOT')) {
      if (state.rDOTModule.dotAccount && state.FISModule.fisAccount) {
        if (location.pathname.includes('/rDOT/staker/info')) {
          return {
            ethAccount: state.rETHModule.ethAccount,
            fisAccount: state.FISModule.fisAccount,
            noticeData: state.noticeModule.noticeData,
            type: 'staker/status',
          };
        }
        return {
          dotAccount: state.rDOTModule.dotAccount,
          fisAccount: state.FISModule.fisAccount,
          noticeData: state.noticeModule.noticeData,
        };
      }
    }
    if (location.pathname.includes('/rKSM')) {
      if (state.rKSMModule.ksmAccount && state.FISModule.fisAccount) {
        if (location.pathname.includes('/rKSM/staker/info')) {
          return {
            ethAccount: state.rETHModule.ethAccount,
            fisAccount: state.FISModule.fisAccount,
            noticeData: state.noticeModule.noticeData,
            type: 'staker/status',
          };
        }
        return {
          ksmAccount: state.rKSMModule.ksmAccount,
          fisAccount: state.FISModule.fisAccount,
          noticeData: state.noticeModule.noticeData,
        };
      }
    }
    if (location.pathname.includes('/rATOM')) {
      if (state.rATOMModule.atomAccount || state.FISModule.fisAccount) {
        if (location.pathname.includes('/rATOM/staker/info')) {
          return {
            ethAccount: state.rETHModule.ethAccount,
            fisAccount: state.FISModule.fisAccount,
            noticeData: state.noticeModule.noticeData,
            type: 'staker/status',
          };
        }
        return {
          atomAccount: state.rATOMModule.atomAccount,
          fisAccount: state.FISModule.fisAccount,
          noticeData: state.noticeModule.noticeData,
          type: 'rATOM',
        };
      }
    }
    if (location.pathname.includes('/rAsset')) {
      if (location.pathname.includes('/rAsset/home/native')) {
        if (state.FISModule.fisAccount) {
          return {
            fisAccount: state.FISModule.fisAccount,
          };
        }
      }

      if (location.pathname.includes('/rAsset/home/erc')) {
        if (state.rETHModule.ethAccount) {
          return {
            ethAccount: state.rETHModule.ethAccount,
          };
        }
      }
      if (location.pathname.includes('/rAsset/home/bep')) {
        if (state.BSCModule.bscAccount) {
          return {
            bscAccount: state.BSCModule.bscAccount,
          };
        }
      }
      if (location.pathname.includes('/rAsset/home/spl')) {
        if (state.rSOLModule.solAccount) {
          return {
            solAccount: state.rSOLModule.solAccount,
            type: 'rAsset',
          };
        }
      }

      if (location.pathname.includes('/rAsset/swap')) {
        const returnValue: any = {};
        if (location.pathname.includes('/rAsset/swap/native')) {
          if (state.FISModule.fisAccount) {
            returnValue.fisAccount = state.FISModule.fisAccount;
          }
        }

        if (location.pathname.includes('/rAsset/swap/erc20')) {
          if (state.rETHModule.ethAccount) {
            returnValue.ethAccount = state.rETHModule.ethAccount;
          }
        }

        if (location.pathname.includes('/rAsset/swap/bep20')) {
          if (state.BSCModule.bscAccount) {
            returnValue.bscAccount = state.BSCModule.bscAccount;
          }
        }

        if (location.pathname.includes('/rAsset/swap/spl')) {
          if (state.rSOLModule.solAccount) {
            returnValue.solAccount = state.rSOLModule.solAccount;
            returnValue.type = 'rAsset';
          }
        }

        return returnValue;
      }
    }
    if (location.pathname.includes('/rETH')) {
      if (state.rETHModule.ethAccount) {
        if (location.pathname.includes('/rETH/staker/info')) {
          return {
            ethAccount: state.rETHModule.ethAccount,
            type: 'staker/status',
          };
        }
        return {
          ethAccount: state.rETHModule.ethAccount,
        };
      }
    }

    if (location.pathname.includes('/rSOL')) {
      if (state.rSOLModule.solAccount && state.FISModule.fisAccount) {
        if (location.pathname.includes('rSOL/staker/info')) {
          return {
            fisAccount: state.FISModule.fisAccount,
            solAccount: state.rSOLModule.solAccount,
            noticeData: state.noticeModule.noticeData,
            type: 'staker/status',
          };
        }
        return {
          solAccount: state.rSOLModule.solAccount,
          fisAccount: state.FISModule.fisAccount,
          noticeData: state.noticeModule.noticeData,
          type: 'rSOL',
        };
      }
    }
    if (location.pathname.includes('/rMATIC')) {
      if (state.rMATICModule.maticAccount || state.FISModule.fisAccount) {
        if (location.pathname.includes('/rMATIC/staker/info')) {
          return {
            fisAccount: state.FISModule.fisAccount,
            ethAccount: state.rETHModule.ethAccount,
            noticeData: state.noticeModule.noticeData,
            type: 'staker/status',
          };
        }

        return {
          maticAccount: state.rMATICModule.maticAccount,
          fisAccount: state.FISModule.fisAccount,
          noticeData: state.noticeModule.noticeData,
          type: 'rMATIC',
        };
      }
    }
    if (location.pathname.includes('/rBNB')) {
      if (state.rETHModule.ethAccount || state.FISModule.fisAccount) {
        if (location.pathname.includes('rBNB/staker/info')) {
          return {
            fisAccount: state.FISModule.fisAccount,
            ethAccount: state.rETHModule.ethAccount,
            noticeData: state.noticeModule.noticeData,
            type: 'staker/status',
          };
        }
        return {
          ethAccount: state.rETHModule.ethAccount,
          fisAccount: state.FISModule.fisAccount,
          noticeData: state.noticeModule.noticeData,
          type: 'rBNB',
        };
      }
    }
    if (location.pathname.includes('/rFIS')) {
      if (state.FISModule.fisAccount) {
        if (location.pathname.includes('/rFIS/staker/info')) {
          return {
            fisAccount: state.FISModule.fisAccount,
            ethAccount: state.rETHModule.ethAccount,
            noticeData: state.noticeModule.noticeData,
            type: 'staker/status',
          };
        }

        return {
          fisAccount: state.FISModule.fisAccount,
          noticeData: state.noticeModule.noticeData,
          type: 'rFIS',
        };
      }
    }
    if (location.pathname.includes('/rSwap')) {
      if (state.FISModule.fisAccount) {
        return {
          fisAccount: state.FISModule.fisAccount,
          type: 'rSwap',
        };
      }
    }
    if (location.pathname.includes('/feeStation')) {
      const returnValue: any = { type: 'feeStation' };
      if (state.FISModule.fisAccount) {
        returnValue.fisAccount = state.FISModule.fisAccount;
      }
      if (location.pathname.includes('/feeStation/eth')) {
        if (state.rETHModule.ethAccount) {
          returnValue.ethAccount = state.rETHModule.ethAccount;
        }
      }
      if (location.pathname.includes('/feeStation/dot')) {
        if (state.rDOTModule.dotAccount) {
          returnValue.dotAccount = state.rDOTModule.dotAccount;
        }
      }
      if (location.pathname.includes('/feeStation/ksm')) {
        if (state.rKSMModule.ksmAccount) {
          returnValue.ksmAccount = state.rKSMModule.ksmAccount;
        }
      }
      if (location.pathname.includes('/feeStation/atom')) {
        if (state.rATOMModule.atomAccount) {
          returnValue.atomAccount = state.rATOMModule.atomAccount;
        }
      }
      return returnValue;
    }
    if (location.pathname.includes('/rPool/mint')) {
      const returnValue: any = { type: 'rPool' };
      if (state.FISModule.fisAccount) {
        returnValue.fisAccount = state.FISModule.fisAccount;
      }
      return returnValue;
    }
    if (location.pathname.includes('/rPool/lp')) {
      const returnValue: any = { type: 'rPool/lp' };
      returnValue.metaMaskAccount = {
        address: metaMaskAddress,
        balance: metaMaskBalance,
      };
      return returnValue;
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
    dispatch(monitoring_Method());
  }, [account, dispatch]);

  useEffect(() => {
    dispatch(get_eth_getBalance());
  }, [metaMaskNetworkId, dispatch]);

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

            {account.fisAccount && (
              <div
                onClick={() => {
                  setModalType('fis');
                  dispatch(connectPolkadotjs(Symbol.Fis));
                  setVisible(true);
                }}
                className='header_tool account fis'>
                <div>{account.fisAccount.balance} FIS</div>
                <div>{StringUtil.replacePkh(account.fisAccount.address, 6, 44)}</div>
              </div>
            )}

            {account.dotAccount && (
              <div
                onClick={() => {
                  setModalType('dot');
                  dispatch(connectPolkadotjs(Symbol.Dot));
                  setVisible(true);
                }}
                className='header_tool account'>
                <div>{account.dotAccount.balance} DOT</div>
                <div>{StringUtil.replacePkh(account.dotAccount.address, 6, 44)}</div>
              </div>
            )}

            {account.ksmAccount && (
              <div
                onClick={() => {
                  setModalType('ksm');
                  dispatch(connectPolkadotjs(Symbol.Ksm));
                  setVisible(true);
                }}
                className='header_tool account'>
                <div>{account.ksmAccount.balance} KSM</div>
                <div>{StringUtil.replacePkh(account.ksmAccount.address, 6, 44)}</div>
              </div>
            )}

            {account.type === 'rATOM' &&
              (account.atomAccount ? (
                <div className='header_tool account'>
                  <div>{account.atomAccount.balance} ATOM</div>
                  <div>{StringUtil.replacePkh(account.atomAccount.address, 6, 38)}</div>
                </div>
              ) : (
                <div
                  onClick={() => {
                    dispatch(connectAtomjs());
                  }}
                  className='header_tool account'>
                  connect to Kepir
                </div>
              ))}

            {account.type === 'rATOM/status' && account.atomAccount && (
              <div className='header_tool account'>
                <div>{account.atomAccount.balance} ATOM</div>
                <div>{StringUtil.replacePkh(account.atomAccount.address, 6, 38)}</div>
              </div>
            )}

            {account.type === 'feeStation' &&
              (account.atomAccount ? (
                <div className='header_tool account'>
                  <div>{account.atomAccount.balance} ATOM</div>
                  <div>{StringUtil.replacePkh(account.atomAccount.address, 6, 38)}</div>
                </div>
              ) : null)}

            {(account.type === 'rSOL' || account.type === 'rAsset') &&
              (account.solAccount ? (
                <div
                  className='header_tool account'
                  onClick={() => {
                    dispatch(connectSoljs());
                  }}>
                  <div>{account.solAccount.balance} SOL</div>
                  <div>{StringUtil.replacePkh(account.solAccount.address, 6, 38)}</div>
                </div>
              ) : (
                <div
                  onClick={() => {
                    dispatch(connectSoljs());
                  }}
                  className='header_tool account'>
                  connect to Phantom
                </div>
              ))}

            {account.type !== 'rBNB' && account.type !== 'staker/status' && account.ethAccount && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className='header_tool account'>
                  <div>
                    {account.ethAccount.balance || '--'} {getMetaMaskTokenSymbol(metaMaskNetworkId)}
                  </div>
                  <div>{StringUtil.replacePkh(account.ethAccount.address, 4, 38)}</div>
                </div>
                {account.type === 'rPool/lp' &&
                  metaMaskNetworkId &&
                  !liquidityPlatformMatchMetaMask(metaMaskNetworkId, getLpPlatformFromUrl(location.pathname)) && (
                    <img src={wrong_network} className={'wrong_network'} alt='wrong network' />
                  )}
                {account.type !== 'rPool/lp' &&
                  metaMaskNetworkId &&
                  !config.metaMaskNetworkIsGoerliEth(metaMaskNetworkId) && (
                    <img src={wrong_network} className={'wrong_network'} alt='wrong network' />
                  )}
              </div>
            )}

            {account.type === 'rPool/lp' && account.metaMaskAccount && (
              <>
                {account.metaMaskAccount.address ? (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className='header_tool account'>
                      <div>
                        {account.metaMaskAccount.balance || '--'} {getMetaMaskTokenSymbol(metaMaskNetworkId)}
                      </div>

                      <div>{StringUtil.replacePkh(account.metaMaskAccount.address, 4, 38)}</div>
                    </div>

                    {metaMaskNetworkId &&
                      !liquidityPlatformMatchMetaMask(metaMaskNetworkId, getLpPlatformFromUrl(location.pathname)) && (
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

            {account.type === 'rBNB' && account.ethAccount && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className='header_tool account'>
                  <div>
                    {(config.metaMaskNetworkIsBsc(metaMaskNetworkId) && account.ethAccount.balance) || '--'} BNB
                  </div>
                  <div>{StringUtil.replacePkh(account.ethAccount.address, 4, 38)}</div>
                </div>
                {metaMaskNetworkId && !config.metaMaskNetworkIsBsc(metaMaskNetworkId) && (
                  <img src={wrong_network} className={'wrong_network'} alt='wrong network' />
                )}
              </div>
            )}

            {account.bscAccount && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className='header_tool account'>
                  <div>{account.bscAccount.balance} BNB</div>
                  <div>{StringUtil.replacePkh(account.bscAccount.address, 4, 38)}</div>
                </div>
                {metaMaskNetworkId && !config.metaMaskNetworkIsBsc(metaMaskNetworkId) && (
                  <img src={wrong_network} className={'wrong_network'} alt='wrong network' />
                )}
              </div>
            )}

            {account.maticAccount && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className='header_tool account'>
                  <div>{NumberUtil.handleFisAmountToFixed(account.maticAccount.balance)} MATIC</div>
                  <div>{StringUtil.replacePkh(account.maticAccount.address, 4, 38)}</div>
                </div>
                {metaMaskNetworkId && !config.metaMaskNetworkIsGoerliEth(metaMaskNetworkId) && (
                  <img src={wrong_network} className={'wrong_network'} alt='wrong network' />
                )}
              </div>
            )}

            {account.type === 'staker/status' && (platform === 'ERC20' || platform === 'BEP20' || platform === 'SPL') && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {platform === 'ERC20' || platform === 'BEP20' ? (
                  account.ethAccount ? (
                    <div className='header_tool account'>
                      {platform === 'BEP20' && (
                        <div>
                          {(config.metaMaskNetworkIsBsc(metaMaskNetworkId) && account.ethAccount.balance) || '--'} BNB
                        </div>
                      )}
                      {platform === 'ERC20' && (
                        <div>
                          {(config.metaMaskNetworkIsGoerliEth(metaMaskNetworkId) && account.ethAccount.balance) || '--'}{' '}
                          ETH
                        </div>
                      )}
                      <div>{StringUtil.replacePkh(account.ethAccount.address, 4, 38)}</div>
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        dispatch(connectMetamask(platform === 'ERC20' ? config.ethChainId() : config.bscChainId()));
                      }}
                      className='header_tool account'>
                      connect to MetaMask
                    </div>
                  )
                ) : null}

                {platform === 'SPL' &&
                  (account.solAccount ? (
                    <div
                      className='header_tool account'
                      onClick={() => {
                        dispatch(connectSoljs());
                      }}>
                      <div>{account.solAccount.balance} SOL</div>
                      <div>{StringUtil.replacePkh(account.solAccount.address, 6, 38)}</div>
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        dispatch(connectSoljs());
                      }}
                      className='header_tool account'>
                      connect to Phantom
                    </div>
                  ))}

                {platform === 'BEP20' && metaMaskNetworkId && !config.metaMaskNetworkIsBsc(metaMaskNetworkId) && (
                  <img src={wrong_network} className={'wrong_network'} alt='wrong network' />
                )}
                {platform === 'ERC20' && metaMaskNetworkId && !config.metaMaskNetworkIsGoerliEth(metaMaskNetworkId) && (
                  <img src={wrong_network} className={'wrong_network'} alt='wrong network' />
                )}
              </div>
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
