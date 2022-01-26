import { useState } from 'react';
import TradeModal from 'src/components/modal/TradeModal';
import styled from 'styled-components';

interface NewDataItemProps {
  rTokenName: string;
  icon: any;
  myStaked: string;
  rTokenAmount: string;
  apy: string;
  source: 'native' | 'erc20' | 'bep20' | 'spl';
  onSwapClick: () => void;
  latestReward?: string;
}

export const NewDataItem = (props: NewDataItemProps) => {
  const [tradeModalVisible, setTradeModalVisible] = useState(false);

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
          {props.myStaked}
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
            Trade
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
