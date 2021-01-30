import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { configuredStore } from './store'; 
import App from './app';
import  './index.scss';

const store = configuredStore();
const Div:any=<div> <App/>  </div> 
ReactDOM.render(
    Div,
    document.getElementById('root')
)