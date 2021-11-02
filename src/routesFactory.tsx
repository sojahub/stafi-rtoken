import React from 'react';
import { renderRoutes } from 'react-router-config';
import { Redirect } from 'react-router-dom';
import authorizedRoute from 'src/components/route/authorizedRoute';
import { rSymbol, Symbol } from 'src/keyring/defaults';
import HomeTemplate from './pages/template/homeTemplate';

// const HomeTemplate = React.lazy(() => import('./pages/template/homeTemplate'));

const FeeStationTemplate = React.lazy(() => import('src/servers/feeStation/template'));
const FeeStation = React.lazy(() => import('./pages/feeStation/FeeStation'));

const RAssetHome = React.lazy(() => import('./pages/rAsset/home/index'));
const RAssetBep = React.lazy(() => import('./pages/rAsset/home/bep'));
const RAssetErc = React.lazy(() => import('./pages/rAsset/home/erc'));
const RAssetNative = React.lazy(() => import('./pages/rAsset/home/native'));
const RAssetSwap = React.lazy(() => import('./pages/rAsset/swap'));
const RAssetTemplate = React.lazy(() => import('./pages/rAsset/template'));

const RPoolHome = React.lazy(() => import('./pages/rPool/home'));
const RPoolStaker = React.lazy(() => import('./pages/rPool/staker'));
const RPoolStakerInsurance = React.lazy(() => import('./pages/rPool/staker/insurance'));
const RPoolStakerReward = React.lazy(() => import('./pages/rPool/staker/reward'));
const RPoolStakerStatus = React.lazy(() => import('./pages/rPool/staker/status'));
const RPoolStakerStatusNativeErc20 = React.lazy(() => import('./pages/rPool/staker/status/erc20'));
const RPoolStakerStatusNative = React.lazy(() => import('./pages/rPool/staker/status/native'));
const RPoolHomeTemplate = React.lazy(() => import('./pages/rPool/template'));
const LiquidityOverview = React.lazy(() => import('./pages/rPool/LiquidityOverview'));
const MintOverview = React.lazy(() => import('./pages/rPool/mint'));

const RETHHome = React.lazy(() => import('./pages/rETH/home'));
const RETHLiquefy = React.lazy(() => import('./pages/rETH/liquefy'));
const RETHPoolStatus = React.lazy(() => import('./pages/rETH/poolStatus'));
const RETHType = React.lazy(() => import('./pages/rETH/selectType'));
const RETHStaker = React.lazy(() => import('./pages/rETH/staker'));
const RETHStakerIndex = React.lazy(() => import('./pages/rETH/staker/home'));
const RETHStakerInfo = React.lazy(() => import('./pages/rETH/staker/info'));
const RETHStakerReward = React.lazy(() => import('./pages/rETH/staker/reward'));
const ETHHomeTemplate = React.lazy(() => import('./pages/rETH/template'));
const RETHValidator = React.lazy(() => import('./pages/rETH/validator'));
const RETHValidatorDeposit = React.lazy(() => import('./pages/rETH/validator/deposit'));
const RETHValidatorHome = React.lazy(() => import('./pages/rETH/validator/home/validatorContent'));
const RETHPoolContract = React.lazy(() => import('./pages/rETH/validator/poolContract'));
const RETHValidatorStake = React.lazy(() => import('./pages/rETH/validator/stake'));
const RETHValidatorStatus = React.lazy(() => import('./pages/rETH/validator/status'));

const RFISHome = React.lazy(() => import('./pages/rFIS/home'));
const RFISType = React.lazy(() => import('./pages/rFIS/selectType'));
const RFISWalletFIS = React.lazy(() => import('./pages/rFIS/selectWallet_rFIS'));
const RFISStaker = React.lazy(() => import('./pages/rFIS/staker'));
const RFISStakerIndex = React.lazy(() => import('./pages/rFIS/staker/home'));
const RFISStakerInfo = React.lazy(() => import('./pages/rFIS/staker/info'));
const RFISStakerRedeem = React.lazy(() => import('./pages/rFIS/staker/redeem'));
const RFISStakerReward = React.lazy(() => import('./pages/rFIS/staker/reward'));
const RFISHomeTemplate = React.lazy(() => import('./pages/rFIS/template'));
const RFISValidator = React.lazy(() => import('./pages/rFIS/validator'));
const RFISValidatorOffboard = React.lazy(() => import('./pages/rFIS/validator/offboard'));
const RFISValidatorOnboard = React.lazy(() => import('./pages/rFIS/validator/onboard'));

const RBnbHome = React.lazy(() => import('./pages/rBNB/home'));
const RBnbSeach = React.lazy(() => import('./pages/rBNB/search'));
const RBnbType = React.lazy(() => import('./pages/rBNB/selectType'));
const RBnbWallet = React.lazy(() => import('./pages/rBNB/selectWallet'));
const RBnbWalletFIS = React.lazy(() => import('./pages/rBNB/selectWallet_rFIS'));
const RBnbStaker = React.lazy(() => import('./pages/rBNB/staker'));
const RBnbStakerIndex = React.lazy(() => import('./pages/rBNB/staker/home'));
const RBnbStakerInfo = React.lazy(() => import('./pages/rBNB/staker/info'));
const RBnbStakerRedeem = React.lazy(() => import('./pages/rBNB/staker/redeem'));
const RBnbStakerReward = React.lazy(() => import('./pages/rBNB/staker/reward'));
const RBnbHomeTemplate = React.lazy(() => import('./pages/rBNB/template'));
const RBnbValidator = React.lazy(() => import('./pages/rBNB/validator'));

const RDOTHome = React.lazy(() => import('./pages/rDOT/home'));
const RDOTSeach = React.lazy(() => import('./pages/rDOT/search'));
const RDOTType = React.lazy(() => import('./pages/rDOT/selectType'));
const RDOTWallet = React.lazy(() => import('./pages/rDOT/selectWallet'));
const RDOTWalletFIS = React.lazy(() => import('./pages/rDOT/selectWallet_rFIS'));
const RDOTStaker = React.lazy(() => import('./pages/rDOT/staker'));
const RDOTStakerIndex = React.lazy(() => import('./pages/rDOT/staker/home'));
const RDOTStakerInfo = React.lazy(() => import('./pages/rDOT/staker/info'));
const RDOTStakerRedeem = React.lazy(() => import('./pages/rDOT/staker/redeem'));
const RDOTStakerReward = React.lazy(() => import('./pages/rDOT/staker/reward'));
const DOTHomeTemplate = React.lazy(() => import('./pages/rDOT/template'));
const RDOTValidator = React.lazy(() => import('./pages/rDOT/validator'));

const RATOMHome = React.lazy(() => import('./pages/rATOM/home'));
const RATOMSeach = React.lazy(() => import('./pages/rATOM/search'));
const RATOMType = React.lazy(() => import('./pages/rATOM/selectType'));
const RATOMWallet = React.lazy(() => import('./pages/rATOM/selectWallet'));
const RATOMWalletFIS = React.lazy(() => import('./pages/rATOM/selectWallet_rFIS'));
const RATOMStaker = React.lazy(() => import('./pages/rATOM/staker'));
const RATOMStakerIndex = React.lazy(() => import('./pages/rATOM/staker/home'));
const RATOMStakerInfo = React.lazy(() => import('./pages/rATOM/staker/info'));
const RATOMStakerRedeem = React.lazy(() => import('./pages/rATOM/staker/redeem'));
const RATOMStakerReward = React.lazy(() => import('./pages/rATOM/staker/reward'));
const RATOMHomeTemplate = React.lazy(() => import('./pages/rATOM/template'));
const RATOMValidator = React.lazy(() => import('./pages/rATOM/validator'));

const RMaticHome = React.lazy(() => import('./pages/rMATIC/home'));
const RMaticSeach = React.lazy(() => import('./pages/rMATIC/search'));
const RMaticType = React.lazy(() => import('./pages/rMATIC/selectType'));
const RMaticWallet = React.lazy(() => import('./pages/rMATIC/selectWallet'));
const RMaticWalletFIS = React.lazy(() => import('./pages/rMATIC/selectWallet_rFIS'));
const RMaticStaker = React.lazy(() => import('./pages/rMATIC/staker'));
const RMaticStakerIndex = React.lazy(() => import('./pages/rMATIC/staker/home'));
const RMaticStakerInfo = React.lazy(() => import('./pages/rMATIC/staker/info'));
const RMaticStakerRedeem = React.lazy(() => import('./pages/rMATIC/staker/redeem'));
const RMaticStakerReward = React.lazy(() => import('./pages/rMATIC/staker/reward'));
const RMaticHomeTemplate = React.lazy(() => import('./pages/rMATIC/template'));
const RMaticValidator = React.lazy(() => import('./pages/rMATIC/validator'));

const RKSMHome = React.lazy(() => import('./pages/rKSM/home'));
const RKSMSeach = React.lazy(() => import('./pages/rKSM/search'));
const RKSMType = React.lazy(() => import('./pages/rKSM/selectType'));
const RKSMWallet = React.lazy(() => import('./pages/rKSM/selectWallet'));
const RKSMWalletFIS = React.lazy(() => import('./pages/rKSM/selectWallet_rFIS'));
const RKSMStaker = React.lazy(() => import('./pages/rKSM/staker'));
const RKSMStakerIndex = React.lazy(() => import('./pages/rKSM/staker/home'));
const RKSMStakerInfo = React.lazy(() => import('./pages/rKSM/staker/info'));
const RKSMStakerRedeem = React.lazy(() => import('./pages/rKSM/staker/redeem'));
const RKSMStakerReward = React.lazy(() => import('./pages/rKSM/staker/reward'));
const RKSMHomeTemplate = React.lazy(() => import('./pages/rKSM/template'));
const RKSMValidator = React.lazy(() => import('./pages/rKSM/validator'));

const RSOLHome = React.lazy(() => import('./pages/rSOL/home'));
const RSOLValidator = React.lazy(() => import('./pages/rSOL/validator'));
const RSOLHomeTemplate = React.lazy(() => import('./pages/rSOL/template'));
const RSOLStakerRedeem = React.lazy(() => import('./pages/rSOL/staker/redeem'));
const RSOLStakerReward = React.lazy(() => import('./pages/rSOL/staker/reward'));
const RSOLStakerInfo = React.lazy(() => import('./pages/rSOL/staker/info'));
const RSOLStakerIndex = React.lazy(() => import('./pages/rSOL/staker/home'));
const RSOLStaker = React.lazy(() => import('./pages/rSOL/staker'));
const RSOLWalletFIS = React.lazy(() => import('./pages/rSOL/selectWallet_rFIS'));
const RSOLWallet = React.lazy(() => import('./pages/rSOL/selectWallet'));
const RSOLType = React.lazy(() => import('./pages/rSOL/selectType'));
const RSOLSeach = React.lazy(() => import('./pages/rSOL/search'));

const RDEXHome = React.lazy(() => import('./pages/rDEX/home'));

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
                  component: RETHStakerReward,
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
          id: 'rDEX_home',
          path: '/rDEX',
          type: 'rDEX',
          component: RDEXHome,
          routes: [
            {
              id: 'rDEX_home',
              path: '/rDEX/home',
              component: RDEXHome,
            },
            {
              path: '*',
              component: () => <Redirect to='/rDEX/home' />,
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
                ,
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
