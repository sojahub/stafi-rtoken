import { Modal } from 'antd';
import React, { Fragment, useMemo } from 'react';
import closeIcon from 'src/assets/images/black_close.svg';
import styled from 'styled-components';
import curveIcon from 'src/assets/images/poolCurveIcon.svg';
import uniswapIcon from 'src/assets/images/poolUniswapIcon.png';
import quickSwapIcon from 'src/assets/images/quick_swap.png';
import pancakeIcon from 'src/assets/images/pancake.svg';
import rSwapIcon from 'src/assets/images/rdex.png';
import sifchainIcon from 'src/assets/images/sifchain.svg';
import atrixIcon from 'src/assets/images/atrix.svg';
import './tradeModal.scss';
import config from 'src/config';

type Props = {
  visible: boolean;
  onCancel: Function;
  rTokenName: string;
  onClickSwap?: () => void;
};

export default function TradeModal(props: Props) {
  const getTradeUrl = (platform) => {
    if (props.rTokenName === 'FIS') {
      if (platform === 'Uniswap') {
        return config.uniswap.fisURL;
      }
      if (platform === 'rDex') {
        return config.rDex.fisURL;
      }
    }
    if (props.rTokenName === 'rFIS') {
      if (platform === 'Uniswap') {
        return config.uniswap.rfisURL;
      }
      if (platform === 'rDex') {
        return config.rDex.rfisURL;
      }
    }
    if (props.rTokenName === 'rETH') {
      if (platform === 'Curve') {
        return config.curve.rethURL;
      }
      if (platform === 'Uniswap') {
        return config.uniswap.rethURL;
      }
      if (platform === 'rDex') {
        return config.rDex.rethURL;
      }
    }
    if (props.rTokenName === 'rDOT') {
      if (platform === 'Uniswap') {
        return config.uniswap.rdotURL;
      }
      if (platform === 'Pancake') {
        return config.pancake.rdotURL;
      }
      if (platform === 'rDex') {
        return config.rDex.rdotURL;
      }
    }
    if (props.rTokenName === 'rKSM') {
      if (platform === 'Uniswap') {
        return config.uniswap.rksmURL;
      }
      if (platform === 'rDex') {
        return config.rDex.rksmURL;
      }
    }
    if (props.rTokenName === 'rATOM') {
      if (platform === 'Uniswap') {
        return config.uniswap.ratomURL;
      }
      if (platform === 'Sifchain') {
        return config.sifchain.ratomURL;
      }
      if (platform === 'rDex') {
        return config.rDex.ratomURL;
      }
    }
    if (props.rTokenName === 'rMATIC') {
      if (platform === 'Quickswap') {
        return config.quickswap.rmaticURL;
      }
      if (platform === 'rDex') {
        return config.rDex.rmaticURL;
      }
    }
    if (props.rTokenName === 'rBNB') {
      if (platform === 'Pancake') {
        return config.pancake.rbnbURL;
      }
      if (platform === 'rDex') {
        return config.rDex.rbnbURL;
      }
    }
    if (props.rTokenName === 'rSOL') {
      if (platform === 'Atrix') {
        return config.atrix.rsolURL;
      }
      if (platform === 'rDex') {
        return config.rDex.rsolURL;
      }
    }
  };

  const { showCurve, showUniswap, showQuickswap, showPancake, showrDex, showSifchain, showAtrix } = useMemo(() => {
    return {
      showCurve: props.rTokenName === 'rETH',
      showUniswap: props.rTokenName !== 'rMATIC' && props.rTokenName !== 'rSOL' && props.rTokenName !== 'rBNB',
      showQuickswap: props.rTokenName === 'rMATIC',
      showPancake: props.rTokenName === 'rBNB' || props.rTokenName === 'rDOT',
      showSifchain: props.rTokenName === 'rATOM',
      showAtrix: props.rTokenName === 'rSOL',
      showrDex: true,
    };
  }, [props.rTokenName]);

  return (
    <Modal
      visible={props.visible}
      className='stafi_trade_modal'
      closable={false}
      style={{
        left: '60px',
        top: '140px',
      }}
      footer={null}
      onCancel={() => {
        props.onCancel();
      }}>
      <div style={{ position: 'relative', height: '477px' }}>
        <TitleContainer>
          <div>Trade {props.rTokenName}</div>

          <CloseIcon alt='close' src={closeIcon} onClick={() => props.onCancel()} />
        </TitleContainer>

        <SubTitle>Available Trading DEXes</SubTitle>

        <div style={{ display: 'flex', alignItems: 'center', marginTop: '48px' }}>
          <ListTitle style={{ margin: '0 70px 0 30px' }}>DEX</ListTitle>

          <ListTitle>Supported Token Standard</ListTitle>
        </div>

        <Divider style={{ marginTop: '15px' }} />

        <div>
          {showCurve && (
            <Fragment>
              <DexItem>
                <DexTitleContainer>
                  <DexIcon src={curveIcon} />
                  <div>Curve</div>
                </DexTitleContainer>

                <div style={{ width: '130px' }}>ERC20</div>

                <TradeButton>
                  <div
                    style={{
                      fontSize: '12px',
                      lineHeight: '12px',
                      fontWeight: 'bold',
                      color: '#23292f',
                      transform: 'scale(0.9)',
                      transformOrigin: 'center center',
                    }}
                    onClick={() => {
                      if (getTradeUrl('Curve')) {
                        window.open(getTradeUrl('Curve'));
                      }
                    }}>
                    Trade
                  </div>
                </TradeButton>
              </DexItem>

              <Divider style={{ margin: '0 15px' }} />
            </Fragment>
          )}

          {showUniswap && (
            <Fragment>
              <DexItem>
                <DexTitleContainer>
                  <DexIcon src={uniswapIcon} />
                  <div>Uniswap</div>
                </DexTitleContainer>

                <div style={{ width: '130px' }}>ERC20</div>

                <TradeButton>
                  <div
                    style={{
                      fontSize: '12px',
                      lineHeight: '12px',
                      fontWeight: 'bold',
                      color: '#23292f',
                      transform: 'scale(0.9)',
                      transformOrigin: 'center center',
                    }}
                    onClick={() => {
                      if (getTradeUrl('Uniswap')) {
                        props.onCancel();
                        window.open(getTradeUrl('Uniswap'));
                      }
                    }}>
                    Trade
                  </div>
                </TradeButton>
              </DexItem>

              <Divider style={{ margin: '0 15px' }} />
            </Fragment>
          )}

          {showQuickswap && (
            <Fragment>
              <DexItem>
                <DexTitleContainer>
                  <DexIcon src={quickSwapIcon} />
                  <div>Quickswap</div>
                </DexTitleContainer>

                <div style={{ width: '130px' }}>ERC20</div>

                <TradeButton>
                  <div
                    style={{
                      fontSize: '12px',
                      lineHeight: '12px',
                      fontWeight: 'bold',
                      color: '#23292f',
                      transform: 'scale(0.9)',
                      transformOrigin: 'center center',
                    }}
                    onClick={() => {
                      if (getTradeUrl('Quickswap')) {
                        window.open(getTradeUrl('Quickswap'));
                      }
                    }}>
                    Trade
                  </div>
                </TradeButton>
              </DexItem>

              <Divider style={{ margin: '0 15px' }} />
            </Fragment>
          )}

          {showPancake && (
            <Fragment>
              <DexItem>
                <DexTitleContainer>
                  <DexIcon src={pancakeIcon} />
                  <div>Pancake</div>
                </DexTitleContainer>

                <div style={{ width: '130px' }}>BEP20</div>

                <TradeButton>
                  <div
                    style={{
                      fontSize: '12px',
                      lineHeight: '12px',
                      fontWeight: 'bold',
                      color: '#23292f',
                      transform: 'scale(0.9)',
                      transformOrigin: 'center center',
                    }}
                    onClick={() => {
                      if (getTradeUrl('Pancake')) {
                        window.open(getTradeUrl('Pancake'));
                      }
                    }}>
                    Trade
                  </div>
                </TradeButton>
              </DexItem>

              <Divider style={{ margin: '0 15px' }} />
            </Fragment>
          )}

          {showSifchain && (
            <Fragment>
              <DexItem>
                <DexTitleContainer>
                  <DexIcon src={sifchainIcon} />
                  <div>Sifchain</div>
                </DexTitleContainer>

                <div style={{ width: '130px' }}>ERC20</div>

                <TradeButton>
                  <div
                    style={{
                      fontSize: '12px',
                      lineHeight: '12px',
                      fontWeight: 'bold',
                      color: '#23292f',
                      transform: 'scale(0.9)',
                      transformOrigin: 'center center',
                    }}
                    onClick={() => {
                      if (getTradeUrl('Sifchain')) {
                        window.open(getTradeUrl('Sifchain'));
                      }
                    }}>
                    Trade
                  </div>
                </TradeButton>
              </DexItem>

              <Divider style={{ margin: '0 15px' }} />
            </Fragment>
          )}

          {showAtrix && (
            <Fragment>
              <DexItem>
                <DexTitleContainer>
                  <DexIcon src={atrixIcon} />
                  <div>Atrix</div>
                </DexTitleContainer>

                <div style={{ width: '130px' }}>SPL</div>

                <TradeButton>
                  <div
                    style={{
                      fontSize: '12px',
                      lineHeight: '12px',
                      fontWeight: 'bold',
                      color: '#23292f',
                      transform: 'scale(0.9)',
                      transformOrigin: 'center center',
                    }}
                    onClick={() => {
                      if (getTradeUrl('Atrix')) {
                        window.open(getTradeUrl('Atrix'));
                      }
                    }}>
                    Trade
                  </div>
                </TradeButton>
              </DexItem>

              <Divider style={{ margin: '0 15px' }} />
            </Fragment>
          )}

          {showrDex && (
            <Fragment>
              <DexItem>
                <DexTitleContainer>
                  <DexIcon src={rSwapIcon} />
                  <div>rDex</div>
                </DexTitleContainer>

                <div style={{ width: '130px' }}>Native</div>

                <TradeButton>
                  <div
                    style={{
                      fontSize: '12px',
                      lineHeight: '12px',
                      fontWeight: 'bold',
                      color: '#23292f',
                      transform: 'scale(0.9)',
                      transformOrigin: 'center center',
                    }}
                    onClick={() => {
                      if (getTradeUrl('rDex')) {
                        window.open(getTradeUrl('rDex'));
                      }
                    }}>
                    Trade
                  </div>
                </TradeButton>
              </DexItem>

              <Divider style={{ margin: '0 15px' }} />
            </Fragment>
          )}
        </div>

        <div
          style={{
            color: '#23292f',
            fontSize: '12px',
            display: 'flex',
            justifyContent: 'center',
            position: 'absolute',
            bottom: '26px',
            left: 0,
            right: 0,
          }}>
          Use the{' '}
          <span style={{ color: '#00f3ab', cursor: 'pointer', margin: '0 4px' }} onClick={props.onClickSwap}>
            rBridge
          </span>{' '}
          to swap token standard.
        </div>
      </div>
    </Modal>
  );
}

const TitleContainer = styled.div`
  padding-top: 15px;
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  color: #23292f;
  font-size: 20px;
`;

const CloseIcon = styled.img`
  width: 12px;
  height: 12px;
  position: absolute;
  right: 20px;
  top: 24px;
  cursor: pointer;
`;

const SubTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  color: #23292f;
  font-size: 16px;
  line-height: 16px;
  margin-top: 24px;
`;

const ListTitle = styled.div`
  color: #7e7e7e;
  font-size: 14px;
  line-height: 14px;
`;

const Divider = styled.div`
  background-color: #e7e7e7a0;
  height: 1px;
`;

const DexItem = styled.div`
  display: flex;
  align-items: center;
  height: 42px;
  font-size: 16px;
  line-height: 16px;
  color: #23292f;
`;

const DexTitleContainer = styled.div`
  display: flex;
  align-items: center;
  width: 155px;
  margin-left: 30px;
`;

const DexIcon = styled.img`
  width: 18px;
  height: 18px;
  margin-right: 8px;
`;

const TradeButton = styled.div`
  background-color: #00f3ab;
  width: 52px;
  height: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 11px;
  cursor: pointer;
`;
