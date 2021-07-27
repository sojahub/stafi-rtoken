import config from '@config/index';
import { noticesubType, noticeType, notice_text } from '@features/noticeClice';
import { Empty } from 'antd';
import React from 'react';
import {rSymbol,Symbol} from '@keyring/defaults';
type Props = {
  data?: any;
  onClick?: Function;
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
      <div className='title'>{props.data.title}</div>
      <div className='context'>
        {/* {props.data.content} */}
        {notice_text(props.data)}
      </div>
      <div className='footer'>
        <div>{props.data.dateTime}</div>
        <a
          className={`${props.data.status} ${!(props.data.rSymbol==Symbol.Eth || 
            props.data.rSymbol==Symbol.Fis) && props.data.subType}`}
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
            }
            if (!(props.data.rSymbol==Symbol.Eth || 
              props.data.rSymbol==Symbol.Fis) && 
              props.data.type==noticeType.Staker && 
              props.data.subType==noticesubType.Stake)  {
              props.onClick && props.onClick();
            }
          }}>
          {props.data.status}
        </a>
      </div>
    </div> 
  );
}
