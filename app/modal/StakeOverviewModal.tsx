import { HContainer, Text } from '@components/commonComponents';
import closeIcon from '@images/ic_close_black.svg';
import stakeOverviewIcon from '@images/stake_overview.png';
import { Modal } from 'antd';
import React from 'react';
import styled, { CSSProperties } from 'styled-components';

export interface StakeFeeItem {
  icon: any;
  title: string;
  amount: number;
  unit: string;
}

interface StakeOverviewModalProps {
  visible: boolean;
  feeList: Array<StakeFeeItem>;
  onOk: Function;
  onCancel: Function;
}

export default function StakeOverviewModal(props: StakeOverviewModalProps) {
  return (
    <Modal
      footer={false}
      closable={false}
      visible={props.visible}
      width={390}
      bodyStyle={modalBodyStyle}
      style={{
        left: '88px',
      }}>
      <HeadContainer>
        <CloseIcon style={{ visibility: 'hidden' }} />

        <Text size='20px' color='#23292F' bold>
          Stake Overview
        </Text>

        <CloseIcon src={closeIcon} onClick={() => props.onCancel()} />
      </HeadContainer>

      <StakeOverviewIcon src={stakeOverviewIcon} />

      <Text size='16px' color='#23292F' bold mt='26px'>
        Stake process consists of 5 transactions
      </Text>

      <Text size='12px' color='#4D4D4D' mt='5px'>
        Estimation of total gas required for these transactions
      </Text>

      <FeeListContainer>
        {props.feeList.map((item) => (
          <HContainer mb='6px' key={item.title}>
            <HContainer>
              <FeeIcon src={item.icon} />

              <Text size='12px' color='23292F' sameLineHeight>
                {item.title}
              </Text>
            </HContainer>

            <Text size='12px' color='23292F' sameLineHeight>
              {item.amount} {item.unit}
            </Text>
          </HContainer>
        ))}
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

const StakeOverviewIcon = styled.img`
  width: 50px;
  height: 50px;
  margin-top: 25px;
`;

const FeeListContainer = styled.div`
  align-self: stretch;
  margin: 48px 33px 0 49px;
`;

const FeeIcon = styled.img`
  width: 18px;
  height: 18px;
`;

const Divider = styled.div`
  height: 1px;
  align-self: stretch;
  background-color: #e7e7e7;
  margin-top: 28px;
`;

const ButtonsContainer = styled.div`
  align-self: flex-end;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 13px 20px 27px 0;
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
