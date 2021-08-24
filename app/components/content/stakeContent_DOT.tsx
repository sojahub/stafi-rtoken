import { getRsymbolByTokenTitle } from '@config/index';
import doubt from '@images/doubt.svg';
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
import { Tooltip } from 'antd';
import { multiply } from 'mathjs';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
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
  type: 'rDOT' | 'rFIS' | 'rKSM' | 'rATOM' | 'rSOL' | 'rMATIC';
  histroy?: any;
};
export default function Index(props: Props) {
  const [mintRewardAct, setMintRewardAct] = useState(null);
  const { bondSwitch, processSlider } = useSelector((state: any) => {
    return {
      bondSwitch: state.FISModule.bondSwitch,
      processSlider: state.globalModule.processSlider,
    };
  });

  useEffect(() => {
    initMintRewardAct();
  }, []);

  const initMintRewardAct = async () => {
    const activeAct = await rPoolServer.getCurrentActiveAct(props.type);
    setMintRewardAct(activeAct);
  };

  const fisRewardAmount = useMemo(() => {
    if (!mintRewardAct) {
      return 0;
    }
    return (
      Math.round(
        multiply(
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
    }
  };
  const haswarn = useMemo(() => {
    return !bondSwitch || !(props.validPools && props.validPools.length > 0);
  }, [props.validPools, bondSwitch]);
  return (
    <LeftContent className='stafi_stake_context'>
      <label className='title'>
        {props.type == 'rKSM' && `Stake KSM`}
        {props.type == 'rDOT' && `Stake DOT`}
        {props.type == 'rATOM' && `Stake ATOM`}
        {props.type == 'rFIS' && `Stake FIS`}
        {props.type == 'rSOL' && `Stake SOL`}
        {props.type == 'rMATIC' && `Stake MATIC`}
      </label>

      <div className={`input_panel dot_input_panel ${haswarn && 'showWarn'}`}>
        <div className='pool'>
          {props.type == 'rKSM' &&
            `${isNaN(props.totalStakedToken) ? '--' : props.totalStakedToken} KSM is staked via rKSM `}
          {props.type == 'rDOT' &&
            `${isNaN(props.totalStakedToken) ? '--' : props.totalStakedToken} DOT is staked via rDOT `}
          {props.type == 'rATOM' &&
            `${isNaN(props.totalStakedToken) ? '--' : props.totalStakedToken} ATOM is staked via rATOM `}
          {props.type == 'rFIS' &&
            `${isNaN(props.totalStakedToken) ? '--' : props.totalStakedToken} FIS is staked via rFIS `}
          {props.type == 'rSOL' &&
            `${isNaN(props.totalStakedToken) ? '--' : props.totalStakedToken} SOL is staked via rSOL `}
          {props.type == 'rMATIC' &&
            `${isNaN(props.totalStakedToken) ? '--' : props.totalStakedToken} MATIC is staked via rMATIC `}
          {/* <A>stats</A> */}
        </div>

        <div className='divider'></div>

        <div style={{ height: '35px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          {haswarn && <div className='warn'>Unable to stake, system is waiting for matching validators</div>}
        </div>

        <Input
          placeholder='AMOUNT'
          value={props.amount}
          maxInput={props.transferrableAmount}
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
          <div>You will get {props.type}</div>
          <div>{props.willAmount}</div>
        </div>

        <div className='money_panel_row'>
          <div className='money_panel_item'>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
              <div>Staking APR</div>
              <div
                style={{
                  marginLeft: '3px',
                  transform: 'scale(0.6)',
                  transformOrigin: 'left bottom',
                }}>
                +{props.unit}
              </div>
            </div>
            <div>{props.apr}</div>
          </div>

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
              <div>Mint Reward</div>
              <div
                style={{
                  marginLeft: '3px',
                  transform: 'scale(0.6)',
                  transformOrigin: 'left bottom',
                }}>
                +FIS
              </div>
            </div>
            <div>{fisRewardAmount}</div>
          </div>
        </div>

        {props.type != 'rFIS' && (
          <div className='money_panel_item'>
            <div className='relay_fee'>Relay Fee: {props.bondFees} FIS</div>
            <div></div>

            <div className='money_panel_item_doubt'>
              <Tooltip
                overlayClassName='doubt_overlay'
                placement='topLeft'
                title={
                  'Fee charged by the relayers to pay for the cross-chain contract interaction service fee between StaFi chain and designated chain.'
                }>
                <img src={doubt} />
              </Tooltip>
            </div>
          </div>
        )}
      </div>
      <div className='btns'>
        {' '}
        <Button
          disabled={!props.amount || props.amount == 0 || haswarn || processSlider}
          onClick={() => {
            props.onStakeClick && props.onStakeClick();
          }}>
          Stake
        </Button>
      </div>
    </LeftContent>
  );
}
