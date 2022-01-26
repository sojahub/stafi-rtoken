import React from 'react';
import NumberUtil from 'src/util/numberUtil';
import './index.scss';

type Props = {
  totalValue: any;
};
export default function Index(props: Props) {
  return (
    <div className='rAsset_count_amount'>
      <div>Total Staked Value ($)</div>
      <div>
        {(props.totalValue && props.totalValue != '--') || props.totalValue === 0
          ? NumberUtil.handleEthRoundToFixed(props.totalValue)
          : '--'}
      </div>
    </div>
  );
}
