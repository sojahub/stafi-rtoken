// @ts-nocheck

import { message } from 'antd';
import PubSub from 'pubsub-js';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import rBNB from 'src/assets/images/selected_bnb.svg';
import rATOM from 'src/assets/images/selected_rATOM.svg';
import rDOT from 'src/assets/images/selected_rDOT.svg';
import rFIS from 'src/assets/images/selected_rFIS.svg';
import rKSM from 'src/assets/images/selected_rKSM.svg';
import rMATIC from 'src/assets/images/selected_rMatic.svg';
import rSOL from 'src/assets/images/solana.svg';
import config, { getRsymbolByTokenTitle } from 'src/config/index';
import { BSC_CHAIN_ID, ETH_CHAIN_ID, SOL_CHAIN_ID } from 'src/features/bridgeClice';
import { setStakeSwapLoadingParams } from 'src/features/globalClice';
import RPoolServer from 'src/servers/rpool';
import Button from 'src/shared/components/button/button';
import Input from 'src/shared/components/input/amountInput';
import numberUtil from 'src/util/numberUtil';
import ChooseMintType from './ChooseMintType';
import './index.scss';
import LeftContent from './leftContent';

const rPoolServer = new RPoolServer();

type Props = {
  onRecovery: Function;
  onStakeClick: Function;
  unit?: string;
  transferrableAmount?: any;
  amount?: number;
  onChange?: Function;
  willAmount?: string | 0;
  apr?: string;
  validPools?: any[];
  totalStakedToken?: any;
  bondFees?: any;
  type: 'rDOT' | 'rFIS' | 'rKSM' | 'rATOM' | 'rSOL' | 'rMATIC' | 'rBNB';
  histroy?: any;
};
export default function Index(props: Props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [mintRewardAct, setMintRewardAct] = useState(null);
  const [inChooseMintType, setInChooseMintType] = useState(false);

  const { bondSwitch, processSlider } = useSelector((state: any) => {
    return {
      bondSwitch: state.FISModule.bondSwitch,
      processSlider: state.globalModule.processSlider,
    };
  });

  const { fisTransferrableAmount, estimateBondTxFees, erc20SwapFee, bep20SwapFee, splSwapFee } = useSelector(
    (state: any) => {
      return {
        fisTransferrableAmount: state.FISModule.transferrableAmountShow,
        estimateBondTxFees: state.FISModule.estimateBondTxFees,
        erc20SwapFee: state.bridgeModule.erc20EstimateFee,
        bep20SwapFee: state.bridgeModule.bep20EstimateFee,
        splSwapFee: state.bridgeModule.slp20EstimateFee,
      };
    },
  );

  const haswarn = useMemo(() => {
    return !bondSwitch || !(props.validPools && props.validPools.length > 0);
  }, [props.validPools, bondSwitch]);

  useEffect(() => {
    initMintRewardAct();
    let token = PubSub.subscribe('stakeSuccess', (message: string, data?: any) => {
      props.onChange && props.onChange('');
      setInChooseMintType(false);
    });
    return () => {
      PubSub.unsubscribe(token);
    };
  }, []);

  const initMintRewardAct = async () => {
    const activeAct = await rPoolServer.getCurrentActiveAct(props.type);
    setMintRewardAct(activeAct);
  };

  const fisRewardAmount = useMemo(() => {
    if (!mintRewardAct || !props.amount) {
      return 0;
    }
    return (
      Math.round(
        numberUtil.mul(
          Number(props.amount),
          numberUtil.tokenMintRewardRateToHuman(mintRewardAct?.reward_rate, getRsymbolByTokenTitle(props.type)),
        ) * 1000000,
      ) / 1000000
    );
  }, [props.amount, mintRewardAct]);

  const getIcon = () => {
    if (props.type == 'rKSM') {
      return rKSM;
    } else if (props.type == 'rDOT') {
      return rDOT;
    } else if (props.type == 'rATOM') {
      return rATOM;
    } else if (props.type == 'rSOL') {
      return rSOL;
    } else if (props.type == 'rMATIC') {
      return rMATIC;
    } else if (props.type == 'rFIS') {
      return rFIS;
    } else if (props.type == 'rBNB') {
      return rBNB;
    }
  };

  const clickNext = () => {
    if (Number(props.amount) > Number(props.transferrableAmount)) {
      props.onChange('');
      message.error('The input amount exceeds your transferrable balance');
      return;
    }
    setInChooseMintType(true);
  };

  if (inChooseMintType) {
    return (
      <LeftContent padding='30px 0px 30px 10px' width='578px'>
        <ChooseMintType
          type={props.type}
          relayFee={props.bondFees}
          clickBack={() => setInChooseMintType(false)}
          clickStake={(chainId: number, targetAddress: string) => {
            let extraFee = 0;
            if (chainId === ETH_CHAIN_ID) {
              extraFee += Number(erc20SwapFee);
            } else if (chainId === BSC_CHAIN_ID) {
              extraFee += Number(bep20SwapFee);
            } else if (chainId === SOL_CHAIN_ID) {
              extraFee += Number(splSwapFee);
            }

            if (
              Number(fisTransferrableAmount) <
              Number(props.bondFees) + Number(numberUtil.fisAmountToHuman(estimateBondTxFees)) + Number(extraFee)
            ) {
              message.error('No enough FIS to pay for the fee');
              return;
            }

            const destPlatform =
              chainId === ETH_CHAIN_ID
                ? 'ERC20'
                : chainId === BSC_CHAIN_ID
                ? 'BEP20'
                : chainId === SOL_CHAIN_ID
                ? 'SPL'
                : 'NATIVE';
            const transferDetail = `${props.willAmount} ${props.type} ${destPlatform}`;
            let viewTxUrl;
            if (chainId === ETH_CHAIN_ID) {
              viewTxUrl = config.etherScanErc20TxInAddressUrl(targetAddress);
            } else if (chainId === BSC_CHAIN_ID) {
              viewTxUrl = config.bscScanBep20TxInAddressUrl(targetAddress);
            } else if (chainId === SOL_CHAIN_ID) {
              viewTxUrl = config.solScanSlp20TxInAddressUrl(targetAddress);
            }
            dispatch(setStakeSwapLoadingParams({ amount: props.willAmount, transferDetail, viewTxUrl }));

            props.onStakeClick(chainId, targetAddress);
          }}
        />
      </LeftContent>
    );
  }

  return (
    <LeftContent className='stafi_stake_context'>
      <label className='title'>
        {props.type == 'rKSM' && `Stake KSM`}
        {props.type == 'rDOT' && `Stake DOT`}
        {props.type == 'rATOM' && `Stake ATOM`}
        {props.type == 'rFIS' && `Stake FIS`}
        {props.type == 'rSOL' && `Stake SOL`}
        {props.type == 'rMATIC' && `Stake MATIC`}
        {props.type == 'rBNB' && `Stake BNB`}
      </label>

      <div className={`input_panel dot_input_panel ${haswarn && 'showWarn'}`}>
        <div className='pool'>
          {props.type == 'rKSM' &&
            `${
              isNaN(props.totalStakedToken) ? '--' : numberUtil.amount_format(props.totalStakedToken, 6)
            } KSM is currently staked`}
          {props.type == 'rDOT' &&
            `${
              isNaN(props.totalStakedToken) ? '--' : numberUtil.amount_format(props.totalStakedToken, 6)
            } DOT is currently staked`}
          {props.type == 'rATOM' &&
            `${
              isNaN(props.totalStakedToken) ? '--' : numberUtil.amount_format(props.totalStakedToken, 6)
            } ATOM is currently staked`}
          {props.type == 'rFIS' &&
            `${
              isNaN(props.totalStakedToken) ? '--' : numberUtil.amount_format(props.totalStakedToken, 6)
            } FIS is currently staked`}
          {props.type == 'rSOL' &&
            `${
              isNaN(props.totalStakedToken) ? '--' : numberUtil.amount_format(props.totalStakedToken, 6)
            } SOL is currently staked`}
          {props.type == 'rMATIC' &&
            `${
              isNaN(props.totalStakedToken) ? '--' : numberUtil.amount_format(props.totalStakedToken, 6)
            } MATIC is currently staked`}
          {props.type == 'rBNB' &&
            `${
              isNaN(props.totalStakedToken) ? '--' : numberUtil.amount_format(props.totalStakedToken, 6)
            } BNB is currently staked`}
          {/* <A>stats</A> */}
        </div>

        <div className='divider'></div>

        <div style={{ height: '35px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          {haswarn && <div className='warn'>Unable to stake, system is waiting for matching validators</div>}
        </div>

        {props.type === 'rATOM' ? (
          <div
            style={{
              backgroundColor: '#00F3AB',
              borderRadius: '4px',
              color: '#2B3239',
              fontSize: '14px',
              padding: '22px 14px',
            }}>
            rATOM is updated to V2 and migrated from StaFiChain to StaFiHub, stake ATOM from the V2{' '}
            <a
              style={{ fontWeight: 'bold', textDecoration: 'underline', color: '#2B3239' }}
              href='https://test-app.stafihub.io/rToken/rATOM/stake'
              target='_blank'
              rel='noreferrer'>
              Portal
            </a>
          </div>
        ) : (
          <>
            <Input
              placeholder='AMOUNT'
              value={props.amount}
              maxInput={isNaN(props.transferrableAmount) ? 0 : props.transferrableAmount}
              onChange={(e: any) => {
                props.onChange && props.onChange(e);
              }}
              icon={getIcon()}
            />

            <div className='tip'>
              {props.type == 'rDOT' ? `Stakable` : 'Transferable'} {props.transferrableAmount}
            </div>
          </>
        )}
      </div>

      <div className='money_panel' style={{ visibility: props.type === 'rATOM' ? 'hidden' : 'visible' }}>
        <div className='money_panel_item'>
          <div style={{ fontFamily: 'Helvetica-Bold' }}>You will get</div>
          <div>
            {props.willAmount} {props.type}
          </div>
        </div>

        <div className='money_panel_row'>
          <div className='money_panel_item'>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
              <div style={{ fontFamily: 'Helvetica-Bold' }}>Staking APR</div>
              <div
                style={{
                  width: '20px',
                  marginLeft: '3px',
                  transform: 'scale(0.6)',
                  transformOrigin: 'left bottom',
                }}>
                +{props.unit}
              </div>
            </div>
            <div>{props.apr}</div>
          </div>

          {mintRewardAct && (
            <>
              <div
                style={{
                  fontSize: '30px',
                  fontFamily: "'Helvetica-Bold'",
                  marginBottom: '6px',
                  marginLeft: '10px',
                  marginRight: '10px',
                  height: '35px',
                  color: 'white',
                  alignSelf: 'flex-end',
                }}>
                +
              </div>

              <div className='money_panel_item'>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                  <div style={{ fontFamily: 'Helvetica-Bold' }}>Mint Reward</div>
                  <div
                    style={{
                      width: '20px',
                      marginLeft: '3px',
                      transform: 'scale(0.6)',
                      transformOrigin: 'left bottom',
                    }}>
                    +FIS
                  </div>
                </div>
                <div>{fisRewardAmount}</div>
              </div>
            </>
          )}
        </div>

        {props.type != 'rFIS' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              fontSize: '14px',
              color: '#d5d5d5',
            }}>
            <div className='relay_fee' style={{ visibility: 'hidden' }}>
              Relay Fee: {props.bondFees} FIS
            </div>

            {/* <Tooltip
              overlayClassName='doubt_overlay'
              placement='topLeft'
              title={
                'Fee charged by the relayers to pay for the cross-chain contract interaction service fee between StaFi chain and designated chain.'
              }>
              <img src={doubt} style={{ marginLeft: '2px' }} />
            </Tooltip> */}
          </div>
        )}
      </div>

      <div className='btns'>
        {props.type === 'rATOM' ? (
          <a href='https://test-app.stafihub.io/rToken/rATOM/stake' target='_blank' rel='noreferrer'>
            <Button>rATOM V2</Button>
          </a>
        ) : (
          <Button
            disabled={
              !props.amount ||
              props.amount === 0 ||
              haswarn ||
              processSlider ||
              props.type === 'rBNB' ||
              props.type === 'rSOL'
            }
            onClick={clickNext}>
            Next
          </Button>
        )}
      </div>
    </LeftContent>
  );
}
