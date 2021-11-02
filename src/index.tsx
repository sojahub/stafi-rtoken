import { initAnalytics } from '@util/analyticsUtil';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

initAnalytics();

const Div: any = <App />;
ReactDOM.render(Div, document.getElementById('root'));
