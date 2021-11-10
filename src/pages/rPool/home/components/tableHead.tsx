import React from 'react';

type Props = {
  sortField?: string;
  sortWay?: string;
  onClick?: Function;
};

export default function Index(props: Props) {
  return (
    <div className='head'>
      <div className='col col2' style={{ paddingLeft: '20px' }}>
        Pair
      </div>

      <div className='col  col5'>Pool on</div>

      <div className='col  col5'>Platform</div>

      <div className='col  col2'>APY</div>

      <div className='col  col4'>Liquidity</div>

      <div className='col  col5'>Slippage</div>

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
      </div>

      <div
        className='col col4 sort_field'
        onClick={() => {
          props.onClick && props.onClick('liquidity');
        }}>
        Liquidity{' '}
        {props.sortField == 'liquidity' ? (
          <img className={`${props.sortWay == 'desc' && 'desc'}`} src={sort_arrow_white} />
        ) : (
          <img src={sort_arrow} />
        )}
      </div>

      <div
        className='col col5 sort_field'
        onClick={() => {
          props.onClick && props.onClick('slippage');
        }}>
        Slippage{' '}
        {props.sortField == 'slippage' ? (
          <img className={`${props.sortWay == 'desc' && 'desc'}`} src={sort_arrow_white} />
        ) : (
          <img src={sort_arrow} />
        )}
      </div> */}

      <div className='col col2'>Farm</div>
    </div>
  );
}