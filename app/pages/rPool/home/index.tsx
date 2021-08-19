import classNames from 'classnames';
import React, { useState } from 'react';
import './index.scss';
import LiquidityPrograms from './LiquidityPrograms';
import MintPrograms from './MintPrograms';

export default function Inde(props: any) {
  const [index, setIndex] = useState(0);

  return (
    <div>
      <div className='rpool_tab_container'>
        <div className={classNames('tab_title', index === 0 ? 'active' : '')} onClick={() => setIndex(0)}>
          Mint Programs
        </div>

        <div className={classNames('tab_title', index === 1 ? 'active' : '')} onClick={() => setIndex(1)}>
          Liquidity Programs
        </div>
      </div>

      <div className='how_to_earn'>
        <div
          onClick={() => {
            window.open('https://docs.stafi.io/rproduct/rpool/the-guide-for-rpool');
          }}>
          How to earn
        </div>
      </div>

      {index === 0 && <MintPrograms />}
      {index === 1 && <LiquidityPrograms />}
    </div>
  );
}
