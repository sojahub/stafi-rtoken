import React,{Fragment} from 'react';
import { BrowserRouter } from 'react-router-dom';
import routesFactory from './routesFactory';   
import {Provider} from 'react-redux'; 
import { configuredStore } from './store';
const store = configuredStore();
export default function Index(){ 
  return   <Provider store={store}>
    <Fragment> 
        <BrowserRouter> 
        {routesFactory()} 
        </BrowserRouter>  
    </Fragment>  
  </Provider>
}