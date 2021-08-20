import ClaimModal from '@components/modal/ClaimModal';
import { getSymbolRTitle } from '@config/index';
import { getRtokenPriceList } from '@features/bridgeClice';
import { claimFisReward } from '@features/mintProgramsClice';
import backIcon from '@images/left_arrow.svg';
import mintMyMintIcon from '@images/mint_my_mint.svg';
import mintMyRewardIcon from '@images/mint_my_reward.svg';
import mintRewardTokenIcon from '@images/mint_reward_token.svg';
import mintValueIcon from '@images/mint_value.svg';
import rdotIcon from '@images/r_dot.svg';
import stafiWhiteIcon from '@images/stafi_white.svg';
import { rSymbol } from '@keyring/defaults';
import RPoolServer from '@servers/rpool';
import numberUtil from '@util/numberUtil';
import { useInterval } from '@util/utils';
import { multiply } from 'mathjs';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import './index.scss';

const rPoolServer = new RPoolServer();

export default function MintOverview() {
  const history = useHistory();
  const { tokenSymbol, cycle } = useParams<any>();
  const dispatch = useDispatch();

  const [actData, setActData] = useState<any>();
  const [userMintToken, setUserMintToken] = useState<any>('--');
  const [userMintRatio, setUserMintRatio] = useState<any>('--');
  const [userMintReward, setUserMintReward] = useState<any>('--');
  const [fisTotalReward, setFisTotalReward] = useState<any>('--');
  const [fisClaimableReward, setFisClaimableReward] = useState<any>('--');
  const [fisLockedReward, setFisLockedReward] = useState<any>('--');
  const [claimIndexs, setClaimIndexs] = useState([]);
  const [claimModalVisible, setClaimModalVisible] = useState(false);

  const { fisAccount, unitPriceList } = useSelector((state: any) => {
    return {
      fisAccount: state.FISModule.fisAccount,
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

  const initData = async () => {
    let unitPrice = unitPriceList?.find((item: any) => {
      return item.symbol === getSymbolRTitle(Number(tokenSymbol));
    });
    if (!unitPrice) {
      unitPrice = {
        price: '11.34',
        symbol: 'rMATIC',
      };
    }
    if (tokenSymbol && cycle && fisAccount && unitPrice) {
      const response = await rPoolServer.getMintOverview(tokenSymbol, cycle, fisAccount.address, unitPrice.price);
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

  const mintedValue = useMemo(() => {
    let res: any = '--';
    if (unitPriceList && actData) {
      let unitPrice = unitPriceList.find((item: any) => {
        return item.symbol === getSymbolRTitle(Number(tokenSymbol));
      });
      if (!unitPrice) {
        unitPrice = {
          price: '11.34',
          symbol: 'rMATIC',
        };
      }
      if (unitPrice) {
        res = numberUtil.amount_format(multiply(unitPrice.price, numberUtil.fisAmountToHuman(actData.total_reward)));
      }
    }
    return res;
  }, [unitPriceList, actData]);

  const claimReward = () => {
    dispatch(
      claimFisReward(claimIndexs, tokenSymbol, cycle, () => {
        setClaimModalVisible(false);
        initData();
      }),
    );
  };

  if (
    tokenSymbol.toString() !== rSymbol.Eth.toString() &&
    tokenSymbol.toString() !== rSymbol.Dot.toString() &&
    tokenSymbol.toString() !== rSymbol.Ksm.toString() &&
    tokenSymbol.toString() !== rSymbol.Matic.toString() &&
    tokenSymbol.toString() !== rSymbol.Atom.toString()
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

        <div className='title'>rPool</div>
      </div>

      <div className='content_container'>
        <img src={rdotIcon} className='token_icon' />

        <div className='right_content'>
          <div className='title'>Mint {getSymbolRTitle(Number(tokenSymbol))}</div>

          <div className='apr_container'>
            <div className='number'>28.34%</div>
            <div className='label'>APR</div>
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
              {userMintToken !== '--' ? `${userMintToken}` : '--'}({userMintRatio !== '--' ? `${userMintRatio}` : '--'}
              %)
            </div>
          </div>

          <div className='content_row'>
            <img src={mintMyRewardIcon} className='icon_small' />

            <div className='label'>My Reward</div>

            <div className='content_text'>{userMintReward !== '--' ? `$${userMintReward}` : '--'}</div>
          </div>

          <div className='button_container'>
            <div className='button' style={{ marginRight: '20px' }} onClick={() => history.push('/rDOT/home')}>
              Mint
            </div>

            <div className='button' onClick={() => setClaimModalVisible(true)}>
              Claim
            </div>
          </div>
        </div>
      </div>

      <ClaimModal
        visible={claimModalVisible}
        onClose={() => setClaimModalVisible(false)}
        onClickClaim={claimReward}
        totalReward={fisTotalReward}
        claimableReward={fisClaimableReward}
        lockedReward={fisLockedReward}
      />
    </div>
  );
}
