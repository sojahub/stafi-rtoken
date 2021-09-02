import config from '@config/index';
import { getRtokenPriceList } from '@features/bridgeClice';
import { connectMetamask, get_eth_getBalance, monitoring_Method } from '@features/rETHClice';
import backIcon from '@images/left_arrow.svg';
import metamask from '@images/metamask.png';
import mintMyMintIcon from '@images/mint_my_mint.svg';
import mintMyRewardIcon from '@images/mint_my_reward.svg';
import mintRewardTokenIcon from '@images/mint_reward_token.svg';
import mintValueIcon from '@images/mint_value.svg';
import ratomIcon from '@images/r_atom.svg';
import rdotIcon from '@images/r_dot.svg';
import rethIcon from '@images/r_eth.svg';
import rfisIcon from '@images/r_fis.svg';
import rksmIcon from '@images/r_ksm.svg';
import rmaticIcon from '@images/r_matic.svg';
import stafiWhiteIcon from '@images/stafi_white.svg';
import RPoolServer from '@servers/rpool';
import Button from '@shared/components/button/connect_button';
import Modal from '@shared/components/modal/connectModal';
import { useInterval } from '@util/utils';
import { Spin } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import Page_FIS from '../rATOM/selectWallet_rFIS/index';
import './LiquidityOverview.scss';
import LiquidityStaker from './LiquidityStaker';

const rPoolServer = new RPoolServer();

export default function LiquidityOverview() {
  const history = useHistory();
  const location = useLocation();
  const { platform, poolIndex } = useParams<any>();
  const refreshInterval = platform === 'BSC' || platform === 'Polygon' ? 3000 : 15000;

  let lpName = null,
    rTokenName = null;
  if (location.state) {
    lpName = location.state.lpName;
    rTokenName = location.state.rTokenName;
  }
  const dispatch = useDispatch();

  const [showStaker, setShowStaker] = useState(false);

  const [lpPrice, setLpPrice] = useState(1);
  const [overviewData, setOverviewData] = useState<any>(null);
  const [userMintToken, setUserMintToken] = useState<any>('--');
  const [userMintRatio, setUserMintRatio] = useState<any>('--');
  const [userMintReward, setUserMintReward] = useState<any>('--');
  const [fisTotalReward, setFisTotalReward] = useState<any>('--');
  const [fisClaimableReward, setFisClaimableReward] = useState<any>('--');
  const [fisLockedReward, setFisLockedReward] = useState<any>('--');
  const [claimIndexs, setClaimIndexs] = useState([]);
  const [claimModalVisible, setClaimModalVisible] = useState(false);
  const [fisAccountModalVisible, setFisAccountModalVisible] = useState(false);

  const { loading } = useSelector((state: any) => {
    return {
      loading: state.globalModule.loading,
    };
  });

  const { fisAccount, ethAccount, unitPriceList } = useSelector((state: any) => {
    return {
      fisAccount: state.FISModule.fisAccount,
      ethAccount: state.rETHModule.ethAccount,
      unitPriceList: state.bridgeModule.priceList,
    };
  });

  useEffect(() => {
    if (ethAccount && ethAccount.address) {
      dispatch(getRtokenPriceList());
    }
  }, [ethAccount && ethAccount.address]);

  useEffect(() => {
    initData();
  }, [ethAccount && ethAccount.address, unitPriceList, lpPrice]);

  useInterval(() => {
    initData();
  }, refreshInterval);

  const showContent = useMemo(() => {
    return ethAccount && ethAccount.address;
  }, [ethAccount && ethAccount.address]);

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
      return overviewData.totalMintedValue;
    }
    return res;
  }, [unitPriceList, rTokenName, overviewData]);

  const initData = async () => {
    if (ethAccount && ethAccount.address) {
      dispatch(get_eth_getBalance());
    }
    let unitPrice = unitPriceList?.find((item: any) => {
      return item.symbol === rTokenName;
    });
    let fisPrice = unitPriceList?.find((item: any) => {
      return item.symbol === 'FIS';
    });
    if (platform && poolIndex) {
      let response;
      if (ethAccount && ethAccount.address) {
        response = await rPoolServer.getLiquidityOverview(
          ethAccount.address,
          platform,
          poolIndex,
          lpPrice,
          fisPrice && fisPrice.price,
        );
        console.log('response:', response);
      }
      if (response) {
        setOverviewData(response);
        setUserMintToken(response.myMint);
        setUserMintRatio(response.myMintRatio);
        setUserMintReward(response.myReward);
        setFisTotalReward(response.fisTotalReward);
        setFisClaimableReward(response.fisClaimableReward);
        setFisLockedReward(response.fisLockedReward);
        setClaimIndexs(response.claimIndexs);
      }
    }
  };

  if (!platform || !lpName || !rTokenName) {
    history.replace('/rPool/home');
  }

  if (isNaN(poolIndex) || poolIndex < 0) {
    history.replace('/rPool/home');
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
                history.replace('/rPool/home');
              }
            }}
          />

          <div className='title' style={{ fontSize: showStaker ? '20px' : '30px' }}>
            {showContent ? (showStaker ? `MY STAKED ${lpName}` : 'rPool') : 'Connect'}
          </div>
        </div>

        {showContent && !showStaker && (
          <div className='content_container'>
            {rTokenName === 'rDOT' && <img src={rdotIcon} className='token_icon' />}
            {rTokenName === 'rMATIC' && <img src={rmaticIcon} className='token_icon' />}
            {rTokenName === 'rATOM' && <img src={ratomIcon} className='token_icon' />}
            {rTokenName === 'rFIS' && <img src={rfisIcon} className='token_icon' />}
            {rTokenName === 'rKSM' && <img src={rksmIcon} className='token_icon' />}
            {rTokenName === 'rETH' && <img src={rethIcon} className='token_icon' />}

            <div className='right_content'>
              <div className='title'>{lpName}</div>

              <div className='apr_container'>
                <div className='number'>28.34%</div>
                <div className='label'>APY</div>
              </div>

              <div className='divider' />

              <div className='content_row'>
                <img src={mintRewardTokenIcon} className='icon' />

                <div className='label'>Reward Token</div>

                <img src={stafiWhiteIcon} className='stafi_icon' />
              </div>

              <div className='content_row'>
                <img src={mintValueIcon} className='icon' />

                <div className='label'>Minted Value</div>

                <div className='content_text'>{mintedValue !== '--' ? `$${mintedValue}` : '--'}</div>
              </div>

              <div className='content_row'>
                <img src={mintMyMintIcon} className='icon' />

                <div className='label'>My Mint</div>

                <div className='content_text'>
                  {userMintToken !== '--' ? `${userMintToken}` : '--'} (
                  {userMintRatio !== '--' ? `${userMintRatio}` : '--'}
                  %)
                </div>
              </div>

              <div className='content_row'>
                <img src={mintMyRewardIcon} className='icon_small' />

                <div className='label'>My Reward</div>

                <div className='content_text'>{userMintReward !== '--' ? `$${userMintReward}` : '--'}</div>
              </div>

              <div className='button_container'>
                <div className='button' style={{ marginRight: '20px' }} onClick={() => setShowStaker(true)}>
                  Staking
                </div>

                <div className='button' onClick={() => setClaimModalVisible(true)}>
                  Add Liquidity
                </div>

                <div className='button' onClick={() => setShowStaker(true)}>
                  Claim Reward
                </div>
              </div>
            </div>
          </div>
        )}

        {showContent && showStaker && (
          <>
            <LiquidityStaker disabled={false} lpData={overviewData} initData={initData} />
          </>
        )}

        {!showContent && (
          <div style={{ marginTop: '150px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Button
              disabled={ethAccount && ethAccount.address}
              icon={metamask}
              width={'400px'}
              onClick={() => {
                dispatch(connectMetamask(config.goerliChainId()));
                dispatch(monitoring_Method());
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
