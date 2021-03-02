import { combineReducers } from 'redux';
import { History,createBrowserHistory } from 'history'; 
import globalReducer from './globalClice';
import rDOTReducer from './rDOTClice';
import FISReducer from './FISClice'; 
import {connectRouter} from 'connected-react-router'; 
export default function createRootReducer(history?: History) {
  return combineReducers({ 
    globalModule:globalReducer,
    rDOTModule:rDOTReducer,
    FISModule:FISReducer, 
    router:connectRouter(history)
  });
}