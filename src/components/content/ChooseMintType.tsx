import { message } from 'antd';
import { isEmpty } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import leftArrowSvg from 'src/assets/images/left_arrow.svg';
import { Connection } from '@solana/web3.js';
import config from 'src/config/index';
import {
  bridgeCommon_ChainFees,
  BSC_CHAIN_ID,
  ETH_CHAIN_ID,
  SOL_CHAIN_ID,
  STAFI_CHAIN_ID,
} from 'src/features/bridgeClice';
import { connectSoljs, setLoading } from 'src/features/globalClice';
import { checkEthAddress } from 'src/features/rETHClice';
import { checkAddress as checkSOLAddress, queryBalance } from 'src/features/rSOLClice';
import SolServer from 'src/servers/sol';
import Button from 'src/shared/components/button/button';
import AddressInputEmbed from 'src/shared/components/input/addressInputEmbed';
import web3Utils from 'web3-utils';
import StakeOverviewModal from '../../modal/StakeOverviewModal';
import './index.scss';
import MintTypeCard from './MintTypeCard';
import numberUtil from 'src/util/numberUtil';
import { rSymbol } from 'src/keyring/defaults';

const splToken = require('@solana/spl-token');

declare const ethereum: any;
declare const solana: any;
const solServer = new SolServer();

type ChooseMintTypeProps = {
  type: 'rDOT' | 'rFIS' | 'rKSM' | 'rATOM' | 'rSOL' | 'rMATIC' | 'rBNB';
  relayFee: any;
  clickBack: Function;
  clickStake: Function;
};

export default function ChooseMintType(props: ChooseMintTypeProps) {
  const dispatch = useDispatch();
  const [selectedChainId, setSelectedChainId] = useState(STAFI_CHAIN_ID);
  const [targetAddress, setTargetAddress] = useState('');
  const [stakeOverviewModalVisible, setStakeOverviewModalVisible] = useState(false);
  const [showAddSplTokenButton, setShowAddSplTokenButton] = useState(props.type === 'rSOL');
  const [maticStakeEthFee, setMaticStakeEthFee] = useState('-- ETH');

  const { processSlider, erc20SwapFee, bep20SwapFee, slp20SwapFee, gasPrice, fisAccountAddress } = useSelector(
    (state: any) => {
      return {
        processSlider: state.globalModule.processSlider,
        erc20SwapFee: state.bridgeModule.erc20EstimateFee,
        bep20SwapFee: state.bridgeModule.bep20EstimateFee,
        slp20SwapFee: state.bridgeModule.slp20EstimateFee,
        gasPrice: state.ETHModule.gasPrice,
        fisAccountAddress: state.FISModule.fisAccount && state.FISModule.fisAccount.address,
      };
    },
  );

  const { metaMaskNetworkId, metaMaskAddress, solAddress, solBalance } = useSelector((state: any) => {
    return {
      metaMaskAddress: state.globalModule.metaMaskAddress,
      metaMaskNetworkId: state.globalModule.metaMaskNetworkId,
      solAddress: state.rSOLModule.solAddress,
      solBalance: state.rSOLModule.transferrableAmountShow,
    };
  });

  useEffect(() => {
    if (props.type === 'rMATIC') {
      if (!isNaN(gasPrice)) {
        const feeInEth = web3Utils.fromWei(web3Utils.toBN(36928).mul(web3Utils.toBN(gasPrice)), 'ether');
        setMaticStakeEthFee(Math.round(Number(feeInEth) * 100000000) / 100000000 + ' ETH');
      }
    }
  }, [gasPrice]);

  const { sendingFund, signatureFee, stakingFee, stakingAndSwapFee } = useMemo(() => {
    if (props.type === 'rFIS') {
      if (selectedChainId === STAFI_CHAIN_ID) {
        return {
          stakingFee: '0.004 FIS',
        };
      } else if (selectedChainId === ETH_CHAIN_ID) {
        return {
          stakingAndSwapFee:
            Math.round((0.004 + Number(isNaN(erc20SwapFee) ? 0 : erc20SwapFee)) * 1000000) / 1000000 + ' FIS',
        };
      } else if (selectedChainId === BSC_CHAIN_ID) {
        return {
          stakingAndSwapFee:
            Math.round((0.004 + Number(isNaN(bep20SwapFee) ? 0 : bep20SwapFee)) * 1000000) / 1000000 + ' FIS',
        };
      }
    } else if (props.type === 'rDOT') {
      if (selectedChainId === STAFI_CHAIN_ID) {
        return {
          sendingFund: '0.015 DOT',
          signatureFee: '0',
          stakingFee: props.relayFee + 0.003 + ' FIS',
        };
      } else if (selectedChainId === ETH_CHAIN_ID) {
        return {
          sendingFund: '0.015 DOT',
          signatureFee: '0',
          stakingAndSwapFee:
            Math.round((props.relayFee + 0.003 + Number(isNaN(erc20SwapFee) ? 0 : erc20SwapFee)) * 1000000) / 1000000 +
            ' FIS',
        };
      } else if (selectedChainId === BSC_CHAIN_ID) {
        return {
          sendingFund: '0.015 DOT',
          signatureFee: '0',
          stakingAndSwapFee:
            Math.round((props.relayFee + 0.003 + Number(isNaN(bep20SwapFee) ? 0 : bep20SwapFee)) * 1000000) / 1000000 +
            ' FIS',
        };
      }
    } else if (props.type === 'rKSM') {
      if (selectedChainId === STAFI_CHAIN_ID) {
        return {
          sendingFund: '0.00005 KSM',
          signatureFee: '0',
          stakingFee: props.relayFee + 0.003 + ' FIS',
        };
      } else if (selectedChainId === ETH_CHAIN_ID) {
        return {
          sendingFund: '0.00005 KSM',
          signatureFee: '0',
          stakingAndSwapFee:
            Math.round((props.relayFee + 0.003 + Number(isNaN(erc20SwapFee) ? 0 : erc20SwapFee)) * 1000000) / 1000000 +
            ' FIS',
        };
      } else if (selectedChainId === BSC_CHAIN_ID) {
        return {
          sendingFund: '0.00005 KSM',
          signatureFee: '0',
          stakingAndSwapFee:
            Math.round((props.relayFee + 0.003 + Number(isNaN(bep20SwapFee) ? 0 : bep20SwapFee)) * 1000000) / 1000000 +
            ' FIS',
        };
      }
    } else if (props.type === 'rATOM') {
      if (selectedChainId === STAFI_CHAIN_ID) {
        return {
          sendingFund: '0.002 ATOM',
          stakingFee: props.relayFee + 0.003 + ' FIS',
        };
      } else if (selectedChainId === ETH_CHAIN_ID) {
        return {
          sendingFund: '0.002 ATOM',
          stakingAndSwapFee:
            Math.round((props.relayFee + 0.003 + Number(isNaN(erc20SwapFee) ? 0 : erc20SwapFee)) * 1000000) / 1000000 +
            ' FIS',
        };
      } else if (selectedChainId === BSC_CHAIN_ID) {
        return {
          sendingFund: '0.002 ATOM',
          stakingAndSwapFee:
            Math.round((props.relayFee + 0.003 + Number(isNaN(bep20SwapFee) ? 0 : bep20SwapFee)) * 1000000) / 1000000 +
            ' FIS',
        };
      }
    } else if (props.type === 'rMATIC') {
      if (selectedChainId === STAFI_CHAIN_ID) {
        return {
          sendingFund: maticStakeEthFee,
          signatureFee: '0',
          stakingFee: props.relayFee + 0.003 + ' FIS',
        };
      } else if (selectedChainId === ETH_CHAIN_ID) {
        return {
          sendingFund: maticStakeEthFee,
          signatureFee: '0',
          stakingAndSwapFee:
            Math.round((props.relayFee + 0.003 + Number(isNaN(erc20SwapFee) ? 0 : erc20SwapFee)) * 1000000) / 1000000 +
            ' FIS',
        };
      } else if (selectedChainId === BSC_CHAIN_ID) {
        return {
          sendingFund: maticStakeEthFee,
          signatureFee: '0',
          stakingAndSwapFee:
            Math.round((props.relayFee + 0.003 + Number(isNaN(bep20SwapFee) ? 0 : bep20SwapFee)) * 1000000) / 1000000 +
            ' FIS',
        };
      }
    } else if (props.type === 'rBNB') {
      if (selectedChainId === STAFI_CHAIN_ID) {
        return {
          sendingFund: '0.0001 BNB',
          signatureFee: '0',
          stakingFee: props.relayFee + 0.003 + ' FIS',
        };
      } else if (selectedChainId === ETH_CHAIN_ID) {
        return {
          sendingFund: '0.0001 BNB',
          signatureFee: '0',
          stakingAndSwapFee:
            Math.round((props.relayFee + 0.003 + Number(isNaN(erc20SwapFee) ? 0 : erc20SwapFee)) * 1000000) / 1000000 +
            ' FIS',
        };
      } else if (selectedChainId === BSC_CHAIN_ID) {
        return {
          sendingFund: '0.0001 BNB',
          signatureFee: '0',
          stakingAndSwapFee:
            Math.round((props.relayFee + 0.003 + Number(isNaN(bep20SwapFee) ? 0 : bep20SwapFee)) * 1000000) / 1000000 +
            ' FIS',
        };
      }
    } else if (props.type === 'rSOL') {
      if (selectedChainId === STAFI_CHAIN_ID) {
        return {
          sendingFund: '0.00001 SOL',
          signatureFee: '0',
          stakingFee: props.relayFee + 0.003 + ' FIS',
        };
      } else if (selectedChainId === SOL_CHAIN_ID) {
        return {
          sendingFund: '0.00001 SOL',
          signatureFee: '0',
          stakingAndSwapFee:
            Math.round((props.relayFee + 0.003 + Number(isNaN(slp20SwapFee) ? 0 : slp20SwapFee)) * 1000000) / 1000000 +
            ' FIS',
        };
      }
    }
    return {};
  }, [props.type, selectedChainId, erc20SwapFee, bep20SwapFee, slp20SwapFee]);

  const showNative = true;
  const showErc20 =
    props.type === 'rFIS' ||
    props.type === 'rKSM' ||
    props.type === 'rDOT' ||
    props.type === 'rATOM' ||
    props.type === 'rMATIC';
  const showBep20 =
    props.type === 'rFIS' ||
    props.type === 'rKSM' ||
    props.type === 'rDOT' ||
    props.type === 'rATOM' ||
    props.type === 'rMATIC' ||
    props.type === 'rBNB';
  const showSpl = props.type === 'rSOL';

  useEffect(() => {
    dispatch(bridgeCommon_ChainFees());
  }, []);

  useEffect(() => {
    setTargetAddress('');
  }, [selectedChainId]);

  const updateSplTokenStatus = useCallback(async () => {
    if (selectedChainId !== SOL_CHAIN_ID || props.type !== 'rSOL') {
      setShowAddSplTokenButton(false);
      return;
    }
    if (!targetAddress || !checkSOLAddress(targetAddress)) {
      setShowAddSplTokenButton(true);
      return;
    }
    setShowAddSplTokenButton(true);
    const splTokenAccountPubkey = await solServer.getTokenAccountPubkey(targetAddress, 'rsol');
    setShowAddSplTokenButton(!splTokenAccountPubkey);
  }, [selectedChainId, targetAddress, props.type]);

  useEffect(() => {
    if (props.type === 'rSOL') {
      updateSplTokenStatus();
    }
  }, [props.type, updateSplTokenStatus]);

  const fillSolAddress = () => {
    if (solana && solana.isPhantom) {
      if (solana.isConnected) {
        setTargetAddress(solana.publicKey.toString());
      } else {
        solana.on('connect', () => {
          setTargetAddress(solana.publicKey.toString());
        });
        dispatch(connectSoljs());
      }
    }
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
            tokenType={props.type}
            relayFee={props.relayFee}
            selected={selectedChainId === STAFI_CHAIN_ID}
            chainId={STAFI_CHAIN_ID}
            onClick={(chainId: number) => setSelectedChainId(chainId)}
          />
        )}

        {showErc20 && (
          <MintTypeCard
            tokenType={props.type}
            relayFee={props.relayFee}
            swapFee={erc20SwapFee}
            selected={selectedChainId === ETH_CHAIN_ID}
            chainId={ETH_CHAIN_ID}
            onClick={(chainId: number) => setSelectedChainId(chainId)}
          />
        )}

        {showBep20 && (
          <MintTypeCard
            tokenType={props.type}
            relayFee={props.relayFee}
            swapFee={bep20SwapFee}
            selected={selectedChainId === BSC_CHAIN_ID}
            chainId={BSC_CHAIN_ID}
            onClick={(chainId: number) => setSelectedChainId(chainId)}
          />
        )}

        {showSpl && (
          <MintTypeCard
            tokenType={props.type}
            relayFee={props.relayFee}
            swapFee={slp20SwapFee}
            selected={selectedChainId === SOL_CHAIN_ID}
            chainId={SOL_CHAIN_ID}
            onClick={(chainId: number) => setSelectedChainId(chainId)}
          />
        )}
      </div>

      <div style={{ height: '110px', marginTop: '12px' }}>
        <div
          className='address_input_container'
          style={{ display: selectedChainId === STAFI_CHAIN_ID ? 'block' : 'block' }}>
          <div className='title'>Received address</div>

          <div className='input_address_container'>
            <div className='left_content'>
              <AddressInputEmbed
                disabled={processSlider || selectedChainId === STAFI_CHAIN_ID}
                backgroundcolor='#2B3239'
                placeholder={'...'}
                value={selectedChainId === STAFI_CHAIN_ID ? fisAccountAddress : targetAddress}
                onChange={(e: any) => {
                  setTargetAddress(e.target.value);
                }}
              />
            </div>

            <div
              className='connected_addr'
              style={{
                display:
                  !!targetAddress ||
                  selectedChainId === STAFI_CHAIN_ID ||
                  (selectedChainId === ETH_CHAIN_ID &&
                    (!metaMaskAddress || !config.metaMaskNetworkIsGoerliEth(metaMaskNetworkId))) ||
                  (selectedChainId === BSC_CHAIN_ID &&
                    (!metaMaskAddress || !config.metaMaskNetworkIsBsc(metaMaskNetworkId))) ||
                  (selectedChainId === SOL_CHAIN_ID && !solAddress)
                    ? 'none'
                    : 'flex',
              }}
              onClick={() => {
                if (selectedChainId === ETH_CHAIN_ID) {
                  setTargetAddress(metaMaskAddress);
                } else if (selectedChainId === BSC_CHAIN_ID) {
                  setTargetAddress(metaMaskAddress);
                } else if (selectedChainId === SOL_CHAIN_ID) {
                  fillSolAddress();
                }
              }}>
              Connected Addr
            </div>
          </div>

          <div className='divider' />

          <div className='note'>
            Note: Make sure you have the right address, otherwise you will not receive the token.
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
                const connection = new Connection(config.solRpcApi(), { wsEndpoint: config.solRpcWs() });

                const createTokenFeeRes = await splToken.Token.getMinBalanceRentForExemptAccount(connection);
                const createTokenFee = numberUtil.tokenAmountToHuman(createTokenFeeRes, rSymbol.Sol);
                if (Number(solBalance) < Number(createTokenFee)) {
                  message.error(`Insufficient available SOL balance, at least ${createTokenFee} SOL`);
                  dispatch(setLoading(false));
                  return;
                }

                const createSplTokenAccountResult = await solServer.createTokenAccount(targetAddress, 'rsol');
                if (createSplTokenAccountResult) {
                  setShowAddSplTokenButton(false);
                }
                dispatch(queryBalance());
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
        tokenType={props.type}
        sendingFund={sendingFund}
        signatureFee={signatureFee}
        stakingFee={stakingFee}
        stakingAndSwapFee={stakingAndSwapFee}
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
