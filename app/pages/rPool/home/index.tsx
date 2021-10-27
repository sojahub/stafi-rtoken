import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import './index.scss';
import LiquidityPrograms from './LiquidityPrograms';
import MintPrograms from './MintPrograms';

export default function Inde(props: any) {
  const [index, setIndex] = useState(0);
  const { tab } = useParams<any>();

  const location = useLocation();

  useEffect(() => {
    setIndex(tab === 'lp' ? 1 : 0);
  }, []);

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

      <div className='how_to_earn' style={{ height: '20px' }}>
        {index === 1 && (
          <div
            onClick={() => {
              window.open('https://docs.stafi.io/rtoken-app/rpool/the-guide-for-rpool');
            }}>
            How to earn
          </div>
        )}
      </div>

      {index === 0 && <MintPrograms />}
      {index === 1 && <LiquidityPrograms />}
    </div>
  );
}
