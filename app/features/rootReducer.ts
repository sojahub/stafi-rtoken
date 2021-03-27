import { combineReducers } from 'redux';
import { History,createBrowserHistory } from 'history'; 
import globalReducer from './globalClice';
import rDOTReducer from './rDOTClice';
import FISReducer from './FISClice'; 
import noticeReducer from './noticeClice'; 
import {connectRouter} from 'connected-react-router'; 
import rAssetReducer from './rAssetClice'
import rETHReducer from './rETHClice'
export default function createRootReducer(history?: History) {
  return combineReducers({ 
    globalModule:globalReducer,
    rDOTModule:rDOTReducer,
    FISModule:FISReducer, 
    noticeModule:noticeReducer,
    router:connectRouter(history),
    rAssetModule:rAssetReducer,
    rETHModule:rETHReducer
  });
}