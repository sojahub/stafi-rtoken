import { useMemo, useState } from 'react';
import TradeModal from 'src/components/modal/TradeModal';
import styled from 'styled-components';
import arrowDown from 'src/assets/images/arrow_down_white.svg';
import { useLastEraReward } from 'src/hooks/useEraReward';
import { Tooltip } from 'antd';

interface NewDataItemProps {
  rTokenName: string;
  icon: any;
  myStaked: string;
  rTokenAmount: string;
  apy: string;
  source: 'Native' | 'ERC20' | 'BEP20' | 'SPL';
  onSwapClick: () => void;
  latestReward?: string;
}

export const NewDataItem = (props: NewDataItemProps) => {
  const [tradeModalVisible, setTradeModalVisible] = useState(false);
  const { lastEraReward } = useLastEraReward(props.source, props.rTokenName);

  const displayLastEraReward = useMemo(() => {
    if (isNaN(Number(lastEraReward))) {
      return '--';
    }
    if (Number(lastEraReward) === 0) {
      return '+0.000';
    }
    if (Number(lastEraReward) < 0.001) {
      return '<0.001';
    }
    return '+' + Math.round(1000 * Number(lastEraReward)) / 1000;
  }, [lastEraReward]);

  return (
    <>
      <TokenItemContainer>
        <HContainer
          style={{
            paddingLeft: '47px',
            width: '174px',
          }}>
          <img src={props.icon} width='26px' height='26px' alt='icon' />
          <TokenTitle>{props.rTokenName}</TokenTitle>
        </HContainer>

        <TableContent
          style={{
            width: '137px',
          }}>
          <HContainer>
            {props.myStaked}
            {props.rTokenName !== 'FIS' && (
              <Tooltip
                overlayClassName='doubt_overlay'
                placement='topLeft'
                overlayInnerStyle={{ color: '#A4A4A4' }}
                title={`The increased amount of Staked ${props.rTokenName.slice(1)} within the last 24h.`}>
                <LastEraReward>{displayLastEraReward}</LastEraReward>
              </Tooltip>
            )}
          </HContainer>
        </TableContent>

        <TableContent
          style={{
            width: '106px',
          }}>
          {props.rTokenAmount}
        </TableContent>

        <TableContent
          style={{
            width: '96px',
          }}>
          {props.apy}
        </TableContent>

        <HContainer>
          <StakeButton
            style={{
              opacity: props.rTokenName === 'rSOL' ? 0.5 : 1,
              cursor: props.rTokenName === 'rSOL' ? 'not-allowed' : 'pointer',
            }}
            onClick={() => {
              if (props.rTokenName === 'rSOL') {
                return;
              }
              setTradeModalVisible(true);
            }}>
            <div>Trade</div>
            <img
              src={arrowDown}
              alt='trade'
              style={{
                width: '10px',
                marginLeft: '4px',
              }}
            />
          </StakeButton>
          <StakeButton
            style={{
              marginLeft: '5px',
            }}
            onClick={props.onSwapClick}>
            Bridge
          </StakeButton>
        </HContainer>
      </TokenItemContainer>

      <TradeModal
        rTokenName={props.rTokenName}
        visible={tradeModalVisible}
        onClickSwap={() => {
          setTradeModalVisible(false);
          props.onSwapClick();
        }}
        onCancel={() => setTradeModalVisible(false)}
      />
    </>
  );
};

const HContainer = styled.div`
  display: flex;
  align-items: center;
`;

const TokenItemContainer = styled.div`
  width: 660px;
  height: 42px;
  background-color: #2b3239;
  border: 1px solid #494d51;
  border-radius: 4px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
`;

const TokenTitle = styled.div`
  color: white;
  font-size: 16px;
  line-height: 16px;
  font-weight: bold;
  margin-left: 10px;
`;

const LastEraReward = styled.div`
  margin-left: 10px;
  color: #00f3ab;
  font-size: 12px;
  border-bottom: dashed 1px #00f3ab91;
`;

const TableContent = styled.div`
  color: white;
  font-size: 14px;
  line-height: 14px;
`;

const StakeButton = styled.div`
  width: 66px;
  height: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: white;
  border-radius: 2px;
  border: 1px solid white;
  font-size: 12px;
`;
