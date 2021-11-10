import classNames from 'classnames';
import qs from 'query-string';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import './index.scss';
import LiquidityPrograms from './LiquidityPrograms';
import MintPrograms from './MintPrograms';

export default function Inde(props: any) {
  const [index, setIndex] = useState(0);
  const history = useHistory();
  const location = useLocation();
  const match = useRouteMatch();


  useEffect(() => {
    const { tab } = qs.parse(location.search.slice(1));
    setIndex(tab === 'lp' ? 1 : 0);
  });

  return (
    <div>
      <div className='rpool_tab_container'>
        <div
          className={classNames('tab_title', index === 0 ? 'active' : '')}
          onClick={() => history.replace('/rPool/home?tab=mp')}>
          Mint Programs
        </div>

        <div
          className={classNames('tab_title', index === 1 ? 'active' : '')}
          onClick={() => history.replace('/rPool/home?tab=lp')}>
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
