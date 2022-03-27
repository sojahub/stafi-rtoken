import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import logo from 'src/assets/images/logo2.png';
import rAsset_svg from 'src/assets/images/rAsset.png';
import selected_rDEX_svg from 'src/assets/images/rDEX_active.svg';
import rDEX_svg from 'src/assets/images/rDEX_inactive.svg';
// import rSOL_svg from 'src/assets/images/rSOL.svg';
// import rATOM_svg from 'src/assets/images/r_atom.svg';
import rToken_svg from 'src/assets/images/icon_rtoken.svg';
import selected_rToken_svg from 'src/assets/images/icon_rtoken_selected.svg';
import rBridge_svg from 'src/assets/images/icon_rbridge.svg';
import selected_rBridge_svg from 'src/assets/images/icon_rbridge_selected.svg';
// import rBnb_svg from 'src/assets/images/r_bnb.svg';
// import rDOT_svg from 'src/assets/images/r_dot.svg';
// import rETH_svg from 'src/assets/images/r_eth.svg';
// import rFIS_svg from 'src/assets/images/r_fis.svg';
// import rKSM_svg from 'src/assets/images/r_ksm.svg';
// import rMatic_svg from 'src/assets/images/r_matic.svg';
import rPool_svg from 'src/assets/images/r_pool.svg';
import selected_rAsset_svg from 'src/assets/images/selected_rAssets.svg';
// import selected_rATOM_svg from 'src/assets/images/selected_r_atom.svg';
// import selected_rBnb_svg from 'src/assets/images/selected_r_bnb.svg';
// import selected_rDOT_svg from 'src/assets/images/selected_r_dot.svg';
// import selected_rETH_svg from 'src/assets/images/selected_r_eth.svg';
// import selected_rFIS_svg from 'src/assets/images/selected_r_fis.svg';
// import selected_rKSM_svg from 'src/assets/images/selected_r_ksm.svg';
// import selected_rMatic_svg from 'src/assets/images/selected_r_matic.svg';
import selected_rPool_svg from 'src/assets/images/selected_r_pool.svg';
// import selected_rSOL_svg from 'src/assets/images/selected_r_sol.svg';
import { trackEvent } from 'src/features/globalClice';
import { isdev } from '../../config/index';
import './index.scss';
import Item from './item';

const siderData = [
  {
    icon: rToken_svg,
    selectedIcon: selected_rToken_svg,
    text: 'rToken',
    urlKeywords: ['/tokenList', '/staker/', '/type'],
    url: '/tokenList',
  },
  {
    icon: rAsset_svg,
    selectedIcon: selected_rAsset_svg,
    text: 'rAsset',
    urlKeywords: '/rAsset/home',
    url: '/rAsset/home/native',
  },
  {
    icon: rDEX_svg,
    selectedIcon: selected_rDEX_svg,
    text: 'rSwap',
    urlKeywords: '/rSwap',
    url: '/rSwap/home',
  },
  {
    icon: rPool_svg,
    selectedIcon: selected_rPool_svg,
    text: 'rPool',
    urlKeywords: '/rPool',
    url: '/rPool/home?tab=mp',
  },
  {
    icon: rBridge_svg,
    selectedIcon: selected_rBridge_svg,
    text: 'rBridge',
    urlKeywords: '/rAsset/swap',
    url: '/rAsset/swap/native/default',
  },
  // {
  //   icon: rETH_svg,
  //   selectedIcon: selected_rETH_svg,
  //   text: 'rETH',
  //   urlKeywords: '/rETH',
  //   // url:"https://rtoken.stafi.io/reth"
  //   url: '/rETH/home',
  // },
  // {
  //   icon: rBnb_svg,
  //   selectedIcon: selected_rBnb_svg,
  //   text: 'rBNB',
  //   urlKeywords: '/rBNB',
  //   url: '/rBNB/home',
  // },
  // {
  //   icon: rFIS_svg,
  //   selectedIcon: selected_rFIS_svg,
  //   text: 'rFIS',
  //   urlKeywords: '/rFIS',
  //   url: '/rFIS/home',
  //   // url:"https://rtoken.stafi.io/rfis"
  // },
  // {
  //   icon: rDOT_svg,
  //   selectedIcon: selected_rDOT_svg,
  //   text: 'rDOT',
  //   urlKeywords: '/rDOT',
  //   url: '/rDOT/home',
  // },
  // {
  //   icon: rKSM_svg,
  //   selectedIcon: selected_rKSM_svg,
  //   text: 'rKSM',
  //   urlKeywords: '/rKSM',
  //   url: '/rKSM/home',
  // },
  // {
  //   icon: rATOM_svg,
  //   selectedIcon: selected_rATOM_svg,
  //   text: 'rATOM',
  //   urlKeywords: '/rATOM',
  //   url: '/rATOM/home',
  // },
  // {
  //   icon: rSOL_svg,
  //   selectedIcon: selected_rSOL_svg,
  //   text: 'rSOL',
  //   urlKeywords: '/rSOL',
  //   url: '/rSOL/home',
  // },
  // {
  //   icon: rMatic_svg,
  //   selectedIcon: selected_rMatic_svg,
  //   text: 'rMATIC',
  //   urlKeywords: '/rMATIC',
  //   url: '/rMATIC/home',
  // },
];
type Props = {
  route: any;
  history: any;
};
export default function Index(props: Props) {
  const dispatch = useDispatch();
  const history = useHistory();
  // const [selectIndex,setSelectIndex]=useState(0);

  const isSelected = (urlKeywords: string | string[]) => {
    if (typeof urlKeywords === 'string') {
      return history.location.pathname.includes(urlKeywords);
    } else {
      let match = false;
      urlKeywords.forEach((keyword) => {
        if (history.location.pathname.includes(keyword)) {
          match = true;
        }
      });
      return match;
    }
  };

  return (
    <div className='stafi_left_master_sider'>
      <div className='logo_panel'>
        <img className='header_logo' src={logo} alt='logo' />
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
              selected={isSelected(item.urlKeywords)}
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
        <div className='text'>Need FIS for fees?</div>
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
