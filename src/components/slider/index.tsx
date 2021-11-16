import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import logo from 'src/assets/images/logo2.png';
import rAsset_svg from 'src/assets/images/rAsset.svg';
import selected_rDEX_svg from 'src/assets/images/rDEX_active.svg';
import rDEX_svg from 'src/assets/images/rDEX_inactive.svg';
import rSOL_svg from 'src/assets/images/rSOL.svg';
import rATOM_svg from 'src/assets/images/r_atom.svg';
import rBnb_svg from 'src/assets/images/r_bnb.svg';
import rDOT_svg from 'src/assets/images/r_dot.svg';
import rETH_svg from 'src/assets/images/r_eth.svg';
import rFIS_svg from 'src/assets/images/r_fis.svg';
import rKSM_svg from 'src/assets/images/r_ksm.svg';
import rMatic_svg from 'src/assets/images/r_matic.svg';
import rPool_svg from 'src/assets/images/r_pool.svg';
import selected_rAsset_svg from 'src/assets/images/selected_rAssets.svg';
import selected_rATOM_svg from 'src/assets/images/selected_r_atom.svg';
import selected_rBnb_svg from 'src/assets/images/selected_r_bnb.svg';
import selected_rDOT_svg from 'src/assets/images/selected_r_dot.svg';
import selected_rETH_svg from 'src/assets/images/selected_r_eth.svg';
import selected_rFIS_svg from 'src/assets/images/selected_r_fis.svg';
import selected_rKSM_svg from 'src/assets/images/selected_r_ksm.svg';
import selected_rMatic_svg from 'src/assets/images/selected_r_matic.svg';
import selected_rPool_svg from 'src/assets/images/selected_r_pool.svg';
import selected_rSOL_svg from 'src/assets/images/selected_r_sol.svg';
import { trackEvent } from 'src/features/globalClice';
import { isdev } from '../../config/index';
import './index.scss';
import Item from './item';

const siderData = [
  {
    icon: rAsset_svg,
    selectedIcon: selected_rAsset_svg,
    text: 'rAsset',
    urlKeywords: '/rAsset',
    url: '/rAsset/home/native',
  },
  {
    icon: rDEX_svg,
    selectedIcon: selected_rDEX_svg,
    text: 'rSWAP',
    urlKeywords: '/rSWAP',
    url: '/rSWAP/home',
  },
  {
    icon: rPool_svg,
    selectedIcon: selected_rPool_svg,
    text: 'rPool',
    urlKeywords: '/rPool',
    url: '/rPool/home?tab=mp',
  },
  {
    icon: rETH_svg,
    selectedIcon: selected_rETH_svg,
    text: 'rETH',
    urlKeywords: '/rETH',
    // url:"https://rtoken.stafi.io/reth"
    url: '/rETH/home',
  },
  {
    icon: rBnb_svg,
    selectedIcon: selected_rBnb_svg,
    text: 'rBNB',
    urlKeywords: '/rBNB',
    url: '/rBNB/home',
  },
  {
    icon: rFIS_svg,
    selectedIcon: selected_rFIS_svg,
    text: 'rFIS',
    urlKeywords: '/rFIS',
    url: '/rFIS/home',
    // url:"https://rtoken.stafi.io/rfis"
  },
  {
    icon: rDOT_svg,
    selectedIcon: selected_rDOT_svg,
    text: 'rDOT',
    urlKeywords: '/rDOT',
    url: '/rDOT/home',
  },
  {
    icon: rKSM_svg,
    selectedIcon: selected_rKSM_svg,
    text: 'rKSM',
    urlKeywords: '/rKSM',
    url: '/rKSM/home',
  },
  {
    icon: rATOM_svg,
    selectedIcon: selected_rATOM_svg,
    text: 'rATOM',
    urlKeywords: '/rATOM',
    url: '/rATOM/home',
  },
  {
    icon: rSOL_svg,
    selectedIcon: selected_rSOL_svg,
    text: 'rSOL',
    urlKeywords: '/rSOL',
    url: '/rSOL/home',
  },
  {
    icon: rMatic_svg,
    selectedIcon: selected_rMatic_svg,
    text: 'rMATIC',
    urlKeywords: '/rMATIC',
    url: '/rMATIC/home',
  },
];
type Props = {
  route: any;
  history: any;
};
export default function Index(props: Props) {
  const dispatch = useDispatch();
  const history = useHistory();
  // const [selectIndex,setSelectIndex]=useState(0);

  return (
    <div className='stafi_left_master_sider'>
      <div className='logo_panel'>
        <img className='header_logo' src={logo} />
      </div>

      <div className='network'>{isdev() ? 'Testnet' : 'Mainnet'}</div>

      <div className='stafi_left_sider'>
        {siderData.map((item, i) => {
          return (
            <Item
              key={item.text}
              icon={item.icon}
              selectedIcon={item.selectedIcon}
              text={item.text}
              url={item.url}
              selected={history.location.pathname.includes(item.urlKeywords)}
              onClick={() => {
                dispatch(
                  trackEvent('clik_nav_link', {
                    url: item.url,
                  }),
                );
                props.history.push(item.url);
              }}
            />
          );
        })}
      </div>
      <div className='bottom_container'>
        <div className='text'>Run out of FIS fee?</div>
        <div className='text'>
          Try{' '}
          <span
            className='link'
            onClick={() => {
              dispatch(
                trackEvent('clik_nav_link', {
                  url: '/feeStation/default',
                }),
              );
              history.push('/feeStation/default');
            }}>
            Fee Station
          </span>
        </div>
      </div>
    </div>
  );
}
