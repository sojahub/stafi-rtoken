import { HContainer, Text } from '@components/commonComponents';
import closeIcon from '@images/ic_close_black.svg';
import stakeOverviewIcon from '@images/stake_overview.png';
import sendingIcon from '@images/stake_overview_send.svg';
import signatureIcon from '@images/stake_overview_signature.svg';
import stakeIcon from '@images/stake_overview_stake.png';
import stakeSwapIcon from '@images/stake_overview_stake_swap.png';
import { Modal } from 'antd';
import React from 'react';
import styled, { CSSProperties } from 'styled-components';
import './index.scss';

export interface StakeFeeItem {
  icon: any;
  title: string;
  amount: number;
  unit: string;
}

interface StakeOverviewModalProps {
  visible: boolean;
  tokenType: 'rDOT' | 'rFIS' | 'rKSM' | 'rATOM' | 'rSOL' | 'rMATIC' | 'rBNB';
  sendingFund?: string;
  signatureFee?: string;
  stakingFee?: string;
  stakingAndSwapFee?: string;
  onOk: Function;
  onCancel: Function;
}

export default function StakeOverviewModal(props: StakeOverviewModalProps) {
  let txCount = 0;
  if (!!props.sendingFund) {
    txCount++;
  }
  if (!!props.signatureFee) {
    txCount++;
  }
  if (!!props.stakingFee) {
    txCount++;
  }
  if (!!props.stakingAndSwapFee) {
    txCount++;
  }

  return (
    <Modal
      footer={false}
      closable={false}
      visible={props.visible}
      width={390}
      bodyStyle={modalBodyStyle}
      wrapClassName='stake_overview'
      style={{
        left: '88px',
        borderRadius: '10px',
      }}>
      <HeadContainer>
        <CloseIcon style={{ visibility: 'hidden' }} />

        <Text size='20px' color='#23292F' bold>
          Staking Overview
        </Text>

        <CloseIcon src={closeIcon} onClick={() => props.onCancel()} />
      </HeadContainer>

      <StakeOverviewIcon img={stakeOverviewIcon} />

      <Text size='16px' color='#23292F' bold mt='26px'>
        Stake process consists of {txCount} {txCount > 1 ? 'transactions' : 'transaction'}
      </Text>

      <Text size='12px' color='#4D4D4D' mt='5px'>
        Estimation of total gas required for these transactions
      </Text>

      <FeeListContainer>
        {!!props.sendingFund && (
          <HContainer mb='6px'>
            <HContainer>
              <FeeIcon src={sendingIcon} style={{ padding: '2px' }} />

              <Text size='12px' color='23292F' sameLineHeight>
                Send fund
              </Text>
            </HContainer>

            <Text size='12px' color='23292F' sameLineHeight>
              {props.sendingFund}
            </Text>
          </HContainer>
        )}

        {!!props.signatureFee && (
          <HContainer mb='6px'>
            <HContainer>
              <FeeIcon src={signatureIcon} />

              <Text size='12px' color='23292F' sameLineHeight>
                Signature
              </Text>
            </HContainer>

            <Text size='12px' color='23292F' sameLineHeight>
              {props.signatureFee}
            </Text>
          </HContainer>
        )}

        {!!props.stakingFee && (
          <HContainer mb='6px'>
            <HContainer>
              <FeeIcon src={stakeIcon} />

              <Text size='12px' color='23292F' sameLineHeight>
                Staking
              </Text>
            </HContainer>

            <Text size='12px' color='23292F' sameLineHeight>
              {props.stakingFee}
            </Text>
          </HContainer>
        )}

        {!!props.stakingAndSwapFee && (
          <HContainer mb='6px'>
            <HContainer>
              <FeeIcon src={stakeSwapIcon} />

              <Text size='12px' color='23292F' sameLineHeight>
                {'Staking & Swap'}
              </Text>
            </HContainer>

            <Text size='12px' color='23292F' sameLineHeight>
              {props.stakingAndSwapFee}
            </Text>
          </HContainer>
        )}
      </FeeListContainer>

      <Divider />

      <ButtonsContainer>
        <Text bold clickable size='16px' color='#737373' onClick={() => props.onCancel()}>
          Cancel
        </Text>

        <ContinueButton onClick={() => props.onOk()}>Continue</ContinueButton>
      </ButtonsContainer>
    </Modal>
  );
}

const modalBodyStyle: CSSProperties = {
  backgroundColor: 'white',
  borderRadius: '20px',
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  height: '450px',
  position: 'relative',
};

const HeadContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  align-self: stretch;
  margin: 15px 17px 0 17px;
`;

const CloseIcon = styled.img`
  width: 22px;
  height: 22px;
  padding: 5px;
  cursor: pointer;
`;

type StakeOverviewIconProps = {
  img: any;
};

const StakeOverviewIcon = styled.div<StakeOverviewIconProps>`
  width: 50px;
  height: 50px;
  margin-top: 25px;
  background: url(${(props) => props.img}) center center no-repeat;
  background-size: contain;
`;

const FeeListContainer = styled.div`
  align-self: stretch;
  margin: 48px 33px 0 49px;
`;

const FeeIcon = styled.img`
  width: 20px;
  height: 20px;
  padding: 2px;
`;

const Divider = styled.div`
  height: 1px;
  align-self: stretch;
  background-color: #e7e7e7;
  position: absolute;
  bottom: 75px;
  left: 0;
  right: 0;
`;

const ButtonsContainer = styled.div`
  align-self: flex-end;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 13px 20px 0 0;
  position: absolute;
  bottom: 20px;
`;

const ContinueButton = styled.div`
  cursor: pointer;
  background-color: #00f3ab;
  border-radius: 21px;
  height: 42px;
  width: 110px;
  color: #23292f;
  font-size: 16px;
  font-family: 'Helvetica-Bold', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 26px;
`;
