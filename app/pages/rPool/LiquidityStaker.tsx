import { approveLpAllowance, claimLpReward, stakeLp, unstakeLp } from '@features/rPoolClice';
import RPoolServer from '@servers/rpool';
import AmountInputEmbedNew from '@shared/components/input/amountInputEmbedNew';
import { liquidityPlatformMatchMetaMask } from '@util/metaMaskUtil';
import numberUtil from '@util/numberUtil';
import { message } from 'antd';
import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import './LiquidityStaker.scss';

const rPoolServer = new RPoolServer();

type LiquidityStakerProps = {
  disabled: boolean;
  lpData: any;
  lpNameWithPrefix: string;
  initData?: Function;
};

export default function LiquidityStaker(props: LiquidityStakerProps) {
  const dispatch = useDispatch();
  const { lpPlatform, poolIndex } = useParams<any>();

  const [index, setIndex] = useState(0);
  const [amount, setAmount] = useState<any>();

  const { lpData, initData, lpNameWithPrefix } = props;

  const { metaMaskNetworkId, fisAccount, ethAccount, unitPriceList } = useSelector((state: any) => {
    return {
      metaMaskNetworkId: state.globalModule.metaMaskNetworkId,
      fisAccount: state.FISModule.fisAccount,
      ethAccount: state.rETHModule.ethAccount,
      unitPriceList: state.bridgeModule.priceList,
    };
  });

  const metaMaskNetworkMatched = useMemo(() => {
    return liquidityPlatformMatchMetaMask(metaMaskNetworkId, lpPlatform);
  }, [metaMaskNetworkId, lpPlatform]);

  const { totalReward, claimableReward, lockedReward } = useMemo(() => {
    const response = {
      totalReward: '--',
      claimableReward: '--',
      lockedReward: '--',
    };
    if (lpData && !isNaN(lpData.fisTotalReward)) {
      response.totalReward = numberUtil.handleAmountToFixed4(lpData.fisTotalReward);
    }
    if (lpData && !isNaN(lpData.fisClaimableReward)) {
      response.claimableReward = numberUtil.handleAmountToFixed4(lpData.fisClaimableReward);
    }
    if (lpData && !isNaN(lpData.fisLockedReward)) {
      response.lockedReward = numberUtil.handleAmountToFixed4(lpData.fisLockedReward);
    }
    return response;
  }, [lpData]);

  const lpBalance = useMemo(() => {
    if (!lpData || lpData.lpBalance === '--') {
      return '--';
    }
    return numberUtil.handleAmountRound(lpData.lpBalance, 2);
  }, [lpData && lpData.lpBalance]);

  const unstakableAmount = useMemo(() => {
    if (!lpData || lpData.userStakedAmount === '--') {
      return '--';
    }
    return numberUtil.handleAmountRound(lpData.userStakedAmount, 2);
  }, [lpData && lpData.userStakedAmount]);

  const maxInput = useMemo(() => {
    if (index === 0) {
      if (!lpBalance || lpBalance === '--') {
        return 0;
      }
      return lpBalance;
    } else {
      if (!unstakableAmount || unstakableAmount === '--') {
        return 0;
      }
      return unstakableAmount;
    }
  }, [index, lpBalance, unstakableAmount]);

  const clickMax = () => {
    if (!maxInput) {
      setAmount('');
    } else {
      setAmount(maxInput.toString());
    }
  };

  const clickApprove = () => {
    if (!metaMaskNetworkMatched) {
      return;
    }
    if (!amount || isNaN(amount)) {
      return;
    }
    if (!ethAccount || !ethAccount.address) {
      message.error('eth address empty');
      return;
    }
    if (!lpData || !lpData.stakeTokenAddress) {
      message.error('waiting for data');
      return;
    }
    dispatch(
      approveLpAllowance(ethAccount.address, lpData.stakeTokenAddress, lpPlatform, (success: boolean) => {
        if (success) {
          initData && initData();
          clickStake();
        }
      }),
    );
  };

  const clickStake = () => {
    if (!metaMaskNetworkMatched) {
      return;
    }
    if (!amount || isNaN(amount)) {
      return;
    }
    if (!ethAccount || !ethAccount.address) {
      message.error('eth address empty');
      return;
    }
    dispatch(
      stakeLp(amount, lpPlatform, poolIndex, lpNameWithPrefix, () => {
        setAmount('');
        initData && initData();
      }),
    );
  };

  const clickUnstake = () => {
    if (!metaMaskNetworkMatched) {
      return;
    }
    if (!amount || isNaN(amount)) {
      return;
    }
    if (!ethAccount || !ethAccount.address) {
      message.error('eth address empty');
      return;
    }
    dispatch(
      unstakeLp(amount, lpPlatform, poolIndex, lpNameWithPrefix, () => {
        setAmount('');
        initData && initData();
      }),
    );
  };

  const clickClaim = () => {
    if (!metaMaskNetworkMatched) {
      return;
    }
    if (!claimableReward || isNaN(Number(claimableReward)) || Number(claimableReward) <= Number(0)) {
      return;
    }
    if (!ethAccount || !ethAccount.address) {
      message.error('eth address empty');
      return;
    }
    dispatch(
      claimLpReward(lpPlatform, poolIndex, lpNameWithPrefix, claimableReward, () => {
        initData && initData();
      }),
    );
  };

  return (
    <div className='liquidity_staker'>
      <div className='lp_balance'>
        {lpData && !isNaN(lpData.userStakedAmount) ? numberUtil.amount_format(lpData.userStakedAmount) : '--'}
      </div>

      <div className='tab_container'>
        <div
          className={`tab_item ${index === 0 ? 'active' : ''}`}
          onClick={() => {
            setIndex(0);
            setAmount('');
          }}>
          Stake
        </div>

        <div
          className={`tab_item ${index === 1 ? 'active' : ''}`}
          style={{ paddingLeft: '30px', paddingRight: '30px' }}
          onClick={() => {
            setIndex(1);
            setAmount('');
          }}>
          Unstake
        </div>
      </div>

      <div className='h_container'>
        <div className='lp_input_container'>
          <AmountInputEmbedNew
            fromSource={'liquidity_programs'}
            maxInput={maxInput}
            placeholder='AMOUNT'
            disabled={props.disabled}
            value={amount}
            onChange={setAmount}
          />

          <div className='max' onClick={clickMax}>
            Max
          </div>
        </div>

        {index === 0 &&
          props.lpData &&
          !isNaN(props.lpData.lpAllowance) &&
          Number(props.lpData.lpAllowance) > Number(0) && (
            <div
              className='button'
              style={{
                marginLeft: '10px',
                opacity: Number(amount) > Number(0) && metaMaskNetworkMatched ? 1 : 0.5,
                cursor: Number(amount) > Number(0) && metaMaskNetworkMatched ? 'pointer' : 'not-allowed',
              }}
              onClick={clickStake}>
              Stake
            </div>
          )}

        {index === 0 &&
          props.lpData &&
          (Number(props.lpData.lpAllowance) === Number(0) || isNaN(props.lpData.lpAllowance)) && (
            <div
              className='button'
              style={{
                marginLeft: '10px',
                opacity: Number(amount) > Number(0) && metaMaskNetworkMatched ? 1 : 0.5,
                cursor: Number(amount) > Number(0) && metaMaskNetworkMatched ? 'pointer' : 'not-allowed',
              }}
              onClick={clickApprove}>
              Approve
            </div>
          )}

        {index === 1 && (
          <div
            className='button'
            style={{
              marginLeft: '10px',
              opacity: Number(amount) > Number(0) && metaMaskNetworkMatched ? 1 : 0.5,
              cursor: Number(amount) > Number(0) && metaMaskNetworkMatched ? 'pointer' : 'not-allowed',
            }}
            onClick={clickUnstake}>
            Untake
          </div>
        )}
      </div>

      <div className='balance_container'>
        {index === 0 && <div className='balance_text'>LP Balance: {lpBalance}</div>}
        {index === 1 && <div className='balance_text'>Unstakable: {unstakableAmount}</div>}
      </div>

      <div className='lp_stake_content_container'>
        <div className='left_content'>
          <div className='label'>Total Reward</div>
          <div className='label'>Claimable Reward</div>
          <div className='label'>Locked Reward</div>
        </div>

        <div className='right_content'>
          <div className='content'>{totalReward} FIS</div>
          <div className='content'>{claimableReward} FIS</div>
          <div className='content'>{lockedReward} FIS</div>
        </div>
      </div>

      <div
        className='button'
        style={{
          marginLeft: '447px',
          marginTop: '10px',
          opacity: Number(claimableReward) > Number(0) && metaMaskNetworkMatched ? 1 : 0.5,
          cursor: Number(claimableReward) > Number(0) && metaMaskNetworkMatched ? 'pointer' : 'not-allowed',
        }}
        onClick={clickClaim}>
        Claim
      </div>
    </div>
  );
}
