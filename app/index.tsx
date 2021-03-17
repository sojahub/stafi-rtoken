import React from 'react';
import ReactDOM from 'react-dom'; 
import { configuredStore } from './store';  
import  './index.scss';
import App from './app'; 

 
const Div:any=<App/>
ReactDOM.render(
    Div,
    document.getElementById('root')
)