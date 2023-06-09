// import sort_arrow from 'src/assets/images/sort_arrow.svg';
// import sort_arrow_white from 'src/assets/images/sort_arrow_white.svg';
import React from 'react';

type Props = {
  sortField?: string;
  sortWay?: string;
  onClick?: Function;
};

export default function MintTableHead(props: Props) {
  return (
    <div className='head'>
      <div className='col col2'>Mint</div>

      <div className='col  col5'>Portal on</div>

      {/* <div
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
      </div> */}

      <div className='col col4 sort_field'>APY</div>

      <div className='col  col5'>Reward</div>

      <div className='col  col5'>Minted Value</div>

      <div className='col  col5'>Duration(Days)</div>

      <div className='col col2'>Farm</div>
    </div>
  );
}
