import { Tooltip } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import metamask from 'src/assets/images/metamask.png';
import doubt from 'src/assets/images/doubt.svg';
import rSOL_svg from 'src/assets/images/rSOL.svg';
import rATOM_svg from 'src/assets/images/r_atom.svg';
import rBnb_svg from 'src/assets/images/r_bnb.svg';
import keplr from 'src/assets/images/keplr.png';
import rDOT_svg from 'src/assets/images/r_dot.svg';
import phantom from 'src/assets/images/phantom.png';
import rETH_svg from 'src/assets/images/r_eth.svg';
import rFIS_svg from 'src/assets/images/r_fis.svg';
import rKSM_svg from 'src/assets/images/r_ksm.svg';
import rMatic_svg from 'src/assets/images/r_matic.svg';
import { RootState } from 'src/store';
import styled from 'styled-components';
import Button from 'src/shared/components/button/connect_button';
import { useMetaMaskAccount } from 'src/hooks/useMetaMaskAccount';
import {
  connectAtomjs,
  connectPolkadot,
  connectPolkadot_fis,
  connectPolkadot_ksm,
  connectSoljs,
  initMetaMaskAccount,
} from 'src/features/globalClice';
import Modal from 'src/shared/components/modal/connectModal';
import Page_FIS from '../rATOM/selectWallet_rFIS/index';
import config from 'src/config';
import { api } from 'src/util/http';
import numberUtil from 'src/util/numberUtil';

const stakeList = ['ETH', 'FIS', 'BNB', 'DOT', 'ATOM', 'SOL', 'MATIC', 'KSM'];

export const TokenList = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { metaMaskAddress } = useMetaMaskAccount();
  const [selectFisVisible, setSelectFisVisible] = useState(false);

  const { fisAccount, atomAccounts, solAddress, ksmAccount } = useSelector((state: RootState) => {
    return {
      fisAccount: state.FISModule.fisAccount,
      atomAccounts: state.rATOMModule.atomAccounts,
      solAddress: state.rSOLModule.solAddress,
      ksmAccount: state.rKSMModule.ksmAccount,
    };
  });

  const hasDotAcount = useSelector((state: any) => {
    if (state.FISModule.fisAccount && state.rDOTModule.dotAccount) {
      return true;
    } else {
      return false;
    }
  });

  const hasAtomAccount = useMemo(() => {
    return atomAccounts && atomAccounts.length >= 1;
  }, [atomAccounts]);

  const [connectExtensionConfig, setConnectExtensionConfig] = useState<any>({});

  const [stakeValueList, setStakeValueList] = useState([]);

  const tokenStakeValueMap = useMemo(() => {
    const obj = {};
    stakeValueList.forEach((item) => {
      obj[item.rsymbol.slice(1).toUpperCase()] = numberUtil.amountToReadable(item.stakeValue);
    });
    return obj;
  }, [stakeValueList]);

  useEffect(() => {
    (async () => {
      const url = `${config.api()}/stafi/v1/webapi/rtoken/stakevalues`;
      const res = await api.post(url, {
        rsymbols: ['reth', 'rfis', 'rdot', 'rksm', 'ratom', 'rmatic', 'rsol', 'rbnb'],
      });
      if (res.status === '80000') {
        setStakeValueList(res.data?.stakeList || []);
      }
    })();
  }, []);

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

  const showConnectWallet = useMemo(() => {
    return (
      (connectExtensionConfig.connectFis && !fisAccount) ||
      (connectExtensionConfig.connectDot && !hasDotAcount) ||
      (connectExtensionConfig.connectMetamask && !metaMaskAddress) ||
      (connectExtensionConfig.connectKeplr && !hasAtomAccount) ||
      (connectExtensionConfig.connectPhantom && !solAddress) ||
      (connectExtensionConfig.connectKsm && !ksmAccount)
    );
  }, [connectExtensionConfig, fisAccount, hasDotAcount, metaMaskAddress, hasAtomAccount, solAddress, ksmAccount]);

  const getIcon = (tokenName: string) => {
    switch (tokenName) {
      case 'ETH':
        return rETH_svg;
      case 'FIS':
        return rFIS_svg;
      case 'DOT':
        return rDOT_svg;
      case 'KSM':
        return rKSM_svg;
      case 'ATOM':
        return rATOM_svg;
      case 'MATIC':
        return rMatic_svg;
      case 'BNB':
        return rBnb_svg;
      case 'SOL':
        return rSOL_svg;
      default:
        break;
    }
    return null;
  };

  const clickStake = (tokenName: string) => {
    if (tokenName === 'ETH') {
      if (!metaMaskAddress) {
        setConnectExtensionConfig({ connectMetamask: true });
        return;
      }
    } else if (tokenName === 'FIS') {
      if (!fisAccount) {
        setConnectExtensionConfig({ connectFis: true });
        return;
      }
    } else if (tokenName === 'DOT') {
      if (!hasDotAcount) {
        setConnectExtensionConfig({ connectDot: true });
        return;
      }
    } else if (tokenName === 'ATOM') {
      if (!hasAtomAccount || !fisAccount) {
        setConnectExtensionConfig({ connectKeplr: true, connectFis: true });
        return;
      }
    } else if (tokenName === 'SOL') {
      if (!solAddress || !fisAccount) {
        setConnectExtensionConfig({ connectPhantom: true, connectFis: true });
        return;
      }
    } else if (tokenName === 'MATIC') {
      if (!metaMaskAddress || !fisAccount) {
        setConnectExtensionConfig({ connectMetamask: true, connectFis: true });
        return;
      }
    } else if (tokenName === 'KSM') {
      if (!ksmAccount || !fisAccount) {
        setConnectExtensionConfig({ connectKsm: true });
        return;
      }
    }

    history.push(`/r${tokenName}/home`);
  };

  return (
    <div>
      <TabContainer>
        <TitleContainer>
          <TabTitle>STAKE</TabTitle>

          <TabIndicator />
        </TitleContainer>
      </TabContainer>

      <div
        style={{
          marginTop: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
        }}>
        {showConnectWallet && (
          <ExtensionContainer
            onClick={() => {
              setConnectExtensionConfig({});
            }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {connectExtensionConfig.connectFis && (
                <Button
                  disabled={fisAccount}
                  icon={rDOT_svg}
                  onClick={() => {
                    dispatch(
                      connectPolkadot_fis(() => {
                        setSelectFisVisible(true);
                      }),
                    );
                  }}>
                  Connect to Polkadotjs extension
                </Button>
              )}

              {connectExtensionConfig.connectDot && (
                <Button
                  disabled={hasDotAcount}
                  icon={rDOT_svg}
                  onClick={() => {
                    dispatch(
                      connectPolkadot(() => {
                        history.push('/rDOT/wallet');
                      }),
                    );
                  }}>
                  Connect to Polkadotjs extension
                </Button>
              )}

              {connectExtensionConfig.connectKsm && (
                <Button
                  disabled={ksmAccount && fisAccount}
                  icon={rDOT_svg}
                  onClick={() => {
                    dispatch(
                      connectPolkadot_ksm(() => {
                        history.push('/rKSM/wallet');
                      }),
                    );
                  }}>
                  Connect to Polkadotjs extension
                </Button>
              )}

              {connectExtensionConfig.connectMetamask && (
                <Button
                  disabled={metaMaskAddress}
                  icon={metamask}
                  onClick={() => {
                    dispatch(initMetaMaskAccount());
                  }}>
                  Connect to Metamask
                </Button>
              )}

              {connectExtensionConfig.connectKeplr && (
                <Button
                  disabled={hasAtomAccount}
                  icon={keplr}
                  onClick={() => {
                    dispatch(connectAtomjs(() => {}));
                  }}>
                  Connect to Keplr
                </Button>
              )}

              {connectExtensionConfig.connectPhantom && (
                <Button
                  disabled={solAddress}
                  icon={phantom}
                  onClick={() => {
                    dispatch(connectSoljs());
                  }}>
                  Connect to Phantom
                </Button>
              )}
            </div>
          </ExtensionContainer>
        )}

        <div style={{ opacity: showConnectWallet ? 0.3 : 1 }}>
          <HContainer
            style={{
              width: '660px',
              marginBottom: '12px',
            }}>
            <TableHeader
              style={{
                paddingLeft: '47px',
                width: '190px',
              }}>
              Staked Asset
            </TableHeader>

            <TableHeader
              style={{
                width: '117px',
              }}>
              Derivative
            </TableHeader>

            <TableHeader
              style={{
                width: '110px',
              }}>
              APY
            </TableHeader>

            <TableHeader
              style={{
                width: '134px',
              }}>
              <HContainer style={{ alignItems: 'flex-start' }}>
                <div style={{ marginRight: '2px' }}>Staked Value</div>
                {/* <Tooltip
                  overlayClassName='doubt_overlay'
                  placement='topLeft'
                  overlayInnerStyle={{ color: '#A4A4A4' }}
                  title={'The amount of your staked token'}>
                  <img src={doubt} alt='tooltip' />
                </Tooltip> */}
              </HContainer>
            </TableHeader>

            <TableHeader>Liquify</TableHeader>
          </HContainer>

          {stakeList.map((tokenName) => (
            <TokenItemContainer key={tokenName}>
              <HContainer
                style={{
                  paddingLeft: '47px',
                  width: '190px',
                }}>
                <img src={getIcon(tokenName)} width='26px' height='26px' alt='icon' />
                <TokenTitle>{tokenName}</TokenTitle>
              </HContainer>

              <TableContent
                style={{
                  width: '117px',
                }}>
                r{tokenName}
              </TableContent>

              <TableContent
                style={{
                  width: '110px',
                }}>
                {tokenName === 'ETH' && ethApr}
                {tokenName === 'FIS' && fisApr}
                {tokenName === 'BNB' && bnbApr}
                {tokenName === 'DOT' && dotApr}
                {tokenName === 'ATOM' && atomApr}
                {tokenName === 'SOL' && solApr}
                {tokenName === 'MATIC' && maticApr}
                {tokenName === 'KSM' && ksmApr}
              </TableContent>

              <TableContent
                style={{
                  width: '134px',
                }}>
                {tokenStakeValueMap[tokenName] || '--'}
              </TableContent>

              <StakeButton
                onClick={() => {
                  clickStake(tokenName);
                }}>
                Stake
              </StakeButton>
            </TokenItemContainer>
          ))}
        </div>
      </div>

      <Modal visible={selectFisVisible}>
        <Page_FIS
          location={{}}
          type='header'
          onClose={() => {
            setSelectFisVisible(false);
          }}
        />
      </Modal>
    </div>
  );
};

const TabContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;

const TabTitle = styled.div`
  color: #00f3ab;
  font-size: 20px;
  line-height: 20px;
  font-weight: bold;
`;

const TabIndicator = styled.div`
  background-color: #00f3ab;
  width: 59px;
  height: 2px;
  margin-top: 10px;
`;

const HContainer = styled.div`
  display: flex;
  align-items: center;
`;

const TableHeader = styled.div`
  color: #818181;
  font-size: 14px;
  line-height: 14px;
`;

const TokenItemContainer = styled.div`
  width: 660px;
  height: 42px;
  background-color: #2b3239;
  border: 1px solid #494d51;
  border-radius: 4px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
`;

const TokenTitle = styled.div`
  color: white;
  font-size: 16px;
  line-height: 16px;
  font-weight: bold;
  margin-left: 10px;
`;

const TableContent = styled.div`
  color: white;
  font-size: 14px;
  line-height: 14px;
`;

const StakeButton = styled.div`
  width: 66px;
  height: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: #00f3ab;
  border-radius: 2px;
  border: 1px solid #00f3ab;
  font-size: 12px;
`;

const ExtensionContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: transparent;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
`;
