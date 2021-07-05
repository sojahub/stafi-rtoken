import React from 'react';
import { renderRoutes } from 'react-router-config';
import { Switch, BrowserRouter, Redirect } from 'react-router-dom';
import authorizedRoute from '@components/route/authorizedRoute';
import {Symbol} from '@keyring/defaults'

import HomeTemplate from './pages/template/homeTemplate'

import ETHHomeTemplate from './pages/rETH/template';
import RETHHome from './pages/rETH/home' 
import RETHStaker from './pages/rETH/staker';
import RETHValidator from './pages/rETH/validator';
import RETHValidatorHome from './pages/rETH/validator/home/validatorContent'
import RETHValidatorDeposit from './pages/rETH/validator/deposit';
import RETHValidatorStake from './pages/rETH/validator/stake';
import RETHValidatorStatus from './pages/rETH/validator/status';
import RETHPoolContract from './pages/rETH/validator/poolContract'
import RETHStakerIndex from './pages/rETH/staker/home';
import RETHStakerInfo from './pages/rETH/staker/info';
// import RETHStakerRedeem from './pages/rETH/staker/redeem';
// import RETHSeach from './pages/rETH/search';
import RETHPoolStatus from './pages/rETH/poolStatus';
import RETHType from './pages/rETH/selectType';
import RETHLiquefy from './pages/rETH/liquefy';
import RETHStakerReward from './pages/rETH/staker/reward'

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
import RDOTStakerReward from './pages/rDOT/staker/reward'

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
import RKSMStakerReward from './pages/rKSM/staker/reward';


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
import RATOMStakerReward from './pages/rATOM/staker/reward';

import RAssetTemplate from './pages/rAsset/template';
import RAssetNative from './pages/rAsset/home/native';
import RAssetErc from './pages/rAsset/home/erc';
import RAssetSwap from './pages/rAsset/swap';

import RPoolHomeTemplate from './pages/rPool/template';
import RPoolHome from './pages/rPool/home'
import RPoolStaker from './pages/rPool/staker';
import RPoolStakerReward from './pages/rPool/staker/reward';
import RPoolStakerInsurance from './pages/rPool/staker/insurance';
import RPoolStakerStatus from './pages/rPool/staker/status';
import RPoolStakerStatusNative from './pages/rPool/staker/status/native';
import RPoolStakerStatusNativeErc20 from './pages/rPool/staker/status/erc20';

import RMaticHomeTemplate from './pages/rMatic/template';
import RMaticHome from './pages/rMatic/home'
import RMaticWallet from './pages/rMatic/selectWallet';
import RMaticWalletFIS from './pages/rMatic/selectWallet_rFIS';
import RMaticStaker from './pages/rMatic/staker';
import RMaticValidator from './pages/rMatic/validator';
import RMaticStakerIndex from './pages/rMatic/staker/home';
import RMaticStakerInfo from './pages/rMatic/staker/info';
import RMaticStakerRedeem from './pages/rMatic/staker/redeem';
import RMaticSeach from './pages/rMatic/search';
import RMaticType from './pages/rMatic/selectType'; 
import RMaticStakerReward from './pages/rMatic/staker/reward';



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
              id:"RDOT_reward_index",
              path:"/rDOT/staker/reward",
              type:"Staker",
              rSymbol:rSymbol.Dot,
              component:RDOTStakerReward
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
        id:"RETH_home",
        path:"/rETH",
        type:"rETH",
        rSymbol:rSymbol.Eth,
        component: ETHHomeTemplate,
        routes:[{
          id:"RETH_home_index",
          path:"/rETH/home",
          rSymbol:rSymbol.Eth,
          component:RETHHome
        },{
          id:"RETH_staker",
          type:"Staker",
          path:"/rETH/staker",
          rSymbol:rSymbol.Eth,
          component:authorizedRoute(Symbol.Eth)(RETHStaker),
          routes:[
            {
              id:"RETH_staker_index",
              path:"/rETH/staker/index",
              type:"Staker",
              rSymbol:rSymbol.Eth,
              component:RETHStakerIndex
            },{
              id:"RETH_reward_index",
              path:"/rETH/staker/reward",
              type:"Staker",
              rSymbol:rSymbol.Eth,
              component:RETHStakerReward
            },{
              id:"RETH_staker_index_info",
              path:"/rETH/staker/info",
              type:"-Status",
              rSymbol:rSymbol.Eth,
              component:RETHStakerInfo
            },{
              path: '*',
              component: () => <Redirect to="/rETH/staker/index"/>
            }
          ]
        },{
          id:"RETH_validator",
          type:"Validator",
          path:"/rETH/validator",
          rSymbol:rSymbol.Eth,
          component:authorizedRoute(Symbol.Eth)(RETHValidator),
          routes:[{
            id:"RETH_validator_home",
            type:"validator",
            path:"/rETH/validator/index",
            rSymbol:rSymbol.Eth,
            component:authorizedRoute(Symbol.Eth)(RETHValidatorHome),
          },{
            id:"RETH_validator_deposit",
            type:"-Deposit",
            path:"/rETH/validator/deposit",
            rSymbol:rSymbol.Eth,
            component:authorizedRoute(Symbol.Eth)(RETHValidatorDeposit)
          },{
            id:"RETH_validator_stake",
            type:"-Stake",
            path:"/rETH/validator/stake",
            rSymbol:rSymbol.Eth,
            component:authorizedRoute(Symbol.Eth)(RETHValidatorStake)
          },{
            id:"RETH_validator_status",
            type:"-Status",
            path:"/rETH/validator/status",
            rSymbol:rSymbol.Eth,
            component:authorizedRoute(Symbol.Eth)(RETHValidatorStatus)
          },{
            id:"RETH_validator_poolContract",
            type:"validator",
            path:"/rETH/validator/poolContract/:poolAddress",
            rSymbol:rSymbol.Eth,
            component:authorizedRoute(Symbol.Eth)(RETHPoolContract),
          },{
            path: '*',
            component: () => <Redirect to="/rETH/validator/index"/>
          }],
          

        },{
          id:"RETH_liquefy",
          path:"/rETH/liquefy",
          rSymbol:rSymbol.Eth,
          component:authorizedRoute(Symbol.Eth)(RETHLiquefy)
        },{
          id:"RETH_poolStatus",
          path:"/rETH/poolStatus",
          rSymbol:rSymbol.Eth,
          component:authorizedRoute(Symbol.Eth)(RETHPoolStatus)
        },{
          id:"RETH_type",
          path:"/rETH/type",
          rSymbol:rSymbol.Eth,
          component:authorizedRoute(Symbol.Eth)(RETHType)
        },{
          path: '*',
          component: () => <Redirect to="/rETH/home"/>
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
            },{
              id:"RKSM_reward_index",
              path:"/rKSM/staker/reward",
              type:"Staker",
              rSymbol:rSymbol.Ksm,
              component:RKSMStakerReward
            },{
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
            },{
              id:"RATOM_reward_index",
              path:"/rATOM/staker/reward",
              type:"Staker",
              rSymbol:rSymbol.Atom,
              component:RATOMStakerReward
            },{
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
          id:"RATOM_type",
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
        id:"RPool_index",
        path:"/rPool",
        type:"rPool",
        // rSymbol:rSymbol.Atom,
        component: RPoolHomeTemplate,
        routes:[{
          id:"RPool_home",
          path:"/rPool/home",
          // width:920,
          className:"stafi_content_full",
          // rSymbol:rSymbol.Atom,
          component:RPoolHome
        },{
          id:"RPool_staker",
          type:"Staker",
          path:"/rPool/staker",
          rSymbol:rSymbol.Dot,
          component:RPoolStaker,
          routes:[{
              id:"RPool_reward_index",
              path:"/rPool/staker/reward",
              type:"Staker", 
              component:RPoolStakerReward
            },{
              id:"RPool_insurance_index",
              path:"/rPool/staker/insurance",
              type:"Staker", 
              component:RPoolStakerInsurance
            },{
              id:"RPool_status_index",
              path:"/rPool/staker/status",
              type:"Staker", 
              component:RPoolStakerStatus,
              routes:[{
                id:"RPool_status_native_index",
                path:"/rPool/staker/status/native",
                type:"Staker", 
                component:RPoolStakerStatusNative,
              },{
                id:"RPool_status_erc20_index",
                path:"/rPool/staker/status/erc20",
                type:"Staker", 
                component:RPoolStakerStatusNativeErc20,
              },{
                path: '*',
                component: () => <Redirect to="/rPool/staker/status/native"/>
              }]
            }
          ]},{
          path: '*',
          component: () => <Redirect to="/rPool/home"/>
        }]
      },{
        id:"RMatic_index",
        path:"/rMatic",
        type:"rMatic",
        rSymbol:rSymbol.Matic,
        component: RMaticHomeTemplate,
        routes:[{
          id:"RMatic_home",
          path:"/rMatic/home",
          rSymbol:rSymbol.Matic,
          component:RMaticHome
        },{
          id:"RMatic_wallet",
          path:"/rMatic/wallet",
          rSymbol:rSymbol.Matic,
          component:RMaticWallet
        },{
          id:"RMatic_wallet",
          path:"/rMatic/fiswallet",
          rSymbol:rSymbol.Matic,
          component:RMaticWalletFIS
        },{
          id:"RMatic_staker",
          type:"Staker",
          path:"/rMatic/staker",
          rSymbol:rSymbol.Matic,
          component:authorizedRoute(Symbol.Matic)(RMaticStaker),
          routes:[
            {
              id:"RMatic_staker_index",
              path:"/rMatic/staker/index",
              type:"Staker",
              rSymbol:rSymbol.Matic,
              component:RMaticStakerIndex
            },{
              id:"RMatic_staker_index_info",
              path:"/rMatic/staker/info",
              type:"-Status",
              rSymbol:rSymbol.Matic,
              component:RATOMStakerInfo
            },{
              id:"RMatic_reward_index",
              path:"/rMatic/staker/reward",
              type:"Staker",
              rSymbol:rSymbol.Matic,
              component:RMaticStakerReward
            },{
              id:"RMatic_staker_index_redeem",
              path:"/rMatic/staker/redeem",
              type:"Staker",
              rSymbol:rSymbol.Matic,
              component:RMaticStakerRedeem
            },{
              path: '*',
              component: () => <Redirect to="/rMatic/staker/index"/>
            }
          ]
        },{
          id:"RMatic_validator",
          type:"Validator",
          path:"/rMatic/validator",
          rSymbol:rSymbol.Matic,
          component:authorizedRoute(Symbol.Matic)(RMaticValidator)
        },{
          id:"RMatic_search",
          path:"/rMatic/search",
          rSymbol:rSymbol.Matic,
          component:authorizedRoute(Symbol.Matic)(RMaticSeach)
        },{
          id:"RMatic_type",
          path:"/rMatic/type",
          rSymbol:rSymbol.Matic,
          component:authorizedRoute(Symbol.Matic)(RMaticType)
        },{
          path: '*',
          component: () => <Redirect to="/rMatic/home"/>
        }]
      },{
        path: '*',
        component: () => <Redirect to="/rAsset/native"/>
      }]
    },{
      path: '*',
      component: () => <Redirect to="/rAsset/native"/>
    }
    
  ]

  return renderRoutes(routes);
}

export default routesFactory;