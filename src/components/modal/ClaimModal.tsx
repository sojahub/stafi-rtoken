import { Modal, Spin } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import close_bold_svg from 'src/assets/images/close_bold.svg';
import './ClaimModal.scss';

type Props = {
  visible: boolean;
  onClose: Function;
  onClickClaim: Function;
  totalReward: any;
  claimableReward: any;
  lockedReward: any;
};

export default function ClaimModal(props: Props) {
  const dispatch = useDispatch();
  const { totalReward, claimableReward, lockedReward } = props;

  const { loading } = useSelector((state: any) => {
    return {
      loading: state.globalModule.loading,
    };
  });

  const formatTotalReward = totalReward !== '--' ? totalReward : '--';
  const formatClaimableReward = claimableReward !== '--' ? claimableReward : '--';
  const formatLockedReward = lockedReward !== '--' ? lockedReward : '--';

  const claimDisabled = formatClaimableReward === '--' || Number(formatClaimableReward) <= Number(0);

  const clickClaim = () => {
    if (claimDisabled) {
      return;
    }
    props.onClickClaim && props.onClickClaim();
  };

  return (
    <Modal
      visible={props.visible}
      className='claim_reward_modal'
      destroyOnClose={false}
      closable={false}
      footer={null}
      title={null}
      bodyStyle={{
        backgroundColor: '#23292F',
      }}
      style={{
        left: '70px',
        top: '210px',
      }}>
      <Spin spinning={loading} size='large' tip='loading'>
        <div className='claim_reward_body'>
          <div className='head_container'>
            <div className='head_title'>Claim Reward</div>

            <div className={'icon_container_outer'}>
              <a className={'icon_container_inner'} onClick={() => props.onClose && props.onClose()}>
                <img src={close_bold_svg} className={'close_icon'} />
              </a>
            </div>
          </div>

          <div className='claim_container'>
            <div className='claim_amount'>{formatClaimableReward}</div>

            <div className='claim_button' style={{ opacity: claimDisabled ? 0.5 : 1 }} onClick={clickClaim}>
              Claim
            </div>
          </div>

          <div className='content_container'>
            <div className='left_content'>
              <div className='label'>Total Reward</div>
              <div className='label'>Claimable Reward</div>
              <div className='label'>Locked Reward</div>
            </div>

            <div className='right_content'>
              <div className='content'>{formatTotalReward} FIS</div>
              <div className='content'>{formatClaimableReward} FIS</div>
              <div className='content'>{formatLockedReward} FIS</div>
            </div>
          </div>
        </div>
      </Spin>
    </Modal>
  );
}
