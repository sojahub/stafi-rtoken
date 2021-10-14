import config, { getRsymbolByTokenTitle } from '@config/index';
import { BSC_CHAIN_ID, ETH_CHAIN_ID, SOL_CHAIN_ID } from '@features/bridgeClice';
import { setStakeSwapLoadingParams } from '@features/globalClice';
import doubt from '@images/doubt.svg';
import rBNB from '@images/selected_bnb.svg';
import rATOM from '@images/selected_rATOM.svg';
import rDOT from '@images/selected_rDOT.svg';
import rFIS from '@images/selected_rFIS.svg';
import rKSM from '@images/selected_rKSM.svg';
import rMATIC from '@images/selected_rMatic.svg';
import rSOL from '@images/solana.svg';
import RPoolServer from '@servers/rpool';
import Button from '@shared/components/button/button';
import Input from '@shared/components/input/amountInput';
import numberUtil from '@util/numberUtil';
import { message, Tooltip } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  const [mintRewardAct, setMintRewardAct] = useState(null);
  const [inChooseMintType, setInChooseMintType] = useState(false);

  const { bondSwitch, processSlider } = useSelector((state: any) => {
    return {
      bondSwitch: state.FISModule.bondSwitch,
      processSlider: state.globalModule.processSlider,
    };
  });

  const haswarn = useMemo(() => {
    return !bondSwitch || !(props.validPools && props.validPools.length > 0);
  }, [props.validPools, bondSwitch]);

  useEffect(() => {
    initMintRewardAct();
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
            props.onStakeClick(chainId, targetAddress);

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
            } KSM is staked via rKSM `}
          {props.type == 'rDOT' &&
            `${
              isNaN(props.totalStakedToken) ? '--' : numberUtil.amount_format(props.totalStakedToken, 6)
            } DOT is staked via rDOT `}
          {props.type == 'rATOM' &&
            `${
              isNaN(props.totalStakedToken) ? '--' : numberUtil.amount_format(props.totalStakedToken, 6)
            } ATOM is staked via rATOM `}
          {props.type == 'rFIS' &&
            `${
              isNaN(props.totalStakedToken) ? '--' : numberUtil.amount_format(props.totalStakedToken, 6)
            } FIS is staked via rFIS `}
          {props.type == 'rSOL' &&
            `${
              isNaN(props.totalStakedToken) ? '--' : numberUtil.amount_format(props.totalStakedToken, 6)
            } SOL is staked via rSOL `}
          {props.type == 'rMATIC' &&
            `${
              isNaN(props.totalStakedToken) ? '--' : numberUtil.amount_format(props.totalStakedToken, 6)
            } MATIC is staked via rMATIC `}
          {props.type == 'rBNB' &&
            `${
              isNaN(props.totalStakedToken) ? '--' : numberUtil.amount_format(props.totalStakedToken, 6)
            } BNB is staked via rBNB `}
          {/* <A>stats</A> */}
        </div>

        <div className='divider'></div>

        <div style={{ height: '35px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          {haswarn && <div className='warn'>Unable to stake, system is waiting for matching validators</div>}
        </div>

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
        {/* selected_rKSM */}
        {/* unit={"Max"} */}
      </div>

      <div className='money_panel'>
        <div className='money_panel_item'>
          <div style={{ fontFamily: 'Helvetica-Bold' }}>You will get {props.type}</div>
          <div>{props.willAmount}</div>
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
            <div className='relay_fee'>Relay Fee: {props.bondFees} FIS</div>

            <Tooltip
              overlayClassName='doubt_overlay'
              placement='topLeft'
              title={
                'Fee charged by the relayers to pay for the cross-chain contract interaction service fee between StaFi chain and designated chain.'
              }>
              <img src={doubt} style={{ marginLeft: '2px' }} />
            </Tooltip>
          </div>
        )}
      </div>

      <div className='btns'>
        {' '}
        <Button disabled={!props.amount || props.amount == 0 || haswarn || processSlider} onClick={clickNext}>
          Next
        </Button>
      </div>
    </LeftContent>
  );
}
