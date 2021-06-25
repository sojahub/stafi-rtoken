import { combineReducers } from 'redux';
import { History,createBrowserHistory } from 'history'; 
import globalReducer from './globalClice';
import rDOTReducer from './rDOTClice';
import rKSMReducer from './rKSMClice';
import FISReducer from './FISClice'; 
import noticeReducer from './noticeClice'; 
import {connectRouter} from 'connected-react-router'; 
import rAssetReducer from './rAssetClice'
import rETHReducer from './rETHClice';
import bridgeReducer from './bridgeClice';
import ETHReducer from './ETHClice';
import rATOMReducer from './rATOMClice';
import rPoolReducer from './rPoolClice';

export default function createRootReducer(history?: History) {
  return combineReducers({ 
    globalModule:globalReducer,
    rDOTModule:rDOTReducer,
    rKSMModule:rKSMReducer,
    FISModule:FISReducer, 
    noticeModule:noticeReducer,
    router:connectRouter(history),
    rAssetModule:rAssetReducer,
    rETHModule:rETHReducer,
    bridgeModule:bridgeReducer,
    ETHModule:ETHReducer,
    rATOMModule:rATOMReducer,
    rPoolModule:rPoolReducer
  });
}