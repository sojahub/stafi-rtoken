import React from 'react';
import { renderRoutes } from 'react-router-config';
import { Redirect } from 'react-router-dom';
import authorizedRoute from 'src/components/route/authorizedRoute';
import { rSymbol, Symbol } from 'src/keyring/defaults';
import FeeStationTemplate from 'src/servers/feeStation/template';
import FeeStation from './pages/feeStation/FeeStation';
import RAssetHome from './pages/rAsset/home/index';
import RAssetSwap from './pages/rAsset/swap';
import RAssetTemplate from './pages/rAsset/template';
import RATOMHome from './pages/rATOM/home';
import RATOMSeach from './pages/rATOM/search';
import RATOMType from './pages/rATOM/selectType';
import RATOMWallet from './pages/rATOM/selectWallet';
import RATOMWalletFIS from './pages/rATOM/selectWallet_rFIS';
import RATOMStaker from './pages/rATOM/staker';
import RATOMStakerIndex from './pages/rATOM/staker/home';
import RATOMStakerInfo from './pages/rATOM/staker/info';
import RATOMStakerRedeem from './pages/rATOM/staker/redeem';
import RATOMStakerReward from './pages/rATOM/staker/reward';
import RATOMStakerUnbondRecords from './pages/rATOM/staker/unbondRecords';
import RATOMHomeTemplate from './pages/rATOM/template';
import RATOMValidator from './pages/rATOM/validator';
import RBnbHome from './pages/rBNB/home';
import RBnbSeach from './pages/rBNB/search';
import RBnbType from './pages/rBNB/selectType';
import RBnbWallet from './pages/rBNB/selectWallet';
import RBnbWalletFIS from './pages/rBNB/selectWallet_rFIS';
import RBnbStaker from './pages/rBNB/staker';
import RBnbStakerIndex from './pages/rBNB/staker/home';
import RBnbStakerInfo from './pages/rBNB/staker/info';
import RBnbStakerRedeem from './pages/rBNB/staker/redeem';
import RBnbStakerReward from './pages/rBNB/staker/reward';
import RBnbStakerUnbondRecords from './pages/rBNB/staker/unbondRecords';
import RBnbHomeTemplate from './pages/rBNB/template';
import RBnbValidator from './pages/rBNB/validator';
import RSWAPHome from './pages/rDEX/home';
import RDOTHome from './pages/rDOT/home';
import RDOTSeach from './pages/rDOT/search';
import RDOTType from './pages/rDOT/selectType';
import RDOTWallet from './pages/rDOT/selectWallet';
import RDOTWalletFIS from './pages/rDOT/selectWallet_rFIS';
import RDOTStaker from './pages/rDOT/staker';
import RDOTStakerIndex from './pages/rDOT/staker/home';
import RDOTStakerInfo from './pages/rDOT/staker/info';
import RDOTStakerRedeem from './pages/rDOT/staker/redeem';
import RDOTStakerReward from './pages/rDOT/staker/reward';
import RDOTStakerUnbondRewards from './pages/rDOT/staker/unbondRecords';
import DOTHomeTemplate from './pages/rDOT/template';
import RDOTValidator from './pages/rDOT/validator';
import RETHHome from './pages/rETH/home';
import RETHLiquefy from './pages/rETH/liquefy';
import RETHPoolStatus from './pages/rETH/poolStatus';
import RETHType from './pages/rETH/selectType';
import RETHStaker from './pages/rETH/staker';
import RETHStakerIndex from './pages/rETH/staker/home';
import RETHStakerInfo from './pages/rETH/staker/info';
import RETHStakerReward from './pages/rETH/staker/reward';
import RETHStakerInsurance from './pages/rETH/staker/insurance';
import ETHHomeTemplate from './pages/rETH/template';
import RETHValidator from './pages/rETH/validator';
import RETHValidatorDeposit from './pages/rETH/validator/deposit';
import RETHValidatorHome from './pages/rETH/validator/home/validatorContent';
import RETHPoolContract from './pages/rETH/validator/poolContract';
import RETHValidatorStake from './pages/rETH/validator/stake';
import RETHValidatorStatus from './pages/rETH/validator/status';
import RFISHome from './pages/rFIS/home';
import RFISType from './pages/rFIS/selectType';
import RFISWalletFIS from './pages/rFIS/selectWallet_rFIS';
import RFISStaker from './pages/rFIS/staker';
import RFISStakerIndex from './pages/rFIS/staker/home';
import RFISStakerInfo from './pages/rFIS/staker/info';
import RFISStakerRedeem from './pages/rFIS/staker/redeem';
import RFISStakerReward from './pages/rFIS/staker/reward';
import RFISStakerUnbondRecords from './pages/rFIS/staker/unbondRecords';
import RFISHomeTemplate from './pages/rFIS/template';
import RFISValidator from './pages/rFIS/validator';
import RFISValidatorOffboard from './pages/rFIS/validator/offboard';
import RFISValidatorOnboard from './pages/rFIS/validator/onboard';
import RKSMHome from './pages/rKSM/home';
import RKSMSeach from './pages/rKSM/search';
import RKSMType from './pages/rKSM/selectType';
import RKSMWallet from './pages/rKSM/selectWallet';
import RKSMWalletFIS from './pages/rKSM/selectWallet_rFIS';
import RKSMStaker from './pages/rKSM/staker';
import RKSMStakerIndex from './pages/rKSM/staker/home';
import RKSMStakerInfo from './pages/rKSM/staker/info';
import RKSMStakerRedeem from './pages/rKSM/staker/redeem';
import RKSMStakerReward from './pages/rKSM/staker/reward';
import RKSMStakerUnbondRecords from './pages/rKSM/staker/unbondRecords';
import RKSMHomeTemplate from './pages/rKSM/template';
import RKSMValidator from './pages/rKSM/validator';
import RMaticHome from './pages/rMATIC/home';
import RMaticSeach from './pages/rMATIC/search';
import RMaticType from './pages/rMATIC/selectType';
import RMaticWallet from './pages/rMATIC/selectWallet';
import RMaticWalletFIS from './pages/rMATIC/selectWallet_rFIS';
import RMaticStaker from './pages/rMATIC/staker';
import RMaticStakerIndex from './pages/rMATIC/staker/home';
import RMaticStakerInfo from './pages/rMATIC/staker/info';
import RMaticStakerRedeem from './pages/rMATIC/staker/redeem';
import RMaticStakerReward from './pages/rMATIC/staker/reward';
import RMaticStakerUnbondRecords from './pages/rMATIC/staker/unbondRecords';
import RMaticHomeTemplate from './pages/rMATIC/template';
import RMaticValidator from './pages/rMATIC/validator';
import RPoolHome from './pages/rPool/home';
import LiquidityOverview from './pages/rPool/LiquidityOverview';
import MintOverview from './pages/rPool/mint';
import RPoolStaker from './pages/rPool/staker';
import RPoolStakerInsurance from './pages/rPool/staker/insurance';
import RPoolStakerReward from './pages/rPool/staker/reward';
import RPoolStakerStatus from './pages/rPool/staker/status';
import RPoolStakerStatusNativeErc20 from './pages/rPool/staker/status/erc20';
import RPoolStakerStatusNative from './pages/rPool/staker/status/native';
import RPoolHomeTemplate from './pages/rPool/template';
import RSOLHome from './pages/rSOL/home';
import RSOLSeach from './pages/rSOL/search';
import RSOLType from './pages/rSOL/selectType';
import RSOLWallet from './pages/rSOL/selectWallet';
import RSOLWalletFIS from './pages/rSOL/selectWallet_rFIS';
import RSOLStaker from './pages/rSOL/staker';
import RSOLStakerIndex from './pages/rSOL/staker/home';
import RSOLStakerInfo from './pages/rSOL/staker/info';
import RSOLStakerRedeem from './pages/rSOL/staker/redeem';
import RSOLStakerReward from './pages/rSOL/staker/reward';
import RSOLStakerUnbondRecords from './pages/rSOL/staker/unbondRecords';
import RSOLHomeTemplate from './pages/rSOL/template';
import RSOLValidator from './pages/rSOL/validator';
import HomeTemplate from './pages/template/homeTemplate';

const routesFactory = (role?: any) => {
  const routes = [
    {
      id: 'root',
      path: '/',
      component: HomeTemplate,
      // render:()=>{
      //   return <Redirect to={"/rDOT/home"}/>
      // },
      routes: [
        {
          id: 'RDOT_home',
          path: '/rDOT',
          type: 'rDOT',
          rSymbol: rSymbol.Dot,
          component: DOTHomeTemplate,
          routes: [
            {
              id: 'RDOT_home',
              path: '/rDOT/home',
              rSymbol: rSymbol.Dot,
              component: RDOTHome,
            },
            {
              id: 'RDOT_wallet',
              path: '/rDOT/wallet',
              rSymbol: rSymbol.Dot,
              component: RDOTWallet,
            },
            {
              id: 'RDOT_wallet',
              path: '/rDOT/fiswallet',
              rSymbol: rSymbol.Dot,
              component: RDOTWalletFIS,
            },
            {
              id: 'RDOT_staker',
              type: 'Staker',
              path: '/rDOT/staker',
              rSymbol: rSymbol.Dot,
              component: authorizedRoute(Symbol.Dot)(RDOTStaker),
              routes: [
                {
                  id: 'RDOT_staker_index',
                  path: '/rDOT/staker/index',
                  type: 'Staker',
                  rSymbol: rSymbol.Dot,
                  component: RDOTStakerIndex,
                },
                {
                  id: 'RDOT_staker_index_info',
                  path: '/rDOT/staker/info',
                  type: '-Status',
                  rSymbol: rSymbol.Dot,
                  component: RDOTStakerInfo,
                },
                {
                  id: 'RDOT_reward_index',
                  path: '/rDOT/staker/reward',
                  type: 'Staker',
                  rSymbol: rSymbol.Dot,
                  component: RDOTStakerReward,
                },
                {
                  id: 'RDOT_reward_unbond',
                  path: '/rDOT/staker/unbondRecords',
                  type: 'Staker',
                  rSymbol: rSymbol.Dot,
                  component: RDOTStakerUnbondRewards,
                },
                {
                  id: 'RDOT_staker_index_redeem',
                  path: '/rDOT/staker/redeem',
                  type: 'Staker',
                  rSymbol: rSymbol.Dot,
                  component: RDOTStakerRedeem,
                },
                {
                  path: '*',
                  component: () => <Redirect to='/rDOT/staker/index' />,
                },
              ],
            },
            {
              id: 'RDOT_validator',
              type: 'Validator',
              path: '/rDOT/validator',
              rSymbol: rSymbol.Dot,
              component: authorizedRoute(Symbol.Dot)(RDOTValidator),
            },
            {
              id: 'RDOT_search',
              path: '/rDOT/search',
              rSymbol: rSymbol.Dot,
              component: authorizedRoute(Symbol.Dot)(RDOTSeach),
            },
            {
              id: 'RDOT_type',
              path: '/rDOT/type',
              rSymbol: rSymbol.Dot,
              component: authorizedRoute(Symbol.Dot)(RDOTType),
            },
            {
              path: '*',
              component: () => <Redirect to='/rDOT/home' />,
            },
          ],
        },
        {
          id: 'RETH_home',
          path: '/rETH',
          type: 'rETH',
          rSymbol: rSymbol.Eth,
          component: ETHHomeTemplate,
          routes: [
            {
              id: 'RETH_home_index',
              path: '/rETH/home',
              rSymbol: rSymbol.Eth,
              component: RETHHome,
            },
            {
              id: 'RETH_staker',
              type: 'Staker',
              path: '/rETH/staker',
              rSymbol: rSymbol.Eth,
              component: authorizedRoute(Symbol.Eth)(RETHStaker),
              routes: [
                {
                  id: 'RETH_staker_index',
                  path: '/rETH/staker/index',
                  type: 'Staker',
                  rSymbol: rSymbol.Eth,
                  component: RETHStakerIndex,
                },
                {
                  id: 'RETH_reward_index',
                  path: '/rETH/staker/reward',
                  type: 'Staker',
                  rSymbol: rSymbol.Eth,
                  className: 'stafi_content_high',
                  component: RETHStakerReward,
                },
                {
                  id: 'RETH_reward_insurance',
                  path: '/rETH/staker/insurance',
                  type: 'Staker',
                  rSymbol: rSymbol.Eth,
                  component: RETHStakerInsurance,
                },
                {
                  id: 'RETH_staker_index_info',
                  path: '/rETH/staker/info',
                  type: '-Status',
                  rSymbol: rSymbol.Eth,
                  component: RETHStakerInfo,
                },
                {
                  path: '*',
                  component: () => <Redirect to='/rETH/staker/index' />,
                },
              ],
            },
            {
              id: 'RETH_validator',
              type: 'Validator',
              path: '/rETH/validator',
              rSymbol: rSymbol.Eth,
              component: authorizedRoute(Symbol.Eth)(RETHValidator),
              routes: [
                {
                  id: 'RETH_validator_home',
                  type: 'validator',
                  path: '/rETH/validator/index',
                  rSymbol: rSymbol.Eth,
                  component: authorizedRoute(Symbol.Eth)(RETHValidatorHome),
                },
                {
                  id: 'RETH_validator_deposit',
                  type: '-Deposit',
                  path: '/rETH/validator/deposit',
                  rSymbol: rSymbol.Eth,
                  component: authorizedRoute(Symbol.Eth)(RETHValidatorDeposit),
                },
                {
                  id: 'RETH_validator_stake',
                  type: '-Stake',
                  path: '/rETH/validator/stake',
                  rSymbol: rSymbol.Eth,
                  component: authorizedRoute(Symbol.Eth)(RETHValidatorStake),
                },
                {
                  id: 'RETH_validator_status',
                  type: '-Status',
                  path: '/rETH/validator/status',
                  rSymbol: rSymbol.Eth,
                  component: authorizedRoute(Symbol.Eth)(RETHValidatorStatus),
                },
                {
                  id: 'RETH_validator_poolContract',
                  type: 'validator',
                  path: '/rETH/validator/poolContract/:poolAddress',
                  rSymbol: rSymbol.Eth,
                  component: authorizedRoute(Symbol.Eth)(RETHPoolContract),
                },
                {
                  path: '*',
                  component: () => <Redirect to='/rETH/validator/index' />,
                },
              ],
            },
            {
              id: 'RETH_liquefy',
              path: '/rETH/liquefy',
              rSymbol: rSymbol.Eth,
              component: authorizedRoute(Symbol.Eth)(RETHLiquefy),
            },
            {
              id: 'RETH_poolStatus',
              path: '/rETH/poolStatus',
              rSymbol: rSymbol.Eth,
              component: authorizedRoute(Symbol.Eth)(RETHPoolStatus),
            },
            {
              id: 'RETH_type',
              path: '/rETH/type',
              rSymbol: rSymbol.Eth,
              component: authorizedRoute(Symbol.Eth)(RETHType),
            },
            {
              path: '*',
              component: () => <Redirect to='/rETH/home' />,
            },
          ],
        },
        {
          id: 'RKSM_home',
          path: '/rKSM',
          type: 'rKSM',
          rSymbol: rSymbol.Ksm,
          component: RKSMHomeTemplate,
          routes: [
            {
              id: 'RKSM_home',
              path: '/rKSM/home',
              rSymbol: rSymbol.Ksm,
              component: RKSMHome,
            },
            {
              id: 'RKSM_wallet',
              path: '/rKSM/wallet',
              rSymbol: rSymbol.Ksm,
              component: RKSMWallet,
            },
            {
              id: 'RKSM_wallet',
              path: '/rKSM/fiswallet',
              rSymbol: rSymbol.Ksm,
              component: RKSMWalletFIS,
            },
            {
              id: 'RKSM_staker',
              type: 'Staker',
              path: '/rKSM/staker',
              rSymbol: rSymbol.Ksm,
              component: authorizedRoute(Symbol.Ksm)(RKSMStaker),
              routes: [
                {
                  id: 'RKSM_staker_index',
                  path: '/rKSM/staker/index',
                  type: 'Staker',
                  rSymbol: rSymbol.Ksm,
                  component: RKSMStakerIndex,
                },
                {
                  id: 'RDOT_staker_index_info',
                  path: '/rKSM/staker/info',
                  type: '-Status',
                  rSymbol: rSymbol.Ksm,
                  component: RKSMStakerInfo,
                },
                {
                  id: 'RKSM_reward_index',
                  path: '/rKSM/staker/reward',
                  type: 'Staker',
                  rSymbol: rSymbol.Ksm,
                  component: RKSMStakerReward,
                },
                {
                  id: 'RKSM_reward_unbond',
                  path: '/rKSM/staker/unbondRecords',
                  type: 'Staker',
                  rSymbol: rSymbol.Ksm,
                  component: RKSMStakerUnbondRecords,
                },
                {
                  id: 'RKSM_staker_index_redeem',
                  path: '/rKSM/staker/redeem',
                  type: 'Staker',
                  rSymbol: rSymbol.Ksm,
                  component: RKSMStakerRedeem,
                },
                {
                  path: '*',
                  component: () => <Redirect to='/rKSM/staker/index' />,
                },
              ],
            },
            {
              id: 'RKSM_validator',
              type: 'Validator',
              path: '/rKSM/validator',
              rSymbol: rSymbol.Ksm,
              component: authorizedRoute(Symbol.Ksm)(RKSMValidator),
            },
            {
              id: 'RKSM_search',
              path: '/rKSM/search',
              rSymbol: rSymbol.Ksm,
              component: authorizedRoute(Symbol.Ksm)(RKSMSeach),
            },
            {
              id: 'RKSM_type',
              path: '/rKSM/type',
              rSymbol: rSymbol.Ksm,
              component: authorizedRoute(Symbol.Ksm)(RKSMType),
            },
            {
              path: '*',
              component: () => <Redirect to='/rKSM/home' />,
            },
          ],
        },
        {
          id: 'RATOM_index',
          path: '/rATOM',
          type: 'rATOM',
          rSymbol: rSymbol.Atom,
          component: RATOMHomeTemplate,
          routes: [
            {
              id: 'RATOM_home',
              path: '/rATOM/home',
              rSymbol: rSymbol.Atom,
              component: RATOMHome,
            },
            {
              id: 'RATOM_wallet',
              path: '/rATOM/wallet',
              rSymbol: rSymbol.Atom,
              component: RATOMWallet,
            },
            {
              id: 'RATOM_wallet',
              path: '/rATOM/fiswallet',
              rSymbol: rSymbol.Atom,
              component: RATOMWalletFIS,
            },
            {
              id: 'RATOM_staker',
              type: 'Staker',
              path: '/rATOM/staker',
              rSymbol: rSymbol.Atom,
              component: authorizedRoute(Symbol.Atom)(RATOMStaker),
              routes: [
                {
                  id: 'RATOM_staker_index',
                  path: '/rATOM/staker/index',
                  type: 'Staker',
                  rSymbol: rSymbol.Atom,
                  component: RATOMStakerIndex,
                },
                {
                  id: 'RATOM_staker_index_info',
                  path: '/rATOM/staker/info',
                  type: '-Status',
                  rSymbol: rSymbol.Atom,
                  component: RATOMStakerInfo,
                },
                {
                  id: 'RATOM_reward_index',
                  path: '/rATOM/staker/reward',
                  type: 'Staker',
                  rSymbol: rSymbol.Atom,
                  component: RATOMStakerReward,
                },
                {
                  id: 'RATOM_reward_unbond',
                  path: '/rATOM/staker/unbondRecords',
                  type: 'Staker',
                  rSymbol: rSymbol.Atom,
                  component: RATOMStakerUnbondRecords,
                },
                {
                  id: 'RATOM_staker_index_redeem',
                  path: '/rATOM/staker/redeem',
                  type: 'Staker',
                  rSymbol: rSymbol.Atom,
                  component: RATOMStakerRedeem,
                },
                {
                  path: '*',
                  component: () => <Redirect to='/rATOM/staker/index' />,
                },
              ],
            },
            {
              id: 'RATOM_validator',
              type: 'Validator',
              path: '/rATOM/validator',
              rSymbol: rSymbol.Atom,
              component: authorizedRoute(Symbol.Atom)(RATOMValidator),
            },
            {
              id: 'RATOM_search',
              path: '/rATOM/search',
              rSymbol: rSymbol.Atom,
              component: authorizedRoute(Symbol.Atom)(RATOMSeach),
            },
            {
              id: 'RATOM_type',
              path: '/rATOM/type',
              rSymbol: rSymbol.Atom,
              component: authorizedRoute(Symbol.Atom)(RATOMType),
            },
            {
              path: '*',
              component: () => <Redirect to='/rATOM/home' />,
            },
          ],
        },
        {
          id: 'rAsset_template',
          path: '/rAsset',
          type: 'rAsset',
          component: RAssetTemplate,
          routes: [
            {
              id: 'rAsset_home',
              path: '/rAsset/home/:selectedPlatform/:rTokenPlatform?',
              component: RAssetHome,
            },
            {
              id: 'rAssect_swap',
              path: '/rAsset/swap/:fromType/:destType',
              component: RAssetSwap,
            },
            {
              path: '*',
              component: () => <Redirect to='/rAsset/home/native' />,
            },
          ],
        },
        {
          id: 'rSWAP_home',
          path: '/rSwap',
          type: 'rSWAP',
          component: RSWAPHome,
          routes: [
            {
              id: 'rSWAP_home',
              path: '/rSwap/home',
              component: RSWAPHome,
            },
            {
              path: '*',
              component: () => <Redirect to='/rSwap/home' />,
            },
          ],
        },
        {
          id: 'fee_station',
          path: '/feeStation',
          type: 'feeStation',
          component: FeeStationTemplate,
          routes: [
            {
              id: 'fee_station',
              path: '/feeStation/:tokenType',
              component: FeeStation,
            },
            {
              path: '*',
              component: () => <Redirect to='/feeStation/default' />,
            },
          ],
        },
        {
          id: 'RSOL_home',
          path: '/rSOL',
          type: 'rSOL',
          rSymbol: rSymbol.Sol,
          component: RSOLHomeTemplate,
          routes: [
            {
              id: 'RSOL_home',
              path: '/rSOL/home',
              rSymbol: rSymbol.Sol,
              component: RSOLHome,
            },
            {
              id: 'RSOL_wallet',
              path: '/rSOL/wallet',
              rSymbol: rSymbol.Sol,
              component: RSOLWallet,
            },
            {
              id: 'RSOL_wallet',
              path: '/rSOL/fiswallet',
              rSymbol: rSymbol.Sol,
              component: RSOLWalletFIS,
            },
            {
              id: 'RSOL_staker',
              type: 'Staker',
              path: '/rSOL/staker',
              rSymbol: rSymbol.Sol,
              component: authorizedRoute(Symbol.Sol)(RSOLStaker),
              routes: [
                {
                  id: 'RSOL_staker_index',
                  path: '/rSOL/staker/index',
                  type: 'Staker',
                  rSymbol: rSymbol.Sol,
                  component: RSOLStakerIndex,
                },
                {
                  id: 'RSOL_staker_index_info',
                  path: '/rSOL/staker/info',
                  type: '-Status',
                  rSymbol: rSymbol.Sol,
                  component: RSOLStakerInfo,
                },
                {
                  id: 'RSOL_staker_index_redeem',
                  path: '/rSOL/staker/redeem',
                  type: 'Staker',
                  rSymbol: rSymbol.Sol,
                  component: RSOLStakerRedeem,
                },
                {
                  id: 'RSOL_reward_index',
                  path: '/rSOL/staker/reward',
                  type: 'Staker',
                  rSymbol: rSymbol.Sol,
                  component: RSOLStakerReward,
                },
                {
                  id: 'RSOL_reward_unbond',
                  path: '/rSOL/staker/unbondRecords',
                  type: 'Staker',
                  rSymbol: rSymbol.Sol,
                  component: RSOLStakerUnbondRecords,
                },
                {
                  path: '*',
                  component: () => <Redirect to='/rSOL/staker/index' />,
                },
              ],
            },
            {
              id: 'RSOL_validator',
              type: 'Validator',
              path: '/rSOL/validator',
              rSymbol: rSymbol.Sol,
              component: authorizedRoute(Symbol.Sol)(RSOLValidator),
            },
            {
              id: 'RSOL_search',
              path: '/rSOL/search',
              rSymbol: rSymbol.Sol,
              component: authorizedRoute(Symbol.Sol)(RSOLSeach),
            },
            {
              id: 'RSOL_type',
              path: '/rSOL/type',
              rSymbol: rSymbol.Sol,
              component: authorizedRoute(Symbol.Sol)(RSOLType),
            },
            {
              path: '*',
              component: () => <Redirect to='/rSOL/home' />,
            },
          ],
        },
        {
          id: 'RPool_index',
          path: '/rPool',
          type: 'rPool',
          // rSymbol:rSymbol.Atom,
          component: RPoolHomeTemplate,
          routes: [
            {
              id: 'RPool_home',
              path: '/rPool/home',
              // width:993,
              className: 'stafi_content_full',
              // rSymbol:rSymbol.Atom,
              component: RPoolHome,
            },
            {
              id: 'RPool_staker',
              type: 'Staker',
              path: '/rPool/staker',
              rSymbol: rSymbol.Dot,
              component: RPoolStaker,
              routes: [
                {
                  id: 'RPool_reward_index',
                  path: '/rPool/staker/reward',
                  type: 'Staker',
                  component: RPoolStakerReward,
                },
                {
                  id: 'RPool_insurance_index',
                  path: '/rPool/staker/insurance',
                  type: 'Staker',
                  component: RPoolStakerInsurance,
                },
                {
                  id: 'RPool_status_index',
                  path: '/rPool/staker/status',
                  type: 'Staker',
                  component: RPoolStakerStatus,
                  routes: [
                    {
                      id: 'RPool_status_native_index',
                      path: '/rPool/staker/status/native',
                      type: 'Staker',
                      component: RPoolStakerStatusNative,
                    },
                    {
                      id: 'RPool_status_erc20_index',
                      path: '/rPool/staker/status/erc20',
                      type: 'Staker',
                      component: RPoolStakerStatusNativeErc20,
                    },
                    {
                      path: '*',
                      component: () => <Redirect to='/rPool/staker/status/native' />,
                    },
                  ],
                },
              ],
            },
            {
              id: 'RPool_Mint_Overview',
              path: '/rPool/mint/:tokenSymbol/:cycle',
              className: 'stafi_content_large',
              component: MintOverview,
            },
            {
              id: 'RPool_Liquidity_Overview',
              path: '/rPool/lp/:lpPlatform/:poolIndex/:lpContract',
              className: 'stafi_content_large',
              component: LiquidityOverview,
            },
            {
              path: '*',
              component: () => <Redirect to='/rPool/home?tab=mp' />,
            },
          ],
        },
        {
          id: 'RMATIC_index',
          path: '/rMATIC',
          type: 'rMATIC',
          rSymbol: rSymbol.Matic,
          component: RMaticHomeTemplate,
          routes: [
            {
              id: 'RMATIC_home',
              path: '/rMATIC/home',
              rSymbol: rSymbol.Matic,
              component: RMaticHome,
            },
            {
              id: 'RMATIC_wallet',
              path: '/rMATIC/wallet',
              rSymbol: rSymbol.Matic,
              component: RMaticWallet,
            },
            {
              id: 'RMatic_wallet',
              path: '/rMATIC/fiswallet',
              rSymbol: rSymbol.Matic,
              component: RMaticWalletFIS,
            },
            {
              id: 'RMATIC_staker',
              type: 'Staker',
              path: '/rMATIC/staker',
              rSymbol: rSymbol.Matic,
              component: authorizedRoute(Symbol.Matic)(RMaticStaker),
              routes: [
                {
                  id: 'RMATIC_staker_index',
                  path: '/rMATIC/staker/index',
                  type: 'Staker',
                  rSymbol: rSymbol.Matic,
                  component: RMaticStakerIndex,
                },
                {
                  id: 'RMATIC_staker_index_info',
                  path: '/rMATIC/staker/info',
                  type: '-Status',
                  rSymbol: rSymbol.Matic,
                  component: RMaticStakerInfo,
                },
                {
                  id: 'RMATIC_reward_index',
                  path: '/rMATIC/staker/reward',
                  type: 'Staker',
                  rSymbol: rSymbol.Matic,
                  component: RMaticStakerReward,
                },
                {
                  id: 'RMATIC_reward_unbond',
                  path: '/rMATIC/staker/unbondRecords',
                  type: 'Staker',
                  rSymbol: rSymbol.Matic,
                  component: RMaticStakerUnbondRecords,
                },
                {
                  id: 'RMATIC_staker_index_redeem',
                  path: '/rMATIC/staker/redeem',
                  type: 'Staker',
                  rSymbol: rSymbol.Matic,
                  component: RMaticStakerRedeem,
                },
                {
                  path: '*',
                  component: () => <Redirect to='/rMATIC/staker/index' />,
                },
              ],
            },
            {
              id: 'RMATIC_validator',
              type: 'Validator',
              path: '/rMATIC/validator',
              rSymbol: rSymbol.Matic,
              component: authorizedRoute(Symbol.Matic)(RMaticValidator),
            },
            {
              id: 'RMATIC_search',
              path: '/rMATIC/search',
              rSymbol: rSymbol.Matic,
              component: authorizedRoute(Symbol.Matic)(RMaticSeach),
            },
            {
              id: 'RMATIC_type',
              path: '/rMATIC/type',
              rSymbol: rSymbol.Matic,
              component: authorizedRoute(Symbol.Matic)(RMaticType),
            },
            {
              path: '*',
              component: () => <Redirect to='/rMATIC/home' />,
            },
          ],
        },
        {
          id: 'RBNB_index',
          path: '/rBNB',
          type: 'rBNB',
          rSymbol: rSymbol.Bnb,
          component: RBnbHomeTemplate,
          routes: [
            {
              id: 'RBNB_home',
              path: '/rBNB/home',
              rSymbol: rSymbol.Bnb,
              component: RBnbHome,
            },
            {
              id: 'RBNB_wallet',
              path: '/rBNB/wallet',
              rSymbol: rSymbol.Bnb,
              component: RBnbWallet,
            },
            {
              id: 'RBnb_wallet',
              path: '/rBNB/fiswallet',
              rSymbol: rSymbol.Bnb,
              component: RBnbWalletFIS,
            },
            {
              id: 'RBNB_staker',
              type: 'Staker',
              path: '/rBNB/staker',
              rSymbol: rSymbol.Bnb,
              component: authorizedRoute(Symbol.Bnb)(RBnbStaker),
              routes: [
                {
                  id: 'RBNB_staker_index',
                  path: '/rBNB/staker/index',
                  type: 'Staker',
                  rSymbol: rSymbol.Bnb,
                  component: RBnbStakerIndex,
                },
                {
                  id: 'RBNB_staker_index_info',
                  path: '/rBNB/staker/info',
                  type: '-Status',
                  rSymbol: rSymbol.Bnb,
                  component: RBnbStakerInfo,
                },
                {
                  id: 'RBNB_reward_index',
                  path: '/rBNB/staker/reward',
                  type: 'Staker',
                  rSymbol: rSymbol.Bnb,
                  component: RBnbStakerReward,
                },
                {
                  id: 'RBNB_reward_unbond',
                  path: '/rBNB/staker/unbondRecords',
                  type: 'Staker',
                  rSymbol: rSymbol.Bnb,
                  component: RBnbStakerUnbondRecords,
                },
                {
                  id: 'RBNB_staker_index_redeem',
                  path: '/rBNB/staker/redeem',
                  type: 'Staker',
                  rSymbol: rSymbol.Bnb,
                  component: RBnbStakerRedeem,
                },
                {
                  path: '*',
                  component: () => <Redirect to='/rBNB/staker/index' />,
                },
              ],
            },
            {
              id: 'RBNB_validator',
              type: 'Validator',
              path: '/rBNB/validator',
              rSymbol: rSymbol.Bnb,
              component: authorizedRoute(Symbol.Bnb)(RBnbValidator),
            },
            {
              id: 'RBNB_search',
              path: '/rBNB/search',
              rSymbol: rSymbol.Bnb,
              component: authorizedRoute(Symbol.Bnb)(RBnbSeach),
            },
            {
              id: 'RBNB_type',
              path: '/rBNB/type',
              rSymbol: rSymbol.Bnb,
              component: authorizedRoute(Symbol.Bnb)(RBnbType),
            },
            {
              path: '*',
              component: () => <Redirect to='/rBNB/home' />,
            },
          ],
        },
        {
          id: 'RFIS_template',
          path: '/rFIS',
          type: 'rFIS',
          rSymbol: rSymbol.Fis,
          component: RFISHomeTemplate,
          routes: [
            {
              id: 'RFIS_home',
              path: '/rFIS/home',
              rSymbol: rSymbol.Fis,
              component: RFISHome,
            },
            {
              id: 'RFIS_wallet',
              path: '/rFIS/fiswallet',
              rSymbol: rSymbol.Fis,
              component: RFISWalletFIS,
            },
            {
              id: 'RFIS_type',
              path: '/rFIS/type',
              rSymbol: rSymbol.Atom,
              component: authorizedRoute(Symbol.Fis)(RFISType),
            },
            {
              id: 'RFIS_staker',
              type: 'Staker',
              path: '/rFIS/staker',
              rSymbol: rSymbol.Fis,
              component: authorizedRoute(Symbol.Fis)(RFISStaker),
              routes: [
                {
                  id: 'RFIS_staker_index',
                  path: '/rFIS/staker/index',
                  type: 'Staker',
                  rSymbol: rSymbol.Fis,
                  component: RFISStakerIndex,
                },
                {
                  id: 'RFIS_staker_index_info',
                  path: '/rFIS/staker/info',
                  type: '-Status',
                  rSymbol: rSymbol.Fis,
                  component: RFISStakerInfo,
                },
                {
                  id: 'RFIS_staker_index_redeem',
                  path: '/rFIS/staker/redeem',
                  type: 'Staker',
                  rSymbol: rSymbol.Fis,
                  component: RFISStakerRedeem,
                },
                {
                  id: 'RFIS_staker_index_redeem',
                  path: '/rFIS/staker/reward',
                  type: 'Staker',
                  rSymbol: rSymbol.Fis,
                  component: RFISStakerReward,
                },
                {
                  id: 'RFIS_staker_index_redeem',
                  path: '/rFIS/staker/unbondRecords',
                  type: 'Staker',
                  rSymbol: rSymbol.Fis,
                  component: RFISStakerUnbondRecords,
                },
                {
                  path: '*',
                  component: () => <Redirect to='/rFIS/staker/index' />,
                },
              ],
            },
            {
              id: 'RFIS_validator',
              type: 'Validator',
              path: '/rFIS/validator',
              rSymbol: rSymbol.Fis,
              component: authorizedRoute(Symbol.Fis)(RFISValidator),
              routes: [
                {
                  id: 'RFIS_validator_index_onboard',
                  path: '/rFIS/validator/onboard',
                  type: 'Validator',
                  rSymbol: rSymbol.Fis,
                  component: RFISValidatorOnboard,
                },
                {
                  id: 'RFIS_validator_index_onboard',
                  path: '/rFIS/validator/offboard',
                  type: 'Validator',
                  rSymbol: rSymbol.Fis,
                  component: RFISValidatorOffboard,
                },
                {
                  path: '*',
                  component: () => <Redirect to='/rFIS/validator/onboard' />,
                },
              ],
            },
            {
              path: '*',
              component: () => <Redirect to='/rFIS/home' />,
            },
          ],
        },
        {
          path: '*',
          component: () => <Redirect to='/rAsset/home' />,
        },
      ],
    },
  ];

  return renderRoutes(routes);
};

export default routesFactory;
