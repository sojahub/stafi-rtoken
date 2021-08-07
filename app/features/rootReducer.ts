import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { combineReducers } from 'redux';
import bridgeReducer from './bridgeClice';
import BSCReducer from './BSCClice';
import dexReducer from './dexClice';
import ETHReducer from './ETHClice';
import feeStationReducer from './feeStationClice';
import FISReducer from './FISClice';
import globalReducer from './globalClice';
import noticeReducer from './noticeClice';
import rAssetReducer from './rAssetClice';
import rATOMReducer from './rATOMClice';
import rDOTReducer from './rDOTClice';
import rETHReducer from './rETHClice';
import rKSMReducer from './rKSMClice';
import rMATICReducer from './rMATICClice';
import rPoolReducer from './rPoolClice';
import rSOLReducer from './rSOLClice';

export default function createRootReducer(history?: History) {
  return combineReducers({
    globalModule: globalReducer,
    rDOTModule: rDOTReducer,
    rKSMModule: rKSMReducer,
    rSOLModule: rSOLReducer,
    FISModule: FISReducer,
    noticeModule: noticeReducer,
    router: connectRouter(history),
    rAssetModule: rAssetReducer,
    rETHModule: rETHReducer,
    bridgeModule: bridgeReducer,
    ETHModule: ETHReducer,
    rATOMModule: rATOMReducer,
    rPoolModule: rPoolReducer,
    rMATICModule: rMATICReducer,
    BSCModule: BSCReducer,
    dexModule: dexReducer,
    feeStationModule: feeStationReducer,
  });
}
