import { combineReducers } from 'redux';
import { History } from 'history'; 
import globalReducer from './globalClice'
export default function createRootReducer(history?: History) {
  return combineReducers({ 
    globalModule:globalReducer
  });
}