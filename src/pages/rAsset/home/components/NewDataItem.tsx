import { useMemo, useState } from 'react';
import TradeModal from 'src/components/modal/TradeModal';
import styled from 'styled-components';
import { useLastEraReward } from 'src/hooks/useEraReward';
import { Tooltip } from 'antd';
import { useHistory } from 'react-router';
import { e } from 'mathjs';

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
  const history = useHistory();
  const [tradeModalVisible, setTradeModalVisible] = useState(false);
  const { lastEraReward } = useLastEraReward(props.source, props.rTokenName);

  const [displayLastEraReward, rewardType] = useMemo(() => {
    if (isNaN(Number(lastEraReward))) {
      return ['--', 0];
    }
    if (Number(lastEraReward) === 0) {
      return ['0', 0];
    }
    if (Number(lastEraReward) > -0.001 && Number(lastEraReward) < 0) {
      return ['-<0.001', -1];
    }
    if (Number(lastEraReward) < 0) {
      return [Math.round(1000 * Number(lastEraReward)) / 1000, -1];
    }
    if (Number(lastEraReward) < 0.001 && Number(lastEraReward) > 0) {
      return ['<0.001', 1];
    }
    return ['+' + Math.round(1000 * Number(lastEraReward)) / 1000, 1];
  }, [lastEraReward]);

  return (
    <>
      <TokenItemContainer
        onClick={() => {
          history.push(`/${props.rTokenName}/staker/info?platform=${props.source}`);
        }}>
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
            <div
              style={{
                opacity: props.myStaked === '--' || Number(props.myStaked) === 0 ? 0.4 : 1,
              }}>
              {props.myStaked}
            </div>

            {(Number(props.myStaked) > 0 || props.myStaked === '<0.0001') && props.rTokenName !== 'FIS' && (
              <Tooltip
                overlayClassName='doubt_overlay'
                placement='topLeft'
                overlayInnerStyle={{ color: '#A4A4A4' }}
                title={`The increased amount of Staked ${props.rTokenName.slice(1)} within the last era.`}>
                <LastEraReward
                  style={{
                    color: rewardType === 0 ? '#818181' : rewardType > 1 ? '#00f3ab' : '#FF6565',
                    borderBottomColor: rewardType === 0 ? '#00000000' : rewardType > 1 ? '#00f3ab' : '#FF6565',
                  }}>
                  {displayLastEraReward}
                </LastEraReward>
              </Tooltip>
            )}
          </HContainer>
        </TableContent>

        <TableContent
          style={{
            width: '106px',
            opacity: props.rTokenAmount === '--' || Number(props.myStaked) === 0 ? 0.4 : 1,
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
              opacity: 1,
              cursor: 'pointer',
            }}
            onClick={(e) => {
              e.stopPropagation();
              setTradeModalVisible(true);
            }}>
            <div>Trade</div>
          </StakeButton>
          <StakeButton
            style={{
              marginLeft: '5px',
            }}
            onClick={(e) => {
              e.stopPropagation();
              props.onSwapClick();
            }}>
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
  cursor: pointer;
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
  line-height: 12px;
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
