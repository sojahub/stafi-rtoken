import { Spin } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import backIcon from 'src/assets/images/left_arrow.svg';
import metamask from 'src/assets/images/metamask.png';
import mintMyMintIcon from 'src/assets/images/mint_my_mint.svg';
import mintMyRewardIcon from 'src/assets/images/mint_my_reward.svg';
import mintRewardTokenIcon from 'src/assets/images/mint_reward_token.svg';
import mintValueIcon from 'src/assets/images/mint_value.svg';
import mintVestingIcon from 'src/assets/images/mint_vesting.svg';
import rpool_ratom_Icon from 'src/assets/images/rpool_ratom_atom.svg';
import rpool_rbnb_Icon from 'src/assets/images/rpool_rbnb_bnb.svg';
import rpool_rdot_Icon from 'src/assets/images/rpool_rdot_dot.svg';
import rpool_reth_Icon from 'src/assets/images/rpool_reth.svg';
import rpool_rfis_Icon from 'src/assets/images/rpool_rfis_fis.svg';
import rpool_rksm_Icon from 'src/assets/images/rpool_rksm_ksm.svg';
import rpool_rmatic_Icon from 'src/assets/images/rpool_rmatic_matic.svg';
import config from 'src/config/index';
import { getRtokenPriceList } from 'src/features/bridgeClice';
import { initMetaMaskAccount } from 'src/features/globalClice';
import { get_eth_getBalance } from 'src/features/rETHClice';
import { useMetaMaskAccount } from 'src/hooks/useMetaMaskAccount';
import RPoolServer from 'src/servers/rpool';
import Button from 'src/shared/components/button/connect_button';
import Modal from 'src/shared/components/modal/connectModal';
import lpConfig from 'src/util/lpConfig';
import { liquidityPlatformMatchMetaMask } from 'src/util/metaMaskUtil';
import numberUtil from 'src/util/numberUtil';
import { useInterval } from 'src/util/utils';
import Page_FIS from '../rATOM/selectWallet_rFIS/index';
import './LiquidityOverview.scss';
import LiquidityStaker from './LiquidityStaker';

const rPoolServer = new RPoolServer();

let isMounted = false;

export default function LiquidityOverview() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { lpPlatform, poolIndex, lpContract } = useParams<any>();
  const lpStatus = history.location.state?.status;
  const refreshInterval = lpPlatform === 'BSC' || lpPlatform === 'Polygon' ? 3000 : 15000;

  let lpName = null,
    rTokenName = null;
  if (lpContract === lpConfig.rBNBBSCLpContract1) {
    lpName = 'rBNB/BNB LP';
    rTokenName = 'rBNB';
  } else if (lpContract === lpConfig.rDOTBSCLpContract1) {
    lpName = 'rDOT/DOT LP';
    rTokenName = 'rDOT';
  } else if (lpContract === lpConfig.rETHLpContract2()) {
    lpName = 'rETH/ETH LP';
    rTokenName = 'rETH';
  }

  const [showStaker, setShowStaker] = useState(false);

  const [overviewData, setOverviewData] = useState<any>(null);
  const [userMintToken, setUserMintToken] = useState<any>('--');
  const [userMintRatio, setUserMintRatio] = useState<any>('--');
  const [userMintReward, setUserMintReward] = useState<any>('--');
  const [fisTotalReward, setFisTotalReward] = useState<any>('--');
  const [fisClaimableReward, setFisClaimableReward] = useState<any>('--');
  const [fisLockedReward, setFisLockedReward] = useState<any>('--');
  const [claimIndexs, setClaimIndexs] = useState([]);
  const [vesting, setVesting] = useState('--');
  const [claimModalVisible, setClaimModalVisible] = useState(false);
  const [fisAccountModalVisible, setFisAccountModalVisible] = useState(false);
  const { metaMaskAddress } = useMetaMaskAccount();

  const { loading } = useSelector((state: any) => {
    return {
      loading: state.globalModule.loading,
    };
  });

  const { fisAccount, unitPriceList, metaMaskNetworkId } = useSelector((state: any) => {
    return {
      fisAccount: state.FISModule.fisAccount,
      unitPriceList: state.bridgeModule.priceList,
      metaMaskNetworkId: state.globalModule.metaMaskNetworkId,
    };
  });

  useEffect(() => {
    isMounted = true;
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (metaMaskAddress) {
      dispatch(getRtokenPriceList());
    }
  }, [metaMaskAddress, dispatch]);

  useEffect(() => {
    initData();
  }, [metaMaskAddress, unitPriceList, metaMaskNetworkId]);

  useInterval(() => {
    initData();
  }, refreshInterval);

  const metaMaskNetworkMatched = useMemo(() => {
    return liquidityPlatformMatchMetaMask(metaMaskNetworkId, lpPlatform);
  }, [metaMaskNetworkId, lpPlatform]);

  const lpNameWithPrefix = useMemo(() => {
    let prefix;
    if (lpPlatform === 'Ethereum') {
      prefix = 'UNI-V2 ';
    } else if (lpPlatform === 'BSC') {
      prefix = 'PANCAKE ';
    } else if (lpPlatform === 'Polygon') {
      prefix = 'QUICKSWAP ';
    }
    return prefix + lpName;
  }, [lpName, lpPlatform]);

  const showContent = useMemo(() => {
    return metaMaskAddress;
  }, [metaMaskAddress]);

  const mintedValue = useMemo(() => {
    let res: any = '--';
    // if (unitPriceList && actData) {
    //   let unitPrice = unitPriceList.find((item: any) => {
    //     return item.symbol === rTokenName;
    //   });
    //   if (unitPrice) {
    //     const rTokenTotalReward = numberUtil.tokenAmountToHuman(actData.total_rtoken_amount, Number(tokenSymbol));
    //     res = numberUtil.amount_format(multiply(unitPrice.price, rTokenTotalReward));
    //   }
    // }
    if (overviewData) {
      return numberUtil.amount_format(overviewData.totalMintedValue);
    }
    return res;
  }, [overviewData]);

  const initData = async () => {
    if (metaMaskAddress) {
      dispatch(get_eth_getBalance());
    }
    let unitPrice = unitPriceList?.find((item: any) => {
      return item.symbol === rTokenName;
    });
    let fisPrice = unitPriceList?.find((item: any) => {
      return item.symbol === 'FIS';
    });
    if (lpPlatform && poolIndex) {
      let response;
      if (metaMaskAddress) {
        response = await rPoolServer.getLiquidityOverview(
          metaMaskAddress,
          lpPlatform,
          poolIndex,
          lpContract,
          fisPrice && fisPrice.price,
        );
        // console.log('response:', response);
      }
      if (response && isMounted) {
        setOverviewData(response);
        if (!isNaN(Number(response.userStakedAmount))) {
          setUserMintToken(numberUtil.amount_format(numberUtil.handleAmountRoundToFixed(response.userStakedAmount, 2)));
        }
        if (!isNaN(Number(response.myMintRatio))) {
          setUserMintRatio(response.myMintRatio);
        }
        if (!isNaN(Number(response.myReward))) {
          setUserMintReward(numberUtil.amount_format(response.myReward));
        }
        if (!isNaN(Number(response.fisTotalReward))) {
          setFisTotalReward(response.fisTotalReward);
        }
        if (!isNaN(Number(response.fisClaimableReward))) {
          setFisClaimableReward(response.fisClaimableReward);
        }
        if (!isNaN(Number(response.fisLockedReward))) {
          setFisLockedReward(response.fisLockedReward);
        }
        if (!isNaN(Number(response.claimIndexs))) {
          setClaimIndexs(response.claimIndexs);
        }

        if (isNaN(response.vesting)) {
          setVesting('--');
        } else if (response.vesting * 1 > 0) {
          if (Number(response.vesting) < 0.042) {
            setVesting('0');
          } else {
            setVesting(Math.ceil(response.vesting * 1) + 'D');
          }
        } else {
          setVesting('0');
        }
      }
    }
  };

  if (!lpPlatform || !lpName || !rTokenName) {
    history.replace('/rPool/home?tab=lp');
  }

  if (isNaN(poolIndex) || poolIndex < 0) {
    history.replace('/rPool/home?tab=lp');
  }

  return (
    <Spin spinning={loading} size='large' tip='loading'>
      <div className='rpool_liquidity_overview'>
        <div className='title_container'>
          <img
            src={backIcon}
            className='back_icon'
            onClick={() => {
              if (showStaker) {
                setShowStaker(false);
              } else {
                history.replace('/rPool/home?tab=lp', {
                  index: 1,
                });
              }
            }}
            alt='back'
          />

          <div className='title' style={{ fontSize: showStaker ? '20px' : '30px', height: '48px', lineHeight: '48px' }}>
            {showContent ? (showStaker ? `MY STAKED ${lpNameWithPrefix}` : 'rPool') : 'Connect'}
          </div>
        </div>

        {showContent && !showStaker && (
          <div className='content_container'>
            {rTokenName === 'rDOT' && <img src={rpool_rdot_Icon} className='token_icon' alt='token icon' />}
            {rTokenName === 'rMATIC' && <img src={rpool_rmatic_Icon} className='token_icon' alt='token icon' />}
            {rTokenName === 'rATOM' && <img src={rpool_ratom_Icon} className='token_icon' alt='token icon' />}
            {rTokenName === 'rFIS' && <img src={rpool_rfis_Icon} className='token_icon' alt='token icon' />}
            {rTokenName === 'rKSM' && <img src={rpool_rksm_Icon} className='token_icon' alt='token icon' />}
            {rTokenName === 'rETH' && <img src={rpool_reth_Icon} className='token_icon' alt='token icon' />}
            {rTokenName === 'rBNB' && <img src={rpool_rbnb_Icon} className='token_icon' alt='token icon' />}

            <div className='right_content'>
              <div className='title'>{lpNameWithPrefix}</div>

              <div className='apr_container'>
                <div className='number'>
                  {history.location.state?.apy !== undefined && !isNaN(history.location.state?.apy)
                    ? history.location.state?.apy + '%'
                    : '--'}
                </div>
                <div className='label'>APY</div>
              </div>

              <div className='divider' />

              <div className='content_row'>
                <img src={mintRewardTokenIcon} className='icon' alt='token icon' />

                <div className='label'>Reward Token</div>

                {/* <img src={stafiWhiteIcon} className='stafi_icon' /> */}
                <div className='content_text'>FIS</div>
              </div>

              <div className='content_row'>
                <img src={mintValueIcon} className='icon' alt='mint value' />

                <div className='label'>Staked Value</div>

                <div className='content_text'>{mintedValue !== '--' ? `$${mintedValue}` : '--'}</div>
              </div>

              <div className='content_row'>
                <img src={mintMyMintIcon} className='icon' alt='my mint' />

                <div className='label'>My Share</div>

                <div className='content_text'>
                  {userMintToken !== '--' && metaMaskNetworkMatched ? `${userMintToken}` : '--'} (
                  {userMintRatio !== '--' && metaMaskNetworkMatched ? `${userMintRatio}` : '--'}
                  %)
                </div>
              </div>

              <div className='content_row'>
                <img src={mintMyRewardIcon} className='icon_small' alt='my reward' />

                <div className='label'>My Reward</div>

                <div className='content_text'>
                  {userMintReward !== '--' && metaMaskNetworkMatched ? `$${userMintReward}` : '--'}
                </div>
              </div>

              <div className='content_row'>
                <img src={mintVestingIcon} className='icon_small' alt='mint vesting' />

                <div className='label'>Vesting</div>

                <div className='content_text'>{vesting}</div>
              </div>

              <div className='button_container'>
                <div
                  className='button'
                  style={{
                    marginRight: '20px',
                    opacity: metaMaskNetworkMatched ? 1 : 0.5,
                    cursor: metaMaskNetworkMatched ? 'pointer' : 'not-allowed',
                  }}
                  onClick={() => {
                    if (metaMaskNetworkMatched) {
                      setShowStaker(true);
                    }
                  }}>
                  Staking
                </div>

                <div
                  className='button'
                  style={{
                    opacity: metaMaskNetworkMatched ? 1 : 0.5,
                    cursor: metaMaskNetworkMatched ? 'pointer' : 'not-allowed',
                  }}
                  onClick={() => {
                    metaMaskNetworkMatched &&
                      config.addLiquidityLink(lpPlatform, rTokenName) &&
                      window.open(config.addLiquidityLink(lpPlatform, rTokenName));
                  }}>
                  Add Liquidity
                </div>

                <div
                  className='button'
                  style={{
                    opacity: metaMaskNetworkMatched ? 1 : 0.5,
                    cursor: metaMaskNetworkMatched ? 'pointer' : 'not-allowed',
                  }}
                  onClick={() => {
                    if (metaMaskNetworkMatched) {
                      setShowStaker(true);
                    }
                  }}>
                  Claim Reward
                </div>
              </div>
            </div>
          </div>
        )}

        {showContent && showStaker && (
          <>
            <LiquidityStaker
              disabled={false}
              lpData={overviewData}
              lpStatus={lpStatus}
              initData={initData}
              lpNameWithPrefix={lpNameWithPrefix}
            />
          </>
        )}

        {!showContent && (
          <div style={{ marginTop: '150px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Button
              disabled={!!metaMaskAddress}
              icon={metamask}
              width={'400px'}
              onClick={() => {
                dispatch(initMetaMaskAccount());
              }}>
              Connect to MetaMask
            </Button>
          </div>
        )}

        <Modal visible={fisAccountModalVisible}>
          <Page_FIS
            location={{}}
            type='header'
            onClose={() => {
              setFisAccountModalVisible(false);
            }}
          />
        </Modal>
      </div>
    </Spin>
  );
}
