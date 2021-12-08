import Scrollbars from 'react-custom-scrollbars';
import InfiniteScroll from 'react-infinite-scroller';
import { useHistory } from 'react-router-dom';
import { useEraReward } from 'src/hooks/useEraReward';
import { usePlatform } from 'src/hooks/usePlatform';
import styled from 'styled-components';
import { HContainer, Text } from './commonComponents';
import LeftContent from './content/leftContent';
import { SelectPlatformPopover } from './content/SelectPlatformPopover';
import EraRewardChart from './EraRewardChart';
import no_data_png from 'src/assets/images/nodata.png';
import { useStakedValue } from 'src/hooks/useStakedValue';
import config from 'src/config';
import { isEmpty } from 'lodash';
import numberUtil from 'src/util/numberUtil';
import { useEffect } from 'react';
import { requestSwitchMetaMaskNetwork } from 'src/util/metaMaskUtil';

interface NewRewardProps {
  type: 'rDOT' | 'rETH' | 'rFIS' | 'rKSM' | 'rATOM' | 'rSOL' | 'rMATIC' | 'rBNB';
  hours: number;
}

export const NewReward = (props: NewRewardProps) => {
  const history = useHistory();
  const { platform } = usePlatform(props.type);
  const { lastEraReward, chartData, loadMore, hasMore, rewardList } = useEraReward(platform, props.type);
  const { stakedValue } = useStakedValue(platform, props.type);

  useEffect(() => {
    if (platform === 'ERC20') {
      requestSwitchMetaMaskNetwork('Ethereum');
    } else if (platform === 'BEP20') {
      requestSwitchMetaMaskNetwork('BSC');
    }
  }, [platform]);

  return (
    <LeftContent className='stafi_reward_card' padding='30px 22px 0 42px'>
      <Scrollbars id='list-scrollbars' style={{ height: '595px' }} autoHide>
        <RemidingContainer>
          <Text size='12px' color='#d9d9d9' lineHeight='14px'>
            Reminding: Holding rTokens still keeps generating staking reward while you depositing them to farm, mine and
            other yield generation protocols, but it can't be shown in the est.Reward as the calculation limits.
          </Text>
        </RemidingContainer>

        <div style={{ marginTop: '20px', marginLeft: '8px' }}>
          <SelectPlatformPopover
            type={props.type}
            currentPlatform={platform}
            onClick={(platform: string) => {
              history.push(history.location.pathname + `?platform=${platform}`);
            }}
          />
        </div>

        <HContainer mt='20px' ml='8px' justifyContent='space-between'>
          <Text size='22px' bold sameLineHeight>
            Staked Value
          </Text>

          <Text size='22px' bold sameLineHeight>
            ${stakedValue}
          </Text>
        </HContainer>

        <HContainer justifyContent='flex-end' mt='8px'>
          <HContainer>
            <Text size='14px' color='#00F3AB'>
              {lastEraReward !== '--'
                ? Number(lastEraReward) > 0 && Number(lastEraReward) < 0.000001
                  ? '<0.000001'
                  : `+${numberUtil.handleAmountFloorToFixed(lastEraReward, 6)}`
                : '--'}{' '}
              {props.type.slice(1)}
            </Text>

            <Text size='14px' ml='2px'>
              (last era)
            </Text>
          </HContainer>
        </HContainer>

        <Divider />
        {chartData !== undefined && (!chartData.chartYData || chartData.chartYData.length === 0) ? (
          <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <NoDataImage src={no_data_png} />
          </div>
        ) : (
          <EraRewardChart xData={chartData && chartData.chartXData} data={chartData && chartData.chartYData} />
        )}

        <Text size='22px' bold mt='-10px'>
          Details
        </Text>

        <HContainer>
          <Box width='53px'>
            <Text size='14px' color='#7c7c7c' bold>
              Era
            </Text>
          </Box>

          <Box width='118px'>
            <Text size='14px' color='#7c7c7c' bold>
              Staked {props.type.slice(1)}
            </Text>
          </Box>

          <Box width='118px'>
            <Text size='14px' color='#7c7c7c' bold>
              {props.type} : {props.type.slice(1)}
            </Text>
          </Box>

          <Box width='130px'>
            <Text size='14px' color='#7c7c7c' bold>
              {props.type}
            </Text>
          </Box>

          <Box width='80px'>
            <Text size='14px' color='#7c7c7c' bold>
              est. Reward
            </Text>
          </Box>
        </HContainer>

        <Divider />

        {rewardList !== undefined && rewardList.length === 0 && (
          <div style={{ height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <NoDataImage src={no_data_png} />
          </div>
        )}

        <InfiniteScroll
          className='list-contents'
          initialLoad={false}
          pageStart={1}
          loadMore={loadMore}
          hasMore={hasMore}
          loader={<div key={0}></div>}
          useWindow={false}>
          {rewardList ? (
            rewardList.map((item) => (
              <div key={item.era}>
                <HContainer height='37px'>
                  <Box width='53px'>
                    <Text size='14px' color='white' bold>
                      {item.era}
                    </Text>
                  </Box>

                  <Box width='118px'>
                    <Text size='14px' color='white' bold>
                      {item.stakeValue}
                    </Text>
                  </Box>

                  <Box width='118px'>
                    <Text size='14px' color='white' bold>
                      {item.rate}
                    </Text>
                  </Box>

                  <Box width='130px'>
                    <Text size='14px' color='white' bold>
                      {item.rTokenBalance}
                    </Text>
                  </Box>

                  <Box width='80px'>
                    <Text size='14px' color='#00F3AB' bold>
                      {Number(item.reward) === 0 && `0`}
                      {!isNaN(Number(item.reward)) &&
                        Number(item.reward) > 0 &&
                        Number(item.reward) < config.minReward &&
                        `<${config.minReward}`}
                      {!isNaN(Number(item.reward)) &&
                        Number(item.reward) >= config.minReward &&
                        `+${numberUtil.fixedAmountLength(item.reward)}`}
                      {isNaN(Number(item.reward)) && 'Fetching'}
                    </Text>
                  </Box>
                </HContainer>

                <div
                  style={{
                    height: '1px',
                    backgroundColor: '#383e44',
                  }}
                />
              </div>
            ))
          ) : (
            <div></div>
          )}
        </InfiniteScroll>
      </Scrollbars>

      <Text size='12px' color='#c4c4c4' mt='15px'>
        Era is updated every {props.hours} hours
      </Text>
    </LeftContent>
  );
};

const RemidingContainer = styled.div`
  background-color: rgba(73, 255, 201, 0.08);
  border-radius: 10px;
  border-color: rgba(0, 243, 171, 0.17);
  padding: 10px 9px 16px 9px;
`;

const Divider = styled.div`
  background-color: #383e44;
  height: 1px;
  margin-top: 8px;
`;

interface BoxProps {
  width: string;
}

const Box = styled.div<BoxProps>`
  width: ${(props) => props.width};
  max-width: ${(props) => props.width};
`;

const NoDataImage = styled.img`
  width: 200px;
`;
