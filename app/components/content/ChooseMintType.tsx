import { BSC_CHAIN_ID, ETH_CHAIN_ID, SOL_CHAIN_ID, STAFI_CHAIN_ID } from '@features/bridgeClice';
import { setLoading } from '@features/globalClice';
import { checkEthAddress } from '@features/rETHClice';
import { checkAddress as checkSOLAddress } from '@features/rSOLClice';
import leftArrowSvg from '@images/left_arrow.svg';
import ethIcon from '@images/stake_overview_eth.svg';
import polkadotIcon from '@images/stake_overview_polkadot.svg';
import SolServer from '@servers/sol';
import Button from '@shared/components/button/button';
import AddressInputEmbed from '@shared/components/input/addressInputEmbed';
import { message } from 'antd';
import StakeOverviewModal from 'app/modal/StakeOverviewModal';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './index.scss';
import MintTypeCard from './MintTypeCard';

const solServer = new SolServer();

const maticStakeFees = [
  {
    icon: ethIcon,
    title: 'Approve fund',
    amount: 0.002,
    unit: 'ETH',
  },
  {
    icon: ethIcon,
    title: 'Sending fund',
    amount: 0.012,
    unit: 'ETH',
  },
  {
    icon: polkadotIcon,
    title: 'Signature',
    amount: 0.122,
    unit: 'ETH',
  },
  {
    icon: polkadotIcon,
    title: 'Staking',
    amount: 1.115,
    unit: 'ETH',
  },
  {
    icon: polkadotIcon,
    title: 'Swapping',
    amount: 23.221,
    unit: 'ETH',
  },
];

type ChooseMintTypeProps = {
  type: string;
  clickBack: Function;
  clickStake: Function;
};

export default function ChooseMintType(props: ChooseMintTypeProps) {
  const dispatch = useDispatch();
  const [selectedChainId, setSelectedChainId] = useState(STAFI_CHAIN_ID);
  const [targetAddress, setTargetAddress] = useState('');
  const [stakeOverviewModalVisible, setStakeOverviewModalVisible] = useState(false);
  const [showAddSplTokenButton, setShowAddSplTokenButton] = useState(false);

  const { processSlider } = useSelector((state: any) => {
    return {
      processSlider: state.globalModule.processSlider,
    };
  });

  const showNative = true;
  const showErc20 =
    props.type === 'rFIS' ||
    props.type === 'rKSM' ||
    props.type === 'rDOT' ||
    props.type === 'rATOM' ||
    props.type === 'rMatic';
  const showBep20 =
    props.type === 'rFIS' ||
    props.type === 'rKSM' ||
    props.type === 'rDOT' ||
    props.type === 'rATOM' ||
    props.type === 'rMATIC' ||
    props.type === 'rBNB';
  const showSpl = props.type === 'rSOL';

  useEffect(() => {
    setTargetAddress('');
  }, [selectedChainId]);

  useEffect(() => {
    if (props.type === 'rSOL') {
      updateSplTokenStatus();
    }
  }, [selectedChainId, targetAddress]);

  const updateSplTokenStatus = async () => {
    if (selectedChainId !== SOL_CHAIN_ID || props.type !== 'rSOL') {
      setShowAddSplTokenButton(false);
      return;
    }
    if (!targetAddress || !checkSOLAddress(targetAddress)) {
      setShowAddSplTokenButton(false);
      return;
    }
    const splTokenAccountPubkey = await solServer.getTokenAccountPubkey(targetAddress, 'rsol');
    setShowAddSplTokenButton(!splTokenAccountPubkey);
  };

  return (
    <div className='stafi_stake_mint_type'>
      <div className='title_container'>
        <img className='back_icon' onClick={() => props.clickBack()} src={leftArrowSvg} />

        <div className='title'>Choose minted type</div>
      </div>

      <div className='types_container'>
        {showNative && (
          <MintTypeCard
            selected={selectedChainId === STAFI_CHAIN_ID}
            chainId={STAFI_CHAIN_ID}
            onClick={(chainId: number) => setSelectedChainId(chainId)}
          />
        )}

        {showErc20 && (
          <MintTypeCard
            selected={selectedChainId === ETH_CHAIN_ID}
            chainId={ETH_CHAIN_ID}
            onClick={(chainId: number) => setSelectedChainId(chainId)}
          />
        )}

        {showBep20 && (
          <MintTypeCard
            selected={selectedChainId === BSC_CHAIN_ID}
            chainId={BSC_CHAIN_ID}
            onClick={(chainId: number) => setSelectedChainId(chainId)}
          />
        )}

        {showSpl && (
          <MintTypeCard
            selected={selectedChainId === SOL_CHAIN_ID}
            chainId={SOL_CHAIN_ID}
            onClick={(chainId: number) => setSelectedChainId(chainId)}
          />
        )}
      </div>

      <div style={{ height: '110px', marginTop: '12px' }}>
        <div
          className='address_input_container'
          style={{ display: selectedChainId === STAFI_CHAIN_ID ? 'none' : 'block' }}>
          <div className='title'>Received address</div>

          <AddressInputEmbed
            backgroundcolor='#2B3239'
            placeholder={'...'}
            value={targetAddress}
            onChange={(e: any) => {
              setTargetAddress(e.target.value);
            }}
          />

          <div className='divider' />

          <div className='note'>
            Note: Make sure you have the right address, otherwise you will not receive the token If you provide a wrong
            address.
          </div>
        </div>
      </div>

      <div className='btns'>
        <Button
          disabled={(isEmpty(targetAddress) && selectedChainId !== STAFI_CHAIN_ID) || processSlider}
          onClick={async () => {
            if (selectedChainId === ETH_CHAIN_ID || selectedChainId === BSC_CHAIN_ID) {
              if (!checkEthAddress(targetAddress)) {
                message.error('Input address error');
                return;
              }
            }
            if (selectedChainId === SOL_CHAIN_ID) {
              if (!checkSOLAddress(targetAddress)) {
                message.error('Input address error');
                return;
              }
              if (showAddSplTokenButton) {
                dispatch(setLoading(true));
                const createSplTokenAccountResult = await solServer.createTokenAccount(targetAddress, 'rsol');
                if (createSplTokenAccountResult) {
                  setShowAddSplTokenButton(false);
                }
                dispatch(setLoading(false));
                return;
              }
            }
            setStakeOverviewModalVisible(true);
          }}>
          {showAddSplTokenButton ? 'Approve' : 'Stake'}
        </Button>
      </div>

      <StakeOverviewModal
        visible={stakeOverviewModalVisible}
        feeList={maticStakeFees}
        onOk={() => {
          setStakeOverviewModalVisible(false);
          props.clickStake(selectedChainId, targetAddress);
        }}
        onCancel={() => {
          setStakeOverviewModalVisible(false);
        }}
      />
    </div>
  );
}
