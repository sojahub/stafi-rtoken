import { Tooltip } from 'antd';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import doubt from 'src/assets/images/doubt.svg';
import rSOL_svg from 'src/assets/images/rSOL.svg';
import rATOM_svg from 'src/assets/images/r_atom.svg';
import rBnb_svg from 'src/assets/images/r_bnb.svg';
import rDOT_svg from 'src/assets/images/r_dot.svg';
import rETH_svg from 'src/assets/images/r_eth.svg';
import rFIS_svg from 'src/assets/images/r_fis.svg';
import rKSM_svg from 'src/assets/images/r_ksm.svg';
import rMatic_svg from 'src/assets/images/r_matic.svg';
import { RootState } from 'src/store';
import styled from 'styled-components';

const stakeList = ['ETH', 'FIS', 'BNB', 'DOT', 'ATOM', 'SOL', 'MATIC', 'KSM'];

export const TokenList = () => {
  const history = useHistory();

  const { ethApr, fisApr, bnbApr, dotApr, atomApr, solApr, maticApr, ksmApr } = useSelector((state: RootState) => {
    return {
      ethApr: state.rETHModule.stakerApr,
      fisApr: state.FISModule.stakerApr,
      bnbApr: state.rBNBModule.stakerApr,
      dotApr: state.rDOTModule.stakerApr,
      atomApr: state.rATOMModule.stakerApr,
      solApr: state.rSOLModule.stakerApr,
      maticApr: state.rMATICModule.stakerApr,
      ksmApr: state.rKSMModule.stakerApr,
    };
  });

  const getIcon = (tokenName: string) => {
    switch (tokenName) {
      case 'ETH':
        return rETH_svg;
      case 'FIS':
        return rFIS_svg;
      case 'DOT':
        return rDOT_svg;
      case 'KSM':
        return rKSM_svg;
      case 'ATOM':
        return rATOM_svg;
      case 'MATIC':
        return rMatic_svg;
      case 'BNB':
        return rBnb_svg;
      case 'SOL':
        return rSOL_svg;
      default:
        break;
    }
    return null;
  };

  return (
    <div>
      <TabContainer>
        <TitleContainer>
          <TabTitle>Stake</TabTitle>

          <TabIndicator />
        </TitleContainer>

        <TitleContainer
          style={{
            marginLeft: '40px',
          }}
          onClick={() => history.push('/rAsset/home')}>
          <TabTitle
            style={{
              color: 'white',
            }}>
            Dashboard
          </TabTitle>
        </TitleContainer>
      </TabContainer>

      <div style={{ marginTop: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <HContainer
          style={{
            width: '660px',
            marginBottom: '12px',
          }}>
          <TableHeader
            style={{
              paddingLeft: '47px',
              width: '190px',
            }}>
            Staked Asset
          </TableHeader>

          <TableHeader
            style={{
              width: '117px',
            }}>
            Derivative
          </TableHeader>

          <TableHeader
            style={{
              width: '110px',
            }}>
            APY
          </TableHeader>

          <TableHeader
            style={{
              width: '134px',
            }}>
            <HContainer style={{ alignItems: 'flex-start' }}>
              <div style={{ marginRight: '2px' }}>Liquidity</div>
              <Tooltip
                overlayClassName='doubt_overlay'
                placement='topLeft'
                overlayInnerStyle={{ color: '#A4A4A4' }}
                title={'xxxxx'}>
                <img src={doubt} alt='tooltip' />
              </Tooltip>
            </HContainer>
          </TableHeader>

          <TableHeader>Liquify</TableHeader>
        </HContainer>

        {stakeList.map((tokenName) => (
          <TokenItemContainer key={tokenName}>
            <HContainer
              style={{
                paddingLeft: '47px',
                width: '190px',
              }}>
              <img src={getIcon(tokenName)} width='26px' height='26px' alt='icon' />
              <TokenTitle>{tokenName}</TokenTitle>
            </HContainer>

            <TableContent
              style={{
                width: '117px',
              }}>
              r{tokenName}
            </TableContent>

            <TableContent
              style={{
                width: '110px',
              }}>
              {tokenName === 'ETH' && ethApr}
              {tokenName === 'FIS' && fisApr}
              {tokenName === 'BNB' && bnbApr}
              {tokenName === 'DOT' && dotApr}
              {tokenName === 'ATOM' && atomApr}
              {tokenName === 'SOL' && solApr}
              {tokenName === 'MATIC' && maticApr}
              {tokenName === 'KSM' && ksmApr}
            </TableContent>

            <TableContent
              style={{
                width: '134px',
              }}>
              83.23M
            </TableContent>

            <StakeButton
              onClick={() => {
                history.push(`/r${tokenName}/home`);
              }}>
              Stake
            </StakeButton>
          </TokenItemContainer>
        ))}
      </div>
    </div>
  );
};

const TabContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;

const TabTitle = styled.div`
  color: #00f3ab;
  font-size: 20px;
  line-height: 20px;
  font-weight: bold;
`;

const TabIndicator = styled.div`
  background-color: #00f3ab;
  width: 59px;
  height: 2px;
  margin-top: 10px;
`;

const HContainer = styled.div`
  display: flex;
  align-items: center;
`;

const TableHeader = styled.div`
  color: #818181;
  font-size: 14px;
  line-height: 14px;
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
  color: #00f3ab;
  border-radius: 2px;
  border: 1px solid #00f3ab;
  font-size: 12px;
`;
