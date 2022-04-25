// @ts-nocheck

import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import rETH from 'src/assets/images/selected_rETH.svg';
import config, { getRsymbolByTokenTitle } from 'src/config/index';
import { useMetaMaskAccount } from 'src/hooks/useMetaMaskAccount';
import RPoolServer from 'src/servers/rpool';
import A from 'src/shared/components/button/a';
import Button from 'src/shared/components/button/button';
import Input from 'src/shared/components/input/amountInput';
import numberUtil from 'src/util/numberUtil';
import './index.scss';
import LeftContent from './leftContent';

const rPoolServer = new RPoolServer();

type Props = {
  onStakeClick: Function;
  transferrableAmount?: any;
  amount?: number;
  onChange?: Function;
  willAmount?: string | 0;
  apr?: string;
  type: 'rETH';
  history?: any;
  totalStakedAmount?: any;
  waitingStaked: any;
  isPoolWaiting: boolean;
};
export default function Index(props: Props) {
  const [mintRewardAct, setMintRewardAct] = useState(null);
  const { metaMaskNetworkId } = useMetaMaskAccount();

  useEffect(() => {
    initMintRewardAct();
  }, []);

  const initMintRewardAct = async () => {
    const activeAct = await rPoolServer.getCurrentActiveEthAct();
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
    return rETH;
  };
  return (
    <LeftContent className='stafi_stake_context stafi_stake_context_eth'>
      <label className='title'>Stake ETH</label>

      <div className={`input_panel dot_input_panel`}>
        <div className='pool'>
          {props.isPoolWaiting ? (
            <>
              {props.waitingStaked} ETH is waiting to be staked in the{' '}
              <A
                onClick={() => {
                  props.history && props.history.push('/rETH/poolStatus');
                }}>
                pool
              </A>{' '}
              contracts
            </>
          ) : (
            <>
              {isNaN(props.totalStakedAmount) ? (
                <>-- ETH is staked in pool contracts</>
              ) : (
                <>
                  {numberUtil.amount_format(props.totalStakedAmount)} ETH is currently staked in{' '}
                  <A
                    onClick={() => {
                      props.history && props.history.push('/rETH/poolStatus');
                    }}>
                    pool
                  </A>{' '}
                  contracts
                </>
              )}
            </>
          )}
        </div>

        <div className='divider'></div>

        <div style={{ height: '35px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}></div>

        <Input
          placeholder='AMOUNT'
          value={props.amount}
          maxInput={props.transferrableAmount && props.transferrableAmount !== '--' ? props.transferrableAmount : 0}
          onChange={(e: any) => {
            props.onChange && props.onChange(e);
          }}
          icon={getIcon()}
        />

        <div className='tip'>
          {'Transferable'} {props.transferrableAmount}
        </div>
      </div>

      <div className='money_panel'>
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
                +ETH
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
      </div>

      <div className='btns'>
        {' '}
        <Button
          disabled={!props.amount || props.amount === 0 || !config.metaMaskNetworkIsGoerliEth(metaMaskNetworkId)}
          onClick={() => {
            props.onStakeClick && props.onStakeClick();
          }}>
          Stake
        </Button>
      </div>
    </LeftContent>
  );
}
