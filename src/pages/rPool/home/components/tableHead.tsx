import React from 'react';

type Props = {
  isCompleted: boolean;
  sortField?: string;
  sortWay?: string;
  onClick?: Function;
};

export default function Index(props: Props) {
  return (
    <div className='head' style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ flex: '0 0 14%', paddingLeft: '20px' }}>Pair</div>

      <div style={{ flex: '0 0 14%' }}>Pool on</div>

      <div className='col  col5' style={{ flex: '0 0 14%' }}>
        Platform
      </div>

      <div className='col  col2' style={{ flex: '0 0 14%' }}>
        APY
      </div>

      <div className='col  col4' style={{ flex: '0 0 16%' }}>
        Liquidity
      </div>

      <div className='col  col5' style={{ flex: '0 0 14%' }}>
        {props.isCompleted ? 'Ends on' : 'Slippage'}
      </div>

      <div className='col col2' style={{ flex: '0 0 14%' }}>
        Farm
      </div>
    </div>
  );
}
