import sort_arrow from '@images/sort_arrow.svg';
import sort_arrow_white from '@images/sort_arrow_white.svg';
import React from 'react';

type Props = {
  sortField?: string;
  sortWay?: string;
  onClick?: Function;
};

export default function MintTableHead(props: Props) {
  return (
    <div className='head'>
      <div className='col col1'>Mint</div>

      <div className='col  col5'>Portal on</div>

      <div
        className='col col2 sort_field'
        onClick={() => {
          props.onClick && props.onClick('apy');
        }}>
        APY{' '}
        {props.sortField == 'apy' ? (
          <img className={`${props.sortWay == 'desc' && 'desc'}`} src={sort_arrow_white} />
        ) : (
          <img src={sort_arrow} />
        )}
      </div>

      <div className='col  col5'>Reward</div>

      <div className='col  col5'>Duration(Days)</div>

      <div className='col col6'>Farm</div>
    </div>
  );
}
