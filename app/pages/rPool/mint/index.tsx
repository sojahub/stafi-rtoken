import ClaimModal from '@components/modal/ClaimModal';
import config, { getSymbolRTitle } from '@config/index';
import { getRtokenPriceList } from '@features/bridgeClice';
import { queryBalance as fis_queryBalance } from '@features/FISClice';
import { connectPolkadot_fis } from '@features/globalClice';
import { claimFisReward, claimREthFisReward } from '@features/mintProgramsClice';
import { connectMetamask, monitoring_Method } from '@features/rETHClice';
import backIcon from '@images/left_arrow.svg';
import metamask from '@images/metamask.png';
import mintMyMintIcon from '@images/mint_my_mint.svg';
import mintMyRewardIcon from '@images/mint_my_reward.svg';
import mintRewardTokenIcon from '@images/mint_reward_token.svg';
import mintValueIcon from '@images/mint_value.svg';
import rDOT_svg from '@images/rDOT.svg';
import rdotIcon from '@images/r_dot.svg';
import rmaticIcon from '@images/r_matic.svg';
import stafiWhiteIcon from '@images/stafi_white.svg';
import { rSymbol } from '@keyring/defaults';
import RPoolServer from '@servers/rpool';
import Button from '@shared/components/button/connect_button';
import Modal from '@shared/components/modal/connectModal';
import numberUtil from '@util/numberUtil';
import { useInterval } from '@util/utils';
import { divide, multiply } from 'mathjs';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import Page_FIS from '../../rATOM/selectWallet_rFIS/index';
import './index.scss';

const rPoolServer = new RPoolServer();

export default function MintOverview() {
  const history = useHistory();
  const { tokenSymbol, cycle } = useParams<any>();
  const dispatch = useDispatch();

  const [rTokenName, setRTokenName] = useState('');
  const [actData, setActData] = useState<any>();
  const [userMintToken, setUserMintToken] = useState<any>('--');
  const [userMintRatio, setUserMintRatio] = useState<any>('--');
  const [userMintReward, setUserMintReward] = useState<any>('--');
  const [fisTotalReward, setFisTotalReward] = useState<any>('--');
  const [fisClaimableReward, setFisClaimableReward] = useState<any>('--');
  const [fisLockedReward, setFisLockedReward] = useState<any>('--');
  const [claimIndexs, setClaimIndexs] = useState([]);
  const [claimModalVisible, setClaimModalVisible] = useState(false);
  const [fisAccountModalVisible, setFisAccountModalVisible] = useState(false);

  const { fisAccount, ethAccount, unitPriceList } = useSelector((state: any) => {
    return {
      fisAccount: state.FISModule.fisAccount,
      ethAccount: state.rETHModule.ethAccount,
      unitPriceList: state.bridgeModule.priceList,
    };
  });

  useEffect(() => {
    if (fisAccount && fisAccount.address) {
      dispatch(getRtokenPriceList());
    }
  }, [fisAccount && fisAccount.address]);

  useEffect(() => {
    initData();
  }, [fisAccount && fisAccount.address, unitPriceList]);

  useInterval(() => {
    initData();
  }, 7000);

  useEffect(() => {
    setRTokenName(getSymbolRTitle(Number(tokenSymbol)));
  }, [tokenSymbol]);

  const showContent = useMemo(() => {
    if (Number(tokenSymbol) === rSymbol.Eth) {
      return ethAccount && ethAccount && fisAccount && fisAccount.address;
    } else {
      return fisAccount && fisAccount.address;
    }
  }, [fisAccount && fisAccount.address, ethAccount && ethAccount.address]);

  const mintedValue = useMemo(() => {
    let res: any = '--';
    if (unitPriceList && actData) {
      let unitPrice = unitPriceList.find((item: any) => {
        return item.symbol === rTokenName;
      });
      if (unitPrice) {
        const formatTotalReward = numberUtil.fisAmountToHuman(actData.total_reward);
        const formatRewardRate = numberUtil.tokenMintRewardRateToHuman(actData.reward_rate, Number(tokenSymbol));
        res = numberUtil.amount_format(multiply(unitPrice.price, divide(formatTotalReward, formatRewardRate)));
      }
    }
    return res;
  }, [unitPriceList, actData, rTokenName]);

  const initData = async () => {
    if (fisAccount) {
      dispatch(fis_queryBalance(fisAccount));
    }
    let unitPrice = unitPriceList?.find((item: any) => {
      return item.symbol === getSymbolRTitle(Number(tokenSymbol));
    });
    if (tokenSymbol && cycle) {
      let response;
      if (Number(tokenSymbol) === rSymbol.Eth) {
        if (ethAccount && ethAccount.address) {
          response = await rPoolServer.getREthMintOverview(
            cycle,
            ethAccount.address,
            unitPrice ? unitPrice.price : '--',
          );
        }
      } else {
        if (fisAccount && fisAccount.address) {
          response = await rPoolServer.getMintOverview(tokenSymbol, cycle, fisAccount.address, unitPrice ? unitPrice.price : '--');
          // response = await rPoolServer.getMintOverview(
          //   tokenSymbol,
          //   cycle,
          //   '34bwmgT1NtcL8FayGiFSB9F1qZFGPjhbDfTaZRoM2AXgjrpo',
          //   unitPrice ? unitPrice.price : '--',
          // );
        }
      }
      if (response) {
        setActData(response.actData);
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

  const claimReward = () => {
    if (Number(tokenSymbol) === rSymbol.Eth) {
      dispatch(
        claimREthFisReward(claimIndexs, cycle, () => {
          setClaimModalVisible(false);
          initData();
        }),
      );
    } else {
      dispatch(
        claimFisReward(claimIndexs, tokenSymbol, cycle, () => {
          setClaimModalVisible(false);
          initData();
        }),
      );
    }
  };

  if (
    tokenSymbol.toString() !== rSymbol.Eth.toString() &&
    tokenSymbol.toString() !== rSymbol.Dot.toString() &&
    tokenSymbol.toString() !== rSymbol.Ksm.toString() &&
    tokenSymbol.toString() !== rSymbol.Matic.toString() &&
    tokenSymbol.toString() !== rSymbol.Atom.toString() &&
    tokenSymbol.toString() !== rSymbol.Fis.toString()
  ) {
    history.replace('/rPool/home');
  }

  if (isNaN(cycle) || cycle <= 0) {
    history.replace('/rPool/home');
  }

  return (
    <div className='rpool_mint_overview'>
      <div className='title_container'>
        <img src={backIcon} className='back_icon' onClick={() => history.replace('/rPool/home')} />

        <div className='title'>{showContent ? 'rPool' : 'Connect'}</div>
      </div>

      {showContent ? (
        <div className='content_container'>
          {rTokenName === 'rDOT' && <img src={rdotIcon} className='token_icon' />}
          {rTokenName === 'rMATIC' && <img src={rmaticIcon} className='token_icon' />}

          <div className='right_content'>
            <div className='title'>Mint {rTokenName}</div>

            <div className='apr_container'>
              <div className='number'>
                1{rTokenName} :{' '}
                {actData ? numberUtil.tokenMintRewardRateToHuman(actData.reward_rate, Number(tokenSymbol)) : '--'}
                FIS
              </div>
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
                {userMintToken !== '--' ? `${userMintToken}` : '--'}(
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
              <div
                className='button'
                style={{ marginRight: '20px' }}
                onClick={() => history.push(`/${rTokenName}/home`)}>
                Mint
              </div>

              <div className='button' onClick={() => setClaimModalVisible(true)}>
                Claim
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: '150px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Button
            disabled={fisAccount && fisAccount.address}
            icon={rDOT_svg}
            onClick={() => {
              dispatch(
                connectPolkadot_fis(() => {
                  setFisAccountModalVisible(true);
                }),
              );
            }}>
            Connect to Polkadotjs extension
          </Button>

          <div style={{ height: '30px' }}></div>

          <Button
            disabled={ethAccount && ethAccount.address}
            icon={metamask}
            onClick={() => {
              dispatch(connectMetamask(config.goerliChainId()));
              dispatch(monitoring_Method());
            }}>
            Connect to MetaMask
          </Button>
        </div>
      )}

      <ClaimModal
        visible={claimModalVisible}
        onClose={() => setClaimModalVisible(false)}
        onClickClaim={claimReward}
        totalReward={fisTotalReward}
        claimableReward={fisClaimableReward}
        lockedReward={fisLockedReward}
      />

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
  );
}
