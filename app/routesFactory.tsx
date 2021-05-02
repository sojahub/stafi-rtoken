import React from 'react';
import { renderRoutes } from 'react-router-config';
import { Switch, BrowserRouter, Redirect } from 'react-router-dom';
import authorizedRoute from '@components/route/authorizedRoute';
import {Symbol} from '@keyring/defaults'

import HomeTemplate from './pages/template/homeTemplate'

import DOTHomeTemplate from './pages/rDOT/template';
import RDOTHome from './pages/rDOT/home'
import RDOTWallet from './pages/rDOT/selectWallet';
import RDOTWalletFIS from './pages/rDOT/selectWallet_rFIS';
import RDOTStaker from './pages/rDOT/staker';
import RDOTValidator from './pages/rDOT/validator';
import RDOTStakerIndex from './pages/rDOT/staker/home';
import RDOTStakerInfo from './pages/rDOT/staker/info';
import RDOTStakerRedeem from './pages/rDOT/staker/redeem';
import RDOTSeach from './pages/rDOT/search';
import RDOTType from './pages/rDOT/selectType';

import RKSMHomeTemplate from './pages/rKSM/template';
import RKSMHome from './pages/rKSM/home'
import RKSMWallet from './pages/rKSM/selectWallet';
import RKSMWalletFIS from './pages/rKSM/selectWallet_rFIS';
import RKSMStaker from './pages/rKSM/staker';
import RKSMValidator from './pages/rKSM/validator';
import RKSMStakerIndex from './pages/rKSM/staker/home';
import RKSMStakerInfo from './pages/rKSM/staker/info';
import RKSMStakerRedeem from './pages/rKSM/staker/redeem';
import RKSMSeach from './pages/rKSM/search';
import RKSMType from './pages/rKSM/selectType';


import RATOMHomeTemplate from './pages/rATOM/template';
import RATOMHome from './pages/rATOM/home'
import RATOMWallet from './pages/rATOM/selectWallet';
import RATOMWalletFIS from './pages/rATOM/selectWallet_rFIS';
import RATOMStaker from './pages/rATOM/staker';
import RATOMValidator from './pages/rATOM/validator';
import RATOMStakerIndex from './pages/rATOM/staker/home';
import RATOMStakerInfo from './pages/rATOM/staker/info';
import RATOMStakerRedeem from './pages/rATOM/staker/redeem';
import RATOMSeach from './pages/rATOM/search';
import RATOMType from './pages/rATOM/selectType';

import RAssetTemplate from './pages/rAsset/template';
import RAssetNative from './pages/rAsset/home/native';
import RAssetErc from './pages/rAsset/home/erc';
import RAssetSwap from './pages/rAsset/swap';
import {rSymbol} from '@keyring/defaults'
  
const routesFactory=(role?:any)=>{ 
  const routes=[
    {
      id:"root",
      path:'/', 
      component:HomeTemplate,
      // render:()=>{
      //   return <Redirect to={"/rDOT/home"}/>
      // },
      routes:[{
        id:"RDOT_home",
        path:"/rDOT",
        type:"rDOT",
        rSymbol:rSymbol.Dot,
        component: DOTHomeTemplate,
        routes:[{
          id:"RDOT_home",
          path:"/rDOT/home",
          rSymbol:rSymbol.Dot,
          component:RDOTHome
        },{
          id:"RDOT_wallet",
          path:"/rDOT/wallet",
          rSymbol:rSymbol.Dot,
          component:RDOTWallet
        },{
          id:"RDOT_wallet",
          path:"/rDOT/fiswallet",
          rSymbol:rSymbol.Dot,
          component:RDOTWalletFIS
        },{
          id:"RDOT_staker",
          type:"Staker",
          path:"/rDOT/staker",
          rSymbol:rSymbol.Dot,
          component:authorizedRoute(Symbol.Dot)(RDOTStaker),
          routes:[
            {
              id:"RDOT_staker_index",
              path:"/rDOT/staker/index",
              type:"Staker",
              rSymbol:rSymbol.Dot,
              component:RDOTStakerIndex
            },{
              id:"RDOT_staker_index_info",
              path:"/rDOT/staker/info",
              type:"-Status",
              rSymbol:rSymbol.Dot,
              component:RDOTStakerInfo
            },{
              id:"RDOT_staker_index_redeem",
              path:"/rDOT/staker/redeem",
              type:"Staker",
              rSymbol:rSymbol.Dot,
              component:RDOTStakerRedeem
            },{
              path: '*',
              component: () => <Redirect to="/rDOT/staker/index"/>
            }
          ]
        },{
          id:"RDOT_validator",
          type:"Validator",
          path:"/rDOT/validator",
          rSymbol:rSymbol.Dot,
          component:authorizedRoute(Symbol.Dot)(RDOTValidator)
        },{
          id:"RDOT_search",
          path:"/rDOT/search",
          rSymbol:rSymbol.Dot,
          component:authorizedRoute(Symbol.Dot)(RDOTSeach)
        },{
          id:"RDOT_type",
          path:"/rDOT/type",
          rSymbol:rSymbol.Dot,
          component:authorizedRoute(Symbol.Dot)(RDOTType)
        },{
          path: '*',
          component: () => <Redirect to="/rDOT/home"/>
        }]
      },{
        id:"RKSM_home",
        path:"/rKSM",
        type:"rKSM",
        rSymbol:rSymbol.Ksm,
        component: RKSMHomeTemplate,
        routes:[{
          id:"RKSM_home",
          path:"/rKSM/home",
          rSymbol:rSymbol.Ksm,
          component:RKSMHome
        },{
          id:"RKSM_wallet",
          path:"/rKSM/wallet",
          rSymbol:rSymbol.Ksm,
          component:RKSMWallet
        },{
          id:"RKSM_wallet",
          path:"/rKSM/fiswallet",
          rSymbol:rSymbol.Ksm,
          component:RKSMWalletFIS
        },{
          id:"RKSM_staker",
          type:"Staker",
          path:"/rKSM/staker",
          rSymbol:rSymbol.Ksm,
          component:authorizedRoute(Symbol.Ksm)(RKSMStaker),
          routes:[
            {
              id:"RKSM_staker_index",
              path:"/rKSM/staker/index",
              type:"Staker",
              rSymbol:rSymbol.Ksm,
              component:RKSMStakerIndex
            },{
              id:"RDOT_staker_index_info",
              path:"/rKSM/staker/info",
              type:"-Status",
              rSymbol:rSymbol.Ksm,
              component:RKSMStakerInfo
            },,{
              id:"RKSM_staker_index_redeem",
              path:"/rKSM/staker/redeem",
              type:"Staker",
              rSymbol:rSymbol.Ksm,
              component:RKSMStakerRedeem
            },{
              path: '*',
              component: () => <Redirect to="/rKSM/staker/index"/>
            }
          ]
        },{
          id:"RKSM_validator",
          type:"Validator",
          path:"/rKSM/validator",
          rSymbol:rSymbol.Ksm,
          component:authorizedRoute(Symbol.Ksm)(RKSMValidator)
        },{
          id:"RKSM_search",
          path:"/rKSM/search",
          rSymbol:rSymbol.Ksm,
          component:authorizedRoute(Symbol.Ksm)(RKSMSeach)
        },{
          id:"RKSM_type",
          path:"/rKSM/type",
          rSymbol:rSymbol.Ksm,
          component:authorizedRoute(Symbol.Ksm)(RKSMType)
        },{
          path: '*',
          component: () => <Redirect to="/rKSM/home"/>
        }]
      },{
        id:"RATOM_index",
        path:"/rATOM",
        type:"rATOM",
        rSymbol:rSymbol.Atom,
        component: RATOMHomeTemplate,
        routes:[{
          id:"RATOM_home",
          path:"/rATOM/home",
          rSymbol:rSymbol.Atom,
          component:RATOMHome
        },{
          id:"RATOM_wallet",
          path:"/rATOM/wallet",
          rSymbol:rSymbol.Atom,
          component:RATOMWallet
        },{
          id:"RATOM_wallet",
          path:"/rATOM/fiswallet",
          rSymbol:rSymbol.Atom,
          component:RATOMWalletFIS
        },{
          id:"RATOM_staker",
          type:"Staker",
          path:"/rATOM/staker",
          rSymbol:rSymbol.Atom,
          component:authorizedRoute(Symbol.Atom)(RATOMStaker),
          routes:[
            {
              id:"RATOM_staker_index",
              path:"/rATOM/staker/index",
              type:"Staker",
              rSymbol:rSymbol.Atom,
              component:RATOMStakerIndex
            },{
              id:"RATOM_staker_index_info",
              path:"/rATOM/staker/info",
              type:"-Status",
              rSymbol:rSymbol.Atom,
              component:RATOMStakerInfo
            },,{
              id:"RATOM_staker_index_redeem",
              path:"/rATOM/staker/redeem",
              type:"Staker",
              rSymbol:rSymbol.Atom,
              component:RATOMStakerRedeem
            },{
              path: '*',
              component: () => <Redirect to="/rATOM/staker/index"/>
            }
          ]
        },{
          id:"RATOM_validator",
          type:"Validator",
          path:"/rATOM/validator",
          rSymbol:rSymbol.Atom,
          component:authorizedRoute(Symbol.Atom)(RATOMValidator)
        },{
          id:"RATOM_search",
          path:"/rATOM/search",
          rSymbol:rSymbol.Atom,
          component:authorizedRoute(Symbol.Atom)(RATOMSeach)
        },{
          id:"RATOm_type",
          path:"/rATOM/type",
          rSymbol:rSymbol.Atom,
          component:authorizedRoute(Symbol.Atom)(RATOMType)
        },{
          path: '*',
          component: () => <Redirect to="/rATOM/home"/>
        }]
      },{
        id:"rAsset_template",
        path:"/rAsset",
        type:'rAsset',
        component:RAssetTemplate,
        routes:[{
          id:"rAssect_native",
          path:"/rAsset/native",
          component:RAssetNative
        },{
          id:"rAssect_erc",
          path:"/rAsset/erc",
          component:RAssetErc
        },{
          id:"rAssect_swap",
          path:"/rAsset/swap/:type",
          component:RAssetSwap
        },{
          path: '*',
          component: () => <Redirect to="/rAsset/native"/>
        }]
      },{
        path: '*',
        component: () => <Redirect to="/rDOT/home"/>
      }]
    },{
      path: '*',
      component: () => <Redirect to="/rDOT/home"/>
    }
    
  ]

  return renderRoutes(routes);
}

export default routesFactory;