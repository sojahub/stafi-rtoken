import config from '@config/index';
import dow_svg from '@images/left_arrow_black.svg';
import rDOT_DOT_svg from '@images/rDOT_DOT.svg';
import rATOM_stafi_svg from '@images/selected_r_atom.svg';
import rDOT_stafi_svg from '@images/selected_r_dot.svg';
import rETH_stafi_svg from '@images/selected_r_eth.svg';
import rFIS_stafi_svg from '@images/selected_r_fis.svg';
import rKSM_stafi_svg from '@images/selected_r_ksm.svg';
import rMatic_stafi_svg from '@images/selected_r_matic.svg';
import rSOL_stafi_svg from '@images/selected_r_sol.svg';
import Button from '@shared/components/button/button';
import NumberUtil from '@util/numberUtil';
import React, { useState } from 'react';
import Modal from '../modal/swapModal';
import TradePopover from '../tradePopover';
import LeftContent from './leftContent';

type Props = {
  onRdeemClick?: Function;
  ratio?: any;
  tokenAmount?: any;
  ratioShow?: any;
  onStakeClick?: any;
  type: 'rDOT' | 'rETH' | 'rFIS' | 'rKSM' | 'rATOM' | 'rSOL' | 'rMATIC' | 'rBNB';
  totalUnbonding?: any;
  onSwapClick?: Function;
  onUniswapClick?: Function;
  hours?: number;
};

export default function Index(props: Props) {
  const [visibleModal, setVisibleModal] = useState(false);
  return (
    <LeftContent className='stafi_stake_info_context'>
      <div className='item'>
        <div className='title'>
          {props.type == 'rDOT' && <img src={rDOT_stafi_svg} style={{ width: '40px' }} />}
          {props.type == 'rKSM' && <img src={rKSM_stafi_svg} style={{ width: '40px' }} />}
          {props.type == 'rATOM' && <img src={rATOM_stafi_svg} style={{ width: '40px' }} />}
          {props.type == 'rETH' && <img src={rETH_stafi_svg} style={{ width: '40px' }} />}
          {props.type == 'rFIS' && <img src={rFIS_stafi_svg} style={{ width: '40px' }} />}
          {props.type == 'rSOL' && <img src={rSOL_stafi_svg} style={{ width: '40px' }} />}
          {props.type == 'rMATIC' && <img src={rMatic_stafi_svg} style={{ width: '40px' }} />}
          {props.type == 'rBNB' && <img src={rMatic_stafi_svg} style={{ width: '40px' }} />}
          {props.type}
        </div>

        <div className='content'>
          <div>{props.tokenAmount == '--' ? '--' : NumberUtil.handleFisAmountToFixed(props.tokenAmount)}</div>
          <div className='btns'>
            <Button
              size='small'
              btnType='ellipse'
              onClick={() => {
                props.onRdeemClick && props.onRdeemClick();
              }}>
              Redeem
            </Button>

            {props.type == 'rETH' && (
              <TradePopover
                data={[
                  { label: 'Curve', url: config.curve.rethURL },
                  { label: 'Uniswap', url: config.uniswap.rethURL },
                ]}>
                {' '}
                <Button size='small' btnType='ellipse'>
                  Trade <img className='dow_svg' src={dow_svg} />{' '}
                </Button>{' '}
              </TradePopover>
            )}
            {props.type != 'rETH' && (
              <Button
                onClick={() => {
                  if (props.type === 'rMATIC') {
                    window.open(
                      'https://quickswap.exchange/#/swap?inputCurrency=0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270&outputCurrency=0x9f28e2455f9ffcfac9ebd6084853417362bc5dbb',
                    );
                  } else {
                    setVisibleModal(true);
                  }
                }}
                size='small'
                btnType='ellipse'>
                Trade
              </Button>
            )}
          </div>
        </div>
        <div className='describe'>
          {props.type == 'rDOT' &&
            ` Your current staked DOT  is ${
              props.tokenAmount != '--' && props.ratio != '--'
                ? NumberUtil.handleFisRoundToFixed(props.tokenAmount * props.ratio)
                : '--'
            }`}
          {props.type == 'rFIS' &&
            ` Your current staked FIS  is ${
              props.tokenAmount != '--' && props.ratio != '--'
                ? NumberUtil.handleFisRoundToFixed(props.tokenAmount * props.ratio)
                : '--'
            }`}
          {props.type == 'rKSM' &&
            `Your current staked KSM  is ${
              props.tokenAmount != '--' && props.ratio != '--'
                ? NumberUtil.handleFisRoundToFixed(props.tokenAmount * props.ratio)
                : '--'
            }`}
          {props.type == 'rATOM' &&
            `Your current staked ATOM  is ${
              props.tokenAmount != '--' && props.ratio != '--'
                ? NumberUtil.handleAtomRoundToFixed(props.tokenAmount * props.ratio)
                : '--'
            }`}
          {props.type == 'rETH' &&
            `Your current staked ETH  is ${
              props.tokenAmount != '--' && props.ratio != '--'
                ? NumberUtil.handleAtomRoundToFixed(props.tokenAmount * props.ratio)
                : '--'
            }`}
          {props.type == 'rMATIC' &&
            `Your current staked MATIC  is ${
              props.tokenAmount != '--' && props.ratio != '--'
                ? NumberUtil.handleAtomRoundToFixed(props.tokenAmount * props.ratio)
                : '--'
            }`}
          {props.type == 'rBNB' &&
            `Your current staked BNB  is ${
              props.tokenAmount != '--' && props.ratio != '--'
                ? NumberUtil.handleAtomRoundToFixed(props.tokenAmount * props.ratio)
                : '--'
            }`}
          {props.type == 'rSOL' &&
            `Your current staked SOL  is ${
              props.tokenAmount != '--' && props.ratio != '--'
                ? NumberUtil.handleAtomRoundToFixed(props.tokenAmount * props.ratio)
                : '--'
            }`}

          {props.type == 'rDOT' && props.totalUnbonding > 0 && `. Unbonding DOT is ${props.totalUnbonding}`}
          {props.type == 'rFIS' && props.totalUnbonding > 0 && `. Unbonding FIS is ${props.totalUnbonding}`}
          {props.type == 'rKSM' && props.totalUnbonding > 0 && `. Unbonding KSM is ${props.totalUnbonding}`}
          {props.type == 'rATOM' && props.totalUnbonding > 0 && `. Unbonding ATOM is ${props.totalUnbonding}`}
          {props.type == 'rSOL' && props.totalUnbonding > 0 && `. Unbonding SOL is ${props.totalUnbonding}`}
          {props.type == 'rMATIC' && props.totalUnbonding > 0 && `. Unbonding MATIC is ${props.totalUnbonding}`}
          {props.type == 'rBNB' && props.totalUnbonding > 0 && `. Unbonding BNB is ${props.totalUnbonding}`}
        </div>
      </div>

      <div className='item'>
        <div className='title'>
          <img src={rDOT_DOT_svg} />
          {props.type == 'rDOT' && `rDOT / DOT`}
          {props.type == 'rFIS' && `rFIS / FIS`}
          {props.type == 'rKSM' && `rKSM / KSM`}
          {props.type == 'rATOM' && `rATOM / ATOM`}
          {props.type == 'rETH' && `rETH / ETH`}
          {props.type == 'rSOL' && `rSOL / SOL`}
          {props.type == 'rMATIC' && `rMATIC / MATIC`}
          {props.type == 'rBNB' && `rBNB / BNB`}
        </div>
        <div className='content'>
          <div>{props.ratioShow}</div>
          <div className='btns'>
            <Button
              onClick={() => {
                props.onStakeClick && props.onStakeClick();
              }}
              size='small'
              btnType='ellipse'>
              Stake
            </Button>
          </div>
        </div>
        <div className='describe'>Updated every {props.hours} hours</div>
      </div>
      <Modal
        type={props.type}
        visible={visibleModal}
        onCancel={() => {
          setVisibleModal(false);
        }}
        onOk={() => {
          // message.info("Swap will be available soon");
          props.onSwapClick && props.onSwapClick();
        }}
        onUniswapClick={() => {
          props.onUniswapClick && props.onUniswapClick();
        }}
      />
    </LeftContent>
  );
}
