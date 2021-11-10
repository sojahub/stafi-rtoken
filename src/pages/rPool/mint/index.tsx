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
import rDOT_svg from 'src/assets/images/rDOT.svg';
import ratomIcon from 'src/assets/images/r_atom.svg';
import rbnbIcon from 'src/assets/images/r_bnb.svg';
import rdotIcon from 'src/assets/images/r_dot.svg';
import rethIcon from 'src/assets/images/r_eth.svg';
import rfisIcon from 'src/assets/images/r_fis.svg';
import rksmIcon from 'src/assets/images/r_ksm.svg';
import rmaticIcon from 'src/assets/images/r_matic.svg';
import stafiWhiteIcon from 'src/assets/images/stafi_white.svg';
import ClaimModal from 'src/components/modal/ClaimModal';
import config, { getSymbolRTitle, getSymbolTitle } from 'src/config/index';
import { getRtokenPriceList } from 'src/features/bridgeClice';
import { queryBalance as fis_queryBalance } from 'src/features/FISClice';
import { connectPolkadot_fis } from 'src/features/globalClice';
import { claimFisReward, claimREthFisReward } from 'src/features/mintProgramsClice';
import { connectMetamask, monitoring_Method } from 'src/features/rETHClice';
import { rSymbol } from 'src/keyring/defaults';
import RPoolServer from 'src/servers/rpool';
import Button from 'src/shared/components/button/connect_button';
import Modal from 'src/shared/components/modal/connectModal';
import numberUtil from 'src/util/numberUtil';
import { useInterval } from 'src/util/utils';
import Page_FIS from '../../rATOM/selectWallet_rFIS/index';
import './index.scss';

const rPoolServer = new RPoolServer();

export default function MintOverview() {
  const history = useHistory();
  const { tokenSymbol, cycle } = useParams<any>();
  const dispatch = useDispatch();

  const [rTokenName, setRTokenName] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [actData, setActData] = useState<any>();
  const [userMintToken, setUserMintToken] = useState<any>('--');
  const [userMintRatio, setUserMintRatio] = useState<any>('--');
  const [userMintReward, setUserMintReward] = useState<any>('--');
  const [fisTotalReward, setFisTotalReward] = useState<any>('--');
  const [fisClaimableReward, setFisClaimableReward] = useState<any>('--');
  const [fisLockedReward, setFisLockedReward] = useState<any>('--');
  const [vesting, setVesting] = useState('--');
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
    setTokenName(getSymbolTitle(Number(tokenSymbol)));
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
        const rTokenTotalReward = numberUtil.tokenAmountToHuman(actData.total_rtoken_amount, Number(tokenSymbol));
        res = numberUtil.amount_format(numberUtil.mul(unitPrice.price, rTokenTotalReward));
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
    let fisPrice = unitPriceList?.find((item: any) => {
      return item.symbol === 'FIS';
    });
    if (tokenSymbol && cycle) {
      let response;
      if (Number(tokenSymbol) === rSymbol.Eth) {
        if (ethAccount && ethAccount.address) {
          response = await rPoolServer.getREthMintOverview(cycle, ethAccount.address, fisPrice && fisPrice.price);
        }
      } else {
        if (fisAccount && fisAccount.address) {
          response = await rPoolServer.getMintOverview(
            tokenSymbol,
            cycle,
            fisAccount.address,
            fisPrice && fisPrice.price,
          );
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
        if (isNaN(response.vesting)) {
          setVesting('--');
        } else if (response.vesting * 1 > 0) {
          setVesting(Math.ceil(response.vesting * 1) + 'D');
        } else setVesting('0');
      }
    }
  };

  const claimReward = () => {
    if (Number(tokenSymbol) === rSymbol.Eth) {
      dispatch(
        claimREthFisReward(fisClaimableReward, claimIndexs, cycle, () => {
          setClaimModalVisible(false);
          initData();
        }),
      );
    } else {
      dispatch(
        claimFisReward(fisClaimableReward, claimIndexs, tokenSymbol, cycle, () => {
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
    tokenSymbol.toString() !== rSymbol.Fis.toString() &&
    tokenSymbol.toString() !== rSymbol.Bnb.toString() &&
    tokenSymbol.toString() !== rSymbol.Sol.toString() 
  ) {
    history.replace('/rPool/home?tab=mp');
  }

  if (isNaN(cycle) || cycle <= 0) {
    history.replace('/rPool/home?tab=mp');
  }

  return (
    <div className='rpool_mint_overview'>
      <div className='title_container'>
        <img src={backIcon} className='back_icon' onClick={() => history.replace('/rPool/home?tab=mp')} />

        <div className='title'>{showContent ? 'rPool' : 'Connect'}</div>
      </div>

      {showContent ? (
        <div className='content_container'>
          {rTokenName === 'rDOT' && <img src={rdotIcon} className='token_icon' />}
          {rTokenName === 'rMATIC' && <img src={rmaticIcon} className='token_icon' />}
          {rTokenName === 'rATOM' && <img src={ratomIcon} className='token_icon' />}
          {rTokenName === 'rFIS' && <img src={rfisIcon} className='token_icon' />}
          {rTokenName === 'rKSM' && <img src={rksmIcon} className='token_icon' />}
          {rTokenName === 'rETH' && <img src={rethIcon} className='token_icon' />}
          {rTokenName === 'rBNB' && <img src={rbnbIcon} className='token_icon' />}

          <div className='right_content'>
            <div className='title'>Mint {rTokenName}</div>

            <div className='apr_container'>
              <div className='number'>
                1{tokenName} :{' '}
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

            <div className='content_row'>
              <img src={mintVestingIcon} className='icon_small' />

              <div className='label'>Vesting</div>

              <div className='content_text'>{vesting}</div>
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

            {Number(tokenSymbol) === rSymbol.Eth && (
              <div className='hint'>rETH reward is calculated every 5 minutes</div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ marginTop: '150px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Button
            disabled={fisAccount && fisAccount.address}
            icon={rDOT_svg}
            width={'400px'}
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
            width={'400px'}
            onClick={() => {
              dispatch(connectMetamask(config.ethChainId()));
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
