import config from '@config/index';
import { noticesubType, noticeType, notice_text } from '@features/noticeClice';
import { Symbol } from '@keyring/defaults';
import { Empty } from 'antd';
import React from 'react';

type Props = {
  data?: any;
  onClick?: Function;
  hideNoticePopover?: Function;
  noData?: boolean;
};

export default function Index(props: Props) {
  if (props.noData) {
    return (
      <div className='empty'>
        <Empty />
      </div>
    );
  }
  return (
    <div className='popover_item'>
      <div className='title'>{props.data.title === 'DexSwap' ? 'Swap' : props.data.title}</div>

      <div className='context'>
        {/* {props.data.content} */}
        {notice_text(props.data)}
      </div>

      <div className='footer'>
        <div>{props.data.dateTime}</div>
        <a
          className={`${props.data.status} ${
            !(props.data.rSymbol == Symbol.Eth || props.data.rSymbol == Symbol.Fis) && props.data.subType
          }`}
          style={
            props.data.type == noticeType.Staker &&
            (props.data.subType == noticesubType.FeeStation ||
              props.data.subType == noticesubType.Claim ||
              props.data.subType == noticesubType.Unbond)
              ? { cursor: 'pointer', textDecoration: 'underline' }
              : {}
          }
          onClick={() => {
            if (
              props.data.type == noticeType.Staker &&
              props.data.subType == noticesubType.Swap &&
              props.data.subData
            ) {
              const { address, destSwapType } = props.data.subData;
              let viewTxUrl;
              if (destSwapType === 'native') {
                viewTxUrl = config.stafiScanUrl(address);
              } else if (destSwapType === 'erc20') {
                viewTxUrl = config.etherScanErc20TxInAddressUrl(address);
              } else if (destSwapType === 'bep20') {
                viewTxUrl = config.bscScanBep20TxInAddressUrl(address);
              }
              viewTxUrl && window.open(viewTxUrl);
              props.hideNoticePopover && props.hideNoticePopover();
            }
            if (
              props.data.type == noticeType.Staker &&
              props.data.subType == noticesubType.FeeStation &&
              props.data.subData
            ) {
              const { fisAddress } = props.data.subData;
              const viewTxUrl = config.stafiScanUrl(fisAddress);
              viewTxUrl && window.open(viewTxUrl);
              props.hideNoticePopover && props.hideNoticePopover();
            }
            if (
              props.data.type == noticeType.Staker &&
              props.data.subType == noticesubType.Claim &&
              props.data.subData
            ) {
              const { txHash } = props.data.subData;
              const viewTxUrl = config.stafiScanTxUrl(txHash);
              viewTxUrl && window.open(viewTxUrl);
              props.hideNoticePopover && props.hideNoticePopover();
            }
            if (
              props.data.type == noticeType.Staker &&
              props.data.subType == noticesubType.Unbond &&
              props.data.subData
            ) {
              const { txHash } = props.data.subData;
              const viewTxUrl = config.stafiScanTxUrl(txHash);
              viewTxUrl && window.open(viewTxUrl);
              props.hideNoticePopover && props.hideNoticePopover();
            }
            if (
              !(props.data.rSymbol == Symbol.Eth || props.data.rSymbol == Symbol.Fis) &&
              props.data.type == noticeType.Staker &&
              props.data.subType == noticesubType.Stake
            ) {
              props.hideNoticePopover && props.hideNoticePopover();
              props.onClick && props.onClick();
            }
          }}>
          {props.data.status}
        </a>
      </div>
    </div>
  );
}
